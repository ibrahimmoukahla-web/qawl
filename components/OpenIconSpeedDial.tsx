"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { FaPlus, FaUserEdit, FaTag } from "react-icons/fa";
import { MdFormatQuote, MdCategory } from "react-icons/md";

type OpenIconSpeedDialProps = {
  isAdmin: boolean;
};

export default function OpenIconSpeedDial({
  isAdmin,
}: OpenIconSpeedDialProps) {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  // ============================================
  // ACTIONS
  // ============================================

  const actions = [
    {
      label: "Create Quote",
      icon: <MdFormatQuote size={20} />,
      path: "/dashboard/quotes/create",
      show: true,
    },

    {
      label: "Create Author",
      icon: <FaUserEdit size={18} />,
      path: "/dashboard/authors/create",
      show: isAdmin,
    },

    {
      label: "Create Category",
      icon: <MdCategory size={20} />,
      path: "/dashboard/categories/create",
      show: isAdmin,
    },

    {
      label: "Create Tag",
      icon: <FaTag size={18} />,
      path: "/dashboard/tags/create",
      show: isAdmin,
    },
  ];

  const visibleActions = actions.filter(
    (action) => action.show,
  );

  return (
    <div className="absolute bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Create actions */}
      {visibleActions.map((action, index) => (
        <button
          key={action.path}
          type="button"
          onClick={() => {
            setOpen(false);
            router.push(action.path);
          }}
          className={`
            flex items-center gap-3
            rounded-full
            border border-[#8B5CF6]/40
            bg-[#8B5CF6]/15
            px-4 py-2
            text-white
            backdrop-blur-md
            shadow-[0_0_20px_rgba(139,92,246,0.15)]
            transition-all duration-300
            hover:bg-[#8B5CF6]/25
            hover:border-[#C084FC]/60

            ${
              open
                ? "translate-y-0 opacity-100"
                : "pointer-events-none translate-y-3 opacity-0"
            }
          `}
          style={{
            transitionDelay: open
              ? `${index * 50}ms`
              : `${(visibleActions.length - index - 1) * 30}ms`,
          }}
        >
          <span className="whitespace-nowrap text-sm">
            {action.label}
          </span>

          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#8B5CF6]/20 text-[#C084FC]">
            {action.icon}
          </span>
        </button>
      ))}

      {/* Main button */}
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        aria-label="Open create menu"
        className="
          flex h-14 w-14 items-center justify-center
          rounded-full
          border border-[#8B5CF6]/50
          bg-[#8B5CF6]/20
          text-[#C084FC]
          backdrop-blur-md
          shadow-[0_0_20px_rgba(139,92,246,0.3)]
          transition-all duration-300
          hover:bg-[#8B5CF6]/30
        "
      >
        <FaPlus
          size={18}
          className={`
            transition-transform duration-300
            ${open ? "rotate-45" : "rotate-0"}
          `}
        />
      </button>
    </div>
  );
}