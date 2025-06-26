/**
 * MenuContext.tsx
 * Context to store menu data fetched during login
 */

"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { MenuResponse } from "@/app/actions/menuService";
import { useSession } from "next-auth/react";
import {
  clearMenuData,
  getStoredMenuData,
  hasStoredMenuData,
} from "@/lib/utils/menuUtils";

interface MenuContextType {
  menu: MenuResponse;
  setMenu: (menu: MenuResponse) => void;
  clearMenu: () => void;
  isLoading: boolean;
  error: string | null;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider = ({ children }: { children: React.ReactNode }) => {
  const [menu, setMenu] = useState<MenuResponse>({ elements: [] });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();

  // Load menu from sessionStorage on mount
  useEffect(() => {
    if (session && hasStoredMenuData()) {
      const storedMenu = getStoredMenuData();
      if (storedMenu) {
        setMenu(storedMenu);
      }
    }
  }, [session]);

  // Clear menu when session is lost
  useEffect(() => {
    if (status === "unauthenticated") {
      clearMenu();
    }
  }, [status]);

  // Store menu in sessionStorage when it changes
  const updateMenu = (newMenu: MenuResponse) => {
    setMenu(newMenu);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("finnbourse-menu", JSON.stringify(newMenu));
    }
  };

  // Clear menu and sessionStorage
  const clearMenu = () => {
    setMenu({ elements: [] });
    clearMenuData();
  };

  return (
    <MenuContext.Provider
      value={{
        menu,
        setMenu: updateMenu,
        clearMenu,
        isLoading,
        error,
      }}
    >
      {children}
    </MenuContext.Provider>
  );
};

export const useMenuContext = () => {
  const context = useContext(MenuContext);
  if (context === undefined) {
    throw new Error("useMenuContext must be used within a MenuProvider");
  }
  return context;
};
