"use client";

import Link from "next/link";
import { useActionState } from "react";

import { updateQuoteAction } from "../../my-quotes/actions";

type Quote = {
  id: string;
  text: string;
  source: string | null;
  sourceUrl: string | null;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  authorId: string | null;
  categoryId: string | null;
  tagIds: string[];
};

type Author = {
  id: string;
  name: string;
};

type Category = {
  id: string;
  name: string;
  color: string;
};

type Tag = {
  id: string;
  name: string;
};

type Props = {
  quote: Quote;
  authors: Author[];
  categories: Category[];
  tags: Tag[];
};

type FormState = {
  error?: string;
};

export default function EditQuoteForm({
  quote,
  authors,
  categories,
  tags,
}: Props) {
  const [state, formAction, pending] = useActionState(
    updateQuoteAction,
    {} as FormState,
  );

  return (
    <form
      action={formAction}
      className="overflow-hidden rounded-3xl border border-[#282e5c]/60 bg-[#111634]"
    >
      <input
        type="hidden"
        name="quoteId"
        value={quote.id}
      />

      <div className="space-y-7 p-5 sm:p-7">
        {/* TEXT */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            Quote
          </label>

          <textarea
            name="text"
            defaultValue={quote.text}
            required
            rows={7}
            className="w-full resize-none rounded-xl border border-[#282e5c] bg-[#080D26] px-4 py-3.5 text-sm leading-7 text-white outline-none placeholder:text-gray-700 focus:border-[#8B5CF6]/60 focus:ring-2 focus:ring-[#8B5CF6]/10"
          />
        </div>

        {/* AUTHOR */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            Author
          </label>

          <select
            name="authorId"
            defaultValue={quote.authorId ?? ""}
            className="w-full rounded-xl border border-[#282e5c] bg-[#080D26] px-4 py-3.5 text-sm text-white outline-none focus:border-[#8B5CF6]/60"
          >
            <option value="">
              No author
            </option>

            {authors.map((author) => (
              <option
                key={author.id}
                value={author.id}
              >
                {author.name}
              </option>
            ))}
          </select>
        </div>

        {/* CATEGORY */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            Category
          </label>

          <select
            name="categoryId"
            defaultValue={quote.categoryId ?? ""}
            className="w-full rounded-xl border border-[#282e5c] bg-[#080D26] px-4 py-3.5 text-sm text-white outline-none focus:border-[#8B5CF6]/60"
          >
            <option value="">
              No category
            </option>

            {categories.map((category) => (
              <option
                key={category.id}
                value={category.id}
              >
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {/* TAGS */}
        <div>
          <label className="mb-3 block text-sm font-medium text-gray-300">
            Tags
          </label>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {tags.map((tag) => {
              const checked = quote.tagIds.includes(
                tag.id,
              );

              return (
                <label
                  key={tag.id}
                  className="flex cursor-pointer items-center gap-2 rounded-xl border border-[#282e5c] bg-[#080D26] px-3 py-3 text-sm text-gray-300 transition hover:border-[#8B5CF6]/40"
                >
                  <input
                    type="checkbox"
                    name="tagIds"
                    value={tag.id}
                    defaultChecked={checked}
                    className="accent-[#8B5CF6]"
                  />

                  <span>
                    #{tag.name}
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        {/* SOURCE */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            Source
          </label>

          <input
            type="text"
            name="source"
            defaultValue={quote.source ?? ""}
            placeholder="Book, interview, speech..."
            className="w-full rounded-xl border border-[#282e5c] bg-[#080D26] px-4 py-3.5 text-sm text-white outline-none placeholder:text-gray-700 focus:border-[#8B5CF6]/60"
          />
        </div>

        {/* SOURCE URL */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            Source URL
          </label>

          <input
            type="url"
            name="sourceUrl"
            defaultValue={quote.sourceUrl ?? ""}
            placeholder="https://..."
            className="w-full rounded-xl border border-[#282e5c] bg-[#080D26] px-4 py-3.5 text-sm text-white outline-none placeholder:text-gray-700 focus:border-[#8B5CF6]/60"
          />
        </div>

        {/* STATUS */}
        <div>
          <label className="mb-2 block text-sm font-medium text-gray-300">
            Status
          </label>

          <select
            name="status"
            defaultValue={quote.status}
            className="w-full rounded-xl border border-[#282e5c] bg-[#080D26] px-4 py-3.5 text-sm text-white outline-none focus:border-[#8B5CF6]/60"
          >
            <option value="PUBLISHED">
              Published
            </option>

            <option value="DRAFT">
              Draft
            </option>

            <option value="ARCHIVED">
              Archived
            </option>
          </select>
        </div>

        {/* ERROR */}
        {state.error && (
          <div className="rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {state.error}
          </div>
        )}

        {/* BUTTONS */}
        <div className="flex flex-col-reverse gap-3 border-t border-[#282e5c]/50 pt-6 sm:flex-row sm:justify-end">
          <Link
            href={`/dashboard/quotes/${quote.id}`}
            className="rounded-xl border border-[#282e5c] px-5 py-3 text-center text-sm font-medium text-gray-300 transition hover:border-gray-500 hover:text-white"
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={pending}
            className="rounded-xl bg-[#8B5CF6] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#7C3AED] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {pending ? "Saving..." : "Save Changes"}
          </button>
        </div>
      </div>
    </form>
  );
}