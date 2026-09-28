import Link from "next/link";

import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Quote as QuoteIcon,
  UserRound,
} from "lucide-react";

import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

import QuoteActions from "@/app/dashboard/quotes/[id]/QuoteActions";

type AuthorPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

function isArabicText(text: string) {
  const arabicCharacters = text.match(
    /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/g,
  );

  return (
    !!arabicCharacters &&
    arabicCharacters.length > 3
  );
}

export default async function AuthorPage({
  params,
}: AuthorPageProps) {
  const { slug } = await params;

  // =========================================================
  // SESSION
  // =========================================================

  const session =
    await auth.api.getSession({
      headers: await headers(),
    });

  const userId =
    session?.user.id ?? "";

  // =========================================================
  // AUTHOR
  // =========================================================

  const author =
    await prisma.author.findUnique({
      where: {
        slug,
      },

      select: {
        id: true,
        name: true,
        slug: true,
        bio: true,
        imageUrl: true,
        createdAt: true,

        quotes: {
          where: {
            status: "PUBLISHED",
          },

          orderBy: {
            createdAt: "desc",
          },

          take: 12,

          select: {
            id: true,
            text: true,
            imageUrl: true,
            source: true,
            createdAt: true,

            category: {
              select: {
                id: true,
                name: true,
                color: true,
              },
            },

            interactions: {
              where: {
                userId,
                type: "LIKE",
              },

              select: {
                id: true,
              },

              take: 1,
            },

            favorites: {
              where: {
                userId,
              },

              select: {
                id: true,
              },

              take: 1,
            },

            _count: {
              select: {
                interactions: {
                  where: {
                    type: "LIKE",
                  },
                },

                favorites: true,
              },
            },
          },
        },
      },
    });

  if (!author) {
    notFound();
  }

  // =========================================================
  // COUNT
  // =========================================================

  const quoteCount =
    await prisma.quote.count({
      where: {
        authorId: author.id,
        status: "PUBLISHED",
      },
    });

  // =========================================================
  // PAGE
  // =========================================================

  return (
    <div className="min-h-full w-full min-w-0 bg-[#070B1C] text-white">
      {/* ===================================================
          HEADER
      ==================================================== */}

      <header className="sticky top-0 z-30 border-b border-[#282e5c]/50 bg-[#070B1C]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-[1500px] items-center px-4 sm:px-6 lg:px-8">
          <Link
            href="/dashboard/authors"
            className="group flex items-center gap-2 text-sm text-gray-500 transition hover:text-white"
          >
            <ArrowLeft
              size={17}
              className="transition-transform group-hover:-translate-x-0.5"
            />

            <span>All authors</span>
          </Link>
        </div>
      </header>

      {/* ===================================================
          CONTENT
      ==================================================== */}

      <main className="mx-auto w-full min-w-0 max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* =================================================
            AUTHOR HERO
        ================================================== */}

        <section className="relative min-w-0 overflow-hidden rounded-[32px] border border-[#282e5c]/60 bg-[#111634]">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute right-[-5%] top-[-80px] h-72 w-72 rounded-full bg-purple-600/10 blur-[120px]" />

            <div className="absolute bottom-[-100px] left-[25%] h-64 w-64 rounded-full bg-violet-500/5 blur-[120px]" />
          </div>

          <div className="relative p-6 sm:p-8 lg:p-10">
            <div className="flex min-w-0 flex-col gap-7 md:flex-row md:items-end">
              {/* AVATAR */}

              <div className="shrink-0">
                {author.imageUrl ? (
                  <img
                    src={author.imageUrl}
                    alt={author.name}
                    className="h-28 w-28 rounded-[28px] border-4 border-[#070B1C] object-cover shadow-2xl sm:h-32 sm:w-32"
                  />
                ) : (
                  <div className="flex h-28 w-28 items-center justify-center rounded-[28px] border-4 border-[#070B1C] bg-[#8B5CF6]/10 text-4xl font-semibold text-[#C084FC] shadow-2xl sm:h-32 sm:w-32">
                    {author.name
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                )}
              </div>

              {/* INFO */}

              <div className="min-w-0 flex-1">
                <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A78BFA]">
                  Author
                </p>

                <h1 className="break-words text-3xl font-semibold tracking-tight sm:text-4xl">
                  {author.name}
                </h1>

                <p className="mt-2 text-sm text-gray-600">
                  @{author.slug}
                </p>

                {author.bio && (
                  <p className="mt-5 max-w-3xl text-sm leading-7 text-gray-400">
                    {author.bio}
                  </p>
                )}
              </div>

              {/* COUNT */}

              <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-[#282e5c] bg-[#080D26] px-5 py-4">
                <QuoteIcon
                  size={19}
                  className="text-[#C084FC]"
                />

                <div>
                  <p className="text-lg font-semibold text-white">
                    {quoteCount}
                  </p>

                  <p className="text-[10px] uppercase tracking-wider text-gray-600">
                    Published quotes
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* =================================================
            QUOTES
        ================================================== */}

        <section className="mt-8">
          <div className="mb-5 flex items-end justify-between gap-4">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A78BFA]">
                Collection
              </p>

              <h2 className="mt-1 text-xl font-semibold">
                Quotes by {author.name}
              </h2>
            </div>

            <span className="text-xs text-gray-600">
              {quoteCount} total
            </span>
          </div>

          {author.quotes.length === 0 ? (
            <div className="flex min-h-[300px] flex-col items-center justify-center rounded-3xl border border-dashed border-[#282e5c] bg-[#0B102B] px-6 text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#8B5CF6]/10 text-[#C084FC]">
                <QuoteIcon size={23} />
              </div>

              <h3 className="font-semibold">
                No published quotes yet
              </h3>

              <p className="mt-2 max-w-md text-sm leading-6 text-gray-600">
                Quotes by this author will
                appear here once they are
                published.
              </p>
            </div>
          ) : (
            <div className="grid min-w-0 grid-cols-1 gap-5 lg:grid-cols-2">
              {author.quotes.map(
                (quote) => {
                  const arabic =
                    isArabicText(
                      quote.text,
                    );

                  return (
                    <article
                      key={quote.id}
                      className="group min-w-0 overflow-hidden rounded-3xl border border-[#282e5c]/60 bg-[#111634] transition duration-300 hover:-translate-y-1 hover:border-[#8B5CF6]/25 hover:shadow-[0_20px_50px_rgba(0,0,0,0.2)]"
                    >
                      {/* =================================
                          CLICKABLE QUOTE AREA
                      ================================== */}

                      <Link
                        href={`/dashboard/quotes/${quote.id}`}
                        className="block min-w-0"
                      >
                        {/* IMAGE */}

                        {quote.imageUrl && (
                          <div className="aspect-[16/7] w-full overflow-hidden bg-[#080D26]">
                            <img
                              src={
                                quote.imageUrl
                              }
                              alt={
                                quote.text
                              }
                              loading="lazy"
                              className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                            />
                          </div>
                        )}

                        {/* CONTENT */}

                        <div className="min-w-0 p-5 sm:p-6">
                          {/* CATEGORY */}

                          <div className="mb-5 flex items-center justify-between gap-3">
                            {quote.category ? (
                              <span
                                className="flex max-w-[75%] items-center gap-2 truncate rounded-full border px-2.5 py-1 text-[10px]"
                                style={{
                                  color:
                                    quote
                                      .category
                                      .color,
                                  borderColor:
                                    `${quote.category.color}55`,
                                  backgroundColor:
                                    `${quote.category.color}10`,
                                }}
                              >
                                <span
                                  className="h-1.5 w-1.5 shrink-0 rounded-full"
                                  style={{
                                    backgroundColor:
                                      quote
                                        .category
                                        .color,
                                  }}
                                />

                                <span className="truncate">
                                  {
                                    quote
                                      .category
                                      .name
                                  }
                                </span>
                              </span>
                            ) : (
                              <span className="rounded-full border border-[#282e5c] px-2.5 py-1 text-[10px] text-gray-600">
                                Quote
                              </span>
                            )}

                            <ArrowRight
                              size={16}
                              className="shrink-0 text-gray-700 transition group-hover:translate-x-1 group-hover:text-[#C084FC]"
                            />
                          </div>

                          {/* QUOTE */}

                          <p
                            dir={
                              arabic
                                ? "rtl"
                                : "ltr"
                            }
                            lang={
                              arabic
                                ? "ar"
                                : "en"
                            }
                            className={`
                              break-words
                              text-gray-100
                              ${
                                arabic
                                  ? "text-right font-serif text-[1.15rem] leading-[2.05]"
                                  : "text-left text-[1.08rem] leading-[1.75]"
                              }
                            `}
                          >
                            “{quote.text}”
                          </p>

                          {/* AUTHOR + DATE */}

                          <div className="mt-6 flex items-center justify-between gap-4 border-t border-[#282e5c]/50 pt-4">
                            <div className="flex min-w-0 items-center gap-2">
                              <UserRound
                                size={14}
                                className="shrink-0 text-[#C084FC]"
                              />

                              <span className="truncate text-xs text-gray-500">
                                {
                                  author.name
                                }
                              </span>
                            </div>

                            <div className="flex shrink-0 items-center gap-2 text-[10px] text-gray-700">
                              <CalendarDays
                                size={13}
                              />

                              {new Intl.DateTimeFormat(
                                "en",
                                {
                                  day: "numeric",
                                  month: "short",
                                  year: "numeric",
                                },
                              ).format(
                                new Date(
                                  quote.createdAt,
                                ),
                              )}
                            </div>
                          </div>

                          {/* SOURCE */}

                          {quote.source && (
                            <p className="mt-4 truncate text-[10px] text-gray-700">
                              Source:{" "}
                              <span className="text-gray-600">
                                {
                                  quote.source
                                }
                              </span>
                            </p>
                          )}
                        </div>
                      </Link>

                      {/* =================================
                          INTERACTIONS
                      ================================== */}

                      <div className="border-t border-[#282e5c]/50 px-5 pb-5 pt-4 sm:px-6">
                        <QuoteActions
                          quoteId={quote.id}
                          initialLiked={
                            quote.interactions
                              .length >
                            0
                          }
                          initialSaved={
                            quote.favorites
                              .length >
                            0
                          }
                          initialLikesCount={
                            quote._count
                              .interactions
                          }
                        />
                      </div>
                    </article>
                  );
                },
              )}
            </div>
          )}

          {/* VIEW ALL */}

          {quoteCount >
            author.quotes.length && (
            <div className="mt-6 text-center">
              <Link
                href={`/dashboard/quotes?q=${encodeURIComponent(
                  author.name,
                )}`}
                className="inline-flex items-center gap-2 rounded-xl border border-[#282e5c] bg-[#111634] px-5 py-3 text-sm text-gray-500 transition hover:bg-[#080D26] hover:text-white"
              >
                View all quotes

                <ArrowRight size={15} />
              </Link>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}