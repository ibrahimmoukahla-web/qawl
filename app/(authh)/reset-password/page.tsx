"use client";

import {
  FormEvent,
  useState,
} from "react";

import Link from "next/link";

import {
  ArrowLeft,
  Eye,
  EyeOff,
  Loader2,
  LockKeyhole,
  CheckCircle2,
} from "lucide-react";

import {
  useRouter,
  useSearchParams,
} from "next/navigation";

import { authClient } from "@/lib/auth-client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const email =
    searchParams.get("email") ?? "";

  const [otp, setOtp] = useState("");

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [showPassword, setShowPassword] =
    useState(false);

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);

  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    const code = otp.trim();

    if (!email) {
      setError(
        "Email address is missing."
      );
      return;
    }

    if (!/^\d{6}$/.test(code)) {
      setError(
        "Please enter the 6-digit verification code."
      );
      return;
    }

    if (password.length < 8) {
      setError(
        "Password must contain at least 8 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError(
        "Passwords do not match."
      );
      return;
    }

    setLoading(true);

    try {
      const { error } =
        await authClient.emailOtp.resetPassword({
          email,
          otp: code,
          password,
        });

      if (error) {
        console.error(
          "Reset password error:",
          error
        );

        setError(
          "The verification code is invalid or expired."
        );

        return;
      }

      setSuccess(true);

      setTimeout(() => {
        router.push("/login");
      }, 2000);

    } catch (error) {
      console.error(
        "Reset password failed:",
        error
      );

      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <main className="min-h-screen bg-[#070B1C] flex items-center justify-center px-4">

        <Card className="w-full max-w-md border-[#282E5C] bg-[#111634] text-white shadow-2xl">

          <CardContent className="p-8 text-center">

            <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-green-500/10">

              <CheckCircle2 className="h-7 w-7 text-green-400" />

            </div>

            <h1 className="text-2xl font-bold">
              Password changed
            </h1>

            <p className="mt-3 text-gray-400">
              Your password has been successfully changed.
            </p>

            <p className="mt-2 text-sm text-gray-500">
              Redirecting to login...
            </p>

          </CardContent>

        </Card>

      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#070B1C] flex items-center justify-center px-4 py-10">

      <div className="w-full max-w-md">

        <Card className="border-[#282E5C] bg-[#111634] text-white shadow-2xl">

          <CardHeader className="space-y-5 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-purple-400/20 bg-purple-500/10">

              <LockKeyhole className="h-7 w-7 text-purple-400" />

            </div>

            <div>

              <CardTitle className="text-2xl font-bold">
                Reset your password
              </CardTitle>

              <CardDescription className="mt-3 leading-7 text-gray-400">
                Enter the 6-digit code sent to your email,
                then create a new password.
              </CardDescription>

              {email && (
                <p className="mt-3 text-sm text-purple-300">
                  {email}
                </p>
              )}

            </div>

          </CardHeader>

          <CardContent>

            <form
              onSubmit={handleSubmit}
              className="space-y-5"
            >

              {/* OTP */}

              <div className="space-y-2">

                <Label htmlFor="otp">
                  Verification code
                </Label>

                <Input
                  id="otp"
                  type="text"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  placeholder="123456"
                  value={otp}
                  onChange={(event) => {
                    const value =
                      event.target.value.replace(
                        /\D/g,
                        ""
                      );

                    setOtp(value.slice(0, 6));
                  }}
                  disabled={loading}
                  className="h-12 border-[#282E5C] bg-[#080D2E] text-center text-xl font-semibold tracking-[0.5em] text-white placeholder:text-gray-600 focus-visible:ring-purple-500"
                />

                <p className="text-xs text-gray-500">
                  Enter the 6-digit code from your email.
                </p>

              </div>

              {/* Password */}

              <div className="space-y-2">

                <Label htmlFor="password">
                  New password
                </Label>

                <div className="relative">

                  <Input
                    id="password"
                    type={
                      showPassword
                        ? "text"
                        : "password"
                    }
                    value={password}
                    onChange={(event) =>
                      setPassword(
                        event.target.value
                      )
                    }
                    autoComplete="new-password"
                    disabled={loading}
                    className="h-11 border-[#282E5C] bg-[#080D2E] pr-4 pl-11 text-white"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowPassword(
                        (value) => !value
                      )
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>

                </div>

              </div>

              {/* Confirm password */}

              <div className="space-y-2">

                <Label htmlFor="confirmPassword">
                  Confirm password
                </Label>

                <div className="relative">

                  <Input
                    id="confirmPassword"
                    type={
                      showConfirmPassword
                        ? "text"
                        : "password"
                    }
                    value={confirmPassword}
                    onChange={(event) =>
                      setConfirmPassword(
                        event.target.value
                      )
                    }
                    autoComplete="new-password"
                    disabled={loading}
                    className="h-11 border-[#282E5C] bg-[#080D2E] pr-4 pl-11 text-white"
                  />

                  <button
                    type="button"
                    onClick={() =>
                      setShowConfirmPassword(
                        (value) => !value
                      )
                    }
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>

                </div>

              </div>

              {error && (
                <div className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm leading-6 text-red-300">
                  {error}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="h-11 w-full bg-purple-600 hover:bg-purple-500"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Updating password...
                  </>
                ) : (
                  "Reset password"
                )}
              </Button>

              <Link
                href="/forgot-password"
                className="flex items-center justify-center gap-2 text-sm text-gray-400 transition hover:text-purple-400"
              >
                <ArrowLeft className="h-4 w-4" />
                Request a new code
              </Link>

            </form>

          </CardContent>
        </Card>

      </div>

    </main>
  );
}