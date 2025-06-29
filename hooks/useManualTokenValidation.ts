/**
 * useManualTokenValidation.ts
 * Hook for manually validating tokens (e.g., before important API calls)
 */

"use client";

import { useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRestToken } from "@/hooks/useRestToken";
import { handleInvalidTokenCleanup } from "@/lib/utils/tokenCleanup";
import { useRouter } from "next/navigation";

export function useManualTokenValidation() {
  const { data: session, status } = useSession();
  const { restToken } = useRestToken();
  const router = useRouter();

  const validateToken = useCallback(async (): Promise<boolean> => {
    try {
      // Check basic session state
      if (status === "loading") {
        return true; // Still loading, assume valid for now
      }

      if (status === "unauthenticated" || !session || !restToken) {
        console.log("❌ Manual validation failed: No valid session or token");
        await handleInvalidTokenCleanup();
        router.push("/login");
        return false;
      }

      // Check token expiry
      if ((session as any)?.user?.tokenExpires) {
        const tokenExpiry = (session as any).user.tokenExpires * 1000;
        const currentTime = Date.now();

        if (currentTime >= tokenExpiry) {
          console.log("❌ Manual validation failed: Token expired");
          await handleInvalidTokenCleanup();
          router.push("/login?expired=true");
          return false;
        }
      }

      // TEMPORARILY DISABLED: Validate with backend (endpoint doesn't exist yet)
      // const response = await fetch("/api/validate-token", {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({ token: restToken }),
      // });

      // const result = await response.json();

      // if (!response.ok || !result.valid) {
      //   console.log("❌ Manual validation failed: Backend validation failed");
      //   await handleInvalidTokenCleanup();
      //   router.push("/login?expired=true");
      //   return false;
      // }

      // Skip backend validation for now since endpoint doesn't exist
      console.log("✅ Manual validation passed: Backend validation skipped");

      console.log("✅ Manual token validation successful");
      return true;
    } catch (error) {
      console.error("❌ Error during manual token validation:", error);
      // On error, assume token might be invalid for security
      await handleInvalidTokenCleanup();
      router.push("/login?expired=true");
      return false;
    }
  }, [session, status, restToken, router]);

  const isTokenValid = useCallback((): boolean => {
    if (status === "loading") return true;
    if (status === "unauthenticated" || !session || !restToken) return false;

    // Check token expiry
    if ((session as any)?.user?.tokenExpires) {
      const tokenExpiry = (session as any).user.tokenExpires * 1000;
      const currentTime = Date.now();
      return currentTime < tokenExpiry;
    }

    return true;
  }, [session, status, restToken]);

  return {
    validateToken,
    isTokenValid,
    hasValidSession: status === "authenticated" && !!session && !!restToken,
  };
}
