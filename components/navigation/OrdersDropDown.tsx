"use client";
import React, { useState } from "react";
import {
  Check,
  ChevronDown,
  ChevronRight,
  ClipboardCheck,
  Building,
  Briefcase,
  FileText,
  Clock,
  CheckCircle2,
  Wallet,
  BarChart4,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

/**
 * Order management dropdown navigation
 *
 * TODO: In the future, the visible navigation items will be filtered based on user role
 * using data from the backend. For now, all items are displayed for development purposes.
 *
 * Role-based access will work as follows:
 *
 * 1. Agency roles:
 *    - premiere_validation: Only sees the premiere-validation page (with modify rights)
 *    - validation_finale: Only sees the validation-finale page (with modify rights)
 *    - consultation: Can see all agency pages but cannot modify content
 *
 * 2. TCC roles:
 *    - validation_premiere: Only sees the validation-tcc-premiere page (with modify rights)
 *    - validation_finale: Only sees the validation-tcc-finale page (with modify rights)
 *    - consultation: Can see all TCC pages but cannot modify content
 *
 * 3. IOB roles:
 *    - execution: Only sees the execution page (with modify rights)
 *    - resultats: Only sees the resultats page (with modify rights)
 *    - consultation: Can see all IOB pages but cannot modify content
 *
 * 4. Admin role:
 *    - all: Can see and modify all pages
 */
const OrdersDropDown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const t = useTranslations("SideBar");

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex flex-col">
      <button
        onClick={toggleDropdown}
        className={`flex items-center gap-4 hover:bg-secondary/20 hover:text-primary hover:shadow-sm py-2 px-6 w-full rounded-xl ${
          pathname.includes("/ordres") ||
          pathname.includes("/admin/order-management")
            ? "bg-secondary/20 text-primary shadow-sm"
            : ""
        }`}
      >
        <FileText size={15} />
        <div className="capitalize text-sm">{t("gestionDesOrdres")}</div>
        {isOpen ? (
          <ChevronDown className="ml-auto" size={15} />
        ) : (
          <ChevronRight className="ml-auto" size={15} />
        )}
      </button>

      {isOpen && (
        <div className="flex flex-col ml-6 mt-1 border-l-[1px] border-dashed border-gray-300 pl-3">
          {/* Agency Pages */}
          <div className="mt-2 mb-1 text-xs text-gray-600 font-medium pl-2">
            {t("agence")}
          </div>
          <Link
            href="/ordres/premiere-validation"
            className={`flex items-center gap-2 hover:bg-secondary/20 hover:text-primary hover:shadow-sm py-2 px-3 w-full rounded-xl text-xs ${
              pathname === "/ordres/premiere-validation"
                ? "bg-secondary/20 text-primary shadow-sm"
                : ""
            }`}
          >
            <Clock size={14} />
            <div>{t("premiereValidation")}</div>
          </Link>
          <Link
            href="/ordres/validation-finale"
            className={`flex items-center gap-2 hover:bg-secondary/20 hover:text-primary hover:shadow-sm py-2 px-3 w-full rounded-xl text-xs ${
              pathname === "/ordres/validation-finale"
                ? "bg-secondary/20 text-primary shadow-sm"
                : ""
            }`}
          >
            <CheckCircle2 size={14} />
            <div>{t("validationFinale")}</div>
          </Link>

          {/* TCC Pages */}
          <div className="mt-2 mb-1 text-xs text-gray-600 font-medium pl-2">
            {t("tcc")}
          </div>
          <Link
            href="/ordres/validation-tcc-premiere"
            className={`flex items-center gap-2 hover:bg-secondary/20 hover:text-primary hover:shadow-sm py-2 px-3 w-full rounded-xl text-xs ${
              pathname === "/ordres/validation-tcc-premiere"
                ? "bg-secondary/20 text-primary shadow-sm"
                : ""
            }`}
          >
            <Clock size={14} />
            <div>{t("validationTCCPremiere")}</div>
          </Link>
          <Link
            href="/ordres/validation-tcc-finale"
            className={`flex items-center gap-2 hover:bg-secondary/20 hover:text-primary hover:shadow-sm py-2 px-3 w-full rounded-xl text-xs ${
              pathname === "/ordres/validation-tcc-finale"
                ? "bg-secondary/20 text-primary shadow-sm"
                : ""
            }`}
          >
            <CheckCircle2 size={14} />
            <div>{t("validationTCCFinale")}</div>
          </Link>

          {/* IOB Pages */}
          <div className="mt-2 mb-1 text-xs text-gray-600 font-medium pl-2">
            {t("iob")}
          </div>
          <Link
            href="/ordres/execution"
            className={`flex items-center gap-2 hover:bg-secondary/20 hover:text-primary hover:shadow-sm py-2 px-3 w-full rounded-xl text-xs ${
              pathname === "/ordres/execution"
                ? "bg-secondary/20 text-primary shadow-sm"
                : ""
            }`}
          >
            <Wallet size={14} />
            <div>{t("executionOrdres")}</div>
          </Link>
          <Link
            href="/ordres/resultats"
            className={`flex items-center gap-2 hover:bg-secondary/20 hover:text-primary hover:shadow-sm py-2 px-3 w-full rounded-xl text-xs ${
              pathname === "/ordres/resultats"
                ? "bg-secondary/20 text-primary shadow-sm"
                : ""
            }`}
          >
            <ClipboardCheck size={14} />
            <div>{t("soumissionResultats")}</div>
          </Link>
        </div>
      )}
    </div>
  );
};

export default OrdersDropDown;
