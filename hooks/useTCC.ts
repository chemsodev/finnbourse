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
  const [tccs, setTccs] = useState<TCC[]>([]);
  const { toast } = useToast();
  const { restToken } = useRestToken();

  const fetchTCCs = async () => {
    setIsLoading(true);
    try {
      const data = await TCCService.getAll(restToken || undefined);
      setTccs(data);
      return data;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch TCC data",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const createOrUpdateTCC = async (data: TCCCreateRequest) => {
    setIsLoading(true);
    try {
      const result = await TCCService.createOrUpdate(
        data,
        restToken || undefined
      );
      await fetchTCCs(); // Refresh the list
      toast({
        title: "Success",
        description: "TCC saved successfully",
      });
      return result;
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save TCC",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    tccs,
    isLoading,
    fetchTCCs,
    createOrUpdateTCC,
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
  const { createOrUpdateTCC } = useTCC();
  const { createUser } = useTCCUsers();
  const { toast } = useToast();

  const submitForm = async (formData: any) => {
    setIsSubmitting(true);
    try {
      // Transform and submit TCC data
      const tccData = TCCService.transformFormDataToAPI(formData.custodian);
      const tccResult = await createOrUpdateTCC(tccData);

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
        description: "TCC and users saved successfully",
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
