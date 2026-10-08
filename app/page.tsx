import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Feather,
  Heart,
  Quote,
  Sparkles,
  Users,
} from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#070B1C] text-white">
      {/* =====================================================
          BACKGROUND
      ====================================================== */}

      <div className="fixed inset-0 -z-10">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            backgroundImage: "url('/coverHome3.jpg')",
          }}
        />

        <div className="absolute inset-0 bg-[#070B1C]/85" />

        <div className="absolute inset-0 bg-gradient-to-b from-[#070B1C]/20 via-[#070B1C]/70 to-[#070B1C]" />

        <div className="absolute left-[10%] top-[15%] h-72 w-72 rounded-full bg-purple-600/10 blur-[120px]" />

        <div className="absolute right-[10%] top-[35%] h-96 w-96 rounded-full bg-violet-500/10 blur-[140px]" />
      </div>

      {/* =====================================================
          NAVBAR
      ====================================================== */}

      <header className="relative z-20">
        <nav className="mx-auto flex w-full max-w-7xl items-center justify-between px-5 py-6 sm:px-8 lg:px-10">
          {/* LOGO */}

          <Link
            href="/"
            className="group flex items-center gap-3"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-purple-400/20 bg-purple-500/10 text-purple-300 shadow-[0_0_30px_rgba(139,92,246,0.15)] transition group-hover:bg-purple-500/20">
              <Feather size={19} />
            </div>

            <div>
              <span className="block text-lg font-bold tracking-wide">
                Qawl
              </span>

              <span className="hidden text-[9px] uppercase tracking-[0.3em] text-gray-600 sm:block">
                Words that remain
              </span>
            </div>
          </Link>

          {/* NAV ACTIONS */}

          <div className="flex items-center gap-2 sm:gap-3">
            <Link
              href="/login"
              className="rounded-full px-4 py-2.5 text-sm font-medium text-gray-300 transition hover:bg-white/5 hover:text-white"
            >
              Log in
            </Link>

            <Link
              href="/login"
              className="rounded-full border border-purple-400/30 bg-purple-500/15 px-5 py-2.5 text-sm font-semibold text-purple-200 backdrop-blur-md transition hover:border-purple-300/50 hover:bg-purple-500/25"
            >
              Sign up
            </Link>
          </div>
        </nav>
      </header>

      {/* =====================================================
          HERO
      ====================================================== */}

      <section className="relative z-10 px-5 pb-24 pt-16 sm:px-8 sm:pt-24 lg:px-10 lg:pb-32 lg:pt-28">
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto max-w-4xl text-center">
            {/* LABEL */}

            <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-purple-400/20 bg-purple-500/10 px-4 py-2 backdrop-blur-md">
              <Sparkles
                size={14}
                className="text-purple-300"
              />

              <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-purple-200">
                A place for meaningful words
              </span>
            </div>

            {/* TITLE */}

            <h1 className="text-5xl font-black tracking-tight sm:text-6xl lg:text-8xl">
              What remains
              <span className="block bg-gradient-to-r from-purple-300 via-fuchsia-300 to-violet-400 bg-clip-text text-transparent">
                unspoken inside.
              </span>
            </h1>

            {/* DESCRIPTION */}

            <p className="mx-auto mt-7 max-w-2xl text-base leading-8 text-gray-400 sm:text-lg">
              Discover thoughts that sound like your own.
              Explore timeless quotes, remarkable authors,
              and ideas that stay with you long after you
              read them.
            </p>

            {/* CTA */}

            <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/login"
                className="group flex w-full items-center justify-center gap-2 rounded-full bg-purple-600 px-8 py-4 text-sm font-bold text-white shadow-[0_0_40px_rgba(139,92,246,0.25)] transition duration-300 hover:scale-[1.03] hover:bg-purple-500 sm:w-auto"
              >
                Start exploring

                <ArrowRight
                  size={17}
                  className="transition-transform duration-300 group-hover:translate-x-1"
                />
              </Link>

              <Link
                href="/login"
                className="w-full rounded-full border border-white/10 bg-white/[0.04] px-8 py-4 text-sm font-semibold text-gray-300 backdrop-blur-md transition hover:border-white/20 hover:bg-white/[0.08] hover:text-white sm:w-auto"
              >
                Join Qawl
              </Link>
            </div>

            {/* SOCIAL PROOF */}

            <div className="mt-12 flex flex-wrap items-center justify-center gap-5 text-xs text-gray-600">
              <span className="flex items-center gap-2">
                <Quote size={14} />
                Meaningful quotes
              </span>

              <span className="h-1 w-1 rounded-full bg-gray-700" />

              <span className="flex items-center gap-2">
                <Users size={14} />
                Remarkable authors
              </span>

              <span className="h-1 w-1 rounded-full bg-gray-700" />

              <span className="flex items-center gap-2">
                <Heart size={14} />
                Save what matters
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          FEATURE CARDS
      ====================================================== */}

      <section className="relative z-10 px-5 pb-24 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-6xl grid-cols-1 gap-4 md:grid-cols-3">
          {/* CARD 1 */}

          <div className="group rounded-3xl border border-white/10 bg-white/[0.035] p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-purple-400/20 hover:bg-white/[0.05]">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-300">
              <Quote size={21} />
            </div>

            <h2 className="text-lg font-semibold">
              Discover
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              Find quotes about life, love, ambition,
              silence, freedom, and everything in between.
            </p>
          </div>

          {/* CARD 2 */}

          <div className="group rounded-3xl border border-white/10 bg-white/[0.035] p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-purple-400/20 hover:bg-white/[0.05]">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-300">
              <BookOpen size={21} />
            </div>

            <h2 className="text-lg font-semibold">
              Explore
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              Explore authors, categories, tags, and
              ideas through one growing collection.
            </p>
          </div>

          {/* CARD 3 */}

          <div className="group rounded-3xl border border-white/10 bg-white/[0.035] p-6 backdrop-blur-xl transition duration-300 hover:-translate-y-1 hover:border-purple-400/20 hover:bg-white/[0.05]">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-500/10 text-purple-300">
              <Heart size={21} />
            </div>

            <h2 className="text-lg font-semibold">
              Keep
            </h2>

            <p className="mt-3 text-sm leading-6 text-gray-500">
              Save the words that speak to you and build
              your own personal collection.
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          QUOTE SECTION
      ====================================================== */}

      <section className="relative z-10 px-5 pb-28 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-4xl">
          <div className="relative overflow-hidden rounded-[2rem] border border-purple-400/15 bg-gradient-to-br from-[#111634]/90 via-[#0d1230]/90 to-[#080D26]/95 p-8 text-center shadow-[0_25px_100px_rgba(0,0,0,0.35)] backdrop-blur-xl sm:p-12">
            <div className="pointer-events-none absolute left-1/2 top-0 h-40 w-40 -translate-x-1/2 rounded-full bg-purple-500/15 blur-[90px]" />

            <Quote
              size={38}
              className="mx-auto text-purple-300/50"
            />

            <blockquote className="relative mt-6 text-2xl font-medium leading-relaxed text-gray-200 sm:text-3xl">
              “Some words are not meant to be heard.
              They are meant to be felt.”
            </blockquote>

            <p className="mt-5 text-xs uppercase tracking-[0.25em] text-gray-600">
              Qawl
            </p>
          </div>
        </div>
      </section>

      {/* =====================================================
          FINAL CTA
      ====================================================== */}

      <section className="relative z-10 px-5 pb-24 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-4xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-purple-300">
            Begin here
          </p>

          <h2 className="mt-4 text-3xl font-bold sm:text-5xl">
            Find the words
            <span className="text-purple-400">
              {" "}
              you were looking for.
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-gray-500">
            Enter Qawl and explore a world built around
            thoughts, emotions, and ideas.
          </p>

          <Link
            href="/login"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-[#070B1C] transition hover:scale-105"
          >
            Enter Qawl

            <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* =====================================================
          FOOTER
      ====================================================== */}

      <footer className="relative z-10 border-t border-white/5 px-5 py-8 sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <div>
            <p className="text-sm font-semibold">
              Qawl
            </p>

            <p className="mt-1 text-xs text-gray-700">
              What remains unspoken inside.
            </p>
          </div>

          <Link
            href="/login"
            className="text-xs text-gray-600 transition hover:text-purple-300"
          >
            Enter Qawl
          </Link>
        </div>
      </footer>
    </main>
  );
}