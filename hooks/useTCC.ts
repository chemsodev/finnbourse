/**
 * TCC Hooks
 * Custom hooks for TCC operations with React Query integration
 */

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { TCCService } from "@/lib/services/tccService";
import {
  TCC,
  TCCUser,
  TCCCreateRequest,
  TCCUserCreateRequest,
  TCCUserUpdateRequest,
  TCCUserRoleUpdateRequest,
} from "@/lib/types/tcc";
import { useRestToken } from "@/hooks/useRestToken";

export function useTCC() {
  const [isLoading, setIsLoading] = useState(false);
  const [tcc, setTcc] = useState<TCC | null>(null); // Single TCC instead of array
  const { toast } = useToast();
  const { restToken, isLoading: tokenLoading, hasRestToken } = useRestToken();

  const fetchTCC = async () => {
    // Wait for token to be available
    if (tokenLoading) {
      console.log("⏳ Waiting for REST token...");
      return null;
    }

    if (!hasRestToken) {
      console.log("⚠️ No REST token available, skipping TCC fetch");
      return null;
    }

    setIsLoading(true);
    try {
      console.log(
        "🔄 Fetching TCC with token:",
        restToken?.substring(0, 20) + "..."
      );
      const data = await TCCService.getTCC(restToken || undefined);

      console.log("✅ TCC Service returned:", data);
      console.log("✅ TCC Service returned users:", data?.users);
      console.log("✅ TCC Service returned users length:", data?.users?.length);

      // Handle single TCC response
      setTcc(data); // data is already TCC | null
      console.log("✅ TCC state set to:", data);
      return data;
    } catch (error) {
      // Only show error toast for actual API errors, not for "no TCC" scenarios
      console.error("Failed to fetch TCC:", error);
      toast({
        title: "Error",
        description: "Failed to fetch TCC data",
        variant: "destructive",
      });
      setTcc(null);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };
  const createOrUpdateTCC = async (
    data: TCCCreateRequest,
    isUpdate?: boolean
  ) => {
    setIsLoading(true);
    try {
      const result = await TCCService.createOrUpdate(
        data,
        restToken || undefined
      );
      await fetchTCC(); // Refresh the TCC data
      toast({
        title: "Success",
        description: isUpdate
          ? "TCC updated successfully"
          : "TCC created successfully",
      });
      return result;
    } catch (error) {
      toast({
        title: "Error",
        description: isUpdate ? "Failed to update TCC" : "Failed to create TCC",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const getTCCId = () => {
    return tcc?.id || null;
  };

  const hasTCC = () => {
    return tcc !== null;
  };

  return {
    tcc, // Single TCC object instead of array
    isLoading,
    fetchTCC, // Renamed from fetchTCCs
    createOrUpdateTCC,
    getTCCId, // Helper to get TCC ID
    hasTCC, // Helper to check if TCC exists
  };
}

export function useTCCUsers() {
  const [isLoading, setIsLoading] = useState(false);
  const [users, setUsers] = useState<TCCUser[]>([]);
  const { toast } = useToast();
  const { restToken } = useRestToken();

  const createUser = async (userData: TCCUserCreateRequest) => {
    setIsLoading(true);
    try {
      const result = await TCCService.createUser(
        userData,
        restToken || undefined
      );
      toast({
        title: "Success",
        description: "TCC user created successfully",
      });
      return result;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create TCC user",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUser = async (userId: string, userData: TCCUserUpdateRequest) => {
    setIsLoading(true);
    try {
      const result = await TCCService.updateUser(
        userId,
        userData,
        restToken || undefined
      );
      toast({
        title: "Success",
        description: "TCC user updated successfully",
      });
      return result;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update TCC user",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateUserRole = async (
    userId: string,
    roleData: TCCUserRoleUpdateRequest
  ) => {
    setIsLoading(true);
    try {
      const result = await TCCService.updateUserRole(
        userId,
        roleData,
        restToken || undefined
      );
      toast({
        title: "Success",
        description: "TCC user role updated successfully",
      });
      return result;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update TCC user role",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    users,
    isLoading,
    createUser,
    updateUser,
    updateUserRole,
  };
}

export function useTCCForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createOrUpdateTCC, hasTCC } = useTCC();
  const { createUser } = useTCCUsers();
  const { toast } = useToast();

  const submitForm = async (formData: any) => {
    setIsSubmitting(true);
    try {
      // Transform and submit TCC data
      const tccData = TCCService.transformFormDataToAPI(formData.custodian);
      const isUpdate = hasTCC(); // Check if we're updating existing TCC
      const tccResult = await createOrUpdateTCC(tccData, isUpdate);

      // Submit related users if any
      if (formData.relatedUsers && formData.relatedUsers.length > 0) {
        const userPromises = formData.relatedUsers.map((user: any) => {
          const userData = TCCService.transformUserFormDataToAPI(user);
          return createUser(userData);
        });

        await Promise.all(userPromises);
      }

      toast({
        title: "Success",
        description: isUpdate
          ? "TCC updated and users saved successfully"
          : "TCC created and users saved successfully",
      });

      return tccResult;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save TCC data",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    submitForm,
  };
}
