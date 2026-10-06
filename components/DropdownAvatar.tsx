"use client";

import Link from "next/link";

import {
Avatar,
AvatarFallback,
AvatarImage,
} from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";

import {
DropdownMenu,
DropdownMenuContent,
DropdownMenuGroup,
DropdownMenuItem,
DropdownMenuSeparator,
DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { authClient } from "@/lib/auth-client";

export function AvatarDropdown() {
const {
data: session,
isPending,
} = authClient.useSession();

// ==========================================================
// LOADING
// ==========================================================

if (isPending) {
return ( <Button
     variant="ghost"
     size="icon"
     className="rounded-full"
     disabled
   > <Avatar> <AvatarFallback>
... </AvatarFallback> </Avatar> </Button>
);
}

// ==========================================================
// USER
// ==========================================================

const user = session?.user;

// ==========================================================
// NOT AUTHENTICATED
// ==========================================================

if (!user) {
return ( <Link href="/login"> <Button
       variant="ghost"
       className="rounded-full"
     >
Login </Button> </Link>
);
}

// ==========================================================
// INITIALS
// ==========================================================

const initials =
user.name
?.trim()
.split(/\s+/)
.map((part) =>
part.charAt(0),
)
.slice(0, 2)
.join("")
.toUpperCase() || "U";

// ==========================================================
// LOGOUT
// ==========================================================

async function handleLogout() {
await authClient.signOut();

window.location.href =
  "/login";

}

// ==========================================================
// RENDER
// ==========================================================

return ( <DropdownMenu>
{/* ======================================================
TRIGGER
====================================================== */}

  <DropdownMenuTrigger asChild>
    <Button
      variant="ghost"
      size="icon"
      className="rounded-full"
    >
      <Avatar className="h-9 w-9">
        <AvatarImage
          src={user.image ?? undefined}
          alt={user.name}
        />

        <AvatarFallback className="bg-[#8B5CF6]/10 text-[#C084FC]">
          {initials}
        </AvatarFallback>
      </Avatar>
    </Button>
  </DropdownMenuTrigger>

  {/* ======================================================
      MENU
  ====================================================== */}

  <DropdownMenuContent
    align="end"
    className="w-64 border-[#282e5c] bg-[#111634] text-white"
  >
    {/* USER INFORMATION */}

    <div className="px-3 py-3">
      <div className="flex items-center gap-3">
        <Avatar className="h-10 w-10 shrink-0">
          <AvatarImage
            src={
              user.image ??
              undefined
            }
            alt={user.name}
          />

          <AvatarFallback className="bg-[#8B5CF6]/10 text-[#C084FC]">
            {initials}
          </AvatarFallback>
        </Avatar>

        <div className="min-w-0">
          <p className="truncate text-sm font-semibold text-gray-100">
            {user.name}
          </p>

          <p className="truncate text-xs text-gray-500">
            {user.email}
          </p>
        </div>
      </div>
    </div>

    <DropdownMenuSeparator className="bg-[#282e5c]" />

    {/* NAVIGATION */}

    <DropdownMenuGroup>
      <DropdownMenuItem
        asChild
      >
        <Link
          href="/dashboard/profile"
          className="cursor-pointer"
        >
          Profile
        </Link>
      </DropdownMenuItem>

      <DropdownMenuItem
        asChild
      >
        <Link
          href="/dashboard/settings"
          className="cursor-pointer"
        >
          Settings
        </Link>
      </DropdownMenuItem>
    </DropdownMenuGroup>

    <DropdownMenuSeparator className="bg-[#282e5c]" />

    {/* LOGOUT */}

    <DropdownMenuItem
      variant="destructive"
      onClick={handleLogout}
      className="cursor-pointer"
    >
      Log out
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>

);
}
