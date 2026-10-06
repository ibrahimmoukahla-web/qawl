"use client";

import { authClient } from "@/lib/auth-client";

import PersonIcon from "@mui/icons-material/Person";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import LockIcon from "@mui/icons-material/Lock";

import { useState, type ChangeEvent } from "react";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { useRouter } from "next/navigation";

import { logInSchema } from "@/lib/zod";

export default function Login() {
  const router = useRouter();

  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});

  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState("");

  const handleSubmit = async (formData: FormData) => {
    setErrors({});

    const result = logInSchema.safeParse({
      email: formData.get("email"),
      password: formData.get("password"),
    });

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;

      setErrors({
        email: fieldErrors.email?.[0],
        password: fieldErrors.password?.[0],
      });

      return;
    }

    const { email, password } = result.data;

    const { error } = await authClient.signIn.email({
      email,
      password,
      rememberMe: true,
      callbackURL: "/dashboard",
    });

    if (error) {
      setErrors({
        general: error.message ?? "Unable to sign in.",
      });

      return;
    }

    router.push("/dashboard");
  };

  const signInWithGoogle = async () => {
    const { error } = await authClient.signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    });

    if (error) {
      setErrors({
        general: error.message ?? "Unable to sign in with Google.",
      });
    }
  };

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
        action={handleSubmit}
        className="flex flex-col w-full p-2 mx-3 my-5 relative"
      >
        {/* Email */}
        <div className="flex flex-col gap-2 w-full my-3">
          <label htmlFor="email">email</label>

          <div className="rounded-3xl border-purple-700 border-2 w-full flex items-center justify-between overflow-hidden">
            <input
              type="email"
              name="email"
              placeholder="email"
              id="email"
              className="flex-1 bg-transparent py-0.5 px-2 text-xl outline-none"
            />

            <PersonIcon className="mr-2" />
          </div>

          {errors.email && (
            <p className="text-sm text-red-600">{errors.email}</p>
          )}
        </div>

        {/* Password */}
        <div className="flex flex-col gap-2 w-full my-3">
          <label htmlFor="password">password</label>

          <div className="rounded-3xl border-purple-700 border-2 w-full flex items-center justify-between overflow-hidden">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              id="password"
              placeholder="password"
              className="flex-1 bg-transparent py-0.5 px-2 text-xl outline-none"
              value={password}
              onChange={(e: ChangeEvent<HTMLInputElement>) => {
                setPassword(e.target.value);
              }}
            />

            {password !== "" ? (
              showPassword ? (
                <VisibilityOffIcon
                  className="cursor-pointer mr-2"
                  onClick={() => setShowPassword((prev) => !prev)}
                />
              ) : (
                <RemoveRedEyeIcon
                  className="cursor-pointer mr-2"
                  onClick={() => setShowPassword((prev) => !prev)}
                />
              )
            ) : (
              <LockIcon className="mr-2" />
            )}
          </div>

          {errors.password && (
            <p className="text-sm text-red-600">{errors.password}</p>
          )}
        </div>

        {/* General error */}
        {errors.general && (
          <p className="text-sm text-red-600">{errors.general}</p>
        )}

        {/* Forgot password */}
        <h6 className="flex self-end hover:text-purple-900">
          <Link href="/forgotPassword">Forgot password?</Link>
        </h6>

        {/* Login */}
        <button
          type="submit"
          className="
            cursor-pointer
            bg-purple-800
            rounded-3xl
            p-1
            text-2xl
            hover:bg-purple-500
            my-2
          "
        >
          login
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center gap-3 w-full">
        <div className="h-px flex-1 bg-gray-50" />

        <span className="text-sm text-gray-100">OR</span>

        <div className="h-px flex-1 bg-gray-50" />
      </div>

      {/* Google */}
      <form
        action={signInWithGoogle}
        className="flex flex-col items-center w-full p-2 mx-3 relative"
      >
        <button
          type="submit"
          className="
            rounded-xl
            p-2
            w-full
            cursor-pointer
            hover:bg-gray-200
            bg-gray-50
            text-black
            my-2
            flex
            items-center
            justify-center
            gap-2
          "
        >
          <FcGoogle size={20} />
          Sign in with Google
        </button>
      </form>
    </div>
  );
}

