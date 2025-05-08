// app/lib/coupon-service.ts
import type {
  CouponPayment,
  CouponPaymentFormValues,
} from "@/app/[locale]/(main)/(ost)/paiement-coupon/schema";

// Mock data - replace with actual API calls in production
const mockCouponPayments: CouponPayment[] = [
  {
    id: 1,
    titrePrincipal: "SAIDAL",
    referenceost: "CPN-2025-001",
    evenement: "primaire",
    dateExecution: new Date("2025-06-01"),
    dateValeurPaiement: new Date("2025-06-15"),
    prixUnitaireNet: "500",
    descriptionOst: "Paiement coupon trimestriel",
    commentaire: "Coupon Q1 2025",
  },
  {
    id: 2,
    titrePrincipal: "ALLIANCE",
    referenceost: "CPN-2025-002",
    evenement: "secondaire",
    dateExecution: new Date("2025-06-10"),
    dateValeurPaiement: new Date("2025-06-25"),
    prixUnitaireNet: "750",
    descriptionOst: "Paiement coupon semestriel",
    commentaire: "Coupon S1 2025",
  },
];

export async function getCouponPayments(): Promise<CouponPayment[]> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockCouponPayments;
}

export async function getCouponPaymentById(
  id: number
): Promise<CouponPayment | null> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockCouponPayments.find((payment) => payment.id === id) || null;
}

export async function createCouponPayment(
  data: CouponPaymentFormValues
): Promise<CouponPayment> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const newPayment: CouponPayment = {
    ...data,
    id: Math.max(0, ...mockCouponPayments.map((p) => p.id)) + 1,
  };
  mockCouponPayments.push(newPayment);
  return newPayment;
}

export async function updateCouponPayment(
  id: number,
  data: CouponPaymentFormValues
): Promise<CouponPayment> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const index = mockCouponPayments.findIndex((payment) => payment.id === id);
  if (index === -1) throw new Error("Coupon payment not found");

  const updatedPayment: CouponPayment = { ...data, id };
  mockCouponPayments[index] = updatedPayment;
  return updatedPayment;
}

export async function deleteCouponPayment(id: number): Promise<void> {
  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 1000));
  const index = mockCouponPayments.findIndex((payment) => payment.id === id);
  if (index === -1) throw new Error("Coupon payment not found");

  mockCouponPayments.splice(index, 1);
}
