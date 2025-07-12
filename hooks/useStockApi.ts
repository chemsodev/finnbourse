import { useMemo } from "react";
import { useRestToken } from "@/hooks/useRestToken";
import createApiClient, { StockApiClient } from "@/lib/api/stock/client";

export const useStockApi = (): StockApiClient => {
  const { restToken } = useRestToken();

  return useMemo(() => createApiClient(() => restToken), [restToken]);
};
