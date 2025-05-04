import type {
  DividendPayment,
  DividendPaymentFormValues,
} from "@/app/[locale]/(main)/(ost)/paiement-de-dividendes/schema";

// Mock data - replace with actual API calls in production
const mockDividendPayments: DividendPayment[] = [
  {
    id: 1,
    titrePrincipal: "Sonatrach Bonds",
    referenceost: "DIV-2025-001",
    evenement: "primaire",
    dateExecution: new Date("2025-06-01"),
    dateValeurPaiement: new Date("2025-06-15"),
    prixUnitaireNet: "1000",
    descriptionOst: "Paiement dividende 2024",
    commentaire: "Distribution dividendes annuels",
  },
];

export async function getDividendPayments() {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockDividendPayments;
}

export async function getDividendPaymentById(id: number) {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockDividendPayments.find((payment) => payment.id === id) || null;
}

export async function createDividendPayment(data: DividendPaymentFormValues) {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const newPayment: DividendPayment = {
    ...data,
    id: Math.max(...mockDividendPayments.map((p) => p.id)) + 1,
  };
  mockDividendPayments.push(newPayment);
  return newPayment;
}

export async function updateDividendPayment(
  id: number,
  data: DividendPaymentFormValues
) {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const index = mockDividendPayments.findIndex((payment) => payment.id === id);
  if (index === -1) throw new Error("Payment not found");

  const updatedPayment: DividendPayment = { ...data, id };
  mockDividendPayments[index] = updatedPayment;
  return updatedPayment;
}

export async function deleteDividendPayment(id: number) {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const index = mockDividendPayments.findIndex((payment) => payment.id === id);
  if (index === -1) throw new Error("Payment not found");

  mockDividendPayments.splice(index, 1);
}
