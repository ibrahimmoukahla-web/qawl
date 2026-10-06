import Link from "next/link";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";

type Props = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function TagPage({ params }: Props) {
  const { slug } = await params;

  const tag = await prisma.tag.findUnique({
    where: {
      slug,
    },

    include: {
      quotes: {
        include: {
          quote: {
            select: {
              id: true,
              text: true,
              imageUrl: true,

              author: {
                select: {
                  id: true,
                  name: true,
                  slug: true,
                  imageUrl: true,
                },
              },
            },
          },
        },
      },

      _count: {
        select: {
          quotes: true,
        },
      },
    },
  });

  if (!tag) {
    notFound();
  }

  return (
    <main className="min-h-screen w-full px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard/tags"
          className="mb-4 inline-block text-sm text-gray-400 transition hover:text-white"
        >
          ← Back to Tags
        </Link>

        <div className="flex items-center gap-4">
          <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#8B5CF6]/15 text-lg font-semibold text-[#C084FC]">
            #
          </span>

          <div>
            <h1 className="text-3xl font-semibold text-white">
              #{tag.name}
            </h1>

            <p className="mt-1 text-sm text-gray-400">
              {tag._count.quotes}{" "}
              {tag._count.quotes === 1
                ? "quote"
                : "quotes"}
            </p>
          </div>
        </div>
      </div>

      {/* Empty */}
      {tag.quotes.length === 0 ? (
        <div className="flex min-h-[350px] items-center justify-center rounded-2xl border border-[#282e5c] bg-[#111634]">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-white">
              No quotes with this tag
            </h2>

            <p className="mt-2 text-sm text-gray-400">
              There are no quotes using this tag yet.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
          {tag.quotes.map((item) => {
            const quote = item.quote;

            return (
              <Link
                key={quote.id}
                href={`/dashboard/quotes/${quote.id}`}
                className="group rounded-2xl border border-[#282e5c] bg-[#111634] p-5 transition hover:-translate-y-1 hover:border-purple-500/50"
              >
                <p className="text-lg leading-8 text-white">
                  “{quote.text}”
                </p>

                {quote.author && (
                  <p className="mt-5 text-sm text-purple-400 group-hover:text-purple-300">
                    — {quote.author.name}
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}