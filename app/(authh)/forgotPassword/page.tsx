"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";

import {
  ArrowLeft,
  CheckCircle2,
  Loader2,
  Mail,
} from "lucide-react";

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
import { useTranslations } from "next-intl";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");

    const normalizedEmail = email.trim().toLowerCase();

    if (!normalizedEmail) {
      setError("Please enter your email address.");
      return;
    }

    setLoading(true);

    try {
      const { error } =
        await authClient.emailOtp.requestPasswordReset({
          email: normalizedEmail,
        });

      if (error) {
        console.error(
          "Password reset request error:",
          error
        );

        setError(
          "Unable to send the reset code. Please try again."
        );

        return;
      }

      setSent(true);
    } catch (error) {
      console.error(
        "Password reset request failed:",
        error
      );

      setError(
        "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }
   const t = useTranslations("ForgotPassword");

  return (
    <main className="min-h-screen bg-[#070B1C] px-4 py-10 flex items-center justify-center">
      <div className="w-full max-w-md">

        <Card className="border-[#282E5C] bg-[#111634] text-white shadow-2xl">

          <CardHeader className="space-y-5 text-center">

            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-purple-400/20 bg-purple-500/10">
              <Mail className="h-7 w-7 text-purple-400" />
            </div>

            <div>
              <CardTitle className="text-2xl font-bold">
                Forgot your password?
              </CardTitle>

              <CardDescription className="mt-3 leading-7 text-gray-400">
                Enter your email address and we&apos;ll send
                you a 6-digit verification code.
              </CardDescription>
            </div>

          </CardHeader>

          <CardContent>

            {sent ? (
              <div className="space-y-6">

                <div className="rounded-2xl border border-green-400/20 bg-green-500/10 p-5 text-center">

                  <CheckCircle2 className="mx-auto mb-3 h-10 w-10 text-green-400" />

                  <h2 className="text-lg font-semibold">
                    Code sent
                  </h2>

                  <p className="mt-2 text-sm leading-7 text-gray-400">
                    Check your email for your 6-digit
                    password reset code.
                  </p>

                </div>

                <Link
                  href={`/reset-password?email=${encodeURIComponent(email.trim().toLowerCase())}`}
                  className="flex h-11 items-center justify-center rounded-md bg-purple-600 px-4 text-sm font-medium text-white transition hover:bg-purple-500"
                >
                  Enter verification code
                </Link>

                <button
                  type="button"
                  onClick={() => {
                    setSent(false);
                    setError("");
                  }}
                  className="w-full text-sm text-gray-400 transition hover:text-purple-400"
                >
                  Use a different email
                </button>

                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2 text-sm text-gray-400 transition hover:text-purple-400"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to login
                </Link>

              </div>
            ) : (
              <form
                onSubmit={handleSubmit}
                className="space-y-5"
              >

                <div className="space-y-2">

                  <Label htmlFor="email">
                    Email address
                  </Label>

                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(event) =>
                      setEmail(event.target.value)
                    }
                    autoComplete="email"
                    disabled={loading}
                    className="h-11 border-[#282E5C] bg-[#080D2E] text-white placeholder:text-gray-500 focus-visible:ring-purple-500"
                  />

                </div>

                {error && (
                  <div className="rounded-xl border border-red-400/20 bg-red-500/10 px-4 py-3 text-sm text-red-300">
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
                      Sending code...
                    </>
                  ) : (
                    "Send reset code"
                  )}
                </Button>

                <Link
                  href="/login"
                  className="flex items-center justify-center gap-2 text-sm text-gray-400 transition hover:text-purple-400"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back to login
                </Link>

              </form>
            )}

          </CardContent>
        </Card>

      </div>
    </main>
  );
}