export type OrderStatus =
  | "premiere-validation"
  | "validation-finale"
  | "validation-retour-premiere"
  | "validation-retour-finale"
  | "validation-tcc-premiere"
  | "validation-tcc-finale"
  | "validation-tcc-retour-premiere"
  | "validation-tcc-retour-finale"
  | "execution"
  | "resultats"
  | "final-state";

export interface Souscripteur {
  qualite_souscripteur: string;
  nom_prenom: string;
  adresse: string;
  wilaya: string;
  date_naissance: string;
  num_cni_pc: string;
  nationalite: string;
}

export interface JournalOrder {
  id: number;
  stock_id: string;
  client_id: string;
  client_nom: string;
  stock_code: string;
  stock_issuer_nom: string;
  status: OrderStatus;
  quantity: number;
  price: number;
  market_type: string;
  operation_type: string;
  time_condition: string | null;
  price_condition: string | null;
  quantitative_condition: string | null;
  minQuantity: number;
  validity: string | null;
  souscripteur: Souscripteur;
  created_by: string;
}

export interface JournalOrdersResponse {
  error: null | string;
  data: {
    orders: JournalOrder[];
  };
}

export interface JournalOrdersFilter {
  status?: string;
  market_type?: string;
}

export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string>;
}
