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
} from "lucide-react";
import { OrderElement } from "@/lib/services/orderService";
import { OrderDetailsReponse } from "./OrderDetailsReponse";
import { OrderTrack } from "./OrderTrack";

interface OrderDetailsDialogProps {
  order: OrderElement | null;
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

  // Status badge component
  const StatusBadge = ({ status }: { status: string }) => {
    const statusConfig = {
      validated: {
        color: "bg-green-100 text-green-800",
        label: t("status.validated"),
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
      pending: {
        color: "bg-yellow-100 text-yellow-800",
        label: t("status.pending"),
        icon: <Clock className="h-4 w-4 mr-1" />,
      },
    };

    const config =
      statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;

    return (
      <Badge className={`${config.color} flex items-center`}>
        {config.icon}
        {config.label}
      </Badge>
    );
  };

  // Enhanced detail renderer
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

  // Get stock name
  // const getStockName = (stockId: string) => {
  //   const stock = stocksMap[stockId];
  //   return stock ? `${stock.code} - ${stock.name}` : stockId;
  // };

  // // Get client name
  // const getClientName = (clientId: string) => {
  //   return clientsMap[clientId]?.name || clientId;
  // };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl max-h-[90vh] overflow-y-auto p-8 ">
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
                // getStockName(order.stock_id),
                <Package className="h-4 w-4" />
              )}
              {renderDetail(
                t("client"),
                // getClientName(order.client_id),
                <User className="h-4 w-4" />
              )}
              {renderDetail(
                t("marketType"),
                order.market_type === "P"
                  ? t("primaryMarket")
                  : t("secondaryMarket"),
                <Building2 className="h-4 w-4" />
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
                order.time_condition,
                <Clock className="h-4 w-4" />
              )}
              {renderDetail(
                t("executionType"),
                order.quantitative_condition,
                <ArrowRight className="h-4 w-4" />
              )}
            </CardContent>
          </Card>

          <OrderDetailsReponse
            order={order}
            open={open}
            onOpenChange={onOpenChange}
          />

          <OrderTrack order={order} open={open} onOpenChange={onOpenChange} />
        </div>

        {/* <div className="flex justify-end pt-4">
          <Button onClick={() => onOpenChange(false)}>{t("close")}</Button>
        </div> */}
      </DialogContent>
    </Dialog>
  );
}
