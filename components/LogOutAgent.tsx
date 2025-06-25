"use client";

import { signOut } from "next-auth/react";
import { useEffect } from "react";

const LogOutAgent = () => {
  useEffect(() => {
    if(typeof window !== "undefined") {
      sessionStorage.removeItem("finnbourse-menu");
      //console.log("Session storage cleared on logout");
    }
    signOut({ redirect: true, callbackUrl: "/" });
  }, []);

  return null;
};

export default LogOutAgent;
