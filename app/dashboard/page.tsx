"use client";

import { authClient } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import SideBar from "../../utils/SideBar"
import { useEffect } from "react";
export default function Page() {
  const router = useRouter();

  const { data: session, isPending } = authClient.useSession();

  useEffect(() => {
    if (!isPending && !session) {
      router.replace("/login");
    }
  }, [isPending, session, router]);
  const handleSignOut = async () => {
    await authClient.signOut({
      fetchOptions: {
        onSuccess: () => {
         return router.push("/login");
        },
      },
    });
  };

  return (
  <div className="flex h-[100vh] bg-amber-900 w-full">
      
      <div className="flex flex-3 bg-amber-500">Dashboard</div>
    </div>
  );
}