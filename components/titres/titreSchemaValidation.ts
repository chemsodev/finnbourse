import { z } from "zod";

export const StockPriceSchema = z.object({
  price: z.number().min(0, "Price must be positive"),
  date: z.date(),
  gap: z.number().optional(),
});

export const InstitutionSchema = z.object({
  id: z.string(),
  name: z.string(),
});

export const TitreSchema = z.object({
  name: z.string().min(1, "Name is required"),
  issuer: z.string().min(1, "Issuer ID is required"),
  isinCode: z.string().min(1, "ISIN code is required"),
  code: z.string().min(1, "Code is required"),
  faceValue: z.number().min(0, "Face value must be positive"),
  quantity: z.number().min(1, "Quantity must be at least 1"),
  emissionDate: z.date(),
  closingDate: z.date(),
  enjoymentDate: z.date(),
  marketListing: z.string().min(1, "Market listing is required"),
  type: z.string().min(1, "Type is required"),
  status: z.enum(["activated", "suspended", "expired"]),
  dividendRate: z.number().min(0).optional(),
  capitalOperation: z.string().optional(),
  commission: z.number().min(0).optional(),
  shareClass: z.string().optional(),
  votingRights: z.boolean().optional(),
  master: z.string().optional(),
  institutions: z.array(InstitutionSchema).optional(),
  stockPrice: StockPriceSchema,
});

export type TitreFormValues = z.infer<typeof TitreSchema>;
export type StockPrice = z.infer<typeof StockPriceSchema>;
export type Institution = z.infer<typeof InstitutionSchema>;
