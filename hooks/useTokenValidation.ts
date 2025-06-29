/**
 * useTokenValidation.ts
 * Enhanced hook to handle token validation with backend verification and comprehensive cleanup
 */

"use client";

import { useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useRestToken } from "@/hooks/useRestToken";
import {
  handleInvalidTokenCleanup,
  forcePageReload,
} from "@/lib/utils/tokenCleanup";
import { getSessionState, isInErrorState } from "@/lib/utils/sessionState";
import { isRecentLogin } from "@/lib/utils/loginTracker";

interface UseTokenValidationOptions {
  redirectOnInvalid?: boolean;
  onTokenInvalid?: () => void;
  checkInterval?: number; // in milliseconds
  enableBackendValidation?: boolean; // Enable/disable backend validation
  maxRetries?: number; // Maximum retries for backend validation
}

export function useTokenValidation(options: UseTokenValidationOptions = {}) {
  const {
    redirectOnInvalid = true,
    onTokenInvalid,
    checkInterval = 60000, // 1 minute default (reduced from 30s)
    enableBackendValidation = false, // Default to false since backend endpoint doesn't exist yet
    maxRetries = 3,
  } = options;

  const { data: session, status } = useSession();
  const { restToken } = useRestToken();
  const router = useRouter();
  const retryCount = useRef(0);
  const isHandlingInvalidToken = useRef(false);

  const handleInvalidToken = async (reason: string) => {
    // Prevent multiple simultaneous calls
    if (isHandlingInvalidToken.current) {
      console.log("Token cleanup already in progress, skipping...");
      return;
    }

    isHandlingInvalidToken.current = true;
    console.error("🚨 Token validation failed:", reason);

    try {
      // Call custom handler if provided (before cleanup)
      if (onTokenInvalid) {
        onTokenInvalid();
      }

      // Perform comprehensive cleanup
      await handleInvalidTokenCleanup();

      // Sign out from NextAuth
      try {
        await signOut({ redirect: false });
      } catch (error) {
        console.error("Error signing out:", error);
        // If sign out fails, force page reload as fallback
        if (redirectOnInvalid) {
          forcePageReload("/login");
          return;
        }
      }

      // Redirect to login if enabled
      if (redirectOnInvalid) {
        router.push("/login");
      }
    } catch (error) {
      console.error("Error during token cleanup:", error);
      // Force page reload as last resort
      if (redirectOnInvalid) {
        forcePageReload("/login");
      }
    } finally {
      isHandlingInvalidToken.current = false;
    }
  };

  const validateTokenWithBackend = async (token: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/validate-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const result = await response.json();

      if (!response.ok || !result.valid) {
        console.error("Backend token validation failed:", result.error);
        return false;
      }

      retryCount.current = 0; // Reset retry count on success
      return true;
    } catch (error) {
      console.error("Error validating token with backend:", error);
      retryCount.current++;

      // If we've exceeded max retries, consider token invalid
      if (retryCount.current >= maxRetries) {
        console.error(`Backend validation failed after ${maxRetries} retries`);
        return false;
      }

      // For network errors, don't immediately invalidate token
      // unless we've exceeded max retries
      return true;
    }
  };

  const validateToken = async () => {
    // Skip validation if session is still loading
    if (status === "loading") {
      return true;
    }

    // Check if we have a session
    if (status === "unauthenticated" || !session) {
      await handleInvalidToken("No active session");
      return false;
    }

    // Check if we have a REST token, but be lenient during grace periods
    if (!restToken) {
      // Check if we're in a grace period (recent login or clean session state)
      const sessionState = getSessionState();
      const isRecentlyLoggedIn = isRecentLogin();

      if (
        isRecentlyLoggedIn ||
        sessionState === "clean" ||
        sessionState === "logging_in"
      ) {
        console.log(
          "⏳ No REST token but in grace period, allowing time for token establishment"
        );
        return true;
      }

      // Only redirect if we're not in a grace period and not already in an error state
      if (!isInErrorState()) {
        await handleInvalidToken("No valid REST token");
        return false;
      }

      return true; // If already in error state, don't cascade more errors
    }

    // Check if session has expired (if expiry info is available)
    if (session.expires) {
      const expiryTime = new Date(session.expires).getTime();
      const currentTime = new Date().getTime();

      if (currentTime >= expiryTime) {
        await handleInvalidToken("Session expired");
        return false;
      }
    }

    // Check token expiry from JWT payload if available
    if ((session as any)?.user?.tokenExpires) {
      const tokenExpiry = (session as any).user.tokenExpires * 1000; // Convert to milliseconds
      const currentTime = Date.now();

      if (currentTime >= tokenExpiry) {
        await handleInvalidToken("JWT token expired");
        return false;
      }
    }

    // Validate with backend if enabled
    if (enableBackendValidation) {
      const isValidWithBackend = await validateTokenWithBackend(restToken);
      if (!isValidWithBackend) {
        await handleInvalidToken("Backend token validation failed");
        return false;
      }
    }

    return true;
  };

  // Initial validation
  useEffect(() => {
    validateToken();
  }, [session, status, restToken]);

  // Periodic validation (optional)
  useEffect(() => {
    if (checkInterval > 0) {
      const interval = setInterval(() => {
        // Only validate if we're not already handling an invalid token
        if (!isHandlingInvalidToken.current) {
          validateToken();
        }
      }, checkInterval);

      return () => clearInterval(interval);
    }
  }, [checkInterval, session, status, restToken]);

  // Listen for storage events (token changes in other tabs)
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "restToken" && !event.newValue) {
        // Token was removed in another tab
        handleInvalidToken("Token removed in another tab");
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Listen for network events to re-validate when coming back online
  useEffect(() => {
    const handleOnline = () => {
      console.log("Network reconnected, validating token...");
      validateToken();
    };

    window.addEventListener("online", handleOnline);
    return () => window.removeEventListener("online", handleOnline);
  }, []);

  return {
    validateToken,
    isValid: status === "authenticated" && !!session && !!restToken,
    handleInvalidToken,
  };
}

export default useTokenValidation;
