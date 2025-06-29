/**
 * Session State Utility
 * Helps track session states to prevent redirect loops
 */

const SESSION_STATE_KEY = "finnbourse_session_state";

export type SessionState = "clean" | "expired" | "logging_in" | "error";

export function setSessionState(state: SessionState): void {
  if (typeof window === "undefined") return;

  try {
    sessionStorage.setItem(SESSION_STATE_KEY, state);
    console.log(`📊 Session state set to: ${state}`);
  } catch (error) {
    console.error("❌ Error setting session state:", error);
  }
}

export function getSessionState(): SessionState {
  if (typeof window === "undefined") return "clean";

  try {
    const state = sessionStorage.getItem(SESSION_STATE_KEY) as SessionState;
    return state || "clean";
  } catch (error) {
    console.error("❌ Error getting session state:", error);
    return "clean";
  }
}

export function clearSessionState(): void {
  if (typeof window === "undefined") return;

  try {
    sessionStorage.removeItem(SESSION_STATE_KEY);
    console.log("✅ Session state cleared");
  } catch (error) {
    console.error("❌ Error clearing session state:", error);
  }
}

export function isInErrorState(): boolean {
  const state = getSessionState();
  return state === "expired" || state === "error";
}
