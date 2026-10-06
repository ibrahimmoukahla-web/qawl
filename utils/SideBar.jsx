"use client";

import React, { useState } from "react";
import { usePathname, useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";

import {
IoIosArrowBack,
IoIosLogOut,
IoMdSettings,
} from "react-icons/io";

import { TiHomeOutline } from "react-icons/ti";
import { TbQuoteOpen, TbTag } from "react-icons/tb";
import { FaRegHeart } from "react-icons/fa6";
import { BsPerson, BsStars } from "react-icons/bs";
import { FolderOpen } from "lucide-react";
import { useTranslations } from "next-intl";

export default function SideBar() {
const router = useRouter();
const pathname = usePathname();
const t = useTranslations("Sidebar");
const [sideBarOpen, setSideBarOpen] = useState(true);

const navItems = [
{
name: "Home",
icon: <TiHomeOutline />,
href: "/dashboard/home",
},
{
name: "Quotes",
icon: <TbQuoteOpen />,
href: "/dashboard/quotes",
},
{
name: "Favorites",
icon: <FaRegHeart />,
href: "/dashboard/favorites",
},
{
name: "Authors",
icon: <BsPerson />,
href: "/dashboard/authors",
},
{
name: "Categories",
icon: <FolderOpen />,
href: "/dashboard/categories",
},
{
name: "Tags",
icon: <TbTag />,
href: "/dashboard/tags",
},
{
name: "Profile",
icon: <BsPerson />,
href: "/dashboard/profile",
},
{
name: "Settings",
icon: <IoMdSettings />,
href: "/dashboard/settings",
},
];

async function handleSignOut() {
await authClient.signOut({
fetchOptions: {
onSuccess: () => {
router.replace("/login");
},
},
});
}

return (
<aside
className={`
z-50
flex
shrink-0
bg-[#080D20]
border-[#282e5c]/40


    /* =========================
       MOBILE
    ========================== */

    fixed
    bottom-0
    left-0
    right-0
    h-16
    w-full
    flex-row
    border-t

    /* =========================
       DESKTOP
    ========================== */

    lg:static
    lg:h-screen
    lg:w-auto
    lg:flex-col
    lg:border-r
    lg:border-t-0
    lg:transition-all
    lg:duration-300
    lg:ease-in-out

    ${
      sideBarOpen
        ? "lg:w-[240px]"
        : "lg:w-[76px]"
    }
  `}
>
  {/* ===================================================
      DESKTOP HEADER
  ==================================================== */}

  <div className="hidden shrink-0 lg:block lg:px-4 lg:pt-5">
    <div
      className={`
        flex
        items-center
        ${
          sideBarOpen
            ? "justify-between"
            : "justify-center"
        }
      `}
    >
      {/* LOGO */}

      <div
        className={`
          flex
          items-center
          gap-2
          ${
            sideBarOpen
              ? ""
              : "justify-center"
          }
        `}
      >
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
          <BsStars size={22} />
        </div>

        {sideBarOpen && (
          <div className="overflow-hidden">
            <p className="text-base font-bold tracking-wide text-white">
              {t("QAWL")}
            </p>

            <p className="whitespace-nowrap text-[10px] text-gray-600">
              words worth keeping
            </p>
          </div>
        )}
      </div>

      {/* COLLAPSE */}

      {sideBarOpen && (
        <button
          type="button"
          onClick={() =>
            setSideBarOpen(false)
          }
          aria-label="Collapse sidebar"
          className="
            flex
            h-8
            w-8
            shrink-0
            items-center
            justify-center
            rounded-lg
            border
            border-[#282e5c]/50
            bg-white/[0.02]
            text-gray-500
            transition
            hover:border-purple-500/30
            hover:bg-purple-500/10
            hover:text-purple-300
          "
        >
          <IoIosArrowBack size={16} />
        </button>
      )}
    </div>
  </div>

  {/* ===================================================
      NAVIGATION
  ==================================================== */}

  <nav
    className="
      flex
      h-full
      w-full
      items-center
      justify-around

      /* Desktop */
      lg:min-h-0
      lg:flex-1
      lg:block
      lg:overflow-y-auto
      lg:px-3
      lg:py-8
    "
  >
    {/* Desktop title */}

    {sideBarOpen && (
      <p
        className="
          hidden
          lg:block
          mb-3
          px-3
          text-[10px]
          font-semibold
          uppercase
          tracking-[0.18em]
          text-gray-700
        "
      >
        Menu
      </p>
    )}

    <div
      className="
        flex
        h-full
        w-full
        items-center
        justify-around

        lg:block
        lg:h-auto
        lg:w-auto
        lg:space-y-1.5
      "
    >
      {navItems.map((item) => {
        const isActive =
          pathname === item.href ||
          pathname.startsWith(
            `${item.href}/`,
          );

        return (
          <a
            key={item.href}
            href={item.href}
            title={item.name}
            aria-label={item.name}
            className={`
              group
              relative
              flex
              h-14
              flex-1
              items-center
              justify-center
              text-xl
              transition-all
              duration-200

              /* Desktop */
              lg:h-11
              lg:flex-none
              lg:w-full
              lg:rounded-xl
              lg:text-base

              ${
                sideBarOpen
                  ? "lg:justify-start lg:gap-3 lg:px-3"
                  : "lg:justify-center"
              }

              ${
                isActive
                  ? "bg-[#8B5CF6]/15 text-[#C084FC]"
                  : "text-gray-500 hover:bg-white/[0.03] hover:text-gray-200"
              }
            `}
          >
            {/* Active indicator */}

            {isActive && (
              <span
                className="
                  absolute
                  bottom-1
                  left-1/2
                  h-[3px]
                  w-5
                  -translate-x-1/2
                  rounded-full
                  bg-[#8B5CF6]

                  lg:bottom-auto
                  lg:left-0
                  lg:top-1/2
                  lg:h-5
                  lg:w-[3px]
                  lg:-translate-y-1/2
                  lg:translate-x-0
                "
              />
            )}

            {/* Icon */}

            <span
              className={`
                flex
                shrink-0
                items-center
                justify-center
                text-[22px]

                ${
                  isActive
                    ? "text-[#C084FC]"
                    : "text-gray-600 group-hover:text-gray-300"
                }
              `}
            >
              {item.icon}
            </span>

            {/* Name - Desktop only */}

            {sideBarOpen && (
              <span
                className="
                  hidden
                  whitespace-nowrap
                  text-sm
                  font-medium
                  lg:inline
                "
              >
                {t(item.name)}
              </span>
            )}

            {/* Tooltip when collapsed on desktop */}

            {!sideBarOpen && (
              <span
                className="
                  pointer-events-none
                  absolute
                  left-[calc(100%+10px)]
                  z-50
                  hidden
                  whitespace-nowrap
                  rounded-lg
                  border
                  border-[#282e5c]
                  bg-[#111634]
                  px-3
                  py-2
                  text-xs
                  text-white
                  shadow-2xl
                  lg:group-hover:block
                "
              >
                {t(item.name)}
              </span>
            )}
          </a>
        );
      })}
    </div>
  </nav>

  {/* ===================================================
      BOTTOM ACTIONS
  ==================================================== */}

  <div
    className="
      flex
      shrink-0
      items-center
      justify-center
      p-1

      lg:block
      lg:border-t
      lg:border-[#282e5c]/40
      lg:p-3
    "
  >
    {/* SIGN OUT */}

    <button
      type="button"
      onClick={handleSignOut}
      title="Sign out"
      aria-label="Sign out"
      className={`
        flex
        h-14
        w-14
        items-center
        justify-center
        rounded-xl
        text-gray-500
        transition
        hover:bg-red-500/10
        hover:text-red-300

        lg:h-11
        lg:w-full
        lg:rounded-xl

        ${
          sideBarOpen
            ? "lg:justify-start lg:gap-3 lg:px-3"
            : "lg:justify-center"
        }
      `}
    >
      <IoIosLogOut
        size={21}
        className="shrink-0"
      />

      {sideBarOpen && (
        <span className="hidden font-medium lg:inline">
         {t("Sign out")}
        </span>
      )}
    </button>

    {/* DESKTOP OPEN BUTTON */}

    {!sideBarOpen && (
      <button
        type="button"
        onClick={() =>
          setSideBarOpen(true)
        }
        aria-label="Expand sidebar"
        className="
          mt-2
          hidden
          h-10
          w-full
          items-center
          justify-center
          rounded-xl
          border
          border-[#282e5c]/50
          text-gray-600
          transition
          hover:bg-white/[0.03]
          hover:text-white
          lg:flex
        "
      >
        <IoIosArrowBack
          size={17}
          className="rotate-180"
        />
      </button>
    )}
  </div>
</aside>


);
}
