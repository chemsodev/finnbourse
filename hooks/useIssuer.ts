import { useState, useEffect } from "react";
import { IssuerService } from "@/lib/services/issuerService";

export function useIssuer() {
  const [isLoading, setIsLoading] = useState(false);
  const [issuers, setIssuers] = useState<any[]>([]);

  const fetchIssuers = async () => {
    setIsLoading(true);
    try {
      const data = await IssuerService.getAll();
      setIssuers(data);
      return data;
    } catch (error) {
      // Optionnel : gestion d'erreur (toast, etc.)
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchIssuers();
  }, []);

  return {
    issuers,
    isLoading,
    fetchIssuers,
  };
}
