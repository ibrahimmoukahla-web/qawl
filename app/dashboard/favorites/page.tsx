import Link from "next/link";

import {
  getLocale,
  getTranslations,
} from "next-intl/server";

import { headers } from "next/headers";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

import RemoveFavoriteButton from "./RemoveFavoriteButton";

export default async function FavoritesPage() {
  // =========================================================
  // LOCALE + TRANSLATIONS
  // =========================================================

  const locale = await getLocale();

  const t = await getTranslations(
    "FavoritesPage",
  );

  // =========================================================
  // SESSION
  // =========================================================

  const session =
    await auth.api.getSession({
      headers: await headers(),
    });

  // =========================================================
  // NOT AUTHENTICATED
  // =========================================================

  if (!session?.user?.id) {
    return (
      <div
        dir={
          locale === "ar"
            ? "rtl"
            : "ltr"
        }
        lang={locale}
        className="flex min-h-screen items-center justify-center bg-[#070B1C]"
      >
        <p className="text-gray-400">
          {t("notAuthenticated")}
        </p>
      </div>
    );
  }

  // =========================================================
  // FAVORITES
  // =========================================================

  const favorites =
    await prisma.favorite.findMany({
      where: {
        userId:
          session.user.id,
      },

      orderBy: {
        createdAt: "desc",
      },

      include: {
        quote: {
          select: {
            id: true,

            // -------------------------------------------------
            // QUOTE
            // -------------------------------------------------

            text: true,
            textEn: true,
            textAr: true,

            imageUrl: true,

            // -------------------------------------------------
            // AUTHOR
            // -------------------------------------------------

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

            // -------------------------------------------------
            // CATEGORY
            // -------------------------------------------------

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
        },
      },
    });

  // =========================================================
  // HELPERS
  // =========================================================

  function getLocalizedText(
    quote: {
      text: string;
      textEn: string | null;
      textAr: string | null;
    },
  ) {
    if (locale === "ar") {
      return (
        quote.textAr?.trim() ||
        quote.text
      );
    }

    return (
      quote.textEn?.trim() ||
      quote.text
    );
  }

  function getLocalizedName(
    entity: {
      name: string;
      nameEn: string | null;
      nameAr: string | null;
    },
  ) {
    if (locale === "ar") {
      return (
        entity.nameAr?.trim() ||
        entity.name
      );
    }

    return (
      entity.nameEn?.trim() ||
      entity.name
    );
  }

  // =========================================================
  // UI
  // =========================================================

  return (
    <main
      dir={
        locale === "ar"
          ? "rtl"
          : "ltr"
      }
      lang={locale}
      className="min-h-screen w-full bg-[#070B1C] px-6 py-8 text-white"
    >
      {/* =====================================================
          HEADER
      ====================================================== */}

      <div className="mb-8">

        <h1 className="text-3xl font-semibold text-white">
          {t("title")}
        </h1>

        <p className="mt-2 text-sm text-gray-400">
          {t("subtitle")}
        </p>

      </div>

      {/* =====================================================
          EMPTY
      ====================================================== */}

      {favorites.length === 0 ? (
        <div className="flex min-h-[400px] items-center justify-center">

          <div className="text-center">

            <div className="mb-4 text-5xl">
              ♡
            </div>

            <h2 className="text-xl font-semibold text-white">
              {t("emptyTitle")}
            </h2>

            <p className="mt-2 text-sm text-gray-400">
              {t("emptyDescription")}
            </p>

            <Link
              href="/dashboard/quotes"
              className="mt-5 inline-block rounded-lg bg-purple-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-purple-500"
            >
              {t("exploreQuotes")}
            </Link>

          </div>
        </div>
      ) : (

        /* ===================================================
           FAVORITES GRID
        ==================================================== */

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">

          {favorites.map(
            (favorite) => {
              const quote =
                favorite.quote;

              // ==============================================
              // LOCALIZED DATA
              // ==============================================

              const displayedText =
                getLocalizedText(
                  quote,
                );

              const displayedAuthor =
                quote.author
                  ? getLocalizedName(
                      quote.author,
                    )
                  : null;

              const displayedCategory =
                quote.category
                  ? getLocalizedName(
                      quote.category,
                    )
                  : null;

              return (
                <article
                  key={
                    quote.id
                  }
                  className="relative rounded-2xl border border-[#282e5c] bg-[#111634] p-5 transition hover:border-purple-500/50"
                >

                  {/* =================================================
                      REMOVE FAVORITE
                  ================================================== */}

                  <div
                    className={
                      locale === "ar"
                        ? "absolute left-4 top-4"
                        : "absolute right-4 top-4"
                    }
                  >
                    <RemoveFavoriteButton
                      quoteId={
                        quote.id
                      }
                    />
                  </div>

                  {/* =================================================
                      IMAGE
                  ================================================== */}

                  {quote.imageUrl && (
                    <div className="mb-4 overflow-hidden rounded-xl">
                      <img
                        src={
                          quote.imageUrl
                        }
                        alt={
                          displayedText
                        }
                        loading="lazy"
                        className="h-48 w-full object-cover"
                      />
                    </div>
                  )}

                  {/* =================================================
                      QUOTE
                  ================================================== */}

                  <Link
                    href={`/dashboard/quotes/${quote.id}`}
                    className="block pr-8"
                  >
                    <p
                      dir={
                        locale === "ar"
                          ? "rtl"
                          : "ltr"
                      }
                      className={`
                        text-lg
                        leading-8
                        text-white
                        ${
                          locale === "ar"
                            ? "text-right font-serif"
                            : "text-left"
                        }
                      `}
                    >
                      “{displayedText}”
                    </p>
                  </Link>

                  {/* =================================================
                      AUTHOR
                  ================================================== */}

                  {quote.author && (
                    <Link
                      href={`/dashboard/authors/${quote.author.slug}`}
                      className={`
                        mt-5
                        block
                        text-sm
                        text-purple-400
                        transition
                        hover:text-purple-300
                        ${
                          locale === "ar"
                            ? "text-right"
                            : "text-left"
                        }
                      `}
                    >
                      {locale === "ar"
                        ? `— ${displayedAuthor}`
                        : `— ${displayedAuthor}`}
                    </Link>
                  )}

                  {/* =================================================
                      CATEGORY
                  ================================================== */}

                  {quote.category && (
                    <div
                      className={`
                        mt-4
                        ${
                          locale === "ar"
                            ? "text-right"
                            : "text-left"
                        }
                      `}
                    >
                      <span
                        className="rounded-full px-3 py-1 text-xs"
                        style={{
                          backgroundColor:
                            `${quote.category.color}20`,
                          color:
                            quote.category.color,
                        }}
                      >
                        {
                          displayedCategory
                        }
                      </span>
                    </div>
                  )}

                </article>
              );
            },
          )}

        </div>
      )}
    </main>
  );
}