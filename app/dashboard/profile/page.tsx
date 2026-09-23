import Image from "next/image";
import { headers } from "next/headers";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { FiCalendar } from "react-icons/fi";
import { IoLocationOutline } from "react-icons/io5";
import { MdOutlineMailOutline } from "react-icons/md";
import { TbQuote } from "react-icons/tb";
import { FaRegHeart } from "react-icons/fa6";
import { VscTag } from "react-icons/vsc";
import { LuUsersRound } from "react-icons/lu";
import { IoPersonCircleOutline } from "react-icons/io5";
import { RxPerson } from "react-icons/rx";
import { MdOutlineEmail } from "react-icons/md";
import { FaPersonCircleCheck } from "react-icons/fa6";
import { MdOutlineContactPage } from "react-icons/md";
import { FaRegCalendarAlt } from "react-icons/fa";
import Link from "next/link";

export default async function Page() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return <div>Not authenticated</div>;
  }

  const user = await prisma.user.findUnique({
    where: {
      id: session.user.id,
    },
  });
  const [ Quotes, Favorites, userTags, Followers ]= await Promise.all([
    prisma.quote.count({
      where: {
        createdById: session.user.id,
      },
    }),
    prisma.favorite.count({
      where: {
        userId: session.user.id,
      },
    }),
    prisma.quoteTag.findMany({
      where: {
        quote: {
          createdById: session.user.id,
        },
      },
      select: {
        tagId: true,
      },
    }),
    prisma.follow.count({
      where: {
        followingId: session.user.id,
      },
    }),
  ]);
  const tagsCount = new Set(userTags.map((item) => item.tagId)).size;

  return (
    <div className=" w-full h-full flex flex-col">
      {/* ====== profile ================ */}
      <div className="w-full h-1/3  relative">
        {/*================ cover============= */}

        <div className=" w-full h-4/7 relative">
          <Image
            src={user?.coverImage || "/profile.jpg"}
            alt="profile"
            fill
            className=" object-cover "
          />
        </div>
        {/*================ cover============= */}
        <div className="absolute inset-0 bg-black/30" />

        <div className="flex absolute -bottom-3 left-10 items-center gap-4">
          {/* =================== profile img ============ */}
          <div className="w-35 h-35 relative rounded-full overflow-hidden ring-4 ring-purple-500 shadow-[0_0_10px_#a855f7,0_0_25px_#a855f7,0_0_45px_#a855f7] ">
            <Image
              src={user?.image || "/profile.jpg"}
              alt="profile"
              width={160}
              height={160}
              className="w-full h-full object-cover"
            />
          </div>
          {/* =================== profile img ============ */}
          {/*=============== text ========= */}
          <div className="text-[#F4F4F8]">
            <h2 className="font-extrabold text-2xl">{user?.name}</h2>
            <div className=" flex flex-col gap-1 text-sm text-[#A8AEC7] ">
              <p className="flex items-center gap-2 text-sm text-[#A8AEC7] ">
                <MdOutlineMailOutline /> {user?.email}
              </p>
              <p>{user?.bio}</p>
              <div className="flex gap-2 items-center">
                <FiCalendar /> joined {user?.createdAt.toDateString()} <IoLocationOutline /> Algeria
              </div>
            </div>
          </div>
          {/*=============== text ========= */}
        </div>
        {/* all the avatar */}

        <div></div>
      </div>
      {/* ====== profile ================ */}

      {/* =============================== part 2 ================================= */}

      <div className="flex-1 flex gap-3 mx-2 mt-5 min-h-0">
        <div className="flex-2 rounded-xl flex flex-col gap-3 px-3">
          {/* ============ top ============= */}
          <div className="bg-[#111634] border border-[#242b5c] rounded-xl  p-1 flex justify-evenly">
            {/* ====================== part =============== */}
            <div className="flex  items-center gap-1">
              <TbQuote size={25} className="text-[#C084FC]" />
              <div className="flex flex-col">
                <div>{Quotes}</div>
                <div>Quotes</div>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex-1 bg-[#686D8F] rounded-2xl  w-[1px]"></div>
            </div>
            {/*  ================= part========================== */}
            {/* ====================== part =============== */}
            <div className="flex  items-center gap-1">
              <FaRegHeart size={25} className="text-[#C084FC]" />
              <div className="flex flex-col">
                <div>{Favorites}</div>
                <div>Favorites</div>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex-1 bg-[#686D8F] rounded-2xl  w-[1px]"></div>
            </div>
            {/*  ================= part========================== */}
            {/* ====================== part =============== */}
            <div className="flex items-center gap-1">
              <VscTag size={25} className="text-[#C084FC]" />
              <div className="flex flex-col">
                <div>{tagsCount}</div>
                <div>Tags</div>
              </div>
            </div>
            <div className="flex flex-col">
              <div className="flex-1 bg-[#686D8F] rounded-2xl  w-[1px]"></div>
            </div>
            {/*  ================= part========================== */}
            {/* ====================== part =============== */}
            <div className="flex  items-center gap-1">
              <LuUsersRound size={25} className="text-[#C084FC]" />
              <div className="flex flex-col">
                <div>{Followers}</div>
                <div>Followers</div>
              </div>
            </div>

            {/*  ================= part========================== */}
          </div>
          {/* ============ top ============= */}
          {/* ============ body ============= */}
<div className="bg-[#111634] border border-[#242b5c] rounded-xl flex-4 p-3">
  <h1 className="text-xl font-bold flex gap-1 items-center">
    <IoPersonCircleOutline size={50} />
    Personal Information
  </h1>

  <div className="flex flex-col gap-4 mt-4">

    <div className="grid grid-cols-[180px_1fr] items-center">
      <span className="text-[#686D8F] flex items-center gap-3">
        <RxPerson size={20} className="text-[#C084FC]" />
        Full name
      </span>

      <span className="text-[#F4F4F8] font-semibold">
        {user?.name}
      </span>
    </div>

    <div className="grid grid-cols-[180px_1fr] items-center">
      <span className="text-[#686D8F] flex items-center gap-3">
        <MdOutlineEmail size={20} className="text-[#C084FC]" />
        Email
      </span>

      <span className="text-[#F4F4F8] font-semibold">
        {user?.email}
      </span>
    </div>

    <div className="grid grid-cols-[180px_1fr] items-center">
      <span className="text-[#686D8F] flex items-center gap-3">
        <LuUsersRound size={20} className="text-[#C084FC]" />
        Username
      </span>

      <span className="text-[#F4F4F8] font-semibold">
        {user?.username}
      </span>
    </div>

    <div className="grid grid-cols-[180px_1fr] items-center">
      <span className="text-[#686D8F] flex items-center gap-3">
        <FaPersonCircleCheck size={20} className="text-[#C084FC]" />
        Role
      </span>

      <span className="text-[#F4F4F8] font-semibold">
        {user?.role}
      </span>
    </div>

    <div className="grid grid-cols-[180px_1fr] items-center">
      <span className="text-[#686D8F] flex items-center gap-3">
        <MdOutlineContactPage size={20} className="text-[#C084FC]" />
        Bio
      </span>

      <span className="text-[#F4F4F8] font-semibold">
        {user?.bio}
      </span>
    </div>

    <div className="grid grid-cols-[180px_1fr] items-center">
      <span className="text-[#686D8F] flex items-center gap-3">
        <FaRegCalendarAlt size={20} className="text-[#C084FC]" />
        Member Since
      </span>

      <span className="text-[#F4F4F8] font-semibold">
        {user?.createdAt.toLocaleDateString("en-US", {
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </span>
    </div>

  </div>
</div>
          
          {/* ============ body ============= */}
          {/* ============ bottom ============= */}

          
          {/* ============ bottom ============= */}
        </div>
        {/* =============== right side ================= */}
        <div className=" flflex-1 min-w-0 overflow-y-auto">
          {/* ================= RIGHT SIDE ================= */}
<div className="flex-1 rounded-xl flex flex-col gap-3">

  {/* ================= Profile Actions ================= */}
  <div className="bg-[#111634] border border-[#242b5c] rounded-xl p-4">
    
    <h2 className="text-[#F4F4F8] text-lg font-bold mb-4">
      Profile Actions
    </h2>

    <div className="flex flex-col gap-2">

      <Link href="profile/edit"
        className="
          w-full
          flex items-center gap-3
          px-4 py-3
          rounded-lg
          text-[#F4F4F8]
          bg-[#181E42]
          hover:bg-[#222955]
          transition
        "
      >
        <IoPersonCircleOutline
          size={22}
          className="text-[#C084FC]"
        />
        <span>Edit Profile</span>
      </Link>

     
      
      <Link href="/favorites"   className="
          w-full
          flex items-center gap-3
          px-4 py-3
          rounded-lg
          text-[#F4F4F8]
          bg-[#181E42]
          hover:bg-[#222955]
          transition
        ">
        <FaRegHeart
          size={20}
          className="text-[#C084FC]"
        />
        <span>My Favorites</span></Link>
     


        <Link href="/quotes"   className="
          w-full
          flex items-center gap-3
          px-4 py-3
          rounded-lg
          text-[#F4F4F8]
          bg-[#181E42]
          hover:bg-[#222955]
          transition
        ">
        <TbQuote
          size={22}
          className="text-[#C084FC]"
        />
        <span>My Quotes</span></Link>
   

    </div>
  </div>

  {/* ================= Account Information ================= */}
  <div className="bg-[#111634] border border-[#242b5c] rounded-xl p-4">

    <h2 className="text-[#F4F4F8] text-lg font-bold mb-4">
      Account Information
    </h2>

    <div className="flex flex-col gap-4">

      {/* Status */}
      <div className="flex items-center justify-between">
        <span className="text-[#686D8F]">
          Account Status
        </span>

        <span className="px-2.5 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-semibold">
          Active
        </span>
      </div>

      {/* Role */}
      <div className="flex items-center justify-between">
        <span className="text-[#686D8F]">
          Role
        </span>

        <span className="text-[#F4F4F8] font-semibold capitalize">
          {user?.role}
        </span>
      </div>

      {/* Email */}
      <div className="flex items-center justify-between gap-4">
        <span className="text-[#686D8F]">
          Email Verified
        </span>

        <span className="text-green-400 text-sm font-semibold">
         <span
  className={`text-sm font-semibold ${
    user?.emailVerified
      ? "text-green-400"
      : "text-red-400"
  }`}
>
  {user?.emailVerified ? "Verified" : "Not verified"}
</span>
        </span>
      </div>

    </div>
  </div>

  {/* ================= Quick Stats ================= */}
  <div className="bg-[#111634] border border-[#242b5c] rounded-xl p-4">

    <h2 className="text-[#F4F4F8] text-lg font-bold mb-4">
      Quick Stats
    </h2>

    <div className="grid grid-cols-2 gap-3">

      <div className="bg-[#181E42] rounded-lg p-3">
        <p className="text-[#686D8F] text-xs">
          Quotes
        </p>

        <p className="text-[#F4F4F8] text-xl font-bold mt-1">
          {Quotes}
        </p>
      </div>

      <div className="bg-[#181E42] rounded-lg p-3">
        <p className="text-[#686D8F] text-xs">
          Favorites
        </p>

        <p className="text-[#F4F4F8] text-xl font-bold mt-1">
          {Favorites}
        </p>
      </div>

      <div className="bg-[#181E42] rounded-lg p-3">
        <p className="text-[#686D8F] text-xs">
          Tags
        </p>

        <p className="text-[#F4F4F8] text-xl font-bold mt-1">
          {tagsCount}
        </p>
      </div>

      <div className="bg-[#181E42] rounded-lg p-3">
        <p className="text-[#686D8F] text-xs">
          Followers
        </p>

        <p className="text-[#F4F4F8] text-xl font-bold mt-1">
          {Followers}
        </p>
      </div>

    </div>
  </div>

</div>
{/* ================= RIGHT SIDE ================= */}
        </div>
      </div>
      {/* =============================== part 2 ================================= */}
    </div>
  );
}
