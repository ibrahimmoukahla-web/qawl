"use server";

import { createHash } from "crypto";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { translateQuote } from "@/lib/translation";

type FormState = {
  error?: string;
  success?: boolean;
  quoteId?: string;
};

const allowedStatuses = [
  "DRAFT",
  "PUBLISHED",
  "ARCHIVED",
] as const;

type AllowedStatus =
  (typeof allowedStatuses)[number];

function isAllowedStatus(
  value: string,
): value is AllowedStatus {
  return allowedStatuses.includes(
    value as AllowedStatus,
  );
}

// =========================================================
// CLOUDINARY
// =========================================================

async function uploadToCloudinary(
  file: File,
): Promise<string> {
  if (file.size === 0) {
    throw new Error(
      "The selected image is empty.",
    );
  }

  if (!file.type.startsWith("image/")) {
    throw new Error(
      "Only image files are allowed.",
    );
  }

  // Application limit: 5 MB
  const maxSize =
    5 * 1024 * 1024;

  if (file.size > maxSize) {
    throw new Error(
      "Image must be smaller than 5MB.",
    );
  }

  const cloudName =
    process.env.CLOUDINARY_CLOUD_NAME;

  const apiKey =
    process.env.CLOUDINARY_API_KEY;

  const apiSecret =
    process.env.CLOUDINARY_API_SECRET;

  if (
    !cloudName ||
    !apiKey ||
    !apiSecret
  ) {
    throw new Error(
      "Cloudinary configuration is missing.",
    );
  }

  // =======================================================
  // CLOUDINARY SIGNATURE
  // =======================================================

  const timestamp =
    Math.floor(Date.now() / 1000);

  const folder =
    "qawl/quotes";

  /*
    Cloudinary signs the parameters
    alphabetically.

    folder
    timestamp
  */

  const signatureString =
    `folder=${folder}&timestamp=${timestamp}`;

  const signature =
    createHash("sha1")
      .update(
        signatureString + apiSecret,
      )
      .digest("hex");

  // =======================================================
  // FORM DATA
  // =======================================================

  const body = new FormData();

  body.append(
    "file",
    new Blob(
      [await file.arrayBuffer()],
      {
        type: file.type,
      },
    ),
  );

  body.append(
    "api_key",
    apiKey,
  );

  body.append(
    "timestamp",
    String(timestamp),
  );

  body.append(
    "folder",
    folder,
  );

  body.append(
    "signature",
    signature,
  );

  // =======================================================
  // REQUEST
  // =======================================================

  const response =
    await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body,
      },
    );

  if (!response.ok) {
    const message =
      await response.text();

    console.error(
      "Cloudinary error:",
      message,
    );

    throw new Error(
      "Cloudinary upload failed.",
    );
  }

  const result =
    (await response.json()) as {
      secure_url?: string;
    };

  if (!result.secure_url) {
    throw new Error(
      "Cloudinary did not return an image URL.",
    );
  }

  return result.secure_url;
}

// =========================================================
// CREATE QUOTE
// =========================================================

