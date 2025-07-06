// components/titres/TitreDetailsView.tsx
"use client";
import { useLocale, useTranslations } from "next-intl";
import { fr, ar, enUS } from "date-fns/locale";
import { format } from "date-fns";
import { TitreFormValues } from "./titreSchemaValidation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Calendar,
  Building2,
  DollarSign,
  TrendingUp,
  Users,
} from "lucide-react";

interface TitreDetailsViewProps {
  data: TitreFormValues;
  companies: { id: string; name: string }[];
  institutions: { id: string; name: string }[];
  withBackdrop?: boolean;
  isValidationReturnPage?: boolean;
  orderResponse?: {
    reliquat?: number;
    quantiteAcquise?: number;
    prix?: number;
  };
}

export function TitreDetails({
  data,
  companies,
  institutions,
  withBackdrop = false,
  isValidationReturnPage = false,
  orderResponse,
}: TitreDetailsViewProps) {
  const t = useTranslations("TitreDetails");
  const locale = useLocale();

  // Memoized locale getter
  const getDateLocale = () => {
    switch (locale) {
      case "fr":
        return fr;
      case "ar":
        return ar;
      default:
        return enUS;
    }
  };

  // Improved date formatting with error handling
  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return null;

    try {
      const dateObj = typeof date === "string" ? new Date(date) : date;
      if (isNaN(dateObj.getTime())) return null;

      return format(dateObj, locale === "ar" ? "dd/MM/yyyy" : "PPP", {
        locale: getDateLocale(),
      });
    } catch (error) {
      console.error("Date formatting error:", error);
      return null;
    }
  };

  // Optimized helper functions with error handling
  const getIssuerName = (id: string) => {
    if (!id) return null;
    return companies.find((c) => c.id === id)?.name || id;
  };

  const getInstitutionNames = (ids: string[] = []) => {
    if (!ids || ids.length === 0) return null;
    return institutions
      .filter((i) => ids.includes(i.id))
      .map((i) => i.name)
      .join(", ");
  };

  // Enhanced status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const statusConfig = {
      activated: { color: "bg-green-100 text-green-800", label: "Active" },
      suspended: { color: "bg-yellow-100 text-yellow-800", label: "Suspended" },
      deactivated: { color: "bg-red-100 text-red-800", label: "Inactive" },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] ||
      statusConfig.deactivated;

    return <Badge className={config.color}>{config.label}</Badge>;
  };

  // Enhanced detail renderer with better styling
  const renderDetail = (
    label: string,
    value: React.ReactNode,
    icon?: React.ReactNode
  ) => (
    <div className="flex items-start justify-between py-3 border-b border-gray-100 last:border-b-0">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-600 min-w-0 flex-1">
        {icon && <span className="text-gray-400">{icon}</span>}
        <span className="truncate">{label}</span>
      </div>
      <div className="text-sm text-gray-900 font-medium ml-4 text-right">
        {value || <span className="text-gray-400 italic">Not specified</span>}
      </div>
    </div>
  );

  // Format currency with proper locale
  const formatCurrency = (amount: number | null | undefined) => {
    if (!amount && amount !== 0) return null;
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "DZD", // Adjust currency as needed
      minimumFractionDigits: 2,
    }).format(amount);
  };

  // Format percentage
  const formatPercentage = (rate: number | null | undefined) => {
    if (!rate && rate !== 0) return null;
    return `${rate.toFixed(2)}%`;
  };

  const content = (
    <div className="max-w-6xl mx-auto space-y-6 p-4 h-[calc(100vh-50px)] overflow-auto">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-2">
            <h1 className="text-3xl font-bold text-gray-900">{data.name}</h1>
            <div className="flex items-center gap-3 flex-wrap">
              <StatusBadge status={data.status} />
              <Badge variant="outline" className="text-sm">
                {data.type}
              </Badge>
              {data.isinCode && (
                <Badge variant="secondary" className="font-mono text-xs">
                  {data.isinCode}
                </Badge>
              )}
            </div>
          </div>

          {data.stockPrice?.price && (
            <div className="text-right">
              <div className="text-2xl font-bold text-blue-600">
                {formatCurrency(data.stockPrice.price)}
              </div>
              <div className="text-sm text-gray-500">Current Price</div>
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Essential Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Essential Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-0">
            {renderDetail("Issuer", getIssuerName(data.issuer))}
            {renderDetail("ISIN Code", data.isinCode)}
            {renderDetail("Code", data.code)}
            {renderDetail("Capital Operation", data.capitalOperation)}
            {renderDetail(
              "Market Listing",
              data.marketListing === "primary"
                ? "Primary Market"
                : "Secondary Market"
            )}
          </CardContent>
        </Card>

        {/* Financial Details */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Financial Details
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-0">
            {renderDetail("Face Value", formatCurrency(data.faceValue))}
            {renderDetail("Quantity", data.quantity?.toLocaleString())}
            {renderDetail("Voting Rights", data.votingRights ? "Yes" : "No")}
            {renderDetail("Dividend Rate", formatPercentage(data.dividendRate))}
            {data.durationYears &&
              renderDetail("Duration", `${data.durationYears} years`)}
          </CardContent>
        </Card>
      </div>



      {/* Dates Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Important Dates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="space-y-1">
              <div className="text-sm font-medium text-gray-600">
                Emission Date
              </div>
              <div className="text-sm text-gray-900">
                {formatDate(data.emissionDate)}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium text-gray-600">
                Closing Date
              </div>
              <div className="text-sm text-gray-900">
                {formatDate(data.closingDate)}
              </div>
            </div>
            <div className="space-y-1">
              <div className="text-sm font-medium text-gray-600">
                Enjoyment Date
              </div>
              <div className="text-sm text-gray-900">
                {formatDate(data.enjoymentDate)}
              </div>
            </div>
            {data.maturityDate && (
              <div className="space-y-1">
                <div className="text-sm font-medium text-gray-600">
                  Maturity Date
                </div>
                <div className="text-sm text-gray-900">
                  {formatDate(data.maturityDate)}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Order Response Section - Only for validation return pages */}
      {isValidationReturnPage && orderResponse && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Order Response
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-1">
                <div className="text-sm font-medium text-gray-600">
                  Remaining Quantity
                </div>
                <div className="text-sm text-gray-900">
                  {orderResponse.reliquat?.toLocaleString() || "N/A"}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium text-gray-600">
                  Acquired Quantity
                </div>
                <div className="text-sm text-gray-900">
                  {orderResponse.quantiteAcquise?.toLocaleString() || "N/A"}
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-sm font-medium text-gray-600">
                  Price
                </div>
                <div className="text-sm text-gray-900">
                  {formatCurrency(orderResponse.prix) || "N/A"}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Institutions */}
      {Array.isArray(data.institutions) && data.institutions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Associated Institutions
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {data.institutions.map((id) => {
                const inst = institutions.find((i) => i.id === id);
                return inst ? (
                  <Badge key={id} variant="outline" className="px-3 py-1">
                    {inst.name}
                  </Badge>
                ) : null;
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Payment Schedule */}
      {(data.paymentSchedule?.length ?? 0) > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Payment Schedule ({data.paymentSchedule?.length ?? 0} payments)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">
                      Payment Date
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">
                      Coupon Rate
                    </th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">
                      Capital Rate
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data.paymentSchedule?.map((payment, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4 text-sm">
                        {formatDate(payment.date)}
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-green-600">
                        {formatPercentage(payment.couponRate)}
                      </td>
                      <td className="py-3 px-4 text-sm font-medium text-blue-600">
                        {formatPercentage(payment.capitalRate)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  if (withBackdrop) {
    return (
      <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-60">
        <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative">
          {content}
        </div>
      </div>
    );
  }
  return content;
}
