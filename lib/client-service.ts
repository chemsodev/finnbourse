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
  id: string;
  clientId: number;
  firstName: string;
  lastName: string;
  role: string;
  address: string;
  wilaya: string;
  nationality: string;
  birthDate: string;
  idNumber: string;
  userType: "proprietaire" | "mandataire" | "tuteur_legal";
  status: "active" | "inactive";
  password?: string;
  roles?: string[]; // Support multiple roles
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

// Mock data for testing
const mockClients: Client[] = [
  {
    id: 1,
    clientType: "personne_physique",
    clientCode: "CLI001",
    clientSource: "CPA",
    name: "Ahmed Benali",
    email: "ahmed.benali@example.com",
    phoneNumber: "+213 5 55 12 34 56",
    mobilePhone: "+213 6 61 23 45 67",
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
    numeroCompteTitre: "CT12345",
    ribBanque: "12345",
    ribAgence: "67890",
    ribCompte: "12345678901",
    ribCle: "23",
    observation: "",
    isEmployeeCPA: true,
    matricule: "EMP12345",
    poste: "Conseiller",
    agenceCPA: "Agence Centrale",
    selectedAgence: "Agence Centrale",
    status: "active",
    createdAt: new Date("2023-01-15"),
    updatedAt: new Date("2023-01-15"),
  } as PersonnePhysiqueClient,

  {
    id: 2,
    clientType: "personne_morale",
    clientCode: "CLI002",
    clientSource: "extern",
    name: "Société Exemple",
    email: "contact@societe-exemple.com",
    phoneNumber: "+213 5 55 98 76 54",
    mobilePhone: "+213 6 61 87 65 43",
    wilaya: "Oran",
    address: "456 Boulevard Business, Oran",
    iobType: "extern",
    iobCategory: null,
    hasCompteTitre: true,
    numeroCompteTitre: "CT67890",
    ribBanque: "54321",
    ribAgence: "09876",
    ribCompte: "10987654321",
    ribCle: "87",
    observation: "",
    isEmployeeCPA: false,
    matricule: "",
    poste: "",
    agenceCPA: "",
    selectedAgence: "Agence Partenaire",
    raisonSociale: "Société Exemple SARL",
    nif: "123456789012345",
    regNumber: "987654321",
    legalForm: "SARL",
    status: "active",
    createdAt: new Date("2023-02-20"),
    updatedAt: new Date("2023-02-20"),
  } as PersonneMoraleClient,

  {
    id: 3,
    clientType: "institution_financiere",
    clientCode: "CLI003",
    clientSource: "extern",
    name: "Banque Finance",
    email: "contact@banque-finance.com",
    phoneNumber: "+213 5 55 45 67 89",
    mobilePhone: "+213 6 61 54 76 98",
    wilaya: "Constantine",
    address: "789 Avenue Finance, Constantine",
    iobType: "extern",
    iobCategory: null,
    hasCompteTitre: true,
    numeroCompteTitre: "CT13579",
    ribBanque: "13579",
    ribAgence: "24680",
    ribCompte: "13579246801",
    ribCle: "35",
    observation: "",
    isEmployeeCPA: false,
    matricule: "",
    poste: "",
    agenceCPA: "",
    selectedAgence: "Siège Principal",
    raisonSociale: "Banque Finance SA",
    nif: "987654321098765",
    regNumber: "123456789",
    legalForm: "SA",
    status: "active",
    createdAt: new Date("2023-03-10"),
    updatedAt: new Date("2023-03-10"),
  } as InstitutionFinanciereClient,

  {
    id: 4,
    clientType: "personne_physique",
    clientCode: "CLI004",
    clientSource: "CPA",
    name: "Fatima Zahra",
    email: "fatima.zahra@example.com",
    phoneNumber: "+213 5 55 11 22 33",
    mobilePhone: "+213 6 61 22 33 44",
    idType: "nin",
    idNumber: "CD789012",
    nin: "987654321098",
    nationalite: "Algérienne",
    wilaya: "Annaba",
    address: "321 Rue Résidence, Annaba",
    dateNaissance: new Date("1985-05-15"),
    iobType: "intern",
    iobCategory: null,
    hasCompteTitre: false,
    numeroCompteTitre: "",
    ribBanque: "24680",
    ribAgence: "13579",
    ribCompte: "24680135792",
    ribCle: "46",
    observation: "",
    isEmployeeCPA: false,
    matricule: "",
    poste: "",
    agenceCPA: "",
    selectedAgence: "Agence Locale",
    status: "active",
    createdAt: new Date("2023-04-05"),
    updatedAt: new Date("2023-04-05"),
  } as PersonnePhysiqueClient,

  {
    id: 5,
    clientType: "personne_morale",
    clientCode: "CLI005",
    clientSource: "extern",
    name: "Tech Innovate",
    email: "info@tech-innovate.com",
    phoneNumber: "+213 5 55 99 88 77",
    mobilePhone: "+213 6 61 88 99 00",
    wilaya: "Sétif",
    address: "987 Zone Industrielle, Sétif",
    iobType: "extern",
    iobCategory: null,
    hasCompteTitre: true,
    numeroCompteTitre: "CT97531",
    ribBanque: "97531",
    ribAgence: "86420",
    ribCompte: "97531864209",
    ribCle: "75",
    observation: "Entreprise en pleine croissance",
    isEmployeeCPA: false,
    matricule: "",
    poste: "",
    agenceCPA: "",
    selectedAgence: "Agence des Entreprises",
    raisonSociale: "Tech Innovate SPA",
    nif: "543210987654321",
    regNumber: "012345678",
    legalForm: "SPA",
    status: "inactif",
    createdAt: new Date("2023-05-12"),
    updatedAt: new Date("2023-05-12"),
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
    id: "user1",
    clientId: 1,
    firstName: "John",
    lastName: "Doe",
    role: "Directeur",
    address: "123 Main St",
    wilaya: "Alger",
    nationality: "Algérienne",
    birthDate: "1980-01-01",
    idNumber: "123456789",
    userType: "proprietaire",
    status: "active",
  },
  {
    id: "user2",
    clientId: 1,
    firstName: "Jane",
    lastName: "Smith",
    role: "Comptable",
    address: "456 Oak St",
    wilaya: "Oran",
    nationality: "Algérienne",
    birthDate: "1985-05-15",
    idNumber: "987654321",
    userType: "mandataire",
    status: "active",
  },
  {
    id: "user3",
    clientId: 2,
    firstName: "Mohammed",
    lastName: "Ali",
    role: "initiator",
    address: "456 Business Ave, Oran",
    wilaya: "Oran",
    nationality: "Algérienne",
    birthDate: "1985-06-20",
    idNumber: "EF345678",
    userType: "proprietaire",
    status: "active",
  },
  {
    id: "user4",
    clientId: 2,
    firstName: "Fatima",
    lastName: "Benzine",
    role: "consultation",
    address: "456 Business Ave, Oran",
    wilaya: "Oran",
    nationality: "Algérienne",
    birthDate: "1988-09-10",
    idNumber: "GH901234",
    userType: "mandataire",
    status: "active",
  },
  {
    id: "user5",
    clientId: 3,
    firstName: "Karim",
    lastName: "Boudjemaa",
    role: "validator1",
    address: "789 Finance Street, Constantine",
    wilaya: "Constantine",
    nationality: "Algérienne",
    birthDate: "1982-12-05",
    idNumber: "IJ567890",
    userType: "proprietaire",
    status: "active",
  },
  {
    id: "user6",
    clientId: 4,
    firstName: "Sarah",
    lastName: "Smith",
    role: "initiator",
    address: "321 Personal Ave, Oran",
    wilaya: "Oran",
    nationality: "Algérienne",
    birthDate: "1985-05-15",
    idNumber: "KL123456",
    userType: "mandataire",
    status: "active",
  },
  {
    id: "user7",
    clientId: 5,
    firstName: "Ahmed",
    lastName: "Benali",
    role: "validator1",
    address: "567 Tech Park, Annaba",
    wilaya: "Annaba",
    nationality: "Algérienne",
    birthDate: "1987-08-25",
    idNumber: "MN789012",
    userType: "proprietaire",
    status: "active",
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
      status: "active" as const,
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
    // In a real app, you would fetch users from the database
    return [
      {
        id: "user1",
        clientId,
        firstName: "John",
        lastName: "Doe",
        role: "Directeur",
        address: "123 Main St",
        wilaya: "Alger",
        nationality: "Algérienne",
        birthDate: "1980-01-01",
        idNumber: "123456789",
        userType: "proprietaire",
        status: "active",
      },
      {
        id: "user2",
        clientId,
        firstName: "Jane",
        lastName: "Smith",
        role: "Comptable",
        address: "456 Oak St",
        wilaya: "Oran",
        nationality: "Algérienne",
        birthDate: "1985-05-15",
        idNumber: "987654321",
        userType: "mandataire",
        status: "active",
      },
    ];
  } catch (error) {
    throw new ClientError("Failed to fetch client users", "FETCH_ERROR");
  }
}
