"use client";

import React, {
  useEffect,
  useState,
} from "react";

import {
  useLocale,
  useTranslations,
} from "next-intl";

import Avatar from "@mui/material/Avatar";

import {
  RiDoubleQuotesR,
  RiDoubleQuotesL,
} from "react-icons/ri";

import {
  IoBookmarkOutline,
  IoBookmark,
} from "react-icons/io5";

import {
  FaRegHeart,
  FaHeart,
} from "react-icons/fa6";

import { PiShareNetworkBold } from "react-icons/pi";

import {
  toggleLike,
  toggleFavorite,
  recordShare,
} from "@/app/actions/quote";

// =========================================================
// TYPES
// =========================================================

type CardQuoteProps = {
  quote: {
    id: string;

    // -----------------------------------------------------
    // Original quote
    // -----------------------------------------------------

    text: string;

    // -----------------------------------------------------
    // Quote translations
    // -----------------------------------------------------

    textEn: string | null;
    textAr: string | null;

    createdAt: string;

    // -----------------------------------------------------
    // Author
    // -----------------------------------------------------

    author: {
      id: string;
      name: string;
      nameEn: string | null;
      nameAr: string | null;
      imageUrl: string | null;
    } | null;

    // -----------------------------------------------------
    // Category
    // -----------------------------------------------------

    category: {
      id: string;
      name: string;
      nameEn: string | null;
      nameAr: string | null;
    } | null;

    // -----------------------------------------------------
    // User who created/shared quote
    // -----------------------------------------------------

    createdBy: {
      id: string;
      name: string;
      username: string | null;
      image: string | null;
    } | null;

    // -----------------------------------------------------
    // Stats
    // -----------------------------------------------------

    likesCount: number;

    isLiked: boolean;

    isSaved: boolean;
  };
};

// =========================================================
// COMPONENT
// =========================================================

