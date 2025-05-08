import {
  Client,
  ClientFormValues,
  PersonnePhysiqueClient,
  PersonneMoraleClient,
  InstitutionFinanciereClient,
  clientSchema,
} from "@/app/[locale]/(main)/(gestion-des-acteurs)/clients/schema";

// Custom error class for client operations
export class ClientError extends Error {
  constructor(message: string, public code: string) {
    super(message);
    this.name = "ClientError";
  }
}

// Export interfaces
export interface ClientUser {
  clientId: number;
  firstName: string;
  lastName: string;
  role: string;
  address: string;
  wilaya: string;
  nationality: string;
  birthDate: string;
  idNumber: string;
  isOwner: boolean;
  isMandatory: boolean;
}

export interface ClientDocument {
  clientId: number;
  documentId: number;
  file: {
    name: string;
    type: string;
    data: ArrayBuffer;
  } | null;
  status: string;
  description?: string;
  poste?: string;
}

// Re-export the Client type
export type { Client };

// Mock data that matches the form structure
const mockClients: Client[] = [
  {
    id: 1,
    clientType: "personne_physique",
    clientSource: "CPA",
    name: "John Doe",
    email: "john.doe@example.com",
    phoneNumber: "0123456789",
    mobilePhone: "0612345678",
    idType: "passport",
    idNumber: "AB123456",
    nin: "123456789012",
    nationalite: "Algérienne",
    wilaya: "Alger",
    address: "123 Rue Example, Alger",
    dateNaissance: new Date("1990-01-01"),
    iobType: "intern",
    iobCategory: null,
    hasCompteTitre: true,
    numeroCompteTitre: "CT123456",
    ribBanque: "12345",
    ribAgence: "12345",
    ribCompte: "12345678901",
    ribCle: "12",
    observation: "Client VIP",
    isEmployeeCPA: false,
    matricule: "",
    poste: "",
    agenceCPA: "1",
    selectedAgence: "",
    status: "verified",
    createdAt: new Date(),
    updatedAt: new Date(),
  } as PersonnePhysiqueClient,
  {
    id: 2,
    clientType: "personne_morale",
    clientSource: "extern",
    name: "ABC Corporation",
    email: "contact@abccorp.com",
    phoneNumber: "0234567890",
    mobilePhone: "0623456789",
    wilaya: "Oran",
    address: "456 Business Ave, Oran",
    iobType: "extern",
    iobCategory: "iob_sga_dz",
    hasCompteTitre: true,
    numeroCompteTitre: "CT789012",
    ribBanque: "54321",
    ribAgence: "54321",
    ribCompte: "98765432109",
    ribCle: "34",
    observation: "Corporate client",
    isEmployeeCPA: false,
    matricule: "",
    poste: "",
    agenceCPA: "",
    selectedAgence: "3",
    raisonSociale: "ABC Corporation SARL",
    nif: "NIF123456",
    regNumber: "RC789012",
    legalForm: "sarl",
    status: "verified",
    createdAt: new Date(),
    updatedAt: new Date(),
  } as PersonneMoraleClient,
  {
    id: 3,
    clientType: "institution_financiere",
    clientSource: "extern",
    name: "Global Bank",
    email: "contact@globalbank.com",
    phoneNumber: "0345678901",
    mobilePhone: "0634567890",
    wilaya: "Constantine",
    address: "789 Finance Street, Constantine",
    iobType: "extern",
    iobCategory: "iob_invest_market",
    hasCompteTitre: true,
    numeroCompteTitre: "CT345678",
    ribBanque: "98765",
    ribAgence: "98765",
    ribCompte: "12345678901",
    ribCle: "56",
    observation: "Financial institution",
    isEmployeeCPA: false,
    matricule: "",
    poste: "",
    agenceCPA: "",
    selectedAgence: "4",
    raisonSociale: "Global Bank SA",
    nif: "NIF789012",
    regNumber: "RC345678",
    legalForm: "spa",
    status: "verified",
    createdAt: new Date(),
    updatedAt: new Date(),
  } as InstitutionFinanciereClient,
  {
    id: 4,
    clientType: "personne_physique",
    clientSource: "CPA",
    name: "Sarah Smith",
    email: "sarah.smith@example.com",
    phoneNumber: "0456789012",
    mobilePhone: "0645678901",
    idType: "nin",
    idNumber: "CD789012",
    nin: "987654321098",
    nationalite: "Algérienne",
    wilaya: "Oran",
    address: "321 Personal Ave, Oran",
    dateNaissance: new Date("1985-05-15"),
    iobType: "intern",
    iobCategory: null,
    hasCompteTitre: true,
    numeroCompteTitre: "CT901234",
    ribBanque: "23456",
    ribAgence: "23456",
    ribCompte: "23456789012",
    ribCle: "78",
    observation: "Active trader",
    isEmployeeCPA: true,
    matricule: "EMP123",
    poste: "Trader",
    agenceCPA: "2",
    selectedAgence: "",
    status: "verified",
    createdAt: new Date(),
    updatedAt: new Date(),
  } as PersonnePhysiqueClient,
  {
    id: 5,
    clientType: "personne_morale",
    clientSource: "extern",
    name: "Tech Solutions",
    email: "info@techsolutions.com",
    phoneNumber: "0567890123",
    mobilePhone: "0656789012",
    wilaya: "Annaba",
    address: "567 Tech Park, Annaba",
    iobType: "extern",
    iobCategory: "iob_sga_dz",
    hasCompteTitre: false,
    numeroCompteTitre: "",
    ribBanque: "34567",
    ribAgence: "34567",
    ribCompte: "34567890123",
    ribCle: "90",
    observation: "Technology company",
    isEmployeeCPA: false,
    matricule: "",
    poste: "",
    agenceCPA: "",
    selectedAgence: "3",
    raisonSociale: "Tech Solutions SARL",
    nif: "NIF456789",
    regNumber: "RC567890",
    legalForm: "sarl",
    status: "pending",
    createdAt: new Date(),
    updatedAt: new Date(),
  } as PersonneMoraleClient,
];

