/**
 * menuService.ts
 * -----------------------
 * Service to fetch dynamic menu structure from the backend
 * Uses REST token for authentication
 */

import { clientFetchREST } from "./fetchREST";
import { getServerSession } from "next-auth/next";
import auth from "@/auth";
import { Session } from "next-auth";

export interface MenuElement {
  id: string;
  children?: MenuElement[];
}

export interface MenuResponse {
  elements: MenuElement[];
}

interface SessionUser {
  token?: string;
  restToken?: string;
  loginSource?: "REST" | "GraphQL";
}

// Menu endpoint configuration
const MENU_API_BASE = "http://localhost:8080/api/v1";
const MENU_ENDPOINT = "/menu/list";

// Function to sanitize and validate menu data from API
function sanitizeMenuData(data: any): MenuResponse {
  try {
    if (!data || !data.elements || !Array.isArray(data.elements)) {
      console.warn("Invalid menu data structure, using fallback");
      return getFallbackMenu();
    }

    const sanitizeElement = (element: any): MenuElement | null => {
      if (!element || typeof element.id !== "string") {
        return null;
      }

      const sanitized: MenuElement = { id: element.id };

      if (element.children && Array.isArray(element.children)) {
        const validChildren = element.children
          .map(sanitizeElement)
          .filter(Boolean) as MenuElement[];

        if (validChildren.length > 0) {
          sanitized.children = validChildren;
        }
      }

      return sanitized;
    };

    const sanitizedElements = data.elements
      .map(sanitizeElement)
      .filter(Boolean) as MenuElement[];

    return {
      elements:
        sanitizedElements.length > 0
          ? sanitizedElements
          : getFallbackMenu().elements,
    };
  } catch (error) {
    console.error("Error sanitizing menu data:", error);
    return getFallbackMenu();
  }
}

// Get REST token from session (server-side)
// This uses the token generated from localhost:3000 REST API during login
async function getRestToken(): Promise<string | null> {
  try {
    const session = (await getServerSession(auth)) as Session & {
      user?: SessionUser;
    };
    // Use the REST token generated from localhost:3000 for menu fetching
    return session?.user?.restToken || null;
  } catch (error) {
    console.error("Error getting REST token from localhost:3000:", error);
    return null;
  }
}

// Server-side menu fetch
export async function fetchMenu(): Promise<MenuResponse> {
  try {
    const restToken = await getRestToken();

    if (!restToken) {
      console.warn(
        "No REST token from localhost:3000 available for menu fetch"
      );
      return getFallbackMenu();
    }

    console.log(
      "Fetching menu from 192.168.0.128 using localhost:3000 REST token"
    );

    // Add timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch(`${MENU_API_BASE}${MENU_ENDPOINT}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${restToken}`,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`Menu fetch failed with status: ${response.status}`);
      console.log("Using fallback menu due to API error");
      return getFallbackMenu();
    }
    const menuData: MenuResponse = await response.json();
    console.log("Successfully fetched menu from 192.168.0.128");
    console.log("Raw menu data:", JSON.stringify(menuData, null, 2));

    // Validate and sanitize the menu data
    if (menuData && menuData.elements && Array.isArray(menuData.elements)) {
      return sanitizeMenuData(menuData);
    } else {
      console.warn("Invalid menu data structure received, using fallback");
      return getFallbackMenu();
    }
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      console.warn("Menu fetch timed out (5s), using fallback menu");
    } else {
      console.warn(
        "Error fetching menu from 192.168.0.128, using fallback menu:",
        error
      );
    }
    console.log("Fallback menu will be used for navigation");
    return getFallbackMenu();
  }
}

