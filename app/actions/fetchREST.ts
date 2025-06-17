/**
 * fetchREST.ts
 * -----------------------
 * REST API fetcher for localhost:3000 backend
 * Handles authentication, actor management, and other REST endpoints
 * while keeping GraphQL functionality intact for dashboard
 */

import { getServerSession } from "next-auth/next";
import auth from "@/auth";
import { Session } from "next-auth";

interface FetchRESTOptions {
  method?: "GET" | "POST" | "PUT" | "DELETE" | "PATCH";
  headers?: Record<string, string>;
  body?: any;
  token?: string;
}

interface RESTResponse<T = any> {
  data?: T;
  message?: string;
  error?: string;
  success?: boolean;
}

// Server-side REST API fetcher (for server components)
export async function fetchREST<T = any>(
  endpoint: string,
  options: FetchRESTOptions = {}
): Promise<T> {
  const session = (await getServerSession(auth)) as Session & {
    user?: {
      token?: string;
      restToken?: string;
    };
  };

  if (!process.env.NEXT_PUBLIC_REST_API_URL) {
    console.error(
      "REST API URL is not defined. Please check your environment variables."
    );
    throw new Error(
      "REST API URL is not configured. Check your environment variables."
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_REST_API_URL;
  const url = endpoint.startsWith("/")
    ? `${baseUrl}${endpoint}`
    : `${baseUrl}/${endpoint}`;

  try {
    // Use REST token if available, otherwise fall back to main token
    const authToken =
      session?.user?.restToken || session?.user?.token || options.token || "";

    const fetchOptions: RequestInit = {
      method: options.method || "GET",
      headers: {
        "Content-Type": "application/json",
        ...(authToken && { Authorization: `Bearer ${authToken}` }),
        ...options.headers,
      },
    };

    if (
      options.body &&
      (options.method === "POST" ||
        options.method === "PUT" ||
        options.method === "PATCH")
    ) {
      fetchOptions.body =
        typeof options.body === "string"
          ? options.body
          : JSON.stringify(options.body);
    }

    console.log(`Making REST API request to: ${url}`);
    const response = await fetch(url, fetchOptions);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `REST API request failed with status: ${response.status}`,
        errorText
      );
      throw new Error(
        `REST API request failed: ${response.status} - ${errorText}`
      );
    }

    const result = await response.json();
    return result;
  } catch (error) {
    console.error("Error in fetchREST:", error);
    throw error;
  }
}

// Client-side REST API fetcher (for client components)
export function clientFetchREST<T = any>(
  endpoint: string,
  options: FetchRESTOptions = {}
): Promise<T> {
  const baseUrl = process.env.NEXT_PUBLIC_REST_API_URL;

  if (!baseUrl) {
    throw new Error("REST API URL is not configured");
  }

  const url = endpoint.startsWith("/")
    ? `${baseUrl}${endpoint}`
    : `${baseUrl}/${endpoint}`;

  const fetchOptions: RequestInit = {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(options.token && { Authorization: `Bearer ${options.token}` }),
      ...options.headers,
    },
  };

  if (
    options.body &&
    (options.method === "POST" ||
      options.method === "PUT" ||
      options.method === "PATCH")
  ) {
    fetchOptions.body =
      typeof options.body === "string"
        ? options.body
        : JSON.stringify(options.body);
  }

  return fetch(url, fetchOptions)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`REST API request failed: ${response.status}`);
      }
      return response.json();
    })
    .then((result) => {
      return result;
    })
    .catch((error) => {
      console.error("Error in clientFetchREST:", error);
      throw error;
    });
}

// Specific API functions for common operations

// Auth API functions
export const authAPI = {
  login: (credentials: { username: string; password: string; otp?: string }) =>
    clientFetchREST("/auth/login", {
      method: "POST",
      body: credentials,
    }),

  register: (userData: { username: string; email: string; password: string }) =>
    clientFetchREST("/auth/register", {
      method: "POST",
      body: userData,
    }),

  twoFactorAuth: (data: { username: string; password: string; otp: string }) =>
    clientFetchREST("/auth/twofactorauth", {
      method: "POST",
      body: data,
    }),
};

