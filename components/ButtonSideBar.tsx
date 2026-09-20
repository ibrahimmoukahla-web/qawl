"use client"
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { ReactElement, useState  } from 'react'
import { IoHome } from "react-icons/io5";

export default function ButtonSideBar({name, icons ,SideBarIsOpen,href}:{name:string, icons:ReactElement ,href:string ,SideBarIsOpen:boolean}) {
 const pathname= usePathname()
    const isActive = pathname == `/dashboard${href}`; 
  console.log(isActive)
  console.log(pathname)

  //  /dashboard/home
  console.log( `/dashboard${href}`)
  

//   const isActive = true; 


  return (

        
        <Link href={`dashboard${href}`} className={`flex items-center ${SideBarIsOpen && "justify-center"} gap-2 p-1 px-3 cursor-pointer ${isActive && "bg-purple-800"} rounded-l-3xl  w-full text-xl hover:bg-purple-500 my-2`}>
          {icons}
         <span className={`${SideBarIsOpen && "hidden"}`}> {name}</span>
        </Link>
   
  )
}
