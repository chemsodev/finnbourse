// Client API service with proper DTO transformation
import { actorAPI } from "@/app/actions/actorAPI";

// Backend DTO types (matching the backend exactly)
interface CreateClientDto {
  type: "individual" | "company" | "financial_institution";
  client_code: string;
  email: string;
  phone_number: string;
  id_type: "passport" | "driving_license" | "CN" | "RC";
  cash_account_bank_code: string;
  cash_account_agency_code: string;
  cash_account_number: string;
  cash_account_rip_key: string;
  cash_account_rip_full: string;
  securities_account_number: string;
  client_details?: IndividualClientDetails | CompanyClientDetails;
}

interface IndividualClientDetails {
  type: "individual";
  name: string;
  id_number: string;
  nin: string;
  nationalite: string;
  wilaya: string;
  address: string;
  birth_date: Date;
  lieu_naissance: string;
  employe_a_la_institution_financiere: string | null;
}

interface CompanyClientDetails {
  type: "company";
  raison_sociale: string;
  nif: string;
  reg_number: string;
  legal_form: string;
  lieu_naissance: string;
}

interface CreateClientUserDto {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  telephone?: string;
  status: "actif" | "inactif";
  clientUserType: "proprietaire" | "mandataire" | "tuteur_legal";
  nationalite: string;
  dateNaissance: Date;
  adresse: string;
  wilaya: string;
  typePieceIdentite: "cn" | "passport" | "pc";
  numeroPieceIdentite: string;
  role: string[];
}

// Frontend form types (from existing schema)
interface ClientFormValues {
  clientType:
    | "personne_physique"
    | "personne_morale"
    | "institution_financiere";
  clientCode: string;
  email: string;
  phoneNumber: string;
  mobilePhone?: string;
  wilaya: string;
  address: string;
  iobType: "intern" | "extern";
  iobCategory?: string;
  numeroCompteTitre: string;
  ribBanque: string;
  ribAgence: string;
  ribCompte: string;
  ribCle: string;
  observation?: string;
  selectedAgence?: string;
  financialInstitutionId?: string;
  agenceId?: string;
  iobId?: string;

  // Individual fields
  name?: string;
  idType?: "passport" | "permit_conduite" | "nin";
  idNumber?: string;
  nin?: string;
  nationalite?: string;
  dateNaissance?: Date;
  lieuNaissance?: string;

  // Company fields
  raisonSociale?: string;
  nif?: string;
  regNumber?: string;
  legalForm?: string;
}

interface ClientUserFormValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roles: string[];
  address: string;
  wilaya: string;
  nationality: string;
  birthDate: string;
  idNumber: string;
  userType: "proprietaire" | "mandataire" | "tuteur_legal";
  status: "active" | "inactive";
}

// Type mapping objects with proper typing
const CLIENT_TYPE_MAP = {
  personne_physique: "individual",
  personne_morale: "company",
  institution_financiere: "financial_institution",
} as const;

const ID_TYPE_MAP = {
  passport: "passport",
  permit_conduite: "driving_license",
  nin: "CN",
} as const;

const REVERSE_CLIENT_TYPE_MAP = {
  individual: "personne_physique",
  company: "personne_morale",
  financial_institution: "institution_financiere",
} as const;

const REVERSE_ID_TYPE_MAP = {
  passport: "passport",
  driving_license: "permit_conduite",
  CN: "nin",
  RC: "nin",
} as const;

const STATUS_MAP = {
  active: "actif",
  inactive: "inactif",
} as const;

// Transformation service
export class ClientTransformationService {
  static transformFormToBackend(formData: ClientFormValues): CreateClientDto {
    // Build RIB full number
    const ribFull = `${formData.ribBanque}${formData.ribAgence}${formData.ribCompte}${formData.ribCle}`;

    // Base client data
    const baseClient: CreateClientDto = {
      type: CLIENT_TYPE_MAP[formData.clientType],
      client_code: formData.clientCode,
      email: formData.email,
      phone_number: formData.phoneNumber,
      id_type: ID_TYPE_MAP[formData.idType || "nin"],
      cash_account_bank_code: formData.ribBanque,
      cash_account_agency_code: formData.ribAgence,
      cash_account_number: formData.ribCompte,
      cash_account_rip_key: formData.ribCle,
      cash_account_rip_full: ribFull,
      securities_account_number: formData.numeroCompteTitre,
    };

    // Add client details based on type
    if (formData.clientType === "personne_physique") {
      baseClient.client_details = {
        type: "individual",
        name: formData.name!,
        id_number: formData.idNumber!,
        nin: formData.nin!,
        nationalite: formData.nationalite!,
        wilaya: formData.wilaya,
        address: formData.address,
        birth_date: formData.dateNaissance!,
        lieu_naissance: formData.lieuNaissance!,
        employe_a_la_institution_financiere: null,
      };
    } else if (
      formData.clientType === "personne_morale" ||
      formData.clientType === "institution_financiere"
    ) {
      baseClient.client_details = {
        type: "company",
        raison_sociale: formData.raisonSociale!,
        nif: formData.nif!,
        reg_number: formData.regNumber!,
        legal_form: formData.legalForm!,
        lieu_naissance: formData.wilaya, // Using wilaya as lieu_naissance
      };
    }

    return baseClient;
  }

