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
} 