export async function createQuoteAction(
  previousState: FormState,
  formData: FormData,
): Promise<FormState> {
  try {
    // =====================================================
    // 1. SESSION
    // =====================================================

    const session =
      await auth.api.getSession({
        headers: await headers(),
      });

    if (!session) {
      return {
        error:
          "You must be logged in.",
      };
    }

    // =====================================================
    // 2. GET USER + ROLE + QUOTE LIMIT
    // =====================================================

    const user =
      await prisma.user.findUnique({
        where: {
          id: session.user.id,
        },

        select: {
          id: true,
          role: true,
          quoteLimit: true,
        },
      });

    if (!user) {
      return {
        error:
          "User account not found.",
      };
    }

    // =====================================================
    // 3. CHECK QUOTE CREATION LIMIT
    // =====================================================

    if (user.role !== "admin") {
      const createdQuotes =
        await prisma.quote.count({
          where: {
            createdById:
              user.id,
          },
        });

      if (
        createdQuotes >=
        user.quoteLimit
      ) {
        return {
          error:
            `You have reached your quote limit of ${user.quoteLimit}.`,
        };
      }
    }

    // =====================================================
    // 4. READ FORM DATA
    // =====================================================

    const text =
      String(
        formData.get("text") ?? "",
      ).trim();

    const authorId =
      String(
        formData.get("authorId") ?? "",
      ).trim();

    const categoryId =
      String(
        formData.get("categoryId") ?? "",
      ).trim();

    const source =
      String(
        formData.get("source") ?? "",
      ).trim();

    const sourceUrl =
      String(
        formData.get("sourceUrl") ?? "",
      ).trim();

    const status =
      String(
        formData.get("status") ??
          "PUBLISHED",
      ).trim();

    const image =
      formData.get("image");

    // getAll because one quote can have
    // multiple tags

    const tagIds = [
      ...new Set(
        formData
          .getAll("tagIds")
          .map((value) =>
            String(value).trim(),
          )
          .filter(Boolean),
      ),
    ];

    // =====================================================
    // 5. TEXT VALIDATION
    // =====================================================

    if (!text) {
      return {
        error:
          "Quote text is required.",
      };
    }

    // =====================================================
    // 6. STATUS VALIDATION
    // =====================================================

    if (
      !isAllowedStatus(status)
    ) {
      return {
        error:
          "Invalid quote status.",
      };
    }

    // =====================================================
    // 7. SOURCE URL VALIDATION
    // =====================================================

    if (sourceUrl) {
      try {
        const url =
          new URL(sourceUrl);

        if (
          url.protocol !==
            "http:" &&
          url.protocol !==
            "https:"
        ) {
          return {
            error:
              "Source URL must use http or https.",
          };
        }
      } catch {
        return {
          error:
            "Source URL is invalid.",
        };
      }
    }

    // =====================================================
    // 8. CHECK CATEGORY
    // =====================================================

    const finalCategoryId:
      string | null =
      categoryId || null;

    if (finalCategoryId) {
      const category =
        await prisma.category.findUnique(
          {
            where: {
              id:
                finalCategoryId,
            },

            select: {
              id: true,
            },
          },
        );

      if (!category) {
        return {
          error:
            "Selected category does not exist.",
        };
      }
    }

    // =====================================================
    // 9. CHECK AUTHOR
    // =====================================================

    const finalAuthorId:
      string | null =
      authorId || null;

    if (finalAuthorId) {
      const author =
        await prisma.author.findUnique(
          {
            where: {
              id:
                finalAuthorId,
            },

            select: {
              id: true,
            },
          },
        );

      if (!author) {
        return {
          error:
            "Selected author does not exist.",
        };
      }
    }

    // =====================================================
    // 10. CHECK TAGS
    // =====================================================

    if (tagIds.length > 0) {
      const existingTags =
        await prisma.tag.findMany({
          where: {
            id: {
              in: tagIds,
            },
          },

          select: {
            id: true,
          },
        });

      if (
        existingTags.length !==
        tagIds.length
      ) {
        return {
          error:
            "One or more selected tags do not exist.",
        };
      }
    }

    // =====================================================
    // 11. TRANSLATE QUOTE
    // =====================================================

    const translation =
      await translateQuote(text);

    // =====================================================
    // 12. IMAGE
    // =====================================================

    let imageUrl:
      string | null = null;

    if (
      image instanceof File &&
      image.size > 0
    ) {
      imageUrl =
        await uploadToCloudinary(
          image,
        );
    }

    // =====================================================
    // 13. CREATE QUOTE
    // =====================================================

    const quote =
      await prisma.quote.create({
        data: {
          // Original text
          text,

          // Automatic translations
          textEn:
            translation.textEn,

          textAr:
            translation.textAr,

          sourceLanguage:
            translation.sourceLanguage,

          imageUrl,

          authorId:
            finalAuthorId,

          categoryId:
            finalCategoryId,

          createdById:
            session.user.id,

          source:
            source || null,

          sourceUrl:
            sourceUrl || null,

          status,
        },

        select: {
          id: true,
        },
      });

    // =====================================================
    // 14. CREATE QUOTE ↔ TAG RELATIONS
    // =====================================================

    if (tagIds.length > 0) {
      await prisma.quoteTag.createMany(
        {
          data: tagIds.map(
            (tagId) => ({
              quoteId:
                quote.id,

              tagId,
            }),
          ),

          skipDuplicates: true,
        },
      );
    }

    // =====================================================
    // 15. REFRESH PAGES
    // =====================================================

    revalidatePath(
      "/dashboard/home",
    );

    revalidatePath(
      "/dashboard/quotes",
    );

    // =====================================================
    // 16. SUCCESS
    // =====================================================

    return {
      success: true,
      quoteId:
        quote.id,
    };
  } catch (error) {
    console.error(
      "CREATE_QUOTE_ERROR:",
      error,
    );

    return {
      error:
        error instanceof Error
          ? error.message
          : "Something went wrong while creating the quote.",
    };
  }
}