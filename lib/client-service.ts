import {
  Client,
  ClientFormValues,
  PersonnePhysiqueClient,
  PersonneMoraleClient,
  InstitutionFinanciereClient,
  clientSchema,
} from "@/app/[locale]/(main)/(gestion-des-acteurs)/clients/schema";
import { actorAPI } from "@/app/actions/actorAPI";

// Custom error class for client operations
export class ClientError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = "ClientError";
  }
}

// Export interfaces for client operations
export interface ClientUser {
  id: string;
  clientId: string;
  firstName: string;
  lastName: string;
  role: string;
  address: string;
  wilaya: string;
  nationality: string;
  birthDate: string;
  idNumber: string;
  userType: "proprietaire" | "mandataire" | "tuteur_legal";
}

export interface ClientDocument {
  id: string;
  clientId: string;
  documentType: string;
  fileName: string;
  filePath: string;
  uploadDate: Date;
  isRequired: boolean;
  status: "pending" | "approved" | "rejected";
}

// API Functions using REST endpoints
export async function getClients(token?: string): Promise<Client[]> {
  try {
    const response = await actorAPI.client.getAll(token);
    return response.data || response || [];
  } catch (error) {
    console.error("Error fetching clients:", error);
    throw new ClientError("Failed to fetch clients", "FETCH_ERROR");
  }
}

export async function getClientById(
  id: string,
  token?: string
): Promise<Client | null> {
  try {
    if (!id || id === "undefined" || id === "NaN") {
      throw new ClientError("Invalid client ID", "INVALID_ID");
    }
    const response = await actorAPI.client.getOne(id, token);
    return response.data || response;
  } catch (error) {
    console.error("Error fetching client:", error);
    if (error instanceof ClientError) throw error;
    throw new ClientError("Failed to fetch client", "FETCH_ERROR");
  }
}

export async function createClient(
  data: ClientFormValues,
  token?: string
): Promise<Client> {
  try {
    const response = await actorAPI.client.create(data, token);
    return response.data || response;
  } catch (error) {
    console.error("Error creating client:", error);
    throw new ClientError("Failed to create client", "CREATE_ERROR");
  }
}

export async function updateClient(
  id: string,
  data: ClientFormValues,
  token?: string
): Promise<Client> {
  try {
    if (!id || id === "undefined" || id === "NaN") {
      throw new ClientError("Invalid client ID", "INVALID_ID");
    }
    const response = await actorAPI.client.update(id, data, token);
    return response.data || response;
  } catch (error) {
    console.error("Error updating client:", error);
    throw new ClientError("Failed to update client", "UPDATE_ERROR");
  }
}

// Client Users Functions (mock implementations - replace with real API when available)
export async function getClientUsers(clientId: string): Promise<ClientUser[]> {
  try {
    // This would be replaced with actual API call when endpoint is available
    // const response = await actorAPI.client.getUsers(clientId);
    // return response.data || response || [];

    // For now, return empty array
    return [];
  } catch (error) {
    console.error("Error fetching client users:", error);
    throw new ClientError("Failed to fetch client users", "FETCH_ERROR");
  }
}

export async function createClientUsers(users: ClientUser[]): Promise<void> {
  try {
    // This would be replaced with actual API call when endpoint is available
    // await actorAPI.client.createUsers(users);

    console.log("Creating client users:", users);
  } catch (error) {
    console.error("Error creating client users:", error);
    throw new ClientError("Failed to create client users", "CREATE_ERROR");
  }
}

// Client Documents Functions (mock implementations - replace with real API when available)
export async function getClientDocuments(
  clientId: string
): Promise<ClientDocument[]> {
  try {
    // This would be replaced with actual API call when endpoint is available
    // const response = await actorAPI.client.getDocuments(clientId);
    // return response.data || response || [];

    // For now, return empty array
    return [];
  } catch (error) {
    console.error("Error fetching client documents:", error);
    throw new ClientError("Failed to fetch client documents", "FETCH_ERROR");
  }
}

export async function uploadClientDocument(
  clientId: string,
  file: File,
  documentType: string
): Promise<ClientDocument> {
  try {
    // This would be replaced with actual API call when endpoint is available
    // const formData = new FormData();
    // formData.append('file', file);
    // formData.append('documentType', documentType);
    // const response = await actorAPI.client.uploadDocument(clientId, formData);
    // return response.data || response;

    // For now, return mock document
    return {
      id: Date.now().toString(),
      clientId,
      documentType,
      fileName: file.name,
      filePath: `/uploads/${file.name}`,
      uploadDate: new Date(),
      isRequired: true,
      status: "pending",
    };
  } catch (error) {
    console.error("Error uploading client document:", error);
    throw new ClientError("Failed to upload client document", "UPLOAD_ERROR");
  }
}

// Validation helper
const validateClientData = (data: ClientFormValues) => {
  try {
    return clientSchema.parse(data);
  } catch (error) {
    throw new ClientError("Invalid client data", "VALIDATION_ERROR");
  }
};
