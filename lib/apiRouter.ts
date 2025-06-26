/**
 * apiRouter.ts
 * -----------------------
 * API routing utility - REST API only
 * All GraphQL functionality has been removed in favor of REST API
 */

import { getServerSession } from "next-auth/next";
import auth from "@/auth";
import { Session } from "next-auth";

// All operations now use REST API only
export const API_ROUTING = {
  ACTORS: "REST",
  AUTH: "REST",
  TCC: "REST",
  IOB: "REST",
  AGENCE: "REST",
  CLIENT: "REST",
  FINANCIAL_INSTITUTION: "REST",
  ISSUER: "REST",
  DASHBOARD: "REST",
  ORDERS: "REST",
  PORTFOLIO: "REST",
  SECURITIES: "REST",
  REPORTS: "REST",
  USERS: "REST",
  STATS: "REST",
  MESSAGES: "REST",
} as const;

type APIType = "REST";

// Helper to determine which API to use (always REST now)
export function getAPIType(operation: keyof typeof API_ROUTING): APIType {
  return "REST";
}

// Helper to get the REST API base URL
export function getAPIBaseURL(): string {
  return (
    process.env.NEXT_PUBLIC_BACKEND_URL || "https://kh.finnetude.com/api/v1"
  );
}

// Helper to check if REST API is available
export async function isRESTAPIAvailable(): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/health`,
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

// Get user's login source (should always be REST now)
export async function getUserLoginSource(): Promise<"REST" | null> {
  try {
    const session = (await getServerSession(auth)) as Session & {
      user?: {
        loginSource?: "REST";
      };
    };

    return session?.user?.loginSource || "REST";
  } catch (error) {
    console.error("Error getting user login source:", error);
    return "REST";
  }
}

// Simple API selector that always returns REST
export async function selectAPI(operation: keyof typeof API_ROUTING): Promise<{
  type: APIType;
  baseURL: string;
  reason: string;
}> {
  const restAvailable = await isRESTAPIAvailable();

  if (restAvailable) {
    return {
      type: "REST",
      baseURL: getAPIBaseURL(),
      reason: "REST API available",
    };
  } else {
    throw new Error(`REST API is not available for operation: ${operation}`);
  }
}

// Utility to create full endpoint URL
export function createEndpointURL(baseURL: string, endpoint: string): string {
  return endpoint.startsWith("/")
    ? `${baseURL}${endpoint}`
    : `${baseURL}/${endpoint}`;
}

export default {
  API_ROUTING,
  getAPIType,
  getAPIBaseURL,
  isRESTAPIAvailable,
  getUserLoginSource,
  selectAPI,
  createEndpointURL,
};
