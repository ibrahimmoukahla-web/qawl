"use client";

import {
  Bookmark,
  Check,
  Heart,
  Share2,
} from "lucide-react";

import {
  useState,
  useTransition,
} from "react";

import {
  toggleQuoteFavorite,
  toggleQuoteLike,
} from "../actions";

type QuoteActionsProps = {
  quoteId: string;
  initialLiked: boolean;
  initialSaved: boolean;
  initialLikesCount: number;
};

export default function QuoteActions({
  quoteId,
  initialLiked,
  initialSaved,
  initialLikesCount,
}: QuoteActionsProps) {
  const [liked, setLiked] =
    useState(initialLiked);

  const [saved, setSaved] =
    useState(initialSaved);

  const [likesCount, setLikesCount] =
    useState(initialLikesCount);

  const [isPending, startTransition] =
    useTransition();

  const [copied, setCopied] =
    useState(false);

  function handleLike() {
    if (isPending) return;

    const oldLiked = liked;
    const oldCount = likesCount;

    setLiked(!liked);

    setLikesCount(
      liked
        ? Math.max(0, likesCount - 1)
        : likesCount + 1,
    );

    startTransition(async () => {
      try {
        const result =
          await toggleQuoteLike(
            quoteId,
          );

        setLiked(result.liked);
        setLikesCount(
          result.likesCount,
        );
      } catch {
        setLiked(oldLiked);
        setLikesCount(oldCount);
      }
    });
  }

  function handleFavorite() {
    if (isPending) return;

    const oldSaved = saved;

    setSaved(!saved);

    startTransition(async () => {
      try {
        const result =
          await toggleQuoteFavorite(
            quoteId,
          );

        setSaved(result.saved);
      } catch {
        setSaved(oldSaved);
      }
    });
  }

  async function handleShare() {
    const url =
      window.location.href;

    try {
      if (navigator.share) {
        await navigator.share({
          title: "Qawl",
          text: "A quote worth remembering.",
          url,
        });

        return;
      }

      await navigator.clipboard.writeText(
        url,
      );

      setCopied(true);

      window.setTimeout(() => {
        setCopied(false);
      }, 1800);
    } catch {
      // User cancelled sharing.
    }
  }

  return (
    <div
      className="grid grid-cols-3 gap-2"
      onClick={(event) =>
        event.stopPropagation()
      }
    >
      {/* LIKE */}

      <button
        type="button"
        disabled={isPending}
        onClick={handleLike}
        className={`
          flex
          min-w-0
          items-center
          justify-center
          gap-2
          rounded-xl
          border
          px-3
          py-3
          text-xs
          transition
          ${
            liked
              ? "border-red-500/30 bg-red-500/10 text-red-300"
              : "border-[#282e5c] bg-[#080D26] text-gray-500 hover:border-red-500/20 hover:text-red-300"
          }
        `}
      >
        <Heart
          size={16}
          className={
            liked
              ? "fill-current"
              : ""
          }
        />

        <span>
          {likesCount}
        </span>
      </button>

      {/* FAVORITE */}

      <button
        type="button"
        disabled={isPending}
        onClick={handleFavorite}
        className={`
          flex
          min-w-0
          items-center
          justify-center
          gap-2
          rounded-xl
          border
          px-3
          py-3
          text-xs
          transition
          ${
            saved
              ? "border-[#8B5CF6]/30 bg-[#8B5CF6]/10 text-[#C084FC]"
              : "border-[#282e5c] bg-[#080D26] text-gray-500 hover:border-[#8B5CF6]/20 hover:text-[#C084FC]"
          }
        `}
      >
        <Bookmark
          size={16}
          className={
            saved
              ? "fill-current"
              : ""
          }
        />

        <span>
          {saved ? "Saved" : "Save"}
        </span>
      </button>

      {/* SHARE */}

      <button
        type="button"
        onClick={handleShare}
        className="flex min-w-0 items-center justify-center gap-2 rounded-xl border border-[#282e5c] bg-[#080D26] px-3 py-3 text-xs text-gray-500 transition hover:border-[#8B5CF6]/20 hover:text-[#C084FC]"
      >
        {copied ? (
          <Check size={16} />
        ) : (
          <Share2 size={16} />
        )}

        <span>
          {copied ? "Copied" : "Share"}
        </span>
      </button>
    </div>
  );
}