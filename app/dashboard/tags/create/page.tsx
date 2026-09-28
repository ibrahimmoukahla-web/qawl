"use client";

import Link from "next/link";

import {
  ArrowLeft,
  Tag,
} from "lucide-react";

import {
  useActionState,
} from "react";

import {
  createTagAction,
  type TagFormState,
} from "./actions";

const initialState: TagFormState = {};

export default function CreateTagPage() {
  const [
    state,
    formAction,
    pending,
  ] = useActionState(
    createTagAction,
    initialState,
  );

  return (
    <div className="min-h-full w-full bg-[#070B1C] px-4 py-6 text-white sm:px-6 lg:px-8 lg:py-8">
      <div className="mx-auto w-full max-w-4xl">
        {/* TOP */}

        <div className="mb-8">
          <Link
            href="/dashboard/home"
            className="mb-5 inline-flex items-center gap-2 text-sm text-gray-500 transition hover:text-white"
          >
            <ArrowLeft size={17} />
            Back to dashboard
          </Link>

          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#8B5CF6]/10 text-[#C084FC]">
              <Tag size={23} />
            </div>

            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-purple-400">
                Qawl
              </p>

              <h1 className="mt-1 text-2xl font-semibold">
                Create Tag
              </h1>

              <p className="mt-1 text-sm text-gray-600">
                Create a tag that can be attached
                to quotes.
              </p>
            </div>
          </div>
        </div>

        {/* FORM */}

        <form
          action={formAction}
          className="overflow-hidden rounded-3xl border border-[#282e5c]/60 bg-[#111634]"
        >
          <div className="space-y-7 p-5 sm:p-7">
            {/* NAME */}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Tag name
              </label>

              <input
                type="text"
                name="name"
                required
                placeholder="motivation"
                className="w-full rounded-xl border border-[#282e5c] bg-[#080D26] px-4 py-3.5 text-sm text-white outline-none placeholder:text-gray-700 focus:border-[#8B5CF6]/60 focus:ring-2 focus:ring-[#8B5CF6]/10"
              />
            </div>

            {/* SLUG */}

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-300">
                Slug
              </label>

              <input
                type="text"
                name="slug"
                placeholder="motivation"
                className="w-full rounded-xl border border-[#282e5c] bg-[#080D26] px-4 py-3.5 text-sm text-white outline-none placeholder:text-gray-700 focus:border-[#8B5CF6]/60 focus:ring-2 focus:ring-[#8B5CF6]/10"
              />

              <p className="mt-2 text-xs text-gray-600">
                Leave empty to generate it
                automatically.
              </p>
            </div>

            {/* PREVIEW */}

            <div>
              <p className="mb-2 text-sm font-medium text-gray-300">
                Preview
              </p>

              <span className="inline-flex rounded-full border border-[#8B5CF6]/20 bg-[#8B5CF6]/5 px-3 py-1.5 text-xs text-[#C084FC]">
                #motivation
              </span>
            </div>

            {/* MESSAGE */}

            {state.error && (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                {state.error}
              </div>
            )}

            {state.success && (
              <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-300">
                Tag created successfully.
              </div>
            )}

            {/* BUTTON */}

            <div className="border-t border-[#282e5c]/50 pt-6">
              <button
                type="submit"
                disabled={pending}
                className="w-full rounded-xl bg-[#8B5CF6] px-4 py-3.5 text-sm font-semibold text-white transition hover:bg-[#7C3AED] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {pending
                  ? "Creating..."
                  : "Create Tag"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}