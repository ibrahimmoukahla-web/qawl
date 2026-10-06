"use server";

import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// ============================================================
// TOGGLE QUOTE LIKE
// ============================================================

export async function toggleQuoteLike(
quoteId: string,
) {
// ----------------------------------------------------------
// GET CURRENT USER
// ----------------------------------------------------------

const session =
await auth.api.getSession({
headers: await headers(),
});

if (!session?.user?.id) {
throw new Error(
"You must be logged in.",
);
}

const userId = session.user.id;

// ----------------------------------------------------------
// CHECK QUOTE
// ----------------------------------------------------------

const quote =
await prisma.quote.findUnique({
where: {
id: quoteId,
},


  select: {
    id: true,
  },
});


if (!quote) {
throw new Error(
"Quote not found.",
);
}

// ----------------------------------------------------------
// FIND EXISTING LIKE
// ----------------------------------------------------------

const existingLike =
await prisma.quoteInteraction.findFirst({
where: {
userId,
quoteId,
type: "LIKE",
},


  select: {
    id: true,
  },
});


// ----------------------------------------------------------
// REMOVE LIKE
// ----------------------------------------------------------

if (existingLike) {
await prisma.quoteInteraction.delete({
where: {
id: existingLike.id,
},
});
}

// ----------------------------------------------------------
// ADD LIKE
// ----------------------------------------------------------

else {
await prisma.quoteInteraction.create({
data: {
userId,
quoteId,
type: "LIKE",
},
});
}

// ----------------------------------------------------------
// GET UPDATED LIKE STATE + COUNT
// ----------------------------------------------------------

const [
likesCount,
currentLike,
] = await Promise.all([
prisma.quoteInteraction.count({
where: {
quoteId,
type: "LIKE",
},
}),


prisma.quoteInteraction.findFirst({
  where: {
    userId,
    quoteId,
    type: "LIKE",
  },

  select: {
    id: true,
  },
}),


]);

return {
liked: !!currentLike,
likesCount,
};
}

// ============================================================
// TOGGLE FAVORITE
// ============================================================

export async function toggleFavoriteAction(
quoteId: string,
) {
// ----------------------------------------------------------
// GET CURRENT USER
// ----------------------------------------------------------

const session =
await auth.api.getSession({
headers: await headers(),
});

if (!session?.user?.id) {
throw new Error(
"You must be logged in.",
);
}

const userId = session.user.id;

// ----------------------------------------------------------
// CHECK QUOTE
// ----------------------------------------------------------

const quote =
await prisma.quote.findUnique({
where: {
id: quoteId,
},


  select: {
    id: true,
  },
});


if (!quote) {
throw new Error(
"Quote not found.",
);
}

// ----------------------------------------------------------
// FIND EXISTING FAVORITE
//
// Favorite uses:
// @@id([userId, quoteId])
// ----------------------------------------------------------

const existingFavorite =
await prisma.favorite.findUnique({
where: {
userId_quoteId: {
userId,
quoteId,
},
},


  select: {
    userId: true,
    quoteId: true,
  },
});


// ----------------------------------------------------------
// REMOVE FAVORITE
// ----------------------------------------------------------

if (existingFavorite) {
await prisma.favorite.delete({
where: {
userId_quoteId: {
userId,
quoteId,
},
},
});


return {
  saved: false,
};


}

// ----------------------------------------------------------
// ADD FAVORITE
// ----------------------------------------------------------

await prisma.favorite.create({
data: {
userId,
quoteId,
},
});

return {
saved: true,
};
}