// Mock data for documents and users
const mockClientDocuments: ClientDocument[] = [
  {
    clientId: 1,
    documentId: 1,
    file: {
      name: "registre_commerce.pdf",
      type: "application/pdf",
      data: new ArrayBuffer(1024),
    },
    status: "verified",
    description: "Copie du Registre de Commerce",
  },
  {
    clientId: 1,
    documentId: 2,
    file: {
      name: "statuts.pdf",
      type: "application/pdf",
      data: new ArrayBuffer(1024),
    },
    status: "verified",
    description: "Statuts de la Société",
  },
  {
    clientId: 2,
    documentId: 1,
    file: {
      name: "registre_commerce_abc.pdf",
      type: "application/pdf",
      data: new ArrayBuffer(1024),
    },
    status: "pending",
    description: "Copie du Registre de Commerce",
  },
  {
    clientId: 3,
    documentId: 3,
    file: {
      name: "piece_identite.pdf",
      type: "application/pdf",
      data: new ArrayBuffer(1024),
    },
    status: "verified",
    description: "Copie de la pièce d'identité du gérant",
  },
  {
    clientId: 4,
    documentId: 4,
    file: {
      name: "mandataire.pdf",
      type: "application/pdf",
      data: new ArrayBuffer(1024),
    },
    status: "verified",
    description: "Copie de la pièce d'identité du mandataire",
  },
];

