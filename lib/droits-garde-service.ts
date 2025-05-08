import type {
  DroitsGarde,
  DroitsGardeFormValues,
} from "@/app/[locale]/(main)/(ost)/paiement-droits-de-garde/schema";

// Mock data - replace with actual API calls in production
const mockDroitsGarde: DroitsGarde[] = [
  {
    id: 1,
    titrePrincipal: "SAIDAL",
    referenceost: "DG-2025-001",
    descriptionOst: "Paiement droits de garde 2024",
    dateExecution: new Date("2025-06-01"),
    actionAnc: "1000",
    titreResultant: "SAIDAL",
    nouvelleAction: "1000",
    commentaire: "Paiement annuel des droits de garde",
  },
  {
    id: 2,
    titrePrincipal: "ALLIANCE",
    referenceost: "DG-2025-002",
    descriptionOst: "Paiement droits de garde T1 2025",
    dateExecution: new Date("2025-03-15"),
    actionAnc: "500",
    titreResultant: "ALLIANCE",
    nouvelleAction: "500",
    commentaire: "Paiement trimestriel des droits de garde",
  },
];

export async function getDroitsGarde() {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockDroitsGarde;
}

export async function getDroitsGardeById(id: number) {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockDroitsGarde.find((payment) => payment.id === id) || null;
}

export async function createDroitsGarde(data: DroitsGardeFormValues) {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const newPayment: DroitsGarde = {
    ...data,
    id: Math.max(...mockDroitsGarde.map((p) => p.id)) + 1,
  };
  mockDroitsGarde.push(newPayment);
  return newPayment;
}

export async function updateDroitsGarde(
  id: number,
  data: DroitsGardeFormValues
) {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const index = mockDroitsGarde.findIndex((payment) => payment.id === id);
  if (index === -1) throw new Error("Payment not found");

  const updatedPayment: DroitsGarde = { ...data, id };
  mockDroitsGarde[index] = updatedPayment;
  return updatedPayment;
}

export async function deleteDroitsGarde(id: number) {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const index = mockDroitsGarde.findIndex((payment) => payment.id === id);
  if (index === -1) throw new Error("Payment not found");

  mockDroitsGarde.splice(index, 1);
}
