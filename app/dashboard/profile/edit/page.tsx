import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import EditProfileForm from "./EditProfileForm";

export default async function EditProfilePage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return <div>Not authenticated</div>;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
    select: {
      name: true,
      username: true,
      email: true,
      bio: true,
      image: true,
      coverImage: true,
      role: true,
      createdAt: true,
    },
  });

  if (!user) {
    return <div>User not found</div>;
  }

  return (
    <EditProfileForm
      user={{
        ...user,
        createdAt: user.createdAt.toISOString(),
      }}
    />
  );
}