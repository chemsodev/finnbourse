/**
 * useRestToken.ts
 * -----------------------
 * Custom hook to access REST API token for actor management pages
 */

"use client";

import { useSession } from "next-auth/react";

interface SessionUser {
  token?: string;
  restToken?: string;
  loginSource?: "REST" | "GraphQL";
  id?: string;
  email?: string;
  roleid?: number;
  negotiatorId?: string;
}

interface ExtendedSession {
  user?: SessionUser;
}

export function useRestToken() {
  const { data: session, status } = useSession() as {
    data: ExtendedSession | null;
    status: string;
  };

  const restToken = session?.user?.restToken;
  const graphqlToken = session?.user?.token;
  const loginSource = session?.user?.loginSource;
  const isLoading = status === "loading";
  const isAuthenticated = status === "authenticated";

  // Debug log for token availability
  if (isAuthenticated && restToken) {
    console.log(`🔑 REST Token available: ${restToken.substring(0, 20)}...`);
    console.log(`📡 Login source: ${loginSource}`);
  } else if (isAuthenticated && !restToken) {
    console.log("⚠️ No REST token available in session");
    console.log(`📡 Login source: ${loginSource}`);
    console.log(
      `🔑 GraphQL token: ${graphqlToken ? "Available" : "Not available"}`
    );
  }

  return {
    restToken,
    graphqlToken,
    loginSource,
    isLoading,
    isAuthenticated,
    user: session?.user,
    hasRestToken: !!restToken,
    hasGraphqlToken: !!graphqlToken,
  };
}

export default useRestToken;
