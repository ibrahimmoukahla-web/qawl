import Link from "next/link";

import {
  ArrowLeft,
  ChevronRight,
  LockKeyhole,
  Mail,
  UserRound,
  ShieldCheck,
  Trash2,
  Settings2,
} from "lucide-react";

import { getLocale, getTranslations } from "next-intl/server";

import DeleteAccountButton from "@/components/settings/DeleteAccountButton";

export default async function SettingsPage() {
  const locale = await getLocale();
  const t = await getTranslations("SettingsPage");

  const isArabic = locale === "ar";

  return (
    <div
      dir={isArabic ? "rtl" : "ltr"}
      lang={locale}
      className="
        min-h-screen
        w-full
        overflow-x-hidden
        bg-[#070B1C]
        text-white
      "
    >
      {/* =====================================================
          HEADER
      ====================================================== */}

      <header
        className="
          border-b
          border-[#282e5c]/50
          bg-[#070B1C]/90
          backdrop-blur-xl
        "
      >
        <div
          className="
            mx-auto
            flex
            min-h-[72px]
            w-full
            max-w-[1100px]
            items-center
            justify-between
            gap-4
            px-4
            sm:px-6
            lg:px-8
          "
        >
          <div className="flex min-w-0 items-center gap-3">
            <Link
              href="/dashboard/profile"
              aria-label={t("back")}
              className="
                flex
                h-9
                w-9
                shrink-0
                items-center
                justify-center
                rounded-xl
                border
                border-[#282e5c]
                bg-[#111634]
                text-gray-500
                transition
                hover:bg-[#080D26]
                hover:text-white
              "
            >
              <ArrowLeft
                size={16}
                className={isArabic ? "rotate-180" : ""}
              />
            </Link>

            <div className="min-w-0">
              <h1 className="truncate text-lg font-semibold">
                {t("title")}
              </h1>

              <p className="hidden text-xs text-gray-600 sm:block">
                {t("subtitle")}
              </p>
            </div>
          </div>

          <div
            className="
              flex
              h-9
              w-9
              shrink-0
              items-center
              justify-center
              rounded-xl
              bg-[#8B5CF6]/10
              text-[#C084FC]
            "
          >
            <Settings2 size={17} />
          </div>
        </div>
      </header>

      {/* =====================================================
          CONTENT
      ====================================================== */}

      <main
        className="
          mx-auto
          w-full
          max-w-[1100px]
          px-4
          py-6
          sm:px-6
          sm:py-8
          lg:px-8
          lg:py-10
        "
      >
        {/* ===================================================
            INTRO
        ==================================================== */}

        <section className="mb-8">
          <p
            className="
              mb-2
              text-[10px]
              font-semibold
              uppercase
              tracking-[0.2em]
              text-[#A78BFA]
            "
          >
            {t("intro.label")}
          </p>

          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            {t("intro.title")}
          </h2>

          <p
            className="
              mt-2
              max-w-2xl
              text-sm
              leading-6
              text-gray-600
            "
          >
            {t("intro.description")}
          </p>
        </section>

        {/* ===================================================
            SETTINGS
        ==================================================== */}

        <div className="space-y-5 sm:space-y-6">
          {/* =================================================
              ACCOUNT
          ================================================== */}

          <section
            className="
              overflow-hidden
              rounded-3xl
              border
              border-[#282e5c]/60
              bg-[#111634]
            "
          >
            {/* HEADER */}

            <div
              className="
                border-b
                border-[#282e5c]/50
                px-5
                py-5
                sm:px-6
              "
            >
              <div className="flex items-center gap-3">
                <div
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-[#8B5CF6]/10
                    text-[#C084FC]
                  "
                >
                  <UserRound size={18} />
                </div>

                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-gray-200">
                    {t("account.title")}
                  </h3>

                  <p className="mt-1 text-xs text-gray-600">
                    {t("account.description")}
                  </p>
                </div>
              </div>
            </div>

            {/* ITEMS */}

            <div className="divide-y divide-[#282e5c]/40">
              {/* PROFILE */}

              <Link
                href="/dashboard/profile/edit"
                className="
                  group
                  flex
                  items-center
                  justify-between
                  gap-4
                  px-5
                  py-5
                  transition
                  hover:bg-[#080D26]/60
                  sm:px-6
                "
              >
                <div className="flex min-w-0 items-center gap-4">
                  <div
                    className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-[#282e5c]
                      bg-[#080D26]
                      text-gray-500
                      transition
                      group-hover:border-[#8B5CF6]/30
                      group-hover:text-[#C084FC]
                    "
                  >
                    <UserRound size={17} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-300">
                      {t("account.editProfile.title")}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-gray-600">
                      {t("account.editProfile.description")}
                    </p>
                  </div>
                </div>

                <ChevronRight
                  size={17}
                  className={`
                    shrink-0
                    text-gray-700
                    transition
                    group-hover:text-gray-400
                    ${
                      isArabic
                        ? "group-hover:-translate-x-0.5 rotate-180"
                        : "group-hover:translate-x-0.5"
                    }
                  `}
                />
              </Link>

              {/* EMAIL */}

              <div
                className="
                  flex
                  items-center
                  justify-between
                  gap-4
                  px-5
                  py-5
                  sm:px-6
                "
              >
                <div className="flex min-w-0 items-center gap-4">
                  <div
                    className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-[#282e5c]
                      bg-[#080D26]
                      text-gray-500
                    "
                  >
                    <Mail size={17} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-300">
                      {t("account.email.title")}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-gray-600">
                      {t("account.email.description")}
                    </p>
                  </div>
                </div>

                <span
                  className="
                    shrink-0
                    rounded-full
                    border
                    border-[#282e5c]
                    bg-[#080D26]
                    px-2.5
                    py-1
                    text-[10px]
                    text-gray-600
                  "
                >
                  {t("account.email.protected")}
                </span>
              </div>
            </div>
          </section>

          {/* =================================================
              SECURITY
          ================================================== */}

          <section
            className="
              overflow-hidden
              rounded-3xl
              border
              border-[#282e5c]/60
              bg-[#111634]
            "
          >
            {/* HEADER */}

            <div
              className="
                border-b
                border-[#282e5c]/50
                px-5
                py-5
                sm:px-6
              "
            >
              <div className="flex items-center gap-3">
                <div
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-[#8B5CF6]/10
                    text-[#C084FC]
                  "
                >
                  <ShieldCheck size={18} />
                </div>

                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-gray-200">
                    {t("security.title")}
                  </h3>

                  <p className="mt-1 text-xs text-gray-600">
                    {t("security.description")}
                  </p>
                </div>
              </div>
            </div>

            {/* ITEMS */}

            <div className="divide-y divide-[#282e5c]/40">
              {/* PASSWORD */}

              <Link
                href="/dashboard/profile/changePassword"
                className="
                  group
                  flex
                  items-center
                  justify-between
                  gap-4
                  px-5
                  py-5
                  transition
                  hover:bg-[#080D26]/60
                  sm:px-6
                "
              >
                <div className="flex min-w-0 items-center gap-4">
                  <div
                    className="
                      flex
                      h-10
                      w-10
                      shrink-0
                      items-center
                      justify-center
                      rounded-xl
                      border
                      border-[#282e5c]
                      bg-[#080D26]
                      text-gray-500
                      transition
                      group-hover:border-[#8B5CF6]/30
                      group-hover:text-[#C084FC]
                    "
                  >
                    <LockKeyhole size={17} />
                  </div>

                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-300">
                      {t("security.password.title")}
                    </p>

                    <p className="mt-1 text-xs leading-5 text-gray-600">
                      {t("security.password.description")}
                    </p>
                  </div>
                </div>

                <ChevronRight
                  size={17}
                  className={`
                    shrink-0
                    text-gray-700
                    transition
                    group-hover:text-gray-400
                    ${
                      isArabic
                        ? "group-hover:-translate-x-0.5 rotate-180"
                        : "group-hover:translate-x-0.5"
                    }
                  `}
                />
              </Link>
            </div>
          </section>

          {/* =================================================
              DANGER ZONE
          ================================================== */}

          <section
            className="
              overflow-hidden
              rounded-3xl
              border
              border-red-500/20
              bg-[#111634]
            "
          >
            {/* HEADER */}

            <div
              className="
                border-b
                border-red-500/10
                px-5
                py-5
                sm:px-6
              "
            >
              <div className="flex items-center gap-3">
                <div
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-red-500/10
                    text-red-400
                  "
                >
                  <Trash2 size={18} />
                </div>

                <div className="min-w-0">
                  <h3 className="text-sm font-semibold text-red-300">
                    {t("danger.title")}
                  </h3>

                  <p className="mt-1 text-xs text-gray-600">
                    {t("danger.description")}
                  </p>
                </div>
              </div>
            </div>

            {/* DELETE */}

            <div
              className="
                flex
                flex-col
                justify-between
                gap-5
                px-5
                py-5
                sm:flex-row
                sm:items-center
                sm:px-6
              "
            >
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-300">
                  {t("danger.delete.title")}
                </p>

                <p className="mt-1 max-w-2xl text-xs leading-5 text-gray-600">
                  {t("danger.delete.description")}
                </p>
              </div>

              <div className="shrink-0">
                <DeleteAccountButton />
              </div>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}