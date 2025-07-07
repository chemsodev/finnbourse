import { z } from "zod";

// Base schema for common fields
const baseSchema = z.object({
  clientCode: z.string().min(1, "Le code client est requis"),
  clientSource: z.enum(["CPA", "extern"]),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  phoneNumber: z.string().optional().or(z.literal("")),
  mobilePhone: z.string().optional().or(z.literal("")),
  wilaya: z.string().min(1, "La wilaya est requise"),
  address: z.string().optional().or(z.literal("")),
  iobType: z.enum(["intern", "extern"]),
  iobCategory: z.string().nullable(),
  hasCompteTitre: z.boolean(),
  numeroCompteTitre: z.string().optional().or(z.literal("")),
  ribBanque: z
    .string()
    .length(5, "Le code banque doit contenir 5 chiffres")
    .optional()
    .or(z.literal("")),
  ribAgence: z
    .string()
    .length(5, "Le code agence doit contenir 5 chiffres")
    .optional()
    .or(z.literal("")),
  ribCompte: z
    .string()
    .length(11, "Le numéro de compte doit contenir 11 chiffres")
    .optional()
    .or(z.literal("")),
  ribCle: z
    .string()
    .length(2, "La clé RIB doit contenir 2 chiffres")
    .optional()
    .or(z.literal("")),
  observation: z.string().optional().or(z.literal("")),
  isEmployeeCPA: z.boolean().optional(),
  matricule: z.string().optional().or(z.literal("")),
  poste: z.string().optional().or(z.literal("")),
  agenceCPA: z.string().optional().or(z.literal("")),
  selectedAgence: z.string().optional().or(z.literal("")),
});

// Schema for personne physique
const personnePhysiqueSchema = z
  .object({
    clientType: z.literal("personne_physique"),
    name: z.string().min(1, "Le nom est requis"),
    idType: z.enum(["passport", "permit_conduite", "nin"]),
    idNumber: z.string().min(1, "Le numéro de pièce d'identité est requis"),
    nin: z.string().min(1, "Le NIN est requis"),
    nationalite: z.string().min(1, "La nationalité est requise"),
    dateNaissance: z.date().optional(),
    lieuNaissance: z.string().optional().or(z.literal("")),
    // Make personne morale fields optional
    raisonSociale: z.string().optional(),
    nif: z.string().optional(),
    regNumber: z.string().optional(),
    legalForm: z.string().optional(),
  })
  .extend(baseSchema.shape);

// Schema for personne morale
const personneMoraleSchema = z
  .object({
    clientType: z.literal("personne_morale"),
    raisonSociale: z.string().min(1, "La raison sociale est requise"),
    nif: z.string().min(1, "Le NIF est requis"),
    regNumber: z.string().min(1, "Le numéro d'enregistrement est requis"),
    legalForm: z.string().min(1, "La forme juridique est requise"),
    // Make personne physique fields optional
    name: z.string().optional(),
    idType: z.enum(["passport", "permit_conduite", "nin"]).optional(),
    idNumber: z.string().optional(),
    nin: z.string().optional(),
    nationalite: z.string().optional(),
    dateNaissance: z.date().optional(),
  })
  .extend(baseSchema.shape);

// Schema for institution financiere
const institutionFinanciereSchema = z
  .object({
    clientType: z.literal("institution_financiere"),
    raisonSociale: z.string().min(1, "La raison sociale est requise"),
    nif: z.string().min(1, "Le NIF est requis"),
    regNumber: z.string().min(1, "Le numéro d'enregistrement est requis"),
    legalForm: z.string().min(1, "La forme juridique est requise"),
    // Make personne physique fields optional
    name: z.string().optional(),
    idType: z.enum(["passport", "permit_conduite", "nin"]).optional(),
    idNumber: z.string().optional(),
    nin: z.string().optional(),
    nationalite: z.string().optional(),
    dateNaissance: z.date().optional(),
  })
  .extend(baseSchema.shape);

// Schema for client user
export const clientUserSchema = z.object({
  id: z.string().optional(),
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  roles: z.array(z.string()).default([]), // Array of role IDs
  role: z.string().optional().or(z.literal("")), // Keep for backward compatibility
  address: z.string().optional().or(z.literal("")),
  wilaya: z.string().optional().or(z.literal("")),
  nationality: z.string().optional().or(z.literal("")),
  birthDate: z.string().optional().or(z.literal("")),
  idNumber: z.string().optional().or(z.literal("")),
  userType: z.enum(["proprietaire", "mandataire", "tuteur_legal"]),
  status: z.enum(["active", "inactive"]),
  password: z
    .string()
    .min(8, "Le mot de passe doit contenir au moins 8 caractères")
    .max(100),
  email: z.string().email("Email invalide"),
});

