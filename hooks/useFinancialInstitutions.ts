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
  const [isLoading, setIsLoading] = useState(true); // Start as loading
  const { toast } = useToast();
  const { restToken } = useRestToken();

  const fetchInstitutions = async () => {
    setIsLoading(true);
    try {
      console.log("🏦 Fetching financial institutions...");
      console.log(
        "🏦 Using restToken:",
        restToken ? "Token available" : "No token"
      );
      const response: any = await actorAPI.financialInstitution.getAll(
        restToken || undefined
      );
      console.log("🏦 Financial institutions response:", response);
      console.log("🏦 Response type:", typeof response);
      console.log("🏦 Response keys:", Object.keys(response || {}));

      // Handle different response formats
      let institutionData = [];
      if (response.data && Array.isArray(response.data)) {
        institutionData = response.data;
      } else if (Array.isArray(response)) {
        institutionData = response;
      } else if (response.result && Array.isArray(response.result)) {
        institutionData = response.result;
      }

      setInstitutions(institutionData);
      console.log("🏦 Financial institutions set:", institutionData);
      return institutionData;
    } catch (error) {
      console.error("❌ Error fetching financial institutions:", error);
      console.error("❌ Error details:", {
        message: (error as any)?.message,
        status: (error as any)?.status,
        stack: (error as any)?.stack,
      });
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
    // Always try to fetch, even if restToken is not available yet
    console.log(
      "🏦 useFinancialInstitutions useEffect triggered, restToken:",
      restToken
    );
    fetchInstitutions();
  }, [restToken]); // Only depend on restToken changes

  // Also fetch immediately when hook is first used
  useEffect(() => {
    console.log(
      "🏦 useFinancialInstitutions hook initialized, fetching institutions..."
    );
    fetchInstitutions();
  }, []); // Run once on mount

  // Try to fetch again after a short delay if we still have no institutions
  useEffect(() => {
    if (!isLoading && institutions.length === 0) {
      console.log("🏦 No institutions found, retrying in 2 seconds...");
      const timeout = setTimeout(() => {
        console.log("🏦 Retrying fetch financial institutions...");
        fetchInstitutions();
      }, 2000);

      return () => clearTimeout(timeout);
    }
  }, [isLoading, institutions.length]);

  return {
    institutions,
    isLoading,
    fetchInstitutions,
  };
}
