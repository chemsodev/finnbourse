/**
 * ExpiredTokenHandler.tsx
 * Client component to handle expired token cleanup when redirected from middleware
 */

"use client";

import { useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { handleInvalidTokenCleanup } from "@/lib/utils/tokenCleanup";

export default function ExpiredTokenHandler() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const isExpired = searchParams.get("expired");

    if (isExpired === "true") {
      console.log("🚨 Detected expired token, performing cleanup...");

      // Add a small delay to allow the page to fully load
      const timeoutId = setTimeout(() => {
        // Perform cleanup asynchronously
        handleInvalidTokenCleanup()
          .then(() => {
            console.log("✅ Expired token cleanup completed");

            // Remove the expired parameter from URL without reload
            if (typeof window !== "undefined") {
              const url = new URL(window.location.href);
              url.searchParams.delete("expired");
              window.history.replaceState({}, "", url.toString());
            }
          })
          .catch((error) => {
            console.error("❌ Error during expired token cleanup:", error);
          });
      }, 500); // 500ms delay

      // Cleanup timeout if component unmounts
      return () => clearTimeout(timeoutId);
    }
  }, [searchParams]);

  // This component doesn't render anything
  return null;
}
