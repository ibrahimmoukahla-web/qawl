"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import React, { ReactElement } from "react";

export default function ButtonSideBar({
name,
icons,
SideBarIsOpen,
href,
}: {
name: string;
icons: ReactElement;
href: string;
SideBarIsOpen: boolean;
}) {
const pathname = usePathname();

const fullPath = `/dashboard${href}`;

// Active للصفحة الحالية
// ويعمل أيضاً مع الصفحات الفرعية
const isActive =
pathname === fullPath ||
pathname.startsWith(`${fullPath}/`);

return (
<Link
href={fullPath}
title={name}
aria-label={name}
className={`
group
flex
items-center
justify-center
gap-2
cursor-pointer
text-xl
transition-all
duration-200


    /* Mobile */
    w-full
    h-full
    px-2
    py-2
    rounded-xl

    /* Desktop */
    lg:w-full
    lg:h-auto
    lg:px-3
    lg:py-1
    lg:my-2
    lg:rounded-l-3xl
    lg:justify-start

    ${
      !SideBarIsOpen
        ? "lg:justify-center"
        : ""
    }

    ${
      isActive
        ? "bg-purple-800 text-white"
        : "text-gray-300 hover:bg-purple-500/70 hover:text-white"
    }
  `}
>
  {/* Icon */}

  <span
    className="
      shrink-0
      flex
      items-center
      justify-center
    "
  >
    {icons}
  </span>

  {/* Name */}

  <span
    className={`
      hidden
      whitespace-nowrap
      lg:inline

      ${
        !SideBarIsOpen
          ? "lg:hidden"
          : ""
      }
    `}
  >
    {name}
  </span>
</Link>


);
}