  static transformUserFormToBackend(
    formData: ClientUserFormValues
  ): CreateClientUserDto {
    return {
      firstname: formData.firstName,
      lastname: formData.lastName,
      email: formData.email,
      password: formData.password,
      telephone: "", // Will be filled from form if available
      status: STATUS_MAP[formData.status],
      clientUserType: formData.userType,
      nationalite: formData.nationality,
      dateNaissance: new Date(formData.birthDate),
      adresse: formData.address,
      wilaya: formData.wilaya,
      typePieceIdentite: "cn", // Default, can be updated based on form
      numeroPieceIdentite: formData.idNumber,
      role: formData.roles,
    };
  }

  static transformBackendToForm(backendData: any): ClientFormValues {
    const clientType = backendData.type as keyof typeof REVERSE_CLIENT_TYPE_MAP;
    const idType = backendData.id_type as keyof typeof REVERSE_ID_TYPE_MAP;

    const formData: ClientFormValues = {
      clientType: REVERSE_CLIENT_TYPE_MAP[clientType],
      clientCode: backendData.client_code,
      email: backendData.email,
      phoneNumber: backendData.phone_number,
      wilaya: backendData.wilaya || backendData.client_details?.wilaya || "",
      address: backendData.address || backendData.client_details?.address || "",
      iobType: "intern", // Default value
      numeroCompteTitre: backendData.securities_account_number,
      ribBanque: backendData.cash_account_bank_code,
      ribAgence: backendData.cash_account_agency_code,
      ribCompte: backendData.cash_account_number,
      ribCle: backendData.cash_account_rip_key,
    };

    // Add type-specific fields
    if (backendData.type === "individual" && backendData.client_details) {
      formData.name = backendData.client_details.name;
      formData.idNumber = backendData.client_details.id_number;
      formData.nin = backendData.client_details.nin;
      formData.nationalite = backendData.client_details.nationalite;
      formData.dateNaissance = new Date(backendData.client_details.birth_date);
      formData.lieuNaissance = backendData.client_details.lieu_naissance;
      formData.idType = REVERSE_ID_TYPE_MAP[idType];
    } else if (backendData.type === "company" && backendData.client_details) {
      formData.raisonSociale = backendData.client_details.raison_sociale;
      formData.nif = backendData.client_details.nif;
      formData.regNumber = backendData.client_details.reg_number;
      formData.legalForm = backendData.client_details.legal_form;
    }

    return formData;
  }
}

// API service class
export class ClientApiService {
  static async createClient(
    formData: ClientFormValues,
    token?: string
  ): Promise<any> {
    const backendData =
      ClientTransformationService.transformFormToBackend(formData);
    const response = await actorAPI.client.create(backendData, token);
    return response.data || response;
  }

  static async updateClient(
    id: string,
    formData: ClientFormValues,
    token?: string
  ): Promise<any> {
    const backendData =
      ClientTransformationService.transformFormToBackend(formData);
    console.log("Updating client with ID:", id);
    console.log("Update data:", backendData);
    const response = await actorAPI.client.update(id, backendData, token);
    return response.data || response;
  }

  static async getClient(id: string, token?: string): Promise<any> {
    const response = await actorAPI.client.getOne(id, token);
    return response.data || response;
  }

  static async getAllClients(
    params?: {
      page?: number;
      limit?: number;
      search?: string;
      type?: string;
    },
    token?: string
  ): Promise<any> {
    const response = await actorAPI.client.getAll(token);
    return response.data || response;
  }

  static async createClientUser(
    clientId: string,
    formData: ClientUserFormValues,
    token?: string
  ): Promise<any> {
    const backendData =
      ClientTransformationService.transformUserFormToBackend(formData);
    // This endpoint may not exist yet, so we'll use a generic approach
    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "https://kh.finnetude.com";
      const response = await fetch(
        `${baseUrl}/api/v1/client/${clientId}/users`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify(backendData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error creating client user:", error);
      throw error;
    }
  }

  static async updateClientUser(
    clientId: string,
    userId: string,
    formData: ClientUserFormValues,
    token?: string
  ): Promise<any> {
    const backendData =
      ClientTransformationService.transformUserFormToBackend(formData);
    // This endpoint may not exist yet, so we'll use a generic approach
    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "https://kh.finnetude.com";
      const response = await fetch(
        `${baseUrl}/api/v1/client/${clientId}/users/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          body: JSON.stringify(backendData),
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error updating client user:", error);
      throw error;
    }
  }

  static async getClientUsers(clientId: string, token?: string): Promise<any> {
    // This endpoint may not exist yet, so we'll use a generic approach
    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "https://kh.finnetude.com";
      const response = await fetch(
        `${baseUrl}/api/v1/client/${clientId}/users`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            ...(token && { Authorization: `Bearer ${token}` }),
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error("Error getting client users:", error);
      throw error;
    }
  }
}

// Export types for use in components
export type {
  CreateClientDto,
  IndividualClientDetails,
  CompanyClientDetails,
  CreateClientUserDto,
  ClientFormValues,
  ClientUserFormValues,
};
