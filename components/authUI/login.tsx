"use client";

import PersonIcon from "@mui/icons-material/Person";
import  { ChangeEvent, useState } from "react";
import RadioButtons from "@/components/RadioGroup";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import LockIcon from "@mui/icons-material/Lock";
import Link from "next/link";
import GoogleIcon from "@mui/icons-material/Google";
import { FcGoogle } from "react-icons/fc";
import { logInSchema } from "@/lib/zod";
import { email } from "better-auth";
import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export default function Login() {
    const router = useRouter()
  const [errors, setErrors] = useState<{
     
     email?: string;
     password?: string;
   
     general?: string;
   }>({});
 
      const [showPassword, setShowPassword] = useState<boolean>(false);
  const [password, setPassword] = useState("");
  
  const hendleSubmit= async(formData:FormData)=>{

    setErrors({});
   const result = logInSchema.safeParse({
    email:formData.get("email"),
    password:formData.get("password")
   })
   if (!result.success){
    const fieldErrors = result.error.flatten().fieldErrors
    setErrors({
 email:fieldErrors.email?.[0],
     password:fieldErrors.password?.[0] 
    })
    return
   }
   const {email, password} = result.data
   const {  error } = await authClient.signIn.email({
    email, // required, The email address of the user.
    password, // required, The password of the user. It should be at least 8 characters long and max 128 by default.
    rememberMe: true, // If false, the user will be signed out when the browser is closed. (optional) (default: true)
    callbackURL: "/dashboard", // An optional URL to redirect to after the user signs in. (optional)
});
  if (error) {
      setErrors({
        general: error.message ?? "Unable to create account.",
      });
      
      return;
    }
    router.push("/dashboard")
    return
}
    
  return (

           <div
            className="
  absolute inset-0
    rounded-2xl
    bg-gray-200/35
    [backface-visibility:hidden]
 p-3
    flex
    flex-col
    items-center
  "
          >
            <h1 className="text-2xl font-semibold">Welcome back!</h1>
            <form
              action={hendleSubmit}
              className="flex flex-col  w-full p-2 mx-3 my-5 relative"
            >
              <div className="flex flex-col gap-2 w-full my-3 ">
                <label htmlFor="email">email</label>
                <div className="rounded-3xl border-purple-700 border-2 w-90 flex items-center  justify-between overflow-hidden">
                  <input
                    type="email"
                    name="email"
                    placeholder="email"
                    id="email"
                    className="flex-1 bg-transparent py-0.5 px-2 border-none text-xl outline-none"
                  />
                  <PersonIcon />
                </div>
              </div>
                  {errors.email && <p className="text-sm text-red-600">
                {errors.email}</p>}
              <div className="flex flex-col gap-2 w-full my-3">
                <label htmlFor="password">password</label>
                <div className="rounded-3xl border-purple-700 border-2 w-[360px] flex items-center  justify-between overflow-hidden">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    id="password"
                    placeholder="password"
                    className="flex-1 bg-transparent py-0.5 px-2 border-none text-xl outline-none"
                    value={password}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      setPassword(e.target.value);
                    }}
                  />


                  {password !== "" ? (
                    showPassword ? (
                      <VisibilityOffIcon
                        className="cursor-pointer"
                        onClick={() => {
                          setShowPassword(!showPassword);
                        }}
                      />
                    ) : (
                      <RemoveRedEyeIcon
                        className="cursor-pointer"
                        onClick={() => {
                          setShowPassword(!showPassword);
                        }}
                      />
                    )
                  ) : (
                    <LockIcon />
                  )}
                </div>
              </div>
               {errors.password && <p className="text-sm text-red-600">
                {errors.password}</p>}
              {errors.general && <p className="text-sm text-red-600">
                {errors.general}</p>}
              <h6 className="flex self-end hover:text-purple-900">
                <Link href="/forgotPassword">Forgot password ?</Link>
              </h6>
              <button className="my-3px cursor-pointer bg-purple-800 rounded-3xl p-0.5 text-2xl hover:bg-purple-500 my-2">
                login
              </button>
            </form>
            <div className="flex items-center gap-3 w-full m-0">
              <div className="h-px flex-1 bg-gray-50" />

              <span className="text-sm text-gray-100">OR</span>

              <div className="h-px flex-1 bg-gray-50" />
            </div>
            <form
              action=" "
              className="flex flex-col items-center  w-full p-2 mx-3 relative "
            >
              <button
                type="button"
                className="rounded-xl p-1 w-full cursor-pointer hover:bg-gray-200 bg-gray-50 text-black my-2 flex items-center justify-center  gap-2"
              >
                <FcGoogle size={20} /> Sign in with Google
              </button>
            </form>
          </div>
          
  )
}
