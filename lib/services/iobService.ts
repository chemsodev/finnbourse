/**
 * IOB Service
 * Handles all IOB (Intermediaire en Operations de Bourse) related API operations
 */

import { actorAPI } from "@/app/actions/actorAPI";
import { IOB, IOBCreateRequest, IOBUser } from "@/lib/types/actors";

export class IOBService {
  /**
   * Get all IOB entities
   */
  static async getAll(token?: string): Promise<IOB[]> {
    try {
      const response = await actorAPI.iob.getAll(token);
      return response.data || response || [];
    } catch (error) {
      console.error("Error fetching IOBs:", error);
      throw new Error("Failed to fetch IOB data");
    }
  }

  /**
   * Get single IOB by ID
   */
  static async getOne(id: string, token?: string): Promise<IOB> {
    try {
      const response = await actorAPI.iob.getOne(id, token);
      return response.data || response;
    } catch (error) {
      console.error("Error fetching IOB:", error);
      throw new Error("Failed to fetch IOB data");
    }
  }

  /**
   * Create or update an IOB
   */
  static async createOrUpdate(
    data: IOBCreateRequest,
    id?: string,
    token?: string
  ): Promise<IOB> {
    try {
      const response = id
        ? await actorAPI.iob.update(id, data, token)
        : await actorAPI.iob.create(data, token);
      return response.data || response;
    } catch (error) {
      console.error("Error creating/updating IOB:", error);
      throw new Error("Failed to create/update IOB");
    }
  }

  /**
   * Delete an IOB
   */
  static async delete(id: string, token?: string): Promise<void> {
    try {
      await actorAPI.iob.delete(id, token);
    } catch (error) {
      console.error("Error deleting IOB:", error);
      throw new Error("Failed to delete IOB");
    }
  }

  /**
   * Transform form data to API format
   */
  static transformFormDataToAPI(formData: any): IOBCreateRequest {
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
      agreement_number: formData.agreement_number,
      agreement_date: formData.agreement_date,
      surveillance_authority: formData.surveillance_authority,
      financialInstitutionId: formData.financialInstitutionId,
    };
  }

  /**
   * Transform API data to form format
   */
  static transformAPIDataToForm(apiData: IOB): any {
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
      agreement_number: apiData.agreement_number,
      agreement_date: apiData.agreement_date,
      surveillance_authority: apiData.surveillance_authority,
      financialInstitutionId: apiData.financialInstitutionId,
    };
  }
}
