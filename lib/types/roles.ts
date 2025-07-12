export enum AgenceRole {
  agence_client_manager = "agence_client_manager",
  order_initializer_agence = "order_initializer_agence",
  order_validator_agence_1 = "order_validator_agence_1",
  order_validator_agence_2 = "order_validator_agence_2",
  order_validator_agence_retour_1 = "order_validator_agence_retour_1",
  order_validator_agence_retour_2 = "order_validator_agence_retour_2",
  agence_viewer_order_history = "agence_viewer_order_history",
  observateur_agence = "observateur_agence",
  agence_admin = "agence_admin",
  agence_gestion_clients = "agence_gestion_clients",
}

export enum IobRole {
  order_submiter = "order_submiter",
  order_validator_iob_1 = "order_validator_iob_1",
  order_validator_iob_2 = "order_validator_iob_2",
  observateur_iob = "observateur_iob",
  iob_admin = "iob_admin",
  iob_secondary_market = "iob_secondary_market",
}

export enum TccRole {
  client_account_manager_1 = "client_account_manager_1",
  client_account_manager_2 = "client_account_manager_2",
  order_validator_tcc_1 = "order_validator_tcc_1",
  order_validator_tcc_2 = "order_validator_tcc_2",
  order_validator_tcc_retour_1 = "order_validator_tcc_retour_1",
  order_validator_tcc_retour_2 = "order_validator_tcc_retour_2",
  tcc_viewer_order_history = "tcc_viewer_order_history",
  tcc_gestion_emetteurs = "tcc_gestion_emetteurs",
  tcc_gestion_titres = "tcc_gestion_titres",
  tcc_gestion_clients = "tcc_gestion_clients",
  order_executor = "order_executor",
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
    case AgenceRole.agence_client_manager:
      return "agenceClientManager";
    case AgenceRole.order_initializer_agence:
      return "orderInitializerAgence";
    case AgenceRole.order_validator_agence_1:
      return "orderValidatorAgence1";
    case AgenceRole.order_validator_agence_2:
      return "orderValidatorAgence2";
    case AgenceRole.order_validator_agence_retour_1:
      return "orderValidatorAgenceRetour1";
    case AgenceRole.order_validator_agence_retour_2:
      return "orderValidatorAgenceRetour2";
    case AgenceRole.agence_viewer_order_history:
      return "agenceViewerOrderHistory";
    case AgenceRole.agence_gestion_clients:
      return "agenceGestionClients";
    case AgenceRole.observateur_agence:
      return "observateurAgence";
    case AgenceRole.agence_admin:
      return "agenceAdmin";
    case TccRole.tcc_viewer_order_history:
      return "tccViewerOrderHistory";
    case TccRole.tcc_gestion_emetteurs:
      return "tccGestionEmetteurs";
    case TccRole.tcc_gestion_titres:
      return "tccGestionTitres";
    case TccRole.tcc_gestion_clients:
      return "tccGestionClients";
    case TccRole.order_validator_tcc_retour_1:
      return "orderValidatorTccRetour1";
    case TccRole.order_validator_tcc_retour_2:
      return "orderValidatorTccRetour2";
    case TccRole.order_executor:
      return "orderExecutor";
    case IobRole.iob_secondary_market:
      return "iobSecondaryMarket";
    default:
      return role; // fallback to original role name
  }
}
