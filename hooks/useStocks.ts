/**
 * useStocks Hook
 * Custom hook for stock operations with REST token integration
 */

import { useState, useCallback, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import {
  stockAPI,
  stockTypeAPI,
  stockPriceAPI,
  Stock,
  stockService,
} from "@/lib/services/stockService";
import { useRestToken } from "@/hooks/useRestToken";

type StockType = "action" | "obligation" | "sukuk" | "participatif";

export function useStocks(type: StockType) {
  const [stocks, setStocks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStocks = async () => {
      setLoading(true);
      try {
        let result;

        switch (type) {
          case "action":
            result = await stockService.action.getAll();
            break;
          case "obligation":
            result = await stockService.obligation.getAll();
            break;
          case "sukuk":
            result = await stockService.sukuk.getAll();
            break;
          case "participatif":
            result = await stockService.participatif.getAll();
            break;
          default:
            throw new Error("Invalid stock type");
        }

        setStocks(result);
        setError(null);
      } catch (err) {
        console.error("Error fetching stocks:", err);
        setError("Failed to fetch stocks");
        setStocks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();
  }, [type]);

  return { stocks, loading, error };
}

export function useStock(id: string, type: StockType) {
  const [stock, setStock] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStock = async () => {
      if (!id) return;

      setLoading(true);
      try {
        let result;

        switch (type) {
          case "action":
            result = await stockService.action.getById(id);
            break;
          case "obligation":
            result = await stockService.obligation.getById(id);
            break;
          case "sukuk":
            result = await stockService.sukuk.getById(id);
            break;
          case "participatif":
            result = await stockService.participatif.getById(id);
            break;
          default:
            throw new Error("Invalid stock type");
        }

        setStock(result);
        setError(null);
      } catch (err) {
        console.error(`Error fetching ${type} with id ${id}:`, err);
        setError(`Failed to fetch ${type} details`);
        setStock(null);
      } finally {
        setLoading(false);
      }
    };

    fetchStock();
  }, [id, type]);

  return { stock, loading, error };
}

export default useStocks;
