import Link from "next/link";
import {
  ArrowLeft,
  Quote as QuoteIcon,
} from "lucide-react";

import { redirect } from "next/navigation";
import { headers } from "next/headers";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

import QuoteForm from "./ QuoteForm";

export default async function CreateQuotePage() {
  // =======================================================
  // SESSION
  // =======================================================

  const session =
    await auth.api.getSession({
      headers: await headers(),
    });

  if (!session) {
    redirect("/login");
  }

  // =======================================================
  // DATA
  // =======================================================

  const [
    authors,
    categories,
    tags,
  ] = await Promise.all([
    prisma.author.findMany({
      orderBy: {
        name: "asc",
      },

      select: {
        id: true,
        name: true,
        slug: true,
        imageUrl: true,
      },
    }),

    prisma.category.findMany({
      orderBy: {
        name: "asc",
      },

      select: {
        id: true,
        name: true,
        slug: true,
        color: true,
      },
    }),

    prisma.tag.findMany({
      orderBy: {
        name: "asc",
      },

      select: {
        id: true,
        name: true,
        slug: true,
      },
    }),
  ]);

  // =======================================================
  // PAGE
  // =======================================================

  return (
    <div className="min-h-full w-full min-w-0 bg-[#070B1C] text-white">
      {/* =================================================
          HEADER
      ================================================== */}

      <header className="sticky top-0 z-30 border-b border-[#282e5c]/50 bg-[#070B1C]/90 backdrop-blur-xl">
        <div className="flex h-16 w-full min-w-0 items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* BACK */}

          <Link
            href="/dashboard/home"
            className="group flex items-center gap-2 text-sm text-gray-500 transition hover:text-white"
          >
            <ArrowLeft
              size={17}
              className="transition-transform group-hover:-translate-x-0.5"
            />

            <span>Back</span>
          </Link>

          {/* TITLE */}

          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#8B5CF6]/10 text-[#C084FC]">
              <QuoteIcon size={18} />
            </div>

            <div className="hidden sm:block">
              <h1 className="text-sm font-semibold text-white">
                Create Quote
              </h1>

              <p className="text-[11px] text-gray-600">
                Add a new quote to Qawl
              </p>
            </div>
          </div>

          {/* BALANCE */}

          <div className="w-10" />
        </div>
      </header>

      {/* =================================================
          CONTENT
      ================================================== */}

      <main className="w-full min-w-0 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <div className="mx-auto w-full min-w-0 max-w-[1400px]">
          {/* PAGE INTRO */}

          <div className="mb-7">
            <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A78BFA]">
              Quote Studio
            </p>

            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              Create something meaningful.
            </h2>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
              Write your quote, choose its context,
              and preview the final result before
              publishing.
            </p>
          </div>

          {/* FORM */}

          <QuoteForm
            authors={authors}
            categories={categories}
            tags={tags}
          />
        </div>
      </main>
    </div>
  );
}