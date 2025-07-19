import {
  ApiError,
  MoveToSecondaryData,
  SecondaryMarketResponse,
  Stock,
  StockFilter,
  StockPrices,
} from "@/types/gestionTitres";

// Function to get the correct base URL based on environment
const getBaseUrl = () => {
  // For client-side requests (browser), use the proxy to avoid CORS
  if (typeof window !== "undefined") {
    return "/api/v1";
  }
  // For server-side requests, use the direct backend URL and add /api/v1
  const baseUrl =
    process.env.NEXT_PUBLIC_BACKEND_URL || "https://kh.finnetude.com";
  return `${baseUrl}/api/v1`;
};

const createApiClient = (getToken: () => string | null) => {
  const makeRequest = async <T>(
    endpoint: string,
    options: RequestInit = {},
    retryCount = 0
  ): Promise<T> => {
    const baseUrl = getBaseUrl();
    const url = `${baseUrl}${endpoint}`;
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
        credentials: typeof window !== "undefined" ? "include" : "omit",
      });

      // Handle 401 Unauthorized - token might be expired
      if (response.status === 401 && retryCount === 0) {
        console.warn("🔄 Token expired, attempting to refresh...");

        // Clear potentially expired token from storage
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("finnbourse_rest_token");
        }

        // Try to refresh token
        try {
          const refreshResponse = await fetch("/api/auth/rest-token", {
            method: "GET",
            credentials: "include",
          });

          if (refreshResponse.ok) {
            const refreshData = await refreshResponse.json();
            if (refreshData.restToken) {
              // Store new token
              if (typeof window !== "undefined") {
                sessionStorage.setItem(
                  "finnbourse_rest_token",
                  refreshData.restToken
                );
              }

              // Retry the original request with new token
              console.log("🔄 Retrying request with refreshed token...");
              return makeRequest<T>(endpoint, options, retryCount + 1);
            }
          }
        } catch (refreshError) {
          console.error("❌ Token refresh failed:", refreshError);
        }
      }

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
    // Get Stock by ID
    getStockById: (id: string) => makeRequest<Stock>(`/stock/${id}`),

    // Create all type of stock
    createStock: (stockData: Omit<Stock, "id">) =>
      makeRequest<Stock>("/stock", {
        method: "POST",
        body: JSON.stringify(stockData),
      }),

    // Filter stocks by type and market
    filterStocks: (filter: StockFilter) =>
      makeRequest<Stock[]>("/stock/filter", {
        method: "POST",
        body: JSON.stringify(filter),
      }),

    // Create stock price
    createStockPrice: (priceData: StockPrices) =>
      makeRequest<StockPrices>("/stock/price", {
        method: "POST",
        body: JSON.stringify(priceData),
      }),
    // Move stock to secondary market
    moveToSecondary: (stockId: string, data: MoveToSecondaryData) =>
      makeRequest<Stock>(`/stock/${stockId}/move-to-secondary`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),

    // Update IOB market Secondary
    updateIobMarketSecondary: (stockId: string, data: MoveToSecondaryData) =>
      makeRequest<Stock>(`/stock/${stockId}/UpdateMarketSecondary`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),

    // Get delisted stocks
    getDelistedStocks: () => makeRequest<Stock[]>("/stock/filter/delisted"),
    // Get primary closing stocks
    getPrimaryClosingStocks: () =>
      makeRequest<SecondaryMarketResponse>("/stock/primary-closing").then(
        (response) => response.data || []
      ),
    // Activate stock
    activateStock: (stockId: string) =>
      makeRequest<Stock>(`/stock/${stockId}/activate`, { method: "PUT" }),
    // Suspend stock
    suspendStock: (stockId: string) =>
      makeRequest<Stock>(`/stock/${stockId}/suspend`, { method: "PUT" }),
  };
};

export type StockApiClient = ReturnType<typeof createApiClient>;
export default createApiClient;
