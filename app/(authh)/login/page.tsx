"use client";


import Login from "@/components/authUI/login";
import Signup from "@/components/authUI/signup";
import Radio from "@mui/material/Radio";
import { useState } from "react";
import { authClient } from "@/lib/auth-client"
import { useRouter } from "next/navigation";
export default function Page() {
  const [isLogin, setIsLogin] = useState(false);
      const router = useRouter()
  
    const { 
        data: session, 
        isPending, //loading state
        error, //error object
        refetch //refetch the session
    } = authClient.useSession() 
if (session){
   return router.push("/dashboard")

}
  return (
    <div
      className="absolute right-12 top-1/2 translate-y-1/8 
    flex
    flex-col
    items-center"
    >
      <div>
        <Radio
          checked={!isLogin}
          onChange={() => setIsLogin(false)}
          value="signup"
        />

        <Radio
          checked={isLogin}
          onChange={() => setIsLogin(true)}
          value="login"
        />
      </div>
      <div className="relative w-[400px] h-[480px] [perspective:1000px]">
        <div
          className={`
    rounded-2xl
    bg-gray-200/35
    relative
    w-full
    h-full
  
    transition-transform
    duration-700
    relative
[transform-style:preserve-3d]
    ${isLogin ? "[transform:rotateY(180deg)]" : "[transform:rotateY(0deg)]"}
    }
  `}
        >
          {/* {" "}llllog in  */}
            <Login/>
          {/* ============================= || sign up ||=============================== */}
            <Signup/>
        </div>
      </div>
    </div>
  );
}
