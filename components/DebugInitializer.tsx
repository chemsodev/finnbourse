"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRestToken } from "@/hooks/useRestToken";

export default function DebugInitializer() {
  const { data: session, status } = useSession();
  const { restToken, graphqlToken, isLoading, fetchAndStoreRestToken } =
    useRestToken();
  const [showDebug, setShowDebug] = useState(false);

  // Check for debug mode in URL or localStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const debugMode =
        urlParams.get("debug") === "true" ||
        localStorage.getItem("finnbourse_debug") === "true";
      setShowDebug(debugMode);

      if (debugMode) {
        localStorage.setItem("finnbourse_debug", "true");
      }
    }
  }, []);

  // Only render in debug mode
  if (!showDebug) return null;

  return (
    <div className="fixed bottom-0 right-0 bg-black/80 text-white p-2 text-xs z-50 max-w-xs overflow-auto max-h-48">
      <h3 className="font-bold mb-1">Debug Info</h3>
      <div>
        <div>
          Auth Status: <span className="text-green-400">{status}</span>
        </div>
        <div>
          REST Token:{" "}
          {restToken ? (
            <span className="text-green-400">
              {restToken.substring(0, 15)}...
            </span>
          ) : (
            <span className="text-red-400">Not available</span>
          )}
        </div>
        <div>
          GraphQL Token:{" "}
          {graphqlToken ? (
            <span className="text-green-400">
              {graphqlToken.substring(0, 15)}...
            </span>
          ) : (
            <span className="text-red-400">Not available</span>
          )}
        </div>
        <div>User ID: {(session?.user as any)?.id || "Not logged in"}</div>
        <div>Role ID: {(session?.user as any)?.roleid || "N/A"}</div>
        <div className="mt-1">
          <button
            onClick={() => fetchAndStoreRestToken()}
            className="bg-blue-500 text-white px-2 py-1 rounded text-xs"
          >
            Refresh Token
          </button>
          <button
            onClick={() => localStorage.removeItem("finnbourse_debug")}
            className="bg-red-500 text-white px-2 py-1 rounded text-xs ml-2"
          >
            Exit Debug
          </button>
        </div>
      </div>
    </div>
  );
}
