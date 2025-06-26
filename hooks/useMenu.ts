/**
 * useMenu.ts
 * Hook to access menu data stored during login
 */

"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRestToken } from "@/hooks/useRestToken";
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

  useEffect(() => {
    const loadMenu = async () => {
      if (status === "loading") {
        return; // Still loading session
      }

      // If no session, clear menu and show empty menu
      if (status === "unauthenticated" || !session || !restToken) {
        console.log("useMenu: No session or REST token, showing empty menu");
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("finnbourse-menu");
        }
        setMenu({ elements: [] });
        setIsLoading(false);
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
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load menu";
        setError(errorMessage);
        console.error("useMenu: Error loading menu:", err);
        setMenu({ elements: [] }); // Show empty menu on error
      } finally {
        setIsLoading(false);
      }
    };

    loadMenu();
  }, [session, status, restToken]);

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
