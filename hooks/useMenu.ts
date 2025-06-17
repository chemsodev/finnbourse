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
  getFallbackMenu,
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
  const [menu, setMenu] = useState<MenuResponse>(getFallbackMenu());
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const { restToken } = useRestToken();

  useEffect(() => {
    const loadMenu = async () => {
      if (status === "loading") {
        return; // Still loading session
      }
      if (!session || !restToken) {
        console.log("useMenu: No session or REST token, using fallback menu");
        console.log("Session:", !!session, "REST Token:", !!restToken);
        setMenu(getFallbackMenu());
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
        console.warn("useMenu: Error loading menu, using fallback:", err);
        setMenu(getFallbackMenu());
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
