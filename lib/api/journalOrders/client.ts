import {
  ApiError,
  JournalOrdersFilter,
  JournalOrdersResponse,
} from "@/types/orders";

// Function to get the correct base URL based on environment
const getBaseUrl = () => {
  // For client-side requests (browser), check if we should use proxy to avoid CORS
  if (typeof window !== "undefined") {
    // If running in development, use the proxy
    if (process.env.NODE_ENV === "development") {
      return "/api/proxy";
    }
    // In production, use the direct URL but ensure CORS is handled
    const baseUrl =
      process.env.NEXT_PUBLIC_MENU_ORDER || "https://poc.finnetude.com";
    return `${baseUrl}/api/v1`;
  }

  // For server-side requests, use the direct backend URL
  const baseUrl =
    process.env.NEXT_PUBLIC_MENU_ORDER || "https://poc.finnetude.com";
  return `${baseUrl}/api/v1`;
};

const createJournalOrdersClient = (getToken: () => string | null) => {
  const makeRequest = async <T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> => {
    const baseUrl = getBaseUrl();
    const url = `${baseUrl}${endpoint}`;
    const token = getToken();

    console.log("Making API request:");
    console.log("- URL:", url);
    console.log("- Method:", options.method || "GET");
    console.log("- Environment:", process.env.NODE_ENV);
    console.log("- Has token:", !!token);

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    const requestConfig: RequestInit = {
      ...options,
      headers,
    };

    // Configure based on whether we're using proxy or direct connection
    if (url.startsWith("/api/proxy")) {
      // Using proxy - use same-origin credentials and no mode
      requestConfig.credentials = "same-origin";
      console.log("Using proxy configuration");
    } else {
      // Direct connection - use CORS mode
      requestConfig.mode = "cors";
      requestConfig.credentials = "include";
      console.log("Using direct connection configuration");
    }

    try {
      console.log("Sending request with config:", {
        url,
        method: requestConfig.method,
        mode: requestConfig.mode,
        credentials: requestConfig.credentials,
        headers: Object.fromEntries(
          new Headers(requestConfig.headers as HeadersInit)
        ),
      });

      const response = await fetch(url, requestConfig);

      console.log("Response received:", {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok,
        headers: Object.fromEntries(response.headers.entries()),
      });

      if (!response.ok) {
        let errorData: any;
        try {
          errorData = await response.json();
        } catch {
          errorData = { message: await response.text() };
        }

        console.error("API Error Response:", errorData);

        throw {
          message:
            errorData.message ||
            `HTTP ${response.status}: ${response.statusText}`,
          status: response.status,
          errors: errorData.errors,
        } as ApiError;
      }

      return response.json();
    } catch (error) {
      console.error("API Request Error:", error);

      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw {
          message:
            "Network error - Unable to connect to server. Please check if the server is running and CORS is properly configured.",
          status: 0,
        } as ApiError;
      }
      throw error;
    }
  };

  return {
    /**
     * Get all journal orders
     */
    getAllJournalOrders: (filters: JournalOrdersFilter = {}) => {
      const endpoint =
        typeof window !== "undefined" && process.env.NODE_ENV === "development"
          ? "/journal/orders/all"
          : "/journal/orders/all";

      return makeRequest<JournalOrdersResponse>(endpoint, {
        method: "POST",
        body: JSON.stringify(filters),
        headers: {
          "Content-Type": "application/json",
          ...(getToken() && { Authorization: `Bearer ${getToken()}` }),
        },
      });
    },
  };
};

export type JournalOrdersApiClient = ReturnType<
  typeof createJournalOrdersClient
>;
export default createJournalOrdersClient;
