"use client";

import Input from "@/components/input";
import { authClient } from "@/lib/auth-client";
import { signUpSchema } from "@/lib/zod";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";
const signIn = async () => {
  const data = await authClient.signIn.social({
    provider: "google",
  });
};
export default function Signup() {
  const router = useRouter()
   const [errors, setErrors] = useState<{
     
      firstName?:string;
      lastName?:string;

     email?: string;
     password?: string;
     confirmPassword?: string;
     general?: string;
   }>({});
 
  const  hendelSubmit = async (formData:FormData)=>{
    setErrors({});
    const result = signUpSchema.safeParse({
      firstName:formData.get("firstName") ,
      lastName:formData.get("lastName") ,

      email: formData.get("email")   ,
      password: formData.get("password") ,
      confirmPassword: formData.get("confirmPassword") ,
    });
if (!result.success) {
  const fieldErrors = result.error.flatten().fieldErrors; 
setErrors({
  firstName: fieldErrors.firstName?.[0],
  lastName: fieldErrors.lastName?.[0],
  email: fieldErrors.email?.[0],
  password: fieldErrors.password?.[0],
  confirmPassword: fieldErrors.confirmPassword?.[0],
});
  return;  
}
 const {firstName,lastName,email, password} = result.data; 

const { error } = await authClient.signUp.email({
    name: `${firstName} ${lastName}`, // required, The name of the user.
    email: email, // required, The email address of the user.
    password: password, // required, The password of the user. It should be at least 8 characters long and max 128 by default.
  callbackURL: "/dashboard",
  });
    if (error) {
      setErrors({
        general: error.message ?? "Unable to create account.",
      });
      
      return;
      
    }
    router.push("/dashboard")
  }
  
  return (
            <div
            className=" absolute inset-0
    rounded-2xl
    bg-gray-200/35
    [transform:rotateY(180deg)]
    [backface-visibility:hidden]
        flex
    flex-col
    items-center
    p-3
    
    "
          >
            <h1 className="text-2xl font-semibold">Create Account</h1>
            <form action={hendelSubmit} className="py-3 flex flex-col gap-3">
              <div className="flex gap-5">
                <Input
                  name="firstName"
                  label="First Name"
                  type="text"
                  className="flex flex-1"
                />
                {errors.firstName && <p className="text-sm bg-red-600">
                {errors.firstName}</p>}
                <Input
                  name="lastName"
                  label="Last Name"
                  type="text"
                  className="flex flex-1"
                />
                 {errors.lastName && <p className="text-sm bg-red-600">
                {errors.lastName}</p>}
              </div>
              <Input
                name="email"
                label="Email"
                type="email"
                className="flex flex-1"
              />
              {errors.email && <p className="text-sm bg-red-600">
                {errors.email}</p>}
              <Input
                name="password"
                type="password"
                label="Password"
                className="flex flex-1"
              />
              {errors.password && <p className="text-sm bg-red-600">
                {errors.password}</p>}
              <Input
                name="confirmPassword"
                label="Confirm Password"
                type="password"
                className="flex flex-1"
              />
              {errors.confirmPassword && <p className="text-sm bg-red-600">
                {errors.confirmPassword}</p>}
                {errors.general && <p className="text-sm bg-red-600">
                {errors.general}</p>}
              <button className="my-3px cursor-pointer bg-purple-800 rounded-3xl p-0.5 text-2xl hover:bg-purple-500 my-2">
                SignUp
              </button>
            </form>
            <div className="flex items-center gap-3 w-full m-0">
              <div className="h-px flex-1 bg-gray-50" />

              <span className="text-sm text-gray-100">OR</span>

              <div className="h-px flex-1 bg-gray-50" />
            </div>
            <form
              action={signIn}
              className="flex flex-col items-center  w-full p-2 mx-3 relative "
            >
              <button
                type="submit"
                className="rounded-xl p-1 w-full hover:bg-gray-200 cursor-pointer bg-gray-50 text-black my-2 flex items-center justify-center  gap-2"
              >
                <FcGoogle size={20} /> Sign in with Google
              </button>
            </form>
          </div>
  )
}
