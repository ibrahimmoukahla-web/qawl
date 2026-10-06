"use client";

import { useLocale } from "next-intl";

export default function LanguageSwitcher() {
  const locale = useLocale();

  function changeLanguage(nextLocale: "en" | "ar") {
    if (nextLocale === locale) {
      return;
    }

    document.cookie =
      `NEXT_LOCALE=${nextLocale}; path=/; max-age=31536000; samesite=lax`;

    window.location.reload();
  }

  return (
    <div className="flex items-center gap-1 rounded-lg border border-[#282E5C] bg-[#111634] p-1">
      <button
        type="button"
        onClick={() => changeLanguage("en")}
        className={`rounded-md px-3 py-1.5 text-sm transition ${
          locale === "en"
            ? "bg-purple-600 text-white"
            : "text-gray-400 hover:text-white"
        }`}
      >
        EN
      </button>

      <button
        type="button"
        onClick={() => changeLanguage("ar")}
        className={`rounded-md px-3 py-1.5 text-sm transition ${
          locale === "ar"
            ? "bg-purple-600 text-white"
            : "text-gray-400 hover:text-white"
        }`}
      >
        AR
      </button>
    </div>
  );
}