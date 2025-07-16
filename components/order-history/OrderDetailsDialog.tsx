"use client";
import { useTranslations } from "next-intl";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Clock,
  ArrowRight,
  CheckCircle,
  XCircle,
  AlertCircle,
  DollarSign,
  Package,
  User,
  ArrowLeftRight,
  Building2,
  TrendingUp,
  MapPin,
  Calendar,
  FileText,
  Shield,
} from "lucide-react";
import { JournalOrder } from "@/types/orders";
import { OrderDetailsReponse } from "./OrderDetailsReponse";
import { OrderTrack } from "./OrderTrack";

interface OrderDetailsDialogProps {
  order: JournalOrder | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrderDetailsDialog({
  order,
  open,
  onOpenChange,
}: OrderDetailsDialogProps) {
  const t = useTranslations("orderHistory.orderDetails");

  if (!order) return null;

  // Enhanced status badge with journal-specific statuses
  const StatusBadge = ({ status }: { status: string }) => {
    const statusConfig = {
      "premiere-validation": {
        color: "bg-blue-100 text-blue-800",
        label: t("status.premiereValidation"),
        icon: <FileText className="h-4 w-4 mr-1" />,
      },
      "validation-finale": {
        color: "bg-green-100 text-green-800",
        label: t("status.validationFinale"),
        icon: <CheckCircle className="h-4 w-4 mr-1" />,
      },
      "validation-retour-premiere": {
        color: "bg-amber-100 text-amber-800",
        label: t("status.validationRetourPremiere"),
        icon: <AlertCircle className="h-4 w-4 mr-1" />,
      },
      "validation-retour-finale": {
        color: "bg-yellow-100 text-yellow-800",
        label: t("status.validationRetourFinale"),
        icon: <AlertCircle className="h-4 w-4 mr-1" />,
      },
      "validation-tcc-premiere": {
        color: "bg-cyan-100 text-cyan-800",
        label: t("status.validationTccPremiere"),
        icon: <AlertCircle className="h-4 w-4 mr-1" />,
      },
      "validation-tcc-finale": {
        color: "bg-pink-100 text-pink-800",
        label: t("status.validationTccFinale"),
        icon: <AlertCircle className="h-4 w-4 mr-1" />,
      },
      "validation-tcc-retour-premiere": {
        color: "bg-purple-100 text-purple-800",
        label: t("status.validationTccRetourPremiere"),
        icon: <AlertCircle className="h-4 w-4 mr-1" />,
      },
      "validation-tcc-retour-finale": {
        color: "bg-yellow-100 text-yellow-800",
        label: t("status.validationTccRetourFinale"),
        icon: <AlertCircle className="h-4 w-4 mr-1" />,
      },
      execution: {
        color: "bg-orange-100 text-orange-800",
        label: t("status.execution"),
        icon: <ArrowRight className="h-4 w-4 mr-1" />,
      },
      resultats: {
        color: "bg-gray-100 text-gray-800",
        label: t("status.resultats"),
        icon: <CheckCircle className="h-4 w-4 mr-1" />,
      },
      "final-state": {
        color: "bg-red-100 text-red-800",
        label: t("status.finalState"),
        icon: <CheckCircle className="h-4 w-4 mr-1" />,
      },
      rejected: {
        color: "bg-red-100 text-red-800",
        label: t("status.rejected"),
        icon: <XCircle className="h-4 w-4 mr-1" />,
      },
      canceled: {
        color: "bg-gray-100 text-gray-800",
        label: t("status.canceled"),
        icon: <AlertCircle className="h-4 w-4 mr-1" />,
      },
    };

    const config = statusConfig[status as keyof typeof statusConfig] || {
      color: "bg-gray-100 text-gray-800",
      label: status,
      icon: <Clock className="h-4 w-4 mr-1" />,
    };

    return (
      <Badge className={`${config.color} flex items-center`}>
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  // Enhanced detail renderer with optional tooltip
  const renderDetail = (
    label: string,
    value: React.ReactNode,
    icon?: React.ReactNode,
    tooltip?: string
  ) => (
    <div className="flex items-start justify-between py-3 border-b border-gray-100 last:border-b-0">
      <div className="flex items-center gap-2 text-sm font-medium text-gray-600 min-w-0 flex-1">
        {icon && <span className="text-gray-400">{icon}</span>}
        <span className="truncate" title={tooltip}>
          {label}
        </span>
      </div>
      <div
        className="text-sm text-gray-900 font-medium ml-4 text-right"
        title={typeof value === "string" ? value : undefined}
      >
        {value || <span className="text-gray-400 italic">Not specified</span>}
      </div>
    </div>
  );

  // Format date from API
  const formatDate = (dateString: string | null) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString();
  };

  // Operation type translation
  const getOperationType = (type: string) => {
    return type === "A" ? t("buy") : t("sell");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto p-8">
        {/* Header Section */}
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <ArrowLeftRight className="h-5 w-5 text-primary" />
              {t("orderDetails")} #{order.id}
            </DialogTitle>
            <StatusBadge status={order.status} />
          </div>
        </DialogHeader>

        <div className="space-y-4">
          {/* Basic Information Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Package className="h-4 w-4" />
                {t("basicInformation")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-0">
              {renderDetail(
                t("stock"),
                `${order.stock_code} - ${order.stock_issuer_nom}`,
                <Package className="h-4 w-4" />
              )}
              {renderDetail(
                t("client"),
                order.client_nom,
                <User className="h-4 w-4" />
              )}
              {renderDetail(
                t("marketType"),
                order.market_type === "P"
                  ? t("primaryMarket")
                  : t("secondaryMarket"),
                <Building2 className="h-4 w-4" />
              )}
              {renderDetail(
                t("operationType"),
                getOperationType(order.operation_type),
                <ArrowLeftRight className="h-4 w-4" />
              )}
              {renderDetail(
                t("createdBy"),
                order.created_by,
                <User className="h-4 w-4" />
              )}
            </CardContent>
          </Card>

          {/* Financial Details Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                {t("financialDetails")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-0">
              {renderDetail(
                t("quantity"),
                order.quantity.toLocaleString(),
                <TrendingUp className="h-4 w-4" />
              )}
              {renderDetail(
                t("price"),
                `${order.price.toLocaleString()} DA`,
                <DollarSign className="h-4 w-4" />
              )}
              {renderDetail(
                t("totalAmount"),
                `${(order.quantity * order.price).toLocaleString()} DA`,
                <DollarSign className="h-4 w-4" />
              )}
              {renderDetail(
                t("minQuantity"),
                order.minQuantity.toLocaleString(),
                <Shield className="h-4 w-4" />
              )}
            </CardContent>
          </Card>

          {/* Conditions Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Clock className="h-4 w-4" />
                {t("conditions")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-0">
              {renderDetail(
                t("timeCondition"),
                order.time_condition || "-",
                <Clock className="h-4 w-4" />
              )}
              {renderDetail(
                t("priceCondition"),
                order.price_condition || "-",
                <DollarSign className="h-4 w-4" />
              )}
              {renderDetail(
                t("executionType"),
                order.quantitative_condition || "-",
                <ArrowRight className="h-4 w-4" />
              )}
              {renderDetail(
                t("validity"),
                formatDate(order.validity),
                <Calendar className="h-4 w-4" />
              )}
            </CardContent>
          </Card>

          {/* Subscriber Information Card */}
          {order.souscripteur && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="h-4 w-4" />
                  {t("subscriberInfo")}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-0">
                {renderDetail(
                  t("subscriberName"),
                  order.souscripteur.nom_prenom,
                  <User className="h-4 w-4" />
                )}
                {renderDetail(
                  t("subscriberQuality"),
                  order.souscripteur.qualite_souscripteur,
                  <Shield className="h-4 w-4" />
                )}
                {renderDetail(
                  t("subscriberAddress"),
                  `${order.souscripteur.adresse}, ${order.souscripteur.wilaya}`,
                  <MapPin className="h-4 w-4" />
                )}
                {renderDetail(
                  t("subscriberBirthDate"),
                  formatDate(order.souscripteur.date_naissance),
                  <Calendar className="h-4 w-4" />
                )}
                {renderDetail(
                  t("subscriberID"),
                  order.souscripteur.num_cni_pc,
                  <FileText className="h-4 w-4" />
                )}
                {renderDetail(
                  t("subscriberNationality"),
                  order.souscripteur.nationalite,
                  <MapPin className="h-4 w-4" />
                )}
              </CardContent>
            </Card>
          )}

          <OrderDetailsReponse
            order={order as any}
            open={open}
            onOpenChange={onOpenChange}
          />
          <OrderTrack
            order={order as any}
            open={open}
            onOpenChange={onOpenChange}
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
