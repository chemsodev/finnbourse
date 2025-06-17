/**
 * MenuContext.tsx
 * Context to store menu data fetched during login
 */

"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { MenuResponse, getFallbackMenu } from "@/app/actions/menuService";
import { useSession } from "next-auth/react";

interface MenuContextType {
  menu: MenuResponse;
  setMenu: (menu: MenuResponse) => void;
  isLoading: boolean;
  error: string | null;
}

const MenuContext = createContext<MenuContextType | undefined>(undefined);

export const MenuProvider = ({ children }: { children: React.ReactNode }) => {
  const [menu, setMenu] = useState<MenuResponse>(getFallbackMenu());
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session } = useSession();

  // Load menu from sessionStorage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedMenu = sessionStorage.getItem("finnbourse-menu");
      if (storedMenu) {
        try {
          const parsedMenu = JSON.parse(storedMenu);
          setMenu(parsedMenu);
        } catch (err) {
          console.warn("Failed to parse stored menu:", err);
          setMenu(getFallbackMenu());
        }
      }
    }
  }, []);

  // Store menu in sessionStorage when it changes
  const updateMenu = (newMenu: MenuResponse) => {
    setMenu(newMenu);
    if (typeof window !== "undefined") {
      sessionStorage.setItem("finnbourse-menu", JSON.stringify(newMenu));
    }
  };

  return (
    <MenuContext.Provider
      value={{
        menu,
        setMenu: updateMenu,
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
