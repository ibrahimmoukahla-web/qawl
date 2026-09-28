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

import {
  TbQuoteOpen,
  TbTag,
} from "react-icons/tb";

import { FaRegHeart } from "react-icons/fa6";

import {
  BsPerson,
  BsStars,
} from "react-icons/bs";
import { FolderOpen } from "lucide-react";

export default function SideBar() {
  const router = useRouter();
  const pathname = usePathname();

  const [sideBarOpen, setSideBarOpen] =
    useState(true);

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
    href: "/dashboard/authors",
    icon: <BsPerson />,
  },
  {
    name: "Categories",
    href: "/dashboard/categories",
    icon: <FolderOpen />,
  },
  {
    name: "Tags",
    href: "/dashboard/tags",
    icon: <TbTag />,
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
        flex
        h-screen
        shrink-0
        flex-col
        overflow-hidden
        border-r
        border-[#282e5c]/40
        bg-[#080D20]
        transition-all
        duration-300
        ease-in-out
        ${
          sideBarOpen
            ? "w-[240px]"
            : "w-[76px]"
        }
      `}
    >
      {/* ===================================================
          HEADER
      ==================================================== */}

      <div className="shrink-0 px-4 pt-5">
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
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#8B5CF6]/10 text-[#C084FC]">
              <BsStars size={22} />
            </div>

            {sideBarOpen && (
              <div className="overflow-hidden">
                <p className="text-base font-bold tracking-wide text-white">
                  QAWL
                </p>

                <p className="whitespace-nowrap text-[10px] text-gray-600">
                  words worth keeping
                </p>
              </div>
            )}
          </div>

          {/* COLLAPSE BUTTON */}

          {sideBarOpen && (
            <button
              type="button"
              onClick={() =>
                setSideBarOpen(false)
              }
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-[#282e5c]/50 bg-white/[0.02] text-gray-500 transition hover:border-purple-500/30 hover:bg-purple-500/10 hover:text-purple-300"
            >
              <IoIosArrowBack size={16} />
            </button>
          )}
        </div>
      </div>

      {/* ===================================================
          NAVIGATION
      ==================================================== */}

      <nav className="min-h-0 flex-1 overflow-y-auto px-3 py-8">
        {sideBarOpen && (
          <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-[0.18em] text-gray-700">
            Menu
          </p>
        )}

        <div className="space-y-1.5">
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
                className={`
                  group
                  relative
                  flex
                  h-11
                  items-center
                  rounded-xl
                  transition-all
                  duration-200
                  ${
                    sideBarOpen
                      ? "gap-3 px-3"
                      : "justify-center"
                  }
                  ${
                    isActive
                      ? "bg-[#8B5CF6]/10 text-[#C084FC]"
                      : "text-gray-500 hover:bg-white/[0.03] hover:text-gray-200"
                  }
                `}
              >
                {/* ACTIVE INDICATOR */}

                {isActive && (
                  <span className="absolute left-0 h-5 w-[3px] rounded-r-full bg-[#8B5CF6]" />
                )}

                {/* ICON */}

                <span
                  className={`
                    flex
                    shrink-0
                    items-center
                    justify-center
                    text-[21px]
                    ${
                      isActive
                        ? "text-[#C084FC]"
                        : "text-gray-600 group-hover:text-gray-300"
                    }
                  `}
                >
                  {item.icon}
                </span>

                {/* NAME */}

                {sideBarOpen && (
                  <span className="whitespace-nowrap text-sm font-medium">
                    {item.name}
                  </span>
                )}

                {/* CLOSED TOOLTIP */}

                {!sideBarOpen && (
                  <span className="pointer-events-none absolute left-[calc(100%+10px)] z-50 hidden whitespace-nowrap rounded-lg border border-[#282e5c] bg-[#111634] px-3 py-2 text-xs text-white shadow-2xl group-hover:block">
                    {item.name}
                  </span>
                )}
              </a>
            );
          })}
        </div>
      </nav>

      {/* ===================================================
          BOTTOM
      ==================================================== */}

      <div className="shrink-0 border-t border-[#282e5c]/40 p-3">
        {/* SIGN OUT */}

        <button
          type="button"
          onClick={handleSignOut}
          className={`
            flex
            h-11
            w-full
            items-center
            rounded-xl
            text-sm
            text-gray-500
            transition
            hover:bg-red-500/10
            hover:text-red-300
            ${
              sideBarOpen
                ? "gap-3 px-3"
                : "justify-center"
            }
          `}
        >
          <IoIosLogOut
            size={20}
            className="shrink-0"
          />

          {sideBarOpen && (
            <span className="font-medium">
              Sign out
            </span>
          )}
        </button>

        {/* OPEN BUTTON */}

        {!sideBarOpen && (
          <button
            type="button"
            onClick={() =>
              setSideBarOpen(true)
            }
            className="mt-2 flex h-10 w-full items-center justify-center rounded-xl border border-[#282e5c]/50 text-gray-600 transition hover:bg-white/[0.03] hover:text-white"
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