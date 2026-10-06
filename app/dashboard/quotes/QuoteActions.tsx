"use client";

import Link from "next/link";

import {
  ArrowUpRight,
  Check,
  Copy,
  Heart,
  Share2,
} from "lucide-react";

import {
  useState,
  useTransition,
} from "react";

import {
  useLocale,
  useTranslations,
} from "next-intl";

import {
  toggleFavoriteAction,
} from "@/app/dashboard/quotes/actions";

type QuoteActionsProps = {
  quoteId: string;
  quoteText: string;
  authorName?: string | null;
  quoteHref: string;
  initialFavorite?: boolean;
};

export default function QuoteActions({
  quoteId,
  quoteText,
  authorName,
  quoteHref,
  initialFavorite = false,
}: QuoteActionsProps) {
  const locale = useLocale();

  const t = useTranslations(
    "QuoteActions",
  );

  const [saved, setSaved] =
    useState(initialFavorite);

  const [copied, setCopied] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [
    isPending,
    startTransition,
  ] = useTransition();

  // ==========================================================
  // COPY
  // ==========================================================

  async function handleCopy() {
    try {
      const textToCopy = authorName
        ? `“${quoteText}” — ${authorName}`
        : `“${quoteText}”`;

      await navigator.clipboard.writeText(
        textToCopy,
      );

      setCopied(true);
      setMessage("");

      window.setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      setMessage(
        t("copyFailed"),
      );
    }
  }

  // ==========================================================
  // FAVORITE
  // ==========================================================

  function handleFavorite() {
    if (isPending) {
      return;
    }

    const previousSaved =
      saved;

    // Optimistic UI
    setSaved(!saved);
    setMessage("");

    startTransition(async () => {
      try {
        const result =
          await toggleFavoriteAction(
            quoteId,
          );

        setSaved(result.saved);
        setMessage("");
      } catch {
        setSaved(
          previousSaved,
        );

        setMessage(
          t("loginRequired"),
        );
      }
    });
  }

  // ==========================================================
  // SHARE
  // ==========================================================

  async function handleShare() {
    const shareText = authorName
      ? `“${quoteText}” — ${authorName}`
      : `“${quoteText}”`;

    const shareUrl =
      window.location.origin +
      quoteHref;

    try {
      if (
        navigator.share &&
        typeof navigator.share ===
          "function"
      ) {
        await navigator.share({
          title: "Qawl",
          text: shareText,
          url: shareUrl,
        });

        return;
      }

      await navigator.clipboard.writeText(
        `${shareText}\n${shareUrl}`,
      );

      setMessage(
        t("linkCopied"),
      );

      window.setTimeout(() => {
        setMessage("");
      }, 1800);
    } catch (error) {
      /*
       * navigator.share() throws when the user
       * cancels the native share dialog.
       *
       * We intentionally do not show an error
       * in that case.
       */

      console.error(
        "Share failed:",
        error,
      );
    }
  }

  // ==========================================================
  // RENDER
  // ==========================================================

  return (
    <div className="mt-5">
      <div className="flex items-center justify-between gap-2">

        {/* ==================================================
            ACTIONS
        ================================================== */}

        <div className="flex items-center gap-1.5">

          {/* =================================================
              COPY
          ================================================= */}

          <button
            type="button"
            onClick={handleCopy}
            title={t("copy")}
            aria-label={t("copy")}
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-xl
              border
              border-[#282e5c]
              bg-[#080D26]
              text-gray-500
              transition
              hover:border-[#8B5CF6]/40
              hover:bg-[#8B5CF6]/10
              hover:text-[#C084FC]
            "
          >
            {copied ? (
              <Check size={15} />
            ) : (
              <Copy size={15} />
            )}
          </button>

          {/* =================================================
              FAVORITE
          ================================================= */}

          <button
            type="button"
            onClick={
              handleFavorite
            }
            disabled={isPending}
            title={
              saved
                ? t("removeFavorite")
                : t("addFavorite")
            }
            aria-label={
              saved
                ? t("removeFavorite")
                : t("addFavorite")
            }
            className={
              saved
                ? `
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-red-400/30
                  bg-red-400/10
                  text-red-400
                  transition
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                `
                : `
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-[#282e5c]
                  bg-[#080D26]
                  text-gray-500
                  transition
                  hover:border-red-400/30
                  hover:bg-red-400/10
                  hover:text-red-400
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                `
            }
          >
            <Heart
              size={15}
              className={
                saved
                  ? "fill-current"
                  : ""
              }
            />
          </button>

          {/* =================================================
              SHARE
          ================================================= */}

          <button
            type="button"
            onClick={
              handleShare
            }
            title={t("share")}
            aria-label={t("share")}
            className="
              flex
              h-9
              w-9
              items-center
              justify-center
              rounded-xl
              border
              border-[#282e5c]
              bg-[#080D26]
              text-gray-500
              transition
              hover:border-[#8B5CF6]/40
              hover:bg-[#8B5CF6]/10
              hover:text-[#C084FC]
            "
          >
            <Share2 size={15} />
          </button>

        </div>

        {/* ==================================================
            VIEW
        ================================================== */}

        <Link
          href={quoteHref}
          className="
            flex
            h-9
            items-center
            gap-2
            rounded-xl
            border
            border-[#282e5c]
            bg-[#080D26]
            px-3
            text-[10px]
            font-medium
            text-gray-500
            transition
            hover:border-[#8B5CF6]/40
            hover:bg-[#8B5CF6]/10
            hover:text-[#C084FC]
          "
        >
          {t("view")}

          <ArrowUpRight
            size={13}
            className={
              locale === "ar"
                ? "rotate-[-90deg]"
                : ""
            }
          />
        </Link>
      </div>

      {/* ==================================================
          MESSAGE
      ================================================== */}

      {message && (
        <p
          dir={
            locale === "ar"
              ? "rtl"
              : "ltr"
          }
          className="
            mt-2
            text-[10px]
            text-gray-600
          "
        >
          {message}
        </p>
      )}
    </div>
  );
}