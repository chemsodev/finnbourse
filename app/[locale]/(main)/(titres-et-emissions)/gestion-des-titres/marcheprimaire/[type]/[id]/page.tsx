"use client";
import { TitreDetails } from "@/components/titres/TitreDetails";
import { TitreFormValues } from "@/components/titres/titreSchemaValidation";
import { useFinancialInstitution } from "@/hooks/useFinancialInstitution";
import { useIssuer } from "@/hooks/useIssuer";
import { useStockApi } from "@/hooks/useStockApi";
import { Stock, StockType } from "@/types/gestionTitres";
import { ArrowLeft, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";
import Link from "next/link";
import { useEffect, useState } from "react";

interface PageParams {
  id: string;
  type: string;
}

function mapToStockType(
  type: StockType
): "action" | "obligation" | "sukuk" | "obligationsOrdinaires" | "oat" {
  const mapping: Record<
    StockType,
    "action" | "obligation" | "sukuk" | "obligationsOrdinaires" | "oat"
  > = {
    opv: "action",
    empruntobligataire: "obligation",
    action: "action",
    obligation: "obligation",
    sukuk: "sukuk",
    sukukmp: "sukuk",
    sukukms: "sukuk",
  };
  return mapping[type] || "action";
}

// Helper function to map StockType to ObligationType
function mapToObligationType(type: StockType): "participatif" | "sukuk" {
  if (type.includes("sukuk")) {
    return "sukuk";
  }
  if (type.includes("participatif")) {
    return "participatif";
  }
  return "participatif";
}

// Helper function to extract issuer ID
function extractIssuerId(issuer: any): string {
  if (typeof issuer === "string") {
    return issuer;
  }
  if (issuer && typeof issuer === "object" && issuer.id) {
    return issuer.id;
  }
  return "";
}
// Helper function to  extract institution IDs

function extractInstitutionIds(institutions: any[]): string[] {
  if (!Array.isArray(institutions)) {
    return [];
  }

  return institutions
    .map((inst) => {
      if (typeof inst === "string") {
        return inst;
      }
      if (inst && typeof inst === "object" && inst.id) {
        return inst.id;
      }
      return "";
    })
    .filter((id) => id !== "");
}

// Helper function to get type display name
// const getTypeDisplayName = (type: string) => {
//   const typeNames: Record<string, string> = {
//     opv: "Public Offering (OPV)",
//     empruntobligataire: "Bond Issues",
//     action: "Stocks",
//     sukuk: "Sukuk",
//     participative: "Participative Securities",
//   };

//   return typeNames[type] || type.charAt(0).toUpperCase() + type.slice(1);
// };

export default function TitreDetailsPage({ params }: { params: PageParams }) {
  const t = useTranslations("GestionDesTitres");
  const api = useStockApi();

  const {
    institutions: financialInstitutions,
    isLoading: institutionsLoading,
  } = useFinancialInstitution();
  const { issuers, isLoading: issuersLoading } = useIssuer();

  const [titre, setTitre] = useState<Stock | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // Simulate API calls with mock data
  // const titre = getMockTitre(params.id);
  // const companies = getMockCompanies();
  // const institutions = getMockInstitutions();

  useEffect(() => {
    const fetchTitre = async () => {
      try {
        setLoading(true);
        const data = await api.getStockById(params.id);
        setTitre(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load titre");
        console.error("Error fetching titre:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTitre();
  }, [params.id, api]);

  if (loading || institutionsLoading || issuersLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t("ViewTitre.notFound")}
            </h2>
            <p className="text-gray-600">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  if (!titre) {
    return (
      <div className="container mx-auto py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center py-12">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {t("ViewTitre.notFound")}
            </h2>
            <p className="text-gray-600">
              {t("ViewTitre.notFoundDescription", { id: params.id })}
            </p>
          </div>
        </div>
      </div>
    );
  }

  const titreData: TitreFormValues = {
    id: titre.id,
    name: titre.name || "",
    stockType: mapToStockType(titre.stockType),
    // type: mapToObligationType(titre?.type || ""),
    code: titre.code || "",
    issuer: extractIssuerId(titre.issuer) || "",
    isinCode: titre.isinCode || "",
    faceValue: titre.faceValue || 0,
    quantity: titre.quantity || 1,
    master: titre.master || "",
    emissionDate: titre.emissionDate
      ? new Date(titre.emissionDate)
      : new Date(),
    closingDate: titre.closingDate ? new Date(titre.closingDate) : new Date(),
    enjoymentDate: titre.enjoymentDate
      ? new Date(titre.enjoymentDate)
      : new Date(),
    marketListing: titre.marketListing || "PME",
    status: ["activated", "deactivated", "delisted"].includes(
      titre.status as string
    )
      ? (titre.status as "activated" | "deactivated" | "delisted")
      : "activated",
    stockPrice: {
      price: titre.stockPrices?.[0]?.price || 0,
      date: new Date(),
      gap: 0,
    },
    capitalOperation: titre.capitalOperation || "ouverture",
    votingRights: titre.votingRights || false,
    dividendRate: titre.dividendRate,
    durationYears: titre.durationYears || 1,
    institutions: extractInstitutionIds(titre.institutions || []),
    maturityDate: titre.maturityDate ? new Date(titre.maturityDate) : undefined,

    // Schedules
    capitalRepaymentSchedule:
      titre.capitalRepaymentSchedule?.map((item) => ({
        date: new Date(item.date),
        rate: item.rate || 0,
      })) || [],

    couponSchedule:
      titre.couponSchedule?.map((item) => ({
        date: new Date(item.date),
        rate: item.rate || 0,
      })) || [],
  };

  return (
    <div className="container mx-auto py-8 motion-preset-focus motion-duration-2000">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link
          href={`/gestion-des-titres/marcheprimaire/${params.type}`}
          className="inline-flex gap-2 items-center border rounded-md py-1 px-2 bg-primary text-white  md:mt-10"
        >
          <ArrowLeft className="w-5" /> <div>{t("actions.back")}</div>
        </Link>
        <TitreDetails
          data={titreData}
          companies={issuers}
          institutions={financialInstitutions}
        />
      </div>
    </div>
  );
}
