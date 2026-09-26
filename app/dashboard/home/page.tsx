import Image from "next/image";
import React from "react";
import { FaRegHeart } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa";
import { SiCdprojekt } from "react-icons/si";
import CardQuates from "./cardQuates";
import InputGroupKbd from "@/components/Search";
import { AvatarDropdown } from "@/components/DropdownAvatar";
import OpenIconSpeedDial from "@/components/OpenIconSpeedDial";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import CategoryFilter from "./CategoryFilter";
export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{
    category?: string;
  }>;
}) {
  const { category } = await searchParams;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  const userId = session?.user.id ?? "";

  const categories = await prisma.category.findMany({
    orderBy: {
      name: "asc",
    },

    select: {
      id: true,
      name: true,
      slug: true,
      color: true,
    },
  });

  const quotes = await prisma.quote.findMany({
    where: {
      status: "PUBLISHED",

      ...(category
        ? {
            category: {
              slug: category,
            },
          }
        : {}),
    },

    orderBy: {
      createdAt: "desc",
    },

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
      interactions: {
        where: {
          userId: userId,
          type: "LIKE",
        },

        select: {
          id: true,
        },

        take: 1,
      },

      favorites: {
        where: {
          userId: userId,
        },

        select: {
          userId: true,
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
  console.log(
    quotes.map((quote) => ({
      quoteId: quote.id,
      interactions: quote.interactions,
      isLiked: quote.interactions.length > 0,
    })),
  );
  console.log(
    quotes.map((quote) => ({
      id: quote.id,
      count: quote._count?.interactions,
    })),
  );

  const cardQuotes = quotes.map((quote) => ({
    id: quote.id,

    text: quote.text,

    createdAt: quote.createdAt.toISOString(),
    author: quote.author,

    category: quote.category,

    createdBy: quote.createdBy,

    likesCount: quote._count.interactions ?? 0,

    isLiked: quote.interactions.length > 0,

    isSaved: quote.favorites.length > 0,
  }));
  return (
    <div className="w-full h-screen flex flex-col  ">
      {/* ================= top page ================== */}

      <div className="bg-blue-900 w-full h-1/3 flex flex-col relative">
        <div className="w-full h-9 bg-fuchsia-500 ">
          <div className="flex px-2  relative justify-between">
            <InputGroupKbd />
            <div>
              <AvatarDropdown />
            </div>
          </div>
        </div>
        <div className=" bg-cyan-900 w-full overflow-hidden flex-1 relative">
          <Image
            src="/coverHome3.jpg"
            alt="cover"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </div>

      {/* ================= top page ================== */}
      <div className=" w-full flex-1 flex  min-h-0">
        <div className=" flex-3 flex flex-col gap-2 m-2 min-h-0">
          {/* ------------------- header ================= */}
          <div className="bg-[#111634] border border-[#242b5c] flex-1 rounded-2xl px-2 p-1 flex flex-col gap-1">
            <div className=" flex justify-between">
              <h1 className="font-bold">Explore Categories</h1>
              <button className="flex gap-1 items-center text-[#8B5CF6] ">
                <span>View all </span>
                <FaArrowRight />
              </button>
            </div>
      <CategoryFilter
  categories={categories}
  activeCategory={category}
/>
          </div>
          {/* ------------------- header ================= */}
          {/* ------------------- body  ================= */}

          <div className="bg-[#080d2e] border border-[#282e5c] flex-6 rounded-2xl px-2 flex flex-col gap-2 min-h-0">
            {/* ((((((((( head ))))))))) */}

            <div className="flex justify-between items-center">
              <div className="flex gap-1 items-center">
                <SiCdprojekt className="text-[#C084FC]" size={30} />{" "}
                <span className="font-bold"> Latest Quotes</span>
              </div>
              kkkk
            </div>
            {/* ((((((((( head ))))))))) */}
            <div className="flex-1 min-h-0 scroll overflow-y-auto flex flex-col gap-3 scrollbar-none">
              {cardQuotes.map((quote) => (
                <CardQuates key={quote.id} quote={quote} />
              ))}
            </div>
          </div>
          {/* ------------------- body  ================= */}
        </div>
        {/* ------------------- right side ================= */}

        <div className="flex-1 min-w-0 min-h-0 m-2 flex flex-col gap-2 overflow-y-auto scrollbar-none">
          {/* Quote of the Day */}
          <div className="rounded-2xl border border-[#282e5c] bg-[#111634] p-4">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-xs text-[#8B5CF6] font-semibold uppercase tracking-wider">
                  Featured
                </p>

                <h2 className="font-bold text-lg">Quote of the Day</h2>
              </div>

              <div className="w-9 h-9 rounded-full bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 flex items-center justify-center text-[#C084FC]"></div>
            </div>

            <div className="rounded-xl bg-[#080d2e] border border-[#282e5c] p-4">
              <p className="text-sm leading-6 text-gray-200 italic">
                The only way to do great work is to love what you do.
              </p>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-sm font-semibold text-[#C084FC]">
                  Steve Jobs
                </span>

                <button className="text-xs text-gray-400 hover:text-white transition">
                  View quote
                </button>
              </div>
            </div>
          </div>

          {/* Trending Authors */}
          <div className="rounded-2xl border border-[#282e5c] bg-[#111634] p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold">Trending Authors</h2>

              <button className="text-xs text-[#8B5CF6] hover:text-[#C084FC] transition">
                View all
              </button>
            </div>

            <div className="flex flex-col gap-3">
              {/* Author */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-[#8B5CF6]/15 border border-[#8B5CF6]/30">
                    <img
                      src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e"
                      alt="Author"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div>
                    <p className="text-sm font-semibold">Albert Einstein</p>

                    <p className="text-xs text-gray-400">24 quotes</p>
                  </div>
                </div>

                <button className="text-xs text-[#C084FC]">→</button>
              </div>

              {/* Author */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 flex items-center justify-center">
                    <span className="text-[#C084FC] font-semibold">N</span>
                  </div>

                  <div>
                    <p className="text-sm font-semibold">Nietzsche</p>

                    <p className="text-xs text-gray-400">18 quotes</p>
                  </div>
                </div>

                <button className="text-xs text-[#C084FC]">→</button>
              </div>

              {/* Author */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 flex items-center justify-center">
                    <span className="text-[#C084FC] font-semibold">R</span>
                  </div>

                  <div>
                    <p className="text-sm font-semibold">Rumi</p>

                    <p className="text-xs text-gray-400">15 quotes</p>
                  </div>
                </div>

                <button className="text-xs text-[#C084FC]">→</button>
              </div>
            </div>
          </div>

          {/* Trending Tags */}
          <div className="rounded-2xl border border-[#282e5c] bg-[#111634] p-4">
            <h2 className="font-bold mb-3">Trending Topics</h2>

            <div className="flex flex-wrap gap-2">
              <button className="px-3 py-1.5 rounded-full text-xs bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 text-[#C084FC] hover:bg-[#8B5CF6]/25 transition">
                #life
              </button>

              <button className="px-3 py-1.5 rounded-full text-xs bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 text-[#C084FC] hover:bg-[#8B5CF6]/25 transition">
                #love
              </button>

              <button className="px-3 py-1.5 rounded-full text-xs bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 text-[#C084FC] hover:bg-[#8B5CF6]/25 transition">
                #wisdom
              </button>

              <button className="px-3 py-1.5 rounded-full text-xs bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 text-[#C084FC] hover:bg-[#8B5CF6]/25 transition">
                #motivation
              </button>

              <button className="px-3 py-1.5 rounded-full text-xs bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 text-[#C084FC] hover:bg-[#8B5CF6]/25 transition">
                #success
              </button>

              <button className="px-3 py-1.5 rounded-full text-xs bg-[#8B5CF6]/15 border border-[#8B5CF6]/30 text-[#C084FC] hover:bg-[#8B5CF6]/25 transition">
                #life-lessons
              </button>
            </div>
          </div>
        </div>
        {/* ------------------- right side ================= */}
      </div>

      <OpenIconSpeedDial />
    </div>
  );
}
