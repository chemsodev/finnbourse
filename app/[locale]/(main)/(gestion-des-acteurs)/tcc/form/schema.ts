import * as z from "zod";

// Schema for the Account Holder Custodian details (Step 1)
export const custodianFormSchema = z.object({
  code: z.string().min(1, "Code is required"),
  libelle: z.string().min(1, "Label is required"),
  typeCompte: z.enum(["DEPOSIT", "SECURITIES", "BOTH"], {
    required_error: "Account type is required",
  }),
  statut: z.enum(["ACTIVE", "INACTIVE"], {
    required_error: "Status is required",
    invalid_type_error: "Status must be either ACTIVE or INACTIVE",
  }),
  dateCreation: z.string().optional(),

  // Banking information (optional for TCC)
  swift: z.string().optional(),
  iban: z.string().optional(),
  numeroCompte: z.string().optional(),
  devise: z.string().optional(),

  // Address (required fields)
  adresse: z.string().min(1, "Address is required"),
  codePostal: z.string().min(1, "Postal code is required"),
  ville: z.string().min(1, "City is required"),
  pays: z.string().min(1, "Country is required"),

  // Contact information (required)
  telephone: z.string().min(1, "Phone number is required"),
  email: z.string().email().min(1, "Email is required"),
  // Regulatory information
  numeroAgrement: z.string().min(1, "Agreement number is required"),
  dateAgrement: z.string().min(1, "Agreement date is required"),
  autoriteSurveillance: z.string().min(1, "Surveillance authority is required"),

  // Correspondent
  codeCorrespondant: z.string().optional(),
  nomCorrespondant: z.string().optional(),
  // Financial Institution ID (required for backend)
  financialInstitutionId: z
    .string()
    .min(1, "Financial Institution is required"),

  // Legacy fields for backward compatibility
  commissionFixe: z.string().optional(),
  commissionVariable: z.string().optional(),
  tauxTva: z.string().optional(),
  commentaire: z.string().optional(),
});

// Schema for related users (Step 2)
export const relatedUserSchema = z.object({
  id: z.string().optional(), // Only present when editing an existing user
  firstname: z.string().min(1, "First name is required").optional(),
  lastname: z.string().min(1, "Last name is required").optional(),
  email: z.string().email("Valid email is required").optional(),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters")
    .optional(),
  telephone: z.string().optional(),
  status: z.enum(["actif", "inactif", "active", "inactive"], {
    required_error: "Status is required",
  }),
  positionTcc: z.string().optional(),
  role: z.array(z.string()).optional(),

  // Enhanced fields for the new form
  fullName: z.string().min(2, "Full name is required"),
  position: z.string().min(2, "Position is required"),
  roles: z.array(z.string()).default([]),
  type: z.string().min(1, "Type is required"),
  organization: z.string().optional(),
  phone: z.string().optional(),
  matricule: z.string().optional(),
});

export const relatedUsersFormSchema = z.object({
  users: z.array(relatedUserSchema),
});

// Combined schema for the entire form
export const combinedFormSchema = z.object({
  custodian: custodianFormSchema,
  relatedUsers: z.array(relatedUserSchema),
  tccId: z.string().optional(), // Store TCC ID after creation
});

export type CustodianFormValues = z.infer<typeof custodianFormSchema>;
export type RelatedUserFormValues = z.infer<typeof relatedUserSchema>;
export type RelatedUsersFormValues = z.infer<typeof relatedUsersFormSchema>;
export type CombinedFormValues = z.infer<typeof combinedFormSchema>;
