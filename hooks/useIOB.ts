/**
 * IOB Hooks
 * Custom hooks for IOB operations with React Query integration
 */

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { IOBService } from "@/lib/services/iobService";
import { IOB, IOBCreateRequest } from "@/lib/types/actors";
import { useRestToken } from "@/hooks/useRestToken";

export function useIOB() {
  const [isLoading, setIsLoading] = useState(false);
  const [iobs, setIOBs] = useState<IOB[]>([]);
  const { toast } = useToast();
  const { restToken } = useRestToken();

  const fetchIOBs = async () => {
    setIsLoading(true);
    try {
      const data = await IOBService.getAll(restToken || undefined);
      setIOBs(data);
      return data;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch IOB data",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const createOrUpdateIOB = async (data: IOBCreateRequest, id?: string) => {
    setIsLoading(true);
    try {
      const result = await IOBService.createOrUpdate(
        data,
        id,
        restToken || undefined
      );
      await fetchIOBs(); // Refresh the list
      toast({
        title: "Success",
        description: id
          ? "IOB updated successfully"
          : "IOB created successfully",
      });
      return result;
    } catch (error) {
      toast({
        title: "Error",
        description: id ? "Failed to update IOB" : "Failed to create IOB",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteIOB = async (id: string) => {
    setIsLoading(true);
    try {
      await IOBService.delete(id, restToken || undefined);
      await fetchIOBs(); // Refresh the list
      toast({
        title: "Success",
        description: "IOB deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete IOB",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getIOB = async (id: string) => {
    try {
      return await IOBService.getOne(id, restToken || undefined);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch IOB details",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    iobs,
    isLoading,
    fetchIOBs,
    createOrUpdateIOB,
    deleteIOB,
    getIOB,
  };
}
