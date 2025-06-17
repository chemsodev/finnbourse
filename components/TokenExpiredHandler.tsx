"use client";

import { useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export function TokenExpiredHandler() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session && (session as any).error === "TokenExpired") {
      console.log("Session token expired, signing out...");

      // Sign out and redirect to login with expired token message
      signOut({
        callbackUrl: "/login?tokenExpired=true",
        redirect: true,
      });
    }
  }, [session, router]);

  return null; // This component renders nothing
}

export default TokenExpiredHandler;
