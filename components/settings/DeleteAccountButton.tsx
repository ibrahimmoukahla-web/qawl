"use client";

import {
  AlertTriangle,
  CheckCircle2,
  Loader2,
  Trash2,
  X,
} from "lucide-react";

import { useState } from "react";

import { authClient } from "@/lib/auth-client";

export default function DeleteAccountButton() {
  const [open, setOpen] =
    useState(false);

  const [confirmation, setConfirmation] =
    useState("");

  const [isProcessing, setIsProcessing] =
    useState(false);

  const [verificationSent, setVerificationSent] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleDelete() {
    if (confirmation !== "DELETE") {
      setError(
        'Please type "DELETE" to confirm.',
      );

      return;
    }

    setIsProcessing(true);
    setError("");

    try {
      const {
        error: deleteError,
      } = await authClient.deleteUser({
        callbackURL: "/login",
      });

      if (deleteError) {
        console.error(
          "Delete account error:",
          deleteError,
        );

        setError(
          deleteError.message ??
            "We could not process your account deletion request.",
        );

        setIsProcessing(false);

        return;
      }

      /*
       * When the session is not fresh, Better Auth
       * uses sendDeleteAccountVerification and sends
       * the verification email.
       *
       * When the session is fresh, the account may be
       * deleted immediately.
       */

      setVerificationSent(true);
      setIsProcessing(false);

    } catch (error) {
      console.error(
        "Delete account request failed:",
        error,
      );

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong. Please try again.",
      );

      setIsProcessing(false);
    }
  }

  function handleClose() {
    if (isProcessing) {
      return;
    }

    setOpen(false);
    setConfirmation("");
    setError("");
    setVerificationSent(false);
  }

  return (
    <>
      {/* ======================================================
          DELETE BUTTON
      ====================================================== */}

      <button
        type="button"
        onClick={() => {
          setOpen(true);
          setError("");
          setVerificationSent(false);
        }}
        className="
          shrink-0
          rounded-xl
          border
          border-red-500/20
          bg-red-500/5
          px-4
          py-2.5
          text-xs
          font-medium
          text-red-400
          transition
          hover:border-red-500/30
          hover:bg-red-500/10
        "
      >
        Delete account
      </button>

      {/* ======================================================
          MODAL
      ====================================================== */}

      {open && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/70
            px-4
            backdrop-blur-sm
          "
        >
          <div
            className="
              w-full
              max-w-md
              overflow-hidden
              rounded-3xl
              border
              border-red-500/20
              bg-[#111634]
              shadow-2xl
            "
            role="dialog"
            aria-modal="true"
            aria-labelledby="delete-account-title"
          >
            {/* ==================================================
                HEADER
            ================================================== */}

            <div
              className="
                flex
                items-start
                justify-between
                gap-4
                border-b
                border-[#282e5c]/50
                px-5
                py-5
              "
            >
              <div className="flex items-center gap-3">

                <div
                  className="
                    flex
                    h-10
                    w-10
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    bg-red-500/10
                    text-red-400
                  "
                >
                  <AlertTriangle size={19} />
                </div>

                <div>
                  <h2
                    id="delete-account-title"
                    className="
                      text-sm
                      font-semibold
                      text-gray-100
                    "
                  >
                    Delete your account?
                  </h2>

                  <p className="mt-1 text-xs text-gray-600">
                    This action is permanent.
                  </p>
                </div>

              </div>

              <button
                type="button"
                onClick={handleClose}
                disabled={isProcessing}
                aria-label="Close"
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-lg
                  text-gray-600
                  transition
                  hover:bg-[#080D26]
                  hover:text-white
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                <X size={16} />
              </button>
            </div>

            {/* ==================================================
                BODY
            ================================================== */}

            <div className="px-5 py-5">

              {verificationSent ? (
                <div className="py-4 text-center">

                  <div
                    className="
                      mx-auto
                      mb-5
                      flex
                      h-14
                      w-14
                      items-center
                      justify-center
                      rounded-2xl
                      bg-green-500/10
                      text-green-400
                    "
                  >
                    <CheckCircle2 size={28} />
                  </div>

                  <h3 className="text-lg font-semibold text-gray-100">
                    Check your email
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-gray-400">
                    We sent you a confirmation email.
                    Open it and confirm the account deletion.
                  </p>

                  <p className="mt-3 text-xs leading-5 text-gray-600">
                    Your account will be permanently deleted
                    after you confirm the request.
                  </p>

                </div>
              ) : (
                <>
                  <p className="text-sm leading-6 text-gray-400">
                    Deleting your account will permanently
                    remove your Qawl account and its associated
                    authentication data.
                  </p>

                  <div
                    className="
                      mt-5
                      rounded-2xl
                      border
                      border-red-500/10
                      bg-red-500/5
                      p-4
                    "
                  >
                    <p className="text-xs leading-5 text-red-300">
                      This cannot be undone.
                    </p>
                  </div>

                  <div className="mt-6">

                    <label
                      htmlFor="delete-confirmation"
                      className="
                        text-xs
                        font-medium
                        text-gray-400
                      "
                    >
                      Type{" "}
                      <span className="font-semibold text-red-300">
                        DELETE
                      </span>{" "}
                      to continue.
                    </label>

                    <input
                      id="delete-confirmation"
                      type="text"
                      value={confirmation}
                      onChange={(event) => {
                        setConfirmation(
                          event.target.value,
                        );

                        if (error) {
                          setError("");
                        }
                      }}
                      disabled={isProcessing}
                      autoComplete="off"
                      spellCheck={false}
                      placeholder="DELETE"
                      className="
                        mt-2
                        h-11
                        w-full
                        rounded-xl
                        border
                        border-[#282e5c]
                        bg-[#080D26]
                        px-4
                        text-sm
                        text-gray-200
                        outline-none
                        transition
                        placeholder:text-gray-700
                        focus:border-red-500/40
                        focus:ring-2
                        focus:ring-red-500/10
                        disabled:cursor-not-allowed
                        disabled:opacity-50
                      "
                    />

                  </div>

                  {error && (
                    <p className="mt-3 text-xs leading-5 text-red-400">
                      {error}
                    </p>
                  )}
                </>
              )}

            </div>

            {/* ==================================================
                FOOTER
            ================================================== */}

            <div
              className="
                flex
                flex-col-reverse
                gap-2
                border-t
                border-[#282e5c]/50
                px-5
                py-4
                sm:flex-row
                sm:justify-end
              "
            >
              {verificationSent ? (
                <button
                  type="button"
                  onClick={handleClose}
                  className="
                    rounded-xl
                    border
                    border-[#282e5c]
                    bg-[#080D26]
                    px-4
                    py-2.5
                    text-xs
                    font-medium
                    text-gray-500
                    transition
                    hover:bg-[#070B1C]
                    hover:text-white
                  "
                >
                  Close
                </button>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={handleClose}
                    disabled={isProcessing}
                    className="
                      rounded-xl
                      border
                      border-[#282e5c]
                      bg-[#080D26]
                      px-4
                      py-2.5
                      text-xs
                      font-medium
                      text-gray-500
                      transition
                      hover:bg-[#070B1C]
                      hover:text-white
                      disabled:cursor-not-allowed
                      disabled:opacity-50
                    "
                  >
                    Cancel
                  </button>

                  <button
                    type="button"
                    onClick={handleDelete}
                    disabled={
                      isProcessing ||
                      confirmation !== "DELETE"
                    }
                    className="
                      flex
                      items-center
                      justify-center
                      gap-2
                      rounded-xl
                      bg-red-500
                      px-4
                      py-2.5
                      text-xs
                      font-semibold
                      text-white
                      transition
                      hover:bg-red-600
                      disabled:cursor-not-allowed
                      disabled:opacity-40
                    "
                  >
                    {isProcessing ? (
                      <>
                        <Loader2
                          size={14}
                          className="animate-spin"
                        />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Trash2 size={14} />
                        Delete account
                      </>
                    )}
                  </button>
                </>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
}