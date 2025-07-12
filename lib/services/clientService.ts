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
      const data = response.data || response || [];
      return Array.isArray(data) ? data.map(this.mapApiToFrontend) : [];
    } catch (error) {
      console.error("Error fetching Clients:", error);
      throw new Error("Failed to fetch Client data");
    }
  }

  /**
   * Get single Client by ID
   */
  static async getOne(id: string, token?: string): Promise<any> {
    try {
      const response = await actorAPI.client.getOne(id, token);
      const data = response.data || response;
      return this.mapApiToFrontend(data);
    } catch (error) {
      console.error(`Error fetching Client with ID ${id}:`, error);
      throw new Error(`Failed to fetch Client with ID ${id}`);
    }
  }

  /**
   * Create or update a Client
   */
  static async createOrUpdate(
    data: any,
    id?: string,
    token?: string
  ): Promise<any> {
    try {
      // Transform frontend data to API format
      const apiData = this.mapFrontendToApi(data);

      let response;
      if (id) {
        // Update existing client
        response = await actorAPI.client.update(id, apiData, token);
      } else {
        // Create new client
        response = await actorAPI.client.create(apiData, token);
      }
      return this.mapApiToFrontend(response.data || response);
    } catch (error) {
      console.error(`Error ${id ? "updating" : "creating"} Client:`, error);
      throw new Error(`Failed to ${id ? "update" : "create"} Client`);
    }
  }

  /**
   * Delete a Client
   */
  static async delete(id: string, token?: string): Promise<void> {
    try {
      await actorAPI.client.delete(id, token);
    } catch (error) {
      console.error(`Error deleting Client with ID ${id}:`, error);
      throw new Error(`Failed to delete Client with ID ${id}`);
    }
  }

  /**
   * Map frontend data to API format (camelCase to snake_case)
   */
  static mapFrontendToApi(frontendData: any): any {
    // Map client type from frontend format to API format
    let clientType = frontendData.clientType;
    if (clientType === "personne_physique") {
      clientType = "individual";
    } else if (clientType === "personne_morale") {
      clientType = "corporate";
    } else if (clientType === "institution_financiere") {
      clientType = "financial_institution";
    }

    // Default values for required fields
    const defaultFinancialInstitutionId =
      frontendData.financialInstitutionId || "1";
    const defaultAgenceId =
      frontendData.agenceId || frontendData.selectedAgence || "1";
    const defaultIobId = frontendData.iobId || "1";

    // Build RIB full if components are provided
    let ribFull = "";
    if (
      frontendData.ribBanque &&
      frontendData.ribAgence &&
      frontendData.ribCompte &&
      frontendData.ribCle
    ) {
      ribFull =
        frontendData.ribBanque +
        frontendData.ribAgence +
        frontendData.ribCompte +
        frontendData.ribCle;
    }

    const baseClientData = {
      type: clientType,
      financialInstitutionId: defaultFinancialInstitutionId,
      agenceId: defaultAgenceId,
      iobId: defaultIobId,
      client_code: frontendData.clientCode,
      client_source: frontendData.clientSource || "web",
      email: frontendData.email || "",
      phone_number: frontendData.phoneNumber || "",
      mobile_phone: frontendData.mobilePhone || "",
      wilaya: frontendData.wilaya,
      address: frontendData.address || "",
      id_type: frontendData.idType,
      cash_account_bank_code: frontendData.ribBanque || "",
      cash_account_agency_code: frontendData.ribAgence || "",
      cash_account_number: frontendData.ribCompte || "",
      cash_account_rip_key: frontendData.ribCle || "",
      cash_account_rip_full: ribFull,
      securities_account_number: frontendData.numeroCompteTitre || "",
      iob_type: frontendData.iobType || "intern",
      iob_category: frontendData.iobCategory || null,
      observation: frontendData.observation || "",
    };

    // Create client_details based on client type
    let client_details = null;
    if (clientType === "individual") {
      client_details = {
        type: "individual",
        name: frontendData.name,
        id_number: frontendData.idNumber,
        nin: frontendData.nin,
        nationalite: frontendData.nationalite,
        date_naissance: frontendData.dateNaissance
          ? frontendData.dateNaissance.toISOString().split("T")[0]
          : null,
        lieu_naissance: frontendData.lieuNaissance,
        employe_a_la_institution_financiere:
          frontendData.isEmployeeCPA || false,
      };
    } else if (
      clientType === "corporate" ||
      clientType === "financial_institution"
    ) {
      client_details = {
        type: clientType,
        raison_sociale: frontendData.raisonSociale,
        nif: frontendData.nif,
        reg_number: frontendData.regNumber,
        legal_form: frontendData.legalForm,
      };
    }

    return {
      ...baseClientData,
      client_details,
    };
  }

  /**
   * Map API data to frontend format (snake_case to camelCase)
   */
  static mapApiToFrontend(apiData: any): any {
    if (!apiData) return null;

    // Map client type from API format to frontend format
    let clientType = "personne_physique"; // Default to individual
    if (apiData.type) {
      const type = apiData.type.toLowerCase();
      if (type === "individual") {
        clientType = "personne_physique";
      } else if (type === "corporate") {
        clientType = "personne_morale";
      } else if (type === "financial_institution") {
        clientType = "institution_financiere";
      }
    }

    // Parse date if available
    let dateNaissance = null;
    if (apiData.date_naissance) {
      dateNaissance = new Date(apiData.date_naissance);
    }

    const baseClient = {
      id: apiData.id,
      type: apiData.type,
      clientType: clientType,
      agence: apiData.agence,
      agencyName: apiData.agency_name,
      selectedAgence: apiData.agence,
      client_code: apiData.client_code,
      clientCode: apiData.client_code,
      client_source: apiData.client_source,
      clientSource: apiData.client_source,
      email: apiData.email,
      phone_number: apiData.phone_number,
      phoneNumber: apiData.phone_number,
      mobile_phone: apiData.mobile_phone,
      mobilePhone: apiData.mobile_phone,
      wilaya: apiData.wilaya,
      address: apiData.address,
      id_type: apiData.id_type,
      idType: apiData.id_type,
      cash_account_bank_code: apiData.cash_account_bank_code,
      ribBanque: apiData.cash_account_bank_code,
      cash_account_agency_code: apiData.cash_account_agency_code,
      ribAgence: apiData.cash_account_agency_code,
      cash_account_number: apiData.cash_account_number,
      ribCompte: apiData.cash_account_number,
      cash_account_rip_key: apiData.cash_account_rip_key,
      ribCle: apiData.cash_account_rip_key,
      cash_account_rip_full: apiData.cash_account_rip_full,
      ribFull: apiData.cash_account_rip_full,
      securities_account_number: apiData.securities_account_number,
      numeroCompteTitre: apiData.securities_account_number,
      iob_type: apiData.iob_type,
      iobType: apiData.iob_type,
      iob_category: apiData.iob_category,
      iobCategory: apiData.iob_category,
      observation: apiData.observation,
      financialInstitutionId: apiData.financialInstitutionId,
      agenceId: apiData.agenceId,
      iobId: apiData.iobId,
      status: apiData.status,
      createdAt: apiData.createdAt,
      updatedAt: apiData.updatedAt,
    };

    // Add client-specific fields based on type
    if (clientType === "personne_physique") {
      return {
        ...baseClient,
        name: apiData.name,
        id_number: apiData.id_number,
        idNumber: apiData.id_number,
        nin: apiData.nin,
        nationalite: apiData.nationalite,
        date_naissance: apiData.date_naissance,
        dateNaissance: dateNaissance,
        lieu_naissance: apiData.lieu_naissance,
        lieuNaissance: apiData.lieu_naissance,
        employe_a_la_institution_financiere:
          apiData.employe_a_la_institution_financiere,
        isEmployeeCPA: apiData.employe_a_la_institution_financiere,
      };
    } else if (
      clientType === "personne_morale" ||
      clientType === "institution_financiere"
    ) {
      return {
        ...baseClient,
        raison_sociale: apiData.raison_sociale,
        raisonSociale: apiData.raison_sociale,
        nif: apiData.nif,
        reg_number: apiData.reg_number,
        regNumber: apiData.reg_number,
        legal_form: apiData.legal_form,
        legalForm: apiData.legal_form,
      };
    }

    return baseClient;
  }

  /**
   * Transform form data to API format for backwards compatibility
   */
  static transformFormDataToAPI(formData: any): ClientCreateRequest {
    return this.mapFrontendToApi(formData);
  }

  /**
   * Transform API data to form format for backwards compatibility
   */
  static transformAPIDataToForm(apiData: Client): any {
    return this.mapApiToFrontend(apiData);
  }
}
