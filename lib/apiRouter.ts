/**
 * apiRouter.ts
 * -----------------------
 * API routing utility to decide between REST and GraphQL backends
 * Helps components choose the correct API based on functionality
 */

import { getServerSession } from "next-auth/next";
import auth from "@/auth";
import { Session } from "next-auth";

// Define which operations should use which backend
export const API_ROUTING = {
  // Actor management operations use REST API
  ACTORS: "REST",
  AUTH: "REST",
  TCC: "REST",
  IOB: "REST",
  AGENCE: "REST",
  CLIENT: "REST",
  FINANCIAL_INSTITUTION: "REST",
  ISSUER: "REST",

  // Dashboard and existing operations use GraphQL
  DASHBOARD: "GraphQL",
  ORDERS: "GraphQL",
  PORTFOLIO: "GraphQL",
  SECURITIES: "GraphQL",
  REPORTS: "GraphQL",
  USERS: "GraphQL", // Legacy user operations
  STATS: "GraphQL",
  MESSAGES: "GraphQL",
} as const;

type APIType = (typeof API_ROUTING)[keyof typeof API_ROUTING];

// Helper to determine which API to use based on operation
export function getAPIType(operation: keyof typeof API_ROUTING): APIType {
  return API_ROUTING[operation];
}

// Helper to get the appropriate base URL
export function getAPIBaseURL(apiType: APIType): string {
  switch (apiType) {
    case "REST":
      return (
        process.env.NEXT_PUBLIC_REST_API_URL || "http://localhost:3000/api/v1"
      );
    case "GraphQL":
      return process.env.NEXT_PUBLIC_BACKEND_URL || "https://him.finnetude.com";
    default:
      throw new Error(`Unknown API type: ${apiType}`);
  }
}

// Helper to check if REST API is available
export async function isRESTAPIAvailable(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_REST_API_URL}/health`,
      {
        method: "GET",
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.log("REST API not available:", error);
    return false;
  }
}

// Helper to check if GraphQL API is available
export async function isGraphQLAPIAvailable(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/graphql`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: "{ __typename }", // Simple introspection query
        }),
        signal: controller.signal,
      }
    );

    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.log("GraphQL API not available:", error);
    return false;
  }
}

// Get user's login source to determine preferred API
export async function getUserLoginSource(): Promise<"REST" | "GraphQL" | null> {
  try {
    const session = (await getServerSession(auth)) as Session & {
      user?: {
        loginSource?: "REST" | "GraphQL";
      };
    };

    return session?.user?.loginSource || null;
  } catch (error) {
    console.error("Error getting user login source:", error);
    return null;
  }
}

// Intelligent API selector that considers user preference and availability
export async function selectAPI(operation: keyof typeof API_ROUTING): Promise<{
  type: APIType;
  baseURL: string;
  reason: string;
}> {
  const defaultAPI = getAPIType(operation);
  const userLoginSource = await getUserLoginSource();

  // For actor management, always prefer REST API if available
  if (
    operation === "ACTORS" ||
    operation === "AUTH" ||
    operation === "TCC" ||
    operation === "IOB" ||
    operation === "AGENCE" ||
    operation === "CLIENT" ||
    operation === "FINANCIAL_INSTITUTION" ||
    operation === "ISSUER"
  ) {
    const restAvailable = await isRESTAPIAvailable();
    if (restAvailable) {
      return {
        type: "REST",
        baseURL: getAPIBaseURL("REST"),
        reason: "REST API available for actor management",
      };
    } else {
      // Fallback to GraphQL if REST is not available
      return {
        type: "GraphQL",
        baseURL: getAPIBaseURL("GraphQL"),
        reason: "REST API unavailable, falling back to GraphQL",
      };
    }
  }

  // For dashboard operations, prefer GraphQL
  if (defaultAPI === "GraphQL") {
    const graphqlAvailable = await isGraphQLAPIAvailable();
    if (graphqlAvailable) {
      return {
        type: "GraphQL",
        baseURL: getAPIBaseURL("GraphQL"),
        reason: "GraphQL API available for dashboard operations",
      };
    } else {
      // Try REST as fallback if user logged in via REST
      if (userLoginSource === "REST") {
        const restAvailable = await isRESTAPIAvailable();
        if (restAvailable) {
          return {
            type: "REST",
            baseURL: getAPIBaseURL("REST"),
            reason: "GraphQL unavailable, user logged in via REST",
          };
        }
      }

      // No fallback available
      throw new Error(`Neither API is available for operation: ${operation}`);
    }
  }

  // Default case
  return {
    type: defaultAPI,
    baseURL: getAPIBaseURL(defaultAPI),
    reason: "Default API selection",
  };
}

// Utility to create full endpoint URL
export function createEndpointURL(
  baseURL: string,
  endpoint: string,
  apiType: APIType
): string {
  if (apiType === "GraphQL") {
    return `${baseURL}/graphql`;
  } else {
    return endpoint.startsWith("/")
      ? `${baseURL}${endpoint}`
      : `${baseURL}/${endpoint}`;
  }
}

export default {
  API_ROUTING,
  getAPIType,
  getAPIBaseURL,
  isRESTAPIAvailable,
  isGraphQLAPIAvailable,
  getUserLoginSource,
  selectAPI,
  createEndpointURL,
};
