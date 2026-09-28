import Link from "next/link";
import {
  ArrowRight,
  Search,
  UserRound,
  Users,
} from "lucide-react";

import { prisma } from "@/lib/prisma";

export default async function AuthorsPage() {
  const authors = await prisma.author.findMany({
    orderBy: {
      name: "asc",
    },

    select: {
      id: true,
      name: true,
      slug: true,
      bio: true,
      imageUrl: true,

      _count: {
        select: {
          quotes: true,
        },
      },
    },
  });

  return (
    <div className="min-h-full w-full min-w-0 bg-[#070B1C] text-white">
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
                Authors
              </h1>

              <p className="hidden text-xs text-gray-600 sm:block">
                Discover the voices behind the quotes.
              </p>
            </div>
          </div>

          {/* COUNT */}

          <div className="shrink-0 rounded-full border border-[#282e5c] bg-[#111634] px-3 py-1.5 text-xs text-gray-500">
            {authors.length}{" "}
            {authors.length === 1
              ? "author"
              : "authors"}
          </div>
        </div>
      </header>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <main className="mx-auto w-full min-w-0 max-w-[1500px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        {/* INTRO */}

        <section className="mb-8">
          <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#A78BFA]">
            People & Ideas
          </p>

          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Meet the authors.
          </h2>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
            Explore writers, philosophers, thinkers, and
            other voices collected in Qawl.
          </p>
        </section>

        {/* SEARCH VISUAL */}

        <div className="mb-8 flex w-full min-w-0 items-center rounded-2xl border border-[#282e5c]/60 bg-[#111634] px-4">
          <Search
            size={17}
            className="shrink-0 text-gray-600"
          />

          <div className="w-full px-3 py-3.5 text-sm text-gray-600">
            Search authors...
          </div>
        </div>

        {/* EMPTY */}

        {authors.length === 0 ? (
          <section className="flex min-h-[420px] flex-col items-center justify-center rounded-3xl border border-dashed border-[#282e5c] bg-[#0B102B] px-6 text-center">
            <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-[#8B5CF6]/10 text-[#C084FC]">
              <UserRound size={27} />
            </div>

            <h3 className="text-lg font-semibold">
              No authors yet
            </h3>

            <p className="mt-2 max-w-md text-sm leading-6 text-gray-600">
              Authors you add to Qawl will appear here.
            </p>

            <Link
              href="/dashboard/authors/create"
              className="mt-6 rounded-xl bg-[#8B5CF6] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[#7C3AED]"
            >
              Create Author
            </Link>
          </section>
        ) : (
          /* AUTHORS GRID */

          <div className="grid min-w-0 grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
            {authors.map((author) => (
              <Link
                key={author.id}
                href={`/dashboard/authors/${author.slug}`}
                className="group min-w-0 overflow-hidden rounded-3xl border border-[#282e5c]/60 bg-[#111634] transition duration-300 hover:-translate-y-1 hover:border-[#8B5CF6]/30 hover:bg-[#14193B] hover:shadow-[0_20px_60px_rgba(0,0,0,0.25)]"
              >
                {/* TOP AREA */}

                <div className="relative flex h-32 items-end overflow-hidden bg-gradient-to-br from-[#161B43] via-[#101535] to-[#080D26]">
                  <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-purple-500/10 blur-3xl" />

                  <div className="absolute left-5 top-5">
                    <span className="rounded-full border border-white/[0.06] bg-black/20 px-2.5 py-1 text-[10px] text-gray-500 backdrop-blur-md">
                      Author
                    </span>
                  </div>

                  {/* AVATAR */}

                  <div className="absolute left-5 top-[68px]">
                    {author.imageUrl ? (
                      <img
                        src={author.imageUrl}
                        alt={author.name}
                        className="h-20 w-20 rounded-2xl border-4 border-[#111634] object-cover shadow-xl"
                      />
                    ) : (
                      <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-[#111634] bg-[#8B5CF6]/10 text-2xl font-semibold text-[#C084FC] shadow-xl">
                        {author.name
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                    )}
                  </div>
                </div>

                {/* BODY */}

                <div className="min-w-0 px-5 pb-5 pt-12">
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h3 className="truncate text-base font-semibold text-white transition group-hover:text-[#C084FC]">
                        {author.name}
                      </h3>

                      <p className="mt-1 text-xs text-gray-600">
                        @{author.slug}
                      </p>
                    </div>

                    <ArrowRight
                      size={17}
                      className="mt-1 shrink-0 text-gray-700 transition duration-300 group-hover:translate-x-1 group-hover:text-[#C084FC]"
                    />
                  </div>

                  {/* BIO */}

                  <p className="mt-4 line-clamp-3 text-sm leading-6 text-gray-500">
                    {author.bio ||
                      "Discover the quotes and ideas collected from this author."}
                  </p>

                  {/* FOOTER */}

                  <div className="mt-5 flex items-center justify-between border-t border-[#282e5c]/50 pt-4">
                    <span className="text-xs text-gray-600">
                      Quotes
                    </span>

                    <span className="rounded-full border border-[#282e5c] bg-[#080D26] px-2.5 py-1 text-xs font-medium text-[#C084FC]">
                      {author._count.quotes}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}