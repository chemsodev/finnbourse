"use client";

import { signOut } from "next-auth/react";
import { useEffect } from "react";
import { useMenuContext } from "@/contexts/MenuContext";
import { clearAllSessionData } from "@/lib/utils/menuUtils";

const LogOutAgent = () => {
  const { clearMenu } = useMenuContext();

  useEffect(() => {
    // Clear menu context
    clearMenu();

    // Clear all session data using utility
    clearAllSessionData();

    signOut({ redirect: true, callbackUrl: "/" });
  }, [clearMenu]);

  return null;
};

export default LogOutAgent;
