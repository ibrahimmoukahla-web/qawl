import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import { notFound } from "next/navigation";

import {
  ArrowLeft,
  CalendarDays,
  ExternalLink,
  Tag,
  UserRound,
  Quote as QuoteIcon,
} from "lucide-react";

import { getLocale, getTranslations } from "next-intl/server";

import QuoteActions from "./QuoteActions";

import { prisma } from "@/lib/prisma";
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

function getLocalizedText(
  text: string,
  textEn: string | null,
  textAr: string | null,
  locale: string,
) {
  if (locale === "ar") {
    return textAr?.trim() || text.trim();
  }

  return textEn?.trim() || text.trim();
}

function getLocalizedName(
  name: string,
  nameEn: string | null,
  nameAr: string | null,
  locale: string,
) {
  if (locale === "ar") {
    return nameAr?.trim() || name.trim();
  }

  return nameEn?.trim() || name.trim();
}

function getLocalizedBio(
  bio: string | null,
  bioEn: string | null,
  bioAr: string | null,
  locale: string,
) {
  if (locale === "ar") {
    return bioAr?.trim() || bio?.trim() || "";
  }

  return bioEn?.trim() || bio?.trim() || "";
}

// ==========================================================
// PAGE
// ==========================================================

export default async function QuotePage({
  params,
}: QuotePageProps) {
  const { id } = await params;

  const locale = await getLocale();
  const t = await getTranslations("QuotePage");

  // ========================================================
  // AUTH
  // ========================================================

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userId = session?.user?.id ?? "";

  // ========================================================
  // GET QUOTE
  // ========================================================

  const quote = await prisma.quote.findUnique({
    where: {
      id,
    },

    select: {
      id: true,
      text: true,
      textEn: true,
      textAr: true,
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
          nameEn: true,
          nameAr: true,
          slug: true,
          bio: true,
          bioEn: true,
          bioAr: true,
          imageUrl: true,
        },
      },

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

      tags: {
        select: {
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
          quoteId: true,
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
  // LOCALIZED CONTENT
  // ========================================================

  const displayedText = getLocalizedText(
    quote.text,
    quote.textEn,
    quote.textAr,
    locale,
  );

  const displayedAuthor = quote.author
    ? getLocalizedName(
        quote.author.name,
        quote.author.nameEn,
        quote.author.nameAr,
        locale,
      )
    : "";

  const displayedAuthorBio = quote.author
    ? getLocalizedBio(
        quote.author.bio,
        quote.author.bioEn,
        quote.author.bioAr,
        locale,
      )
    : "";

  const displayedCategory = quote.category
    ? getLocalizedName(
        quote.category.name,
        quote.category.nameEn,
        quote.category.nameAr,
        locale,
      )
    : "";

  const tags = quote.tags.map((item) => ({
    ...item.tag,
    displayName: getLocalizedName(
      item.tag.name,
      item.tag.nameEn,
      item.tag.nameAr,
      locale,
    ),
  }));

  const quoteDirection = isArabicText(displayedText)
    ? "rtl"
    : "ltr";

  const publishedDate = new Intl.DateTimeFormat(
    locale === "ar" ? "ar-DZ" : "en-US",
    {
      day: "numeric",
      month: "long",
      year: "numeric",
    },
  ).format(new Date(quote.createdAt));

  const fallbackAuthorInitial =
    displayedAuthor?.charAt(0)?.toUpperCase() || "?";

  // ========================================================
  // RENDER
  // ========================================================

  return (
    <div
      dir={locale === "ar" ? "rtl" : "ltr"}
      lang={locale}
      className="
        min-h-screen
        w-full
        min-w-0
        overflow-x-hidden
        bg-[#070B1C]
        text-white
      "
    >
      {/* ====================================================
          HEADER
      ==================================================== */}

      <header
        className="
          sticky
          top-0
          z-30
          border-b
          border-[#282e5c]/50
          bg-[#070B1C]/85
          backdrop-blur-xl
        "
      >
        <div
          className="
            mx-auto
            flex
            h-[68px]
            w-full
            max-w-[1280px]
            items-center
            justify-between
            gap-4
            px-4
            sm:px-6
            lg:px-8
          "
        >
          <Link
            href="/dashboard/quotes"
            className="
              group
              inline-flex
              items-center
              gap-2.5
              rounded-xl
              border
              border-[#282e5c]/60
              bg-[#111634]/70
              px-3
              py-2
              text-sm
              text-gray-400
              transition
              hover:border-[#8B5CF6]/30
              hover:bg-[#111634]
              hover:text-white
            "
          >
            <ArrowLeft
              size={17}
              className={`
                shrink-0
                transition-transform
                duration-200
                group-hover:-translate-x-0.5
                ${locale === "ar" ? "rotate-180" : ""}
              `}
            />

            <span>{t("backToQuotes")}</span>
          </Link>

          <div className="hidden items-center gap-3 sm:flex">
            <span
              className="
                rounded-full
                border
                border-[#282e5c]
                bg-[#111634]
                px-3
                py-1.5
                text-[10px]
                font-semibold
                uppercase
                tracking-[0.2em]
                text-gray-500
              "
            >
              {t("quoteLabel")}
            </span>

            <span className="text-[10px] font-semibold uppercase tracking-[0.25em] text-gray-700">
              QAWL
            </span>
          </div>
        </div>
      </header>

      {/* ====================================================
          CONTENT
      ==================================================== */}

      <main
        className="
          mx-auto
          w-full
          max-w-[1280px]
          px-3
          py-5
          sm:px-6
          sm:py-7
          lg:px-8
          lg:py-10
        "
      >
        <div
          className="
            grid
            min-w-0
            items-start
            gap-5
            lg:grid-cols-[minmax(0,1fr)_320px]
            lg:gap-7
          "
        >
          {/* ==================================================
              MAIN QUOTE
          ================================================== */}

          <article
            className="
              min-w-0
              overflow-hidden
              rounded-[28px]
              border
              border-[#282e5c]/70
              bg-[#111634]
              shadow-[0_25px_80px_rgba(0,0,0,0.25)]
              sm:rounded-[32px]
            "
          >
            {/* IMAGE */}

            {quote.imageUrl && (
              <div
                className="
                  relative
                  w-full
                  overflow-hidden
                  bg-[#080D26]
                "
              >
                <img
                  src={quote.imageUrl}
                  alt={displayedText}
                  className="
                    block
                    max-h-[620px]
                    w-full
                    object-cover
                    object-center
                  "
                />

                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#111634] via-[#111634]/30 to-transparent" />
              </div>
            )}

            {/* QUOTE BODY */}

            <div
              className="
                relative
                min-w-0
                p-5
                sm:p-8
                md:p-10
                lg:p-12
              "
            >
              {/* DECORATION */}

              <div className="pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full bg-purple-500/10 blur-[100px]" />

              <div className="relative min-w-0">
                {/* TOP ROW */}

                <div className="mb-7 flex items-center justify-between gap-4">
                  <div
                    className="
                      flex
                      h-11
                      w-11
                      shrink-0
                      items-center
                      justify-center
                      rounded-2xl
                      bg-[#8B5CF6]/10
                      text-[#C084FC]
                    "
                  >
                    <QuoteIcon size={21} />
                  </div>

                  {quote.status && (
                    <span
                      className="
                        rounded-full
                        border
                        border-[#282e5c]
                        bg-[#080D26]
                        px-3
                        py-1.5
                        text-[10px]
                        font-medium
                        uppercase
                        tracking-[0.14em]
                        text-gray-600
                      "
                    >
                      {quote.status}
                    </span>
                  )}
                </div>

                {/* CATEGORY */}

                {quote.category && (
                  <div className="mb-7">
                    <Link
                      href={`/dashboard/quotes?category=${quote.category.slug}`}
                      className="
                        inline-flex
                        max-w-full
                        items-center
                        gap-2
                        rounded-full
                        border
                        px-3.5
                        py-2
                        text-[11px]
                        font-medium
                        transition
                        hover:brightness-125
                      "
                      style={{
                        borderColor: `${quote.category.color}55`,
                        backgroundColor: `${quote.category.color}10`,
                        color: quote.category.color,
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
                    </Link>
                  </div>
                )}

                {/* TEXT */}

                <div
                  dir={quoteDirection}
                  lang={locale}
                  className={
                    quoteDirection === "rtl"
                      ? "text-right"
                      : "text-left"
                  }
                >
                  <p
                    className={`
                      break-words
                      text-gray-50
                      ${
                        quoteDirection === "rtl"
                          ? "font-serif text-[1.45rem] leading-[2.05] sm:text-[1.8rem] sm:leading-[2.05]"
                          : "text-[1.35rem] leading-[1.75] sm:text-[1.7rem] sm:leading-[1.8]"
                      }
                    `}
                  >
                    “{displayedText}”
                  </p>
                </div>

                {/* DIVIDER */}

                <div className="my-9 h-px bg-[#282e5c]/60 sm:my-10" />

                {/* AUTHOR */}

                {quote.author ? (
                  <Link
                    href={`/dashboard/authors/${quote.author.slug}`}
                    className="
                      group
                      flex
                      max-w-full
                      items-center
                      gap-3
                      rounded-2xl
                      border
                      border-transparent
                      p-2
                      transition
                      hover:border-[#282e5c]
                      hover:bg-[#080D26]
                    "
                  >
                    {quote.author.imageUrl ? (
                      <img
                        src={quote.author.imageUrl}
                        alt={displayedAuthor}
                        className="
                          h-12
                          w-12
                          shrink-0
                          rounded-full
                          object-cover
                          ring-2
                          ring-[#8B5CF6]/15
                        "
                      />
                    ) : (
                      <div
                        className="
                          flex
                          h-12
                          w-12
                          shrink-0
                          items-center
                          justify-center
                          rounded-full
                          bg-[#8B5CF6]/10
                          font-semibold
                          text-[#C084FC]
                        "
                      >
                        {fallbackAuthorInitial}
                      </div>
                    )}

                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold text-white transition group-hover:text-[#C084FC]">
                        {displayedAuthor}
                      </p>

                      <p className="mt-1 truncate text-xs text-gray-600">
                        @{quote.author.slug}
                      </p>
                    </div>
                  </Link>
                ) : (
                  <div className="flex items-center gap-3 text-sm text-gray-600">
                    <div
                      className="
                        flex
                        h-12
                        w-12
                        shrink-0
                        items-center
                        justify-center
                        rounded-full
                        bg-[#282e5c]/40
                      "
                    >
                      <UserRound size={18} />
                    </div>

                    <span>{t("unknownAuthor")}</span>
                  </div>
                )}

                {/* TAGS */}

                {tags.length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Link
                        key={tag.id}
                        href={`/dashboard/quotes?q=${encodeURIComponent(
                          tag.displayName,
                        )}`}
                        className="
                          rounded-full
                          border
                          border-[#282e5c]
                          bg-[#080D26]
                          px-3
                          py-1.5
                          text-xs
                          text-gray-500
                          transition
                          hover:border-[#8B5CF6]/30
                          hover:text-[#C084FC]
                        "
                      >
                        #{tag.displayName}
                      </Link>
                    ))}
                  </div>
                )}

                {/* SOURCE */}

                {quote.source && (
                  <div
                    className="
                      mt-8
                      rounded-2xl
                      border
                      border-[#282e5c]/50
                      bg-[#080D26]/70
                      p-4
                    "
                  >
                    <p
                      className="
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[0.18em]
                        text-gray-700
                      "
                    >
                      {t("source")}
                    </p>

                    {quote.sourceUrl ? (
                      <a
                        href={quote.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="
                          mt-2
                          inline-flex
                          max-w-full
                          items-center
                          gap-2
                          text-sm
                          text-gray-500
                          transition
                          hover:text-[#C084FC]
                        "
                      >
                        <span className="truncate">
                          {quote.source}
                        </span>

                        <ExternalLink
                          size={14}
                          className="shrink-0"
                        />
                      </a>
                    ) : (
                      <p className="mt-2 text-sm text-gray-500">
                        {quote.source}
                      </p>
                    )}
                  </div>
                )}

                {/* DATE */}

                <div
                  className="
                    mt-7
                    flex
                    items-center
                    gap-2
                    text-xs
                    text-gray-700
                  "
                >
                  <CalendarDays
                    size={14}
                    className="shrink-0"
                  />

                  <span>
                    {t("published", {
                      date: publishedDate,
                    })}
                  </span>
                </div>
              </div>
            </div>
          </article>

          {/* ==================================================
              RIGHT SIDE
          ================================================== */}

          <aside className="min-w-0">
            <div className="space-y-4 lg:sticky lg:top-[88px]">
              {/* ACTIONS */}

              <section
                className="
                  rounded-3xl
                  border
                  border-[#282e5c]/70
                  bg-[#111634]
                  p-4
                  sm:p-5
                "
              >
                <div className="mb-4">
                  <p
                    className="
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-[0.18em]
                      text-gray-600
                    "
                  >
                    {t("actions")}
                  </p>

                  <h2 className="mt-1 text-base font-semibold text-white">
                    {t("interactWithQuote")}
                  </h2>
                </div>

                <QuoteActions
                  quoteId={quote.id}
                  initialLiked={
                    quote.interactions.length > 0
                  }
                  initialSaved={
                    quote.favorites.length > 0
                  }
                  initialLikesCount={
                    quote._count.interactions
                  }
                />
              </section>

              {/* AUTHOR CARD */}

              {quote.author && (
                <section
                  className="
                    rounded-3xl
                    border
                    border-[#282e5c]/70
                    bg-[#111634]
                    p-4
                    sm:p-5
                  "
                >
                  <p
                    className="
                      mb-4
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-[0.18em]
                      text-gray-600
                    "
                  >
                    {t("aboutAuthor")}
                  </p>

                  <Link
                    href={`/dashboard/authors/${quote.author.slug}`}
                    className="group block"
                  >
                    <div className="flex items-center gap-3">
                      {quote.author.imageUrl ? (
                        <img
                          src={quote.author.imageUrl}
                          alt={displayedAuthor}
                          className="
                            h-12
                            w-12
                            shrink-0
                            rounded-full
                            object-cover
                          "
                        />
                      ) : (
                        <div
                          className="
                            flex
                            h-12
                            w-12
                            shrink-0
                            items-center
                            justify-center
                            rounded-full
                            bg-[#8B5CF6]/10
                            font-semibold
                            text-[#C084FC]
                          "
                        >
                          {fallbackAuthorInitial}
                        </div>
                      )}

                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold transition group-hover:text-[#C084FC]">
                          {displayedAuthor}
                        </p>

                        <p className="mt-1 text-xs text-gray-600">
                          {t("viewAuthor")}
                        </p>
                      </div>
                    </div>

                    {displayedAuthorBio && (
                      <p className="mt-4 line-clamp-4 text-xs leading-6 text-gray-600">
                        {displayedAuthorBio}
                      </p>
                    )}
                  </Link>
                </section>
              )}

              {/* CATEGORY */}

              {quote.category && (
                <section
                  className="
                    rounded-3xl
                    border
                    border-[#282e5c]/70
                    bg-[#111634]
                    p-4
                    sm:p-5
                  "
                >
                  <p
                    className="
                      mb-4
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-[0.18em]
                      text-gray-600
                    "
                  >
                    {t("category")}
                  </p>

                  <Link
                    href={`/dashboard/quotes?category=${quote.category.slug}`}
                    className="
                      flex
                      items-center
                      gap-3
                      rounded-xl
                      border
                      border-[#282e5c]
                      bg-[#080D26]
                      p-3
                      transition
                      hover:border-[#8B5CF6]/30
                    "
                  >
                    <span
                      className="h-3 w-3 shrink-0 rounded-full"
                      style={{
                        backgroundColor:
                          quote.category.color,
                      }}
                    />

                    <span
                      className="truncate text-sm"
                      style={{
                        color: quote.category.color,
                      }}
                    >
                      {displayedCategory}
                    </span>
                  </Link>
                </section>
              )}

              {/* TAGS */}

              {tags.length > 0 && (
                <section
                  className="
                    rounded-3xl
                    border
                    border-[#282e5c]/70
                    bg-[#111634]
                    p-4
                    sm:p-5
                  "
                >
                  <div className="mb-4 flex items-center gap-2">
                    <Tag
                      size={14}
                      className="text-gray-600"
                    />

                    <p
                      className="
                        text-[10px]
                        font-semibold
                        uppercase
                        tracking-[0.18em]
                        text-gray-600
                      "
                    >
                      {t("tags")}
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Link
                        key={tag.id}
                        href={`/dashboard/quotes?q=${encodeURIComponent(
                          tag.displayName,
                        )}`}
                        className="
                          rounded-full
                          border
                          border-[#282e5c]
                          bg-[#080D26]
                          px-3
                          py-1.5
                          text-[11px]
                          text-gray-500
                          transition
                          hover:border-[#8B5CF6]/30
                          hover:text-[#C084FC]
                        "
                      >
                        #{tag.displayName}
                      </Link>
                    ))}
                  </div>
                </section>
              )}

              {/* META */}

              <section
                className="
                  rounded-3xl
                  border
                  border-[#282e5c]/50
                  bg-[#0c1233]
                  px-4
                  py-3.5
                "
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs text-gray-600">
                    {t("likes")}
                  </span>

                  <span className="text-sm font-semibold text-gray-300">
                    {quote._count.interactions}
                  </span>
                </div>

                <div className="my-3 h-px bg-[#282e5c]/50" />

                <div className="flex items-center justify-between gap-4">
                  <span className="text-xs text-gray-600">
                    {t("favorites")}
                  </span>

                  <span className="text-sm font-semibold text-gray-300">
                    {quote._count.favorites}
                  </span>
                </div>
              </section>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}