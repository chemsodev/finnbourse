/**
 * fetchREST.ts
 * -----------------------
 * REST API fetcher for backend
 * Handles authentication, actor management, and other REST endpoints
 * while keeping GraphQL functionality intact for dashboard
 */

// Client-side implementation only
// Server components should use their own session handling

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

// Get the base URL for API requests, using the proxy for client-side requests
function getBaseUrl(isClient = false) {
  // For client-side requests, use the local proxy to avoid CORS issues
  if (isClient && typeof window !== "undefined") {
    return "/api/v1";
  }

  // For server-side requests, use the environment variable or fallback to the direct URL
  // return "https://kh.finnetude.com/api/v1";
  return "http://192.168.0.113:3002/api/v1";
}

// Client-side only REST API fetcher
export async function fetchREST<T = any>(
  endpoint: string,
  options: FetchRESTOptions = {}
): Promise<T> {
  // We're redirecting all requests to clientFetchREST
  // to avoid server-side code execution in client components
  return clientFetchREST(endpoint, options);
}

// Client-side REST API fetcher (for client components)
export function clientFetchREST<T = any>(
  endpoint: string,
  options: FetchRESTOptions = {}
): Promise<T> {
  // Use the proxy URL for client-side requests to avoid CORS issues
  const baseUrl = getBaseUrl(true);

  // Try to get token from sessionStorage if not provided in options
  let token = options.token;
  if (!token && typeof window !== "undefined") {
    const storedToken = sessionStorage.getItem("finnbourse_rest_token");
    if (storedToken) {
      token = storedToken;
      console.log("Using stored REST token from sessionStorage");
    }
  }

  // Ensure endpoint starts with /
  const apiPath = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${baseUrl}${apiPath}`;

  const fetchOptions: RequestInit = {
    method: options.method || "GET",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    },
    // Add credentials to include cookies in the request
    credentials: "include",
  };

  // Debug log for API request
  console.log(`REST API Request: ${options.method || "GET"} ${url}`);

  if (token) {
    console.log(`Using REST token: ${token.substring(0, 20)}...`);
  } else {
    console.log(`REST API Request: No token provided`);
  }

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
    .then(async (response) => {
      // Check for authentication errors
      if (response.status === 401 || response.status === 403) {
        console.error(
          "Authentication failed - token may be invalid or expired"
        );

        // Before immediately redirecting, check if we're in a grace period
        if (typeof window !== "undefined") {
          // Check if we recently logged in (grace period)
          const recentLoginKey = "finnbourse_recent_login";
          const recentLoginTime = sessionStorage.getItem(recentLoginKey);
          const isRecentLogin =
            recentLoginTime && Date.now() - parseInt(recentLoginTime) < 30000; // 30 second grace period

          // Check session state
          const sessionState =
            sessionStorage.getItem("finnbourse_session_state") || "clean";
          const isInGracePeriod =
            isRecentLogin ||
            sessionState === "clean" ||
            sessionState === "logging_in";

          if (isInGracePeriod) {
            console.log(
              "⏳ 401/403 during grace period, allowing API call to fail gracefully without redirect"
            );
            // Still throw the error but don't redirect during grace period
            throw new Error(
              `Authentication failed: ${response.status} - Token not yet established (grace period)`
            );
          }

          // Only redirect if we're not in a grace period
          sessionStorage.removeItem("finnbourse_rest_token");
          sessionStorage.removeItem("finnbourse-menu");
          localStorage.removeItem("restToken");

          // Set error state to prevent cascade of redirects
          sessionStorage.setItem("finnbourse_session_state", "error");

          // Redirect to login page
          window.location.href = "/login";
        }

        throw new Error(
          `Authentication failed: ${response.status} - Token invalid or expired`
        );
      }

      if (!response.ok) {
        // Try to parse the error response body
        let errorData;
        try {
          errorData = await response.json();
        } catch {
          // If parsing fails, create a basic error object
          errorData = {
            message: `Request failed with status ${response.status}`,
          };
        }

        // Create an error object that preserves the response data
        const error = new Error(`REST API request failed: ${response.status}`);
        (error as any).response = {
          status: response.status,
          statusText: response.statusText,
          data: errorData,
        };
        throw error;
      }
      const text = await response.text();
      try {
        return text ? JSON.parse(text) : {};
      } catch (e) {
        return text;
      }
    })
    .then((result) => {
      return result;
    })
    .catch((error) => {
      console.error("Error in clientFetchREST:", error);

      // Handle network errors that might indicate token issues
      if (
        error.message.includes("Authentication failed") ||
        error.message.includes("401") ||
        error.message.includes("403")
      ) {
        // Token-related errors are already handled above
        throw error;
      }

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

  createUser: (userData: any, token?: string) =>
    fetchREST(`/tcc/users`, {
      method: "POST",
      body: userData,
      token,
    }),

  updateUser: (userId: string, userData: any, token?: string) =>
    fetchREST(`/tcc/users/${userId}`, {
      method: "PUT",
      body: userData,
      token,
    }),

  updateUserRole: (userId: string, roleData: any, token?: string) =>
    fetchREST(`/tcc/users/${userId}/role`, {
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
