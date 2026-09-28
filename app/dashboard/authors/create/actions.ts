"use server";

import { headers } from "next/headers";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export type AuthorFormState = {
  error?: string;
  success?: boolean;
};

function createSlug(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(
      /[^\p{L}\p{N}\-_]+/gu,
      "",
    )
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export async function createAuthorAction(
  _prevState: AuthorFormState,
  formData: FormData,
): Promise<AuthorFormState> {
  try {
    // ============================================
    // SESSION
    // ============================================

    const session =
      await auth.api.getSession({
        headers: await headers(),
      });

    if (!session) {
      return {
        error: "You must be logged in.",
      };
    }

    // ============================================
    // ADMIN CHECK
    // ============================================

    const role =
      (
        session.user as typeof session.user & {
          role?: string;
        }
      ).role ?? "user";

    if (role !== "admin") {
      return {
        error: "Only admins can create authors.",
      };
    }

    // ============================================
    // FORM DATA
    // ============================================

    const name = String(
      formData.get("name") ?? "",
    ).trim();

    const slugInput = String(
      formData.get("slug") ?? "",
    ).trim();

    const bio = String(
      formData.get("bio") ?? "",
    ).trim();

    const imageUrl = String(
      formData.get("imageUrl") ?? "",
    ).trim();

    // ============================================
    // VALIDATION
    // ============================================

    if (!name) {
      return {
        error: "Author name is required.",
      };
    }

    const slug =
      createSlug(slugInput || name);

    if (!slug) {
      return {
        error: "A valid slug could not be created.",
      };
    }

    // ============================================
    // CREATE
    // ============================================

    await prisma.author.create({
      data: {
        name,
        slug,
        bio: bio || null,
        imageUrl: imageUrl || null,
      },
    });

    return {
      success: true,
    };
  } catch (error: any) {
    console.error(
      "CREATE AUTHOR ERROR:",
      error,
    );

    if (error?.code === "P2002") {
      return {
        error:
          "This author slug already exists.",
      };
    }

    return {
      error:
        "Something went wrong while creating the author.",
    };
  }
}