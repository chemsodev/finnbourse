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

interface OrderDetailsReponseProps {
  order: OrderElement | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  stocksMap: Record<string, { code: string; name: string }>;
  clientsMap: Record<string, { name: string }>;
}

export function OrderDetailsReponse({
  order,
  open,
  onOpenChange,
  stocksMap,
  clientsMap,
}: OrderDetailsReponseProps) {
  const t = useTranslations("orderHistory.orderDetails");

  if (!order) return null;

  // Simple detail renderer conservé
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

  return (
    <div>
      {/* Response Card */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <CheckCircle className="h-4 w-4" />
            {t("response")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-0">
          {renderDetail(
            t("quantity"),
            order.quantity?.toLocaleString(),
            <TrendingUp className="h-4 w-4" />
          )}
          {renderDetail(
            t("price"),
            `${order.price?.toLocaleString()} DA`,
            <DollarSign className="h-4 w-4" />
          )}
          {renderDetail(
            t("reliquat"),
            (order as any).reliquat ?? "-",
            <AlertCircle className="h-4 w-4" />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
