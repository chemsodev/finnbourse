/**
 * Rate Limit Handler Component
 * Shows user-friendly messages when rate limiting occurs
 */

"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";
import { useRouter } from "next/navigation";

export function RateLimitHandler() {
  // Disable rate limit blocking to allow login attempts
  return null;

  /* DISABLED - Users can still try to login even with rate limits
  const { data: session, status } = useSession();
  const [showRateLimit, setShowRateLimit] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const router = useRouter();

  useEffect(() => {
    // Check if session has rate limit error
    const hasRateLimit = (session as any)?.error === "RateLimitError";
    setShowRateLimit(hasRateLimit);

    if (hasRateLimit) {
      // Start countdown
      setCountdown(30);
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            // Auto-refresh after countdown
            window.location.reload();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [session]);

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleLogout = () => {
    router.push("/login?tokenExpired=true");
  };

  if (!showRateLimit) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md mx-4">
        <Alert className="border-amber-200 bg-amber-50">
          <AlertCircle className="h-4 w-4 text-amber-600" />
          <AlertTitle className="text-amber-800">Rate Limit Reached</AlertTitle>
          <AlertDescription className="text-amber-700 mt-2">
            Too many requests have been made. Please wait a moment before trying
            again.
            {countdown > 0 && (
              <div className="mt-3 text-sm">
                Auto-refreshing in {countdown} seconds...
              </div>
            )}
          </AlertDescription>
        </Alert>

        <div className="flex gap-2 mt-4">
          <Button
            onClick={handleRefresh}
            disabled={countdown > 0}
            className="flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh Page
          </Button>
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        </div>
      </div>
    </div>
  );
  */
}

export default RateLimitHandler;
