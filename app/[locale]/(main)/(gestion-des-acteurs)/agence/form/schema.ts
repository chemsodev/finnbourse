import { z } from "zod";

// Agence form schema
export const agenceFormSchema = z.object({
  financialInstitutionId: z
    .string()
    .min(1, { message: "Financial Institution is required" }),
  code: z.string().min(1, { message: "Agency code is required" }),
  address: z.string().min(1, { message: "Address is required" }),
  code_swift: z.string().min(1, { message: "SWIFT/BIC code is required" }),
  currency: z.string().default("DZD"),
  director_name: z.string().min(1, { message: "Director name is required" }),
  director_email: z
    .string()
    .email({ message: "Valid director email is required" }),
  director_phone: z.string().min(1, { message: "Director phone is required" }),
});

export type AgenceFormValues = z.infer<typeof agenceFormSchema>;

// Related user form schema
export const relatedUserFormSchema = z.object({
  id: z.string().optional(),
  fullName: z.string().min(1, { message: "Full name is required" }),
  email: z.string().email({ message: "Valid email is required" }),
  password: z
    .string()
    .min(6, { message: "Password must be at least 6 characters" }),
  phone: z.string().optional(),
  position: z.string().optional(),
  matricule: z
    .string()
    .min(1, { message: "Employee ID/Matricule is required" }),
  organization: z.string().min(1, { message: "Organization is required" }),
  roles: z.array(z.string()).default([]),
  status: z.enum(["active", "inactive", "pending"]).default("active"),
});

export type RelatedUserFormValues = z.infer<typeof relatedUserFormSchema>;

// Combined form values for the entire multi-step process
export interface CombinedFormValues {
  agence: AgenceFormValues;
  relatedUsers: RelatedUserFormValues[];
  agenceId?: string; // Will be set after agence creation
}
