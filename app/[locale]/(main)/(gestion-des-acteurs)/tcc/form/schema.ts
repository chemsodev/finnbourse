import * as z from "zod";

// Schema for the Account Holder Custodian details (Step 1)
export const custodianFormSchema = z.object({
  code: z.string().min(1, "Code is required"),
  libelle: z.string().min(1, "Label is required"),
  typeCompte: z.string().min(1, "Account type is required"),
  statut: z.string().min(1, "Status is required"),
  dateCreation: z.string().optional(),

  // Banking information
  swift: z.string().optional(),
  iban: z.string().optional(),
  numeroCompte: z.string().optional(),
  devise: z.string().optional(),

  // Address
  adresse: z.string().min(1, "Address is required"),
  codePostal: z.string().min(1, "Postal code is required"),
  ville: z.string().min(1, "City is required"),
  pays: z.string().min(1, "Country is required"),

  // General information
  telephone: z.string().min(1, "Phone number is required"),
  email: z.string().email().min(1, "Email is required"),

  // Regulatory information
  numeroAgrement: z.string().optional(),
  dateAgrement: z.string().optional(),
  autoriteSurveillance: z.string().optional(),

  // Correspondent
  codeCorrespondant: z.string().optional(),
  nomCorrespondant: z.string().optional(),

  // Commissions
  commissionFixe: z.string().optional(),
  commissionVariable: z.string().optional(),
  tauxTva: z.string().optional(),

  // Comment
  commentaire: z.string().optional(),
});

// Schema for related users (Step 2)
export const relatedUserSchema = z.object({
  id: z.string().optional(), // Only present when editing an existing user
  fullName: z.string().min(1, "Full name is required"),
  position: z.string().min(1, "Position is required"),
  roles: z.array(z.string()).default([]), // Array of role IDs
  role: z.string().optional(), // Keep for backward compatibility
  type: z.string().min(1, "Type is required"),
  status: z.string().min(1, "Status is required"),
  organization: z.string().optional(),
  password: z.string().optional(),
});

export const relatedUsersFormSchema = z.object({
  users: z.array(relatedUserSchema),
});

// Combined schema for the entire form
export const combinedFormSchema = z.object({
  custodian: custodianFormSchema,
  relatedUsers: z.array(relatedUserSchema),
});

export type CustodianFormValues = z.infer<typeof custodianFormSchema>;
export type RelatedUserFormValues = z.infer<typeof relatedUserSchema>;
export type RelatedUsersFormValues = z.infer<typeof relatedUsersFormSchema>;
export type CombinedFormValues = z.infer<typeof combinedFormSchema>;
