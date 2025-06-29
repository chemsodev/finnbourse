// Contains role definitions for different user types in the system
// Updated to match backend API specifications

export type RoleType = {
  id: string;
  label: string;
  description: string;
};

// Client roles (keeping existing ones as they weren't specified in the update)
export const CLIENT_ROLES: RoleType[] = [
  {
    id: "client_order_creator",
    label: "Initiateur d'ordre",
    description: "Peut initier/créer un ordre.",
  },
  {
    id: "client_first_approver",
    label: "Premier validateur",
    description: "Peut effectuer la première validation d'un ordre.",
  },
  {
    id: "client_final_approver",
    label: "Validateur final",
    description: "Peut effectuer la validation finale d'un ordre.",
  },
  {
    id: "client_viewer",
    label: "Observateur",
    description: "Peut uniquement consulter les ordres (lecture seule).",
  },
];

// Agency roles - Updated to match backend specifications
export const AGENCY_ROLES: RoleType[] = [
  {
    id: "agence_client_manager_1",
    label: "First Level Client Manager",
    description: "First level client manager for agence.",
  },
  {
    id: "agence_client_manager_2",
    label: "Second Level Client Manager",
    description: "Second level client manager for agence.",
  },
  {
    id: "order_initializer_agence",
    label: "Order Initializer",
    description: "Order initializer for agence.",
  },
  {
    id: "order_validator_agence_1",
    label: "First Level Order Validator",
    description: "First level order validator for agence.",
  },
  {
    id: "order_validator_agence_2",
    label: "Second Level Order Validator",
    description: "Second level order validator for agence.",
  },
  {
    id: "observateur_agence",
    label: "Agence Observer",
    description: "Agence observer (read-only access).",
  },
  {
    id: "agence_admin",
    label: "Agence Administrator",
    description: "Agence administrator.",
  },
];

// IOB roles - Updated to match backend specifications
export const IOB_ROLES: RoleType[] = [
  {
    id: "order_submiter",
    label: "Order Submitter",
    description: "Can submit orders to the IOB system.",
  },
  {
    id: "order_validator_iob_1",
    label: "First Level Order Validator",
    description: "First level order validator for IOB.",
  },
  {
    id: "order_validator_iob_2",
    label: "Second Level Order Validator",
    description: "Second level order validator for IOB.",
  },
  {
    id: "observateur_iob",
    label: "IOB Observer",
    description: "Can only view orders and their status (read-only access).",
  },
  {
    id: "iob_admin",
    label: "IOB Administrator",
    description: "Can manage IOB users and their roles.",
  },
];

// TCC roles - Updated to match backend specifications
export const TCC_ROLES: RoleType[] = [
  {
    id: "client_account_manager_1",
    label: "First Level Client Account Manager",
    description: "First level client account manager.",
  },
  {
    id: "client_account_manager_2",
    label: "Second Level Client Account Manager",
    description: "Second level client account manager.",
  },
  {
    id: "order_validator_tcc_1",
    label: "First Level Order Validator",
    description: "First level order validator for TCC.",
  },
  {
    id: "order_validator_tcc_2",
    label: "Second Level Order Validator",
    description: "Second level order validator for TCC.",
  },
  {
    id: "order_extern_initializer",
    label: "External Order Initializer",
    description: "External order initializer.",
  },
  {
    id: "client_account_extern_manager",
    label: "External Client Account Manager",
    description: "External client account manager.",
  },
  {
    id: "observateur_tcc",
    label: "TCC Observer",
    description: "TCC observer (read-only access).",
  },
  {
    id: "tcc_admin",
    label: "TCC Administrator",
    description: "TCC administrator.",
  },
  {
    id: "finbourse_super_admin",
    label: "System Super Administrator",
    description: "System super administrator with full access.",
  },
];

// Helper function to get roles by user type
export function getRolesByUserType(userType: string): RoleType[] {
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

// Get a role by its ID
export function getRoleById(roleId: string): RoleType | undefined {
  return [...CLIENT_ROLES, ...AGENCY_ROLES, ...TCC_ROLES, ...IOB_ROLES].find(
    (role) => role.id === roleId
  );
}
