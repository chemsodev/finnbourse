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
      // First try using the actorAPI
      try {
        const response = await actorAPI.iob.getOne(id, token);
        return response.data || response;
      } catch (apiError) {
        console.warn(
          "Error using actorAPI for IOB fetch, trying direct fetch:",
          apiError
        );

        // If the actorAPI fails, try a direct fetch with the proxy
        const headers: HeadersInit = {
          "Content-Type": "application/json",
        };

        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        const response = await fetch(`/api/iob/${id}`, { headers });

        if (!response.ok) {
          throw new Error(`Failed to fetch IOB: ${response.status}`);
        }

        return await response.json();
      }
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
      code: formData.codeIob || formData.code,
      short_libel: formData.libelleCourt || formData.short_libel,
      long_libel: formData.libelleLong || formData.long_libel,
      correspondent: formData.correspondant || formData.correspondent,
      email: formData.email,
      fax: formData.fax,
      phone: formData.telephone || formData.phone,
      address: formData.addresse || formData.address,
      order: formData.ordreDeTu || formData.order,
      financialInstitutionId: formData.financialInstitutionId,
    };
  }

  /**
   * Transform API data to form format
   */
  static transformAPIDataToForm(apiData: IOB): any {
    return {
      codeIob: apiData.code,
      libelleCourt: apiData.short_libel,
      libelleLong: apiData.long_libel,
      correspondant: apiData.correspondent,
      email: apiData.email,
      fax: apiData.fax,
      telephone: apiData.phone,
      addresse: apiData.address,
      ordreDeTu: apiData.order,
      financialInstitutionId: apiData.financialInstitution?.id,
    };
  }
}
