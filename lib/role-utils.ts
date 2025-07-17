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
        return "tcc_admin";
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
  if (newRoleId === "order_initializer_agence") return "initiator";
  if (newRoleId === "order_validator_agence_1") return "validator 1";
  if (newRoleId === "order_validator_agence_2") return "validator 2";
  if (newRoleId === "agence_viewer_order_history") return "consultation";
  if (
    newRoleId === "agence_client_manager" ||
    newRoleId === "agence_gestion_clients"
  )
    return "admin";

  // Client roles
  if (newRoleId === "order_initializer_client") return "initiator";
  if (newRoleId === "client_viewer_portfolio") return "consultation";
  if (newRoleId === "client_viewer_order_history") return "consultation";

  // TCC roles
  if (newRoleId === "tcc_admin") return "admin";
  if (newRoleId === "order_validator_tcc_1") return "validator 1";
  if (newRoleId === "order_validator_tcc_2") return "validator 2";
  if (newRoleId === "tcc_viewer_order_history") return "consultation";
  if (newRoleId === "finbourse_super_admin") return "admin";

  // IOB roles
  if (newRoleId === "order_executor") return "initiator";
  if (newRoleId === "order_validator_iob_1") return "validator 1";
  if (newRoleId === "order_validator_iob_2") return "validator 2";
  if (newRoleId === "iob_secondary_market") return "consultation";

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
