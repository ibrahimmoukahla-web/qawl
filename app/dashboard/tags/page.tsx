import Link from "next/link";

import { getLocale, getTranslations } from "next-intl/server";

import { prisma } from "@/lib/prisma";

export default async function TagsPage() {
  const locale = await getLocale();
  const t = await getTranslations("TagsPage");

  const tags = await prisma.tag.findMany({
    orderBy: {
      name: "asc",
    },
    include: {
      _count: {
        select: {
          quotes: true,
        },
      },
    },
  });

  const getLocalizedName = (tag: {
    name: string;
    nameEn: string | null;
    nameAr: string | null;
  }) => {
    if (locale === "ar") {
      return tag.nameAr?.trim() || tag.name.trim();
    }

    return tag.nameEn?.trim() || tag.name.trim();
  };

  return (
    <main
      dir={locale === "ar" ? "rtl" : "ltr"}
      lang={locale}
      className="min-h-screen w-full px-6 py-8"
    >
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-white">
            {t("title")}
          </h1>

          <p className="mt-2 text-sm text-gray-400">
            {t("subtitle")}
          </p>
        </div>
      </div>

      {/* Empty */}
      {tags.length === 0 ? (
        <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-[#282e5c] bg-[#111634]">
          <div className="text-center">
            <div className="mb-4 text-5xl">#</div>

            <h2 className="text-xl font-semibold text-white">
              {t("emptyTitle")}
            </h2>

            <p className="mt-2 text-sm text-gray-400">
              {t("emptyDescription")}
            </p>

            <Link
              href="/dashboard/tags/create"
              className="mt-5 inline-block rounded-lg bg-[#8B5CF6] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#7C3AED]"
            >
              {t("createTag")}
            </Link>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap gap-4">
          {tags.map((tag) => {
            const tagName = getLocalizedName(tag);
            const quoteCount = tag._count.quotes;

            return (
              <Link
                key={tag.id}
                href={`/dashboard/tags/${tag.slug}`}
                className="group rounded-xl border border-[#282e5c] bg-[#111634] px-5 py-4 transition hover:-translate-y-1 hover:border-purple-500/50"
              >
                <div className="flex items-center gap-3">
                  {/* Tag icon */}
                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#8B5CF6]/15 text-sm font-semibold text-[#C084FC]">
                    #
                  </span>

                  <div>
                    <h2 className="font-medium text-white transition group-hover:text-purple-300">
                      {tagName}
                    </h2>

                    <p className="mt-1 text-xs text-gray-500">
                      {quoteCount}{" "}
                      {quoteCount === 1
                        ? t("quote")
                        : t("quotes")}
                    </p>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}