"use client"
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
export default function SideBar() {

const arr = [
  {
    name: "Home",
    icon: <IoHome />,
    href: "/home",
  },
  {
    name: "Explore",
    icon: <IoSearch />,
    href: "/explore",
  },
  {
    name: "For You",
    icon: <IoSparkles />,
    href: "/for-you",
  },
  {
    name: "Favorites",
    icon: <IoHeart />,
    href: "/favorites",
  },
  {
    name: "Categories",
    icon: <IoPricetag />,
    href: "/categories",
  },
  {
    name: "Authors",
    icon: <IoPeople />,
    href: "/authors",
  },
  {
    name: "Collections",
    icon: <IoBookmark />,
    href: "/collections",
  },


];
const arr2= [
    {
    name: "Profile",
    icon: <IoPerson />,
    href: "/profile",
  },
  {
    name: "Settings",
    icon: <IoSettings />,
    href: "/settings",
  },
]
  const [sideBarOpen,setSideBarOpen] =useState (false)
  return (
    <div className="flex pl-4 flex-col flex-1 h-full bg-blue-800">
      <div className="flex flex-2 items-center flex-col gap-1">
        <div className="flex w-full justify-between">
        QAWL
        <button className="flex items-center justify-center rounded-[50%] w-6 bg-purple-800 " onClick={()=>{

        setSideBarOpen(!sideBarOpen)
        }}><IoIosArrowBack/></button></div>
        <div className="flex items-center gap-3 w-full m-0">
          <div className="h-px flex-1 bg-gray-50" />
        </div>
      </div>
      <div className="flex flex-5 flex-col ga items-center">
    

       {
     arr.map((arr)=>{
       return (<ButtonSideBar key= {arr.href}name={arr.name} icons={arr.icon} href={arr.href} SideBarIsOpen = {sideBarOpen}/>)
     })
               }
      </div>
      <div className="flex items-center gap-3 w-full m-0">
        <div className="h-px flex-1 bg-gray-50" />
      </div>{" "}
      <div className=" flex flex-1 flex-col items-center">
        <div>Profile</div>
        <div>Settings</div>
        <div>Sign out</div>
      </div>
    </div>
  );
}
