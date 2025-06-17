/**
 * actorAPI.ts
 * -----------------------
 * Specialized API functions for actor management using REST token
 * Used specifically in "gestion des acteurs" pages
 */

import { clientFetchREST } from "./fetchREST";
import { getServerSession } from "next-auth/next";
import auth from "@/auth";
import { Session } from "next-auth";

interface SessionUser {
  token?: string;
  restToken?: string;
  loginSource?: "REST" | "GraphQL";
}

// Get REST token from session (server-side)
async function getRestToken(): Promise<string | null> {
  try {
    const session = (await getServerSession(auth)) as Session & {
      user?: SessionUser;
    };
    return session?.user?.restToken || null;
  } catch (error) {
    console.error("Error getting REST token:", error);
    return null;
  }
}

// Client-side function to get REST token from session
function getClientRestToken(): string | null {
  if (typeof window !== "undefined") {
    // This will be handled by the useRestToken hook in components
    return null;
  }
  return null;
}

// Actor Management API functions specifically for "gestion des acteurs"
export const actorAPI = {
  // Financial Institution operations
  financialInstitution: {
    getAll: async (token?: string) => {
      const restToken = token || (await getRestToken());
      return clientFetchREST("/financial-institution", {
        method: "GET",
        token: restToken || undefined,
      });
    },

    create: async (data: any, token?: string) => {
      const restToken = token || (await getRestToken());
      return clientFetchREST("/financial-institution", {
        method: "POST",
        body: data,
        token: restToken || undefined,
      });
    },
  },

  // TCC operations
  tcc: {
    getAll: async (token?: string) => {
      const restToken = token || (await getRestToken());
      return clientFetchREST("/tcc", {
        method: "GET",
        token: restToken || undefined,
      });
    },

    create: async (data: any, token?: string) => {
      const restToken = token || (await getRestToken());
      return clientFetchREST("/tcc", {
        method: "PUT",
        body: data,
        token: restToken || undefined,
      });
    },

    createUser: async (userData: any, token?: string) => {
      const restToken = token || (await getRestToken());
      return clientFetchREST("/tcc/users", {
        method: "POST",
        body: userData,
        token: restToken || undefined,
      });
    },

    updateUser: async (userId: string, userData: any, token?: string) => {
      const restToken = token || (await getRestToken());
      return clientFetchREST(`/tcc/users/${userId}`, {
        method: "PUT",
        body: userData,
        token: restToken || undefined,
      });
    },

    updateUserRole: async (userId: string, roleData: any, token?: string) => {
      const restToken = token || (await getRestToken());
      return clientFetchREST(`/tcc/users/${userId}/role`, {
        method: "PUT",
        body: roleData,
        token: restToken || undefined,
      });
    },
  },

  // IOB operations
  iob: {
    getAll: async (token?: string) => {
      const restToken = token || (await getRestToken());
      return clientFetchREST("/iob", {
        method: "GET",
        token: restToken || undefined,
      });
    },

    getOne: async (iobId: string, token?: string) => {
      const restToken = token || (await getRestToken());
      return clientFetchREST(`/iob/${iobId}`, {
        method: "GET",
        token: restToken || undefined,
      });
    },

    create: async (data: any, token?: string) => {
      const restToken = token || (await getRestToken());
      return clientFetchREST("/iob", {
        method: "POST",
        body: data,
        token: restToken || undefined,
      });
    },

    update: async (iobId: string, data: any, token?: string) => {
      const restToken = token || (await getRestToken());
      return clientFetchREST(`/iob/${iobId}`, {
        method: "PUT",
        body: data,
        token: restToken || undefined,
      });
    },

    createUser: async (iobId: string, userData: any, token?: string) => {
      const restToken = token || (await getRestToken());
      return clientFetchREST(`/iob/${iobId}/users`, {
        method: "POST",
        body: userData,
        token: restToken || undefined,
      });
    },

    updateUser: async (
      iobId: string,
      userId: string,
      userData: any,
      token?: string
    ) => {
      const restToken = token || (await getRestToken());
      return clientFetchREST(`/iob/${iobId}/users/${userId}`, {
        method: "PUT",
        body: userData,
        token: restToken || undefined,
      });
    },

    updateUserRole: async (
      iobId: string,
      userId: string,
      roleData: any,
      token?: string
    ) => {
      const restToken = token || (await getRestToken());
      return clientFetchREST(`/iob/${iobId}/users/${userId}/role`, {
        method: "PUT",
        body: roleData,
        token: restToken || undefined,
      });
    },
  },

  // Agence operations
  agence: {
    getAll: async (token?: string) => {
      const restToken = token || (await getRestToken());
      return clientFetchREST("/agence", {
        method: "GET",
        token: restToken || undefined,
      });
    },

    getOne: async (agenceId: string, token?: string) => {
      const restToken = token || (await getRestToken());
      return clientFetchREST(`/agence/${agenceId}`, {
        method: "GET",
        token: restToken || undefined,
      });
    },

    create: async (data: any, token?: string) => {
      const restToken = token || (await getRestToken());
      return clientFetchREST("/agence", {
        method: "POST",
        body: data,
        token: restToken || undefined,
      });
    },

    update: async (agenceId: string, data: any, token?: string) => {
      const restToken = token || (await getRestToken());
      return clientFetchREST(`/agence/${agenceId}`, {
        method: "PUT",
        body: data,
        token: restToken || undefined,
      });
    },

    createUser: async (agenceId: string, userData: any, token?: string) => {
      const restToken = token || (await getRestToken());
      return clientFetchREST(`/agence/${agenceId}/users`, {
        method: "POST",
        body: userData,
        token: restToken || undefined,
      });
    },

    updateUser: async (
      agenceId: string,
      userId: string,
      userData: any,
      token?: string
    ) => {
      const restToken = token || (await getRestToken());
      return clientFetchREST(`/agence/${agenceId}/users/${userId}`, {
        method: "PUT",
        body: userData,
        token: restToken || undefined,
      });
    },

    updateUserRole: async (
      agenceId: string,
      userId: string,
      roleData: any,
      token?: string
    ) => {
      const restToken = token || (await getRestToken());
      return clientFetchREST(`/agence/${agenceId}/users/${userId}/role`, {
        method: "PUT",
        body: roleData,
        token: restToken || undefined,
      });
    },
  },

  // Client operations
  client: {
    create: async (data: any, token?: string) => {
      const restToken = token || (await getRestToken());
      return clientFetchREST("/client", {
        method: "POST",
        body: data,
        token: restToken || undefined,
      });
    },

    createUser: async (clientId: string, userData: any, token?: string) => {
      const restToken = token || (await getRestToken());
      return clientFetchREST(`/client/${clientId}/users`, {
        method: "POST",
        body: userData,
        token: restToken || undefined,
      });
    },

    updateUser: async (
      clientId: string,
      userId: string,
      userData: any,
      token?: string
    ) => {
      const restToken = token || (await getRestToken());
      return clientFetchREST(`/client/${clientId}/users/${userId}`, {
        method: "PUT",
        body: userData,
        token: restToken || undefined,
      });
    },

    updateUserRole: async (
      clientId: string,
      userId: string,
      roleData: any,
      token?: string
    ) => {
      const restToken = token || (await getRestToken());
      return clientFetchREST(`/client/${clientId}/users/${userId}/role`, {
        method: "PUT",
        body: roleData,
        token: restToken || undefined,
      });
    },
  },

  // Issuer operations
  issuer: {
    getAll: async (token?: string) => {
      const restToken = token || (await getRestToken());
      return clientFetchREST("/issuer", {
        method: "GET",
        token: restToken || undefined,
      });
    },

    create: async (data: any, token?: string) => {
      const restToken = token || (await getRestToken());
      return clientFetchREST("/issuer", {
        method: "POST",
        body: data,
        token: restToken || undefined,
      });
    },

    update: async (issuerId: string, data: any, token?: string) => {
      const restToken = token || (await getRestToken());
      return clientFetchREST(`/issuer/${issuerId}`, {
        method: "PUT",
        body: data,
        token: restToken || undefined,
      });
    },
  },
};

// Helper function to check if REST API is available
export async function checkRestAPIStatus(): Promise<boolean> {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_REST_API_URL}/health`
    );
    return response.ok;
  } catch (error) {
    console.log("REST API not available:", error);
    return false;
  }
}

export default actorAPI;