// Client-side menu fetch
export async function fetchMenuClient(token?: string): Promise<MenuResponse> {
  try {
    if (!token) {
      console.warn(
        "No localhost:3000 REST token provided for client menu fetch"
      );
      return getFallbackMenu();
    }

    console.log(
      "Client: Fetching menu from 192.168.0.128 using localhost:3000 REST token"
    );

    // Add timeout to prevent hanging
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch(`${MENU_API_BASE}${MENU_ENDPOINT}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      console.error(`Client menu fetch failed with status: ${response.status}`);
      console.log("Client: Using fallback menu due to API error");
      return getFallbackMenu();
    }
    const menuData: MenuResponse = await response.json();
    console.log("Client: Successfully fetched menu from 192.168.0.128");
    console.log("Client: Raw menu data:", JSON.stringify(menuData, null, 2));

    // Validate and sanitize the menu data
    if (menuData && menuData.elements && Array.isArray(menuData.elements)) {
      return sanitizeMenuData(menuData);
    } else {
      console.warn(
        "Client: Invalid menu data structure received, using fallback"
      );
      return getFallbackMenu();
    }
  } catch (error) {
    if (error instanceof Error && error.name === "AbortError") {
      console.warn("Client: Menu fetch timed out (5s), using fallback menu");
    } else {
      console.warn(
        "Client: Error fetching menu from 192.168.0.128, using fallback menu:",
        error
      );
    }
    console.log("Client: Fallback menu will be used for navigation");
    return getFallbackMenu();
  }
}

// Function to fetch and store menu during login
export async function fetchAndStoreMenu(token?: string): Promise<MenuResponse> {
  try {
    let menuData;

    if (token) {
      // Use provided token
      menuData = await fetchMenuClient(token);
    } else {
      // Try to fetch with client-side method
      menuData = await fetchMenuClient();
    }

    // Store in sessionStorage for persistence across page reloads
    if (typeof window !== "undefined") {
      sessionStorage.setItem("finnbourse-menu", JSON.stringify(menuData));
    }

    console.log("Menu fetched and stored during login");
    return menuData;
  } catch (error) {
    console.warn("Failed to fetch menu during login, using fallback:", error);
    const fallbackMenu = getFallbackMenu();

    if (typeof window !== "undefined") {
      sessionStorage.setItem("finnbourse-menu", JSON.stringify(fallbackMenu));
    }

    return fallbackMenu;
  }
}

// Function to get stored menu from sessionStorage
export function getStoredMenu(): MenuResponse | null {
  if (typeof window === "undefined") return null;

  try {
    const storedMenu = sessionStorage.getItem("finnbourse-menu");
    if (storedMenu) {
      return JSON.parse(storedMenu);
    }
  } catch (error) {
    console.warn("Failed to parse stored menu:", error);
  }

  return null;
}

// Fallback menu structure (default menu if API fails)
// This represents the current FinnBourse sidebar structure
export function getFallbackMenu(): MenuResponse {
  return {
    elements: [
      { id: "dashboard" },
      { id: "place-order" },
      { id: "portfolio" },
      {
        id: "orders-dropdown",
        children: [
          { id: "premiere-validation" },
          { id: "validation-finale" },
          { id: "validation-tcc-premiere" },
          { id: "validation-tcc-finale" },
          { id: "execution" },
          { id: "resultats" },
        ],
      },
      {
        id: "titles-emissions-dropdown",
        children: [
          { id: "emetteurs" },
          { id: "commissions" },
          { id: "gestion-titres" },
        ],
      },
      {
        id: "account-management-dropdown",
        children: [
          { id: "compte-espece" },
          { id: "compte-titre" },
          { id: "lien-comptes" },
        ],
      },
      {
        id: "actors-management-dropdown",
        children: [
          { id: "iob" },
          { id: "tcc" },
          { id: "agence" },
          { id: "clients" },
          { id: "utilisateurs" },
        ],
      },
      {
        id: "operations-dropdown",
        children: [
          { id: "annonce-ost" },
          { id: "paiement-dividendes" },
          { id: "paiement-droits-garde" },
          { id: "paiement-coupon" },
          { id: "remboursement" },
        ],
      },
      { id: "charts-editions" },
      { id: "client-service" },
      { id: "settings" },
      { id: "statistics" },
    ],
  };
}

// Menu item mapping for navigation and display
// Updated to match the actual FinnBourse sidebar structure and translations
export const menuItemMap: Record<
  string,
  {
    label: string;
    href?: string;
    icon?: string;
    translationKey?: string;
  }
> = {
  // Top-level navigation items
  dashboard: {
    label: "Dashboard",
    href: "/",
    icon: "LayoutDashboard",
    translationKey: "TableauDeBord",
  },
  "place-order": {
    label: "Place Order",
    href: "/passerunordre",
    icon: "DollarSign",
    translationKey: "passerUnOrdre",
  },
  portfolio: {
    label: "Portfolio",
    href: "/portefeuille",
    icon: "Briefcase",
    translationKey: "portefeuille",
  },

  // Orders dropdown and children
  "orders-dropdown": {
    label: "Orders Management",
    icon: "FileText",
    translationKey: "gestionDesOrdres",
  },
  "premiere-validation": {
    label: "First Validation",
    href: "/ordres/premiere-validation",
    translationKey: "premiereValidation",
  },
  "validation-finale": {
    label: "Final Validation",
    href: "/ordres/validation-finale",
    translationKey: "validationFinale",
  },
  "validation-tcc-premiere": {
    label: "TCC First Validation",
    href: "/ordres/validation-tcc-premiere",
    translationKey: "validationTccPremiere",
  },
  "validation-tcc-finale": {
    label: "TCC Final Validation",
    href: "/ordres/validation-tcc-finale",
    translationKey: "validationTccFinale",
  },
  execution: {
    label: "Execution",
    href: "/ordres/execution",
    translationKey: "execution",
  },
  resultats: {
    label: "Results",
    href: "/ordres/resultats",
    translationKey: "resultats",
  },

  // Securities & Emissions dropdown and children
  "titles-emissions-dropdown": {
    label: "Securities & Emissions",
    icon: "Award",
    translationKey: "titresEtEmissions",
  },
  emetteurs: {
    label: "Issuers",
    href: "/emetteurs",
    icon: "CheckCircle",
    translationKey: "emetteurs",
  },
  emissions: {
    label: "Emissions",
    href: "/emissions",
    icon: "BarChart3",
    translationKey: "emissions",
  },
  commissions: {
    label: "Commissions",
    href: "/commissions",
    icon: "HandCoins",
    translationKey: "commissions",
  },
  "gestion-titres": {
    label: "Securities Management",
    href: "/gestion-des-titres",
    translationKey: "gestionTitres",
  },
  // Account Management dropdown and children
  "account-management-dropdown": {
    label: "Account Management",
    icon: "Users",
    translationKey: "gestionDeCompte",
  },
  "compte-espece": {
    label: "Cash Account",
    href: "/compte-espece",
    icon: "Wallet",
    translationKey: "compteEspece",
  },
  "compte-titre": {
    label: "Securities Account",
    href: "/compte-titre",
    icon: "Receipt",
    translationKey: "compteDeTitre",
  },
  "lien-comptes": {
    label: "Account Links",
    href: "/lien-comptes",
    icon: "Link",
    translationKey: "lienComptes",
  },

  // Actors Management dropdown and children
  "actors-management-dropdown": {
    label: "Actors Management",
    icon: "Landmark",
    translationKey: "gestionDesActeurs",
  },
  iob: {
    label: "IOB",
    href: "/iob",
    icon: "BarChart3",
    translationKey: "iob",
  },
  tcc: {
    label: "TCC",
    href: "/tcc",
    icon: "Building",
    translationKey: "teneurDeCompte",
  },
  agence: {
    label: "Agency",
    href: "/agence",
    icon: "Landmark",
    translationKey: "agence",
  },
  clients: {
    label: "Clients",
    href: "/clients",
    icon: "Briefcase",
    translationKey: "client",
  },
  utilisateurs: {
    label: "Users",
    href: "/utilisateurs",
    icon: "UserCog",
    translationKey: "user",
  },

  // Operations dropdown and children
  "operations-dropdown": {
    label: "Operations on Securities",
    icon: "ArrowRightLeft",
    translationKey: "operationsSurTitres",
  },
  "annonce-ost": {
    label: "OST Announcements",
    href: "/annonce-ost",
    icon: "Sparkle",
    translationKey: "annonceOst",
  },
  "paiement-dividendes": {
    label: "Dividend Payments",
    href: "/paiement-de-dividendes",
    icon: "Sparkle",
    translationKey: "paiementDividendes",
  },
  "paiement-droits-garde": {
    label: "Custody Fee Payments",
    href: "/paiement-droits-de-garde",
    icon: "Sparkle",
    translationKey: "paiementDroitsDeGarde",
  },
  "paiement-coupon": {
    label: "Coupon Payments",
    href: "/paiement-coupon",
    icon: "Sparkle",
    translationKey: "paiementCoupon",
  },
  remboursement: {
    label: "Reimbursements",
    href: "/remboursement",
    icon: "Sparkle",
    translationKey: "remboursement",
  },

  // Bottom navigation items
  "charts-editions": {
    label: "Charts & Reports",
    href: "/chiffres-et-editions",
    icon: "FileBarChart",
    translationKey: "chiffresEtEditions",
  },
  "client-service": {
    label: "Client Service",
    href: "/serviceclients",
    icon: "Headphones",
    translationKey: "ServiceClients",
  },
  settings: {
    label: "Settings",
    href: "/parametres",
    icon: "Settings",
    translationKey: "parametres",
  },
  statistics: {
    label: "Statistics",
    href: "/statistiques",
    icon: "BarChart3",
    translationKey: "Statistiques",
  },
};

// Helper function to get menu item info
export function getMenuItemInfo(id: string) {
  return (
    menuItemMap[id] || {
      label: id,
      translationKey: id,
    }
  );
}

// Helper function to check if user has access to menu item
export function hasMenuAccess(menuId: string, userRole?: number): boolean {
  // Add role-based access control logic here
  // For now, return true for all items
  return true;
}

export default {
  fetchMenu,
  fetchMenuClient,
  fetchAndStoreMenu,
  getFallbackMenu,
  getMenuItemInfo,
  getStoredMenu,
  hasMenuAccess,
  menuItemMap,
};
