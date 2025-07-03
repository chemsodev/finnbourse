export enum AgenceRole {
  agence_client_manager_1 = "agence_client_manager_1",
  agence_client_manager_2 = "agence_client_manager_2",
  order_initializer_agence = "order_initializer_agence",
  order_validator_agence_1 = "order_validator_agence_1",
  order_validator_agence_2 = "order_validator_agence_2",
  observateur_agence = "observateur_agence",
  agence_admin = "agence_admin",
}

export enum IobRole {
  order_submiter = "order_submiter",
  order_validator_iob_1 = "order_validator_iob_1",
  order_validator_iob_2 = "order_validator_iob_2",
  observateur_iob = "observateur_iob",
  iob_admin = "iob_admin",
}

export enum TccRole {
  client_account_manager_1 = "client_account_manager_1",
  client_account_manager_2 = "client_account_manager_2",
  order_validator_tcc_1 = "order_validator_tcc_1",
  order_validator_tcc_2 = "order_validator_tcc_2",
  order_extern_initializer = "order_extern_initializer",
  client_account_extern_manager = "client_account_extern_manager",
  observateur_tcc = "observateur_tcc",
  tcc_admin = "tcc_admin",
  finbourse_super_admin = "finbourse_super_admin",
}

export type AllRoles = AgenceRole | IobRole | TccRole;

// Helper function to get role translation key
export function getRoleTranslationKey(role: string): string {
  // Convert role enum value to translation key
  switch (role) {
    case AgenceRole.agence_client_manager_1:
      return "agenceClientManager1";
    case AgenceRole.agence_client_manager_2:
      return "agenceClientManager2";
    case AgenceRole.order_initializer_agence:
      return "orderInitializerAgence";
    case AgenceRole.order_validator_agence_1:
      return "orderValidatorAgence1";
    case AgenceRole.order_validator_agence_2:
      return "orderValidatorAgence2";
    case AgenceRole.observateur_agence:
      return "observateurAgence";
    case AgenceRole.agence_admin:
      return "agenceAdmin";
    default:
      return role; // fallback to original role name
  }
}
