"use client";

import { useEffect } from "react";

export function DebugInitializer() {
  useEffect(() => {
    // Only load debug utilities in development
    if (process.env.NODE_ENV === "development") {
      import("@/lib/tokenDebug").then(() => {
        console.log("🐛 Token debug utilities loaded");
      });
    }
  }, []);

  return null; // This component renders nothing
}

export default DebugInitializer;
