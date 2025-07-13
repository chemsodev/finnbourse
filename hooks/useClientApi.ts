import { useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { useRestToken } from "@/hooks/useRestToken";
import {
  ClientApiService,
  ClientTransformationService,
  ClientFormValues,
  ClientUserFormValues,
} from "@/lib/services/client-api";

export interface UseClientApiReturn {
  // Client operations
  createClient: (formData: ClientFormValues) => Promise<any>;
  updateClient: (id: string, formData: ClientFormValues) => Promise<any>;
  getClient: (id: string) => Promise<any>;
  getAllClients: (params?: {
    page?: number;
    limit?: number;
    search?: string;
    type?: string;
  }) => Promise<any>;

  // Client user operations
  createClientUser: (
    clientId: string,
    formData: ClientUserFormValues
  ) => Promise<any>;
  updateClientUser: (
    clientId: string,
    userId: string,
    formData: ClientUserFormValues
  ) => Promise<any>;
  getClientUsers: (clientId: string) => Promise<any>;

  // Utility functions
  transformFormToBackend: (formData: ClientFormValues) => any;
  transformBackendToForm: (backendData: any) => ClientFormValues;

  // Loading states
  isCreating: boolean;
  isUpdating: boolean;
  isLoading: boolean;

  // Error handling
  error: string | null;
  clearError: () => void;
}

export const useClientApi = (): UseClientApiReturn => {
  const { toast } = useToast();
  const { data: session } = useSession();
  const { restToken } = useRestToken();

  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Use REST token instead of session token
  const token = restToken || undefined;

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const handleError = useCallback(
    (error: any, operation: string) => {
      console.error(`Error in ${operation}:`, error);
      const errorMessage = error?.message || `Failed to ${operation}`;
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    },
    [toast]
  );

  const createClient = useCallback(
    async (formData: ClientFormValues) => {
      setIsCreating(true);
      setError(null);

      try {
        const result = await ClientApiService.createClient(formData, token);

        toast({
          title: "Success",
          description: "Client created successfully",
        });

        return result;
      } catch (error) {
        handleError(error, "create client");
        throw error;
      } finally {
        setIsCreating(false);
      }
    },
    [token, toast, handleError]
  );

  const updateClient = useCallback(
    async (id: string, formData: ClientFormValues) => {
      setIsUpdating(true);
      setError(null);

      try {
        console.log(`Updating client with ID: ${id}`);
        const result = await ClientApiService.updateClient(id, formData, token);

        toast({
          title: "Success",
          description: "Client updated successfully",
        });

        return result;
      } catch (error) {
        console.error("Error details:", error);
        handleError(error, "update client");
        throw error;
      } finally {
        setIsUpdating(false);
      }
    },
    [token, toast, handleError]
  );

  const getClient = useCallback(
    async (id: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await ClientApiService.getClient(id, token);
        return result;
      } catch (error) {
        handleError(error, "get client");
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [token, handleError]
  );

  const getAllClients = useCallback(
    async (params?: {
      page?: number;
      limit?: number;
      search?: string;
      type?: string;
    }) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await ClientApiService.getAllClients(params, token);
        return result;
      } catch (error) {
        handleError(error, "get clients");
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [token, handleError]
  );

  const createClientUser = useCallback(
    async (clientId: string, formData: ClientUserFormValues) => {
      setIsCreating(true);
      setError(null);

      try {
        const result = await ClientApiService.createClientUser(
          clientId,
          formData,
          token
        );

        toast({
          title: "Success",
          description: "Client user created successfully",
        });

        return result;
      } catch (error) {
        handleError(error, "create client user");
        throw error;
      } finally {
        setIsCreating(false);
      }
    },
    [token, toast, handleError]
  );

  const updateClientUser = useCallback(
    async (
      clientId: string,
      userId: string,
      formData: ClientUserFormValues
    ) => {
      setIsUpdating(true);
      setError(null);

      try {
        const result = await ClientApiService.updateClientUser(
          clientId,
          userId,
          formData,
          token
        );

        toast({
          title: "Success",
          description: "Client user updated successfully",
        });

        return result;
      } catch (error) {
        handleError(error, "update client user");
        throw error;
      } finally {
        setIsUpdating(false);
      }
    },
    [token, toast, handleError]
  );

  const getClientUsers = useCallback(
    async (clientId: string) => {
      setIsLoading(true);
      setError(null);

      try {
        const result = await ClientApiService.getClientUsers(clientId, token);
        return result;
      } catch (error) {
        handleError(error, "get client users");
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    [token, handleError]
  );

  // Utility functions
  const transformFormToBackend = useCallback((formData: ClientFormValues) => {
    return ClientTransformationService.transformFormToBackend(formData);
  }, []);

  const transformBackendToForm = useCallback((backendData: any) => {
    return ClientTransformationService.transformBackendToForm(backendData);
  }, []);

  return {
    // Client operations
    createClient,
    updateClient,
    getClient,
    getAllClients,

    // Client user operations
    createClientUser,
    updateClientUser,
    getClientUsers,

    // Utility functions
    transformFormToBackend,
    transformBackendToForm,

    // Loading states
    isCreating,
    isUpdating,
    isLoading,

    // Error handling
    error,
    clearError,
  };
};
