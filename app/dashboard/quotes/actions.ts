"use server";

import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

async function getCurrentUser() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    throw new Error("You must be logged in.");
  }

  return session.user;
}

export async function toggleQuoteLike(
  quoteId: string,
) {
  const user = await getCurrentUser();

  const existingLike =
    await prisma.quoteInteraction.findFirst({
      where: {
        quoteId,
        userId: user.id,
        type: "LIKE",
      },
    });

  if (existingLike) {
    await prisma.quoteInteraction.delete({
      where: {
        id: existingLike.id,
      },
    });
  } else {
    await prisma.quoteInteraction.create({
      data: {
        quoteId,
        userId: user.id,
        type: "LIKE",
      },
    });
  }

  const likesCount =
    await prisma.quoteInteraction.count({
      where: {
        quoteId,
        type: "LIKE",
      },
    });

  return {
    liked: !existingLike,
    likesCount,
  };
}

export async function toggleQuoteFavorite(
  quoteId: string,
) {
  const user = await getCurrentUser();

  const existingFavorite =
    await prisma.favorite.findFirst({
      where: {
        quoteId,
        userId: user.id,
      },
    });

  if (existingFavorite) {
    await prisma.favorite.delete({
      where: {
        id: existingFavorite.id,
      },
    });
  } else {
    await prisma.favorite.create({
      data: {
        quoteId,
        userId: user.id,
      },
    });
  }

  return {
    saved: !existingFavorite,
  };
}