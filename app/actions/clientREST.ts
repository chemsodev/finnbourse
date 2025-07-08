/**
 * clientREST.ts
 * -----------------------
 * Client-side REST API actions for components
 * Provides easy-to-use functions for client components
 */

import { clientFetchREST } from "./fetchREST";

// Re-export the client fetch function
export { clientFetchREST };

// Helper function to get token from session storage or other client-side storage
function getClientToken(): string | undefined {
  if (typeof window !== "undefined") {
    // You can implement your own token storage logic here
    // For now, returning undefined as NextAuth handles tokens automatically
    return undefined;
  }
  return undefined;
}

// Client-side API helpers with automatic token handling
export const clientAPI = {
  // Auth endpoints
  auth: {
    login: (credentials: {
      username: string;
      password: string;
      otp?: string;
    }) =>
      clientFetchREST("/auth/login", {
        method: "POST",
        body: credentials,
      }),

    register: (userData: {
      username: string;
      email: string;
      password: string;
    }) =>
      clientFetchREST("/auth/register", {
        method: "POST",
        body: userData,
      }),

    twoFactorAuth: (data: {
      username: string;
      password: string;
      otp: string;
    }) =>
      clientFetchREST("/auth/twofactorauth", {
        method: "POST",
        body: data,
      }),
  },

  // TCC endpoints
  tcc: {
    getAll: () => clientFetchREST("/tcc", { token: getClientToken() }),

    create: (tccData: any) =>
      clientFetchREST("/tcc", {
        method: "PUT",
        body: tccData,
        token: getClientToken(),
      }),

    createUser: (userData: any) =>
      clientFetchREST("/tcc/users", {
        method: "POST",
        body: userData,
        token: getClientToken(),
      }),

    updateUser: (userId: string, userData: any) =>
      clientFetchREST(`/tcc/users/${userId}`, {
        method: "PUT",
        body: userData,
        token: getClientToken(),
      }),

    updateUserRole: (userId: string, roleData: any) =>
      clientFetchREST(`/tcc/users/${userId}/role`, {
        method: "PUT",
        body: roleData,
        token: getClientToken(),
      }),
  },

  // IOB endpoints
  iob: {
    getAll: () => clientFetchREST("/iob", { token: getClientToken() }),

    getOne: (iobId: string) =>
      clientFetchREST(`/iob/${iobId}`, { token: getClientToken() }),

    create: (iobData: any) =>
      clientFetchREST("/iob", {
        method: "POST",
        body: iobData,
        token: getClientToken(),
      }),

    update: (iobId: string, iobData: any) =>
      clientFetchREST(`/iob/${iobId}`, {
        method: "PUT",
        body: iobData,
        token: getClientToken(),
      }),

    createUser: (iobId: string, userData: any) =>
      clientFetchREST(`/iob/${iobId}/users`, {
        method: "POST",
        body: userData,
        token: getClientToken(),
      }),

    updateUser: (iobId: string, userId: string, userData: any) =>
      clientFetchREST(`/iob/${iobId}/users/${userId}`, {
        method: "PUT",
        body: userData,
        token: getClientToken(),
      }),

    updateUserRole: (iobId: string, userId: string, roleData: any) =>
      clientFetchREST(`/iob/${iobId}/users/${userId}/role`, {
        method: "PUT",
        body: roleData,
        token: getClientToken(),
      }),
  },

  // Agence endpoints
  agence: {
    getAll: () => clientFetchREST("/agence", { token: getClientToken() }),

    getOne: (agenceId: string) =>
      clientFetchREST(`/agence/${agenceId}`, { token: getClientToken() }),

    create: (agenceData: any) =>
      clientFetchREST("/agence", {
        method: "POST",
        body: agenceData,
        token: getClientToken(),
      }),

    update: (agenceId: string, agenceData: any) =>
      clientFetchREST(`/agence/${agenceId}`, {
        method: "PUT",
        body: agenceData,
        token: getClientToken(),
      }),

    createUser: (agenceId: string, userData: any) =>
      clientFetchREST(`/agence/${agenceId}/users`, {
        method: "POST",
        body: userData,
        token: getClientToken(),
      }),

    updateUser: (agenceId: string, userId: string, userData: any) =>
      clientFetchREST(`/agence/${agenceId}/users/${userId}`, {
        method: "PUT",
        body: userData,
        token: getClientToken(),
      }),

    updateUserRole: (agenceId: string, userId: string, roleData: any) =>
      clientFetchREST(`/agence/${agenceId}/users/${userId}/role`, {
        method: "PUT",
        body: roleData,
        token: getClientToken(),
      }),
  },

  // Client endpoints
  client: {
    getAll: (token?: string) =>
      clientFetchREST("/client", {
        token: token || getClientToken(),
      }),

    getOne: (clientId: string, token?: string) =>
      clientFetchREST(`/client/${clientId}`, {
        token: token || getClientToken(),
      }),

    create: (clientData: any, token?: string) =>
      clientFetchREST("/client", {
        method: "POST",
        body: clientData,
        token: token || getClientToken(),
      }),

    update: (clientId: string, clientData: any, token?: string) =>
      clientFetchREST(`/client/${clientId}`, {
        method: "POST", // Backend uses POST for updates
        body: clientData,
        token: token || getClientToken(),
      }),

    createUser: (clientId: string, userData: any) =>
      clientFetchREST(`/client/${clientId}/users`, {
        method: "POST",
        body: userData,
        token: getClientToken(),
      }),

    updateUser: (clientId: string, userId: string, userData: any) =>
      clientFetchREST(`/client/${clientId}/users/${userId}`, {
        method: "PUT",
        body: userData,
        token: getClientToken(),
      }),

    updateUserRole: (clientId: string, userId: string, roleData: any) =>
      clientFetchREST(`/client/${clientId}/users/${userId}/role`, {
        method: "PUT",
        body: roleData,
        token: getClientToken(),
      }),
  },

  // Financial Institution endpoints
  financialInstitution: {
    getAll: () =>
      clientFetchREST("/financial-institution", { token: getClientToken() }),

    create: (institutionData: any) =>
      clientFetchREST("/financial-institution", {
        method: "POST",
        body: institutionData,
        token: getClientToken(),
      }),
  },

  // Issuer endpoints
  issuer: {
    getAll: () => clientFetchREST("/issuer", { token: getClientToken() }),

    create: (issuerData: any) =>
      clientFetchREST("/issuer", {
        method: "POST",
        body: issuerData,
        token: getClientToken(),
      }),

    update: (issuerId: string, issuerData: any) =>
      clientFetchREST(`/issuer/${issuerId}`, {
        method: "PUT",
        body: issuerData,
        token: getClientToken(),
      }),
  },
};

// Utility function to handle API errors consistently
export function handleAPIError(error: any): string {
  if (error?.response?.data?.message) {
    return error.response.data.message;
  }
  if (error?.message) {
    return error.message;
  }
  return "An unexpected error occurred";
}

// Utility function to check if response was successful
export function isAPISuccess(response: any): boolean {
  return response && (response.success === true || response.data !== undefined);
}
