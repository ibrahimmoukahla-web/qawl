import "server-only";

import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// ============================================================
// CURRENT USER
// ============================================================

export async function getCurrentUser() {
const session =
await auth.api.getSession({
headers: await headers(),
});

if (!session?.user?.id) {
return null;
}

const user =
await prisma.user.findUnique({
where: {
id: session.user.id,
},


  select: {
    id: true,
    name: true,
    email: true,
    role: true,
    quoteLimit: true,
  },
});


return user;
}

// ============================================================
// REQUIRE AUTHENTICATION
// ============================================================

export async function requireUser() {
const user =
await getCurrentUser();

if (!user) {
throw new Error(
"You must be logged in.",
);
}

return user;
}

// ============================================================
// REQUIRE ADMIN
// ============================================================

export async function requireAdmin() {
const user =
await requireUser();

if (user.role !== "admin") {
throw new Error(
"You do not have permission to perform this action.",
);
}

return user;
}

// ============================================================
// CHECK QUOTE CREATION LIMIT
// ============================================================

export async function canCreateQuote(
userId: string,
) {
const user =
await prisma.user.findUnique({
where: {
id: userId,
},


  select: {
    role: true,
    quoteLimit: true,
  },
});


if (!user) {
throw new Error(
"User not found.",
);
}

// ----------------------------------------------------------
// ADMIN = UNLIMITED
// ----------------------------------------------------------

if (user.role === "admin") {
return {
allowed: true,
limit: null,
used: null,
remaining: null,
isAdmin: true,
};
}

// ----------------------------------------------------------
// COUNT USER'S QUOTES
// ----------------------------------------------------------

const used =
await prisma.quote.count({
where: {
createdById: userId,
},
});

const remaining =
Math.max(
0,
user.quoteLimit - used,
);

return {
allowed:
used < user.quoteLimit,


limit: user.quoteLimit,

used,

remaining,

isAdmin: false,


};
}
