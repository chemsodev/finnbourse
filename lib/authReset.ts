/**
 * Emergency Auth Reset Utility
 * Use this in browser console when auth system gets stuck
 */

// Add to window for browser console access
declare global {
  interface Window {
    authReset: any;
  }
}

export const authReset = {
  // Nuclear option - clear everything and force login
  forceLogin() {
    console.log("🚨 EMERGENCY AUTH RESET - Clearing all data...");

    try {
      // Clear all storage
      localStorage.clear();
      sessionStorage.clear();

      // Clear cookies
      document.cookie.split(";").forEach(function (c) {
        document.cookie = c
          .replace(/^ +/, "")
          .replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
      });

      console.log("✅ Cleared all storage and cookies");

      // Force navigation to login
      window.location.href = "/login?reset=true";
    } catch (error) {
      console.error("❌ Error during reset:", error);
      // Fallback - just reload to homepage
      window.location.href = "/";
    }
  },

  // Check current auth state
  checkState() {
    console.log("🔍 Current Auth State:");
    console.log("   LocalStorage keys:", Object.keys(localStorage));
    console.log("   SessionStorage keys:", Object.keys(sessionStorage));
    console.log("   Cookies:", document.cookie);
    console.log("   Current URL:", window.location.href);

    // Try to get session
    fetch("/api/auth/session")
      .then((r) => r.json())
      .then((session) => {
        console.log("   Current session:", session);
      })
      .catch((err) => {
        console.log("   Session fetch error:", err);
      });
  },

  // Clear just auth-related items
  clearAuth() {
    console.log("🧹 Clearing auth data only...");

    // Clear NextAuth related items
    const keysToRemove = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (
        key &&
        (key.includes("next-auth") ||
          key.includes("auth") ||
          key.includes("token"))
      ) {
        keysToRemove.push(key);
      }
    }

    keysToRemove.forEach((key) => {
      localStorage.removeItem(key);
      console.log(`   Removed: ${key}`);
    });

    // Clear session storage
    sessionStorage.clear();

    console.log("✅ Auth data cleared. Try refreshing the page.");
  },
};

// Make available in browser console
if (typeof window !== "undefined") {
  window.authReset = authReset;
  console.log("🚨 Emergency auth reset available at window.authReset");
  console.log("   Available methods:");
  console.log("   - authReset.forceLogin() - Clear everything and go to login");
  console.log("   - authReset.clearAuth() - Clear just auth data");
  console.log("   - authReset.checkState() - Check current auth state");
}
