import Image from "next/image";
import React from "react";
import { FaArrowRight } from "react-icons/fa";
import { SiCdprojekt } from "react-icons/si";
import { MdEmail } from "react-icons/md";
import Link from "next/link";

import CardQuates from "./cardQuates";
import InputGroupKbd from "@/components/Search";
import { AvatarDropdown } from "@/components/DropdownAvatar";
import OpenIconSpeedDial from "@/components/OpenIconSpeedDial";
import CategoryFilter from "./CategoryFilter";
import LanguageSwitcher from "@/components/language-switcher";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

import {
  getLocale,
  getTranslations,
} from "next-intl/server";

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
    q?: string;
  }>;
}) {
  const { category, q } = await searchParams;

  // =========================================================
  // Locale + Translations
  // =========================================================

  const locale = await getLocale();

  const t = await getTranslations("Home");

  // =========================================================
  // Session
  // =========================================================

  const session = await auth.api.getSession({
    headers: await headers(),
  });
const currentUser = session?.user.id
  ? await prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        role: true,
      },
    })
  : null;

const isAdmin = currentUser?.role === "admin";

  const userId = session?.user.id ?? "";

  // =========================================================
  // Helpers
  // =========================================================

  function getLocalizedName(entity: {
    name: string;
    nameEn?: string | null;
    nameAr?: string | null;
  }) {
    if (locale === "ar") {
      return entity.nameAr?.trim() || entity.name;
    }

    return entity.nameEn?.trim() || entity.name;
  }

  function getLocalizedQuoteText(quote: {
    text: string;
    textEn?: string | null;
    textAr?: string | null;
  }) {
    if (locale === "ar") {
      return quote.textAr?.trim() || quote.text;
    }

    return quote.textEn?.trim() || quote.text;
  }

  // =========================================================
  // Categories
  // =========================================================

  const categoriesFromDb = await prisma.category.findMany({
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
  });

  const categories = categoriesFromDb.map((category) => ({
    id: category.id,
    name: getLocalizedName(category),
    slug: category.slug,
    color: category.color,
  }));

  // =========================================================
  // Search
  // =========================================================

  const search = q?.trim();

  // =========================================================
  // Quotes
  // =========================================================

  const quotes = await prisma.quote.findMany({
    where: {
      status: "PUBLISHED",

      // -----------------------------------------------------
      // Category filter
      // -----------------------------------------------------

      ...(category
        ? {
            category: {
              slug: category,
            },
          }
        : {}),

      // -----------------------------------------------------
      // Search
      // -----------------------------------------------------

      ...(search
        ? {
            OR: [
              // Quote original
              {
                text: {
                  contains: search,
                  mode: "insensitive",
                },
              },

              // Quote English
              {
                textEn: {
                  contains: search,
                  mode: "insensitive",
                },
              },

              // Quote Arabic
              {
                textAr: {
                  contains: search,
                  mode: "insensitive",
                },
              },

              // Author
              {
                author: {
                  OR: [
                    {
                      name: {
                        contains: search,
                        mode: "insensitive",
                      },
                    },
                    {
                      nameEn: {
                        contains: search,
                        mode: "insensitive",
                      },
                    },
                    {
                      nameAr: {
                        contains: search,
                        mode: "insensitive",
                      },
                    },
                  ],
                },
              },

              // Category
              {
                category: {
                  OR: [
                    {
                      name: {
                        contains: search,
                        mode: "insensitive",
                      },
                    },
                    {
                      nameEn: {
                        contains: search,
                        mode: "insensitive",
                      },
                    },
                    {
                      nameAr: {
                        contains: search,
                        mode: "insensitive",
                      },
                    },
                  ],
                },
              },
            ],
          }
        : {}),
    },

    // =======================================================
    // Most interacted first
    // =======================================================

    orderBy: {
      interactions: {
        _count: "desc",
      },
    },

    take: 30,

    // =======================================================
    // Relations
    // =======================================================

    include: {
      author: true,

      category: true,

      createdBy: {
        select: {
          id: true,
          name: true,
          username: true,
          image: true,
        },
      },

      // -----------------------------------------------------
      // Current user's likes
      // -----------------------------------------------------

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

      // -----------------------------------------------------
      // Current user's favorites
      // -----------------------------------------------------

      favorites: {
        where: {
          userId,
        },

        select: {
          userId: true,
        },

        take: 1,
      },

      // -----------------------------------------------------
      // Counts
      // -----------------------------------------------------

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

  // =========================================================
  // Card Quotes
  // =========================================================

  const cardQuotes = quotes.map((quote) => {
    const localizedAuthor = quote.author
      ? {
          ...quote.author,
          name: getLocalizedName(quote.author),
        }
      : null;

    const localizedCategory = quote.category
      ? {
          ...quote.category,
          name: getLocalizedName(quote.category),
        }
      : null;

    return {
      id: quote.id,

      text: quote.text,
      textEn: quote.textEn,
      textAr: quote.textAr,

      createdAt: quote.createdAt.toISOString(),

      author: localizedAuthor,

      category: localizedCategory,

      createdBy: quote.createdBy,

      likesCount: quote._count.interactions ?? 0,

      isLiked: quote.interactions.length > 0,

      isSaved: quote.favorites.length > 0,
    };
  });

  // =========================================================
  // Trending Authors
  // =========================================================

  const trendingAuthorGroups =
    await prisma.quote.groupBy({
      by: ["authorId"],

      where: {
        status: "PUBLISHED",

        authorId: {
          not: null,
        },
      },

      _count: {
        authorId: true,
      },

      orderBy: {
        _count: {
          authorId: "desc",
        },
      },

      take: 3,
    });

  const authorIds = trendingAuthorGroups
    .map((item) => item.authorId)
    .filter(
      (id): id is string =>
        id !== null,
    );

  const authors = await prisma.author.findMany({
    where: {
      id: {
        in: authorIds,
      },
    },

    select: {
      id: true,
      name: true,
      nameEn: true,
      nameAr: true,
      imageUrl: true,
    },
  });

  const trendingAuthors = authorIds
    .map((id) => {
      const author = authors.find(
        (item) => item.id === id,
      );

      const count =
        trendingAuthorGroups.find(
          (item) =>
            item.authorId === id,
        );

      if (!author) {
        return null;
      }

      return {
        id: author.id,

        name: getLocalizedName(author),

        imageUrl: author.imageUrl,

        quoteCount:
          count?._count.authorId ?? 0,
      };
    })
    .filter(
      (
        author,
      ): author is {
        id: string;
        name: string;
        imageUrl: string | null;
        quoteCount: number;
      } => author !== null,
    );

  // =========================================================
  // Quote Of The Day
  // =========================================================

  const publishedQuotesCount =
    await prisma.quote.count({
      where: {
        status: "PUBLISHED",
      },
    });

  let quoteOfTheDay = null;

  if (publishedQuotesCount > 0) {
    const startDate =
      new Date("2026-01-01");

    const today = new Date();

    const diffInDays = Math.floor(
      (today.getTime() -
        startDate.getTime()) /
        (1000 * 60 * 60 * 24),
    );

    const index =
      diffInDays %
      publishedQuotesCount;

    quoteOfTheDay =
      await prisma.quote.findFirst({
        where: {
          status: "PUBLISHED",
        },

        orderBy: {
          createdAt: "asc",
        },

        skip: index,

        include: {
          author: true,
        },
      });
  }

  const quoteOfTheDayText =
    quoteOfTheDay
      ? getLocalizedQuoteText(
          quoteOfTheDay,
        )
      : null;

  const quoteOfTheDayAuthor =
    quoteOfTheDay?.author
      ? getLocalizedName(
          quoteOfTheDay.author,
        )
      : t("unknownAuthor");

  // =========================================================
  // Trending Tags
  // =========================================================

  const trendingTagGroups =
    await prisma.quoteTag.groupBy({
      by: ["tagId"],

      _count: {
        tagId: true,
      },

      orderBy: {
        _count: {
          tagId: "desc",
        },
      },

      take: 6,
    });

  const tagIds =
    trendingTagGroups.map(
      (item) => item.tagId,
    );

  const tags =
    await prisma.tag.findMany({
      where: {
        id: {
          in: tagIds,
        },
      },

      select: {
        id: true,
        name: true,
        nameEn: true,
        nameAr: true,
        slug: true,
      },
    });

  const trendingTags = tagIds
    .map((id) => {
      const tag = tags.find(
        (item) => item.id === id,
      );

      const count =
        trendingTagGroups.find(
          (item) =>
            item.tagId === id,
        );

      if (!tag) {
        return null;
      }

      return {
        id: tag.id,

        name: getLocalizedName(tag),

        slug: tag.slug,

        quoteCount:
          count?._count.tagId ?? 0,
      };
    })
    .filter(
      (
        tag,
      ): tag is {
        id: string;
        name: string;
        slug: string;
        quoteCount: number;
      } => tag !== null,
    );

  // =========================================================
  // UI
  // =========================================================

  return (
    <div className="min-h-screen w-full flex flex-col overflow-x-hidden lg:h-screen">
      {/* =====================================================
          TOP / HERO
      ====================================================== */}

      <section
        className="
          w-full
          shrink-0
          h-[260px]
          sm:h-[300px]
          md:h-[340px]
          lg:h-[34vh]
          lg:min-h-[300px]
          flex
          flex-col
        "
      >
        {/* ================= Toolbar ================= */}

        <div className="w-full shrink-0 px-2 py-1.5 sm:px-3">
          <div
            className="
              w-full
              flex
              flex-col
              gap-2
              sm:flex-row
              sm:items-center
              sm:justify-between
            "
          >
            {/* Search */}

            <div className="w-full min-w-0 sm:flex-1 sm:max-w-xl">
              <InputGroupKbd
                category={category}
                defaultValue={q ?? ""}
              />
            </div>

            {/* Right Side */}

            <div className="flex items-center justify-between gap-2 sm:justify-end">
              {/* Contact Us */}

              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=ibrahimmoukahla@gmail.com&su=Contact%20Qawl"
                target="_blank"
                rel="noopener noreferrer"
                aria-label={t("contactUs")}
                className="
                  flex
                  items-center
                  justify-center
                  gap-2
                  rounded-full
                  border
                  border-[#8B5CF6]/40
                  bg-[#8B5CF6]/15
                  px-3
                  py-2
                  text-sm
                  text-[#C084FC]
                  backdrop-blur-md
                  transition-all
                  duration-300
                  hover:bg-[#8B5CF6]/25
                  hover:border-[#C084FC]/60
                  whitespace-nowrap
                "
              >
                <MdEmail size={18} />

                <span className="hidden xs:inline sm:inline">
                  {t("contactUs")}
                </span>
              </a>

              <AvatarDropdown />

              <LanguageSwitcher />
            </div>
          </div>
        </div>

        {/* ================= Cover ================= */}

        <div
          className="
            relative
            flex-1
            min-h-0
            w-full
            overflow-hidden
          "
        >
          <Image
            src="/coverHome3.jpg"
            alt={t("coverAlt")}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />

          <div className="absolute inset-0 bg-black/10" />
        </div>
      </section>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <main
        className="
          w-full
          flex-1
          min-h-0
          p-2
          sm:p-3
          grid
          grid-cols-1
          lg:grid-cols-[minmax(0,3fr)_minmax(280px,1fr)]
          gap-2
          lg:gap-3
        "
      >
        {/* ===================================================
            LEFT SIDE
        ==================================================== */}

        <section
          className="
            min-w-0
            flex
            flex-col
            gap-2
            lg:min-h-0
          "
        >
          {/* ================= Categories ================= */}

          <div
            className="
              shrink-0
              rounded-2xl
              border
              border-[#242b5c]
              bg-[#111634]
              px-3
              py-2
              sm:px-4
            "
          >
            <div className="flex items-center justify-between gap-3">
              <h1 className="min-w-0 text-sm sm:text-base font-bold truncate">
                {t("exploreCategories")}
              </h1>

              <Link
                href="/dashboard/categories"
                className="
                  shrink-0
                  flex
                  items-center
                  gap-1
                  text-xs
                  sm:text-sm
                  text-[#8B5CF6]
                  hover:text-[#C084FC]
                  transition
                "
              >
                <span>{t("viewAll")}</span>

                <FaArrowRight
                  size={12}
                  className={
                    locale === "ar"
                      ? "rotate-180"
                      : ""
                  }
                />
              </Link>
            </div>

            {/* Category horizontal scroll */}

            <div className="mt-2 min-w-0 overflow-x-auto scrollbar-none">
              <CategoryFilter
                categories={categories}
                activeCategory={category}
              />
            </div>
          </div>

          {/* ================= Latest Quotes ================= */}

          <div
            className="
              min-w-0
              rounded-2xl
              border
              border-[#282e5c]
              bg-[#080d2e]
              px-2
              py-2
              sm:px-3
              flex
              flex-col
              gap-2
              lg:min-h-0
              lg:flex-1
            "
          >
            {/* Header */}

            <div className="shrink-0 flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-2">
                <SiCdprojekt
                  className="shrink-0 text-[#C084FC]"
                  size={26}
                />

                <span className="font-bold text-sm sm:text-base truncate">
                  {t("latestQuotes")}
                </span>
              </div>
            </div>

            {/* Quotes List */}

            <div
              className="
                min-w-0
                lg:min-h-0
                lg:flex-1
                overflow-visible
                lg:overflow-y-auto
                flex
                flex-col
                gap-3
                scrollbar-none
                pr-0
                lg:pr-1
              "
            >
              {cardQuotes.length > 0 ? (
                cardQuotes.map((quote) => (
                  <CardQuates
                    key={quote.id}
                    quote={quote}
                  />
                ))
              ) : (
                <div className="flex min-h-[180px] items-center justify-center text-sm text-gray-400">
                  {t("noQuotesFound")}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ===================================================
            RIGHT SIDE
        ==================================================== */}

        <aside
          className="
            min-w-0
            flex
            flex-col
            gap-2
            lg:min-h-0
            lg:overflow-y-auto
            scrollbar-none
            pb-1
          "
        >
          {/* =================================================
              Quote Of The Day
          ================================================== */}

          <div
            className="
              rounded-2xl
              border
              border-[#282e5c]
              bg-[#111634]
              p-3
              sm:p-4
            "
          >
            <div className="mb-3 flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[10px] sm:text-xs text-[#8B5CF6] font-semibold uppercase tracking-wider">
                  {t("featured")}
                </p>

                <h2 className="text-base sm:text-lg font-bold">
                  {t("quoteOfTheDay")}
                </h2>
              </div>

              <div
                className="
                  shrink-0
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-full
                  bg-[#8B5CF6]/15
                  border
                  border-[#8B5CF6]/30
                  text-[#C084FC]
                "
              />
            </div>

            <div
              className="
                rounded-xl
                border
                border-[#282e5c]
                bg-[#080d2e]
                p-3
                sm:p-4
              "
            >
              {quoteOfTheDay ? (
                <>
                  <p
                    dir={
                      locale === "ar"
                        ? "rtl"
                        : "ltr"
                    }
                    className="
                      text-sm
                      leading-6
                      text-gray-200
                      italic
                    "
                  >
                    {quoteOfTheDayText}
                  </p>

                  <div className="mt-4 flex items-center justify-between gap-3">
                    <span className="min-w-0 text-sm font-semibold text-[#C084FC] truncate">
                      {quoteOfTheDayAuthor}
                    </span>

                    <Link
                      href={`/dashboard/quotes/${quoteOfTheDay.id}`}
                      className="
                        shrink-0
                        text-xs
                        text-gray-400
                        hover:text-white
                        transition
                      "
                    >
                      {t("viewQuote")}
                    </Link>
                  </div>
                </>
              ) : (
                <p className="text-sm text-gray-400">
                  {t("noQuoteAvailable")}
                </p>
              )}
            </div>
          </div>

          {/* =================================================
              Trending Authors
          ================================================== */}

          <div
            className="
              rounded-2xl
              border
              border-[#282e5c]
              bg-[#111634]
              p-3
              sm:p-4
            "
          >
            <div className="mb-4 flex items-center justify-between gap-3">
              <h2 className="font-bold text-sm sm:text-base">
                {t("trendingAuthors")}
              </h2>

              <Link
                href="/dashboard/authors"
                className="
                  shrink-0
                  text-xs
                  text-[#8B5CF6]
                  hover:text-[#C084FC]
                  transition
                "
              >
                {t("viewAll")}
              </Link>
            </div>

            <div className="flex flex-col gap-3">
              {trendingAuthors.length > 0 ? (
                trendingAuthors.map(
                  (author) => (
                    <Link
                      key={author.id}
                      href={`/dashboard/authors/${author.id}`}
                      className="
                        flex
                        items-center
                        justify-between
                        gap-3
                        rounded-xl
                        p-1
                        transition
                        hover:bg-white/5
                      "
                    >
                      <div className="flex min-w-0 items-center gap-3">
                        {/* Avatar */}

                        <div
                          className="
                            h-10
                            w-10
                            shrink-0
                            overflow-hidden
                            rounded-full
                            bg-[#8B5CF6]/15
                            border
                            border-[#8B5CF6]/30
                            flex
                            items-center
                            justify-center
                          "
                        >
                          {author.imageUrl ? (
                            <img
                              src={author.imageUrl}
                              alt={author.name}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <span className="text-[#C084FC] font-semibold">
                              {author.name.charAt(
                                0,
                              )}
                            </span>
                          )}
                        </div>

                        {/* Author info */}

                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">
                            {author.name}
                          </p>

                          <p className="text-xs text-gray-400">
                            {author.quoteCount}{" "}
                            {author.quoteCount === 1
                              ? t("quote")
                              : t("quotes")}
                          </p>
                        </div>
                      </div>

                      <span className="shrink-0 text-xs text-[#C084FC]">
                        →
                      </span>
                    </Link>
                  ),
                )
              ) : (
                <p className="text-sm text-gray-400">
                  {t("noTrendingAuthors")}
                </p>
              )}
            </div>
          </div>

          {/* =================================================
              Trending Tags
          ================================================== */}

          <div
            className="
              rounded-2xl
              border
              border-[#282e5c]
              bg-[#111634]
              p-3
              sm:p-4
            "
          >
            <div className="mb-3 flex items-center justify-between">
              <h2 className="font-bold text-sm sm:text-base">
                {t("trendingTopics")}
              </h2>
            </div>

            <div className="flex flex-wrap gap-2">
              {trendingTags.length > 0 ? (
                trendingTags.map(
                  (tag) => (
                    <Link
                      key={tag.id}
                      href={`/dashboard/tags/${tag.slug}`}
                      className="
                        rounded-full
                        border
                        border-[#8B5CF6]/30
                        bg-[#8B5CF6]/15
                        px-3
                        py-1.5
                        text-xs
                        text-[#C084FC]
                        transition
                        hover:bg-[#8B5CF6]/25
                      "
                    >
                      #{tag.name}
                    </Link>
                  ),
                )
              ) : (
                <p className="text-sm text-gray-400">
                  {t("noTrendingTopics")}
                </p>
              )}
            </div>
          </div>
        </aside>
      </main>

      {/* =====================================================
          SPEED DIAL
      ====================================================== */}

     <OpenIconSpeedDial isAdmin={isAdmin} />
    </div>
  );
}