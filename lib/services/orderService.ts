/**
 * orderService.ts
 * -----------------------
 * Service to handle order management API calls
 * Uses REST token for authentication
 */

import { Session } from "next-auth";

// Use environment variables with fallbacks
const BACKEND_API =
  (process.env.NEXT_PUBLIC_MENU_ORDER || "https://poc.finnetude.com") +
  "/api/v1";
const LOCAL_API =
  process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3000/api/v1";

export interface OrderElement {
  quantity: number;
  price: number;
  id: number;
  time_condition: string;
  quantitative_condition: string;
  stock_id: string;
  market_type: string;
  client_id: string;
  status: string;
}

export interface OrderResponse {
  error: null | string;
  data: {
    elements: OrderElement[];
    actions: string[];
  };
}

/**
 * Fetch orders based on task type
 * @param token REST token for authentication
 * @param taskID Task ID to filter orders (premiere-validation, validation-finale, etc.)
 * @param marketType Market type filter (P for primary, S for secondary)
 * @returns Promise with order data
 */
export async function fetchOrders(
  token: string,
  taskID: string,
  marketType: string = "S"
): Promise<OrderResponse> {
  try {
    console.log("Fetching orders with params:", { taskID, marketType });

    const response = await fetch(`${BACKEND_API}/order/list`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        marketType,
        taskID,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Order fetch failed with status: ${response.status}`,
        errorText
      );
      return {
        error: `API Error: ${response.status}`,
        data: { elements: [], actions: [] },
      };
    }

    const responseData = await response.json();
    console.log("Order API raw response:", responseData);

    // Handle the response structure properly
    if (responseData && responseData.data && responseData.data.elements) {
      return responseData; // Already in the expected format
    } else if (responseData && responseData.elements) {
      // Response is missing the data wrapper
      return {
        error: null,
        data: responseData,
      };
    } else {
      console.error("Unexpected API response structure:", responseData);
      // Try to extract data from the response in whatever format it's in
      const elements =
        responseData?.elements ||
        responseData?.data?.elements ||
        responseData?.orders ||
        responseData?.data?.orders ||
        [];

      const actions =
        responseData?.actions || responseData?.data?.actions || [];

      return {
        error: null,
        data: {
          elements: Array.isArray(elements) ? elements : [],
          actions: Array.isArray(actions) ? actions : [],
        },
      };
    }
  } catch (error) {
    console.error("Error fetching orders:", error);
    return {
      error: error instanceof Error ? error.message : "Unknown error",
      data: { elements: [], actions: [] },
    };
  }
}

/**
 * Process an order action (validate, reject, cancel)
 * @param token REST token for authentication
 * @param orderId Order ID to process
 * @param action Action to perform (validate, reject, cancel)
 * @returns Promise with action result
 */
export async function processOrderAction(
  token: string,
  orderId: number,
  action: string
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`${BACKEND_API}/order/${action}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        orderID: orderId,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Order action failed with status: ${response.status}`,
        errorText
      );
      return {
        success: false,
        message: `Failed to ${action} order: ${response.status}`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      message: `Order ${action} successful`,
    };
  } catch (error) {
    console.error(`Error during order ${action}:`, error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Process an order action with reason
 * @param token REST token for authentication
 * @param orderId Order ID to process
 * @param taskID Task ID (premiere-validation, validation-finale, etc.)
 * @param action Action to perform (validate, reject, cancel)
 * @param motif Reason for the action
 * @returns Promise with action result
 */
export async function processOrderActionWithReason(
  token: string,
  orderId: number,
  taskID: string,
  action: string,
  motif: string
): Promise<{ success: boolean; message: string }> {
  try {
    const response = await fetch(`${BACKEND_API}/order/set-action`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        orderID: orderId.toString(),
        taskID,
        action,
        motif,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        `Order action failed with status: ${response.status}`,
        errorText
      );
      return {
        success: false,
        message: `Failed to ${action} order: ${response.status}`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      message: `Order ${action} successful`,
    };
  } catch (error) {
    console.error(`Error during order ${action}:`, error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    };
  }
}

/**
 * Fetch stock details by ID
 * @param token REST token for authentication
 * @param stockId Stock ID to fetch
 * @returns Promise with stock details
 */
export async function fetchStockDetails(
  token: string,
  stockId: string
): Promise<any> {
  try {
    const response = await fetch(`${LOCAL_API}/stock/${stockId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching stock ${stockId}:`, error);
    throw error;
  }
}

/**
 * Fetch client details by ID
 * @param token REST token for authentication
 * @param clientId Client ID to fetch
 * @returns Promise with client details
 */
export async function fetchClientDetails(
  token: string,
  clientId: string
): Promise<any> {
  try {
    const response = await fetch(`${LOCAL_API}/client/${clientId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching client ${clientId}:`, error);
    throw error;
  }
}

export default {
  fetchOrders,
  processOrderAction,
  processOrderActionWithReason,
  fetchStockDetails,
  fetchClientDetails,
};
