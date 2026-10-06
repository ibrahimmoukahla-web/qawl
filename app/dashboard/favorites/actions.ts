"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function removeFavorite(quoteId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return {
      success: false,
      message: "Not authenticated",
    };
  }

  await prisma.favorite.delete({
    where: {
      userId_quoteId: {
        userId: session.user.id,
        quoteId,
      },
    },
  });

  revalidatePath("/dashboard/favorites");

  return {
    success: true,
  };
}