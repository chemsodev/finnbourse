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

  // For development - show a message about role-based access
  return (
    <div className="p-4 bg-white rounded-lg shadow-sm">
      <div className="text-sm text-gray-700 mb-4 border-b pb-3">
        <p className="font-medium mb-2">Role-Based Navigation</p>
        <p className="text-xs text-gray-500 mb-2">
          Currently showing all pages for development. Later, access will be
          restricted based on specific user roles:
        </p>
        <ul className="text-xs list-disc pl-4 mb-3 text-gray-600">
          <li>Users will only see pages they have permission to access</li>
          <li>Each actor type (Agency, TCC, IOB) has role-specific pages</li>
          <li>Consultation roles can view but not modify content</li>
          <li>Action roles can both view and modify their specific page</li>
        </ul>
        <code className="text-xs bg-gray-100 p-2 rounded block whitespace-pre-wrap overflow-auto max-h-64">
          {JSON.stringify(ROLES_CONFIG, null, 2)}
        </code>
      </div>
    </div>
  );

  /* Commented out original implementation - will be restored with backend role data */
};

export default OrderManagementNav;