// TCC API functions
export const tccAPI = {
  create: (tccData: any, token?: string) =>
    fetchREST("/tcc", {
      method: "PUT",
      body: tccData,
      token,
    }),

  getAll: (token?: string) => fetchREST("/tcc", { token }),

  createUser: (tccId: string, userData: any, token?: string) =>
    fetchREST(`/tcc/${tccId}/users`, {
      method: "POST",
      body: userData,
      token,
    }),

  updateUser: (tccId: string, userId: string, userData: any, token?: string) =>
    fetchREST(`/tcc/${tccId}/users/${userId}`, {
      method: "PUT",
      body: userData,
      token,
    }),

  updateUserRole: (
    tccId: string,
    userId: string,
    roleData: any,
    token?: string
  ) =>
    fetchREST(`/tcc/${tccId}/users/${userId}/role`, {
      method: "PUT",
      body: roleData,
      token,
    }),
};

// IOB API functions
export const iobAPI = {
  create: (iobData: any, token?: string) =>
    fetchREST("/iob", {
      method: "POST",
      body: iobData,
      token,
    }),

  update: (iobId: string, iobData: any, token?: string) =>
    fetchREST(`/iob/${iobId}`, {
      method: "PUT",
      body: iobData,
      token,
    }),

  getAll: (token?: string) => fetchREST("/iob", { token }),

  getOne: (iobId: string, token?: string) =>
    fetchREST(`/iob/${iobId}`, { token }),

  createUser: (iobId: string, userData: any, token?: string) =>
    fetchREST(`/iob/${iobId}/users`, {
      method: "POST",
      body: userData,
      token,
    }),

  updateUser: (iobId: string, userId: string, userData: any, token?: string) =>
    fetchREST(`/iob/${iobId}/users/${userId}`, {
      method: "PUT",
      body: userData,
      token,
    }),

  updateUserRole: (
    iobId: string,
    userId: string,
    roleData: any,
    token?: string
  ) =>
    fetchREST(`/iob/${iobId}/users/${userId}/role`, {
      method: "PUT",
      body: roleData,
      token,
    }),
};

// Agence API functions
export const agenceAPI = {
  create: (agenceData: any, token?: string) =>
    fetchREST("/agence", {
      method: "POST",
      body: agenceData,
      token,
    }),

  update: (agenceId: string, agenceData: any, token?: string) =>
    fetchREST(`/agence/${agenceId}`, {
      method: "PUT",
      body: agenceData,
      token,
    }),

  getAll: (token?: string) => fetchREST("/agence", { token }),

  getOne: (agenceId: string, token?: string) =>
    fetchREST(`/agence/${agenceId}`, { token }),

  createUser: (agenceId: string, userData: any, token?: string) =>
    fetchREST(`/agence/${agenceId}/users`, {
      method: "POST",
      body: userData,
      token,
    }),

  updateUser: (
    agenceId: string,
    userId: string,
    userData: any,
    token?: string
  ) =>
    fetchREST(`/agence/${agenceId}/users/${userId}`, {
      method: "PUT",
      body: userData,
      token,
    }),

  updateUserRole: (
    agenceId: string,
    userId: string,
    roleData: any,
    token?: string
  ) =>
    fetchREST(`/agence/${agenceId}/users/${userId}/role`, {
      method: "PUT",
      body: roleData,
      token,
    }),
};

// Client API functions
export const clientAPI = {
  create: (clientData: any, token?: string) =>
    fetchREST("/client", {
      method: "POST",
      body: clientData,
      token,
    }),

  createUser: (clientId: string, userData: any, token?: string) =>
    fetchREST(`/client/${clientId}/users`, {
      method: "POST",
      body: userData,
      token,
    }),

  updateUser: (
    clientId: string,
    userId: string,
    userData: any,
    token?: string
  ) =>
    fetchREST(`/client/${clientId}/users/${userId}`, {
      method: "PUT",
      body: userData,
      token,
    }),

  updateUserRole: (
    clientId: string,
    userId: string,
    roleData: any,
    token?: string
  ) =>
    fetchREST(`/client/${clientId}/users/${userId}/role`, {
      method: "PUT",
      body: roleData,
      token,
    }),
};

// Financial Institution API functions
export const financialInstitutionAPI = {
  create: (institutionData: any, token?: string) =>
    fetchREST("/financial-institution", {
      method: "POST",
      body: institutionData,
      token,
    }),

  getAll: (token?: string) => fetchREST("/financial-institution", { token }),
};

// Issuer API functions
export const issuerAPI = {
  create: (issuerData: any, token?: string) =>
    fetchREST("/issuer", {
      method: "POST",
      body: issuerData,
      token,
    }),

  update: (issuerId: string, issuerData: any, token?: string) =>
    fetchREST(`/issuer/${issuerId}`, {
      method: "PUT",
      body: issuerData,
      token,
    }),

  getAll: (token?: string) => fetchREST("/issuer", { token }),
};
