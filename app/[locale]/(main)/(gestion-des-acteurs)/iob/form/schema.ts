import * as z from "zod";

// Schema for the IOB details (Step 1)
export const iobFormSchema = z.object({
  codeIob: z.string().min(1, "Code IOB is required"),
  libelleCourt: z.string().min(1, "Short label is required"),
  libelleLong: z.string().min(1, "Long label is required"),
  correspondant: z.string().min(1, "Correspondent is required"),
  email: z.string().email().optional().or(z.literal("")),
  fax: z.string().optional(),
  telephone1: z.string().optional(),
  telephone2: z.string().optional(),
  telephone3: z.string().optional(),
  addresse: z.string().min(1, "Address is required"),
  ordreDeTu: z.string().optional(),
});

// Schema for related users (Step 2)
export const relatedUserSchema = z.object({
  id: z.string().optional(), // Only present when editing an existing user
  fullName: z.string().min(1, "Full name is required"),
  position: z.string().min(1, "Position in the company is required"),
  role: z.string().min(1, "Role is required"),
  status: z.string().min(1, "Status is required"),
  organization: z.string().optional(),
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
