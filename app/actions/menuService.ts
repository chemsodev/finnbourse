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
const MENU_API_BASE =
  process.env.NEXT_PUBLIC_MENU_ORDER || "https://poc.finnetude.com";
const MENU_ENDPOINT = "/api/v1/menu/list";

// Function to sanitize and validate menu data from API
function sanitizeMenuData(data: any): MenuResponse {
  try {
    if (!data || !data.elements || !Array.isArray(data.elements)) {
      console.warn("Invalid menu data structure received from API");
      throw new Error("Invalid menu data structure");
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

    if (sanitizedElements.length === 0) {
      throw new Error("No valid menu elements found");
    }

    return { elements: sanitizedElements };
  } catch (error) {
    console.error("Error sanitizing menu data:", error);
    throw error;
  }
}

// Get REST token from session (server-side)
// This uses the token generated from 192.168.0.213:3000 REST API during login
async function getRestToken(): Promise<string | null> {
  try {
    const session = (await getServerSession(auth)) as Session & {
      user?: SessionUser;
    };
    // Use the REST token generated from 192.168.0.213:3000 for menu fetching
    return session?.user?.restToken || null;
  } catch (error) {
    console.error("Error getting REST token from 192.168.0.213:3000:", error);
    return null;
  }
}

// Server-side menu fetch
export async function fetchMenu(): Promise<MenuResponse> {
  const restToken = await getRestToken();

  if (!restToken) {
    console.error(
      "No REST token from 192.168.0.213:3000 available for menu fetch"
    );
    throw new Error("No REST token available for menu fetch");
  }

  console.log(
    "Fetching menu from 192.168.0.128 using 192.168.0.213:3000 REST token"
  );

  // Add timeout to prevent hanging
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

  try {
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
      throw new Error(`Menu API returned status: ${response.status}`);
    }

    const menuData: MenuResponse = await response.json();
    console.log("Successfully fetched menu from 192.168.0.128");
    console.log("Raw menu data:", JSON.stringify(menuData, null, 2));

    // Validate and sanitize the menu data
    return sanitizeMenuData(menuData);
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === "AbortError") {
      console.error("Menu fetch timed out (5s)");
      throw new Error("Menu fetch timed out");
    } else {
      console.error("Error fetching menu from 192.168.0.128:", error);
      throw error;
    }
  }
}

// Client-side menu fetch
export async function fetchMenuClient(token?: string): Promise<MenuResponse> {
  if (!token) {
    console.error(
      "No 192.168.0.213:3000 REST token provided for client menu fetch"
    );
    throw new Error("No REST token provided for client menu fetch");
  }

  console.log(
    "Client: Fetching menu from 192.168.0.128 using 192.168.0.213:3000 REST token"
  );

  // Add timeout to prevent hanging
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

  try {
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
      throw new Error(`Client menu API returned status: ${response.status}`);
    }

    const menuData: MenuResponse = await response.json();
    console.log("Client: Successfully fetched menu from 192.168.0.128");
    console.log("Client: Raw menu data:", JSON.stringify(menuData, null, 2));

    // Validate and sanitize the menu data
    return sanitizeMenuData(menuData);
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error && error.name === "AbortError") {
      console.error("Client: Menu fetch timed out (5s)");
      throw new Error("Client menu fetch timed out");
    } else {
      console.error("Client: Error fetching menu from 192.168.0.128:", error);
      throw error;
    }
  }
}

// Function to fetch and store menu during login
export async function fetchAndStoreMenu(token?: string): Promise<MenuResponse> {
  console.log("fetchAndStoreMenu called with token:", !!token);
  console.log("Token (first 10 chars):", token?.substring(0, 10));

  if (!token) {
    console.error("No token provided to fetchAndStoreMenu");
    throw new Error("No token provided for menu fetch");
  }

  // Fetch menu using provided token
  const menuData = await fetchMenuClient(token);

  // Store in sessionStorage for persistence across page reloads
  if (typeof window !== "undefined") {
    sessionStorage.setItem("finnbourse-menu", JSON.stringify(menuData));
  }

  console.log("Menu fetched and stored during login");
  return menuData;
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
  "order-history": {
    label: "Order History",
    href: "/order-history",
    icon: "History",
    translationKey: "historiqueDesOrdres",
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
  
  "validation-retour-premiere": {
    label: "Return Validation",
    href: "/ordres/validation-retour-premiere",
    translationKey: "validationRetourPremiere",
  },
  "validation-retour-finale": {
    label: "Return Validation",
    href: "/ordres/validation-retour-finale",
    translationKey: "validationRetourFinale",
  },
  "validation-tcc-premiere": {
    label: "TCC First Validation",
    href: "/ordres/validation-tcc-premiere",
    translationKey: "validationTccPremiere",
  },
  "validation-tcc-finale": {
    label: "TCC Final Validation",
    href: "/ordres/validation-tcc-finale",
    translationKey: "validationTCCFinal",
  },
  "validation-tcc-retour-premiere": {
    label: "TCC Return Validation",
    href: "/ordres/validation-tcc-retour-premiere",
    translationKey: "validationTCCRetourPremiere",
  },
  "validation-tcc-retour-finale": {
    label: "TCC Return Validation",
    href: "/ordres/validation-tcc-retour-finale",
    translationKey: "validationTCCRetourFinale",
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
  "iob-secondary-market": {
    label: "IOB Secondary Market",
    href: "/iob-secondary-market",
    icon: "BarChart2",
    translationKey: "iobSecondaryMarket",
  },

  // Securities & Issuers dropdown and children
  "titles-emetteurs-dropdown": {
    label: "Securities & Issuers",
    icon: "Award",
    translationKey: "titresEtEmeteurs",
  },
  emetteurs: {
    label: "Issuers",
    href: "/emetteurs",
    icon: "CheckCircle",
    translationKey: "emetteurs",
  },
  /*emissions: {
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
  },*/
  "gestion-titres": {
    label: "Securities Management",
    href: "/gestion-des-titres",
    translationKey: "gestionTitres",
  },

  /* Account Management dropdown and children
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
  },*/

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
  utilisateurs: {
    label: "Users",
    href: "/utilisateurs",
    icon: "UserCog",
    translationKey: "user",
  },
  clients: {
    label: "Clients",
    href: "/clients",
    icon: "Briefcase",
    translationKey: "client",
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
  getMenuItemInfo,
  getStoredMenu,
  hasMenuAccess,
  menuItemMap,
};
