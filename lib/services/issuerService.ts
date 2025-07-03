import { clientFetchREST } from "@/app/actions/fetchREST";

export class IssuerService {
  static async getAll(token?: string): Promise<any[]> {
    try {
      const response = await clientFetchREST("/issuer", {
        method: "GET",
        token: token || undefined,
      });
      return response.data || [];
    } catch (error) {
      console.error("Error fetching issuers:", error);
      throw new Error("Failed to fetch issuer data");
    }
  }

  static async create(data: {
    name: string;
    website: string;
    activitySector: string;
    capital: string;
    email: string;
    address: string;
    tel: string;
  }, token?: string) {
    try {
      const response = await clientFetchREST("/issuer", {
        method: "POST",
        body: data,
        token: token || undefined,
      });
      return response;
    } catch (error) {
      console.error("Error creating issuer:", error);
      throw new Error("Failed to create issuer");
    }
  }

  static async update(id: string, data: {
    name: string;
    website: string;
    activitySector: string;
    capital: string;
    email: string;
    address: string;
    tel: string;
  }, token?: string) {
    try {
      const response = await clientFetchREST(`/issuer/${id}`, {
        method: "PUT",
        body: data,
        token: token || undefined,
      });
      return response;
    } catch (error) {
      console.error("Error updating issuer:", error);
      throw new Error("Failed to update issuer");
    }
  }

  static async delete(id: string, token?: string) {
    try {
      // Suppression logique via PUT (soft delete)
      const response = await clientFetchREST(`/issuer/${id}`, {
        method: "PUT",
        body: { deleted: true },
        token: token || undefined,
      });
      return response;
    } catch (error) {
      console.error("Error deleting issuer:", error);
      throw new Error("Failed to delete issuer");
    }
  }
} 