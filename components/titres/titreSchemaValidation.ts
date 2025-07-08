import { Master } from "./../../types/gestionTitres";
import { MarketListing } from "@/types/gestionTitres";

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
  "participatif",
]);

export const MarketListingSchema = z.enum(["ALG", "TUN", "CAS"]);

export const MasterSchema = z
  .object({
    id: z.string(),
    institutionName: z.string().optional(),
    agreementNumber: z.string().optional(),
  })
  .optional();

export const PaymentScheduleItemSchema = z.object({
  date: z.date(),
  couponRate: z.number().min(0).max(100),
  capitalRate: z.number().min(0).max(100),
});

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
  // type: z.string().optional(),
  status: z.enum(["activated", "suspended", "delisted"]),
  dividendRate: z.number().min(0).optional(),
  capitalOperation: z.enum(["augmentation", "ouverture"]).optional(),
  // maturityDate: z.date().optional(),
  durationYears: z.number().min(1).max(30).optional(),
  paymentSchedule: z.array(PaymentScheduleItemSchema).optional(),
  commission: z.number().min(0).optional(),
  shareClass: z.string().optional(),
  votingRights: z.boolean().optional(),
  master: z.string().optional(),
  institutions: z.array(z.string()).optional(),
  stockPrice: StockPriceSchema,
  // isPrimary: z.boolean().optional(),
});

export type TitreFormValues = z.infer<typeof TitreSchema>;
export type StockPrice = z.infer<typeof StockPriceSchema>;
export type Institution = z.infer<typeof InstitutionSchema>;
