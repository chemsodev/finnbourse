/**
 * useLoginMenuFetch.ts
 * Hook to fetch menu data after successful login and clear on logout
 */

"use client";

import { useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRestToken } from "@/hooks/useRestToken";
import { fetchAndStoreMenu } from "@/app/actions/menuService";
import { clearMenuData, hasStoredMenuData } from "@/lib/utils/menuUtils";

export function useLoginMenuFetch() {
  const { data: session, status } = useSession();
  const { restToken, isAuthenticated } = useRestToken();
  const hasInitialized = useRef(false);
  const lastSessionId = useRef<string | null>(null);

  useEffect(() => {
    const currentSessionId = session?.user?.email || null;

    console.log("useLoginMenuFetch effect triggered:");
    console.log("- Status:", status);
    console.log("- Session available:", !!session);
    console.log("- isAuthenticated:", isAuthenticated);
    console.log("- REST token available:", !!restToken);
    console.log("- hasInitialized:", hasInitialized.current);

    const fetchMenuOnLogin = async () => {
      // Only fetch if we have a valid session and REST token
      if (
        status === "authenticated" &&
        session &&
        isAuthenticated &&
        restToken &&
        !hasInitialized.current
      ) {
        // Check if this is a new session (different user or fresh login)
        const isNewSession = lastSessionId.current !== currentSessionId;
        const hasStoredMenu = hasStoredMenuData();

        console.log("All conditions met for menu fetch:");
        console.log("- isNewSession:", isNewSession);
        console.log("- hasStoredMenu:", hasStoredMenu);

        if (!hasStoredMenu || isNewSession) {
          console.log("Login detected: Fetching menu for the session");
          console.log("REST Token available:", !!restToken);
          console.log(
            "REST Token (first 10 chars):",
            restToken?.substring(0, 10)
          );
          try {
            await fetchAndStoreMenu(restToken);
            console.log("Menu successfully fetched and stored on login");
            lastSessionId.current = currentSessionId;
          } catch (error) {
            console.error("Failed to fetch menu on login:", error);
            // Don't store empty/fallback menu - let the components handle the error state
          }
        } else {
          console.log(
            "Menu already stored for current session, skipping fetch"
          );
        }

        hasInitialized.current = true;
      } else {
        console.log("Conditions not met for menu fetch:");
        console.log("- Status authenticated:", status === "authenticated");
        console.log("- Session exists:", !!session);
        console.log("- Is authenticated:", isAuthenticated);
        console.log("- REST token exists:", !!restToken);
        console.log("- Not initialized:", !hasInitialized.current);
      }
    };

    // Clear menu on logout
    if (status === "unauthenticated") {
      console.log("Logout detected: Clearing stored menu");
      clearMenuData();
      hasInitialized.current = false;
      lastSessionId.current = null;
    }

    fetchMenuOnLogin();
  }, [status, session, isAuthenticated, restToken]);
}
