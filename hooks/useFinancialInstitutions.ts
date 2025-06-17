/**
 * Financial Institution Hooks
 * Custom hooks for financial institution operations
 */

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { actorAPI } from "@/app/actions/actorAPI";
import { useRestToken } from "@/hooks/useRestToken";

export interface FinancialInstitution {
  id: string;
  institutionName: string;
  taxIdentificationNumber: string;
  agreementNumber: string;
  legalForm: string;
  establishmentDate: string;
  fullAddress: string;
}

export interface FinancialInstitutionResponse {
  data: FinancialInstitution[];
  total: number;
}

export function useFinancialInstitutions() {
  const [institutions, setInstitutions] = useState<FinancialInstitution[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { restToken } = useRestToken();

  const fetchInstitutions = async () => {
    setIsLoading(true);
    try {
      const response: FinancialInstitutionResponse =
        await actorAPI.financialInstitution.getAll(restToken || undefined);
      setInstitutions(response.data || []);
      return response.data || [];
    } catch (error) {
      console.error("Error fetching financial institutions:", error);
      toast({
        title: "Error",
        description: "Failed to fetch financial institutions",
        variant: "destructive",
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (restToken) {
      fetchInstitutions();
    }
  }, [restToken]);

  return {
    institutions,
    isLoading,
    fetchInstitutions,
  };
}
