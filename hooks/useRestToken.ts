/**
 * useRestToken.ts
 * -----------------------
 * Custom hook to access REST API token for actor management pages
 * Handles token fetching, storage, and automatic retrieval
 */

"use client";

import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";

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

const REST_TOKEN_KEY = "finnbourse_rest_token";

export function useRestToken() {
  const { data: session, status } = useSession() as {
    data: ExtendedSession | null;
    status: string;
  };

  const [storedRestToken, setStoredRestToken] = useState<string | null>(null);
  const [isFetchingToken, setIsFetchingToken] = useState(false);

  // Get token from storage on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem(REST_TOKEN_KEY);
      if (stored) {
        setStoredRestToken(stored);
        console.log("🔑 REST Token loaded from storage");
      }
    }
  }, []);

  // Fetch and store REST token when session is available but no REST token
  useEffect(() => {
    const shouldFetchToken =
      status === "authenticated" &&
      session?.user &&
      !session?.user?.restToken &&
      !storedRestToken &&
      !isFetchingToken;

    if (shouldFetchToken) {
      fetchAndStoreRestToken();
    }
  }, [session, status, storedRestToken, isFetchingToken]);

  // Store REST token when it becomes available in session
  useEffect(() => {
    if (
      session?.user?.restToken &&
      session.user.restToken !== storedRestToken
    ) {
      storeRestToken(session.user.restToken);
    }
  }, [session?.user?.restToken, storedRestToken]);

  const fetchAndStoreRestToken = async () => {
    if (isFetchingToken) return;

    setIsFetchingToken(true);
    try {
      // Fetch token from API endpoint
      const response = await fetch("/api/auth/rest-token", {
        method: "GET",
        credentials: "include",
      });

      if (response.ok) {
        const data = await response.json();
        if (data.restToken) {
          storeRestToken(data.restToken);
          console.log("🔑 REST Token fetched and stored");
        }
      } else {
        console.warn("⚠️ Failed to fetch REST token from API");
      }
    } catch (error) {
      console.error("❌ Error fetching REST token:", error);
    } finally {
      setIsFetchingToken(false);
    }
  };

  const storeRestToken = (token: string) => {
    if (typeof window !== "undefined") {
      localStorage.setItem(REST_TOKEN_KEY, token);
      setStoredRestToken(token);
    }
  };

  const clearStoredToken = () => {
    if (typeof window !== "undefined") {
      localStorage.removeItem(REST_TOKEN_KEY);
      setStoredRestToken(null);
    }
  };

  // Clear token when user logs out
  useEffect(() => {
    if (status === "unauthenticated") {
      clearStoredToken();
    }
  }, [status]);

  const restToken = session?.user?.restToken || storedRestToken;
  const graphqlToken = session?.user?.token;
  const loginSource = session?.user?.loginSource;
  const isLoading = status === "loading" || isFetchingToken;
  const isAuthenticated = status === "authenticated";

  // Debug log for token availability
  if (isAuthenticated && restToken) {
    console.log(`🔑 REST Token available: ${restToken.substring(0, 20)}...`);
    console.log(`📡 Login source: ${loginSource}`);
  } else if (isAuthenticated && !restToken) {
    console.log("⚠️ No REST token available");
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
    fetchAndStoreRestToken,
    clearStoredToken,
  };
}

export default useRestToken;
