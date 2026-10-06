// app/dashboard/quotes/my-quotes/page.tsx

import Link from "next/link";
import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import DeleteQuoteButton from "./DeleteQuoteButton";

export default async function MyQuotesPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-gray-400">Not authenticated</p>
      </main>
    );
  }

  const quotes = await prisma.quote.findMany({
    where: {
      createdById: session.user.id,
    },

    orderBy: {
      createdAt: "desc",
    },

    select: {
      id: true,
      text: true,
      imageUrl: true,
      source: true,
      sourceUrl: true,
      status: true,
      createdAt: true,
      updatedAt: true,

      author: {
        select: {
          id: true,
          name: true,
          slug: true,
          imageUrl: true,
        },
      },

      category: {
        select: {
          id: true,
          name: true,
          slug: true,
          color: true,
        },
      },

      tags: {
        select: {
          tag: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
        },
      },

      _count: {
        select: {
          favorites: true,
          interactions: {
            where: {
              type: "LIKE",
            },
          },
        },
      },
    },
  });

  return (
    <main className="min-h-screen w-full px-6 py-8">
      {/* HEADER */}
      <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white">
            My Quotes
          </h1>

          <p className="mt-2 text-sm text-gray-400">
            Manage the quotes you created.
          </p>
        </div>

        <Link
          href="/dashboard/quotes/create"
          className="w-fit rounded-xl bg-[#8B5CF6] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#7C3AED]"
        >
          + Create Quote
        </Link>
      </div>

      {/* EMPTY */}
      {quotes.length === 0 ? (
        <div className="flex min-h-[450px] items-center justify-center rounded-3xl border border-[#282e5c]/60 bg-[#111634]">
          <div className="text-center">
            <div className="mb-4 text-5xl text-purple-400">
              ❝
            </div>

            <h2 className="text-xl font-semibold text-white">
              You have no quotes yet
            </h2>

            <p className="mt-2 text-sm text-gray-400">
              Create your first quote and it will appear here.
            </p>

            <Link
              href="/dashboard/quotes/create"
              className="mt-6 inline-block rounded-xl bg-[#8B5CF6] px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#7C3AED]"
            >
              Create Quote
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 xl:grid-cols-2">
          {quotes.map((quote) => (
            <article
              key={quote.id}
              className="rounded-3xl border border-[#282e5c]/60 bg-[#111634] p-5 transition hover:border-[#8B5CF6]/40"
            >
              {/* TOP */}
              <div className="mb-5 flex items-start justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  {quote.category && (
                    <span
                      className="rounded-full px-3 py-1 text-xs font-medium"
                      style={{
                        color: quote.category.color,
                        backgroundColor: `${quote.category.color}20`,
                      }}
                    >
                      {quote.category.name}
                    </span>
                  )}

                  <span
                    className={`
                      rounded-full px-3 py-1 text-xs font-medium
                      ${
                        quote.status === "PUBLISHED"
                          ? "bg-emerald-500/10 text-emerald-300"
                          : quote.status === "DRAFT"
                            ? "bg-amber-500/10 text-amber-300"
                            : "bg-gray-500/10 text-gray-400"
                      }
                    `}
                  >
                    {quote.status}
                  </span>
                </div>

                <span className="shrink-0 text-xs text-gray-500">
                  {new Intl.DateTimeFormat("en", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  }).format(quote.createdAt)}
                </span>
              </div>

              {/* QUOTE */}
              <Link
                href={`/dashboard/quotes/${quote.id}`}
                className="block"
              >
                <p className="text-xl leading-9 text-white transition hover:text-purple-100">
                  “{quote.text}”
                </p>
              </Link>

              {/* AUTHOR */}
              {quote.author && (
                <Link
                  href={`/dashboard/authors/${quote.author.slug}`}
                  className="mt-5 inline-block text-sm font-medium text-[#C084FC] transition hover:text-purple-300"
                >
                  — {quote.author.name}
                </Link>
              )}

              {/* TAGS */}
              {quote.tags.length > 0 && (
                <div className="mt-5 flex flex-wrap gap-2">
                  {quote.tags.map(({ tag }) => (
                    <Link
                      key={tag.id}
                      href={`/dashboard/tags/${tag.slug}`}
                      className="rounded-full bg-[#8B5CF6]/10 px-3 py-1 text-xs text-purple-300 transition hover:bg-[#8B5CF6]/20"
                    >
                      #{tag.name}
                    </Link>
                  ))}
                </div>
              )}

              {/* FOOTER */}
              <div className="mt-6 flex items-center justify-between border-t border-[#282e5c]/50 pt-5">
                <div className="flex items-center gap-5 text-sm text-gray-400">
                  <span>
                    ♥ {quote._count.favorites}
                  </span>

                  <span>
                    ♡ {quote._count.interactions}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/dashboard/quotes/${quote.id}/edit`}
                    className="rounded-lg border border-[#282e5c] px-3 py-2 text-sm text-gray-300 transition hover:border-purple-500/40 hover:text-white"
                  >
                    Edit
                  </Link>

                  <DeleteQuoteButton quoteId={quote.id} />
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}