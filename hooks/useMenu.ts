/**
 * useMenu.ts
 * Hook to access menu data stored during login
 */

"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useRestToken } from "@/hooks/useRestToken";
import { useTokenValidation } from "@/hooks/useTokenValidation";
import {
  MenuResponse,
  getStoredMenu,
  fetchAndStoreMenu,
} from "@/app/actions/menuService";

interface UseMenuReturn {
  menu: MenuResponse;
  isLoading: boolean;
  error: string | null;
  refreshMenu: () => Promise<void>;
}

export function useMenu(): UseMenuReturn {
  const [menu, setMenu] = useState<MenuResponse>({ elements: [] });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const { restToken } = useRestToken();
  const router = useRouter();

  // Use token validation hook - disable backend validation since endpoint doesn't exist yet
  const { isValid: isTokenValid } = useTokenValidation({
    redirectOnInvalid: true,
    enableBackendValidation: false, // Disable backend validation to prevent 404 errors
    checkInterval: 300000, // Check every 5 minutes (lenient)
    onTokenInvalid: () => {
      setError("Session expired. Redirecting to login...");
      setMenu({ elements: [] });
      setIsLoading(false);
    },
  });

  // Static complete menu for testing/development
  const getCompleteStaticMenu = (): MenuResponse => ({
    elements: [
      { id: "dashboard" },
      { id: "place-order" },
      {
        id: "orders-dropdown",
        children: [
          { id: "premiere-validation" },
          { id: "validation-finale" },
          { id: "validation-retour" },
          { id: "validation-tcc-premiere" },
          { id: "validation-tcc-finale" },
          { id: "validation-tcc-retour" },
          { id: "execution" },
          { id: "resultats" },
        ],
      },
      {
        id: "titles-emissions-dropdown",
        children: [{ id: "emetteurs" }, { id: "gestion-titres" }],
      },
      {
        id: "actors-management-dropdown",
        children: [
          { id: "iob" },
          { id: "tcc" },
          { id: "agence" },
          { id: "clients" },
        ],
      },
      { id: "charts-editions" },
    ],
  });

  // Function to handle token validation errors
  const handleTokenError = (errorMessage: string) => {
    console.error("Token validation failed:", errorMessage);

    // Clear stored menu and session data
    if (typeof window !== "undefined") {
      sessionStorage.removeItem("finnbourse-menu");
      localStorage.removeItem("restToken");
    }

    // Set error state
    setError("Session expired. Redirecting to login...");
    setMenu({ elements: [] });
    setIsLoading(false);

    // Redirect to login after a short delay
    setTimeout(() => {
      router.push("/login");
    }, 2000);
  };

  useEffect(() => {
    const loadMenu = async () => {
      if (status === "loading") {
        return; // Still loading session
      }

      // DEVELOPMENT MODE: Use complete static menu
      // Comment out this block when you want to use dynamic API-based menu again
      console.log("useMenu: Using complete static menu for testing");
      setMenu(getCompleteStaticMenu());
      setIsLoading(false);
      return;

      // PRODUCTION MODE: Dynamic menu from API (currently disabled for testing)
      // Uncomment this block when you want to use API-based menu again
      /*
      // If no session, redirect to login
      if (status === "unauthenticated" || !session) {
        console.log("useMenu: No session, redirecting to login");
        handleTokenError("No active session");
        return;
      }

      // If no REST token, redirect to login
      if (!restToken) {
        console.log("useMenu: No REST token, redirecting to login");
        handleTokenError("No valid REST token");
        return;
      }

      try {
        setIsLoading(true);
        setError(null);

        // First try to get stored menu
        const storedMenu = getStoredMenu();

        if (storedMenu) {
          console.log("useMenu: Using stored menu from login");
          setMenu(storedMenu);
        } else {
          console.log(
            "useMenu: No stored menu found, fetching new menu with token"
          );
          const fetchedMenu = await fetchAndStoreMenu(restToken);
          setMenu(fetchedMenu);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Failed to load menu";

        // Check if error is related to token validation
        if (errorMessage.includes("401") ||
            errorMessage.includes("403") ||
            errorMessage.includes("Unauthorized") ||
            errorMessage.includes("token") ||
            errorMessage.includes("expired")) {
          handleTokenError(errorMessage);
        } else {
          // Non-token related error
          console.error("useMenu: Error loading menu:", err);
          setError(errorMessage);
          setMenu({ elements: [] });
          setIsLoading(false);
        }
      } finally {
        if (!error || !error.includes("expired")) {
          setIsLoading(false);
        }
      }
      */
    };

    loadMenu();
  }, [session, status, restToken, router]);

  const refreshMenu = async () => {
    if (!session || !restToken) return;

    try {
      setIsLoading(true);
      const newMenu = await fetchAndStoreMenu(restToken);
      setMenu(newMenu);
      setError(null);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to refresh menu";
      setError(errorMessage);
      setMenu({ elements: [] }); // Show empty menu on error
    } finally {
      setIsLoading(false);
    }
  };

  return {
    menu,
    isLoading,
    error,
    refreshMenu,
  };
}

export default useMenu;
