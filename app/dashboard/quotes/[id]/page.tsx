import Link from "next/link";
import {
  ArrowLeft,
  CalendarDays,
  ExternalLink,
  Heart,
  Share2,
  Tag,
  UserRound,
  Quote as QuoteIcon,
} from "lucide-react";
import QuoteActions from "./QuoteActions";
import { notFound } from "next/navigation";

import { prisma } from "@/lib/prisma";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";

// ==========================================================
// TYPES
// ==========================================================

type QuotePageProps = {
  params: Promise<{
    id: string;
  }>;
};

// ==========================================================
// HELPERS
// ==========================================================

function isArabicText(text: string) {
  const arabicCharacters = text.match(
    /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/g,
  );

  return !!arabicCharacters && arabicCharacters.length > 3;
}

// ==========================================================
// PAGE
// ==========================================================

export default async function QuotePage({ params }: QuotePageProps) {
  const { id } = await params;

  // ========================================================
  // GET QUOTE
  // ========================================================
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userId = session?.user.id ?? "";

  const quote = await prisma.quote.findUnique({
    where: {
      id,
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
          bio: true,
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
  });

  // ========================================================
  // NOT FOUND
  // ========================================================

  if (!quote) {
    notFound();
  }

  // ========================================================
  // VALUES
  // ========================================================

  const arabic = isArabicText(quote.text);

  const tags = quote.quoteTags.map((item) => item.tag);

  // ========================================================
  // RENDER
  // ========================================================

  return (
    <div className="min-h-full w-full min-w-0 bg-[#070B1C] text-white">
      {/* ====================================================
          HEADER
      ==================================================== */}

      <header className="sticky top-0 z-30 border-b border-[#282e5c]/50 bg-[#070B1C]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-16 w-full max-w-[1200px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          <Link
            href="/dashboard/quotes"
            className="group flex items-center gap-2 text-sm text-gray-500 transition hover:text-white"
          >
            <ArrowLeft
              size={17}
              className="transition-transform group-hover:-translate-x-0.5"
            />

            <span>Back to quotes</span>
          </Link>

          <span className="hidden text-[10px] font-semibold uppercase tracking-[0.2em] text-gray-700 sm:block">
            QAWL
          </span>
        </div>
      </header>

      {/* ====================================================
          CONTENT
      ==================================================== */}

      <main className="mx-auto w-full min-w-0 max-w-[1200px] px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
        <div className="grid min-w-0 gap-6 lg:grid-cols-[minmax(0,1fr)_300px]">
          {/* ==================================================
              MAIN QUOTE
          ================================================== */}

          <article className="min-w-0 overflow-hidden rounded-[32px] border border-[#282e5c]/60 bg-[#111634]">
            {/* IMAGE */}

            {quote.imageUrl && (
              <div className="relative w-full overflow-hidden bg-[#080D26]">
                <img
                  src={quote.imageUrl}
                  alt={quote.text}
                  className="block max-h-[560px] w-full object-cover"
                />

                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#111634] to-transparent" />
              </div>
            )}

            {/* QUOTE BODY */}

            <div className="relative min-w-0 p-6 sm:p-8 md:p-10 lg:p-12">
              {/* DECORATION */}

              <div className="pointer-events-none absolute right-[-50px] top-[-50px] h-40 w-40 rounded-full bg-purple-500/10 blur-[90px]" />

              <div className="relative">
                {/* ICON */}

                <div className="mb-8 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#8B5CF6]/10 text-[#C084FC]">
                  <QuoteIcon size={21} />
                </div>

                {/* CATEGORY */}

                {quote.category && (
                  <div className="mb-6">
                    <span
                      className="inline-flex items-center gap-2 rounded-full border px-3 py-1.5 text-[10px] font-medium"
                      style={{
                        borderColor: `${quote.category.color}55`,
                        backgroundColor: `${quote.category.color}10`,
                        color: quote.category.color,
                      }}
                    >
                      <span
                        className="h-1.5 w-1.5 rounded-full"
                        style={{
                          backgroundColor: quote.category.color,
                        }}
                      />

                      {quote.category.name}
                    </span>
                  </div>
                )}

                {/* TEXT */}

                <div
                  dir={arabic ? "rtl" : "ltr"}
                  lang={arabic ? "ar" : "en"}
                  className={arabic ? "text-right" : "text-left"}
                >
                  <p
                    className={`
                      break-words
                      text-gray-50
                      ${
                        arabic
                          ? "font-serif text-[1.5rem] leading-[2.1] sm:text-[1.8rem]"
                          : "text-[1.4rem] leading-[1.8] sm:text-[1.7rem]"
                      }
                    `}
                  >
                    “{quote.text}”
                  </p>
                </div>

                {/* DIVIDER */}

                <div className="my-10 h-px bg-[#282e5c]/60" />

                {/* AUTHOR */}

                {quote.author ? (
                  <Link
                    href={`/dashboard/authors/${quote.author.slug}`}
                    className="group inline-flex max-w-full items-center gap-3 rounded-2xl border border-transparent p-2 -ml-2 transition hover:border-[#282e5c] hover:bg-[#080D26]"
                  >
                    {quote.author.imageUrl ? (
                      <img
                        src={quote.author.imageUrl}
                        alt={quote.author.name}
                        className="h-12 w-12 shrink-0 rounded-full object-cover ring-2 ring-[#8B5CF6]/15"
                      />
                    ) : (
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#8B5CF6]/10 font-semibold text-[#C084FC]">
                        {quote.author.name.charAt(0).toUpperCase()}
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white group-hover:text-[#C084FC]">
                        {quote.author.name}
                      </p>

                      <p className="mt-1 truncate text-xs text-gray-600">
                        @{quote.author.slug}
                      </p>
                    </div>
                  </Link>
                ) : (
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#282e5c]/40">
                      <UserRound size={18} />
                    </div>
                    Unknown author
                  </div>
                )}

                {/* TAGS */}

                {tags.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Link
                        key={tag.id}
                        href={`/dashboard/quotes?q=${encodeURIComponent(
                          tag.name,
                        )}`}
                        className="rounded-full border border-[#282e5c] bg-[#080D26] px-3 py-1.5 text-xs text-gray-500 transition hover:border-[#8B5CF6]/30 hover:text-[#C084FC]"
                      >
                        #{tag.name}
                      </Link>
                    ))}
                  </div>
                )}

                {/* SOURCE */}

                {quote.source && (
                  <div className="mt-7">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-700">
                      Source
                    </p>

                    {quote.sourceUrl ? (
                      <a
                        href={quote.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-2 inline-flex max-w-full items-center gap-2 text-sm text-gray-500 transition hover:text-[#C084FC]"
                      >
                        <span className="truncate">{quote.source}</span>

                        <ExternalLink size={14} className="shrink-0" />
                      </a>
                    ) : (
                      <p className="mt-2 text-sm text-gray-500">
                        {quote.source}
                      </p>
                    )}
                  </div>
                )}

                {/* DATE */}

                <div className="mt-7 flex items-center gap-2 text-xs text-gray-700">
                  <CalendarDays size={14} />

                  <span>
                    Published{" "}
                    {new Intl.DateTimeFormat("en", {
                      day: "numeric",
                      month: "long",
                      year: "numeric",
                    }).format(new Date(quote.createdAt))}
                  </span>
                </div>
              </div>
            </div>
          </article>

          {/* ==================================================
              RIGHT SIDE
          ================================================== */}

          <aside className="min-w-0">
            <div className="space-y-4 lg:sticky lg:top-24">
              {/* INTERACTIONS */}

              <section className="rounded-3xl border border-[#282e5c]/60 bg-[#111634] p-5">
                <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-600">
                  Actions
                </p>

                <div className="grid grid-cols-2 gap-2">
                  <QuoteActions
                    quoteId={quote.id}
                    initialLiked={quote.interactions.length > 0}
                    initialSaved={quote.favorites.length > 0}
                    initialLikesCount={quote._count.interactions}
                  />
                </div>
              </section>

              {/* AUTHOR CARD */}

              {quote.author && (
                <section className="rounded-3xl border border-[#282e5c]/60 bg-[#111634] p-5">
                  <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-600">
                    About the author
                  </p>

                  <Link
                    href={`/dashboard/authors/${quote.author.slug}`}
                    className="group block"
                  >
                    <div className="flex items-center gap-3">
                      {quote.author.imageUrl ? (
                        <img
                          src={quote.author.imageUrl}
                          alt={quote.author.name}
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      ) : (
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#8B5CF6]/10 font-semibold text-[#C084FC]">
                          {quote.author.name.charAt(0).toUpperCase()}
                        </div>
                      )}

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold group-hover:text-[#C084FC]">
                          {quote.author.name}
                        </p>

                        <p className="mt-1 text-xs text-gray-600">
                          View author
                        </p>
                      </div>
                    </div>

                    {quote.author.bio && (
                      <p className="mt-4 line-clamp-4 text-xs leading-6 text-gray-600">
                        {quote.author.bio}
                      </p>
                    )}
                  </Link>
                </section>
              )}

              {/* CATEGORY */}

              {quote.category && (
                <section className="rounded-3xl border border-[#282e5c]/60 bg-[#111634] p-5">
                  <p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-600">
                    Category
                  </p>

                  <Link
                    href={`/dashboard/quotes?category=${quote.category.slug}`}
                    className="flex items-center gap-3 rounded-xl border border-[#282e5c] bg-[#080D26] p-3 transition hover:border-[#8B5CF6]/30"
                  >
                    <span
                      className="h-3 w-3 rounded-full"
                      style={{
                        backgroundColor: quote.category.color,
                      }}
                    />

                    <span
                      className="truncate text-sm"
                      style={{
                        color: quote.category.color,
                      }}
                    >
                      {quote.category.name}
                    </span>
                  </Link>
                </section>
              )}

              {/* TAGS */}

              {tags.length > 0 && (
                <section className="rounded-3xl border border-[#282e5c]/60 bg-[#111634] p-5">
                  <div className="mb-4 flex items-center gap-2">
                    <Tag size={14} className="text-gray-600" />

                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-600">
                      Tags
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Link
                        key={tag.id}
                        href={`/dashboard/quotes?q=${encodeURIComponent(
                          tag.name,
                        )}`}
                        className="rounded-full border border-[#282e5c] bg-[#080D26] px-3 py-1.5 text-[11px] text-gray-500 transition hover:border-[#8B5CF6]/30 hover:text-[#C084FC]"
                      >
                        #{tag.name}
                      </Link>
                    ))}
                  </div>
                </section>
              )}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}
