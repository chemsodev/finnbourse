export enum ClientRole {
  client_viewer_portfolio = "client_viewer_portfolio",
  client_viewer_order_history = "client_viewer_order_history",
  order_initializer_client = "order_initializer_client",
}

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

export enum IobRole {
  order_executor = "order_executor",
  order_validator_iob_1 = "order_validator_iob_1",
  order_validator_iob_2 = "order_validator_iob_2",
  iob_secondary_market = "iob_secondary_market",
}

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

export const SUPER_ADMIN_ROLE = "finbourse_super_admin";

export type AllRoles =
  | ClientRole
  | AgenceRole
  | IobRole
  | TccRole
  | typeof SUPER_ADMIN_ROLE;

// Helper function to get role translation key
export function getRoleTranslationKey(role: string): string {
  // Convert role enum value to translation key for i18n
  return `roles.${role}`;
}
