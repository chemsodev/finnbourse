/**
 * StaticOrdresTable.tsx
 * -----------------------
 * Static version of OrdresTable that uses mock data instead of GraphQL
 */

"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { mockOrders } from "@/lib/staticData";

interface StaticOrdresTableProps {
  pageType?: string;
  maxRows?: number;
}

export default function StaticOrdresTable({
  pageType = "dashboard",
  maxRows = 5,
}: StaticOrdresTableProps) {
  const t = useTranslations("ordres");
  const [orders] = useState(mockOrders.slice(0, maxRows));
  const getStatusBadge = (status: number) => {
    const statusMap = {
      0: { label: t("draft"), variant: "secondary" as const },
      1: { label: t("pending"), variant: "outline" as const },
      2: { label: t("inProgress"), variant: "default" as const },
      3: { label: t("validated"), variant: "default" as const },
      8: { label: t("partiallyValidated"), variant: "default" as const },
      9: { label: t("expired"), variant: "destructive" as const },
      10: { label: t("rejected"), variant: "destructive" as const },
      11: { label: t("cancelled"), variant: "secondary" as const },
    };

    const statusInfo =
      statusMap[status as keyof typeof statusMap] || statusMap[1];

    return <Badge variant={statusInfo.variant}>{statusInfo.label}</Badge>;
  };

  const getDirectionBadge = (direction: number) => {
    return (
      <Badge variant={direction === 1 ? "default" : "secondary"}>
        {direction === 1 ? t("buy") : t("sell")}
      </Badge>
    );
  };

  const formatPrice = (price: number | null) => {
    if (price === null) return "-";
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: "MAD",
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("fr-FR", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-primary">
          {pageType === "dashboard" ? t("recentOrders") : t("orders")}
        </h3>
        {pageType === "dashboard" && (
          <Button variant="outline" size="sm">
            {t("viewAll")}
          </Button>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">{t("id")}</TableHead>
              <TableHead>{t("security")}</TableHead>
              <TableHead>{t("direction")}</TableHead>
              <TableHead className="text-right">{t("quantity")}</TableHead>
              <TableHead className="text-right">{t("priceLimit")}</TableHead>
              <TableHead>{t("status")}</TableHead>
              <TableHead className="text-right">{t("orderDate")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="h-24 text-center">
                  {t("noOrders")}
                </TableCell>
              </TableRow>
            ) : (
              orders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-mono text-xs">
                    {order.id.slice(-6).toUpperCase()}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{order.securityissuer}</div>
                      <div className="text-xs text-muted-foreground">
                        {order.securitytype}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getDirectionBadge(order.orderdirection)}
                  </TableCell>
                  <TableCell className="text-right">
                    {order.quantity.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="text-xs">
                      <div>Min: {formatPrice(order.pricelimitmin)}</div>
                      <div>Max: {formatPrice(order.pricelimitmax)}</div>
                    </div>
                  </TableCell>
                  <TableCell>{getStatusBadge(order.orderstatus)}</TableCell>
                  <TableCell className="text-right text-xs">
                    {formatDate(order.orderdate)}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {pageType === "dashboard" && orders.length > 0 && (
        <div className="text-center text-sm text-muted-foreground">
          {t("showingRecent", { count: orders.length })}
        </div>
      )}
    </div>
  );
}
