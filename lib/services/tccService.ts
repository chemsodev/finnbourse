/**
 * TCC Service
 * Handles all TCC (Teneur de Comptes Conservateur) related API operations
 */

import { actorAPI } from "@/app/actions/actorAPI";
import {
  TCC,
  TCCUser,
  TCCCreateRequest,
  TCCUserCreateRequest,
  TCCUserUpdateRequest,
  TCCUserRoleUpdateRequest,
} from "@/lib/types/tcc";

export class TCCService {
  /**
   * Get the single TCC entity (since we only have one TCC in the system)
   */ static async getTCC(token?: string): Promise<TCC | null> {
    try {
      console.log("🔄 TCCService.getTCC: Making API call...");
      const response = await actorAPI.tcc.getAll(token);
      const data = response.data || response;

      console.log("🔍 TCC API Response:", data);
      console.log("🔍 TCC API Response type:", typeof data);
      console.log("🔍 TCC API Response isArray:", Array.isArray(data));

      // Handle different response formats
      if (Array.isArray(data)) {
        console.log("📊 Array response with length:", data.length);
        // If it's an array, return the first TCC
        const firstTCC = data.length > 0 ? data[0] : null;
        console.log("📊 First TCC from array:", firstTCC);
        console.log("📊 First TCC users:", firstTCC?.users);
        return firstTCC;
      } else if (data && typeof data === "object" && data.id) {
        console.log("📊 Single object response:", data);
        console.log("📊 Single object users:", data.users);
        // If it's a single TCC object
        return data as TCC;
      }

      console.log("⚠️ No TCC found in response");
      // No TCC found
      return null;
    } catch (error) {
      console.error("❌ Error fetching TCC:", error);
      throw new Error("Failed to fetch TCC data");
    }
  }

  /**
   * Get all TCC entities (deprecated - use getTCC() instead)
   */
  static async getAll(token?: string): Promise<TCC[]> {
    try {
      const response = await actorAPI.tcc.getAll(token);
      return response.data || response || [];
    } catch (error) {
      console.error("Error fetching TCCs:", error);
      throw new Error("Failed to fetch TCC data");
    }
  }

  /**
   * Create or update a TCC
   * Note: Backend uses PUT for create/update operations
   */
  static async createOrUpdate(
    data: TCCCreateRequest,
    token?: string
  ): Promise<TCC> {
    try {
      const response = await actorAPI.tcc.create(data, token);
      return response.data || response;
    } catch (error) {
      console.error("Error creating/updating TCC:", error);
      throw new Error("Failed to create/update TCC");
    }
  }
  /**
   * Get users for TCC
   */
  static async getUsers(token?: string): Promise<TCCUser[]> {
    try {
      // First get the TCC data which includes users
      const tcc = await this.getTCC(token);

      if (!tcc || !tcc.users) {
        return [];
      }

      return tcc.users;
    } catch (error) {
      console.error("Error fetching TCC users:", error);
      throw new Error("Failed to fetch TCC users");
    }
  }

  /**
   * Create a TCC user
   */
  static async createUser(
    userData: TCCUserCreateRequest,
    token?: string
  ): Promise<TCCUser> {
    try {
      // Log what's happening for debugging
      console.log("Creating TCC user with data:", userData);

      const response = await actorAPI.tcc.createUser(userData, token);
      return response.data || response;
    } catch (error) {
      console.error("Error creating TCC user:", error);
      throw new Error("Failed to create TCC user");
    }
  }

  /**
   * Update a TCC user
   */
  static async updateUser(
    userId: string,
    userData: TCCUserUpdateRequest,
    token?: string
  ): Promise<TCCUser> {
    try {
      const response = await actorAPI.tcc.updateUser(userId, userData, token);
      return response.data || response;
    } catch (error) {
      console.error("Error updating TCC user:", error);
      throw new Error("Failed to update TCC user");
    }
  }

  /**
   * Update TCC user roles
   */
  static async updateUserRole(
    userId: string,
    roleData: TCCUserRoleUpdateRequest,
    token?: string
  ): Promise<TCCUser> {
    try {
      const response = await actorAPI.tcc.updateUserRole(
        userId,
        roleData,
        token
      );
      return response.data || response;
    } catch (error) {
      console.error("Error updating TCC user role:", error);
      throw new Error("Failed to update TCC user role");
    }
  }

  /**
   * Transform form data to API format
   */
  static transformFormDataToAPI(formData: any): TCCCreateRequest {
    return {
      code: formData.code,
      libelle: formData.libelle,
      account_type: formData.typeCompte,
      status: formData.statut, // Should already be ACTIVE or INACTIVE
      address: formData.adresse,
      postal_code: formData.codePostal,
      city: formData.ville,
      country: formData.pays,
      phone: formData.telephone,
      email: formData.email,
      agreement_number: formData.numeroAgrement,
      agreement_date: formData.dateAgrement,
      surveillance_authority: formData.autoriteSurveillance,
      name_correspondent: formData.nomCorrespondant,
      code_correspondent: formData.codeCorrespondant,
      financialInstitutionId: formData.financialInstitutionId,
    };
  }

  /**
   * Transform API data to form format
   */
  static transformAPIDataToForm(apiData: TCC): any {
    // Log the incoming data for debugging
    console.log(
      "TCC API data for transform:",
      JSON.stringify(apiData, null, 2)
    );

    const result = {
      code: apiData.code,
      libelle: apiData.libelle,
      typeCompte: apiData.account_type,
      statut: apiData.status, // Keep as ACTIVE or INACTIVE as required by the schema
      adresse: apiData.address,
      codePostal: apiData.postal_code,
      ville: apiData.city,
      pays: apiData.country,
      telephone: apiData.phone,
      email: apiData.email,
      numeroAgrement: apiData.agreement_number,
      dateAgrement: apiData.agreement_date,
      autoriteSurveillance: apiData.surveillance_authority,
      nomCorrespondant: apiData.name_correspondent,
      codeCorrespondant: apiData.code_correspondent,
      financialInstitutionId: apiData.financialInstitutionId || "",
    };

    console.log("Transformed TCC form data:", result);
    return result;
  }

  /**
   * Transform user form data to API format
   */
  static transformUserFormDataToAPI(formData: any): TCCUserCreateRequest {
    return {
      firstname: formData.firstname,
      lastname: formData.lastname,
      email: formData.email,
      password: formData.password || "DefaultPassword123!",
      telephone: formData.telephone,
      status: formData.status || "actif",
      positionTcc: formData.positionTcc,
      role: Array.isArray(formData.role)
        ? formData.role
        : [formData.role].filter(Boolean),
    };
  }

  /**
   * Transform user API data to form format
   */
  static transformUserAPIDataToForm(apiData: TCCUser): any {
    return {
      id: apiData.id,
      firstname: apiData.firstname,
      lastname: apiData.lastname,
      email: apiData.email,
      telephone: apiData.telephone,
      status: apiData.status,
      positionTcc: apiData.positionTcc,
      role: Array.isArray(apiData.role) ? apiData.role : [],
      // Legacy fields for compatibility
      fullName: `${apiData.firstname} ${apiData.lastname}`,
      roles: Array.isArray(apiData.role) ? apiData.role : [],
    };
  }
}

export default TCCService;
