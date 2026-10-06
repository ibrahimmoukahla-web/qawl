"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function deleteQuoteAction(formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return {
      error: "You must be logged in.",
    };
  }

  const quoteId = String(
    formData.get("quoteId") ?? "",
  ).trim();

  if (!quoteId) {
    return {
      error: "Quote ID is required.",
    };
  }

  // مهم جدًا:
  // نحذف فقط إذا كان الاقتباس مملوكًا للمستخدم الحالي
  const quote = await prisma.quote.findFirst({
    where: {
      id: quoteId,
      createdById: session.user.id,
    },
    select: {
      id: true,
    },
  });

  if (!quote) {
    return {
      error: "You cannot delete this quote.",
    };
  }

  await prisma.quote.delete({
    where: {
      id: quote.id,
    },
  });

  revalidatePath("/dashboard/quotes/my-quotes");
  revalidatePath("/dashboard/quotes");
  revalidatePath(`/dashboard/quotes/${quote.id}`);

  return {
    success: true,
  };
}
export async function updateQuoteAction(
  _prevState: {
    error?: string;
  },
  formData: FormData,
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return {
      error: "You must be logged in.",
    };
  }

  const quoteId = String(
    formData.get("quoteId") ?? "",
  ).trim();

  const text = String(
    formData.get("text") ?? "",
  ).trim();

  const authorId =
    String(
      formData.get("authorId") ?? "",
    ).trim() || null;

  const categoryId =
    String(
      formData.get("categoryId") ?? "",
    ).trim() || null;

  const source =
    String(
      formData.get("source") ?? "",
    ).trim() || null;

  const sourceUrl =
    String(
      formData.get("sourceUrl") ?? "",
    ).trim() || null;

  const status = String(
    formData.get("status") ?? "PUBLISHED",
  );

  const tagIds = Array.from(
    new Set(
      formData
        .getAll("tagIds")
        .map(String)
        .filter(Boolean),
    ),
  );

  if (!quoteId) {
    return {
      error: "Quote ID is missing.",
    };
  }

  if (!text) {
    return {
      error: "Quote text is required.",
    };
  }

  if (
    !["DRAFT", "PUBLISHED", "ARCHIVED"].includes(
      status,
    )
  ) {
    return {
      error: "Invalid quote status.",
    };
  }

  // تأكد أن الاقتباس يعود للمستخدم الحالي
  const quote = await prisma.quote.findFirst({
    where: {
      id: quoteId,
      createdById: session.user.id,
    },

    select: {
      id: true,
    },
  });

  if (!quote) {
    return {
      error: "You cannot edit this quote.",
    };
  }

  try {
    await prisma.$transaction(async (tx) => {
      await tx.quote.update({
        where: {
          id: quoteId,
        },

        data: {
          text,
          authorId,
          categoryId,
          source,
          sourceUrl,
          status:
            status as
              | "DRAFT"
              | "PUBLISHED"
              | "ARCHIVED",
        },
      });

      // حذف الـ tags القديمة
      await tx.quoteTag.deleteMany({
        where: {
          quoteId,
        },
      });

      // إضافة الـ tags الجديدة
      if (tagIds.length > 0) {
        await tx.quoteTag.createMany({
          data: tagIds.map((tagId) => ({
            quoteId,
            tagId,
          })),
        });
      }
    });
  } catch (error) {
    console.error("UPDATE QUOTE ERROR:", error);

    return {
      error:
        "Something went wrong while updating the quote.",
    };
  }

  revalidatePath("/dashboard/quotes/my-quotes");
  revalidatePath("/dashboard/quotes");
  revalidatePath(`/dashboard/quotes/${quoteId}`);
  revalidatePath(`/dashboard/quotes/${quoteId}/edit`);

  redirect(`/dashboard/quotes/${quoteId}`);
}