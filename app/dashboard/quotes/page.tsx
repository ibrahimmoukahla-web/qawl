import Link from "next/link";
import { headers } from "next/headers";

import { getLocale, getTranslations } from "next-intl/server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import QuoteActions from "./QuoteActions";

import {
  Search,
  SlidersHorizontal,
  Quote as QuoteIcon,
  UserRound,
  FolderOpen,
  ChevronLeft,
  ChevronRight,
  X,
  Sparkles,
} from "lucide-react";

// ============================================================
// CONSTANTS
// ============================================================

const QUOTES_PER_PAGE = 12;

// ============================================================
// TYPES
// ============================================================

type SearchParams = Promise<{
  q?: string;
  category?: string;
  sort?: string;
  page?: string;
}>;

// ============================================================
// HELPERS
// ============================================================

function isArabicText(text: string) {
  const arabicCharacters = text.match(
    /[\u0600-\u06FF\u0750-\u077F\u08A0-\u08FF]/g,
  );

  return !!arabicCharacters && arabicCharacters.length > 3;
}

function getLocalizedName(
  entity: {
    name: string;
    nameEn?: string | null;
    nameAr?: string | null;
  },
  locale: string,
) {
  if (locale === "ar") {
    return entity.nameAr?.trim() || entity.name;
  }

  return entity.nameEn?.trim() || entity.name;
}

function getLocalizedText(
  entity: {
    text: string;
    textEn?: string | null;
    textAr?: string | null;
  },
  locale: string,
) {
  if (locale === "ar") {
    return entity.textAr?.trim() || entity.text;
  }

  return entity.textEn?.trim() || entity.text;
}

function createQueryString(params: {
  q?: string;
  category?: string;
  sort?: string;
  page?: number;
}) {
  const searchParams = new URLSearchParams();

  if (params.q) {
    searchParams.set("q", params.q);
  }

  if (params.category) {
    searchParams.set("category", params.category);
  }

  if (params.sort) {
    searchParams.set("sort", params.sort);
  }

  if (params.page && params.page > 1) {
    searchParams.set("page", String(params.page));
  }

  const query = searchParams.toString();

  return query ? `?${query}` : "";
}

function getPaginationItems(currentPage: number, totalPages: number) {
  if (totalPages <= 7) {
    return Array.from(
      {
        length: totalPages,
      },
      (_, index) => index + 1,
    );
  }

  const items: (number | "ellipsis")[] = [];

  items.push(1);

  if (currentPage > 4) {
    items.push("ellipsis");
  }

  const start = Math.max(2, currentPage - 1);

  const end = Math.min(totalPages - 1, currentPage + 1);

  for (let page = start; page <= end; page++) {
    items.push(page);
  }

  if (currentPage < totalPages - 3) {
    items.push("ellipsis");
  }

  items.push(totalPages);

  return items;
}

// ============================================================
// PAGE
// ============================================================

