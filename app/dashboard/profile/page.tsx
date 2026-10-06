import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import type { ReactNode } from "react";

import { getLocale, getTranslations } from "next-intl/server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

import { FiCalendar } from "react-icons/fi";
import { MdOutlineMailOutline, MdOutlineEmail } from "react-icons/md";
import { TbQuote } from "react-icons/tb";
import { FaRegHeart, FaPersonCircleCheck } from "react-icons/fa6";
import { VscTag } from "react-icons/vsc";
import { LuUsersRound } from "react-icons/lu";
import { IoPersonCircleOutline } from "react-icons/io5";
import { RxPerson } from "react-icons/rx";
import { MdOutlineContactPage } from "react-icons/md";
import { FaRegCalendarAlt } from "react-icons/fa";

import UserLocation from "@/components/UserLocation";

export default async function Page() {
  const locale = await getLocale();
  const t = await getTranslations("ProfilePage");

  // =========================================================
  // AUTH
  // =========================================================

  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return (
      <div
        dir={locale === "ar" ? "rtl" : "ltr"}
        lang={locale}
        className="flex min-h-screen w-full items-center justify-center text-gray-400"
      >
        {t("notAuthenticated")}
      </div>
    );
  }

  // =========================================================
  // USER
  // =========================================================

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },

    select: {
      id: true,
      name: true,
      email: true,
      username: true,
      bio: true,
      role: true,
      image: true,
      coverImage: true,
      emailVerified: true,
      createdAt: true,
    },
  });

  if (!user) {
    return (
      <div
        dir={locale === "ar" ? "rtl" : "ltr"}
        lang={locale}
        className="flex min-h-screen w-full items-center justify-center text-gray-400"
      >
        {t("userNotFound")}
      </div>
    );
  }

  // =========================================================
  // STATS
  // =========================================================

  const [quotesCount, favoritesCount, userTags, followersCount] =
    await Promise.all([
      prisma.quote.count({
        where: {
          createdById: user.id,
        },
      }),

      prisma.favorite.count({
        where: {
          userId: user.id,
        },
      }),

      prisma.quoteTag.findMany({
        where: {
          quote: {
            createdById: user.id,
          },
        },

        select: {
          tagId: true,
        },
      }),

      prisma.follow.count({
        where: {
          followingId: user.id,
        },
      }),
    ]);

  const tagsCount = new Set(
    userTags.map((item) => item.tagId),
  ).size;

  // =========================================================
  // SAFE DISPLAY VALUES
  // =========================================================

  const displayName =
    user.name?.trim() || t("anonymousUser");

  const displayUsername = user.username?.trim()
    ? `@${user.username.trim()}`
    : t("notSet");

  const displayBio =
    user.bio?.trim() || t("noBio");

  const joinedDate = new Intl.DateTimeFormat(
    locale === "ar" ? "ar-DZ" : "en-US",
    {
      year: "numeric",
      month: "long",
      day: "numeric",
    },
  ).format(user.createdAt);

  const role = user.role?.trim() || "user";

  // =========================================================
  // UI
  // =========================================================

  return (
    <div
      dir={locale === "ar" ? "rtl" : "ltr"}
      lang={locale}
      className="
        min-h-screen
        w-full
        overflow-x-hidden
        bg-transparent
        lg:h-screen
      "
    >
      {/* =====================================================
          PROFILE HEADER
      ====================================================== */}

      <section
        className="
          relative
          h-[330px]
          w-full
          shrink-0
          sm:h-[360px]
          md:h-[390px]
          lg:h-[38vh]
          lg:min-h-[350px]
        "
      >
        {/* ================= COVER ================= */}

        <div className="absolute inset-0 overflow-hidden">
          <Image
            src={user.coverImage || "/profile.jpg"}
            alt={t("coverAlt")}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center"
          />

          {/* Cover overlay */}

          <div className="absolute inset-0 bg-black/40" />

          {/* Bottom fade */}

          <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#080d2e] to-transparent" />
        </div>

        {/* ================= PROFILE CONTENT ================= */}

        <div
          className="
            absolute
            inset-x-0
            bottom-0
            px-4
            pb-5
            sm:px-6
            md:px-8
          "
        >
          <div
            className="
              mx-auto
              flex
              w-full
              max-w-7xl
              flex-col
              gap-4
              sm:flex-row
              sm:items-end
            "
          >
            {/* ================= PROFILE IMAGE ================= */}

            <div
              className="
                relative
                h-24
                w-24
                shrink-0
                overflow-hidden
                rounded-full
                border-4
                border-[#080d2e]
                bg-[#111634]
                ring-4
                ring-purple-500
                shadow-[0_0_10px_#a855f7,0_0_25px_#a855f7,0_0_45px_#a855f7]
                sm:h-28
                sm:w-28
                md:h-32
                md:w-32
                lg:h-36
                lg:w-36
              "
            >
              <Image
                src={user.image || "/profile.jpg"}
                alt={displayName}
                fill
                sizes="
                  (max-width: 640px) 96px,
                  (max-width: 768px) 112px,
                  (max-width: 1024px) 128px,
                  144px
                "
                className="object-cover"
              />
            </div>

            {/* ================= USER INFO ================= */}

            <div
              className="
                min-w-0
                flex-1
                pb-1
                text-[#F4F4F8]
              "
            >
              <div className="min-w-0">
                <h1
                  className="
                    truncate
                    text-2xl
                    font-extrabold
                    tracking-tight
                    sm:text-3xl
                  "
                >
                  {displayName}
                </h1>

                <p className="mt-1 truncate text-sm text-[#A8AEC7]">
                  {displayUsername}
                </p>
              </div>

              {/* Email */}

              <div
                className="
                  mt-2
                  flex
                  min-w-0
                  items-center
                  gap-2
                  text-sm
                  text-[#A8AEC7]
                "
              >
                <MdOutlineMailOutline
                  className="shrink-0"
                  size={17}
                />

                <span className="truncate">{user.email}</span>
              </div>

              {/* Bio */}

              <p
                className="
                  mt-2
                  line-clamp-2
                  max-w-2xl
                  text-sm
                  leading-6
                  text-[#C5C8D8]
                "
              >
                {displayBio}
              </p>

              {/* Date + location */}

              <div
                className="
                  mt-2
                  flex
                  flex-wrap
                  items-center
                  gap-x-4
                  gap-y-1
                  text-xs
                  text-[#A8AEC7]
                  sm:text-sm
                "
              >
                <span className="flex items-center gap-1.5">
                  <FiCalendar size={15} />

                  {t("joined", {
                    date: joinedDate,
                  })}
                </span>

                <UserLocation />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =====================================================
          MAIN CONTENT
      ====================================================== */}

      <main
        className="
          w-full
          px-2
          pb-4
          sm:px-3
          lg:h-[62vh]
          lg:min-h-0
          lg:px-4
        "
      >
        <div
          className="
            mx-auto
            flex
            h-full
            w-full
            max-w-7xl
            flex-col
            gap-3
            lg:flex-row
          "
        >
          {/* =================================================
              LEFT SIDE
          ================================================== */}

          <section
            className="
              flex
              min-w-0
              flex-col
              gap-3
              lg:min-h-0
              lg:flex-[3]
            "
          >
            {/* ===================== STATS ===================== */}

            <div
              className="
                shrink-0
                rounded-2xl
                border
                border-[#242b5c]
                bg-[#111634]
                p-3
                sm:p-4
              "
            >
              <div
                className="
                  grid
                  grid-cols-2
                  divide-y
                  divide-[#40466D]
                  sm:grid-cols-4
                  sm:divide-x
                  sm:divide-y-0
                  sm:rtl:divide-x-reverse
                "
              >
                <StatItem
                  icon={<TbQuote size={24} />}
                  value={quotesCount}
                  label={t("stats.quotes")}
                />

                <StatItem
                  icon={<FaRegHeart size={22} />}
                  value={favoritesCount}
                  label={t("stats.favorites")}
                />

                <StatItem
                  icon={<VscTag size={23} />}
                  value={tagsCount}
                  label={t("stats.tags")}
                />

                <StatItem
                  icon={<LuUsersRound size={23} />}
                  value={followersCount}
                  label={t("stats.followers")}
                />
              </div>
            </div>

            {/* ================= PERSONAL INFO ================= */}

            <div
              className="
                min-w-0
                rounded-2xl
                border
                border-[#242b5c]
                bg-[#111634]
                p-4
                sm:p-5
                lg:flex-1
                lg:min-h-0
                lg:overflow-y-auto
                scrollbar-none
              "
            >
              {/* Header */}

              <div className="flex items-center gap-2">
                <div
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-[#8B5CF6]/15
                    text-[#C084FC]
                  "
                >
                  <IoPersonCircleOutline size={27} />
                </div>

                <div className="min-w-0">
                  <h2 className="text-lg font-bold sm:text-xl">
                    {t("personalInfo.title")}
                  </h2>

                  <p className="text-xs text-[#686D8F] sm:text-sm">
                    {t("personalInfo.subtitle")}
                  </p>
                </div>
              </div>

              {/* Information */}

              <div className="mt-6 flex flex-col gap-3">
                <InfoRow
                  icon={<RxPerson size={19} />}
                  label={t("fields.fullName")}
                  value={displayName}
                />

                <InfoRow
                  icon={<MdOutlineEmail size={19} />}
                  label={t("fields.email")}
                  value={user.email}
                />

                <InfoRow
                  icon={<LuUsersRound size={19} />}
                  label={t("fields.username")}
                  value={displayUsername}
                />

                <InfoRow
                  icon={<FaPersonCircleCheck size={19} />}
                  label={t("fields.role")}
                  value={role}
                  capitalize
                />

                <InfoRow
                  icon={<MdOutlineContactPage size={19} />}
                  label={t("fields.bio")}
                  value={displayBio}
                  multiline
                />

                <InfoRow
                  icon={<FaRegCalendarAlt size={19} />}
                  label={t("fields.memberSince")}
                  value={joinedDate}
                />
              </div>
            </div>
          </section>

          {/* =================================================
              RIGHT SIDE
          ================================================== */}

          <aside
            className="
              flex
              min-w-0
              flex-col
              gap-3
              lg:min-h-0
              lg:flex-1
              lg:overflow-y-auto
              scrollbar-none
            "
          >
            {/* ================= PROFILE ACTIONS ================= */}

            <div
              className="
                rounded-2xl
                border
                border-[#242b5c]
                bg-[#111634]
                p-4
              "
            >
              <h2 className="mb-4 text-base font-bold sm:text-lg">
                {t("actions.title")}
              </h2>

              <div className="flex flex-col gap-2">
                <ProfileLink
                  href="/dashboard/profile/edit"
                  icon={<IoPersonCircleOutline size={22} />}
                  label={t("actions.editProfile")}
                />

                <ProfileLink
                  href="/dashboard/favorites"
                  icon={<FaRegHeart size={20} />}
                  label={t("actions.myFavorites")}
                />

                <ProfileLink
                  href="/dashboard/quotes/my-quotes"
                  icon={<TbQuote size={22} />}
                  label={t("actions.myQuotes")}
                />
              </div>
            </div>

            {/* ================= ACCOUNT INFO ================= */}

            <div
              className="
                rounded-2xl
                border
                border-[#242b5c]
                bg-[#111634]
                p-4
              "
            >
              <h2 className="mb-4 text-base font-bold sm:text-lg">
                {t("account.title")}
              </h2>

              <div className="flex flex-col gap-4">
                {/* Status */}

                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-[#686D8F]">
                    {t("account.status")}
                  </span>

                  <span
                    className="
                      shrink-0
                      rounded-full
                      bg-green-500/10
                      px-2.5
                      py-1
                      text-xs
                      font-semibold
                      text-green-400
                    "
                  >
                    {t("account.active")}
                  </span>
                </div>

                {/* Role */}

                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-[#686D8F]">
                    {t("account.role")}
                  </span>

                  <span className="text-sm font-semibold capitalize text-[#F4F4F8]">
                    {role}
                  </span>
                </div>

                {/* Email Verification */}

                <div className="flex items-center justify-between gap-4">
                  <span className="text-sm text-[#686D8F]">
                    {t("account.emailVerified")}
                  </span>

                  <span
                    className={`shrink-0 text-sm font-semibold ${
                      user.emailVerified
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {user.emailVerified
                      ? t("account.verified")
                      : t("account.notVerified")}
                  </span>
                </div>
              </div>
            </div>

            {/* ================= QUICK STATS ================= */}

            <div
              className="
                rounded-2xl
                border
                border-[#242b5c]
                bg-[#111634]
                p-4
              "
            >
              <h2 className="mb-4 text-base font-bold sm:text-lg">
                {t("quickStats.title")}
              </h2>

              <div className="grid grid-cols-2 gap-3">
                <QuickStat
                  label={t("stats.quotes")}
                  value={quotesCount}
                />

                <QuickStat
                  label={t("stats.favorites")}
                  value={favoritesCount}
                />

                <QuickStat
                  label={t("stats.tags")}
                  value={tagsCount}
                />

                <QuickStat
                  label={t("stats.followers")}
                  value={followersCount}
                />
              </div>
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

/* ============================================================
   STAT ITEM
============================================================ */

function StatItem({
  icon,
  value,
  label,
}: {
  icon: ReactNode;
  value: number;
  label: string;
}) {
  return (
    <div
      className="
        flex
        items-center
        justify-center
        gap-2
        px-2
        py-3
        sm:py-2
      "
    >
      <div className="shrink-0 text-[#C084FC]">
        {icon}
      </div>

      <div className="min-w-0">
        <div className="text-base font-bold text-[#F4F4F8] sm:text-lg">
          {value}
        </div>

        <div className="truncate text-[11px] text-[#686D8F] sm:text-xs">
          {label}
        </div>
      </div>
    </div>
  );
}

/* ============================================================
   INFO ROW
============================================================ */

function InfoRow({
  icon,
  label,
  value,
  multiline = false,
  capitalize = false,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  multiline?: boolean;
  capitalize?: boolean;
}) {
  return (
    <div
      className="
        grid
        grid-cols-1
        gap-1.5
        rounded-xl
        border
        border-[#242b5c]/60
        bg-[#0c1233]
        p-3
        sm:grid-cols-[160px_minmax(0,1fr)]
        sm:items-start
        sm:gap-4
      "
    >
      {/* Label */}

      <span
        className="
          flex
          items-center
          gap-2
          text-xs
          text-[#686D8F]
          sm:text-sm
        "
      >
        <span className="shrink-0 text-[#C084FC]">
          {icon}
        </span>

        {label}
      </span>

      {/* Value */}

      <span
        className={`
          min-w-0
          break-words
          text-sm
          font-semibold
          text-[#F4F4F8]
          ${multiline ? "whitespace-pre-wrap leading-6" : ""}
          ${capitalize ? "capitalize" : ""}
        `}
      >
        {value}
      </span>
    </div>
  );
}

/* ============================================================
   PROFILE LINK
============================================================ */

function ProfileLink({
  href,
  icon,
  label,
}: {
  href: string;
  icon: ReactNode;
  label: string;
}) {
  return (
    <Link
      href={href}
      className="
        group
        flex
        w-full
        items-center
        gap-3
        rounded-xl
        border
        border-transparent
        bg-[#181E42]
        px-4
        py-3
        text-sm
        text-[#F4F4F8]
        transition
        duration-200
        hover:border-[#8B5CF6]/30
        hover:bg-[#222955]
        sm:text-base
      "
    >
      <span
        className="
          shrink-0
          text-[#C084FC]
          transition
          group-hover:scale-105
        "
      >
        {icon}
      </span>

      <span className="truncate">
        {label}
      </span>
    </Link>
  );
}

/* ============================================================
   QUICK STAT
============================================================ */

function QuickStat({
  label,
  value,
}: {
  label: string;
  value: number;
}) {
  return (
    <div
      className="
        rounded-xl
        border
        border-[#242b5c]/60
        bg-[#181E42]
        p-3
      "
    >
      <p className="text-xs text-[#686D8F]">
        {label}
      </p>

      <p className="mt-1 text-xl font-bold text-[#F4F4F8]">
        {value}
      </p>
    </div>
  );
}