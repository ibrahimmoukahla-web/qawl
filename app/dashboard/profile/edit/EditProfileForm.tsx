"use client";

import Link from "next/link";
import { useState } from "react";
import { updateProfile } from "./actions";

import { IoArrowBack, IoCameraOutline } from "react-icons/io5";
import { RxPerson } from "react-icons/rx";
import { LuUserRound } from "react-icons/lu";
import {
  MdOutlineContactPage,
  MdOutlineEmail,
} from "react-icons/md";
import { FaRegCalendarAlt } from "react-icons/fa";

type UserData = {
  name: string;
  username: string | null;
  email: string;
  bio: string | null;
  image: string | null;
  coverImage: string | null;
  role: string;
  createdAt: string;
};

type Props = {
  user: UserData;
};

export default function EditProfileForm({ user }: Props) {
  const [name, setName] = useState(user.name || "");
  const [username, setUsername] = useState(user.username || "");
  const [bio, setBio] = useState(user.bio || "");

  const [profilePreview, setProfilePreview] = useState(
    user.image || "/profile.jpg"
  );

  const [coverPreview, setCoverPreview] = useState(
    user.coverImage || "/cover.jpg"
  );

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isPending, setIsPending] = useState(false);

  // ================= PROFILE IMAGE =================

  const handleProfileChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");
    setMessage("");

    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Profile image must be smaller than 5MB.");
      return;
    }

    setProfilePreview(URL.createObjectURL(file));
  };

  // ================= COVER IMAGE =================

  const handleCoverChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setError("");
    setMessage("");

    if (!file.type.startsWith("image/")) {
      setError("Only image files are allowed.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Cover image must be smaller than 5MB.");
      return;
    }

    setCoverPreview(URL.createObjectURL(file));
  };

  // ================= SUBMIT =================

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    setError("");
    setMessage("");
    setIsPending(true);

    try {
      const formData = new FormData(event.currentTarget);

      const result = await updateProfile(formData);

      if (!result.success) {
        setError(result.message);
        return;
      }

      setMessage(result.message);

      // العودة إلى البروفايل بعد الحفظ
      setTimeout(() => {
        window.location.href = "/profile";
      }, 700);
    } catch (error) {
      console.error(error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong."
      );
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto px-4 py-5 text-[#F4F4F8]">

      {/* ================= HEADER ================= */}

      <div className="flex items-center gap-3 mb-5">
        <Link
          href="/profile"
          className="
            w-10 h-10
            flex items-center justify-center
            rounded-lg
            bg-[#111634]
            border border-[#242b5c]
            hover:bg-[#181E42]
            transition
          "
        >
          <IoArrowBack size={20} />
        </Link>

        <div>
          <h1 className="text-2xl font-bold">
            Edit Profile
          </h1>

          <p className="text-sm text-[#686D8F]">
            Update your profile information
          </p>
        </div>
      </div>

      {/* ================= FORM ================= */}

      <form
        onSubmit={handleSubmit}
        className="max-w-5xl mx-auto flex flex-col gap-4"
      >

        {/* ================= COVER + PROFILE ================= */}

        <div className="bg-[#111634] border border-[#242b5c] rounded-xl overflow-hidden">

          {/* COVER */}

          <div className="relative h-56">

            <img
              src={coverPreview}
              alt="Cover"
              className="w-full h-full object-cover"
            />

            <div className="absolute inset-0 bg-black/30" />

            <label
              className="
                absolute
                right-4
                bottom-4
                flex items-center gap-2
                px-4 py-2
                rounded-lg
                bg-black/60
                hover:bg-black/80
                cursor-pointer
                transition
              "
            >
              <IoCameraOutline size={19} />

              Change cover

              <input
                type="file"
                name="coverImage"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleCoverChange}
                className="hidden"
              />
            </label>
          </div>

          {/* PROFILE */}

          <div className="px-5 pb-5">

            <div className="relative -mt-14 w-28 h-28">

              <div
                className="
                  w-full
                  h-full
                  rounded-full
                  overflow-hidden
                  ring-4
                  ring-[#111634]
                "
              >
                <img
                  src={profilePreview}
                  alt="Profile"
                  className="w-full h-full object-cover"
                />
              </div>

              <label
                className="
                  absolute
                  right-0
                  bottom-0
                  w-9 h-9
                  flex items-center justify-center
                  rounded-full
                  bg-purple-500
                  hover:bg-purple-600
                  cursor-pointer
                  border-2
                  border-[#111634]
                "
              >
                <IoCameraOutline size={18} />

                <input
                  type="file"
                  name="profileImage"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleProfileChange}
                  className="hidden"
                />
              </label>
            </div>
          </div>
        </div>

        {/* ================= INFORMATION ================= */}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">

          {/* ================= LEFT ================= */}

          <div className="bg-[#111634] border border-[#242b5c] rounded-xl p-5">

            <h2 className="text-lg font-bold mb-5">
              Personal Information
            </h2>

            <div className="flex flex-col gap-5">

              {/* FULL NAME */}

              <div>
                <label className="block text-sm text-[#A8AEC7] mb-2">
                  Full name
                </label>

                <div className="relative">

                  <RxPerson
                    size={19}
                    className="
                      absolute
                      left-3
                      top-1/2
                      -translate-y-1/2
                      text-[#C084FC]
                    "
                  />

                  <input
                    name="name"
                    value={name}
                    onChange={(e) =>
                      setName(e.target.value)
                    }
                    required
                    className="
                      w-full
                      h-11
                      pl-10 pr-3
                      rounded-lg
                      bg-[#0D1230]
                      border border-[#242b5c]
                      text-[#F4F4F8]
                      outline-none
                      focus:border-[#C084FC]
                      transition
                    "
                  />
                </div>
              </div>

              {/* USERNAME */}

              <div>
                <label className="block text-sm text-[#A8AEC7] mb-2">
                  Username
                </label>

                <div className="relative">

                  <LuUserRound
                    size={19}
                    className="
                      absolute
                      left-3
                      top-1/2
                      -translate-y-1/2
                      text-[#C084FC]
                    "
                  />

                  <input
                    name="username"
                    value={username}
                    onChange={(e) =>
                      setUsername(e.target.value)
                    }
                    required
                    className="
                      w-full
                      h-11
                      pl-10 pr-3
                      rounded-lg
                      bg-[#0D1230]
                      border border-[#242b5c]
                      text-[#F4F4F8]
                      outline-none
                      focus:border-[#C084FC]
                      transition
                    "
                  />
                </div>
              </div>

              {/* EMAIL */}

              <div>
                <label className="block text-sm text-[#A8AEC7] mb-2">
                  Email
                </label>

                <div className="relative">

                  <MdOutlineEmail
                    size={20}
                    className="
                      absolute
                      left-3
                      top-1/2
                      -translate-y-1/2
                      text-[#686D8F]
                    "
                  />

                  <input
                    type="email"
                    value={user.email}
                    disabled
                    className="
                      w-full
                      h-11
                      pl-10 pr-3
                      rounded-lg
                      bg-[#090D24]
                      border border-[#242b5c]
                      text-[#686D8F]
                      cursor-not-allowed
                    "
                  />
                </div>

                <p className="text-xs text-[#686D8F] mt-2">
                  Email cannot be changed here.
                </p>
              </div>

              {/* BIO */}

              <div>
                <label className="block text-sm text-[#A8AEC7] mb-2">
                  Bio
                </label>

                <div className="relative">

                  <MdOutlineContactPage
                    size={20}
                    className="
                      absolute
                      left-3
                      top-3
                      text-[#C084FC]
                    "
                  />

                  <textarea
                    name="bio"
                    value={bio}
                    onChange={(e) =>
                      setBio(e.target.value)
                    }
                    maxLength={180}
                    rows={5}
                    className="
                      w-full
                      pl-10
                      pr-3
                      py-3
                      rounded-lg
                      bg-[#0D1230]
                      border border-[#242b5c]
                      text-[#F4F4F8]
                      outline-none
                      resize-none
                      focus:border-[#C084FC]
                      transition
                    "
                    placeholder="Tell people about yourself..."
                  />
                </div>

                <p className="text-xs text-[#686D8F] mt-2">
                  {bio.length}/180
                </p>
              </div>

            </div>
          </div>

          {/* ================= RIGHT ================= */}

          <div className="flex flex-col gap-4">

            {/* ACCOUNT */}

            <div className="bg-[#111634] border border-[#242b5c] rounded-xl p-5">

              <h2 className="text-lg font-bold mb-4">
                Account
              </h2>

              <div className="flex flex-col gap-4">

                <div className="flex justify-between">
                  <span className="text-[#686D8F]">
                    Role
                  </span>

                  <span className="font-semibold capitalize">
                    {user.role}
                  </span>
                </div>

                <div className="flex justify-between gap-4">
                  <span className="text-[#686D8F]">
                    Member Since
                  </span>

                  <span className="font-semibold">
                    {new Date(
                      user.createdAt
                    ).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "short",
                    })}
                  </span>
                </div>

              </div>
            </div>

            {/* PASSWORD */}

            <div className="bg-[#111634] border border-[#242b5c] rounded-xl p-5">

              <h2 className="text-lg font-bold">
                Password
              </h2>

              <p className="text-sm text-[#686D8F] mt-2 mb-4">
                Change your account password.
              </p>

              <Link
                href="changePassword"
                className="
                  w-full
                  flex items-center justify-center
                  px-4 py-3
                  rounded-lg
                  bg-[#181E42]
                  border border-[#242b5c]
                  hover:bg-[#222955]
                  transition
                  text-sm
                  font-semibold
                "
              >
                Change Password
              </Link>

            </div>
          </div>
        </div>

        {/* ================= ERROR ================= */}

        {error && (
          <div
            className="
              px-4 py-3
              rounded-lg
              bg-red-500/10
              border border-red-500/20
              text-red-400
              text-sm
            "
          >
            {error}
          </div>
        )}

        {/* ================= SUCCESS ================= */}

        {message && (
          <div
            className="
              px-4 py-3
              rounded-lg
              bg-green-500/10
              border border-green-500/20
              text-green-400
              text-sm
            "
          >
            {message}
          </div>
        )}

        {/* ================= BUTTONS ================= */}

        <div className="flex justify-end gap-3">

          <Link
            href="/dashboard/profile"
            className="
              px-5 py-2.5
              rounded-lg
              border border-[#242b5c]
              text-[#A8AEC7]
              hover:bg-[#111634]
              transition
            "
          >
            Cancel
          </Link>

          <button
            type="submit"
            disabled={isPending}
            className="
              px-5 py-2.5
              rounded-lg
              bg-purple-500
              hover:bg-purple-600
              disabled:opacity-50
              disabled:cursor-not-allowed
              font-semibold
              transition
            "
          >
            {isPending
              ? "Saving..."
              : "Save Changes"}
          </button>

        </div>
      </form>
    </div>
  );
}