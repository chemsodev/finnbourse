/**
 * Token Debug Utility
 * Helps debug token refresh issues
 */

import { tokenManager } from "./tokenManager";

// Add to window for browser console access
declare global {
  interface Window {
    tokenDebug: any;
  }
}

export const tokenDebug = {
  // Get current token manager state
  getState() {
    return tokenManager.getState();
  },

  // Force clear stuck refresh
  clearStuck() {
    console.log("🔧 Forcing clear of stuck refresh...");
    tokenManager.clearStuckRefresh();
    console.log("✅ Cleared. Current state:", tokenManager.getState());
  },

  // Reset token manager completely
  reset() {
    console.log("🔄 Resetting token manager...");
    tokenManager.reset();
    console.log("✅ Reset complete. Current state:", tokenManager.getState());
  },

  // Check current session token info
  async checkSession() {
    if (typeof window !== "undefined") {
      const { getSession } = await import("next-auth/react");
      const session = await getSession();

      if (session && (session as any).tokenExpires) {
        const token = session as any;
        const expiryTime = token.tokenExpires * 1000;
        const now = Date.now();
        const timeUntilExpiry = expiryTime - now;

        console.log("📊 Current Session Token Info:");
        console.log(`   Expires: ${new Date(expiryTime).toLocaleString()}`);
        console.log(
          `   Time until expiry: ${Math.round(timeUntilExpiry / 1000)}s`
        );
        console.log(`   Needs refresh: ${timeUntilExpiry < 5 * 60 * 1000}`);
        console.log(`   Has error: ${token.error || "None"}`);

        return {
          expiryTime,
          timeUntilExpiry,
          needsRefresh: timeUntilExpiry < 5 * 60 * 1000,
          error: token.error,
        };
      } else {
        console.log("❌ No session or token expiry info found");
        return null;
      }
    }
  },

  // Monitor token state (call every few seconds)
  monitor(intervalSeconds = 5) {
    console.log("🔍 Starting token monitor...");

    const interval = setInterval(async () => {
      console.log("🕒 Token Monitor Check:");
      console.log("   Manager State:", this.getState());
      await this.checkSession();
    }, intervalSeconds * 1000);

    // Return function to stop monitoring
    return () => {
      console.log("⏹️ Stopping token monitor");
      clearInterval(interval);
    };
  },
};

// Make available in browser console
if (typeof window !== "undefined") {
  window.tokenDebug = tokenDebug;
  console.log("🐛 Token debug utilities available at window.tokenDebug");
  console.log(
    "   Available methods: getState(), clearStuck(), reset(), checkSession(), monitor()"
  );
}
