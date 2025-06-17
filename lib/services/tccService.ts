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
   * Get all TCC entities
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
   * Create a TCC user
   */
  static async createUser(
    userData: TCCUserCreateRequest,
    tccIdOrToken?: string,
    token?: string
  ): Promise<TCCUser> {
    try {
      // If tccIdOrToken looks like a UUID, it's a tccId, otherwise it's a token
      const isUUID = tccIdOrToken && tccIdOrToken.length === 36 && tccIdOrToken.includes('-');
      const tccId = isUUID ? tccIdOrToken : undefined;
      const authToken = isUUID ? token : tccIdOrToken;
      
      // Add tccId to user data if provided
      const userDataWithTccId = tccId 
        ? { ...userData, tccId } 
        : userData;
      
      const response = await actorAPI.tcc.createUser(userDataWithTccId, authToken);
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
      status: formData.statut === "Actif" ? "ACTIVE" : "INACTIVE",
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
    return {
      code: apiData.code,
      libelle: apiData.libelle,
      typeCompte: apiData.account_type,
      statut: apiData.status === "ACTIVE" ? "Actif" : "Inactif",
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
      financialInstitutionId: apiData.financialInstitutionId,
    };
  }

  /**
   * Transform user form data to API format
   */
  static transformUserFormDataToAPI(formData: any): TCCUserCreateRequest {
    return {
      firstname: formData.firstname || formData.fullName?.split(" ")[0] || "",
      lastname:
        formData.lastname ||
        formData.fullName?.split(" ").slice(1).join(" ") ||
        "",
      email: formData.email,
      password: formData.password || "defaultPassword123",
      telephone: formData.telephone || formData.phone || "",
      status: formData.status === "active" ? "actif" : "inactif",
      positionTcc: formData.position || formData.positionTcc || "",
      role: Array.isArray(formData.roles)
        ? formData.roles
        : formData.role
        ? [formData.role]
        : ["client_account_manager_1"],
    };
  }

  /**
   * Transform API user data to form format
   */
  static transformAPIUserDataToForm(apiData: TCCUser): any {
    return {
      id: apiData.id,
      fullName: `${apiData.firstname} ${apiData.lastname}`,
      firstname: apiData.firstname,
      lastname: apiData.lastname,
      email: apiData.email,
      telephone: apiData.telephone,
      phone: apiData.telephone,
      status: apiData.status === "actif" ? "active" : "inactive",
      position: apiData.positionTcc,
      positionTcc: apiData.positionTcc,
      role: Array.isArray(apiData.role) ? apiData.role[0] : apiData.role,
      roles: Array.isArray(apiData.role) ? apiData.role : [apiData.role],
      type: "member", // Default type
      organization: "TCC", // Default organization
      matricule: `TCC-${apiData.id?.slice(-4)}`, // Generate matricule from ID
    };
  }
}

export default TCCService;
