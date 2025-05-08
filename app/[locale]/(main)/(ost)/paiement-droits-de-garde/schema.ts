import * as z from "zod";

// Function to create a schema with translated error messages
export const createDroitsGardeSchema = (t: any) =>
  z.object({
    titrePrincipal: z.string().min(1, {
      message: t?.("titrePrincipalRequired") || "Main security is required",
    }),
    referenceost: z.string().min(1, {
      message: t?.("referenceOSTRequired") || "OST reference is required",
    }),
    descriptionOst: z.string().min(1, {
      message: t?.("descriptionOSTRequired") || "OST description is required",
    }),
    dateExecution: z.date({
      required_error:
        t?.("dateExecutionRequired") || "Execution date is required",
    }),
    actionAnc: z.string().optional(),
    titreResultant: z.string().optional(),
    nouvelleAction: z.string().optional(),
    commentaire: z.string().optional(),
  });

// For backward compatibility
export const droitsGardeSchema = z.object({
  titrePrincipal: z
    .string()
    .min(1, { message: "Le titre principal est requis" }),
  referenceost: z.string().min(1, { message: "La référence OST est requise" }),
  descriptionOst: z
    .string()
    .min(1, { message: "La description OST est requise" }),
  dateExecution: z.date({
    required_error: "La date d'exécution est requise",
  }),
  actionAnc: z.string().optional(),
  titreResultant: z.string().optional(),
  nouvelleAction: z.string().optional(),
  commentaire: z.string().optional(),
});

export type DroitsGardeFormValues = z.infer<typeof droitsGardeSchema>;

export interface DroitsGarde extends DroitsGardeFormValues {
  id: number;
}
