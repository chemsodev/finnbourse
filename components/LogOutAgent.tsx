"use client";

import { signOut } from "next-auth/react";
import { useEffect } from "react";

const LogOutAgent = () => {
  useEffect(() => {
    signOut({ redirect: true, callbackUrl: "/" });
  }, []);

  return null;
};

export default LogOutAgent;
