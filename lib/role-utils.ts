// Utils file for role handling
import {
  AGENCY_ROLES,
  CLIENT_ROLES,
  IOB_ROLES,
  RoleType,
  TCC_ROLES,
} from "./roles";

// Map legacy role values to new role IDs
export function mapLegacyRoleToNewRole(
  legacyRole: string,
  userType: string
): string {
  // For agency users
  if (
    userType.toLowerCase() === "agency" ||
    userType.toLowerCase() === "agence"
  ) {
    switch (legacyRole) {
      case "initiator":
        return "agency_order_declarer";
      case "validator 1":
      case "validateur 1":
        return "agency_first_approver";
      case "validator 2":
      case "validateur 2":
        return "agency_final_approver";
      case "consultation":
      case "view-only":
        return "agency_viewer";
      case "admin":
        return "agency_user_admin";
      default:
        return "agency_viewer";
    }
  }

  // For client users
  else if (userType.toLowerCase() === "client") {
    switch (legacyRole) {
      case "initiator":
        return "client_order_creator";
      case "validator 1":
      case "validateur 1":
        return "client_first_approver";
      case "validator 2":
      case "validateur 2":
        return "client_final_approver";
      case "consultation":
      case "view-only":
        return "client_viewer";
      default:
        return "client_viewer";
    }
  }

  // For TCC users
  else if (userType.toLowerCase() === "tcc") {
    switch (legacyRole) {
      case "admin":
        return "tcc_super_admin";
      case "validator 1":
      case "validateur 1":
        return "tcc_first_approver";
      case "validator 2":
      case "validateur 2":
        return "tcc_final_approver";
      case "consultation":
      case "view-only":
        return "tcc_viewer";
      default:
        return "tcc_viewer";
    }
  }

  // For IOB users
  else if (userType.toLowerCase() === "iob") {
    switch (legacyRole) {
      case "admin":
        return "iob_user_admin";
      case "initiator":
        return "iob_order_executor";
      case "validator 1":
      case "validateur 1":
        return "iob_result_submitter";
      case "consultation":
      case "view-only":
        return "iob_viewer";
      default:
        return "iob_viewer";
    }
  }

  return legacyRole;
}

// Map new role ID to legacy role for backward compatibility
export function mapNewRoleToLegacyRole(newRoleId: string): string {
  // Agency roles
  if (newRoleId === "agency_order_declarer") return "initiator";
  if (newRoleId === "agency_first_approver") return "validator 1";
  if (newRoleId === "agency_final_approver") return "validator 2";
  if (newRoleId === "agency_viewer") return "consultation";
  if (newRoleId === "agency_user_admin" || newRoleId === "agency_client_admin")
    return "admin";

  // Client roles
  if (newRoleId === "client_order_creator") return "initiator";
  if (newRoleId === "client_first_approver") return "validator 1";
  if (newRoleId === "client_final_approver") return "validator 2";
  if (newRoleId === "client_viewer") return "consultation";

  // TCC roles
  if (newRoleId === "tcc_super_admin") return "admin";
  if (newRoleId === "tcc_first_approver") return "validator 1";
  if (newRoleId === "tcc_final_approver") return "validator 2";
  if (newRoleId === "tcc_viewer") return "consultation";

  // IOB roles
  if (newRoleId === "iob_user_admin") return "admin";
  if (newRoleId === "iob_order_executor") return "initiator";
  if (newRoleId === "iob_result_submitter") return "validator 1";
  if (newRoleId === "iob_viewer") return "consultation";

  return newRoleId;
}

// Get the appropriate roles for a user type
export function getRolesByUserTypeString(userType: string): RoleType[] {
  switch (userType.toLowerCase()) {
    case "client":
      return CLIENT_ROLES;
    case "agency":
    case "agence":
      return AGENCY_ROLES;
    case "tcc":
      return TCC_ROLES;
    case "iob":
      return IOB_ROLES;
    default:
      return [];
  }
}

// Get a role's display name based on its ID
export function getRoleDisplayName(roleId: string): string {
  const allRoles = [
    ...CLIENT_ROLES,
    ...AGENCY_ROLES,
    ...TCC_ROLES,
    ...IOB_ROLES,
  ];
  const role = allRoles.find((r) => r.id === roleId);
  return role?.label || roleId;
}
