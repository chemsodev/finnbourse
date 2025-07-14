import {
  ApiError,
  JournalOrdersFilter,
  JournalOrdersResponse,
} from "@/types/orders";

// Function to get the correct base URL based on environment
const getBaseUrl = () => {
  // For client-side requests (browser), use the proxy to avoid CORS
  if (typeof window !== "undefined") {
    return "/api/proxy";
  }
  // For server-side requests, use the direct backend URL and add /api/v1
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
    // Ensure endpoint starts with slash
    const formattedEndpoint = endpoint.startsWith("/")
      ? endpoint
      : `/${endpoint}`;
    const url = `${baseUrl}${formattedEndpoint}`;
    const token = getToken();

    console.log("Making API request:");
    console.log("- URL:", url);
    console.log("- Method:", options.method || "GET");
    console.log("- Environment:", process.env.NODE_ENV);
    console.log("- Has token:", !!token);

    // Log request body if present
    if (options.body) {
      console.log("- Request body:", options.body);
    }

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    try {
      console.log("Sending request with config:", {
        url,
        method: options.method || "GET",
        headers: Object.fromEntries(new Headers(headers)),
      });

      // For POST requests, ensure mode is cors and proper credentials
      const fetchOptions: RequestInit = {
        ...options,
        headers,
        mode: "cors",
        // Add credentials for proxy requests
        credentials: typeof window !== "undefined" ? "include" : "omit",
      };

      console.log("Fetch options:", {
        ...fetchOptions,
        headers: Object.fromEntries(
          new Headers(fetchOptions.headers || {}).entries()
        ),
      });

      const response = await fetch(url, fetchOptions);

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
          message: errorData.message || "API request failed",
          status: response.status,
          errors: errorData.errors,
        } as ApiError;
      }

      return response.json();
    } catch (error) {
      console.error("API Request Error:", error);

      if (error instanceof TypeError) {
        console.error("Network error details:", {
          error,
          message: error.message,
          endpoint,
          baseUrl,
        });
        throw {
          message: `Network error: ${error.message}`,
          status: 0,
          details: `Failed connecting to ${baseUrl}${endpoint}`,
        } as ApiError;
      }
      throw error;
    }
  };

  return {
    /**
     * Get all journal orders
     */
    getAllJournalOrders: async (filters: JournalOrdersFilter = {}) => {
      // Ensure market_type is included as required by the API
      const requestBody = {
        market_type: filters.market_type || "P",
        ...filters,
      };

      console.log("Journal orders request body:", requestBody);

      // Handle browser environment differently due to redirect issues
      if (typeof window !== "undefined") {
        // In browser, make a direct request to avoid proxy redirect issues
        try {
          const baseUrl =
            process.env.NEXT_PUBLIC_MENU_ORDER || "https://poc.finnetude.com";
          const url = `${baseUrl}/api/v1/journal/orders/all`;
          const token = getToken();

          console.log("Making direct API request to:", url);

          const response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
              ...(token && { Authorization: `Bearer ${token}` }),
            },
            credentials: "include",
            body: JSON.stringify(requestBody),
          });

          if (!response.ok) {
            let errorData: any;
            try {
              errorData = await response.json();
            } catch {
              errorData = { message: await response.text() };
            }

            throw {
              message: errorData.message || "API request failed",
              status: response.status,
              errors: errorData.errors,
            } as ApiError;
          }

          return await response.json();
        } catch (error) {
          console.error("Direct API Request Error:", error);
          throw error;
        }
      } else {
        // On server side, use the makeRequest function
        return makeRequest<JournalOrdersResponse>("/journal/orders/all", {
          method: "POST",
          body: JSON.stringify(requestBody),
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });
      }
    },
  };
};

export type JournalOrdersApiClient = ReturnType<
  typeof createJournalOrdersClient
>;
export default createJournalOrdersClient;
