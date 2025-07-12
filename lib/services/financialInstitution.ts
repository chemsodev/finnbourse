import { clientFetchREST } from "@/app/actions/fetchREST";
import { FinancialInstitution } from "@/types/gestionTitres";

export class FinancialInstitutionService {
  static async getAll(token?: string): Promise<FinancialInstitution[]> {
    try {
      const response = await clientFetchREST("/financial-institution", {
        method: "GET",
        token: token || undefined,
      });
      return response.data || [];
    } catch (error) {
      console.error("Error fetching financial institutions:", error);
      throw new Error("Failed to fetch financial institution data");
    }
  }

  static async getById(
    id: string,
    token?: string
  ): Promise<FinancialInstitution> {
    try {
      const response = await clientFetchREST(`/financial-institution/${id}`, {
        method: "GET",
        token: token || undefined,
      });
      return response.data;
    } catch (error) {
      console.error(
        `Error fetching financial institution with ID ${id}:`,
        error
      );
      throw new Error("Failed to fetch financial institution");
    }
  }

  static async create(
    data: Omit<FinancialInstitution, "id">,
    token?: string
  ): Promise<FinancialInstitution> {
    try {
      const response = await clientFetchREST("/financial-institution", {
        method: "POST",
        body: data,
        token: token || undefined,
      });
      return response.data;
    } catch (error) {
      console.error("Error creating financial institution:", error);
      throw new Error("Failed to create financial institution");
    }
  }

  static async update(
    id: string,
    data: Partial<Omit<FinancialInstitution, "id">>,
    token?: string
  ): Promise<FinancialInstitution> {
    try {
      const response = await clientFetchREST(`/financial-institution/${id}`, {
        method: "PUT",
        body: data,
        token: token || undefined,
      });
      return response.data;
    } catch (error) {
      console.error(
        `Error updating financial institution with ID ${id}:`,
        error
      );
      throw new Error("Failed to update financial institution");
    }
  }

  static async delete(
    id: string,
    token?: string
  ): Promise<{ success: boolean }> {
    try {
      // Soft delete via PUT
      const response = await clientFetchREST(`/financial-institution/${id}`, {
        method: "PUT",
        body: { deleted: true },
        token: token || undefined,
      });
      return { success: response.success };
    } catch (error) {
      console.error(
        `Error deleting financial institution with ID ${id}:`,
        error
      );
      throw new Error("Failed to delete financial institution");
    }
  }

  static async search(
    query: string,
    token?: string
  ): Promise<FinancialInstitution[]> {
    try {
      const response = await clientFetchREST(
        `/financial-institution/search?q=${encodeURIComponent(query)}`,
        {
          method: "GET",
          token: token || undefined,
        }
      );
      return response.data || [];
    } catch (error) {
      console.error("Error searching financial institutions:", error);
      throw new Error("Failed to search financial institutions");
    }
  }
}