export default function CardQuates({
  quote,
}: CardQuoteProps) {
  const locale = useLocale();

  const t = useTranslations("QuoteCard");

  const [liked, setLiked] =
    useState(quote.isLiked);

  const [saved, setSaved] =
    useState(quote.isSaved);

  const [timeAgo, setTimeAgo] =
    useState("");

  const [likesCount, setLikesCount] =
    useState(
      quote.likesCount ?? 0,
    );

  const [loading, setLoading] =
    useState<
      "like" |
      "save" |
      "share" |
      null
    >(null);

  // =======================================================
  // LOCALIZED QUOTE
  // =======================================================

  const displayedText =
    locale === "ar"
      ? quote.textAr?.trim() ||
        quote.text.trim()
      : quote.textEn?.trim() ||
        quote.text.trim();

  // =======================================================
  // LOCALIZED AUTHOR
  // =======================================================

  const displayedAuthor =
    locale === "ar"
      ? quote.author?.nameAr?.trim() ||
        quote.author?.name ||
        t("unknownAuthor")
      : quote.author?.nameEn?.trim() ||
        quote.author?.name ||
        t("unknownAuthor");

  // =======================================================
  // LOCALIZED CATEGORY
  // =======================================================

  const displayedCategory =
    locale === "ar"
      ? quote.category?.nameAr?.trim() ||
        quote.category?.name ||
        t("general")
      : quote.category?.nameEn?.trim() ||
        quote.category?.name ||
        t("general");

  // =======================================================
  // DIRECTION
  // =======================================================

  const textDirection =
    locale === "ar"
      ? "rtl"
      : "ltr";

  // =======================================================
  // TIME AGO
  // =======================================================

  useEffect(() => {
    const updateTime = () => {
      const diff =
        Date.now() -
        new Date(
          quote.createdAt,
        ).getTime();

      const seconds =
        Math.max(
          0,
          Math.floor(
            diff / 1000,
          ),
        );

      if (seconds < 60) {
        setTimeAgo(
          t("justNow"),
        );
        return;
      }

      const minutes =
        Math.floor(
          seconds / 60,
        );

      if (minutes < 60) {
        setTimeAgo(
          `${minutes}m`,
        );
        return;
      }

      const hours =
        Math.floor(
          minutes / 60,
        );

      if (hours < 24) {
        setTimeAgo(
          `${hours}h`,
        );
        return;
      }

      const days =
        Math.floor(
          hours / 24,
        );

      if (days < 7) {
        setTimeAgo(
          `${days}d`,
        );
        return;
      }

      const weeks =
        Math.floor(
          days / 7,
        );

      if (weeks < 5) {
        setTimeAgo(
          `${weeks}w`,
        );
        return;
      }

      const months =
        Math.floor(
          days / 30,
        );

      if (months < 12) {
        setTimeAgo(
          `${months}mo`,
        );
        return;
      }

      const years =
        Math.floor(
          days / 365,
        );

      setTimeAgo(
        `${years}y`,
      );
    };

    updateTime();

    const interval =
      setInterval(
        updateTime,
        60_000,
      );

    return () =>
      clearInterval(interval);
  }, [
    quote.createdAt,
    t,
  ]);

  // =======================================================
  // LIKE
  // =======================================================

  async function handleLike() {
    if (loading) {
      return;
    }

    setLoading("like");

    try {
      const result =
        await toggleLike(
          quote.id,
        );

      if (
        !result.success ||
        result.liked ===
          undefined
      ) {
        return;
      }

      setLiked(
        result.liked,
      );

      setLikesCount(
        (prev) =>
          result.liked
            ? prev + 1
            : Math.max(
                0,
                prev - 1,
              ),
      );
    } catch (error) {
      console.error(
        "Like failed:",
        error,
      );
    } finally {
      setLoading(null);
    }
  }

  // =======================================================
  // SAVE
  // =======================================================

  async function handleSave() {
    if (loading) {
      return;
    }

    setLoading("save");

    try {
      const result =
        await toggleFavorite(
          quote.id,
        );

      if (
        !result.success ||
        result.saved ===
          undefined
      ) {
        return;
      }

      setSaved(
        result.saved,
      );
    } catch (error) {
      console.error(
        "Save failed:",
        error,
      );
    } finally {
      setLoading(null);
    }
  }

  // =======================================================
  // SHARE
  // =======================================================

  async function handleShare() {
    if (loading) {
      return;
    }

    setLoading("share");

    try {
      const url =
        new URL(
          window.location.href,
        );

      url.searchParams.set(
        "quote",
        quote.id,
      );

      const shareUrl =
        url.toString();

      if (
        navigator.share &&
        typeof navigator.share ===
          "function"
      ) {
        await navigator.share({
          title:
            displayedAuthor ||
            t("quote"),

          text:
            displayedText,

          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(
          shareUrl,
        );

        alert(
          t("linkCopied"),
        );
      }

      await recordShare(
        quote.id,
      );
    } catch (error) {
      console.error(
        "Share failed:",
        error,
      );
    } finally {
      setLoading(null);
    }
  }

  // =======================================================
  // RENDER
  // =======================================================

  return (
    <div className="bg-[#11173d] border border-[#242b5c] rounded-2xl">
      <div className="w-full rounded-2xl overflow-hidden">

        {/* =================================================
            AUTHOR
        ================================================== */}

        <div className="flex gap-3 px-2 py-1">

          <Avatar
            alt={displayedAuthor}
            src={
              quote.author?.imageUrl ??
              undefined
            }
            sx={{
              width: 40,
              height: 40,
            }}
          />

          <div className="flex flex-col min-w-0">

            <span className="font-bold text-[16px] truncate">
              {displayedAuthor}
            </span>

            <p className="text-[13px] text-[#686D8F] truncate">
              {displayedCategory}
            </p>

          </div>
        </div>

        {/* =================================================
            QUOTE
        ================================================== */}

        <div className="flex flex-col gap-1 px-6 mb-2">

          <div className="flex justify-between items-start gap-3">

            <div
              dir={textDirection}
              className="quote italic flex gap-2 max-w-120 min-w-0"
            >

              <RiDoubleQuotesL
                className="shrink-0"
              />

              <div className="min-w-0">

                <span>
                  {displayedText}
                </span>

                <div className="text-[12px] font-semibold mt-1 not-italic">
                  {t("sharedBy")}{" "}

                  {quote.createdBy?.name ??
                    t("unknownUser")}
                </div>

              </div>

              <RiDoubleQuotesR
                className="shrink-0"
              />

            </div>

            <div
              dir="ltr"
              className="text-[13px] text-[#686D8F] shrink-0"
            >
              {timeAgo}
            </div>

          </div>

          {/* =================================================
              CATEGORY
          ================================================== */}

          <div className="bg-purple-500/15 border border-purple-400/30 backdrop-blur-md rounded-xl w-fit py-1 px-2 text-sm">

            {displayedCategory}

          </div>

        </div>

        {/* =================================================
            LINE
        ================================================== */}

        <div className="flex">

          <div className="flex-1 h-[0.3px] bg-[#4e5479] rounded-full mx-2" />

        </div>

        {/* =================================================
            ACTIONS
        ================================================== */}

        <div className="flex justify-between p-2">

          <div className="flex gap-2">

            {/* =================================================
                LIKE
            ================================================== */}

            <button
              type="button"
              onClick={handleLike}
              disabled={
                loading !== null
              }
              aria-label={t("like")}
              className={`
                flex gap-1 items-center
                transition-all duration-200
                active:scale-90
                ${
                  liked
                    ? "text-red-500"
                    : "text-gray-300 hover:text-red-400"
                }
              `}
            >

              {liked ? (
                <FaHeart />
              ) : (
                <FaRegHeart />
              )}

              <span className="text-[13px]">
                {likesCount}
              </span>

            </button>

            {/* Separator */}

            <div className="w-[0.3px] bg-[#686D8F] rounded-full" />

            {/* =================================================
                SAVE
            ================================================== */}

            <button
              type="button"
              onClick={handleSave}
              disabled={
                loading !== null
              }
              aria-label={
                saved
                  ? t("saved")
                  : t("save")
              }
              className={`
                flex gap-1 items-center
                transition-all duration-200
                active:scale-90
                ${
                  saved
                    ? "text-[#C084FC]"
                    : "text-gray-300 hover:text-[#C084FC]"
                }
              `}
            >

              {saved ? (
                <IoBookmark />
              ) : (
                <IoBookmarkOutline />
              )}

              <span className="text-[13px]">
                {saved
                  ? t("saved")
                  : t("save")}
              </span>

            </button>

          </div>

          {/* =================================================
              SHARE
          ================================================== */}

          <button
            type="button"
            onClick={handleShare}
            disabled={
              loading !== null
            }
            aria-label={t("share")}
            className="
              text-gray-300
              hover:text-[#C084FC]
              transition-all duration-200
              active:scale-90
            "
          >
            <PiShareNetworkBold
              size={19}
            />
          </button>

        </div>
      </div>
    </div>
  );
}