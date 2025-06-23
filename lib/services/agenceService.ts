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
      const response = await actorAPI.agence.getOne(id, token);
      return response.data || response;
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
   * Delete an Agence
   */
  static async delete(id: string, token?: string): Promise<void> {
    try {
      await actorAPI.agence.delete(id, token);
    } catch (error) {
      console.error("Error deleting Agence:", error);
      throw new Error("Failed to delete Agence");
    }
  }

  /**
   * Transform form data to API format
   */
  static transformFormDataToAPI(formData: any): AgenceCreateRequest {
    return {
      code: formData.code,
      name: formData.name,
      address: formData.address,
      postal_code: formData.postal_code,
      city: formData.city,
      country: formData.country,
      phone: formData.phone,
      email: formData.email,
      status: formData.status,
      manager_name: formData.manager_name,
      opening_date: formData.opening_date,
      parent_iob_id: formData.parent_iob_id,
    };
  }

  /**
   * Transform API data to form format
   */
  static transformAPIDataToForm(apiData: Agence): any {
    return {
      code: apiData.code,
      name: apiData.name,
      address: apiData.address,
      postal_code: apiData.postal_code,
      city: apiData.city,
      country: apiData.country,
      phone: apiData.phone,
      email: apiData.email,
      status: apiData.status,
      manager_name: apiData.manager_name,
      opening_date: apiData.opening_date,
      parent_iob_id: apiData.parent_iob_id,
    };
  }
}
