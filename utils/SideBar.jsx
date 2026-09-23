"use client";
import ButtonSideBar from "@/components/ButtonSideBar";

import React, { useState } from "react";
import { IoHome } from "react-icons/io5";
import { IoIosArrowBack } from "react-icons/io";
import { IoSearch } from "react-icons/io5";
import {
  IoSparkles,
  IoHeart,
  IoPricetag,
  IoPeople,
  IoBookmark,
  IoPerson,
  IoSettings,
} from "react-icons/io5";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import { BsStars } from "react-icons/bs";
import { TiHomeOutline } from "react-icons/ti";
import { TbQuoteOpen } from "react-icons/tb";
import { FaRegHeart } from "react-icons/fa6";
import { TbTag } from "react-icons/tb";
import { BsPerson } from "react-icons/bs";
import { IoSettingsOutline } from "react-icons/io5";

export default function SideBar() {
    const router = useRouter();
  
  const handleSignOut = async () => {
      await authClient.signOut({
        fetchOptions: {
          onSuccess: () => {
           return router.push("/login");
          },
        },
      });
    };
  const arr = [
    {
      name: "Home",
      icon: <TiHomeOutline />,
      href: "/home",
    },
    {
      name: "Quotes",
      icon: <TbQuoteOpen />,
      href: "/quotes",
    },
  
    {
      name: "Favorites",
      icon: <FaRegHeart />,
      href: "/favorites",
    },
    {
      name: "Tags",
      icon: <TbTag />,
      href: "/tags",
    },

  {
      name: "Profile",
      icon: <BsPerson />,
      href: "/profile",
    },
      {
      name: "Settings",
      icon: <IoSettingsOutline />,
      href: "/settings",
    },
  ];

  const [sideBarOpen, setSideBarOpen] = useState(false);

  
  return (
    <div className="flex pl-4 pt-4 pb-4 flex-col gap-10  h-full bg-[#080D20]">
      <div className="flex  items-center flex-col gap-1">
        <div className="flex w-full justify-between ">
          <div className="flex w-fit gap-1 justify-between text-[#A74DF6] font-bold items-center">
          <BsStars size={30}/>
          {sideBarOpen && "QAWL"}
          </div>
          <button
            className="flex items-center justify-center rounded-[50%] w-6 bg-purple-800 "
            onClick={() => {
              setSideBarOpen(!sideBarOpen);
            }}
          >
            <IoIosArrowBack />
          </button>
        </div>
      </div>
      <div className="flex  flex-col ga items-center">
       

        {arr.map((arr) => {
          return (
            <ButtonSideBar
              key={arr.href}
              name={arr.name}
              icons={arr.icon}
              href={arr.href}
              SideBarIsOpen={sideBarOpen}
            />
          );
        })}
      </div>
      <div className="flex flex-1 flex-col items-center">
      {/* <div className="flex items-center gap-3 w-full m-0">
        <div className="h-px flex-1 bg-gray-50" />
      </div>{" "} */}
 

        <button onClick={handleSignOut} type="button" className="hover:bg-purple-500  justify-center border-purple-800 border-2 rounded-3xl  cursor-pointer w-full flex items-center gap-2">
          Sign out
        </button>
      </div>
    </div>
  );
}
