import { useState, useEffect } from "react";
import { stockService } from "@/lib/services/stockService";

type StockType = "action" | "obligation" | "sukuk" | "participatif";

export function useStocksREST(type: StockType) {
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

        // Check if result has a data property (API response format)
        const stocksData = result?.data || result;

        if (Array.isArray(stocksData)) {
          setStocks(stocksData);
          console.log(`Loaded ${stocksData.length} ${type} stocks`);
        } else {
          console.error("Unexpected API response format:", result);
          setError("Unexpected data format from API");
          setStocks([]);
        }
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

export function useStockREST(id: string, type: StockType) {
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

        // Check if result has a data property (API response format)
        const stockData = result?.data || result;

        if (stockData) {
          setStock(stockData);
          setError(null);
        } else {
          console.error("Unexpected API response format:", result);
          setError("Unexpected data format from API");
          setStock(null);
        }
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

export default { useStocksREST, useStockREST };
