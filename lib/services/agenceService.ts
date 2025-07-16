/**
 * Agence Service
 * Handles all Agence related API operations
 */

import { actorAPI } from "@/app/actions/actorAPI";
import { Agence, AgenceCreateRequest, AgenceUser } from "@/lib/types/actors";

export class AgenceService {
  /**
   * Get all Agence entities
   */
  static async getAll(token?: string): Promise<Agence[]> {
    try {
      const response = await actorAPI.agence.getAll(token);
      return response.data || response || [];
    } catch (error) {
      console.error("Error fetching Agences:", error);
      throw new Error("Failed to fetch Agence data");
    }
  }

  /**
   * Get single Agence by ID
   */
  static async getOne(id: string, token?: string): Promise<Agence> {
    try {
      // First try using the actorAPI
      try {
        const response = await actorAPI.agence.getOne(id, token);
        return response.data || response;
      } catch (apiError) {
        console.warn(
          "Error using actorAPI for Agence fetch, trying direct fetch:",
          apiError
        );

        // If the actorAPI fails, try a direct fetch with the proxy
        const headers: HeadersInit = {
          "Content-Type": "application/json",
        };

        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(`/api/agence/${id}`, { headers });

        if (!response.ok) {
          throw new Error(`Failed to fetch Agence: ${response.status}`);
        }

        return await response.json();
      }
    } catch (error) {
      console.error("Error fetching Agence:", error);
      throw new Error("Failed to fetch Agence data");
    }
  }

  /**
   * Create or update an Agence
   */
  static async createOrUpdate(
    data: AgenceCreateRequest,
    id?: string,
    token?: string
  ): Promise<Agence> {
    try {
      const response = id
        ? await actorAPI.agence.update(id, data, token)
        : await actorAPI.agence.create(data, token);
      return response.data || response;
    } catch (error) {
      console.error("Error creating/updating Agence:", error);
      throw new Error("Failed to create/update Agence");
    }
  }

  /**
   * Transform form data to API format
   */
  static transformFormDataToAPI(formData: any): AgenceCreateRequest {
    return {
      code: formData.code,
      address: formData.address,
      code_swift: formData.code_swift,
      agence_name: formData.agence_name,
      agence_email: formData.agence_email,
      agence_phone: formData.agence_phone,
      financialInstitutionId: formData.financialInstitutionId,
    };
  }

  /**
   * Transform API data to form format
   */
  static transformAPIDataToForm(apiData: Agence): any {
    return {
      code: apiData.code,
      address: apiData.address,
      code_swift: apiData.code_swift,
      agence_name: apiData.agence_name,
      agence_email: apiData.agence_email,
      agence_phone: apiData.agence_phone,
      financialInstitutionId:
        apiData.financialInstitution?.id ||
        apiData.financialInstitutionId ||
        "",
    };
  }

  /**
   * Get users for an Agence
   * Note: Users are typically embedded in the agency response,
   * so this method first tries to get them from there
   */
  static async getUsers(
    agenceId: string,
    token?: string
  ): Promise<AgenceUser[]> {
    try {
      // First try to get the agency with embedded users
      const agency = await this.getOne(agenceId, token);
      const agencyWithUsers = agency as any;

      if (agencyWithUsers.users && Array.isArray(agencyWithUsers.users)) {
        console.log("✅ Using embedded users from agency data");
        return agencyWithUsers.users;
      }

      // Fallback: try the separate endpoint (though it may not exist)
      console.log("⚠️ No embedded users found, trying separate endpoint");
      const response = await actorAPI.agence.getUsers(agenceId, token);
      return response.data || response || [];
    } catch (error) {
      console.error("Error fetching Agence users:", error);
      // Return empty array instead of throwing to allow form to work without users
      return [];
    }
  }

  /**
   * Create a user for an Agence
   */
  static async createUser(
    userData: any,
    agenceId: string,
    token?: string
  ): Promise<any> {
    try {
      const response = await actorAPI.agence.createUser(
        agenceId,
        userData,
        token
      );
      return response.data || response;
    } catch (error) {
      console.error("Error creating Agence user:", error);
      // Re-throw the original error to preserve server error details
      throw error;
    }
  }
}