const mockClientUsers: ClientUser[] = [
  {
    clientId: 1,
    firstName: "John",
    lastName: "Doe",
    role: "validator1",
    address: "123 Rue Example, Alger",
    wilaya: "Alger",
    nationality: "Algérienne",
    birthDate: "1990-01-01",
    idNumber: "AB123456",
    isOwner: true,
    isMandatory: false,
  },
  {
    clientId: 1,
    firstName: "Jane",
    lastName: "Doe",
    role: "validator2",
    address: "123 Rue Example, Alger",
    wilaya: "Alger",
    nationality: "Algérienne",
    birthDate: "1992-03-15",
    idNumber: "CD789012",
    isOwner: false,
    isMandatory: true,
  },
  {
    clientId: 2,
    firstName: "Mohammed",
    lastName: "Ali",
    role: "initiator",
    address: "456 Business Ave, Oran",
    wilaya: "Oran",
    nationality: "Algérienne",
    birthDate: "1985-06-20",
    idNumber: "EF345678",
    isOwner: true,
    isMandatory: false,
  },
  {
    clientId: 2,
    firstName: "Fatima",
    lastName: "Benzine",
    role: "consultation",
    address: "456 Business Ave, Oran",
    wilaya: "Oran",
    nationality: "Algérienne",
    birthDate: "1988-09-10",
    idNumber: "GH901234",
    isOwner: false,
    isMandatory: true,
  },
  {
    clientId: 3,
    firstName: "Karim",
    lastName: "Boudjemaa",
    role: "validator1",
    address: "789 Finance Street, Constantine",
    wilaya: "Constantine",
    nationality: "Algérienne",
    birthDate: "1982-12-05",
    idNumber: "IJ567890",
    isOwner: true,
    isMandatory: false,
  },
  {
    clientId: 4,
    firstName: "Sarah",
    lastName: "Smith",
    role: "initiator",
    address: "321 Personal Ave, Oran",
    wilaya: "Oran",
    nationality: "Algérienne",
    birthDate: "1985-05-15",
    idNumber: "KL123456",
    isOwner: true,
    isMandatory: false,
  },
  {
    clientId: 5,
    firstName: "Ahmed",
    lastName: "Benali",
    role: "validator1",
    address: "567 Tech Park, Annaba",
    wilaya: "Annaba",
    nationality: "Algérienne",
    birthDate: "1987-08-25",
    idNumber: "MN789012",
    isOwner: true,
    isMandatory: false,
  },
];

// Simulate API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

// Validation helper
const validateClientData = (data: ClientFormValues) => {
  try {
    return clientSchema.parse(data);
  } catch (error) {
    throw new ClientError("Invalid client data", "VALIDATION_ERROR");
  }
};

export async function getClients(): Promise<Client[]> {
  try {
    await delay(500);
    return [...mockClients]; // Return a copy to prevent direct mutation
  } catch (error) {
    throw new ClientError("Failed to fetch clients", "FETCH_ERROR");
  }
}

export async function getClientById(id: number): Promise<Client | null> {
  try {
    await delay(500);
    const client = mockClients.find((c) => c.id === id);
    if (!client) {
      throw new ClientError(`Client with id ${id} not found`, "NOT_FOUND");
    }
    return { ...client }; // Return a copy to prevent direct mutation
  } catch (error) {
    if (error instanceof ClientError) throw error;
    throw new ClientError("Failed to fetch client", "FETCH_ERROR");
  }
}

