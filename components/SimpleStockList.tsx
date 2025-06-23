"use client";

import { useStocks } from "@/hooks/useStocks";
import { useEffect, useState } from "react";

interface SimpleStockListProps {
  type: string;
}

export function SimpleStockList({ type }: SimpleStockListProps) {
  const [data, setData] = useState<any[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [hasFetched, setHasFetched] = useState(false);

  // Always call hooks unconditionally
  const stocksHook = useStocks();

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      try {
        // Avoid multiple fetches
        if (hasFetched) return;

        if (!stocksHook?.hasToken) {
          console.log("No token available, waiting...");
          return;
        }

        console.log("Loading stocks for type:", type);
        setHasFetched(true);

        // Map the type parameter
        let typeToFilter = type;
        if (type === "opv") {
          typeToFilter = "action";
        }

        const result = await stocksHook.fetchStocks(typeToFilter);

        if (isMounted) {
          setData(result || []);
          setError(null);
          console.log("Stocks loaded:", result);
        }
      } catch (error) {
        console.error("Error loading stocks:", error);
        if (isMounted) {
          setError("Failed to load stocks");
          setHasFetched(false); // Allow retry
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [type, stocksHook?.hasToken, hasFetched]);

  // Early returns for loading states
  if (!stocksHook) {
    return <div>Initializing...</div>;
  }

  if (stocksHook.isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return (
      <div>
        Error: {error}
        <button
          onClick={() => setHasFetched(false)}
          style={{ marginLeft: "10px" }}
        >
          Retry
        </button>
      </div>
    );
  }

  if (!stocksHook.hasToken) {
    return <div>Waiting for authentication...</div>;
  }

  return (
    <div>
      <h2>Stocks for {type}</h2>
      <p>Found {data.length} stocks</p>
      {data.length === 0 ? (
        <p>No stocks found</p>
      ) : (
        <ul>
          {data.map((stock, index) => (
            <li key={stock.id || index}>
              {stock.issuer || stock.name || "Unknown"} -{" "}
              {stock.code || "No code"}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
