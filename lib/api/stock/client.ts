import {
  ApiError,
  MoveToSecondaryData,
  Stock,
  StockFilter,
  StockPrice,
} from "@/types/gestionTitres";

const BASE_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://192.168.0.113:3002/api/v1";

const createApiClient = (getToken: () => string | null) => {
  const makeRequest = async <T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> => {
    const url = `${BASE_URL}${endpoint}`;
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
    // Get Stock by ID
    getStockById: (id: string) => makeRequest<Stock>(`/stock1/${id}`),

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
    createStockPrice: (priceData: StockPrice) =>
      makeRequest<StockPrice>("/stock/price", {
        method: "POST",
        body: JSON.stringify(priceData),
      }),
    // Move stock to secondary market
    moveToSecondary: (stockId: string, data: MoveToSecondaryData) =>
      makeRequest<Stock>(`/stock/${stockId}/move-to-secondary`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    // Get delisted stocks
    getDelistedStocks: () => makeRequest<Stock[]>("/stock/filter/delisted"),
    // Get primary closing stocks
    getPrimaryClosingStocks: () =>
      makeRequest<Stock[]>("/stock/primary-closing"),
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
