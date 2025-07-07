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
  activitySector: string;
  address: string;
  capital: string;
  email: string;
  tel: string;
  website?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Master {
  id: string;
  institutionName: string;
  agreementNumber: string;
  establishmentDate: string;
  fullAddress: string;
  legalForm: string;
  taxIdentificationNumber: string;
}

export interface CapitalOperation {
  id: string;
  type: string;
  date: string;
  amount: number;
}

export interface Institution {
  id: string;
  name: string;
  type: string;
}

export interface RepaymentSchedule {
  id: string;
  date: string;
  amount: number;
}

export interface CouponSchedule {
  id: string;
  date: string;
  rate: number;
  amount: number;
}

export type StockStatus = "activated" | "suspended" | "delisted";
export type StockType = "obligation" | "action" | string;
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
  id: string;
  name: string;
  stockType: StockType;
  isinCode: string;
  code: string;
  faceValue: number;
  quantity: number;
  emissionDate: string;
  enjoymentDate: string;
  closingDate: string;
  marketListing: MarketListing;
  type: string;
  issuer: Issuer;
  master: Master;
  status: StockStatus;
  isPrimary: boolean;
  stockPrice?: StockPrice;
  createdAt?: string;
  updatedAt?: string;
  // Financial fields
  dividendRate: number | null;
  estimatedRate: number | null;
  fixedRate: number | null;
  variableRate: number | null;
  yieldRate: number | null;

  // Dates
  maturityDate: string | null;

  // Additional fields
  shareClass: ShareClass;
  repaymentMethod: RepaymentMethod;
  votingRights: boolean | null;

  // Related data
  capitalOperation: CapitalOperation | null;
  capitalRepaymentSchedule: RepaymentSchedule[];
  couponSchedule?: CouponSchedule[];
  institutions: Institution[];
  stockPrices: StockPrice[];
}
export interface MarketTableProps {
  type: StockType;
}

export interface StockPrice {
  stock: string;
  price: number;
  date: string;
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
