"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth-client";

export default function ChangePasswordPage() {
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

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setLoading(true);

    const { error } = await authClient.changePassword({
      currentPassword,
      newPassword,
      revokeOtherSessions: true,
    });

    setLoading(false);

    if (error) {
      setError(error.message || "Current password is incorrect.");
      return;
    }

    setSuccess("Password changed successfully.");

    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="max-w-lg mx-auto p-6">
      <h1 className="text-2xl font-bold text-white mb-2">
        Change Password
      </h1>

      <p className="text-[#686D8F] mb-6">
        Enter your current password and choose a new one.
      </p>

      <form
        onSubmit={handleSubmit}
        className="bg-[#111634] border border-[#242b5c] rounded-xl p-5 flex flex-col gap-4"
      >
        <div>
          <label className="block text-sm text-[#A8AEC7] mb-2">
            Current Password
          </label>

          <input
            type="password"
            value={currentPassword}
            onChange={(e) =>
              setCurrentPassword(e.target.value)
            }
            required
            className="w-full h-11 px-3 rounded-lg bg-[#0D1230] border border-[#242b5c] text-white outline-none focus:border-[#C084FC]"
          />
        </div>

        <div>
          <label className="block text-sm text-[#A8AEC7] mb-2">
            New Password
          </label>

          <input
            type="password"
            value={newPassword}
            onChange={(e) =>
              setNewPassword(e.target.value)
            }
            required
            minLength={8}
            className="w-full h-11 px-3 rounded-lg bg-[#0D1230] border border-[#242b5c] text-white outline-none focus:border-[#C084FC]"
          />
        </div>

        <div>
          <label className="block text-sm text-[#A8AEC7] mb-2">
            Confirm New Password
          </label>

          <input
            type="password"
            value={confirmPassword}
            onChange={(e) =>
              setConfirmPassword(e.target.value)
            }
            required
            minLength={8}
            className="w-full h-11 px-3 rounded-lg bg-[#0D1230] border border-[#242b5c] text-white outline-none focus:border-[#C084FC]"
          />
        </div>

        {error && (
          <div className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg p-3">
            {error}
          </div>
        )}

        {success && (
          <div className="text-sm text-green-400 bg-green-500/10 border border-green-500/20 rounded-lg p-3">
            {success}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="h-11 rounded-lg bg-purple-500 hover:bg-purple-600 disabled:opacity-50 text-white font-semibold transition"
        >
          {loading ? "Changing..." : "Change Password"}
        </button>
      </form>
    </div>
  );
}