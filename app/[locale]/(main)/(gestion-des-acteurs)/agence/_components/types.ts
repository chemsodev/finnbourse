/**
 * Shared types for agence components
 */

// User type for the related users table
export interface RelatedUser {
  id: string;
  fullName: string;
  position: string;
  roles: string[]; // Now supports multiple roles
  matricule: string;
  status: "active" | "inactive";
  organization: string;
  password?: string;
  email?: string;
  phone?: string;
}
