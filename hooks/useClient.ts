/**
 * Client Hooks
 * Custom hooks for Client operations with React Query integration
 */

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { ClientService } from "@/lib/services/clientService";
import { Client, ClientCreateRequest } from "@/lib/types/actors";
import { useRestToken } from "@/hooks/useRestToken";

export function useClient() {
  const [isLoading, setIsLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const { toast } = useToast();
  const { restToken } = useRestToken();

  const fetchClients = async () => {
    setIsLoading(true);
    try {
      const data = await ClientService.getAll(restToken || undefined);
      setClients(data);
      return data;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch Client data",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const createOrUpdateClient = async (
    data: ClientCreateRequest,
    id?: string
  ) => {
    setIsLoading(true);
    try {
      const result = await ClientService.createOrUpdate(
        data,
        id,
        restToken || undefined
      );
      await fetchClients(); // Refresh the list
      toast({
        title: "Success",
        description: id
          ? "Client updated successfully"
          : "Client created successfully",
      });
      return result;
    } catch (error) {
      toast({
        title: "Error",
        description: id ? "Failed to update Client" : "Failed to create Client",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteClient = async (id: string) => {
    setIsLoading(true);
    try {
      await ClientService.delete(id, restToken || undefined);
      await fetchClients(); // Refresh the list
      toast({
        title: "Success",
        description: "Client deleted successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete Client",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getClient = async (id: string) => {
    try {
      return await ClientService.getOne(id, restToken || undefined);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch Client details",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    clients,
    isLoading,
    fetchClients,
    createOrUpdateClient,
    deleteClient,
    getClient,
  };
}
