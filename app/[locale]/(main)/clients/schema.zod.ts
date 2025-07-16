import { z } from "zod";

// Common fields shared between individual and company schemas
const commonClientDetailsSchema = z.object({
  wilaya: z.string().min(1, "wilaya is required"),
  address: z.string().min(1, "address is required"),
});

const individualSchema = commonClientDetailsSchema.extend({
  name: z.string().min(1, "name is required"),
  id_number: z.string().min(1, "id_number is required"),
  nin: z.string().min(1, "nin is required"),
  nationalite: z.string().min(1, "nationalite is required"),
  birth_date: z.coerce.date({
    message: "birth_date must be a valid date",
  }),
  lieu_naissance: z.string().min(1, "lieu_naissance is required"),
  employe_a_la_institution_financiere: z.string().nullable(), // selected institution or null
});

const companySchema = commonClientDetailsSchema.extend({
  raison_sociale: z.string().min(1, "raison_sociale is required"),
  nif: z.string().min(1, "nif is required"),
  reg_number: z.string().min(1, "reg_number is required"),
  legal_form: z.string().min(1, "legal_form is required"),
});

const baseClientSchema = z.object({
  client_code: z.string().min(1, "client_code is required"),
  email: z.string().email("valid email is required"),
  phone_number: z.string().min(1, "phone_number is required"),
  id_type: z.enum(["passport", "driving_license", "CN", "RC"], {
    errorMap: () => ({
      message: "id_type must be one of: passport, driving_license, CN, RC",
    }),
  }),
  cash_account_bank_code: z
    .string()
    .min(3, "cash_account_bank_code is required")
    .max(3, "cash_account_bank_code must be exactly 3 digits"),
  cash_account_agency_code: z
    .string()
    .min(5, "cash_account_agency_code is required")
    .max(5, "cash_account_agency_code must be exactly 5 digits"),
  cash_account_number: z
    .string()
    .min(10, "cash_account_number is required")
    .max(10, "cash_account_number must be exactly 10 digits"),
  cash_account_rip_key: z
    .string()
    .min(2, "cash_account_rip_key is required")
    .max(2, "cash_account_rip_key must be exactly 2 digits"),
  cash_account_rip_full: z
    .string()
    .min(20, "cash_account_rip_full is required")
    .max(20, "cash_account_rip_full must be at most 20 digits"),
  securities_account_number: z
    .string()
    .min(1, "securities_account_number is required"),
});

// Create individual client schema
const individualClientSchema = baseClientSchema
  .merge(individualSchema)
  .extend({
    type: z.literal("individual"),
  })
  .strict();

// Create company client schema
const companyClientSchema = baseClientSchema
  .merge(companySchema)
  .extend({
    type: z.literal("company"),
  })
  .strict();

// Using discriminatedUnion with only individual and company types
export const CreateClientSchema = z.discriminatedUnion("type", [
  individualClientSchema,
  companyClientSchema,
]);

// A unified schema for the DTO class, making all specific fields optional
const createClientDtoSchema = baseClientSchema
  .extend({
    type: z.enum(["individual", "company"]),
  })
  .merge(individualSchema.partial())
  .merge(companySchema.partial());

// Export the DTO schema directly
export const CreateClientDto = createClientDtoSchema;

// Types for the schemas
export type CreateClientDtoType = z.infer<typeof CreateClientSchema>;
export type CreateClientDtoSchemaType = z.infer<typeof createClientDtoSchema>;
