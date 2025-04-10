"use server";

import { revalidatePath } from "next/cache";

// Define the Emission type based on your form
export type Emission = {
  id: string;
  codeISIN: string;
  issuer: string;
  centralizingAgency: string;
  viewAccountNumber: string;
  typeOfBroadcast: string;
  issueAmount: string;
  issueDate: string;
  dueDate: string;
  duration: string;
  cosobApproval: string;
  leader: string;
  coLead: string;
  memberNo01: string;
  memberNo02: string;
  memberNo03: string;
  memberNo04: string;
};

// In-memory storage for emissions (replace with database in production)
let emissions: Emission[] = [
  {
    id: "1",
    codeISIN: "DZ0000010101",
    issuer: "Sonatrach",
    centralizingAgency: "BNA",
    viewAccountNumber: "12345678",
    typeOfBroadcast: "Public",
    issueAmount: "150 000 000 000 DA",
    issueDate: "2023-03-15",
    dueDate: "2028-03-15",
    duration: "5 ans",
    cosobApproval: "COSOB-2023-01",
    leader: "BNA",
    coLead: "BEA",
    memberNo01: "CPA",
    memberNo02: "BDL",
    memberNo03: "BADR",
    memberNo04: "CNEP",
  },
  {
    id: "2",
    codeISIN: "DZ0000012345",
    issuer: "Sonelgaz",
    centralizingAgency: "BEA",
    viewAccountNumber: "87654321",
    typeOfBroadcast: "Private",
    issueAmount: "100 000 000 000 DA",
    issueDate: "2023-06-10",
    dueDate: "2026-06-10",
    duration: "3 ans",
    cosobApproval: "COSOB-2023-05",
    leader: "BEA",
    coLead: "CPA",
    memberNo01: "BNA",
    memberNo02: "BADR",
    memberNo03: "",
    memberNo04: "",
  },
  {
    id: "3",
    codeISIN: "DZ0000013579",
    issuer: "Air Algérie",
    centralizingAgency: "CPA",
    viewAccountNumber: "24681357",
    typeOfBroadcast: "Public",
    issueAmount: "75 000 000 000 DA",
    issueDate: "2023-09-20",
    dueDate: "2028-09-20",
    duration: "5 ans",
    cosobApproval: "COSOB-2023-09",
    leader: "CPA",
    coLead: "BNA",
    memberNo01: "BEA",
    memberNo02: "",
    memberNo03: "",
    memberNo04: "",
  },
  {
    id: "4",
    codeISIN: "DZ0000024680",
    issuer: "CAAT",
    centralizingAgency: "BADR",
    viewAccountNumber: "97531246",
    typeOfBroadcast: "Private",
    issueAmount: "50 000 000 000 DA",
    issueDate: "2024-01-15",
    dueDate: "2029-01-15",
    duration: "5 ans",
    cosobApproval: "COSOB-2024-01",
    leader: "BADR",
    coLead: "BDL",
    memberNo01: "BNA",
    memberNo02: "CPA",
    memberNo03: "BEA",
    memberNo04: "",
  },
  {
    id: "5",
    codeISIN: "DZ0000035792",
    issuer: "Groupe SAIDAL",
    centralizingAgency: "BDL",
    viewAccountNumber: "36925814",
    typeOfBroadcast: "Public",
    issueAmount: "40 000 000 000 DA",
    issueDate: "2024-02-20",
    dueDate: "2026-02-20",
    duration: "2 ans",
    cosobApproval: "COSOB-2024-02",
    leader: "BDL",
    coLead: "CNEP",
    memberNo01: "BNA",
    memberNo02: "",
    memberNo03: "",
    memberNo04: "",
  },
];

// Create a new emission
export async function createEmission(formData: FormData) {
  const emission: Emission = {
    id: Date.now().toString(), // Simple ID generation
    codeISIN: formData.get("codeISIN") as string,
    issuer: formData.get("issuer") as string,
    centralizingAgency: formData.get("centralizingAgency") as string,
    viewAccountNumber: formData.get("viewAccountNumber") as string,
    typeOfBroadcast: formData.get("typeOfBroadcast") as string,
    issueAmount: formData.get("issueAmount") as string,
    issueDate: formData.get("issueDate") as string,
    dueDate: formData.get("dueDate") as string,
    duration: formData.get("duration") as string,
    cosobApproval: formData.get("cosobApproval") as string,
    leader: formData.get("leader") as string,
    coLead: formData.get("coLead") as string,
    memberNo01: formData.get("memberNo01") as string,
    memberNo02: formData.get("memberNo02") as string,
    memberNo03: formData.get("memberNo03") as string,
    memberNo04: formData.get("memberNo04") as string,
  };

  emissions.push(emission);
  revalidatePath("/emissions");
  return { success: true, message: "Émission créée avec succès" };
}

// Get all emissions
export async function getEmissions() {
  return emissions;
}

// Get a single emission by ID
export async function getEmission(id: string) {
  return emissions.find((emission) => emission.id === id);
}

// Update an emission
export async function updateEmission(id: string, formData: FormData) {
  const index = emissions.findIndex((emission) => emission.id === id);

  if (index !== -1) {
    emissions[index] = {
      ...emissions[index],
      codeISIN: formData.get("codeISIN") as string,
      issuer: formData.get("issuer") as string,
      centralizingAgency: formData.get("centralizingAgency") as string,
      viewAccountNumber: formData.get("viewAccountNumber") as string,
      typeOfBroadcast: formData.get("typeOfBroadcast") as string,
      issueAmount: formData.get("issueAmount") as string,
      issueDate: formData.get("issueDate") as string,
      dueDate: formData.get("dueDate") as string,
      duration: formData.get("duration") as string,
      cosobApproval: formData.get("cosobApproval") as string,
      leader: formData.get("leader") as string,
      coLead: formData.get("coLead") as string,
      memberNo01: formData.get("memberNo01") as string,
      memberNo02: formData.get("memberNo02") as string,
      memberNo03: formData.get("memberNo03") as string,
      memberNo04: formData.get("memberNo04") as string,
    };
    revalidatePath("/emissions");
    return { success: true, message: "Émission mise à jour avec succès" };
  }

  return { success: false, message: "Émission non trouvée" };
}

// Delete an emission
export async function deleteEmission(id: string) {
  const initialLength = emissions.length;
  emissions = emissions.filter((emission) => emission.id !== id);

  if (emissions.length < initialLength) {
    revalidatePath("/emissions");
    return { success: true, message: "Émission supprimée avec succès" };
  }

  return { success: false, message: "Émission non trouvée" };
}
