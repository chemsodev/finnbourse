/**
 * Login Tracker Utility
 * Tracks recent login events to prevent redirect loops
 */

const RECENT_LOGIN_KEY = "finnbourse_recent_login";
const GRACE_PERIOD = 5000; // 5 seconds grace period

export function markRecentLogin(): void {
  if (typeof window === "undefined") return;

  try {
    sessionStorage.setItem(RECENT_LOGIN_KEY, Date.now().toString());
    console.log("✅ Marked recent login for grace period");
  } catch (error) {
    console.error("❌ Error marking recent login:", error);
  }
}

export function isRecentLogin(): boolean {
  if (typeof window === "undefined") return false;

  try {
    const loginTime = sessionStorage.getItem(RECENT_LOGIN_KEY);
    if (!loginTime) return false;

    const timeDiff = Date.now() - parseInt(loginTime);
    return timeDiff < GRACE_PERIOD;
  } catch (error) {
    console.error("❌ Error checking recent login:", error);
    return false;
  }
}

export function clearRecentLogin(): void {
  if (typeof window === "undefined") return;

  try {
    sessionStorage.removeItem(RECENT_LOGIN_KEY);
    console.log("✅ Cleared recent login marker");
  } catch (error) {
    console.error("❌ Error clearing recent login:", error);
  }
}