export async function createClient(data: ClientFormValues): Promise<Client> {
  try {
    await delay(500);

    // Validate input data
    const validatedData = validateClientData(data);

    const newId = Math.max(0, ...mockClients.map((c) => c.id)) + 1;

    const baseClient = {
      id: newId,
      status: "pending" as const,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    let newClient: Client;

    if (validatedData.clientType === "personne_physique") {
      newClient = {
        ...baseClient,
        clientType: "personne_physique",
        name: validatedData.name,
        idType: validatedData.idType,
        idNumber: validatedData.idNumber,
        nin: validatedData.nin,
        nationalite: validatedData.nationalite,
        wilaya: validatedData.wilaya,
        dateNaissance: validatedData.dateNaissance,
        lieuNaissance: validatedData.lieuNaissance || "",
        clientSource: validatedData.clientSource,
        email: validatedData.email || "",
        phoneNumber: validatedData.phoneNumber || "",
        mobilePhone: validatedData.mobilePhone || "",
        address: validatedData.address || "",
        iobType: validatedData.iobType,
        iobCategory: validatedData.iobCategory,
        hasCompteTitre: validatedData.hasCompteTitre,
        numeroCompteTitre: validatedData.numeroCompteTitre || "",
        ribBanque: validatedData.ribBanque || "",
        ribAgence: validatedData.ribAgence || "",
        ribCompte: validatedData.ribCompte || "",
        ribCle: validatedData.ribCle || "",
        observation: validatedData.observation || "",
        isEmployeeCPA: validatedData.isEmployeeCPA || false,
        matricule: validatedData.matricule || "",
        poste: validatedData.poste || "",
        agenceCPA: validatedData.agenceCPA || "",
        selectedAgence: validatedData.selectedAgence || "",
      } as PersonnePhysiqueClient;
    } else if (validatedData.clientType === "personne_morale") {
      newClient = {
        ...baseClient,
        clientType: "personne_morale",
        raisonSociale: validatedData.raisonSociale,
        nif: validatedData.nif,
        regNumber: validatedData.regNumber,
        legalForm: validatedData.legalForm,
        clientSource: validatedData.clientSource,
        email: validatedData.email || "",
        phoneNumber: validatedData.phoneNumber || "",
        mobilePhone: validatedData.mobilePhone || "",
        address: validatedData.address || "",
        iobType: validatedData.iobType,
        iobCategory: validatedData.iobCategory,
        hasCompteTitre: validatedData.hasCompteTitre,
        numeroCompteTitre: validatedData.numeroCompteTitre || "",
        ribBanque: validatedData.ribBanque || "",
        ribAgence: validatedData.ribAgence || "",
        ribCompte: validatedData.ribCompte || "",
        ribCle: validatedData.ribCle || "",
        observation: validatedData.observation || "",
        isEmployeeCPA: validatedData.isEmployeeCPA || false,
        matricule: validatedData.matricule || "",
        poste: validatedData.poste || "",
        agenceCPA: validatedData.agenceCPA || "",
        selectedAgence: validatedData.selectedAgence || "",
      } as PersonneMoraleClient;
    } else {
      newClient = {
        ...baseClient,
        clientType: "institution_financiere",
        raisonSociale: validatedData.raisonSociale,
        nif: validatedData.nif,
        regNumber: validatedData.regNumber,
        legalForm: validatedData.legalForm,
        clientSource: validatedData.clientSource,
        email: validatedData.email || "",
        phoneNumber: validatedData.phoneNumber || "",
        mobilePhone: validatedData.mobilePhone || "",
        address: validatedData.address || "",
        iobType: validatedData.iobType,
        iobCategory: validatedData.iobCategory,
        hasCompteTitre: validatedData.hasCompteTitre,
        numeroCompteTitre: validatedData.numeroCompteTitre || "",
        ribBanque: validatedData.ribBanque || "",
        ribAgence: validatedData.ribAgence || "",
        ribCompte: validatedData.ribCompte || "",
        ribCle: validatedData.ribCle || "",
        observation: validatedData.observation || "",
        isEmployeeCPA: validatedData.isEmployeeCPA || false,
        matricule: validatedData.matricule || "",
        poste: validatedData.poste || "",
        agenceCPA: validatedData.agenceCPA || "",
        selectedAgence: validatedData.selectedAgence || "",
      } as InstitutionFinanciereClient;
    }

    mockClients.push(newClient);
    return { ...newClient }; // Return a copy to prevent direct mutation
  } catch (error) {
    if (error instanceof ClientError) throw error;
    throw new ClientError("Failed to create client", "CREATE_ERROR");
  }
}

export async function updateClient(
  id: number,
  data: ClientFormValues
): Promise<Client> {
  try {
    await delay(500);

    // Validate input data
    const validatedData = validateClientData(data);

    const index = mockClients.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new ClientError(`Client with id ${id} not found`, "NOT_FOUND");
    }

    const existingClient = mockClients[index];
    const baseClient = {
      id,
      status: existingClient.status,
      createdAt: existingClient.createdAt,
      updatedAt: new Date(),
    };

    let updatedClient: Client;

    if (validatedData.clientType === "personne_physique") {
      updatedClient = {
        ...baseClient,
        clientType: "personne_physique",
        name: validatedData.name,
        idType: validatedData.idType,
        idNumber: validatedData.idNumber,
        nin: validatedData.nin,
        nationalite: validatedData.nationalite,
        wilaya: validatedData.wilaya,
        dateNaissance: validatedData.dateNaissance,
        lieuNaissance: validatedData.lieuNaissance || "",
        clientSource: validatedData.clientSource,
        email: validatedData.email || "",
        phoneNumber: validatedData.phoneNumber || "",
        mobilePhone: validatedData.mobilePhone || "",
        address: validatedData.address || "",
        iobType: validatedData.iobType,
        iobCategory: validatedData.iobCategory,
        hasCompteTitre: validatedData.hasCompteTitre,
        numeroCompteTitre: validatedData.numeroCompteTitre || "",
        ribBanque: validatedData.ribBanque || "",
        ribAgence: validatedData.ribAgence || "",
        ribCompte: validatedData.ribCompte || "",
        ribCle: validatedData.ribCle || "",
        observation: validatedData.observation || "",
        isEmployeeCPA: validatedData.isEmployeeCPA || false,
        matricule: validatedData.matricule || "",
        poste: validatedData.poste || "",
        agenceCPA: validatedData.agenceCPA || "",
        selectedAgence: validatedData.selectedAgence || "",
      } as PersonnePhysiqueClient;
    } else if (validatedData.clientType === "personne_morale") {
      updatedClient = {
        ...baseClient,
        clientType: "personne_morale",
        raisonSociale: validatedData.raisonSociale,
        nif: validatedData.nif,
        regNumber: validatedData.regNumber,
        legalForm: validatedData.legalForm,
        clientSource: validatedData.clientSource,
        email: validatedData.email || "",
        phoneNumber: validatedData.phoneNumber || "",
        mobilePhone: validatedData.mobilePhone || "",
        address: validatedData.address || "",
        iobType: validatedData.iobType,
        iobCategory: validatedData.iobCategory,
        hasCompteTitre: validatedData.hasCompteTitre,
        numeroCompteTitre: validatedData.numeroCompteTitre || "",
        ribBanque: validatedData.ribBanque || "",
        ribAgence: validatedData.ribAgence || "",
        ribCompte: validatedData.ribCompte || "",
        ribCle: validatedData.ribCle || "",
        observation: validatedData.observation || "",
        isEmployeeCPA: validatedData.isEmployeeCPA || false,
        matricule: validatedData.matricule || "",
        poste: validatedData.poste || "",
        agenceCPA: validatedData.agenceCPA || "",
        selectedAgence: validatedData.selectedAgence || "",
      } as PersonneMoraleClient;
    } else {
      updatedClient = {
        ...baseClient,
        clientType: "institution_financiere",
        raisonSociale: validatedData.raisonSociale,
        nif: validatedData.nif,
        regNumber: validatedData.regNumber,
        legalForm: validatedData.legalForm,
        clientSource: validatedData.clientSource,
        email: validatedData.email || "",
        phoneNumber: validatedData.phoneNumber || "",
        mobilePhone: validatedData.mobilePhone || "",
        address: validatedData.address || "",
        iobType: validatedData.iobType,
        iobCategory: validatedData.iobCategory,
        hasCompteTitre: validatedData.hasCompteTitre,
        numeroCompteTitre: validatedData.numeroCompteTitre || "",
        ribBanque: validatedData.ribBanque || "",
        ribAgence: validatedData.ribAgence || "",
        ribCompte: validatedData.ribCompte || "",
        ribCle: validatedData.ribCle || "",
        observation: validatedData.observation || "",
        isEmployeeCPA: validatedData.isEmployeeCPA || false,
        matricule: validatedData.matricule || "",
        poste: validatedData.poste || "",
        agenceCPA: validatedData.agenceCPA || "",
        selectedAgence: validatedData.selectedAgence || "",
      } as InstitutionFinanciereClient;
    }

    mockClients[index] = updatedClient;
    return { ...updatedClient }; // Return a copy to prevent direct mutation
  } catch (error) {
    if (error instanceof ClientError) throw error;
    throw new ClientError("Failed to update client", "UPDATE_ERROR");
  }
}

