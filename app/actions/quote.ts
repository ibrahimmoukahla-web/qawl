"use server";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// ======================================
// LIKE
// ======================================

export async function toggleLike(quoteId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user.id) {
    return {
      success: false,
      reason: "UNAUTHENTICATED",
    };
  }

  const userId = session.user.id;

  const like = await prisma.quoteInteraction.findFirst({
    where: {
      userId,
      quoteId,
      type: "LIKE",
    },
  });

  if (like) {
    await prisma.quoteInteraction.delete({
      where: {
        id: like.id,
      },
    });

    return {
      success: true,
      liked: false,
    };
  }

  await prisma.quoteInteraction.create({
    data: {
      userId,
      quoteId,
      type: "LIKE",
    },
  });

  return {
    success: true,
    liked: true,
  };
}

// ======================================
// SAVE
// ======================================

export async function toggleFavorite(quoteId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user.id) {
    return {
      success: false,
      reason: "UNAUTHENTICATED",
    };
  }

  const userId = session.user.id;

  const favorite = await prisma.favorite.findUnique({
    where: {
      userId_quoteId: {
        userId,
        quoteId,
      },
    },
  });

  if (favorite) {
    await prisma.favorite.delete({
      where: {
        userId_quoteId: {
          userId,
          quoteId,
        },
      },
    });

    return {
      success: true,
      saved: false,
    };
  }

  await prisma.favorite.create({
    data: {
      userId,
      quoteId,
    },
  });

  return {
    success: true,
    saved: true,
  };
}

// ======================================
// SHARE
// ======================================

export async function recordShare(quoteId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  await prisma.quoteInteraction.create({
    data: {
      quoteId,
      userId: session?.user.id ?? null,
      type: "SHARE",
    },
  });

  return {
    success: true,
  };
}