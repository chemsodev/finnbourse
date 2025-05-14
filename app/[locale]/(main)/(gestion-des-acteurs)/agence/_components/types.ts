/**
 * Shared types for agence components
 */

// User type for the related users table
export interface RelatedUser {
  id: string;
  fullname: string;
  position: string;
  role: string;
  matricule: string;
  type: string; // admin or member
  status: "active" | "inactive"; // Changed from string to specific values
  organisation: string;
  password?: string;
  email?: string; // Optional email field for consistency
  phone?: string; // Optional phone field for consistency
}
