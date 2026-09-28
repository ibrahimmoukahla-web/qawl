"use client";

import {
  ImagePlus,
  Link2,
  Quote as QuoteIcon,
  Sparkles,
  Tag as TagIcon,
  UserRound,
  FolderOpen,
  CircleDot,
  X,
} from "lucide-react";

import Link from "next/link";

import {
  useActionState,
  useEffect,
  useRef,
  useState,
} from "react";

import { createQuoteAction } from "./actions";

// ========================================================
// TYPES
// ========================================================

type Author = {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
};

type Category = {
  id: string;
  name: string;
  slug: string;
  color: string;
};

type Tag = {
  id: string;
  name: string;
  slug: string;
};

type QuoteFormProps = {
  authors: Author[];
  categories: Category[];
  tags: Tag[];
};

type FormState = {
  error?: string;
  success?: boolean;
  quoteId?: string;
};

const initialState: FormState = {};

// ========================================================
// COMPONENT
// ========================================================

export default function QuoteForm({
  authors,
  categories,
  tags,
}: QuoteFormProps) {
  // ======================================================
  // SERVER ACTION
  // ======================================================

  const [
    state,
    formAction,
    pending,
  ] = useActionState(
    createQuoteAction,
    initialState,
  );

  // ======================================================
  // LOCAL STATE
  // ======================================================

  const [
    quoteText,
    setQuoteText,
  ] = useState("");

  const [
    authorId,
    setAuthorId,
  ] = useState("");

  const [
    categoryId,
    setCategoryId,
  ] = useState("");

  const [
    status,
    setStatus,
  ] = useState("PUBLISHED");

  const [
    selectedTags,
    setSelectedTags,
  ] = useState<string[]>([]);

  const [
    imagePreview,
    setImagePreview,
  ] = useState<string | null>(
    null,
  );

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  // ======================================================
  // REDIRECT
  // ======================================================

  useEffect(() => {
    if (
      state.success &&
      state.quoteId
    ) {
      window.location.href =
        `/dashboard/quotes/${state.quoteId}`;
    }
  }, [
    state.success,
    state.quoteId,
  ]);

  // ======================================================
  // TAG
  // ======================================================

  function toggleTag(tagId: string) {
    setSelectedTags((current) => {
      if (current.includes(tagId)) {
        return current.filter(
          (id) => id !== tagId,
        );
      }

      return [
        ...current,
        tagId,
      ];
    });
  }

  // ======================================================
  // IMAGE
  // ======================================================

  function handleImageChange(
    event: React.ChangeEvent<HTMLInputElement>,
  ) {
    const file =
      event.target.files?.[0];

    if (!file) {
      setImagePreview(null);
      return;
    }

    if (
      !file.type.startsWith(
        "image/",
      )
    ) {
      setImagePreview(null);
      return;
    }

    const previewUrl =
      URL.createObjectURL(file);

    setImagePreview(previewUrl);
  }

  function removeImage() {
    setImagePreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value =
        "";
    }
  }

  // ======================================================
  // SELECTED DATA
  // ======================================================

  const selectedAuthor =
    authors.find(
      (author) =>
        author.id === authorId,
    );

  const selectedCategory =
    categories.find(
      (category) =>
        category.id === categoryId,
    );

  // ======================================================
  // RETURN
  // ======================================================

  return (
    <form
      action={formAction}
      encType="multipart/form-data"
      className="
        grid
        w-full
        min-w-0
        grid-cols-1
        items-start
        gap-5
        xl:grid-cols-[minmax(0,1fr)_320px]
      "
    >
      {/* ==================================================
          LEFT
      ================================================== */}

      <div className="min-w-0 space-y-5">
        {/* ================================================
            QUOTE EDITOR
        ================================================= */}

        <section className="min-w-0 overflow-hidden rounded-3xl border border-[#282e5c]/60 bg-[#111634]">
          {/* HEADER */}

          <div className="border-b border-[#282e5c]/50 px-5 py-5 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#8B5CF6]/10 text-[#C084FC]">
                <QuoteIcon size={19} />
              </div>

              <div className="min-w-0">
                <h2 className="text-sm font-semibold text-white">
                  Your quote
                </h2>

                <p className="mt-0.5 text-xs text-gray-600">
                  Write the words exactly as
                  you want them to appear.
                </p>
              </div>
            </div>
          </div>

          {/* TEXTAREA */}

          <div className="min-w-0 p-5 sm:p-6">
            <textarea
              name="text"
              value={quoteText}
              onChange={(event) =>
                setQuoteText(
                  event.target.value,
                )
              }
              placeholder="Start writing your quote..."
              rows={10}
              required
              className="
                block
                min-h-[280px]
                w-full
                min-w-0
                resize-none
                overflow-y-auto
                border-0
                bg-transparent
                text-xl
                font-medium
                leading-[1.65]
                tracking-tight
                text-gray-100
                outline-none
                placeholder:text-gray-700
                sm:text-2xl
              "
            />

            <div className="mt-4 flex items-center justify-between border-t border-[#282e5c]/40 pt-4 text-xs text-gray-600">
              <span>
                Required
              </span>

              <span>
                {quoteText.length}
              </span>
            </div>
          </div>
        </section>

        {/* ================================================
            LIVE PREVIEW
        ================================================= */}

        <section className="min-w-0 overflow-hidden rounded-3xl border border-[#282e5c]/60 bg-[#111634]">
          {/* HEADER */}

          <div className="flex items-center justify-between border-b border-[#282e5c]/50 px-5 py-5 sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#8B5CF6]/10 text-[#C084FC]">
                <Sparkles size={17} />
              </div>

              <div className="min-w-0">
                <h2 className="text-sm font-semibold text-white">
                  Live preview
                </h2>

                <p className="text-xs text-gray-600">
                  See how your quote looks.
                </p>
              </div>
            </div>

            <span className="hidden shrink-0 rounded-full border border-[#8B5CF6]/20 bg-[#8B5CF6]/5 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-[#C084FC] sm:block">
              Preview
            </span>
          </div>

          {/* PREVIEW */}

          <div className="min-w-0 p-5 sm:p-6">
            <div className="relative min-w-0 overflow-hidden rounded-[28px] border border-white/[0.05] bg-[#080D26]">
              {/* glow */}

              <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-purple-600/10 blur-[100px]" />

              <div className="relative min-w-0 p-6 sm:p-8 md:p-10">
                {/* BRAND */}

                <div className="mb-8 flex items-center gap-2 text-[#C084FC]">
                  <QuoteIcon size={17} />

                  <span className="text-[10px] font-semibold uppercase tracking-[0.25em]">
                    QAWL
                  </span>
                </div>

                {/* TEXT */}

                <p className="whitespace-pre-wrap break-words text-[clamp(1.35rem,3vw,2.1rem)] font-medium leading-[1.65] tracking-tight text-white">
                  {quoteText ||
                    "Your quote will appear here..."}
                </p>

                {/* DIVIDER */}

                <div className="my-8 h-px w-full bg-[#282e5c]/50" />

                {/* AUTHOR */}

                <div className="flex min-w-0 items-end justify-between gap-4">
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-[#C084FC]">
                      {selectedAuthor?.name ??
                        "Unknown author"}
                    </p>

                    {selectedCategory && (
                      <p className="mt-1 truncate text-xs text-gray-600">
                        {selectedCategory.name}
                      </p>
                    )}
                  </div>

                  <p className="shrink-0 text-[10px] uppercase tracking-wider text-gray-700">
                    {status ===
                    "PUBLISHED"
                      ? "Published"
                      : status ===
                          "DRAFT"
                        ? "Draft"
                        : "Archived"}
                  </p>
                </div>

                {/* TAGS */}

                {selectedTags.length >
                  0 && (
                  <div className="mt-6 flex min-w-0 flex-wrap gap-2">
                    {selectedTags.map(
                      (tagId) => {
                        const tag =
                          tags.find(
                            (item) =>
                              item.id ===
                              tagId,
                          );

                        if (!tag) {
                          return null;
                        }

                        return (
                          <span
                            key={tag.id}
                            className="max-w-full truncate rounded-full border border-[#8B5CF6]/20 bg-[#8B5CF6]/5 px-3 py-1.5 text-[11px] text-[#C084FC]"
                          >
                            #{tag.name}
                          </span>
                        );
                      },
                    )}
                  </div>
                )}

                {/* IMAGE */}

                {imagePreview && (
                  <div className="relative mt-7 min-w-0 overflow-hidden rounded-2xl border border-[#282e5c]/50">
                    <img
                      src={imagePreview}
                      alt="Quote preview"
                      className="block h-auto max-h-[420px] w-full object-cover"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ================================================
            IMAGE
        ================================================= */}

        <section className="min-w-0 overflow-hidden rounded-3xl border border-[#282e5c]/60 bg-[#111634]">
          {/* HEADER */}

          <div className="border-b border-[#282e5c]/50 px-5 py-5 sm:px-6">
            <div className="flex items-center gap-3">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-[#8B5CF6]/10 text-[#C084FC]">
                <ImagePlus size={17} />
              </div>

              <div className="min-w-0">
                <h2 className="text-sm font-semibold text-white">
                  Quote image
                </h2>

                <p className="text-xs text-gray-600">
                  Optional visual for this quote.
                </p>
              </div>
            </div>
          </div>

          {/* BODY */}

          <div className="p-5 sm:p-6">
            <input
              ref={fileInputRef}
              type="file"
              name="image"
              accept="image/png,image/jpeg,image/webp"
              onChange={
                handleImageChange
              }
              className="hidden"
            />

            {!imagePreview ? (
              <button
                type="button"
                onClick={() =>
                  fileInputRef.current?.click()
                }
                className="
                  flex
                  min-h-[180px]
                  w-full
                  flex-col
                  items-center
                  justify-center
                  rounded-2xl
                  border
                  border-dashed
                  border-[#282e5c]
                  bg-[#080D26]
                  transition
                  hover:border-[#8B5CF6]/50
                  hover:bg-[#8B5CF6]/[0.03]
                "
              >
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#8B5CF6]/10 text-[#C084FC]">
                  <ImagePlus size={21} />
                </div>

                <p className="text-sm font-medium text-gray-300">
                  Add an image
                </p>

                <p className="mt-1 text-xs text-gray-600">
                  PNG, JPG or WEBP
                </p>
              </button>
            ) : (
              <div className="relative min-w-0 overflow-hidden rounded-2xl border border-[#282e5c]/50">
                <img
                  src={imagePreview}
                  alt="Selected quote"
                  className="block max-h-[420px] w-full object-cover"
                />

                <button
                  type="button"
                  onClick={
                    removeImage
                  }
                  className="absolute right-3 top-3 flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/50 text-white backdrop-blur-md transition hover:bg-black/70"
                >
                  <X size={16} />
                </button>
              </div>
            )}
          </div>
        </section>
      </div>

      {/* ==================================================
          RIGHT SIDE
      ================================================== */}

      <aside className="w-full min-w-0 xl:sticky xl:top-5 xl:self-start">
        <div className="min-w-0 overflow-hidden rounded-3xl border border-[#282e5c]/60 bg-[#111634]">
          {/* HEADER */}

          <div className="border-b border-[#282e5c]/50 px-5 py-5">
            <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-600">
              Quote settings
            </p>

            <h2 className="mt-1 text-lg font-semibold text-white">
              Details
            </h2>
          </div>

          {/* SETTINGS */}

          <div className="space-y-7 p-5">
            {/* ============================================
                AUTHOR
            ============================================= */}

            <div>
              <label className="mb-2.5 flex items-center gap-2 text-xs font-medium text-gray-400">
                <UserRound size={14} />

                <span>
                  Author
                </span>
              </label>

              <select
                name="authorId"
                value={authorId}
                onChange={(event) =>
                  setAuthorId(
                    event.target.value,
                  )
                }
                className="
                  w-full
                  min-w-0
                  appearance-none
                  rounded-xl
                  border
                  border-[#282e5c]
                  bg-[#080D26]
                  px-4
                  py-3
                  text-sm
                  text-gray-200
                  outline-none
                  transition
                  focus:border-[#8B5CF6]/60
                  focus:ring-2
                  focus:ring-[#8B5CF6]/10
                "
              >
                <option value="">
                  Unknown / No author
                </option>

                {authors.map(
                  (author) => (
                    <option
                      key={author.id}
                      value={author.id}
                    >
                      {author.name}
                    </option>
                  ),
                )}
              </select>
            </div>

            {/* ============================================
                CATEGORY
            ============================================= */}

            <div>
              <label className="mb-2.5 flex items-center gap-2 text-xs font-medium text-gray-400">
                <FolderOpen size={14} />

                <span>
                  Category
                </span>
              </label>

              <select
                name="categoryId"
                value={categoryId}
                onChange={(event) =>
                  setCategoryId(
                    event.target.value,
                  )
                }
                className="
                  w-full
                  min-w-0
                  appearance-none
                  rounded-xl
                  border
                  border-[#282e5c]
                  bg-[#080D26]
                  px-4
                  py-3
                  text-sm
                  text-gray-200
                  outline-none
                  transition
                  focus:border-[#8B5CF6]/60
                  focus:ring-2
                  focus:ring-[#8B5CF6]/10
                "
              >
                <option value="">
                  No category
                </option>

                {categories.map(
                  (category) => (
                    <option
                      key={category.id}
                      value={category.id}
                    >
                      {category.name}
                    </option>
                  ),
                )}
              </select>
            </div>

            {/* ============================================
                TAGS
            ============================================= */}

            <div>
              <label className="mb-3 flex items-center gap-2 text-xs font-medium text-gray-400">
                <TagIcon size={14} />

                <span>
                  Tags
                </span>
              </label>

              {tags.length === 0 ? (
                <p className="text-xs text-gray-600">
                  No tags available.
                </p>
              ) : (
                <div className="flex min-w-0 flex-wrap gap-2">
                  {tags.map((tag) => {
                    const isSelected =
                      selectedTags.includes(
                        tag.id,
                      );

                    return (
                      <button
                        key={tag.id}
                        type="button"
                        onClick={() =>
                          toggleTag(
                            tag.id,
                          )
                        }
                        className={
                          isSelected
                            ? `
                              rounded-full
                              border
                              border-[#8B5CF6]/40
                              bg-[#8B5CF6]/10
                              px-3
                              py-1.5
                              text-xs
                              text-[#C084FC]
                            `
                            : `
                              rounded-full
                              border
                              border-[#282e5c]
                              bg-[#080D26]
                              px-3
                              py-1.5
                              text-xs
                              text-gray-500
                              transition
                              hover:border-[#8B5CF6]/30
                              hover:text-gray-300
                            `
                        }
                      >
                        #{tag.name}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* HIDDEN TAG INPUTS */}

              {selectedTags.map(
                (tagId) => (
                  <input
                    key={tagId}
                    type="hidden"
                    name="tagIds"
                    value={tagId}
                  />
                ),
              )}
            </div>

            {/* ============================================
                SOURCE
            ============================================= */}

            <div>
              <label className="mb-2.5 block text-xs font-medium text-gray-400">
                Source
              </label>

              <div className="space-y-2.5">
                <input
                  type="text"
                  name="source"
                  placeholder="Book, article, interview..."
                  className="
                    w-full
                    min-w-0
                    rounded-xl
                    border
                    border-[#282e5c]
                    bg-[#080D26]
                    px-4
                    py-3
                    text-sm
                    text-gray-200
                    outline-none
                    placeholder:text-gray-700
                    focus:border-[#8B5CF6]/60
                    focus:ring-2
                    focus:ring-[#8B5CF6]/10
                  "
                />

                <div className="relative min-w-0">
                  <Link2
                    size={15}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600"
                  />

                  <input
                    type="url"
                    name="sourceUrl"
                    placeholder="https://example.com"
                    className="
                      w-full
                      min-w-0
                      rounded-xl
                      border
                      border-[#282e5c]
                      bg-[#080D26]
                      py-3
                      pl-10
                      pr-4
                      text-sm
                      text-gray-200
                      outline-none
                      placeholder:text-gray-700
                      focus:border-[#8B5CF6]/60
                      focus:ring-2
                      focus:ring-[#8B5CF6]/10
                    "
                  />
                </div>
              </div>
            </div>

            {/* ============================================
                STATUS
            ============================================= */}

            <div>
              <label className="mb-2.5 flex items-center gap-2 text-xs font-medium text-gray-400">
                <CircleDot size={14} />

                <span>
                  Status
                </span>
              </label>

              <select
                name="status"
                value={status}
                onChange={(event) =>
                  setStatus(
                    event.target.value,
                  )
                }
                className="
                  w-full
                  min-w-0
                  appearance-none
                  rounded-xl
                  border
                  border-[#282e5c]
                  bg-[#080D26]
                  px-4
                  py-3
                  text-sm
                  text-gray-200
                  outline-none
                  transition
                  focus:border-[#8B5CF6]/60
                  focus:ring-2
                  focus:ring-[#8B5CF6]/10
                "
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

            {/* ============================================
                ERROR
            ============================================= */}

            {state.error && (
              <div className="min-w-0 break-words rounded-xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-300">
                {state.error}
              </div>
            )}

            {/* ============================================
                ACTIONS
            ============================================= */}

            <div className="border-t border-[#282e5c]/50 pt-6">
              <button
                type="submit"
                disabled={pending}
                className="
                  w-full
                  rounded-xl
                  bg-[#8B5CF6]
                  px-4
                  py-3.5
                  text-sm
                  font-semibold
                  text-white
                  shadow-[0_0_25px_rgba(139,92,246,0.18)]
                  transition
                  hover:bg-[#7C3AED]
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                {pending
                  ? "Creating..."
                  : "Create Quote"}
              </button>

              <Link
                href="/dashboard/home"
                className="
                  mt-3
                  flex
                  w-full
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-[#282e5c]
                  px-4
                  py-3.5
                  text-sm
                  text-gray-500
                  transition
                  hover:bg-[#080D26]
                  hover:text-white
                "
              >
                Cancel
              </Link>
            </div>
          </div>
        </div>
      </aside>
    </form>
  );
}