export async function deleteClient(id: number): Promise<void> {
  try {
    await delay(500);

    const index = mockClients.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new ClientError(`Client with id ${id} not found`, "NOT_FOUND");
    }

    mockClients.splice(index, 1);
  } catch (error) {
    if (error instanceof ClientError) throw error;
    throw new ClientError("Failed to delete client", "DELETE_ERROR");
  }
}

export async function uploadClientDocuments(
  documents: {
    clientId: number;
    documentId: number;
    file: File;
    status: string;
  }[]
): Promise<void> {
  try {
    await delay(500);

    // Validate client exists for each document
    for (const doc of documents) {
      const clientExists = mockClients.some((c) => c.id === doc.clientId);
      if (!clientExists) {
        throw new ClientError(
          `Client with id ${doc.clientId} not found`,
          "NOT_FOUND"
        );
      }
    }

    // Convert File objects to serializable format
    const processedDocuments = await Promise.all(
      documents.map(async (doc) => {
        const arrayBuffer = await doc.file.arrayBuffer();
        return {
          ...doc,
          file: {
            name: doc.file.name,
            type: doc.file.type,
            data: arrayBuffer,
          },
        };
      })
    );

    mockClientDocuments.push(...processedDocuments);
  } catch (error) {
    if (error instanceof ClientError) throw error;
    throw new ClientError("Failed to upload documents", "UPLOAD_ERROR");
  }
}