export default async function QuotesPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const params = await searchParams;

  const locale = await getLocale();

  const t = await getTranslations("QuotesPage");

  // ==========================================================
  // URL VALUES
  // ==========================================================

  const query = params.q?.trim() ?? "";

  const categorySlug = params.category?.trim() ?? "";

  const sort = params.sort === "oldest" ? "oldest" : "newest";

  let requestedPage = Number(params.page ?? "1");

  if (!Number.isFinite(requestedPage) || requestedPage < 1) {
    requestedPage = 1;
  }

  // ==========================================================
  // WHERE
  // ==========================================================

  const where = {
    status: "PUBLISHED" as const,

    ...(categorySlug
      ? {
          category: {
            slug: categorySlug,
          },
        }
      : {}),

    ...(query
      ? {
          OR: [
            // ==================================================
            // ORIGINAL QUOTE
            // ==================================================

            {
              text: {
                contains: query,
                mode: "insensitive" as const,
              },
            },

            // ==================================================
            // ENGLISH TRANSLATION
            // ==================================================

            {
              textEn: {
                contains: query,
                mode: "insensitive" as const,
              },
            },

            // ==================================================
            // ARABIC TRANSLATION
            // ==================================================

            {
              textAr: {
                contains: query,
                mode: "insensitive" as const,
              },
            },

            // ==================================================
            // SOURCE
            // ==================================================

            {
              source: {
                contains: query,
                mode: "insensitive" as const,
              },
            },

            // ==================================================
            // AUTHOR
            // ==================================================

            {
              author: {
                OR: [
                  {
                    name: {
                      contains: query,
                      mode: "insensitive" as const,
                    },
                  },
                  {
                    nameEn: {
                      contains: query,
                      mode: "insensitive" as const,
                    },
                  },
                  {
                    nameAr: {
                      contains: query,
                      mode: "insensitive" as const,
                    },
                  },
                ],
              },
            },

            // ==================================================
            // CATEGORY
            // ==================================================

            {
              category: {
                OR: [
                  {
                    name: {
                      contains: query,
                      mode: "insensitive" as const,
                    },
                  },
                  {
                    nameEn: {
                      contains: query,
                      mode: "insensitive" as const,
                    },
                  },
                  {
                    nameAr: {
                      contains: query,
                      mode: "insensitive" as const,
                    },
                  },
                ],
              },
            },
          ],
        }
      : {}),
  };

  // ==========================================================
  // CATEGORIES + COUNT
  // ==========================================================

  const [categories, totalQuotes] = await Promise.all([
    prisma.category.findMany({
      orderBy: {
        name: "asc",
      },

      select: {
        id: true,
        name: true,
        nameEn: true,
        nameAr: true,
        slug: true,
        color: true,
      },
    }),

    prisma.quote.count({
      where,
    }),
  ]);

  // ==========================================================
  // PAGINATION
  // ==========================================================

  const totalPages = Math.max(1, Math.ceil(totalQuotes / QUOTES_PER_PAGE));

  const currentPage = Math.min(requestedPage, totalPages);

  const skip = (currentPage - 1) * QUOTES_PER_PAGE;

  // ==========================================================
  // QUOTES
  // ==========================================================

  const quotes = await prisma.quote.findMany({
    where,

    orderBy: {
      createdAt: sort === "oldest" ? "asc" : "desc",
    },

    skip,

    take: QUOTES_PER_PAGE,

    select: {
      id: true,

      // Original
      text: true,

      // Translations
      textEn: true,
      textAr: true,

      imageUrl: true,
      source: true,
      sourceUrl: true,
      createdAt: true,

      // ======================================================
      // AUTHOR
      // ======================================================

      author: {
        select: {
          id: true,
          name: true,
          nameEn: true,
          nameAr: true,
          slug: true,
          imageUrl: true,
        },
      },

      // ======================================================
      // CATEGORY
      // ======================================================

      category: {
        select: {
          id: true,
          name: true,
          nameEn: true,
          nameAr: true,
          slug: true,
          color: true,
        },
      },
    },
  });

  // ==========================================================
  // QUOTE IDS
  // ==========================================================

  const quoteIds = quotes.map((quote) => quote.id);

  // ==========================================================
  // CURRENT USER
  // ==========================================================

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // ==========================================================
  // QUOTE TAGS + FAVORITES
  // ==========================================================

  const [quoteTags, favoriteQuotes] = await Promise.all([
    quoteIds.length > 0
      ? prisma.quoteTag.findMany({
          where: {
            quoteId: {
              in: quoteIds,
            },
          },

          select: {
            quoteId: true,

            tag: {
              select: {
                id: true,
                name: true,
                nameEn: true,
                nameAr: true,
                slug: true,
              },
            },
          },
        })
      : [],

    session?.user?.id && quoteIds.length > 0
      ? prisma.favorite.findMany({
          where: {
            userId: session.user.id,

            quoteId: {
              in: quoteIds,
            },
          },

          select: {
            quoteId: true,
          },
        })
      : [],
  ]);

  // ==========================================================
  // GROUP TAGS BY QUOTE
  // ==========================================================

  const tagsByQuote = new Map<
    string,
    {
      id: string;
      name: string;
      nameEn: string | null;
      nameAr: string | null;
      slug: string;
    }[]
  >();

  for (const item of quoteTags) {
    const current = tagsByQuote.get(item.quoteId) ?? [];

    current.push(item.tag);

    tagsByQuote.set(item.quoteId, current);
  }

  // ==========================================================
  // FAVORITES SET
  // ==========================================================

  const favoriteQuoteIds = new Set(
    favoriteQuotes.map((favorite) => favorite.quoteId),
  );

  // ==========================================================
  // PAGINATION ITEMS
  // ==========================================================

  const paginationItems = getPaginationItems(currentPage, totalPages);

  // ==========================================================
  // FILTER STATUS
  // ==========================================================

  const hasFilters = !!query || !!categorySlug || sort !== "newest";

  // ==========================================================
  // RANGE
  // ==========================================================

  const from = totalQuotes === 0 ? 0 : skip + 1;

  const to = Math.min(skip + QUOTES_PER_PAGE, totalQuotes);

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div
      dir={locale === "ar" ? "rtl" : "ltr"}
      lang={locale}
      className="min-h-full w-full min-w-0 bg-[#070B1C] text-white"
    >
      {/* ====================================================
          HEADER
      ==================================================== */}

      <header className="border-b border-[#282e5c]/50 bg-[#070B1C]/90 backdrop-blur-xl">
        <div className="mx-auto flex min-h-[72px] w-full min-w-0 max-w-[1500px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
          {/* LEFT */}

          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#8B5CF6]/10 text-[#C084FC]">
              <QuoteIcon size={20} />
            </div>

            <div className="min-w-0">
              <h1 className="truncate text-lg font-semibold sm:text-xl">
                {t("title")}
              </h1>

              <p className="hidden text-xs text-gray-600 sm:block">
                {t("subtitle")}
              </p>
            </div>
          </div>

          {/* RIGHT */}

          <div className="hidden items-center gap-2 sm:flex">
            <span className="rounded-full border border-[#282e5c]/60 bg-[#111634] px-3 py-1.5 text-xs text-gray-500">
              {totalQuotes}{" "}
              {totalQuotes === 1 ? t("quote") : t("quotes")}
            </span>
          </div>
        </div>
      </header>

      {/* ====================================================
          CONTENT
      ==================================================== */}

      <main className="mx-auto w-full min-w-0 max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* ==================================================
            INTRO
        ================================================== */}

        <section className="mb-7">
          <div className="flex min-w-0 flex-col justify-between gap-5 lg:flex-row lg:items-end">
            <div className="min-w-0">
              <p className="mb-2 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A78BFA]">
                <Sparkles size={13} />
                {t("libraryLabel")}
              </p>

              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                {t("introTitle")}
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
                {t("introDescription")}
              </p>
            </div>

            <div className="shrink-0 text-xs text-gray-600">
              {totalQuotes > 0 ? (
                <>
                  {t("showing")}{" "}
                  <span className="text-gray-400">{from}</span> –{" "}
                  <span className="text-gray-400">{to}</span> {t("of")}{" "}
                  <span className="text-gray-400">{totalQuotes}</span>
                </>
              ) : (
                t("noQuotesFound")
              )}
            </div>
          </div>
        </section>

        {/* ==================================================
            FILTER BAR
        ================================================== */}

        <section className="mb-7 min-w-0 rounded-2xl border border-[#282e5c]/60 bg-[#111634] p-3">
          <form
            method="GET"
            className="flex min-w-0 flex-col gap-3 xl:flex-row"
          >
            {/* SEARCH */}

            <div className="relative min-w-0 flex-1">
              <Search
                size={17}
                className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-gray-600 ${
                  locale === "ar" ? "right-4" : "left-4"
                }`}
              />

              <input
                type="search"
                name="q"
                defaultValue={query}
                placeholder={t("searchPlaceholder")}
                className={`h-11 w-full min-w-0 rounded-xl border border-[#282e5c] bg-[#080D26] py-0 text-sm text-gray-200 outline-none transition placeholder:text-gray-700 focus:border-[#8B5CF6]/60 focus:ring-2 focus:ring-[#8B5CF6]/10 ${
                  locale === "ar" ? "pr-11 pl-4" : "pl-11 pr-4"
                }`}
              />
            </div>

            {/* CATEGORY */}

            <div className="min-w-0 xl:w-[210px]">
              <select
                name="category"
                defaultValue={categorySlug}
                className="h-11 w-full min-w-0 appearance-none rounded-xl border border-[#282e5c] bg-[#080D26] px-4 text-sm text-gray-300 outline-none transition focus:border-[#8B5CF6]/60"
              >
                <option value="">{t("allCategories")}</option>

                {categories.map((category) => (
                  <option key={category.id} value={category.slug}>
                    {getLocalizedName(category, locale)}
                  </option>
                ))}
              </select>
            </div>

            {/* SORT */}

            <div className="relative min-w-0 xl:w-[180px]">
              <SlidersHorizontal
                size={15}
                className={`pointer-events-none absolute top-1/2 -translate-y-1/2 text-gray-600 ${
                  locale === "ar" ? "right-4" : "left-4"
                }`}
              />

              <select
                name="sort"
                defaultValue={sort}
                className={`h-11 w-full min-w-0 appearance-none rounded-xl border border-[#282e5c] bg-[#080D26] text-sm text-gray-300 outline-none transition focus:border-[#8B5CF6]/60 ${
                  locale === "ar" ? "pr-10 pl-4" : "pl-10 pr-4"
                }`}
              >
                <option value="newest">{t("newestFirst")}</option>

                <option value="oldest">{t("oldestFirst")}</option>
              </select>
            </div>

            {/* BUTTON */}

            <button
              type="submit"
              className="h-11 shrink-0 rounded-xl bg-[#8B5CF6] px-5 text-sm font-semibold text-white transition hover:bg-[#7C3AED]"
            >
              {t("search")}
            </button>

            {/* CLEAR */}

            {hasFilters && (
              <Link
                href="/dashboard/quotes"
                className="flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl border border-[#282e5c] px-4 text-sm text-gray-500 transition hover:bg-[#080D26] hover:text-white"
              >
                <X size={15} />

                {t("clear")}
              </Link>
            )}
          </form>
        </section>

        {/* ==================================================
            CATEGORY CHIPS
        ================================================== */}

        {categories.length > 0 && (
          <section className="mb-7">
            <div className="mb-3 flex items-center gap-2">
              <FolderOpen size={15} className="text-gray-600" />

              <span className="text-xs font-medium text-gray-500">
                {t("exploreCategories")}
              </span>
            </div>

            <div className="flex min-w-0 flex-wrap gap-2">
              {/* ALL */}

              <Link
                href={createQueryString({
                  q: query,
                  sort,
                })}
                className={`
                  rounded-full
                  border
                  px-3
                  py-1.5
                  text-xs
                  transition
                  ${
                    !categorySlug
                      ? "border-[#8B5CF6]/40 bg-[#8B5CF6]/10 text-[#C084FC]"
                      : "border-[#282e5c] bg-[#111634] text-gray-500 hover:text-white"
                  }
                `}
              >
                {t("all")}
              </Link>

              {/* CATEGORIES */}

              {categories.map((category) => {
                const active = categorySlug === category.slug;

                return (
                  <Link
                    key={category.id}
                    href={createQueryString({
                      q: query,
                      sort,
                      category: category.slug,
                    })}
                    className={`
                      flex
                      items-center
                      gap-2
                      rounded-full
                      border
                      px-3
                      py-1.5
                      text-xs
                      transition
                      ${
                        active
                          ? "bg-[#8B5CF6]/10 text-[#C084FC]"
                          : "border-[#282e5c] bg-[#111634] text-gray-500 hover:text-gray-200"
                      }
                    `}
                    style={
                      active
                        ? {
                            borderColor: `${category.color}66`,
                          }
                        : undefined
                    }
                  >
                    <span
                      className="h-1.5 w-1.5 shrink-0 rounded-full"
                      style={{
                        backgroundColor: category.color,
                      }}
                    />

                    <span className="truncate">
                      {getLocalizedName(category, locale)}
                    </span>
                  </Link>
                );
              })}
            </div>
          </section>
        )}

        {/* ==================================================
            EMPTY
        ================================================== */}

        {quotes.length === 0 ? (
          <section className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-dashed border-[#282e5c] bg-[#0B102B] px-6 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#8B5CF6]/10 text-[#C084FC]">
              <Search size={26} />
            </div>

            <h3 className="text-lg font-semibold">{t("emptyTitle")}</h3>

            <p className="mt-2 max-w-md text-sm leading-6 text-gray-600">
              {t("emptyDescription")}
            </p>

            <Link
              href="/dashboard/quotes"
              className="mt-6 rounded-xl bg-[#8B5CF6] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#7C3AED]"
            >
              {t("viewAll")}
            </Link>
          </section>
        ) : (
          <>
            {/* ==================================================
                GRID
            ================================================== */}

            <div className="grid min-w-0 grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {quotes.map((quote) => {
                // ==================================================
                // LOCALIZED DATA
                // ==================================================

                const displayedText = getLocalizedText(quote, locale);

                const displayedAuthor = quote.author
                  ? getLocalizedName(quote.author, locale)
                  : t("unknownAuthor");

                const displayedCategory = quote.category
                  ? getLocalizedName(quote.category, locale)
                  : null;

                const arabic = isArabicText(displayedText);

                const tags = tagsByQuote.get(quote.id) ?? [];

                // ==================================================
                // ARTICLE
                // ==================================================

                return (
                  <article
                    key={quote.id}
                    className="group min-w-0 overflow-hidden rounded-3xl border border-[#282e5c]/60 bg-[#111634] transition duration-300 hover:-translate-y-1 hover:border-[#8B5CF6]/25 hover:bg-[#131936] hover:shadow-[0_20px_60px_rgba(0,0,0,0.25)]"
                  >
                    {/* =================================================
                        IMAGE
                    ================================================== */}

                    {quote.imageUrl && (
                      <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#080D26]">
                        <img
                          src={quote.imageUrl}
                          alt={displayedText}
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-[#111634] via-transparent to-transparent" />
                      </div>
                    )}

                    {/* =================================================
                        CONTENT
                    ================================================== */}

                    <div className="min-w-0 p-5">
                      {/* =================================================
                          TOP META
                      ================================================== */}

                      <div className="mb-5 flex min-w-0 items-center justify-between gap-3">
                        {quote.category ? (
                          <span
                            className="inline-flex max-w-[70%] min-w-0 items-center gap-2 truncate rounded-full border px-2.5 py-1 text-[10px] font-medium"
                            style={{
                              borderColor: `${quote.category.color}55`,
                              color: quote.category.color,
                              backgroundColor: `${quote.category.color}10`,
                            }}
                          >
                            <span
                              className="h-1.5 w-1.5 shrink-0 rounded-full"
                              style={{
                                backgroundColor: quote.category.color,
                              }}
                            />

                            <span className="truncate">
                              {displayedCategory}
                            </span>
                          </span>
                        ) : (
                          <span className="rounded-full border border-[#282e5c] px-2.5 py-1 text-[10px] text-gray-600">
                            {t("quote")}
                          </span>
                        )}

                        <QuoteIcon
                          size={17}
                          className="shrink-0 text-[#8B5CF6]/40"
                        />
                      </div>

                      {/* =================================================
                          QUOTE TEXT
                      ================================================== */}

                      <div
                        dir={arabic ? "rtl" : "ltr"}
                        lang={arabic ? "ar" : "en"}
                        className={`min-w-0 ${
                          arabic ? "text-right" : "text-left"
                        }`}
                      >
                        <p
                          className={`
                            break-words
                            font-medium
                            text-gray-100
                            ${
                              arabic
                                ? "font-serif text-[1.15rem] leading-[2.05]"
                                : "text-[1.08rem] leading-[1.75]"
                            }
                            line-clamp-6
                          `}
                        >
                          “{displayedText}”
                        </p>
                      </div>

                      {/* =================================================
                          TAGS
                      ================================================== */}

                      {tags.length > 0 && (
                        <div className="mt-6 flex min-w-0 flex-wrap gap-1.5">
                          {tags.slice(0, 4).map((tag) => (
                            <span
                              key={tag.id}
                              className="max-w-full truncate rounded-full border border-[#282e5c] bg-[#080D26] px-2.5 py-1 text-[10px] text-gray-500"
                            >
                              #{getLocalizedName(tag, locale)}
                            </span>
                          ))}

                          {tags.length > 4 && (
                            <span className="rounded-full border border-[#282e5c] bg-[#080D26] px-2.5 py-1 text-[10px] text-gray-600">
                              +{tags.length - 4}
                            </span>
                          )}
                        </div>
                      )}

                      {/* =================================================
                          DIVIDER
                      ================================================== */}

                      <div className="my-5 h-px bg-[#282e5c]/50" />

                      {/* =================================================
                          AUTHOR
                      ================================================== */}

                      <div className="flex min-w-0 items-center justify-between gap-3">
                        {quote.author ? (
                          <div className="flex min-w-0 items-center gap-3">
                            {/* AVATAR */}

                            {quote.author.imageUrl ? (
                              <img
                                src={quote.author.imageUrl}
                                alt={displayedAuthor}
                                loading="lazy"
                                className="h-9 w-9 shrink-0 rounded-full object-cover ring-1 ring-[#8B5CF6]/20"
                              />
                            ) : (
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#8B5CF6]/10 text-xs font-semibold text-[#C084FC]">
                                {displayedAuthor.charAt(0).toUpperCase()}
                              </div>
                            )}

                            {/* NAME */}

                            <div className="min-w-0">
                              <Link
                                href={`/dashboard/authors/${quote.author.slug}`}
                                className="truncate text-xs font-semibold text-gray-300 transition hover:text-[#C084FC]"
                              >
                                {displayedAuthor}
                              </Link>

                              <p className="mt-0.5 text-[10px] text-gray-600">
                                {t("author")}
                              </p>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-[#282e5c]/40 text-gray-600">
                              <UserRound size={15} />
                            </div>

                            <div>
                              <p className="text-xs font-medium text-gray-500">
                                {t("unknownAuthor")}
                              </p>
                            </div>
                          </div>
                        )}

                        {/* =================================================
                            DATE
                        ================================================== */}

                        <time
                          dateTime={quote.createdAt.toISOString()}
                          className="shrink-0 text-[10px] text-gray-700"
                        >
                          {new Intl.DateTimeFormat(locale, {
                            day: "numeric",
                            month: "short",
                            year: "numeric",
                          }).format(new Date(quote.createdAt))}
                        </time>
                      </div>

                      {/* =================================================
                          SOURCE
                      ================================================== */}

                      {quote.source && (
                        <p className="mt-4 truncate text-[10px] text-gray-700">
                          {t("source")}{" "}
                          <span className="text-gray-600">
                            {quote.source}
                          </span>
                        </p>
                      )}

                      {/* =================================================
                          ACTIONS
                      ================================================== */}

                      <QuoteActions
                        quoteId={quote.id}
                        quoteText={displayedText}
                        authorName={
                          quote.author ? displayedAuthor : undefined
                        }
                        quoteHref={`/dashboard/quotes/${quote.id}`}
                        initialFavorite={favoriteQuoteIds.has(quote.id)}
                      />
                    </div>
                  </article>
                );
              })}
            </div>

            {/* ==================================================
                PAGINATION
            ================================================== */}

            {totalPages > 1 && (
              <div className="mt-10 flex flex-col items-center justify-between gap-4 border-t border-[#282e5c]/50 pt-6 sm:flex-row">
                {/* ==================================================
                    PREVIOUS
                ================================================== */}

                <div>
                  {currentPage > 1 ? (
                    <Link
                      href={createQueryString({
                        q: query,
                        category: categorySlug,
                        sort,
                        page: currentPage - 1,
                      })}
                      className="flex h-10 items-center gap-2 rounded-xl border border-[#282e5c] bg-[#111634] px-4 text-xs font-medium text-gray-500 transition hover:bg-[#080D26] hover:text-white"
                    >
                      {locale === "ar" ? (
                        <ChevronRight size={15} />
                      ) : (
                        <ChevronLeft size={15} />
                      )}

                      {t("previous")}
                    </Link>
                  ) : (
                    <span className="flex h-10 cursor-not-allowed items-center gap-2 rounded-xl border border-[#282e5c]/40 bg-[#111634]/50 px-4 text-xs font-medium text-gray-700">
                      {locale === "ar" ? (
                        <ChevronRight size={15} />
                      ) : (
                        <ChevronLeft size={15} />
                      )}

                      {t("previous")}
                    </span>
                  )}
                </div>

                {/* ==================================================
                    PAGE NUMBERS
                ================================================== */}

                <div className="flex items-center gap-1.5">
                  {paginationItems.map((item, index) => {
                    if (item === "ellipsis") {
                      return (
                        <span
                          key={`ellipsis-${index}`}
                          className="flex h-10 w-8 items-center justify-center text-xs text-gray-700"
                        >
                          ...
                        </span>
                      );
                    }

                    const active = item === currentPage;

                    return (
                      <Link
                        key={item}
                        href={createQueryString({
                          q: query,
                          category: categorySlug,
                          sort,
                          page: item,
                        })}
                        className={`
                          flex
                          h-10
                          w-10
                          items-center
                          justify-center
                          rounded-xl
                          text-xs
                          font-medium
                          transition
                          ${
                            active
                              ? "bg-[#8B5CF6] text-white shadow-[0_0_20px_rgba(139,92,246,0.18)]"
                              : "border border-[#282e5c] bg-[#111634] text-gray-600 hover:bg-[#080D26] hover:text-white"
                          }
                        `}
                      >
                        {item}
                      </Link>
                    );
                  })}
                </div>

                {/* ==================================================
                    NEXT
                ================================================== */}

                <div>
                  {currentPage < totalPages ? (
                    <Link
                      href={createQueryString({
                        q: query,
                        category: categorySlug,
                        sort,
                        page: currentPage + 1,
                      })}
                      className="flex h-10 items-center gap-2 rounded-xl border border-[#282e5c] bg-[#111634] px-4 text-xs font-medium text-gray-500 transition hover:bg-[#080D26] hover:text-white"
                    >
                      {t("next")}

                      {locale === "ar" ? (
                        <ChevronLeft size={15} />
                      ) : (
                        <ChevronRight size={15} />
                      )}
                    </Link>
                  ) : (
                    <span className="flex h-10 cursor-not-allowed items-center gap-2 rounded-xl border border-[#282e5c]/40 bg-[#111634]/50 px-4 text-xs font-medium text-gray-700">
                      {t("next")}

                      {locale === "ar" ? (
                        <ChevronLeft size={15} />
                      ) : (
                        <ChevronRight size={15} />
                      )}
                    </span>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}