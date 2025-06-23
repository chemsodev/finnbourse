// useTokenExpiry.js
import { useEffect } from "react";
import { signOut } from "next-auth/react";

const useTokenExpiry = (tokenExpires: number | undefined) => {
  // Token expiry check disabled
  useEffect(() => {
    // Disabled token expiry check
    // if (tokenExpires) {
    //   const currentTime = Math.floor(Date.now() / 1000);
    //   const timeLeft = tokenExpires - currentTime;
    //
    //   if (timeLeft > 0) {
    //     const timer = setTimeout(() => {
    //       signOut({ redirect: false });
    //     }, timeLeft * 1000);
    //
    //     return () => clearTimeout(timer); // Cleanup on unmount or update
    //   } else {
    //     signOut({ redirect: false });
    //   }
    // }
  }, [tokenExpires]);
};

export default useTokenExpiry;
