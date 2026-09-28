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

  /*
   * أثناء التحقق من الجلسة
   */
  if (isPending) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-[#070B1C]">
        <div className="flex flex-col items-center gap-3">
          <div className="h-9 w-9 animate-spin rounded-full border-2 border-purple-500/20 border-t-purple-500" />

          <p className="text-sm text-gray-500">
            Loading...
          </p>
        </div>
      </div>
    );
  }

  /*
   * إذا لم توجد Session
   */
  if (!session) {
    return null;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden bg-[#070B1C]">
      {/* ================= SIDEBAR ================= */}

      <div className="shrink-0">
        <SideBar />
      </div>

      {/* ================= MAIN ================= */}

      <main className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden bg-[#070B1C]">
        {children}
      </main>
    </div>
  );
}