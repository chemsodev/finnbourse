/*
 * fetchGraphQL.ts
 * -----------------------
 * Server-side and client-side GraphQL fetchers
 *
 * Updates:
 * - Removed all console.log statements to reduce logging noise
 * - Kept essential error logging for debugging
 * - Improved error handling for token expiration
 * - Optimized for performance across all devices including iOS
 * - Fixed "headers was called outside a request scope" error by
 *   properly separating server and client code
 */

import auth from "@/auth";
import { redirect } from "@/i18n/routing";
import { getServerSession } from "next-auth/next";
import { Session } from "next-auth";

interface FetchGraphQLResponse<T> {
  data: T;
  errors?: { message: string }[];
}

// Server-side GraphQL fetcher (for server components)
export async function fetchGraphQL<T>(
  query: string,
  variables: Record<string, any> = {},
  options?: { headers?: Record<string, string> },
  token?: string
): Promise<T> {
  const session = (await getServerSession(auth)) as Session & {
    user?: {
      token?: string;
    };
  };

  if (!process.env.NEXT_PUBLIC_BACKEND_URL) {
    console.error(
      "Backend URL is not defined. Please check your environment variables."
    );
    throw new Error(
      "Backend URL is not configured. Check your environment variables."
    );
  }

  const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/graphql`;

  try {
    // Add a token check and use a default if not available
    const authToken =
      session?.user?.token ||
      token ||
      process.env.NEXT_PUBLIC_GRAPHQL_TOKEN ||
      "";

    const response = await fetch(backendUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${authToken}`,
        ...options?.headers,
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      console.error(`GraphQL fetch failed with status: ${response.status}`);
      throw new Error(`GraphQL fetch failed with status: ${response.status}`);
    }

    const result: FetchGraphQLResponse<T> = await response.json();

    if (response.status === 429) {
      redirect("/RateLimiter");
    }

    if (result.errors) {
      console.error("GraphQL errors:", result.errors);
      if (result.errors[0].message === "Token is revoked") {
        redirect("/TokenRevoked");
      }

      // Handle token expired case
      if (result.errors[0].message === "Token Expired!") {
        console.error("Token has expired, redirecting to login");
        redirect("/login?tokenExpired=true");
      }

      console.error("GraphQL error:", result.errors[0].message);
      throw new Error("Failed to fetch data: " + result.errors[0].message);
    }

    if (!result.data) {
      console.error("GraphQL response has no data property:", result);
      throw new Error("GraphQL response is missing data");
    }

    return result.data;
  } catch (error) {
    console.error("Error in fetchGraphQL:", error);
    throw error;
  }
}

// Client-side GraphQL fetcher (for client components)
// IMPORTANT: This function does NOT use getServerSession and is safe for client components
export function clientFetchGraphQL<T>(
  query: string,
  variables: Record<string, any> = {},
  options?: { headers?: Record<string, string> },
  token?: string
): Promise<T> {
  // This doesn't use async/await syntax directly, making it safe for client components
  const backendUrl = `${process.env.NEXT_PUBLIC_BACKEND_URL}/graphql`;

  // IMPORTANT: We DO NOT use getServerSession here as it causes the "headers was called outside a request scope" error
  // Only use token passed as parameter or fall back to environment variable
  const authToken = token || process.env.NEXT_PUBLIC_GRAPHQL_TOKEN || "";

  return fetch(backendUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...(authToken && { Authorization: `Bearer ${authToken}` }),
      ...options?.headers,
    },
    body: JSON.stringify({ query, variables }),
  })
    .then((response) => {
      if (response.status === 429) {
        window.location.href = "/RateLimiter";
        throw new Error("Rate limit reached");
      }
      if (!response.ok) {
        console.error(
          `Client GraphQL fetch failed with status: ${response.status}`
        );
        throw new Error(`GraphQL fetch failed with status: ${response.status}`);
      }
      return response.json();
    })
    .then((result: FetchGraphQLResponse<T>) => {
      if (result.errors) {
        console.error("Client GraphQL errors:", result.errors);
        if (result.errors[0].message === "Token is revoked") {
          window.location.href = "/TokenRevoked";
          throw new Error("Token is revoked");
        }

        // Handle token expired case
        if (result.errors[0].message === "Token Expired!") {
          console.error("Token has expired, redirecting to login");
          window.location.href = "/login?tokenExpired=true";
          throw new Error("Token expired");
        }

        throw new Error("Failed to fetch data: " + result.errors[0].message);
      }

      if (!result.data) {
        console.error("Client GraphQL response has no data property:", result);
        throw new Error("GraphQL response is missing data");
      }

      return result.data;
    })
    .catch((error) => {
      console.error("Error in clientFetchGraphQL:", error);
      throw error;
    });
}
