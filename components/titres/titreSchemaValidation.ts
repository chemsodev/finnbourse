import { z } from "zod";

export const StockPriceSchema = z.object({
  price: z.number().min(0, "Price must be positive"),
  date: z.date(),
  gap: z.number().optional(),
});

export const IssuerSchema = z.object({
  id: z.string().min(1, "Issuer ID is required"),
  name: z.string().min(1, "Issuer name is required"),
});

export const InstitutionSchema = z.object({
  id: z.string(),
  institutionName: z.string().optional(),
  taxIdentificationNumber: z.string().optional(),
  agreementNumber: z.string().optional(),
  legalForm: z.string().optional(),
  establishmentDate: z.string().optional(),
  fullAddress: z.string().optional(),
});

export const StockTypeSchema = z.enum([
  "action",
  "obligation",
  "sukuk",
  "obligationsOrdinaires",
  "oat",
]);

// export const ObligationTypeSchema = z.enum([
//   "obligationsOrdinaires",
//   "sukuk",
//   "oat",
// ]);

export const MarketListingSchema = z.enum(["PME", "PRINCIPAL"]);

// Market Type Schema
export const MasterSchema = z
  .object({
    id: z.string(),
    institutionName: z.string().optional(),
    agreementNumber: z.string().optional(),
  })
  .optional();

// Capital Repayment Schedule Item Schema
export const CapitalRepaymentScheduleItemSchema = z.object({
  date: z.date(),
  rate: z
    .number()
    .min(0, "Rate must be positive")
    .max(100, "Rate cannot exceed 100%"),
});

export const CouponScheduleItemSchema = z.object({
  date: z.date(),
  rate: z
    .number()
    .min(0, "Rate must be positive")
    .max(100, "Rate cannot exceed 100%"),
});

// Titre Schema
export const TitreSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  stockType: StockTypeSchema,
  issuer: z.string().min(1, "Issuer ID is required"),
  // issuer: IssuerSchema,
  isinCode: z.string().min(1, "ISIN code is required"),
  code: z.string().min(1, "Code is required"),
  faceValue: z.number().min(0, "Face value must be positive"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  emissionDate: z.date(),
  closingDate: z.date(),
  enjoymentDate: z.date(),
  marketListing: MarketListingSchema,
  // type: StockTypeSchema, // This can be "obligation", "action", etc.
  status: z.enum(["activated", "deactivated", "delisted"]),
  dividendRate: z.number().min(0).optional(),
  capitalOperation: z
    .enum([
      "augmentation",
      "ouverture",
      "empruntObligatairePublic",
      "empruntObligataireInstitutionnel",
      "placementOrganise",
    ])
    .optional(),
  maturityDate: z.date().optional(),
  durationYears: z.number().min(1).max(30).optional(),
  nombreDeTranches: z.number().min(1).optional(),
  // paymentSchedule: z.array(PaymentScheduleItemSchema).optional(),
  commission: z.number().min(0).optional(),
  shareClass: z.string().optional(),
  votingRights: z.boolean().optional(),
  master: z.string().optional(),
  institutions: z.array(z.string()).optional(),
  price: z.number().optional(),
  stockPrice: StockPriceSchema.optional(),
  // isPrimary: z.boolean().optional(),
  capitalRepaymentSchedule: z
    .array(CapitalRepaymentScheduleItemSchema)
    .optional()
    .default([])
    .refine(
      (arr) => {
        const dates = arr.map((item) => item.date.getTime());
        const uniqueDates = new Set(dates);
        return uniqueDates.size === dates.length;
      },
      {
        message: "Date values in capitalRepaymentSchedule must be unique",
      }
    ),
  couponSchedule: z
    .array(CouponScheduleItemSchema)
    .optional()
    .default([])
    .refine(
      (arr) => {
        const dates = arr.map((item) => item.date.getTime());
        const uniqueDates = new Set(dates);
        return uniqueDates.size === dates.length;
      },
      {
        message: "Date values in couponSchedule must be unique",
      }
    ),
});

export type TitreFormValues = z.infer<typeof TitreSchema>;
export type StockPrice = z.infer<typeof StockPriceSchema>;
export type Institution = z.infer<typeof InstitutionSchema>;
