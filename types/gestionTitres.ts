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
  name: string;
  code?: string;
}

export interface Stock {
  id: string;
  name?: string;
  code?: string;
  issuer: Issuer | string;
  emissionDate?: string;
  closingDate?: string;
  enjoymentDate?: string;
  status?: string;
  stockPrices?: {
    price: number;
  }[];
}

export type StockType =
  | "action"
  | "obligation"
  | "sukuk"
  | "participatif"
  | "opv"
  | "empruntobligataire"
  | "sukukmp"
  | "sukukms"
  | "titresparticipatifs"
  | "titresparticipatifsmp"
  | "titresparticipatifsms";

export interface MarketTableProps {
  type: StockType;
}
