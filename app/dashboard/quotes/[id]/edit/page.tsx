import { notFound } from "next/navigation";
import { headers } from "next/headers";
import Link from "next/link";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import EditQuoteForm from "./EditQuoteForm";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditQuotePage({
  params,
}: Props) {
  const { id } = await params;

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-gray-400">
          Not authenticated
        </p>
      </main>
    );
  }

  const [quote, authors, categories, tags] =
    await Promise.all([
      prisma.quote.findFirst({
        where: {
          id,
          createdById: session.user.id,
        },

        select: {
          id: true,
          text: true,
          source: true,
          sourceUrl: true,
          status: true,
          authorId: true,
          categoryId: true,

          tags: {
            select: {
              tagId: true,
            },
          },
        },
      }),

      prisma.author.findMany({
        orderBy: {
          name: "asc",
        },
        select: {
          id: true,
          name: true,
        },
      }),

      prisma.category.findMany({
        orderBy: {
          name: "asc",
        },
        select: {
          id: true,
          name: true,
          color: true,
        },
      }),

      prisma.tag.findMany({
        orderBy: {
          name: "asc",
        },
        select: {
          id: true,
          name: true,
        },
      }),
    ]);

  if (!quote) {
    notFound();
  }

  return (
    <main className="min-h-screen w-full px-6 py-8">
      <div className="mx-auto max-w-3xl">
        <Link
          href={`/dashboard/quotes/${quote.id}`}
          className="mb-6 inline-block text-sm text-gray-400 transition hover:text-white"
        >
          ← Back to Quote
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-white">
            Edit Quote
          </h1>

          <p className="mt-2 text-sm text-gray-400">
            Update your quote information.
          </p>
        </div>

        <EditQuoteForm
          quote={{
            id: quote.id,
            text: quote.text,
            source: quote.source,
            sourceUrl: quote.sourceUrl,
            status: quote.status,
            authorId: quote.authorId,
            categoryId: quote.categoryId,
            tagIds: quote.tags.map((item) => item.tagId),
          }}
          authors={authors}
          categories={categories}
          tags={tags}
        />
      </div>
    </main>
  );
}