/**
 * menuUtils.ts
 * Centralized utilities for menu management and cleanup
 */

/**
 * Clears all menu-related data from storage
 * This should be called on logout to ensure clean state
 */
export function clearMenuData(): void {
  if (typeof window !== "undefined") {
    // Clear menu from sessionStorage
    sessionStorage.removeItem("finnbourse-menu");

    // Clear any other menu-related storage items
    localStorage.removeItem("finnbourse-menu");

    console.log("Menu data cleared from storage");
  }
}

/**
 * Clears all user session data including menu, tokens, and other session storage
 * This is a comprehensive cleanup for logout scenarios
 */
export function clearAllSessionData(): void {
  if (typeof window !== "undefined") {
    // Clear all sessionStorage
    sessionStorage.clear();

    // Clear specific localStorage items
    localStorage.removeItem("finnbourse_rest_token");
    localStorage.removeItem("finnbourse-menu");

    // Clear any token manager state
    if ((window as any).tokenManager) {
      (window as any).tokenManager.reset();
    }

    console.log("All session data cleared");
  }
}

/**
 * Checks if menu data exists in storage
 */
export function hasStoredMenuData(): boolean {
  if (typeof window === "undefined") return false;

  return !!sessionStorage.getItem("finnbourse-menu");
}

/**
 * Gets the stored menu data if it exists
 */
export function getStoredMenuData(): any | null {
  if (typeof window === "undefined") return null;

  try {
    const stored = sessionStorage.getItem("finnbourse-menu");
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.warn("Failed to parse stored menu data:", error);
    clearMenuData(); // Clear corrupted data
    return null;
  }
}
