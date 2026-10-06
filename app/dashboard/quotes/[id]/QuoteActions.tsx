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
toggleFavoriteAction,
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

const [copied, setCopied] =
useState(false);

const [isPending, startTransition] =
useTransition();

// ==========================================================
// LIKE
// ==========================================================

function handleLike() {
if (isPending) {
return;
}


const previousLiked = liked;
const previousCount = likesCount;

setLiked(!liked);

setLikesCount(
  liked
    ? Math.max(0, likesCount - 1)
    : likesCount + 1,
);

startTransition(async () => {
  try {
    const result =
      await toggleQuoteLike(quoteId);

    setLiked(result.liked);
    setLikesCount(result.likesCount);
  } catch {
    setLiked(previousLiked);
    setLikesCount(previousCount);
  }
});


}

// ==========================================================
// FAVORITE
// ==========================================================

function handleFavorite() {
if (isPending) {
return;
}


const previousSaved = saved;

setSaved(!saved);

startTransition(async () => {
  try {
    const result =
      await toggleFavoriteAction(quoteId);

    setSaved(result.saved);
  } catch {
    setSaved(previousSaved);
  }
});


}

// ==========================================================
// SHARE
// ==========================================================

async function handleShare() {
const url = window.location.href;


try {
  if (navigator.share) {
    await navigator.share({
      title: "Qawl",
      text: "A quote worth remembering.",
      url,
    });

    return;
  }

  await navigator.clipboard.writeText(url);

  setCopied(true);

  window.setTimeout(() => {
    setCopied(false);
  }, 1800);
} catch {
  // Sharing cancelled.
}


}

// ==========================================================
// RENDER
// ==========================================================

return (
<div
className="grid grid-cols-3 gap-2"
onClick={(event) => {
event.stopPropagation();
}}
>
{/* LIKE */}


  <button
    type="button"
    disabled={isPending}
    onClick={handleLike}
    aria-label={
      liked ? "Unlike quote" : "Like quote"
    }
    className={
      liked
        ? "flex min-w-0 items-center justify-center gap-2 rounded-xl border border-red-500/30 bg-red-500/10 px-3 py-3 text-xs text-red-300 transition disabled:cursor-not-allowed disabled:opacity-50"
        : "flex min-w-0 items-center justify-center gap-2 rounded-xl border border-[#282e5c] bg-[#080D26] px-3 py-3 text-xs text-gray-500 transition hover:border-red-500/20 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-50"
    }
  >
    <Heart
      size={16}
      className={
        liked
          ? "fill-current"
          : ""
      }
    />

    <span>{likesCount}</span>
  </button>

  {/* FAVORITE */}

  <button
    type="button"
    disabled={isPending}
    onClick={handleFavorite}
    aria-label={
      saved
        ? "Remove from favorites"
        : "Add to favorites"
    }
    className={
      saved
        ? "flex min-w-0 items-center justify-center gap-2 rounded-xl border border-[#8B5CF6]/30 bg-[#8B5CF6]/10 px-3 py-3 text-xs text-[#C084FC] transition disabled:cursor-not-allowed disabled:opacity-50"
        : "flex min-w-0 items-center justify-center gap-2 rounded-xl border border-[#282e5c] bg-[#080D26] px-3 py-3 text-xs text-gray-500 transition hover:border-[#8B5CF6]/20 hover:text-[#C084FC] disabled:cursor-not-allowed disabled:opacity-50"
    }
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
    aria-label="Share quote"
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
