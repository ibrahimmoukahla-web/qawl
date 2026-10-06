import Link from "next/link";

import {
  ArrowRight,
  Search,
  UserRound,
  Users,
  X,
} from "lucide-react";

import {
  getLocale,
  getTranslations,
} from "next-intl/server";

import { prisma } from "@/lib/prisma";

// =========================================================
// TYPES
// =========================================================

type AuthorsPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

// =========================================================
// PAGE
// =========================================================

export default async function AuthorsPage({
  searchParams,
}: AuthorsPageProps) {
  // =======================================================
  // LOCALE + TRANSLATIONS
  // =======================================================

  const locale = await getLocale();

  const t = await getTranslations(
    "AuthorsPage",
  );

  // =======================================================
  // SEARCH PARAM
  // =======================================================

  const params = await searchParams;

  const search =
    typeof params.q === "string"
      ? params.q.trim()
      : "";

  // =======================================================
  // AUTHORS
  // =======================================================

  const authors =
    await prisma.author.findMany({
      where: search
        ? {
            OR: [
              // ------------------------------------------------
              // ORIGINAL NAME
              // ------------------------------------------------

              {
                name: {
                  contains: search,
                  mode: "insensitive",
                },
              },

              // ------------------------------------------------
              // ENGLISH NAME
              // ------------------------------------------------

              {
                nameEn: {
                  contains: search,
                  mode: "insensitive",
                },
              },

              // ------------------------------------------------
              // ARABIC NAME
              // ------------------------------------------------

              {
                nameAr: {
                  contains: search,
                  mode: "insensitive",
                },
              },

              // ------------------------------------------------
              // ORIGINAL BIO
              // ------------------------------------------------

              {
                bio: {
                  contains: search,
                  mode: "insensitive",
                },
              },

              // ------------------------------------------------
              // ENGLISH BIO
              // ------------------------------------------------

              {
                bioEn: {
                  contains: search,
                  mode: "insensitive",
                },
              },

              // ------------------------------------------------
              // ARABIC BIO
              // ------------------------------------------------

              {
                bioAr: {
                  contains: search,
                  mode: "insensitive",
                },
              },
            ],
          }
        : undefined,

      // -------------------------------------------------------
      // ORDER
      // -------------------------------------------------------

      orderBy: {
        name: "asc",
      },

      // -------------------------------------------------------
      // SELECT
      // -------------------------------------------------------

      select: {
        id: true,

        // Original
        name: true,

        // Translations
        nameEn: true,
        nameAr: true,

        // Slug
        slug: true,

        // Original bio
        bio: true,

        // Translations
        bioEn: true,
        bioAr: true,

        // Image
        imageUrl: true,

        // Quotes count
        _count: {
          select: {
            quotes: true,
          },
        },
      },
    });

  // =======================================================
  // HELPERS
  // =======================================================

  function getLocalizedName(author: {
    name: string;
    nameEn: string | null;
    nameAr: string | null;
  }) {
    if (locale === "ar") {
      return (
        author.nameAr?.trim() ||
        author.name
      );
    }

    return (
      author.nameEn?.trim() ||
      author.name
    );
  }

  function getLocalizedBio(author: {
    bio: string | null;
    bioEn: string | null;
    bioAr: string | null;
  }) {
    if (locale === "ar") {
      return (
        author.bioAr?.trim() ||
        author.bio?.trim() ||
        t("defaultBio")
      );
    }

    return (
      author.bioEn?.trim() ||
      author.bio?.trim() ||
      t("defaultBio")
    );
  }

  // =======================================================
  // UI
  // =======================================================

  return (
    <div
      dir={
        locale === "ar"
          ? "rtl"
          : "ltr"
      }
      lang={locale}
      className="min-h-full w-full min-w-0 bg-[#070B1C] text-white"
    >
      {/* =====================================================
          HEADER
      ====================================================== */}

      <header className="border-b border-[#282e5c]/50 bg-[#070B1C]/90 backdrop-blur-xl">
        <div className="mx-auto flex min-h-[72px] w-full max-w-[1500px] items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">

          {/* LEFT */}

          <div className="flex min-w-0 items-center gap-3">

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#8B5CF6]/10 text-[#C084FC]">
              <Users size={20} />
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

          {/* COUNT */}

          <div className="shrink-0 rounded-full border border-[#282e5c] bg-[#111634] px-3 py-1.5 text-xs text-gray-500">
            {authors.length}{" "}
            {authors.length === 1
              ? t("author")
              : t("authors")}
          </div>

        </div>
      </header>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <main className="mx-auto w-full min-w-0 max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">

        {/* ===================================================
            INTRO
        ==================================================== */}

        <section className="mb-8">

          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A78BFA]">
            {t("sectionLabel")}
          </p>

          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {t("heading")}
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
            {t("description")}
          </p>

        </section>

        {/* ===================================================
            SEARCH
        ==================================================== */}

        <form
          method="GET"
          className="mb-8 w-full min-w-0"
        >
          <div className="flex w-full min-w-0 items-center gap-2 rounded-2xl border border-[#282e5c]/60 bg-[#111634] px-4">

            <Search
              size={17}
              className="shrink-0 text-gray-600"
            />

            <input
              type="search"
              name="q"
              defaultValue={search}
              placeholder={t(
                "searchPlaceholder",
              )}
              autoComplete="off"
              className="h-12 min-w-0 flex-1 bg-transparent px-2 text-sm text-gray-200 outline-none placeholder:text-gray-700"
            />

            {search && (
              <Link
                href="/dashboard/authors"
                aria-label={t(
                  "clearSearch",
                )}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-600 transition hover:bg-[#080D26] hover:text-white"
              >
                <X size={15} />
              </Link>
            )}

          </div>
        </form>

        {/* ===================================================
            SEARCH RESULT MESSAGE
        ==================================================== */}

        {search && (
          <div className="mb-5 text-xs text-gray-600">
            {t("searchResultsFor")}{" "}
            <span className="text-gray-400">
              "{search}"
            </span>{" "}
            —{" "}
            <span className="text-gray-400">
              {authors.length}
            </span>
          </div>
        )}

        {/* ===================================================
            EMPTY
        ==================================================== */}

        {authors.length === 0 ? (
          <section className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-dashed border-[#282e5c] bg-[#0B102B] px-6 text-center">

            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#8B5CF6]/10 text-[#C084FC]">
              <UserRound size={27} />
            </div>

            <h3 className="text-lg font-semibold">
              {search
                ? t("noSearchResults")
                : t("emptyTitle")}
            </h3>

            <p className="mt-2 max-w-md text-sm leading-6 text-gray-600">
              {search
                ? t("noSearchResultsDescription")
                : t("emptyDescription")}
            </p>

            {search ? (
              <Link
                href="/dashboard/authors"
                className="mt-6 rounded-xl bg-[#8B5CF6] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#7C3AED]"
              >
                {t("viewAllAuthors")}
              </Link>
            ) : (
              <Link
                href="/dashboard/authors/create"
                className="mt-6 rounded-xl bg-[#8B5CF6] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#7C3AED]"
              >
                {t("createAuthor")}
              </Link>
            )}

          </section>
        ) : (

          /* =================================================
             AUTHORS GRID
          ================================================= */

          <div className="grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">

            {authors.map((author) => {

              // =================================================
              // LOCALIZED DATA
              // =================================================

              const displayedName =
                getLocalizedName(
                  author,
                );

              const displayedBio =
                getLocalizedBio(
                  author,
                );

              return (
                <Link
                  key={author.id}
                  href={`/dashboard/authors/${author.slug}`}
                  className="group min-w-0 overflow-hidden rounded-3xl border border-[#282e5c]/60 bg-[#111634] transition duration-300 hover:-translate-y-1 hover:border-[#8B5CF6]/30 hover:bg-[#14193B] hover:shadow-[0_20px_60px_rgba(0,0,0,0.25)]"
                >

                  {/* =================================================
                      TOP AREA
                  ================================================== */}

                  <div className="relative flex h-32 items-end overflow-hidden bg-gradient-to-br from-[#161B43] via-[#101535] to-[#080D26]">

                    <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-purple-500/10 blur-3xl" />

                    {/* BADGE */}

                    <div
                      className={`
                        absolute
                        top-5
                        ${
                          locale === "ar"
                            ? "right-5"
                            : "left-5"
                        }
                      `}
                    >
                      <span className="rounded-full border border-white/[0.06] bg-black/20 px-2.5 py-1 text-[10px] text-gray-500 backdrop-blur-md">
                        {t("authorBadge")}
                      </span>
                    </div>

                    {/* =================================================
                        AVATAR
                    ================================================== */}

                    <div
                      className={`
                        absolute
                        top-[68px]
                        ${
                          locale === "ar"
                            ? "right-5"
                            : "left-5"
                        }
                      `}
                    >

                      {author.imageUrl ? (
                        <img
                          src={
                            author.imageUrl
                          }
                          alt={
                            displayedName
                          }
                          loading="lazy"
                          className="h-20 w-20 rounded-2xl border-4 border-[#111634] object-cover shadow-xl"
                        />
                      ) : (
                        <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-[#111634] bg-[#8B5CF6]/10 text-2xl font-semibold text-[#C084FC] shadow-xl">
                          {displayedName
                            .charAt(0)
                            .toUpperCase()}
                        </div>
                      )}

                    </div>
                  </div>

                  {/* =================================================
                      BODY
                  ================================================== */}

                  <div className="min-w-0 px-5 pb-5 pt-12">

                    <div className="flex items-start justify-between gap-3">

                      <div className="min-w-0">

                        <h3
                          dir={
                            locale === "ar"
                              ? "rtl"
                              : "ltr"
                          }
                          className={`
                            truncate
                            text-base
                            font-semibold
                            text-white
                            transition
                            group-hover:text-[#C084FC]
                            ${
                              locale === "ar"
                                ? "text-right"
                                : "text-left"
                            }
                          `}
                        >
                          {
                            displayedName
                          }
                        </h3>

                        <p
                          dir="ltr"
                          className="mt-1 truncate text-xs text-gray-600"
                        >
                          @{author.slug}
                        </p>

                      </div>

                      <ArrowRight
                        size={17}
                        className={`
                          mt-1
                          shrink-0
                          text-gray-700
                          transition
                          duration-300
                          group-hover:text-[#C084FC]
                          ${
                            locale === "ar"
                              ? "rotate-180 group-hover:-translate-x-1"
                              : "group-hover:translate-x-1"
                          }
                        `}
                      />

                    </div>

                    {/* =================================================
                        BIO
                    ================================================== */}

                    <p
                      dir={
                        locale === "ar"
                          ? "rtl"
                          : "ltr"
                      }
                      className={`
                        mt-4
                        line-clamp-3
                        text-sm
                        leading-6
                        text-gray-500
                        ${
                          locale === "ar"
                            ? "text-right"
                            : "text-left"
                        }
                      `}
                    >
                      {displayedBio}
                    </p>

                    {/* =================================================
                        FOOTER
                    ================================================== */}

                    <div className="mt-5 flex items-center justify-between border-t border-[#282e5c]/50 pt-4">

                      <span className="text-xs text-gray-600">
                        {t("quotes")}
                      </span>

                      <span className="rounded-full border border-[#282e5c] bg-[#080D26] px-2.5 py-1 text-xs font-medium text-[#C084FC]">
                        {
                          author
                            ._count
                            .quotes
                        }
                      </span>

                    </div>

                  </div>
                </Link>
              );
            })}

          </div>
        )}

      </main>
    </div>
  );
}

