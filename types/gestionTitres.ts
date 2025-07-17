import { SVGProps } from "react";

export interface MarketCardProps {
  title: string;
  description: string;
  text?: string[];
  listItems?: string[];
  href: string;
  Icon: React.FC<SVGProps<SVGSVGElement>>;
}

// Stock
export interface Issuer {
  id: string;
  name: string;
  code?: string;
  activitySector?: string;
  address?: string;
  capital?: string;
  email?: string;
  tel?: string;
  website?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Master {
  id: string;
  institutionName?: string;
  agreementNumber?: string;
  establishmentDate?: string;
  fullAddress?: string;
  legalForm?: string;
  taxIdentificationNumber?: string;
}

export interface CapitalOperation {
  id: string;
  type: string;
  date: string;
  amount: number;
}

export interface FinancialInstitution {
  id: string;
  institutionName: string;
  taxIdentificationNumber?: string;
  agreementNumber?: string;
  legalForm?: string;
  establishmentDate?: string;
  fullAddress?: string;
}

export interface CapitalRepaymentScheduleItem {
  date: Date;
  rate: number;
}

export interface CouponScheduleItem {
  date: Date;
  rate: number;
}
// export interface RepaymentSchedule {
//   id: string;
//   date: string;
//   amount: number;
// }

export interface CouponSchedule {
  id: string;
  date: string;
  rate: number;
  amount: number;
}

export type StockStatus = "activated" | "deactivated" | "delisted";
export type StockType =
  | "obligation"
  | "action"
  | "sukuk"
  | "obligationsOrdinaires"
  | "oat"
  | string;
export type MarketType = "primaire" | "secondaire";
export type MarketListing = "PME" | "PRINCIPAL";
export type ShareClass = "A" | "B" | "C" | null;
export type RepaymentMethod = "amortization" | "bullet" | "callable" | null;

// export interface Stock {
//   id: string;
//   name?: string;
//   code?: string;
//   issuer: Issuer | string;
//   emissionDate?: string;
//   closingDate?: string;
//   enjoymentDate?: string;
//   status?: string;
//   stockPrices?: {
//     price: number;
//   }[];
// }

// export type StockType =
//   | "action"
//   | "obligation"
//   | "sukuk"
//   | "participatif"
//   | "opv"
//   | "empruntobligataire"
//   | "sukukmp"
//   | "sukukms"
//   | "titresparticipatifs"
//   | "titresparticipatifsmp"
//   | "titresparticipatifsms";

export interface Stock {
  id?: string;
  name?: string;
  stockType: StockType;
  isinCode: string;
  code: string;
  faceValue: number;
  quantity: number;
  emissionDate: Date;
  enjoymentDate: Date;
  closingDate: Date;
  marketListing: MarketListing;
  type?: string;
  issuer: string;
  master: string;
  status: StockStatus;
  price?: number;
  institutions: string[];
  capitalOperation?:
    | "augmentation"
    | "ouverture"
    | "empruntObligatairePublic"
    | "empruntObligataireInstitutionnel"
    | "placementOrganise";
  createdAt?: string;
  updatedAt?: string;
  duration?: string;
  nombreDeTranches?: number;
  // Financial fields
  dividendRate?: number;
  estimatedRate?: number;
  fixedRate?: number;
  variableRate?: number;
  yieldRate?: number;

  // Dates
  maturityDate?: Date;

  // Additional fields
  // shareClass: ShareClass;
  // repaymentMethod?: RepaymentMethod;
  votingRights: boolean;

  //Schedules
  capitalRepaymentSchedule?: CapitalRepaymentScheduleItem[];
  couponSchedule?: CouponScheduleItem[];

  // Related data

  // capitalRepaymentSchedule?: RepaymentSchedule[];
  // couponSchedule?: CouponSchedule[];
  stockPrices?: StockPrices[];
}
export interface MarketTableProps {
  type: StockType;
}

export interface StockPrices {
  price: number;
  date: Date;
  gap?: number;
}

export interface StockFilter {
  marketType: MarketType;
  stockType: string;
}

export interface MoveToSecondaryData {
  price: number;
  date: string;
  gap?: number;
}

export interface ApiError {
  message: string;
  status?: number;
  errors?: Record<string, string>;
}

export interface SecondaryMarketResponse {
  data: Stock[];
  total: number;
}

export interface PrimaryMarketResponse extends Array<Stock> {}
