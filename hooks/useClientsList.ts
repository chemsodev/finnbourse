import { useState, useEffect } from "react";
import { ClientService } from "@/lib/services/clientService";
import { useSession } from "next-auth/react";

export function useClientsList() {
  const [clients, setClients] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
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

  return { clients, loading, error };
}
