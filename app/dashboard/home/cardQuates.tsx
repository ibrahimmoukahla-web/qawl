import React from "react";
import Avatar from "@mui/material/Avatar";
import { RiDoubleQuotesR } from "react-icons/ri";
import { RiDoubleQuotesL } from "react-icons/ri";
import { IoBookmarkOutline } from "react-icons/io5";
import { PiShareNetworkBold } from "react-icons/pi";
import { FaRegHeart } from "react-icons/fa6";

export default function CardQuates() {
  return (
    <div className="bg-[#11173d] border border-[#242b5c] rounded-2xl ">
      {/* ----------------- card ------------------------ */}
      <div className=" w-full rounded-2xl overflow-hidden ">
        {/* ------------- avatar--------- */}
        <div className=" flex gap-3 px-2 py-0.5">
          <Avatar
            alt="Remy Sharp"
            src="/profile.jpg"
            sx={{ width: "40px", height: "40px" }}
          />
          <div className="flex flex-col ">
            <span className="font-bold m-0 p-0  text-[16px] ">
              Name of Author{" "}
            </span>
            <p className="text-[13px] text-[#686D8F] ">type of Auther</p>
          </div>
        </div>
        {/* ------------- avatar--------- */}
        {/* ========================== body ================ */}
        <div className="  flex flex-col gap-1 px-6 mb-2">
          <div className=" flex justify-between items-center">
            <div className="quote italic flex gap-2 max-w-120">
              <RiDoubleQuotesL />
              <span>
                You have power over your mind -- not outside events. Realize
                this , and you will find strength.
                <div className="text-[12px] font-semibold">shard by pp</div>
              </span>
              <RiDoubleQuotesR />
            </div>
            <div className="text-[13px] text-[#686D8F]">2 day ago</div>
          </div>
          <div className="bg-purple-500/15 border border-purple-400/30 backdrop-blur-md rounded-xl w-fit py-1 px-2">
            motivation
          </div>
        </div>
        {/* ========================== body ================ */}
        <div className="flex ">
          <div className="flex-1  h-[0.3px] bg-[#4e5479] rounded-4xl mx-2 my"></div>
        </div>
        <div className="flex justify-between p-2">
          {/* ------------ item -------------- */}
          <div className="flex gap-2">
            <div className="flex gap-1 items-center">
              <FaRegHeart />
              <span className="text-[13px]">342</span>
            </div>
            <div className="flex flex-col">
              <div className="flex-1  w-[0.3px] bg-[#686D8F] rounded-4xl py-2"></div>
            </div>

            {/* ------------ item -------------- */}
            <div className="flex gap-1 items-center">
              <IoBookmarkOutline />
              <span className="text-[13px]">save</span>
            </div>
          </div>
          <PiShareNetworkBold />
        </div>
      </div>
      {/* ----------------- card ------------------------ */}
    </div>
  );
}
