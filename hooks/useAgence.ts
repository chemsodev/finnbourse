/**
 * Agence Hooks
 * Custom hooks for Agence operations with React Query integration
 */

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { AgenceService } from "@/lib/services/agenceService";
import { Agence, AgenceCreateRequest } from "@/lib/types/actors";
import { useRestToken } from "@/hooks/useRestToken";

export function useAgence() {
  const [isLoading, setIsLoading] = useState(false);
  const [agences, setAgences] = useState<Agence[]>([]);
  const { toast } = useToast();
  const { restToken } = useRestToken();

  const fetchAgences = async () => {
    setIsLoading(true);
    try {
      const data = await AgenceService.getAll(restToken || undefined);
      setAgences(data);
      return data;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch Agence data",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const createOrUpdateAgence = async (
    data: AgenceCreateRequest,
    id?: string
  ) => {
    setIsLoading(true);
    try {
      const result = await AgenceService.createOrUpdate(
        data,
        id,
        restToken || undefined
      );
      await fetchAgences(); // Refresh the list
      toast({
        title: "Success",
        description: id
          ? "Agence updated successfully"
          : "Agence created successfully",
      });
      return result;
    } catch (error) {
      toast({
        title: "Error",
        description: id ? "Failed to update Agence" : "Failed to create Agence",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteAgence = async (id: string) => {
    setIsLoading(true);
    try {
      await AgenceService.delete(id, restToken || undefined);
      await fetchAgences(); // Refresh the list
      toast({
        title: "Success",
        description: "Agence deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete Agence",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getAgence = async (id: string) => {
    try {
      return await AgenceService.getOne(id, restToken || undefined);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch Agence details",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    agences,
    isLoading,
    fetchAgences,
    createOrUpdateAgence,
    deleteAgence,
    getAgence,
  };
}
