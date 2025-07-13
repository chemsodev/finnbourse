import { useState, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRestToken } from "@/hooks/useRestToken";
import { OrderApiService } from "@/lib/services/order-api";
import { Order } from "@/lib/interfaces";

export interface UseOrderApiReturn {
  // Order operations
  getOrderById: (orderId: string | number) => Promise<Order>;
  getOrders: (params?: {
    marketType?: string;
    taskID?: string;
    page?: number;
    limit?: number;
  }) => Promise<Order[]>;
  setOrderAction: (params: {
    orderID: string;
    taskID: string;
    action: string;
    motif?: string;
  }) => Promise<any>;
  submitOrderResult: (params: {
    orderID: number | string;
    taskID: string;
    action: string;
    quantity?: number;
    price?: number;
  }) => Promise<any>;

  // Loading states
  isLoading: boolean;
  isFetching: boolean;
  isSubmitting: boolean;

  // Error handling
  error: string | null;
  clearError: () => void;
}

export const useOrderApi = (): UseOrderApiReturn => {
  const { toast } = useToast();
  const { restToken } = useRestToken();

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use REST token
  const token = restToken || undefined;

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleError = useCallback(
    (error: any, operation: string) => {
      console.error(`Error in ${operation}:`, error);
      const errorMessage = error?.message || `Failed to ${operation}`;
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
    [toast]
  );

  const getOrderById = useCallback(
    async (orderId: string | number) => {
      setIsFetching(true);
      setError(null);

      try {
        const result = await OrderApiService.getOrderById(orderId, token);
        return result;
      } catch (error) {
        handleError(error, "get order details");
        throw error;
      } finally {
        setIsFetching(false);
      }
    },
    [token, handleError]
  );

  const getOrders = useCallback(
    async (params?: {
      marketType?: string;
      taskID?: string;
      page?: number;
      limit?: number;
    }) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await OrderApiService.getOrders(params, token);
        return result;
      } catch (error) {
        handleError(error, "get orders");
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [token, handleError]
  );

  const setOrderAction = useCallback(
    async (params: {
      orderID: string;
      taskID: string;
      action: string;
      motif?: string;
    }) => {
      setIsSubmitting(true);
      setError(null);

      try {
        const result = await OrderApiService.setOrderAction(params, token);

        toast({
          title: "Success",
          description: "Order action set successfully",
        });

        return result;
      } catch (error) {
        handleError(error, "set order action");
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    [token, toast, handleError]
  );

  const submitOrderResult = useCallback(
    async (params: {
      orderID: number | string;
      taskID: string;
      action: string;
      quantity?: number;
      price?: number;
    }) => {
      setIsSubmitting(true);
      setError(null);

      try {
        const result = await OrderApiService.submitOrderResult(params, token);

        toast({
          title: "Success",
          description: "Order result submitted successfully",
        });

        return result;
      } catch (error) {
        handleError(error, "submit order result");
        throw error;
      } finally {
        setIsSubmitting(false);
      }
    },
    [token, toast, handleError]
  );

  return {
    getOrderById,
    getOrders,
    setOrderAction,
    submitOrderResult,
    isLoading,
    isFetching,
    isSubmitting,
    error,
    clearError,
  };
};
