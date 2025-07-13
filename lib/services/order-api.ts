import { clientFetchREST } from "@/app/actions/fetchREST";
import { Order } from "@/lib/interfaces";

/**
 * Service for handling order-related API calls
 */
export class OrderApiService {
  /**
   * Fetch a specific order by ID
   * @param orderId The ID of the order to fetch
   * @param token Optional auth token
   * @returns The order details
   */
  static async getOrderById(
    orderId: string | number,
    token?: string
  ): Promise<Order> {
    console.log(`Fetching order with ID: ${orderId}`);

    try {
      const response = await clientFetchREST(`/order/fetch/${orderId}`, {
        method: "GET",
        token: token || undefined,
      });

      console.log("Order fetch response:", response);

      // If the API returns a data property, use that, otherwise use the whole response
      const orderData = response.data || response;

      // Transform the API response to match our Order interface if needed
      return this.transformApiResponseToOrder(orderData);
    } catch (error) {
      console.error("Error fetching order details:", error);
      throw error;
    }
  }

  /**
   * Get a list of orders with optional filters
   * @param params Optional parameters for filtering orders
   * @param token Optional auth token
   * @returns A list of orders
   */
  static async getOrders(
    params?: {
      marketType?: string;
      taskID?: string;
      page?: number;
      limit?: number;
    },
    token?: string
  ): Promise<Order[]> {
    try {
      const response = await clientFetchREST("/order/list", {
        method: "POST",
        body: params,
        token: token || undefined,
      });

      // If the API returns a data property, use that, otherwise use the whole response
      const ordersData = response.data || response;

      // Transform each order in the response
      if (Array.isArray(ordersData)) {
        return ordersData.map((order) =>
          this.transformApiResponseToOrder(order)
        );
      }

      return [];
    } catch (error) {
      console.error("Error fetching orders:", error);
      throw error;
    }
  }

  /**
   * Set an action on an order (approve, reject, etc.)
   * @param params Action parameters
   * @param token Optional auth token
   * @returns The result of the action
   */
  static async setOrderAction(
    params: {
      orderID: string;
      taskID: string;
      action: string;
      motif?: string;
    },
    token?: string
  ): Promise<any> {
    try {
      const response = await clientFetchREST("/order/set-action", {
        method: "POST",
        body: params,
        token: token || undefined,
      });

      return response.data || response;
    } catch (error) {
      console.error("Error setting order action:", error);
      throw error;
    }
  }

  /**
   * Submit order execution results
   * @param params Result parameters
   * @param token Optional auth token
   * @returns The result of the submission
   */
  static async submitOrderResult(
    params: {
      orderID: number | string;
      taskID: string;
      action: string;
      quantity?: number;
      price?: number;
    },
    token?: string
  ): Promise<any> {
    try {
      const response = await clientFetchREST("/order/submit-order-result", {
        method: "POST",
        body: params,
        token: token || undefined,
      });

      return response.data || response;
    } catch (error) {
      console.error("Error submitting order result:", error);
      throw error;
    }
  }

  /**
   * Transform the API response to match our Order interface
   * @param apiResponse The raw API response
   * @returns A formatted Order object
   */
  private static transformApiResponseToOrder(apiResponse: any): Order {
    // Map API response fields to our Order interface
    // Adjust this mapping based on the actual API response structure
    return {
      id: apiResponse.id || apiResponse.orderID || "",
      securityissuer: apiResponse.securityissuer || apiResponse.issuer || "",
      securitytype: apiResponse.securitytype || apiResponse.type || "",
      securityid: apiResponse.securityid || apiResponse.securityID || "",
      securityquantity:
        apiResponse.securityquantity || apiResponse.totalQuantity || 0,
      quantity: apiResponse.quantity || 0,
      orderdate:
        apiResponse.orderdate ||
        apiResponse.createdAt ||
        new Date().toISOString(),
      orderstatus: apiResponse.orderstatus || apiResponse.status || 0,
      investorid: apiResponse.investorid || apiResponse.clientID || "",
      negotiatorid: apiResponse.negotiatorid || apiResponse.negotiatorID || "",
      validity: apiResponse.validity || "",
      duration: apiResponse.duration || 0,
      createdat:
        apiResponse.createdat ||
        apiResponse.createdAt ||
        new Date().toISOString(),
      payedWithCard: apiResponse.payedWithCard || false,

      // Common fields
      visaCosob: apiResponse.visaCosob || apiResponse.visa_cosob || "",
      isinCode: apiResponse.isinCode || apiResponse.isin_code || "",
      emissionDate:
        apiResponse.emissionDate ||
        apiResponse.emission_date ||
        new Date().toISOString(),

      // Souscription specific fields
      bdl: apiResponse.bdl || "",
      totalShares: apiResponse.totalShares || apiResponse.total_shares || 0,
      commission: apiResponse.commission || "0",
      netAmount: apiResponse.netAmount || apiResponse.net_amount || "0",

      // Ordre specific fields
      mst: apiResponse.mst || "",
      orderdirection: apiResponse.orderdirection || apiResponse.direction || 1,
      priceInstruction:
        apiResponse.priceInstruction || apiResponse.price_instruction || "",
      timeInstruction:
        apiResponse.timeInstruction || apiResponse.time_instruction || "",
      validityDate: apiResponse.validityDate || apiResponse.validity_date || "",
      grossAmount: apiResponse.grossAmount || apiResponse.gross_amount || "0",
    };
  }
}
