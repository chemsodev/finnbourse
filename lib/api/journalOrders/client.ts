import {
  ApiError,
  JournalOrdersFilter,
  JournalOrdersResponse,
} from "@/types/orders";

// Function to get the correct base URL based on environment
const getBaseUrl = () => {
  // For client-side requests (browser), use the proxy to avoid CORS
  // if (typeof window !== "undefined") {
  //   return "/api/v1";
  // }
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
    const url = `${baseUrl}${endpoint}`;
    console.log("Request URL:", url);
    const token = getToken();
    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
      ...options.headers,
    };

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        // Add credentials for proxy requests

        // credentials: typeof window !== "undefined" ? "include" : "omit",
        mode: "cors",
        credentials: "include",
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

      return response.json();
    } catch (error) {
      if (error instanceof TypeError) {
        throw { message: "Network error", status: 0 } as ApiError;
      }
      throw error;
    }
  };

  return {
    /**
     * Get all journal orders
     */
    // getAllJournalOrders: () =>
    //   makeRequest<JournalOrdersResponse>("/journal/orders/all"),

    getAllJournalOrders: (filters: JournalOrdersFilter = {}) =>
      makeRequest<JournalOrdersResponse>("/journal/orders/all", {
        method: "POST",
        body: JSON.stringify(filters),
        headers: {
          "Content-Type": "application/json",
          ...(getToken() && { Authorization: `Bearer ${getToken()}` }),
        },
      }),
  };
};

export type JournalOrdersApiClient = ReturnType<
  typeof createJournalOrdersClient
>;
export default createJournalOrdersClient;
