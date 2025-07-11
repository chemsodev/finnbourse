import { SVGProps } from "react";

export interface MarketCardProps {
  title: string;
  description: string;
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

export type StockStatus = "activated" | "suspended" | "delisted";
export type StockType =
  | "obligation"
  | "action"
  | "sukuk"
  | "participatif"
  | string;
export type MarketType = "primaire" | "secondaire";
export type MarketListing = "ALG" | "TUN" | "CAS";
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
  // isPrimary: boolean;
  stockPrice?: StockPrice;
  // institutions: FinancialInstitution[];
  institutions: string[];
  capitalOperation?: "augmentation" | "ouverture";
  createdAt?: string;
  updatedAt?: string;
  durationYears?: number;
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
  stockPrices?: StockPrice[];
}
export interface MarketTableProps {
  type: StockType;
}

export interface StockPrice {
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
