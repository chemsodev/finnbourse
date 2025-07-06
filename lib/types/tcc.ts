import { use } from "react";
/**
 * TCC (Teneur de Comptes Conservateur) Types
 * Based on the backend API structure from Postman collection
 */

export interface TCC {
  id?: string;
  code: string;
  libelle: string;
  account_type: "DEPOSIT" | "SECURITIES" | "BOTH";
  status: "ACTIVE" | "INACTIVE";
  address: string;
  postal_code: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  agreement_number?: string;
  agreement_date?: string;
  surveillance_authority?: string;
  name_correspondent?: string;
  code_correspondent?: string;
  financialInstitutionId: string;
  createdAt?: string;
  updatedAt?: string;
  users?: TCCUser[];
}

export interface TCCUser {
  id?: string;
  keycloakId?: string | null;
  keycloakSource?: string | null;
  firstname: string;
  lastname: string;
  email: string;
  password?: string;
  telephone: string;
  status: "actif" | "inactif";
  positionTcc: string;
  role: string[];
  matricule?: string;
  organisationIndividu?: string;
  tcc?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface TCCCreateRequest {
  code: string;
  libelle: string;
  account_type: "DEPOSIT" | "SECURITIES" | "BOTH";
  status: "ACTIVE" | "INACTIVE";
  address: string;
  postal_code: string;
  city: string;
  country: string;
  phone: string;
  email: string;
  agreement_number?: string;
  agreement_date?: string;
  surveillance_authority?: string;
  name_correspondent?: string;
  code_correspondent?: string;
  financialInstitutionId: string;
}

export interface TCCUserCreateRequest {
  firstname: string;
  lastname: string;
  email: string;
  password: string;
  telephone: string;
  status: "actif" | "inactif";
  positionTcc: string;
  role: string[];
  matricule?: string;
  organisationIndividu?: string; // Renamed from organisation to match API
  tcc?: number; // Replaced tccId with tcc to match API (always 1)
}

export interface TCCUserUpdateRequest {
  firstname?: string;
  lastname?: string;
  email?: string;
  password?: string;
  telephone?: string;
  status?: "actif" | "inactif";
  positionTcc?: string;
  role?: string[];
  matricule?: string;
  organisationIndividu?: string;
  tcc?: number;
}

export interface TCCUserRoleUpdateRequest {
  role: string[];
}

// Available roles for TCC users based on the backend ta3 KHALIL
export const TCC_USER_ROLES = [
  "client_account_manager_1",
  "client_account_manager_2",
  "order_validator_tcc_1",
  "order_validator_tcc_2",
  "order_validator_tcc_3",
  "order_validator_tcc_4",
  "order_extern_initializer",
  "observateur_tcc",
  "order_iob_extern",
] as const;

export type TCCUserRole = (typeof TCC_USER_ROLES)[number];

// Account types
export const TCC_ACCOUNT_TYPES = [
  { value: "DEPOSIT", label: "Depot" },
  { value: "SECURITIES", label: "Titres" },
  { value: "BOTH", label: "Depot et Titres" },
] as const;

// Status options
export const TCC_STATUS_OPTIONS = [
  { value: "ACTIVE", label: "Actif" },
  { value: "INACTIVE", label: "Inactif" },
] as const;

export const TCC_USER_STATUS_OPTIONS = [
  { value: "actif", label: "Actif" },
  { value: "inactif", label: "Inactif" },
] as const;
