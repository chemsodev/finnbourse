/**
 * actorAPI.ts
 * -----------------------
 * Specialized API functions for actor management using REST token
 * Used specifically in "gestion des acteurs" pages
 */

import { clientFetchREST } from "./fetchREST";

interface SessionUser {
  token?: string;
  restToken?: string;
  loginSource?: "REST" | "GraphQL";
}

// Get REST token - client-side only version
async function getRestToken(): Promise<string | null> {
  // We're in a browser context, return null and let component provide token
  if (typeof window !== "undefined") {
    return null;
  }

  // In server component, we'd get the session but we'll avoid that for now
  // to prevent the "headers called outside request scope" error
  return null;
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
      try {
        const restToken = token || (await getRestToken());
        return clientFetchREST("/financial-institution", {
          method: "GET",
          token: restToken || undefined,
        });
      } catch (error) {
        console.error("Error in financialInstitution.getAll:", error);
        // Try using the local proxy API as a fallback
        const headers: HeadersInit = {
          "Content-Type": "application/json",
        };

        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(`/api/financial-institution`, { headers });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch Financial Institutions: ${response.status}`
          );
        }

        return await response.json();
      }
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

      // Remove tccId from the request body if it exists (no longer needed for API)
      if (userData.tccId) {
        const { tccId: _, ...userDataWithoutTccId } = userData;
        userData = userDataWithoutTccId;
      }

      console.log(`Creating TCC user:`, userData);

      // Always use the standard endpoint
      return clientFetchREST("/tcc/users", {
        method: "POST",
        body: userData,
        token: restToken || undefined,
      });
    },

    getUsers: async (token?: string) => {
      const restToken = token || (await getRestToken());
      return clientFetchREST("/tcc/users", {
        method: "GET",
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
      try {
        const restToken = token || (await getRestToken());
        return clientFetchREST("/iob", {
          method: "GET",
          token: restToken || undefined,
        });
      } catch (error) {
        console.error("Error in iob.getAll:", error);
        // Try using the local proxy API as a fallback
        const headers: HeadersInit = {
          "Content-Type": "application/json",
        };

        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(`/api/iob`, { headers });

        if (!response.ok) {
          throw new Error(`Failed to fetch IOBs: ${response.status}`);
        }

        return await response.json();
      }
    },

    getOne: async (iobId: string, token?: string) => {
      try {
        const restToken = token || (await getRestToken());
        return clientFetchREST(`/iob/${iobId}`, {
          method: "GET",
          token: restToken || undefined,
        });
      } catch (error) {
        console.error("Error in iob.getOne:", error);
        // Try using the local proxy API as a fallback
        const headers: HeadersInit = {
          "Content-Type": "application/json",
        };

        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(`/api/iob/${iobId}`, { headers });

        if (!response.ok) {
          throw new Error(`Failed to fetch IOB: ${response.status}`);
        }

        return await response.json();
      }
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

    getUsers: async (iobId: string, token?: string) => {
      const restToken = token || (await getRestToken());
      return clientFetchREST(`/iob/${iobId}/users`, {
        method: "GET",
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

    deleteUser: async (iobId: string, userId: string, token?: string) => {
      const restToken = token || (await getRestToken());
      return clientFetchREST(`/iob/${iobId}/users/${userId}`, {
        method: "DELETE",
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
      try {
        const restToken = token || (await getRestToken());
        return clientFetchREST("/agence", {
          method: "GET",
          token: restToken || undefined,
        });
      } catch (error) {
        console.error("Error in agence.getAll:", error);
        // Try using the local proxy API as a fallback
        const headers: HeadersInit = {
          "Content-Type": "application/json",
        };

        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(`/api/agence`, { headers });

        if (!response.ok) {
          throw new Error(`Failed to fetch Agences: ${response.status}`);
        }

        return await response.json();
      }
    },

    getOne: async (agenceId: string, token?: string) => {
      try {
        const restToken = token || (await getRestToken());
        return clientFetchREST(`/agence/${agenceId}`, {
          method: "GET",
          token: restToken || undefined,
        });
      } catch (error) {
        console.error("Error in agence.getOne:", error);
        // Try using the local proxy API as a fallback
        const headers: HeadersInit = {
          "Content-Type": "application/json",
        };

        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(`/api/agence/${agenceId}`, { headers });

        if (!response.ok) {
          throw new Error(`Failed to fetch Agence: ${response.status}`);
        }

        return await response.json();
      }
    },

    create: async (data: any, token?: string) => {
      try {
        const restToken = token || (await getRestToken());
        return clientFetchREST("/agence", {
          method: "POST",
          body: data,
          token: restToken || undefined,
        });
      } catch (error) {
        console.error("Error in agence.create:", error);
        // Try using the local proxy API as a fallback
        const headers: HeadersInit = {
          "Content-Type": "application/json",
        };

        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(`/api/agence`, {
          method: "POST",
          headers,
          body: JSON.stringify(data),
        });

        if (!response.ok) {
          throw new Error(`Failed to create Agence: ${response.status}`);
        }

        return await response.json();
      }
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

    getUsers: async (agenceId: string, token?: string) => {
      const restToken = token || (await getRestToken());
      return clientFetchREST(`/agence/${agenceId}/users`, {
        method: "GET",
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
    getAll: async (token?: string) => {
      const restToken = token || (await getRestToken());
      return clientFetchREST("/client", {
        method: "GET",
        token: restToken || undefined,
      });
    },

    getOne: async (clientId: string, token?: string) => {
      const restToken = token || (await getRestToken());
      return clientFetchREST(`/client/${clientId}`, {
        method: "GET",
        token: restToken || undefined,
      });
    },

    create: async (data: any, token?: string) => {
      const restToken = token || (await getRestToken());
      return clientFetchREST("/client", {
        method: "POST",
        body: data,
        token: restToken || undefined,
      });
    },

    update: async (clientId: string, data: any, token?: string) => {
      const restToken = token || (await getRestToken());
      return clientFetchREST(`/client/${clientId}`, {
        method: "PUT",
        body: data,
        token: restToken || undefined,
      });
    },

    delete: async (clientId: string, token?: string) => {
      const restToken = token || (await getRestToken());
      return clientFetchREST(`/client/${clientId}`, {
        method: "DELETE",
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
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/health`
    );
    return response.ok;
  } catch (error) {
    console.log("REST API not available:", error);
    return false;
  }
}

export default actorAPI;