export async function createClientUsers(users: ClientUser[]): Promise<void> {
  try {
    await delay(500);

    // Validate client exists for each user
    for (const user of users) {
      const clientExists = mockClients.some((c) => c.id === user.clientId);
      if (!clientExists) {
        throw new ClientError(
          `Client with id ${user.clientId} not found`,
          "NOT_FOUND"
        );
      }
    }

    mockClientUsers.push(...users);
  } catch (error) {
    if (error instanceof ClientError) throw error;
    throw new ClientError("Failed to create client users", "CREATE_ERROR");
  }
}

export async function getClientDocuments(
  clientId: number
): Promise<ClientDocument[]> {
  try {
    await delay(500);

    // Validate client exists
    const clientExists = mockClients.some((c) => c.id === clientId);
    if (!clientExists) {
      throw new ClientError(
        `Client with id ${clientId} not found`,
        "NOT_FOUND"
      );
    }

    return mockClientDocuments.filter((doc) => doc.clientId === clientId);
  } catch (error) {
    if (error instanceof ClientError) throw error;
    throw new ClientError("Failed to fetch client documents", "FETCH_ERROR");
  }
}

export async function getClientUsers(clientId: number): Promise<ClientUser[]> {
  try {
    await delay(500);

    // Validate client exists
    const clientExists = mockClients.some((c) => c.id === clientId);
    if (!clientExists) {
      throw new ClientError(
        `Client with id ${clientId} not found`,
        "NOT_FOUND"
      );
    }

    return mockClientUsers.filter((user) => user.clientId === clientId);
  } catch (error) {
    if (error instanceof ClientError) throw error;
    throw new ClientError("Failed to fetch client users", "FETCH_ERROR");
  }
}
