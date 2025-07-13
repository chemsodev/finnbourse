export interface NewsArticle {
  id: string;
  writerId: string;
  isPublished: boolean;
  title: string;
  content: string;
  language: string;
}
export interface Notification {
  id: string;
  userid: string;
  message: string;
  readstatus: boolean;
  url: string;
  createdat: string;
}
export interface SupportQuestion {
  id: string;
  question: string;
  answer: string;
  language: string;
  description: string;
  userid: string;
  state: boolean;
}
export interface Stock {
  id: string;
  type: string;
  name: string;
  isinCode: string;
  code: string;
  facevalue: number;
  issuer: string;
  ListedCompanyId: string;
  marketListing: string;
  emissionDate: string;
  enjoymentDate: string | null;
  quantity: number;
}
export interface Bond {
  id: string;
  type: string;
  name: string;
  isinCode: string;
  issuer: string;
  ListedCompanyId: string;
  marketListing: string;
  emissionDate: string;
  enjoymentDate: string | null;
  quantity: number;
}
export interface TitreParticipatif {
  id: string;
  type: string;
  name: string;
  isinCode: string;
  issuer: string;
  ListedCompanyId: string;
  marketListing: string;
  emissionDate: string;
  enjoymentDate: string | null;
  quantity: number;
}

export interface Security {
  id: string;
  type: string;
  name: string;
  code: string;
  facevalue: number;
  isinCode: string;
  issuer: string;
  ListedCompanyId: string;
  marketListing: string;
  emissionDate: string;
  enjoymentDate: string | null;
  quantity: number;
  shareClass: string | null;
  votingRights: string | null;
  dividendInfo: string | null;
  maturityDate?: string | null;
  faceValue?: number;
  couponRate?: number;
  secteurActivite: string;
  capitalisationBoursiere: string;
  siteOfficiel: string;
  couponSchedule?: string | null;
  repaymentMethod?: string | null;
  yieldRate?: number | null;
  contact: {
    email: string;
    phonenumber: string;
  };
}

export interface Person {
  id: string;
  fullname: string;
  email: string;
  phonenumber: string | null;
  followsbusiness: boolean;
  businessid: string | null;
  status: number;
  extrafields: string | null;
}

export interface User {
  id: string;
  fullname: string;
  followsbusiness: boolean;
  roleid: number;
  phonenumber: string;
  email: string;
  address: string;
  birthdate: string;
  trustnumber: string;
  nationality: string;
  countryofresidence: string;
  negotiatorid: string;
  countryofbirth: string;
  profession: string;
  zipcode: string;
  status: number;
}

export interface Action {
  societeEmettrice: string;
  marcheDeCotation: string;
  codeBourse: string;
  codeISIN: string;
  dateEmission: string; // ISO Date
  dateJouissance: string; // ISO Date
  valeurNominale: number;
  nombreActions: number;
}

export interface Obligation {
  societeEmettrice: string;
  marcheDeCotation: string;
  codeBourse: string;
  codeISIN: string;
  dateEmission: string; // ISO Date
  dateJouissance: string; // ISO Date
  dateEcheance: string; // ISO Date
  dureeDeVie: number; // in years
  valeurNominale: number;
  nombreObligations: number;
  modeRemboursement: "Infine" | "Capital Constant" | "Annuité Constante";
  tauxCoupon: { annee: number; taux: number }[]; // Array for progressive coupons
  tauxRendementActuariel: number; // percentage
}
export interface TitresParticipatifs {
  societeEmettrice: string;
  marcheDeCotation: string;
  codeBourse: string;
  codeISIN: string;
  dateEmission: string; // ISO Date
  dateJouissance: string; // ISO Date
  dateEcheance: string; // ISO Date
  dureeDeVie: number; // in years
  valeurNominale: number;
  nombreTitres: number;
  tauxCouponFixe: number; // percentage
  tauxCouponVariable?: number; // optional, percentage
}
export interface Sukuk {
  societeEmettrice: string;
  marcheDeCotation: string;
  codeBourse: string;
  codeISIN: string;
  dateEmission: string; // ISO Date
  dateJouissance: string; // ISO Date
  dateEcheance: string; // ISO Date
  dureeDeVie: number; // in years
  valeurNominale: number;
  nombreTitres: number;
  remuneration: number; // percentage
}
export interface SocieteCotee {
  nomSociete: string;
  secteurActivite: string;
  capitalisationBoursiere: number; // in currency value
  titresEmisEtCodes: { typeTitre: string; code: string }[]; // Array for multiple titles
  siteOfficiel: string; // URL
  contact: {
    email: string;
    numerosTelephone: string[];
  };
}

export interface CommissionTier {
  minAmount: number;
  maxAmount: number | null;
  value: number;
}

export interface Commission {
  id: string;
  loiDeFrais: string;
  marche: string;
  libelle: string;
  code: string;
  titreType?: "action" | "obligation"; // Type du titre
  commissionType: string;
  commissionValue: number;
  commissionSGBV?: number; // Commission SGBV
  tva: number;
  irgType1: number;
  irgType2: number;
  tiers: CommissionTier[];
  createdAt: string;
}
export interface AccountData {
  id: string;
  codeAgent: string;
  compteEspece: string;
  compteBancaire: string;
  orderDeTu: string;
}

export interface OstAnnouncement {
  id: string;
  titrePrincipal: string;
  evenement: string;
  descriptionOst: string;
  typeOst: string;
  dateOperation: Date;
  dateDebut: Date;
  dateFin: Date;
  dateRep: Date;
  dateValeurPaiement: Date;
  rappel: Date;
  titrePrincipalField: string;
  titreResultat: string;
  actionAnc: string;
  nelleAction: string;
  montantUnitaire: string;
  montantBrut: string;
  commentaire: string;
}

export interface Emission {
  id: string;
  codeISIN: string;
  issuer: string;
  centralizingAgency: string;
  viewAccountNumber: string;
  typeOfBroadcast: string;
  issueAmount: string;
  issueDate: string;
  dueDate: string;
  duration: string;
  cosobApproval: string;
  leader: string;
  coLead: string;
  memberNo01: string;
  memberNo02: string;
  memberNo03: string;
  memberNo04: string;
}

export interface BourseSession {
  id: string;
  name: string;
  date: Date;
  status: "scheduled" | "active" | "completed";
  createdAt: Date;
  updatedAt: Date;
}

// Update your Order interface to include sessionId
export interface Order {
  id: string;
  securityissuer: string;
  securitytype: string;
  securityid: string;
  securityquantity: number;
  quantity: number;
  orderdate: string;
  orderstatus: number;
  investorid: string;
  negotiatorid: string;
  validity: string;
  duration: number;
  createdat: string;
  payedWithCard: boolean;

  // Common fields
  visaCosob: string;
  isinCode: string;
  emissionDate: string;

  // Souscription specific fields
  bdl?: string;
  totalShares?: number;
  commission?: string;
  netAmount?: string;

  // Ordre specific fields
  mst?: string;
  orderdirection?: number;
  priceInstruction?: string;
  timeInstruction?: string;
  validityDate?: string;
  grossAmount?: string;

  // API response fields
  apiActions?: string | null;
  status?: string; // Raw status from API
  marketType?: string; // Market type (primary/secondary)
  validationType?: string; // Buy/sell type
  condition?: string; // Combined order conditions
}
