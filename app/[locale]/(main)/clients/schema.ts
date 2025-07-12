import { z } from "zod";

// Base schema for common fields
const baseSchema = z.object({
  clientCode: z.string().min(1, "Le code client est requis"),
  email: z.string().email("Email invalide").optional().or(z.literal("")),
  phoneNumber: z.string().optional().or(z.literal("")),
  mobilePhone: z.string().optional().or(z.literal("")),
  wilaya: z.string().min(1, "La wilaya est requise"),
  address: z.string().optional().or(z.literal("")),
  iobType: z.enum(["intern", "extern"]),
  iobCategory: z.string().nullable().optional(),
  numeroCompteTitre: z.string().optional().or(z.literal("")),
  ribBanque: z
    .string()
    .max(5, "Le code banque doit contenir au maximum 5 chiffres")
    .optional()
    .or(z.literal("")),
  ribAgence: z
    .string()
    .max(5, "Le code agence doit contenir au maximum 5 chiffres")
    .optional()
    .or(z.literal("")),
  ribCompte: z
    .string()
    .max(11, "Le numéro de compte doit contenir au maximum 11 chiffres")
    .optional()
    .or(z.literal("")),
  ribCle: z
    .string()
    .max(2, "La clé RIB doit contenir au maximum 2 chiffres")
    .optional()
    .or(z.literal("")),
  observation: z.string().optional().or(z.literal("")),
  selectedAgence: z.string().optional().or(z.literal("")),
  financialInstitutionId: z.string().optional().or(z.literal("")),
  agenceId: z.string().optional().or(z.literal("")),
  iobId: z.string().optional().or(z.literal("")),
});

// Schema for personne physique (individual)
const personnePhysiqueSchema = z
  .object({
    clientType: z.literal("personne_physique"),
    name: z.string().min(1, "Le nom est requis"),
    idType: z.enum(["passport", "permit_conduite", "nin"]),
    idNumber: z.string().min(1, "Le numéro de pièce d'identité est requis"),
    nin: z.string().min(1, "Le NIN est requis"),
    nationalite: z.string().min(1, "La nationalité est requise"),
    dateNaissance: z
      .date()
      .min(new Date(1900, 0, 1), "La date de naissance est requise"),
    lieuNaissance: z.string().min(1, "Le lieu de naissance est requis"),
    // Make personne morale fields optional
    raisonSociale: z.string().optional(),
    nif: z.string().optional(),
    regNumber: z.string().optional(),
    legalForm: z.string().optional(),
  })
  .extend(baseSchema.shape);

// Schema for personne morale (corporate)
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
    lieuNaissance: z.string().optional(),
  })
  .extend(baseSchema.shape);

// Schema for financial institution
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
    lieuNaissance: z.string().optional(),
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

// Main form schema with proper conditional validation
export const formSchema = z
  .object({
    clientType: z.enum([
      "personne_physique",
      "personne_morale",
      "institution_financiere",
    ]),
    clientCode: z.string().min(1, "Le code client est requis"),
    email: z.string().email("Email invalide").optional().or(z.literal("")),
    phoneNumber: z.string().optional().or(z.literal("")),
    mobilePhone: z.string().optional().or(z.literal("")),
    wilaya: z.string().min(1, "La wilaya est requise"),
    address: z.string().optional().or(z.literal("")),
    iobType: z.enum(["intern", "extern"]),
    iobCategory: z.string().nullable().optional(),
    numeroCompteTitre: z.string().optional().or(z.literal("")),
    ribBanque: z
      .string()
      .max(5, "Le code banque doit contenir au maximum 5 chiffres")
      .optional()
      .or(z.literal("")),
    ribAgence: z
      .string()
      .max(5, "Le code agence doit contenir au maximum 5 chiffres")
      .optional()
      .or(z.literal("")),
    ribCompte: z
      .string()
      .max(11, "Le numéro de compte doit contenir au maximum 11 chiffres")
      .optional()
      .or(z.literal("")),
    ribCle: z
      .string()
      .max(2, "La clé RIB doit contenir au maximum 2 chiffres")
      .optional()
      .or(z.literal("")),
    observation: z.string().optional().or(z.literal("")),
    selectedAgence: z.string().optional().or(z.literal("")),
    financialInstitutionId: z.string().optional().or(z.literal("")),
    agenceId: z.string().optional().or(z.literal("")),
    iobId: z.string().optional().or(z.literal("")),

    // Individual client fields
    name: z.string().optional(),
    idType: z.enum(["passport", "permit_conduite", "nin"]).optional(),
    idNumber: z.string().optional(),
    nin: z.string().optional(),
    nationalite: z.string().optional(),
    dateNaissance: z.date().optional().nullable(),
    lieuNaissance: z.string().optional(),

    // Corporate client fields
    raisonSociale: z.string().optional(),
    nif: z.string().optional(),
    regNumber: z.string().optional(),
    legalForm: z.string().optional(),
  })
  .refine(
    (data) => {
      // Validate individual client required fields
      if (data.clientType === "personne_physique") {
        return !!(
          data.name &&
          data.idNumber &&
          data.nin &&
          data.nationalite &&
          data.dateNaissance &&
          data.lieuNaissance
        );
      }
      return true;
    },
    {
      message:
        "Tous les champs requis pour une personne physique doivent être remplis",
      path: ["clientType"],
    }
  )
  .refine(
    (data) => {
      // Validate corporate client required fields
      if (
        data.clientType === "personne_morale" ||
        data.clientType === "institution_financiere"
      ) {
        return !!(
          data.raisonSociale &&
          data.nif &&
          data.regNumber &&
          data.legalForm
        );
      }
      return true;
    },
    {
      message:
        "Tous les champs requis pour une personne morale doivent être remplis",
      path: ["clientType"],
    }
  );

// Export the inferred type
export type ClientFormValues = z.infer<typeof clientSchema>;

// Base interface for common fields
export interface BaseClient {
  id: number;
  status: "actif" | "inactif";
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

export type FormValues = z.infer<typeof formSchema>;
