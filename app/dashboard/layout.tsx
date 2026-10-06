"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";

import { authClient } from "@/lib/auth-client";
import SideBar from "../../utils/SideBar";

export default function DashboardLayout({
children,
}: {
children: React.ReactNode;
}) {
const router = useRouter();

const { data: session, isPending } =
authClient.useSession();

useEffect(() => {
if (!isPending && !session) {
router.replace("/login");
}
}, [isPending, session, router]);

if (isPending) {
return ( <div className="flex h-screen w-full items-center justify-center bg-[#070B1C]"> <div className="flex flex-col items-center gap-3"> <div
         className="
           h-9
           w-9
           animate-spin
           rounded-full
           border-2
           border-purple-500/20
           border-t-purple-500
         "
       />


      <p className="text-sm text-gray-500">
        Loading...
      </p>
    </div>
  </div>
);


}

if (!session) {
return null;
}

return ( <div className="h-screen w-full overflow-hidden bg-[#070B1C]">
{/* =================================================
DESKTOP
================================================= */}


  <div className="flex h-full w-full">
    <aside
      className="
        hidden
        h-full
        shrink-0
        lg:block
      "
    >
      <SideBar />
    </aside>

    {/* =================================================
        MAIN
    ================================================= */}

    <main
      className="
        min-w-0
        flex-1
        h-full
        overflow-x-hidden
        overflow-y-auto
        bg-[#070B1C]

        pb-16
        lg:pb-0
      "
    >
      {children}
    </main>
  </div>

  {/* =================================================
      MOBILE BOTTOM NAV
  ================================================= */}

  <aside
    className="
      fixed
      inset-x-0
      bottom-0
      z-50
      lg:hidden
    "
  >
    <div
      className="
        mx-auto
        w-full
        border-t
        border-[#242b5c]
        bg-[#070B1C]/95
        backdrop-blur-xl
        shadow-[0_-5px_25px_rgba(0,0,0,0.3)]
      "
    >
      <div className="h-16 w-full">
        <SideBar />
      </div>
    </div>
  </aside>
</div>


);
}
