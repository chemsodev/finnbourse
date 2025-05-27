import * as z from "zod";

// Schema for the IOB details (Step 1)
export const iobFormSchema = z.object({
  codeIob: z.string().min(1, "Code IOB is required"),
  libelleCourt: z.string().min(1, "Short label is required"),
  libelleLong: z.string().min(1, "Long label is required"),
  correspondant: z.string().min(1, "Correspondent is required"),
  email: z.string().email().optional().or(z.literal("")),
  fax: z.string().optional(),
  telephone: z.string().optional(),
  addresse: z.string().min(1, "Address is required"),
  ordreDeTu: z.string().optional(),
});

// Schema for related users (Step 2)
export const relatedUserSchema = z.object({
  id: z.string().optional(), // Only present when editing an existing user
  fullName: z.string().min(2, { message: "Name is required" }),
  position: z.string().min(2, { message: "Position is required" }),
  matricule: z.string().optional(),
  roles: z.array(z.string()).default([]), // Array of role IDs
  role: z.string().optional(), // Keep for backward compatibility
  type: z.string().min(1, { message: "Type is required" }),
  status: z.string().min(1, { message: "Status is required" }),
  organization: z.string().optional(),
  password: z.string().optional(),
});

export const relatedUsersFormSchema = z.object({
  users: z.array(relatedUserSchema),
});

// Combined schema for the entire form
export const combinedFormSchema = z.object({
  iob: iobFormSchema,
  relatedUsers: z.array(relatedUserSchema),
});

export type IobFormValues = z.infer<typeof iobFormSchema>;
export type RelatedUserFormValues = z.infer<typeof relatedUserSchema>;
export type RelatedUsersFormValues = z.infer<typeof relatedUsersFormSchema>;
export type CombinedFormValues = z.infer<typeof combinedFormSchema>;
