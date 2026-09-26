"use client";

import { useState } from "react";
import { FaPlus } from "react-icons/fa6";
import { MdFormatQuote } from "react-icons/md";
import { useRouter } from "next/navigation";

export default function OpenIconSpeedDial() {
  const [open, setOpen] = useState(false);
  const router = useRouter();

  return (
    <div className="absolute bottom-6 right-6 z-50 flex flex-col items-end gap-3">

      {/* Create Quote */}
      <button
        onClick={() => router.push("/dashboard/quotes/create")}
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
      >
        <span className="text-sm">
          Create Quote
        </span>

        <span className="flex h-9 w-9 items-center justify-center rounded-full bg-[#8B5CF6]/20 text-[#C084FC]">
          <MdFormatQuote size={20} />
        </span>
      </button>

      {/* Main button */}
      <button
        onClick={() => setOpen((prev) => !prev)}
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
          className={`
            transition-transform duration-300
            ${open ? "rotate-45" : "rotate-0"}
          `}
        />
      </button>

    </div>
  );
}