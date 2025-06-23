/**
 * useClients Hook
 * Custom hook for client operations with REST token integration
 */

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { actorAPI } from "@/app/actions/actorAPI";
import { useRestToken } from "@/hooks/useRestToken";
import { ClientService } from "@/lib/services/clientService";
import { Client } from "@/lib/types/actors";
import { useSession } from "next-auth/react";

export function useClients() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const { restToken, hasRestToken, isLoading: tokenLoading } = useRestToken();
  const { data: session } = useSession();

  useEffect(() => {
    const fetchClients = async () => {
      try {
        setLoading(true);
        const clientsData = await ClientService.getAll();
        setClients(clientsData);
        setError(null);
      } catch (err) {
        console.error("Error fetching clients:", err);
        setError("Failed to load clients");
      } finally {
        setLoading(false);
      }
    };

    if (session) {
      fetchClients();
    }
  }, [session]);

  const fetchClients = async () => {
    // Wait for token to be available
    if (tokenLoading) {
      console.log("⏳ Waiting for REST token...");
      return [];
    }

    if (!hasRestToken) {
      console.log("⚠️ No REST token available, skipping clients fetch");
      return [];
    }

    setLoading(true);
    try {
      console.log(
        "🔄 Fetching clients with token:",
        restToken?.substring(0, 20) + "..."
      );
      const response = await actorAPI.client.getAll(restToken || undefined);
      const data = response.data || response || [];

      console.log("✅ Clients fetched successfully:", data);
      setClients(data);
      return data;
    } catch (error) {
      console.error("Failed to fetch clients:", error);
      toast({
        title: "Error",
        description: "Failed to fetch clients data",
        variant: "destructive",
      });
      setClients([]);
      throw error;
    } finally {
      setLoading(false);
    }
  };
  const deleteClient = async (clientId: string) => {
    // Delete functionality removed per user request
    toast({
      title: "Info",
      description: "Delete functionality has been disabled",
      variant: "default",
    });
  };

  const getClientById = async (clientId: string) => {
    if (!hasRestToken) {
      toast({
        title: "Error",
        description: "No authentication token available",
        variant: "destructive",
      });
      return null;
    }

    try {
      const response = await actorAPI.client.getOne(
        clientId,
        restToken || undefined
      );
      return response.data || response;
    } catch (error) {
      console.error("Failed to fetch client:", error);
      toast({
        title: "Error",
        description: "Failed to fetch client details",
        variant: "destructive",
      });
      throw error;
    }
  };

  return {
    clients,
    loading: loading || tokenLoading,
    error,
    fetchClients,
    deleteClient,
    getClientById,
    hasToken: hasRestToken,
  };
}

export default useClients;
