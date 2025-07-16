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
  agency_name: string;
  agency_email: string;
  agency_phone: string;
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
  agency_name: string;
  agency_email: string;
  agency_phone: string;
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
  type: "individual" | "company" | "financial_institution";
  agence?: Agence | string;
  agency_name?: string;
  client_code: string;
  client_source: string;
  email: string;
  phone_number: string;
  mobile_phone: string;
  id_type: "passport" | "driving_license" | "CN" | "RC";
  cash_account_bank_code: string;
  cash_account_agency_code: string;
  cash_account_number: string;
  cash_account_rip_key: string;
  cash_account_rip_full: string;
  securities_account_number: string;

  // Individual specific fields
  name?: string;
  id_number?: string;
  nin?: string;
  nationalite?: string;
  wilaya?: string;
  lieu_naissance?: string;
  employe_a_la_institution_financiere?: boolean;

  // Company specific fields
  raison_sociale?: string;
  nif?: string;
  reg_number?: string;
  legal_form?: string;

  // Frontend-specific fields
  status?: string;
  date_naissance?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ClientCreateRequest {
  type: "individual" | "company" | "financial_institution";
  financialInstitutionId?: string;
  agenceId?: string;
  iobId?: string;
  client_code: string;
  client_source: string;
  email: string;
  phone_number: string;
  mobile_phone: string;
  id_type: "passport" | "driving_license" | "CN" | "RC";
  cash_account_bank_code: string;
  cash_account_agency_code: string;
  cash_account_number: string;
  cash_account_rip_key: string;
  cash_account_rip_full: string;
  securities_account_number: string;

  // For type discriminated union (matches backend structure)
  client_details?: {
    type: "individual" | "company";
    name?: string;
    id_number?: string;
    nin?: string;
    nationalite?: string;
    wilaya?: string;
    lieu_naissance?: string;
    employe_a_la_institution_financiere?: boolean;
    raison_sociale?: string;
    nif?: string;
    reg_number?: string;
    legal_form?: string;
  };
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
  { value: "individual", label: "Individual" },
  { value: "corporate", label: "Corporate" },
  { value: "financial_institution", label: "Financial Institution" },
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
