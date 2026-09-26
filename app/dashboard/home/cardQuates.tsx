"use client";


import React, { useEffect, useState } from "react";

import Avatar from "@mui/material/Avatar";

import { RiDoubleQuotesR, RiDoubleQuotesL } from "react-icons/ri";

import { IoBookmarkOutline, IoBookmark } from "react-icons/io5";

import { FaRegHeart, FaHeart } from "react-icons/fa6";

import { PiShareNetworkBold } from "react-icons/pi";

import { toggleLike, toggleFavorite, recordShare } from "@/app/actions/quote";

type CardQuoteProps = {
  quote: {
    id: string;
    text: string;
    createdAt: string;

    author: {
      id: string;
      name: string;
      imageUrl: string | null;
    } | null;

    category: {
      id: string;
      name: string;
    } | null;

    createdBy: {
      id: string;
      name: string;
      username: string | null;
      image: string | null;
    } | null;

    likesCount: number;
    isLiked: boolean;
    isSaved: boolean;
  };
};

export default function CardQuates({ quote }: CardQuoteProps) {
  const [liked, setLiked] = useState(quote.isLiked);

  const [saved, setSaved] = useState(quote.isSaved);

  const [timeAgo, setTimeAgo] = useState("");

  const [likesCount, setLikesCount] = useState(quote.likesCount ?? 0);

  const [loading, setLoading] = useState<"like" | "save" | "share" | null>(
    null,
  );

  useEffect(() => {
  const updateTime = () => {
    const diff =
      Date.now() - new Date(quote.createdAt).getTime();

    const seconds = Math.floor(diff / 1000);

    if (seconds < 60) {
      setTimeAgo("just now");
      return;
    }

    const minutes = Math.floor(seconds / 60);

    if (minutes < 60) {
      setTimeAgo(`${minutes}m`);
      return;
    }

    const hours = Math.floor(minutes / 60);

    if (hours < 24) {
      setTimeAgo(`${hours}h`);
      return;
    }

    const days = Math.floor(hours / 24);

    if (days < 7) {
      setTimeAgo(`${days}d`);
      return;
    }

    const weeks = Math.floor(days / 7);

    if (weeks < 5) {
      setTimeAgo(`${weeks}w`);
      return;
    }

    const months = Math.floor(days / 30);

    if (months < 12) {
      setTimeAgo(`${months}mo`);
      return;
    }

    const years = Math.floor(days / 365);

    setTimeAgo(`${years}y`);
  };

  updateTime();

  const interval = setInterval(updateTime, 60_000);

  return () => clearInterval(interval);
}, [quote.createdAt]);

  // ======================================
  // LIKE
  // ======================================

  async function handleLike() {
    if (loading) return;

    setLoading("like");

    try {
      const result = await toggleLike(quote.id);

      if (!result.success || result.liked === undefined) {
        return;
      }

      setLiked(result.liked);

      setLikesCount((prev) =>
        result.liked ? prev + 1 : Math.max(0, prev - 1),
      );
    } finally {
      setLoading(null);
    }
  }

  // ======================================
  // SAVE
  // ======================================

  async function handleSave() {
    if (loading) return;

    setLoading("save");

    try {
      const result = await toggleFavorite(quote.id);

      if (!result.success || result.saved === undefined) {
        return;
      }

      setSaved(result.saved);
    } finally {
      setLoading(null);
    }
  }

  // ======================================
  // SHARE
  // ======================================

async function handleShare() {
  if (loading) return;

  setLoading("share");

  try {
    const url = new URL(window.location.href);

    url.searchParams.set("quote", quote.id);

    const shareUrl = url.toString();

    // الهاتف / المتصفحات التي تدعم Web Share
    if (
      navigator.share &&
      typeof navigator.share === "function"
    ) {
      await navigator.share({
        title: quote.author?.name ?? "Quote",
        text: quote.text,
        url: shareUrl,
      });
    } else {
      // Desktop fallback
      await navigator.clipboard.writeText(shareUrl);

      alert("Quote link copied!");
    }

    // نسجل المشاركة بعد نجاح العملية
    await recordShare(quote.id);

  } catch (error) {
    console.error("Share failed:", error);
  } finally {
    setLoading(null);
  }
}

  return (
    <div className="bg-[#11173d] border border-[#242b5c] rounded-2xl">
      <div className="w-full rounded-2xl overflow-hidden">
        {/* ================= AUTHOR ================= */}

        <div className="flex gap-3 px-2 py-1">
          <Avatar
            alt={quote.author?.name ?? "Unknown author"}
            src={quote.author?.imageUrl ?? undefined}
            sx={{
              width: 40,
              height: 40,
            }}
          />

          <div className="flex flex-col">
            <span className="font-bold text-[16px]">
              {quote.author?.name ?? "Unknown author"}
            </span>

            <p className="text-[13px] text-[#686D8F]">
              {quote.category?.name ?? "Quote"}
            </p>
          </div>
        </div>

        {/* ================= QUOTE ================= */}

        <div className="flex flex-col gap-1 px-6 mb-2">
          <div className="flex justify-between items-center">
            <div className="quote italic flex gap-2 max-w-120">
              <RiDoubleQuotesL />

              <span>
                {quote.text}

                <div className="text-[12px] font-semibold">
                  shared by {quote.createdBy?.name ?? "Unknown user"}
                </div>
              </span>

              <RiDoubleQuotesR />
            </div>

            <div className="text-[13px] text-[#686D8F]">
            {timeAgo}
            </div>
          </div>

          <div className="bg-purple-500/15 border border-purple-400/30 backdrop-blur-md rounded-xl w-fit py-1 px-2">
            {quote.category?.name ?? "General"}
          </div>
        </div>

        {/* ================= LINE ================= */}

        <div className="flex">
          <div className="flex-1 h-[0.3px] bg-[#4e5479] rounded-full mx-2" />
        </div>

        {/* ================= ACTIONS ================= */}

        <div className="flex justify-between p-2">
          <div className="flex gap-2">
            {/* LIKE */}

            <button
              type="button"
              onClick={handleLike}
              disabled={loading !== null}
              className={`
                flex gap-1 items-center
                transition-all duration-200
                active:scale-90
                ${liked ? "text-red-500" : "text-gray-300 hover:text-red-400"}
              `}
            >
              {liked ? <FaHeart /> : <FaRegHeart />}

              <span className="text-[13px]">{likesCount}</span>
            </button>

            {/* separator */}

            <div className="w-[0.3px] bg-[#686D8F] rounded-full" />

            {/* SAVE */}

            <button
              type="button"
              onClick={handleSave}
              disabled={loading !== null}
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
              {saved ? <IoBookmark /> : <IoBookmarkOutline />}

              <span className="text-[13px]">{saved ? "saved" : "save"}</span>
            </button>
          </div>

          {/* SHARE */}

          <button
            type="button"
            onClick={handleShare}
            disabled={loading !== null}
            className="
              text-gray-300
              hover:text-[#C084FC]
              transition-all duration-200
              active:scale-90
            "
          >
            <PiShareNetworkBold size={19} />
          </button>
        </div>
      </div>
    </div>
  );
}
