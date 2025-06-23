/**
 * Client Service
 * Handles all Client related API operations
 */

import { actorAPI } from "@/app/actions/actorAPI";
import { Client, ClientCreateRequest, ClientUser } from "@/lib/types/actors";

export class ClientService {
  /**
   * Get all Client entities
   */
  static async getAll(token?: string): Promise<Client[]> {
    try {
      const response = await actorAPI.client.getAll(token);
      return response.data || response || [];
    } catch (error) {
      console.error("Error fetching Clients:", error);
      throw new Error("Failed to fetch Client data");
    }
  }

  /**
   * Get single Client by ID
   */
  static async getOne(id: string, token?: string): Promise<Client> {
    try {
      const response = await actorAPI.client.getOne(id, token);
      return response.data || response;
    } catch (error) {
      console.error("Error fetching Client:", error);
      throw new Error("Failed to fetch Client data");
    }
  }

  /**
   * Create or update a Client
   */
  static async createOrUpdate(
    data: ClientCreateRequest,
    id?: string,
    token?: string
  ): Promise<Client> {
    try {
      const response = id
        ? await actorAPI.client.update(id, data, token)
        : await actorAPI.client.create(data, token);
      return response.data || response;
    } catch (error) {
      console.error("Error creating/updating Client:", error);
      throw new Error("Failed to create/update Client");
    }
  }

  /**
   * Delete a Client
   */
  static async delete(id: string, token?: string): Promise<void> {
    try {
      await actorAPI.client.delete(id, token);
    } catch (error) {
      console.error("Error deleting Client:", error);
      throw new Error("Failed to delete Client");
    }
  }

  /**
   * Transform form data to API format
   */
  static transformFormDataToAPI(formData: any): ClientCreateRequest {
    return {
      code: formData.code,
      name: formData.name,
      type: formData.type,
      address: formData.address,
      postal_code: formData.postal_code,
      city: formData.city,
      country: formData.country,
      phone: formData.phone,
      email: formData.email,
      status: formData.status,
      tax_number: formData.tax_number,
      registration_date: formData.registration_date,
      parent_agence_id: formData.parent_agence_id,
    };
  }

  /**
   * Transform API data to form format
   */
  static transformAPIDataToForm(apiData: Client): any {
    return {
      code: apiData.code,
      name: apiData.name,
      type: apiData.type,
      address: apiData.address,
      postal_code: apiData.postal_code,
      city: apiData.city,
      country: apiData.country,
      phone: apiData.phone,
      email: apiData.email,
      status: apiData.status,
      tax_number: apiData.tax_number,
      registration_date: apiData.registration_date,
      parent_agence_id: apiData.parent_agence_id,
    };
  }
}
