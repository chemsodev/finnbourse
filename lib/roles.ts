// Contains role definitions for different user types in the system
// Based on the documentation in dco.md

export type RoleType = {
  id: string;
  label: string;
  description: string;
};

// Client roles
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

// Agency roles
export const AGENCY_ROLES: RoleType[] = [
  {
    id: "agency_order_declarer",
    label: "Déclarateur d'ordre",
    description:
      "Peut déclarer/créer un ordre pour le client (équivalent création + validations côté client).",
  },
  {
    id: "agency_first_approver",
    label: "Premier validateur",
    description:
      "Premier validateur (vérifie la disponibilité des comptes, montants, etc.).",
  },
  {
    id: "agency_final_approver",
    label: "Validateur final",
    description: "Deuxième validateur avant envoi au TCC.",
  },
  {
    id: "agency_viewer",
    label: "Observateur",
    description: "Peut uniquement consulter les ordres (lecture seule).",
  },
  {
    id: "agency_user_admin",
    label: "Administrateur utilisateurs",
    description:
      "Peut créer et gérer les utilisateurs de l'agence (création, suppression, assignation de rôles).",
  },
  {
    id: "agency_client_admin",
    label: "Administrateur clients",
    description:
      "Peut créer et gérer les clients de l'agence et assigner/modifier les rôles des utilisateurs clients.",
  },
];

// TCC roles
export const TCC_ROLES: RoleType[] = [
  {
    id: "tcc_super_admin",
    label: "Super Administrateur",
    description: "Dispose de tous les droits (super administrateur).",
  },
  {
    id: "tcc_first_approver",
    label: "Premier validateur",
    description:
      "Peut valider en première instance les ordres reçus de l'agence.",
  },
  {
    id: "tcc_final_approver",
    label: "Validateur final",
    description: "Peut effectuer la validation finale des ordres de l'agence.",
  },
  {
    id: "tcc_viewer",
    label: "Observateur",
    description: "Peut uniquement consulter les ordres (lecture seule).",
  },
  {
    id: "tcc_external_client_creator",
    label: "Créateur clients externes",
    description: "Peut créer des clients pour les agences externes.",
  },
  {
    id: "tcc_external_order_creator",
    label: "Créateur ordres externes",
    description: "Peut créer des ordres pour les agences externes.",
  },
  {
    id: "tcc_external_IOB_operator",
    label: "Opérateur IOB externe",
    description: "Possède tous les droits IOB, mais pour les agences externes.",
  },
];

// IOB roles
export const IOB_ROLES: RoleType[] = [
  {
    id: "iob_user_admin",
    label: "Administrateur utilisateurs",
    description: "Peut gérer les utilisateurs IOB et leurs rôles.",
  },
  {
    id: "iob_order_executor",
    label: "Exécuteur d'ordres",
    description:
      "Peut imprimer les listes d'ordres et exécuter les ordres à la bourse.",
  },
  {
    id: "iob_result_submitter",
    label: "Soumetteur de résultats",
    description:
      "Peut insérer les résultats d'exécution des ordres pour transmission au TCC.",
  },
  {
    id: "iob_viewer",
    label: "Observateur",
    description:
      "Peut uniquement consulter les ordres et leurs états (lecture seule).",
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
