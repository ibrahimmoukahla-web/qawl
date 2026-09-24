"use client";

import Link from "next/link";
import { useState } from "react";
import { changeOrSetPassword } from "./actions";

type Props = {
  hasPassword: boolean;
};

export default function ChangePasswordForm({
  hasPassword,
}: Props) {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    setError("");
    setSuccess("");

    if (hasPassword && !currentPassword) {
      setError("Enter your current password.");
      return;
    }

    if (newPassword.length < 8) {
      setError(
        "New password must be at least 8 characters."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const result = await changeOrSetPassword(
        currentPassword,
        newPassword
      );

      if (!result.success) {
        setError(result.message);
        return;
      }

      setSuccess(result.message);

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 text-[#F4F4F8]">

      <div className="mb-6">
        <h1 className="text-2xl font-bold">
          {hasPassword
            ? "Change Password"
            : "Create Password"}
        </h1>

        <p className="text-sm text-[#686D8F] mt-1">
          {hasPassword
            ? "Enter your current password and choose a new one."
            : "Your Google account does not have a password yet. Create one for email/password login."}
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="
          bg-[#111634]
          border border-[#242b5c]
          rounded-xl
          p-5
          flex
          flex-col
          gap-4
        "
      >

        {/* CURRENT PASSWORD */}
        {hasPassword && (
          <div>
            <label className="block text-sm text-[#A8AEC7] mb-2">
              Current password
            </label>

            <input
              type="password"
              value={currentPassword}
              onChange={(e) =>
                setCurrentPassword(e.target.value)
              }
              className="
                w-full
                h-11
                px-3
                rounded-lg
                bg-[#0D1230]
                border border-[#242b5c]
                outline-none
                focus:border-[#C084FC]
              "
            />
          </div>
        )}

        {/* NEW PASSWORD */}
        <div>
          <label className="block text-sm text-[#A8AEC7] mb-2">
            {hasPassword
              ? "New password"
              : "Password"}
          </label>

          <input
            type="password"
            value={newPassword}
            onChange={(e) =>
              setNewPassword(e.target.value)
            }
            minLength={8}
            required
            className="
              w-full
              h-11
              px-3
              rounded-lg
              bg-[#0D1230]
              border border-[#242b5c]
              outline-none
              focus:border-[#C084FC]
            "
          />
        </div>

        {/* CONFIRM */}
        <div>
          <label className="block text-sm text-[#A8AEC7] mb-2">
            Confirm password
          </label>

          <input
            type="password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
            minLength={8}
            required
            className="
              w-full
              h-11
              px-3
              rounded-lg
              bg-[#0D1230]
              border border-[#242b5c]
              outline-none
              focus:border-[#C084FC]
            "
          />
        </div>

        {error && (
          <div className="
            bg-red-500/10
            border border-red-500/20
            text-red-400
            rounded-lg
            p-3
            text-sm
          ">
            {error}
          </div>
        )}

        {success && (
          <div className="
            bg-green-500/10
            border border-green-500/20
            text-green-400
            rounded-lg
            p-3
            text-sm
          ">
            {success}
          </div>
        )}

        <div className="flex justify-end gap-3">

          <Link
            href="/dashboard/profile/edit"
            className="
              px-5 py-2.5
              rounded-lg
              border border-[#242b5c]
              text-[#A8AEC7]
              hover:bg-[#181E42]
            "
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={loading}
            className="
              px-5 py-2.5
              rounded-lg
              bg-purple-500
              hover:bg-purple-600
              disabled:opacity-50
              font-semibold
            "
          >
            {loading
              ? "Saving..."
              : hasPassword
              ? "Change Password"
              : "Create Password"}
          </button>

        </div>
      </form>
    </div>
  );
}