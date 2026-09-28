"use server";

import { headers } from "next/headers";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export type TagFormState = {
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

export async function createTagAction(
  _prevState: TagFormState,
  formData: FormData,
): Promise<TagFormState> {
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
    //     error: "Only admins can create tags.",
    //   };
    // }

    const name = String(
      formData.get("name") ?? "",
    ).trim();

    const slugInput = String(
      formData.get("slug") ?? "",
    ).trim();

    if (!name) {
      return {
        error: "Tag name is required.",
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

    await prisma.tag.create({
      data: {
        name,
        slug,
      },
    });

    return {
      success: true,
    };
  } catch (error: any) {
    console.error(
      "CREATE TAG ERROR:",
      error,
    );

    if (error?.code === "P2002") {
      return {
        error:
          "This tag slug already exists.",
      };
    }

    return {
      error:
        "Something went wrong while creating the tag.",
    };
  }
}