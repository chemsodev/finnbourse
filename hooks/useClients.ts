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
  const [agencyId, setAgencyId] = useState<string | null>(null);
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

  // Function to set the agency ID for direct fetching
  const setAgency = (id: string) => {
    setAgencyId(id);
  };

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

      let data = [];

      // If we have a specific agency ID, try to get clients from the agency endpoint
      if (agencyId) {
        try {
          console.log(
            `Fetching clients from agency endpoint for ID: ${agencyId}`
          );
          const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${restToken}`,
          };

          // Use the direct endpoint as shown in the example
          const frontendUrl =
            process.env.NEXTAUTH_URL || "http://localhost:3001";
          const response = await fetch(
            `${frontendUrl}/api/v1/agence/${agencyId}`,
            { headers }
          );

          if (response.ok) {
            const agencyData = await response.json();
            if (agencyData.clients && Array.isArray(agencyData.clients)) {
              console.log(
                "Successfully fetched clients from agency data:",
                agencyData.clients.length
              );
              data = agencyData.clients;
            }
          } else {
            console.error(
              "Failed to fetch from agency endpoint:",
              response.status
            );
            // Fall back to the standard client API
            const fallbackResponse = await actorAPI.client.getAll(
              restToken || undefined
            );
            data = fallbackResponse.data || fallbackResponse || [];
          }
        } catch (error) {
          console.error("Error fetching from agency endpoint:", error);
          // Fall back to the standard client API
          const fallbackResponse = await actorAPI.client.getAll(
            restToken || undefined
          );
          data = fallbackResponse.data || fallbackResponse || [];
        }
      } else {
        // Use the standard client API if no agency ID is specified
        const response = await actorAPI.client.getAll(restToken || undefined);
        data = response.data || response || [];
      }

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
      // Use ClientService to get client by id and handle mapping
      return await ClientService.getOne(clientId, restToken || undefined);
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

  const createClient = async (clientData: any) => {
    if (!hasRestToken) {
      toast({
        title: "Error",
        description: "No authentication token available",
        variant: "destructive",
      });
      return null;
    }

    try {
      // Use ClientService to create client and handle data transformation
      const result = await ClientService.createOrUpdate(
        clientData,
        undefined,
        restToken || undefined
      );
      await fetchClients(); // Refresh the clients list
      return result;
    } catch (error) {
      console.error("Failed to create client:", error);
      toast({
        title: "Error",
        description: "Failed to create client",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateClient = async (clientId: string, clientData: any) => {
    if (!hasRestToken) {
      toast({
        title: "Error",
        description: "No authentication token available",
        variant: "destructive",
      });
      return null;
    }

    try {
      // Use ClientService to update client and handle data transformation
      const result = await ClientService.createOrUpdate(
        clientData,
        clientId,
        restToken || undefined
      );
      await fetchClients(); // Refresh the clients list
      return result;
    } catch (error) {
      console.error("Failed to update client:", error);
      toast({
        title: "Error",
        description: "Failed to update client",
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
    createClient,
    updateClient,
    hasToken: hasRestToken,
    setAgency, // Export the function to set agency ID
  };
}

export default useClients;
