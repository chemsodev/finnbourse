/**
 * useLoginMenuFetch.ts
 * Hook to fetch menu data after successful login and clear on logout
 */

"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRestToken } from "@/hooks/useRestToken";
import { fetchAndStoreMenu } from "@/app/actions/menuService";

export function useLoginMenuFetch() {
  const { data: session, status } = useSession();
  const { restToken, isAuthenticated } = useRestToken();
  const hasInitialized = useRef(false);

  useEffect(() => {
    const fetchMenuOnLogin = async () => {
      // Only fetch if we have a valid session and REST token
      if (
        status === "authenticated" &&
        session &&
        isAuthenticated &&
        restToken &&
        !hasInitialized.current
      ) {
        // Check if menu is already stored to avoid refetching
        const hasStoredMenu = sessionStorage.getItem("finnbourse-menu");

        if (!hasStoredMenu) {
          console.log("Login detected: Fetching menu for the session");
          try {
            await fetchAndStoreMenu();
            console.log("Menu successfully fetched and stored on login");
          } catch (error) {
            console.warn("Failed to fetch menu on login:", error);
          }
        } else {
          console.log("Menu already stored, skipping fetch on login");
        }

        hasInitialized.current = true;
      }
    };

    // Clear menu on logout
    if (status === "unauthenticated") {
      console.log("Logout detected: Clearing stored menu");
      sessionStorage.removeItem("finnbourse-menu");
      hasInitialized.current = false;
    }

    fetchMenuOnLogin();
  }, [status, session, isAuthenticated, restToken]);
}
