import { useState, useEffect, useCallback } from "react";
import { useToast } from "@/hooks/use-toast";
import { actorAPI } from "@/app/actions/actorAPI";
import { useRestToken } from "@/hooks/useRestToken";
import { FinancialInstitution } from "@/types/gestionTitres";

const RETRY_DELAY_MS = 2000;
const CACHE_DURATION_MS = 30000;

export function useFinancialInstitution() {
  const [institutions, setInstitutions] = useState<FinancialInstitution[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [lastFetched, setLastFetched] = useState<number | null>(null);
  const [pagination, setPagination] = useState({
    page: 1,
    pageSize: 10,
    total: 0,
  });
  const { toast } = useToast();
  const { restToken } = useRestToken();

  const normalizeResponse = useCallback(
    (response: any): FinancialInstitution[] => {
      if (response?.data) return response.data;
      if (Array.isArray(response)) return response;
      if (response?.result) return response.result;
      return [];
    },
    []
  );

  const fetchInstitutions = useCallback(
    async (page = 1, pageSize = 10) => {
      if (lastFetched && Date.now() - lastFetched < CACHE_DURATION_MS) {
        return;
      }

      setIsLoading(true);
      try {
        const response = await actorAPI.financialInstitution.getAll(
          restToken || undefined
          //   page,
          //   pageSize
        );

        const institutionData = normalizeResponse(response);
        setInstitutions(institutionData);
        setPagination((prev) => ({
          ...prev,
          total: response.total || institutionData.length,
        }));
        setLastFetched(Date.now());
        return institutionData;
      } catch (error) {
        console.error("Error fetching institutions:", error);
        toast({
          title: "Error",
          description: "Failed to fetch financial institutions",
          variant: "destructive",
        });
        return [];
      } finally {
        setIsLoading(false);
      }
    },
    [restToken, toast, normalizeResponse, lastFetched]
  );

  // Initial fetch and token change handler
  useEffect(() => {
    fetchInstitutions();
  }, [fetchInstitutions, restToken]);

  // Retry logic
  useEffect(() => {
    if (!isLoading && institutions.length === 0) {
      const timeout = setTimeout(fetchInstitutions, RETRY_DELAY_MS);
      return () => clearTimeout(timeout);
    }
  }, [isLoading, institutions.length, fetchInstitutions]);

  return {
    institutions,
    isLoading,
    pagination,
    fetchInstitutions,
    refresh: () => {
      setLastFetched(null);
      return fetchInstitutions();
    },
  };
}
