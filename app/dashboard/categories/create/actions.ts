"use server";

import { headers } from "next/headers";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export type CategoryFormState = {
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

export async function createCategoryAction(
  _prevState: CategoryFormState,
  formData: FormData,
): Promise<CategoryFormState> {
  try {
    const session =
      await auth.api.getSession({
        headers: await headers(),
      });

    if (!session) {
      return {
        error: "You must be logged in.",
      };
    }

    const role =
      (
        session.user as typeof session.user & {
          role?: string;
        }
      ).role ?? "user";

    // if (role !== "admin") {
    //   return {
    //     error:
    //       "Only admins can create categories.",
    //   };
    // }

    const name = String(
      formData.get("name") ?? "",
    ).trim();

    const slugInput = String(
      formData.get("slug") ?? "",
    ).trim();

    const color = String(
      formData.get("color") ?? "",
    ).trim();

    if (!name) {
      return {
        error:
          "Category name is required.",
      };
    }

    const slug =
      createSlug(slugInput || name);

    if (!slug) {
      return {
        error:
          "A valid slug could not be created.",
      };
    }

    await prisma.category.create({
      data: {
        name,
        slug,
        color: color || "#8B5CF6",
      },
    });

    return {
      success: true,
    };
  } catch (error: any) {
    console.error(
      "CREATE CATEGORY ERROR:",
      error,
    );

    if (error?.code === "P2002") {
      return {
        error:
          "This category slug already exists.",
      };
    }

    return {
      error:
        "Something went wrong while creating the category.",
    };
  }
}