import Image from "next/image";
import React from "react";
import { FaRegHeart } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa";
import { SiCdprojekt } from "react-icons/si";
import CardQuates from "./cardQuates";
import InputGroupKbd from "@/components/Search";
import { AvatarDropdown } from "@/components/DropdownAvatar";

export default function Page() {
  return (
    <div className="w-full h-screen flex flex-col  ">
      {/* ================= top page ================== */}

      <div className="bg-blue-900 w-full h-1/3 flex flex-col">
        <div className="w-full h-9 bg-fuchsia-500 ">
          <div className="flex px-2  relative justify-between">
            <InputGroupKbd/>
            <div>

            <AvatarDropdown/>
            </div>
          </div>
          
          
          </div>
        <div className=" bg-cyan-900 w-full overflow-hidden flex-1 relative">
          <Image src="/coverHome3.jpg" alt="cover" fill className="center" />
        </div>
      </div>

      {/* ================= top page ================== */}
      <div className=" w-full flex-1 flex  min-h-0">
        <div className=" flex-3 flex flex-col gap-2 m-2 min-h-0">
          {/* ------------------- header ================= */}
          <div className="bg-[#111634] border border-[#242b5c] flex-1 rounded-2xl px-2 p-1 flex flex-col gap-1">
            <div className=" flex justify-between">
              <h1 className="font-bold">Explore Categories</h1>
              <button className="flex gap-1 items-center text-[#8B5CF6] ">
                <span>View all </span>
                <FaArrowRight />
              </button>
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 border-1 rounded-2xl w-fit p-0.5 ">
                <FaRegHeart />
                love
              </button>
              <button className="flex items-center gap-2 border-1 rounded-2xl w-fit p-0.5 cursor-pointer ">
                <FaRegHeart />
                love
              </button>
            </div>
          </div>
          {/* ------------------- header ================= */}
          {/* ------------------- body  ================= */}

          <div className="bg-[#080d2e] border border-[#282e5c] flex-6 rounded-2xl px-2 flex flex-col gap-2 min-h-0">
            {/* ((((((((( head ))))))))) */}

            <div className="flex justify-between items-center">
              <div className="flex gap-1 items-center">
                <SiCdprojekt className="text-[#C084FC]" size={30} />{" "}
                <span className="font-bold"> Latest Quotes</span>
              </div>
              kkkk
            </div>
            {/* ((((((((( head ))))))))) */}
            <div className="flex-1 min-h-0 scroll overflow-y-auto flex flex-col gap-3 cont">
              <CardQuates />
              <CardQuates />
              <CardQuates />
            </div>
          </div>
          {/* ------------------- body  ================= */}
        </div>
        {/* ------------------- left side ================= */}

        <div className="bg-blue-800 flex-1"></div>
        {/* ------------------- left side ================= */}
      </div>
    </div>
  );
}
