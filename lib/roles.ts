// Contains role definitions for different user types in the system
// Updated to match backend API specifications

export type RoleType = {
  id: string;
  label: string;
  description: string;
};

// Client role enum
export enum ClientRole {
  client_viewer_portfolio = "client_viewer_portfolio",
  client_viewer_order_history = "client_viewer_order_history",
  order_initializer_client = "order_initializer_client",
}

// Agency role enum
export enum AgenceRole {
  agence_client_manager = "agence_client_manager",
  order_initializer_agence = "order_initializer_agence",
  order_validator_agence_1 = "order_validator_agence_1",
  order_validator_agence_2 = "order_validator_agence_2",
  agence_viewer_order_history = "agence_viewer_order_history",
  order_validator_agence_retour_1 = "order_validator_agence_retour_1",
  order_validator_agence_retour_2 = "order_validator_agence_retour_2",
  agence_gestion_clients = "agence_gestion_clients",
}

// IOB role enum
export enum IobRole {
  order_executor = "order_executor",
  order_validator_iob_1 = "order_validator_iob_1",
  order_validator_iob_2 = "order_validator_iob_2",
  iob_secondary_market = "iob_secondary_market",
}

// TCC role enum
export enum TccRole {
  client_account_manager_1 = "client_account_manager_1",
  client_account_manager_2 = "client_account_manager_2",
  order_validator_tcc_1 = "order_validator_tcc_1",
  order_validator_tcc_2 = "order_validator_tcc_2",
  order_extern_initializer = "order_extern_initializer",
  client_account_extern_manager = "client_account_extern_manager",
  tcc_admin = "tcc_admin",
  tcc_viewer_order_history = "tcc_viewer_order_history",
  order_validator_tcc_retour_1 = "order_validator_tcc_retour_1",
  order_validator_tcc_retour_2 = "order_validator_tcc_retour_2",
  tcc_gestion_emetteurs = "tcc_gestion_emetteurs",
  tcc_gestion_titres = "tcc_gestion_titres",
  tcc_gestion_clients = "tcc_gestion_clients",
}

// Super admin role constant
export const SUPER_ADMIN_ROLE = "finbourse_super_admin";

// Client roles array
export const CLIENT_ROLES: RoleType[] = [
  {
    id: ClientRole.client_viewer_portfolio,
    label: "Portfolio Viewer",
    description: "Can view client portfolio information.",
  },
  {
    id: ClientRole.client_viewer_order_history,
    label: "Order History Viewer",
    description: "Can view order history for client.",
  },
  {
    id: ClientRole.order_initializer_client,
    label: "Order Initializer",
    description: "Can initialize/create orders for client.",
  },
];

// Agency roles array
export const AGENCY_ROLES: RoleType[] = [
  {
    id: AgenceRole.agence_client_manager,
    label: "Client Manager",
    description: "Client manager for agence.",
  },
  {
    id: AgenceRole.order_initializer_agence,
    label: "Order Initializer",
    description: "Order initializer for agence.",
  },
  {
    id: AgenceRole.order_validator_agence_1,
    label: "First Level Order Validator",
    description: "First level order validator for agence.",
  },
  {
    id: AgenceRole.order_validator_agence_2,
    label: "Second Level Order Validator",
    description: "Second level order validator for agence.",
  },
  {
    id: AgenceRole.agence_viewer_order_history,
    label: "Order History Viewer",
    description: "Can view order history for agency.",
  },
  {
    id: AgenceRole.order_validator_agence_retour_1,
    label: "Return First Level Order Validator",
    description: "Return first level order validator for agence.",
  },
  {
    id: AgenceRole.order_validator_agence_retour_2,
    label: "Return Second Level Order Validator",
    description: "Return second level order validator for agence.",
  },
  {
    id: AgenceRole.agence_gestion_clients,
    label: "Client Management",
    description: "Can manage clients for agency.",
  },
];

// IOB roles array
export const IOB_ROLES: RoleType[] = [
  {
    id: IobRole.order_executor,
    label: "Order Executor",
    description: "Can execute orders in the IOB system.",
  },
  {
    id: IobRole.order_validator_iob_1,
    label: "First Level Order Validator",
    description: "First level order validator for IOB.",
  },
  {
    id: IobRole.order_validator_iob_2,
    label: "Second Level Order Validator",
    description: "Second level order validator for IOB.",
  },
  {
    id: IobRole.iob_secondary_market,
    label: "IOB Secondary Market",
    description: "Handles secondary market operations for IOB.",
  },
];

// TCC roles array
export const TCC_ROLES: RoleType[] = [
  {
    id: TccRole.client_account_manager_1,
    label: "First Level Client Account Manager",
    description: "First level client account manager.",
  },
  {
    id: TccRole.client_account_manager_2,
    label: "Second Level Client Account Manager",
    description: "Second level client account manager.",
  },
  {
    id: TccRole.order_validator_tcc_1,
    label: "First Level Order Validator",
    description: "First level order validator for TCC.",
  },
  {
    id: TccRole.order_validator_tcc_2,
    label: "Second Level Order Validator",
    description: "Second level order validator for TCC.",
  },
  {
    id: TccRole.order_extern_initializer,
    label: "External Order Initializer",
    description: "External order initializer.",
  },
  {
    id: TccRole.client_account_extern_manager,
    label: "External Client Account Manager",
    description: "External client account manager.",
  },
  {
    id: TccRole.tcc_admin,
    label: "TCC Administrator",
    description: "TCC administrator.",
  },
  {
    id: TccRole.tcc_viewer_order_history,
    label: "Order History Viewer",
    description: "Can view order history for TCC.",
  },
  {
    id: TccRole.order_validator_tcc_retour_1,
    label: "Return First Level Order Validator",
    description: "Return first level order validator for TCC.",
  },
  {
    id: TccRole.order_validator_tcc_retour_2,
    label: "Return Second Level Order Validator",
    description: "Return second level order validator for TCC.",
  },
  {
    id: TccRole.tcc_gestion_emetteurs,
    label: "Issuer Management",
    description: "Can manage issuers for TCC.",
  },
  {
    id: TccRole.tcc_gestion_titres,
    label: "Securities Management",
    description: "Can manage securities for TCC.",
  },
  {
    id: TccRole.tcc_gestion_clients,
    label: "Client Management",
    description: "Can manage clients for TCC.",
  },
];

// Super admin role
export const SUPER_ADMIN: RoleType = {
  id: SUPER_ADMIN_ROLE,
  label: "System Super Administrator",
  description: "System super administrator with full access.",
};

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
  const allRoles = [
    ...CLIENT_ROLES,
    ...AGENCY_ROLES,
    ...TCC_ROLES,
    ...IOB_ROLES,
    SUPER_ADMIN,
  ];
  return allRoles.find((role) => role.id === roleId);
}

// Export all role values as arrays for easy access
export const ALL_CLIENT_ROLES = Object.values(ClientRole);
export const ALL_AGENCE_ROLES = Object.values(AgenceRole);
export const ALL_IOB_ROLES = Object.values(IobRole);
export const ALL_TCC_ROLES = Object.values(TccRole);
