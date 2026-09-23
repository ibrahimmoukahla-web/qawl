"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { cloudinary } from "@/lib/cloudinary";

type UpdateProfileResult = {
  success: boolean;
  message: string;
};

async function uploadImage(
  file: File,
  publicId: string
): Promise<string> {
  if (!file || file.size === 0) {
    throw new Error("No image selected.");
  }

  if (!file.type.startsWith("image/")) {
    throw new Error("Only image files are allowed.");
  }

  if (file.size > 5 * 1024 * 1024) {
    throw new Error("Image must be smaller than 5MB.");
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        resource_type: "image",

        // نفس public_id في كل مرة
        public_id: publicId,

        // استبدال الصورة القديمة
        overwrite: true,

        // تحديث النسخ الموجودة في CDN
        invalidate: true,
      },

      (error, result) => {
        if (error || !result) {
          reject(
            error || new Error("Cloudinary upload failed.")
          );
          return;
        }

        resolve(result.secure_url);
      }
    );

    uploadStream.end(buffer);
  });
}

export async function updateProfile(
  formData: FormData
): Promise<UpdateProfileResult> {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session) {
      return {
        success: false,
        message: "Not authenticated.",
      };
    }

    const userId = session.user.id;

    const name = String(
      formData.get("name") || ""
    ).trim();

    const username = String(
      formData.get("username") || ""
    ).trim();

    const bio = String(
      formData.get("bio") || ""
    ).trim();

    const profileImage = formData.get("profileImage");
    const coverImage = formData.get("coverImage");

    if (!name) {
      return {
        success: false,
        message: "Name is required.",
      };
    }

    if (!username) {
      return {
        success: false,
        message: "Username is required.",
      };
    }

    if (username.length < 3) {
      return {
        success: false,
        message: "Username must be at least 3 characters.",
      };
    }

    const oldUser = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        image: true,
        coverImage: true,
      },
    });

    if (!oldUser) {
      return {
        success: false,
        message: "User not found.",
      };
    }

    let imageUrl = oldUser.image;
    let coverImageUrl = oldUser.coverImage;

    // ================= PROFILE IMAGE =================

    if (
      profileImage instanceof File &&
      profileImage.size > 0
    ) {
      imageUrl = await uploadImage(
        profileImage,
        `qawl/users/${userId}/profile`
      );
    }

    // ================= COVER IMAGE =================

    if (
      coverImage instanceof File &&
      coverImage.size > 0
    ) {
      coverImageUrl = await uploadImage(
        coverImage,
        `qawl/users/${userId}/cover`
      );
    }

    // ================= DATABASE =================

    await prisma.user.update({
      where: {
        id: userId,
      },

      data: {
        name,
        username,
        bio: bio || null,
        image: imageUrl,
        coverImage: coverImageUrl,
      },
    });

    revalidatePath("/profile");
    revalidatePath("/profile/edit");

    return {
      success: true,
      message: "Profile updated successfully.",
    };
  } catch (error: any) {
    console.error("UPDATE PROFILE ERROR:", error);

    if (error?.code === "P2002") {
      return {
        success: false,
        message: "This username is already taken.",
      };
    }

    return {
      success: false,
      message: "Failed to update profile.",
    };
  }
}