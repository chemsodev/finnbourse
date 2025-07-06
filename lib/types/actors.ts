/**
 * IOB (Intermediaire en Operations de Bourse) Types
 */

export interface IOB {
  id?: string;
  code: string;
  short_libel: string;
  long_libel: string;
  correspondent: string;
  email: string;
  fax?: string;
  phone: string;
  address: string;
  order?: string;
  financialInstitution?: {
    id: string;
    institutionName: string;
    taxIdentificationNumber: string;
    agreementNumber: string;
    legalForm: string;
    establishmentDate: string;
    fullAddress: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export interface IOBCreateRequest {
  code: string;
  short_libel: string;
  long_libel: string;
  correspondent: string;
  email: string;
  fax?: string;
  phone: string;
  address: string;
  order?: string;
  financialInstitutionId: string;
}

export interface IOBUser {
  id?: string;
  firstname: string;
  lastname: string;
  email: string;
  password?: string;
  telephone: string;
  status: "actif" | "inactif";
  position: string;
  role: string[];
  createdAt?: string;
  updatedAt?: string;
}

/**
 * AGENCE Types
 */

export interface Agence {
  id?: string;
  code: string;
  address: string;
  code_swift: string;
  currency: string;
  director_name: string;
  director_email: string;
  director_phone: string;
  financialInstitution?: {
    id: string;
    institutionName: string;
    taxIdentificationNumber: string;
    agreementNumber: string;
    legalForm: string;
    establishmentDate: string;
    fullAddress: string;
  };
  financialInstitutionId?: string; // Added for direct ID reference
  createdAt?: string;
  updatedAt?: string;
}

export interface AgenceCreateRequest {
  code: string;
  address: string;
  code_swift: string;
  currency: string;
  director_name: string;
  director_email: string;
  director_phone: string;
  financialInstitutionId: string;
}

export interface AgenceUser {
  id?: string;
  firstname: string;
  lastname: string;
  email: string;
  password?: string;
  telephone: string;
  status: "actif" | "inactif";
  position: string;
  role: string[];
  createdAt?: string;
  updatedAt?: string;
}

/**
 * CLIENT Types
 */

export interface Client {
  id?: string;
  code: string;
  name: string;
  type: "INDIVIDUAL" | "CORPORATE";
  address: string;
  postal_code: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  status: "ACTIVE" | "INACTIVE";
  tax_number?: string;
  registration_date?: string;
  parent_agence_id?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ClientCreateRequest {
  code: string;
  name: string;
  type: "INDIVIDUAL" | "CORPORATE";
  address: string;
  postal_code: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  status: "ACTIVE" | "INACTIVE";
  tax_number?: string;
  registration_date?: string;
  parent_agence_id?: string;
}

export interface ClientUser {
  id?: string;
  firstname: string;
  lastname: string;
  email: string;
  password?: string;
  telephone: string;
  status: "actif" | "inactif";
  position: string;
  role: string[];
  createdAt?: string;
  updatedAt?: string;
}

// Status options for users
export const USER_STATUS_OPTIONS = [
  { value: "actif", label: "Active" },
  { value: "inactif", label: "Inactive" },
] as const;

export const CLIENT_TYPE_OPTIONS = [
  { value: "INDIVIDUAL", label: "Individual" },
  { value: "CORPORATE", label: "Corporate" },
] as const;

// User roles for different actors
export const IOB_USER_ROLES = [
  "iob_admin",
  "iob_manager",
  "iob_operator",
  "iob_analyst",
] as const;

export const AGENCE_USER_ROLES = [
  "agence_manager",
  "agence_operator",
  "agence_advisor",
  "agence_assistant",
] as const;

export const CLIENT_USER_ROLES = [
  "client_admin",
  "client_user",
  "client_viewer",
] as const;
