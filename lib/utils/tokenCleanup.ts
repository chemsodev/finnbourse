/**
 * Enhanced Token and Cache Clearing Utilities
 * Comprehensive cleanup for invalid tokens and user logout
 */

/**
 * Clears all authentication-related data from storage
 */
export function clearAuthStorage(): void {
  if (typeof window === "undefined") return;

  try {
    // Clear specific auth-related items from localStorage
    const authKeys = [
      "finnbourse_rest_token",
      "restToken",
      "finnbourse-menu",
      "next-auth.session-token",
      "__Secure-next-auth.session-token",
      "next-auth.csrf-token",
      "__Host-next-auth.csrf-token",
      "next-auth.callback-url",
      "next-auth.state",
      "next-auth.pkce.code_verifier",
    ];

    authKeys.forEach((key) => {
      localStorage.removeItem(key);
      sessionStorage.removeItem(key);
    });

    // Clear all sessionStorage (most session data should be here)
    sessionStorage.clear();

    console.log("✅ Auth storage cleared successfully");
  } catch (error) {
    console.error("❌ Error clearing auth storage:", error);
  }
}

/**
 * Clears all NextAuth and authentication-related cookies
 */
export function clearAuthCookies(): void {
  if (typeof window === "undefined") return;

  try {
    const cookiesToClear = [
      "next-auth.session-token",
      "__Secure-next-auth.session-token",
      "next-auth.csrf-token",
      "__Host-next-auth.csrf-token",
      "next-auth.callback-url",
      "next-auth.state",
      "next-auth.pkce.code_verifier",
    ];

    // Clear specific cookies
    cookiesToClear.forEach((cookieName) => {
      // Clear for current domain
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=${window.location.hostname};`;
      document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;

      // Clear for parent domain (in case of subdomain)
      const domain = window.location.hostname.split(".").slice(-2).join(".");
      if (domain !== window.location.hostname) {
        document.cookie = `${cookieName}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; domain=.${domain};`;
      }
    });

    console.log("✅ Auth cookies cleared successfully");
  } catch (error) {
    console.error("❌ Error clearing auth cookies:", error);
  }
}

/**
 * Clears browser cache (where possible)
 */
export async function clearBrowserCache(): Promise<void> {
  if (typeof window === "undefined") return;

  try {
    // Clear service worker caches if available
    if ("caches" in window) {
      const cacheNames = await caches.keys();
      await Promise.all(
        cacheNames.map((cacheName) => caches.delete(cacheName))
      );
      console.log("✅ Service worker caches cleared");
    }
  } catch (error) {
    console.error("❌ Error clearing browser cache:", error);
  }
}

/**
 * Resets token manager state
 */
export function resetTokenManager(): void {
  if (typeof window === "undefined") return;

  try {
    // Reset token manager if it exists
    if ((window as any).tokenManager) {
      (window as any).tokenManager.shutdown();
      (window as any).tokenManager.reset();
      console.log("✅ Token manager reset");
    }

    // Reset token debug if it exists
    if ((window as any).tokenDebug) {
      (window as any).tokenDebug.reset();
      console.log("✅ Token debug reset");
    }
  } catch (error) {
    console.error("❌ Error resetting token manager:", error);
  }
}

/**
 * Comprehensive cleanup for invalid token scenarios
 * This is the main function to call when token is invalid
 */
export async function handleInvalidTokenCleanup(): Promise<void> {
  console.log("🧹 Starting comprehensive token cleanup...");

  // Clear all storage
  clearAuthStorage();

  // Clear all cookies
  clearAuthCookies();

  // Clear browser cache
  await clearBrowserCache();

  // Reset token manager
  resetTokenManager();

  console.log("✅ Token cleanup completed");
}

/**
 * Force reload the page after cleanup (use as last resort)
 */
export function forcePageReload(redirectUrl = "/login"): void {
  console.log(`🔄 Force reloading to: ${redirectUrl}`);
  window.location.href = redirectUrl;
}
