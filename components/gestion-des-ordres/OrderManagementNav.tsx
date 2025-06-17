"use client";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  ListFilter,
  Wallet,
  CheckCircle,
  Clock,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";

// Role definitions that will come from the backend later
const ROLES_CONFIG = {
  // Agency roles - more granular access control
  agence: {
    // Specific action roles - only access to their specific page
    premiere_validation: {
      pages: ["/ordres/premiere-validation"],
      canModify: true,
    },
    validation_finale: {
      pages: ["/ordres/validation-finale"],
      canModify: true,
    },
    // Consultation role - can see all agency pages but can't modify
    consultation: {
      pages: ["/ordres/premiere-validation", "/ordres/validation-finale"],
      canModify: false,
    },
  },

  // TCC roles
  tcc: {
    // Specific action roles
    validation_premiere: {
      pages: ["/ordres/validation-tcc-premiere"],
      canModify: true,
    },
    validation_finale: {
      pages: ["/ordres/validation-tcc-finale"],
      canModify: true,
    },
    // Consultation role
    consultation: {
      pages: [
        "/ordres/validation-tcc-premiere",
        "/ordres/validation-tcc-finale",
      ],
      canModify: false,
    },
  },

  // IOB roles
  iob: {
    // Specific action roles
    execution: {
      pages: ["/ordres/execution"],
      canModify: true,
    },
    resultats: {
      pages: ["/ordres/resultats"],
      canModify: true,
    },
    // Consultation role
    consultation: {
      pages: ["/ordres/execution", "/ordres/resultats"],
      canModify: false,
    },
  },

  // Super admin role - access to everything
  admin: {
    all: {
      pages: [
        "/ordres/premiere-validation",
        "/ordres/validation-finale",
        "/ordres/validation-tcc-premiere",
        "/ordres/validation-tcc-finale",
        "/ordres/execution",
        "/ordres/resultats",
      ],
      canModify: true,
    },
  },
};

interface OrderManagementNavProps {
  userRole?: string;
  userType?: "agence" | "tcc" | "iob";
}

const OrderManagementNav = ({
  userRole,
  userType,
}: OrderManagementNavProps) => {
  const t = useTranslations("orderManagement");
  const pathname = usePathname();

  // Show all navigation items without role restrictions
  return <div className="p-4 bg-white rounded-lg shadow-sm"></div>;

  /* Commented out original implementation - will be restored with backend role data */
};

export default OrderManagementNav;