// Combined schema using discriminated union
export const clientSchema = z.discriminatedUnion("clientType", [
  personnePhysiqueSchema,
  personneMoraleSchema,
  institutionFinanciereSchema,
]);

// Export the inferred type
export type ClientFormValues = z.infer<typeof clientSchema>;

// Base interface for common fields
export interface BaseClient {
  id: number;
  status: "actif" | "inactif"; // Updated to match the new status requirements
  createdAt: Date;
  updatedAt: Date;
}

// Specific interfaces for each client type
export interface PersonnePhysiqueClient
  extends BaseClient,
    z.infer<typeof personnePhysiqueSchema> {}
export interface PersonneMoraleClient
  extends BaseClient,
    z.infer<typeof personneMoraleSchema> {}
export interface InstitutionFinanciereClient
  extends BaseClient,
    z.infer<typeof institutionFinanciereSchema> {}

// Union type for all client types
export type Client =
  | PersonnePhysiqueClient
  | PersonneMoraleClient
  | InstitutionFinanciereClient;

// Interface for client user
export interface ClientUser extends z.infer<typeof clientUserSchema> {
  id: string;
  clientId: number;
  createdAt: Date;
  updatedAt: Date;
}

// Validation function to ensure user types match client types
export const validateClientUserType = (
  clientType: string,
  userType: string
): boolean => {
  if (clientType === "personne_physique") {
    return ["proprietaire", "tuteur_legal"].includes(userType);
  } else {
    // personne_morale or institution_financiere
    return ["proprietaire", "mandataire"].includes(userType);
  }
};

export const formSchema = z
  .object({
    clientType: z.enum([
      "personne_physique",
      "personne_morale",
      "institution_financiere",
    ]),
    clientCode: z.string().min(1, "Le code client est requis"),
    clientSource: z.enum(["CPA", "extern"]),
    name: z.string().min(1, "Le nom est requis"),
    email: z.string().email("Email invalide").optional().or(z.literal("")),
    phoneNumber: z.string().optional().or(z.literal("")),
    mobilePhone: z.string().optional().or(z.literal("")),
    idType: z.enum(["passport", "permit_conduite", "nin"]),
    idNumber: z.string().min(1, "Le numéro de pièce d'identité est requis"),
    nin: z.string().min(1, "Le NIN est requis"),
    nationalite: z.string().min(1, "La nationalité est requise"),
    wilaya: z.string().optional().or(z.literal("")),
    address: z.string().optional().or(z.literal("")),
    dateNaissance: z.date().optional(),
    iobType: z.enum(["intern", "extern"]),
    iobCategory: z.string().nullable(),
    hasCompteTitre: z.boolean(),
    numeroCompteTitre: z.string().optional().or(z.literal("")),
    ribBanque: z
      .string()
      .length(5, "Le code banque doit contenir 5 chiffres")
      .optional()
      .or(z.literal("")),
    ribAgence: z
      .string()
      .length(5, "Le code agence doit contenir 5 chiffres")
      .optional()
      .or(z.literal("")),
    ribCompte: z
      .string()
      .length(11, "Le numéro de compte doit contenir 11 chiffres")
      .optional()
      .or(z.literal("")),
    ribCle: z
      .string()
      .length(2, "La clé RIB doit contenir 2 chiffres")
      .optional()
      .or(z.literal("")),
    observation: z.string().optional().or(z.literal("")),
    isEmployeeCPA: z.boolean().optional(),
    matricule: z.string().optional().or(z.literal("")),
    poste: z.string().optional().or(z.literal("")),
    agenceCPA: z.string().optional().or(z.literal("")),
    selectedAgence: z.string().optional().or(z.literal("")),
    raisonSociale: z.string().min(1, "La raison sociale est requise"),
    nif: z.string().min(1, "Le NIF est requis"),
    regNumber: z.string().min(1, "Le numéro du registre est requis"),
    legalForm: z.string().min(1, "La forme juridique est requise"),
    lieuNaissance: z.string().optional().or(z.literal("")),
  })
  .refine(
    (data) => {
      if (data.clientType === "personne_physique") {
        return (
          data.name &&
          data.idNumber &&
          data.nin &&
          data.nationalite &&
          data.wilaya
        );
      } else {
        return (
          data.raisonSociale && data.nif && data.regNumber && data.legalForm
        );
      }
    },
    {
      message: "Veuillez remplir tous les champs obligatoires",
      path: ["clientType"],
    }
  );

export type FormValues = z.infer<typeof formSchema>;
