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
