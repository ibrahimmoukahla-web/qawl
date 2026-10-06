import Link from "next/link";

import { getLocale, getTranslations } from "next-intl/server";

import { prisma } from "@/lib/prisma";

export default async function CategoriesPage() {
  const locale = await getLocale();
  const t = await getTranslations("CategoriesPage");

  const categories = await prisma.category.findMany({
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

  const getLocalizedName = (category: {
    name: string;
    nameEn: string | null;
    nameAr: string | null;
  }) => {
    if (locale === "ar") {
      return category.nameAr?.trim() || category.name.trim();
    }

    return category.nameEn?.trim() || category.name.trim();
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
      {categories.length === 0 ? (
        <div className="flex min-h-[400px] items-center justify-center rounded-2xl border border-[#282e5c] bg-[#111634]">
          <div className="text-center">
            <div className="mb-4 text-5xl">◈</div>

            <h2 className="text-xl font-semibold text-white">
              {t("emptyTitle")}
            </h2>

            <p className="mt-2 text-sm text-gray-400">
              {t("emptyDescription")}
            </p>

            <Link
              href="/dashboard/categories/create"
              className="mt-5 inline-block rounded-lg bg-[#8B5CF6] px-5 py-2.5 text-sm font-medium text-white transition hover:bg-[#7C3AED]"
            >
              {t("createCategory")}
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((category) => {
            const categoryName = getLocalizedName(category);
            const quoteCount = category._count.quotes;

            return (
              <Link
                key={category.id}
                href={`/dashboard/categories/${category.slug}`}
                className="group rounded-2xl border border-[#282e5c] bg-[#111634] p-5 transition hover:-translate-y-1 hover:border-purple-500/50"
              >
                {/* Color */}
                <div className="mb-5 flex items-center justify-between">
                  <span
                    className="h-4 w-4 rounded-full"
                    style={{
                      backgroundColor: category.color,
                      boxShadow: `0 0 12px ${category.color}80`,
                    }}
                  />

                  <span className="text-xs text-gray-500">
                    {quoteCount}{" "}
                    {quoteCount === 1
                      ? t("quote")
                      : t("quotes")}
                  </span>
                </div>

                {/* Name */}
                <h2 className="text-lg font-semibold text-white transition group-hover:text-purple-300">
                  {categoryName}
                </h2>

                {/* Slug */}
                <p className="mt-2 text-sm text-gray-500">
                  /{category.slug}
                </p>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}