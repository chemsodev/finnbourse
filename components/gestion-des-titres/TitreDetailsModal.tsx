"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Calendar, DollarSign, Building, Hash } from "lucide-react";
import { formatDate, formatPrice, formatNumber } from "@/lib/utils";
import { Stock } from "@/lib/services/stockService";
import { useTranslations } from "next-intl";
import { usePathname } from "next/navigation";
import { Link } from "@/i18n/routing";

interface TitreDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  stock: Stock | null;
  type: string;
}

export function TitreDetailsModal({
  isOpen,
  onClose,
  stock,
  type,
}: TitreDetailsModalProps) {
  const t = useTranslations("titresTable");
  const pathname = usePathname();

  if (!stock) return null;

  const stockData = stock as any;
  const issuer = stockData.issuer;
  const issuerName = typeof issuer === "object" ? issuer?.name : issuer;
  const stockPrices = stockData.stockPrices || [];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
      case "activated":
        return "text-green-600 bg-green-100";
      case "suspended":
        return "text-red-600 bg-red-100";
      case "moved_to_secondary":
        return "text-blue-600 bg-blue-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "active":
      case "activated":
        return t("actif");
      case "suspended":
        return t("suspendu");
      case "moved_to_secondary":
        return t("marche_secondaire");
      default:
        return status || "NC";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Building className="h-5 w-5" />
            {t("detailsTitre")}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* En-tête simple */}
          <div className="text-center pb-4 border-b">
            <h3 className="text-2xl font-bold text-primary mb-1">
              {stockData.code || "N/A"}
            </h3>
            <p className="text-gray-600">
              {issuerName || stockData.name || "N/A"}
            </p>
            <span
              className={`inline-block mt-2 px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                stockData.status
              )}`}
            >
              {getStatusText(stockData.status)}
            </span>
          </div>

          {/* Informations principales */}
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="type">{t("type")}</Label>
                <Input
                  id="type"
                  value={stockData.stockType || stockData.type || type}
                  readOnly
                  className="capitalize"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="market">{t("marche")}</Label>
                <Input
                  id="market"
                  value={stockData.isPrimary ? t("marchePrimaire") : t("marcheSecondaire")}
                  readOnly
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              {stockData.faceValue && (
                <div className="space-y-2">
                  <Label htmlFor="faceValue">{t("valeurNominale")}</Label>
                  <Input
                    id="faceValue"
                    value={`${formatPrice(stockData.faceValue)} ${t("currency")}`}
                    readOnly
                  />
                </div>
              )}

              {stockData.quantity && (
                <div className="space-y-2">
                  <Label htmlFor="quantity">{t("quantite")}</Label>
                  <Input
                    id="quantity"
                    value={formatNumber(stockData.quantity)}
                    readOnly
                  />
                </div>
              )}
            </div>

            <div className="grid grid-cols-2 gap-4">
              {stockData.isinCode && (
                <div className="space-y-2">
                  <Label htmlFor="isinCode">{t("codeIsin")}</Label>
                  <Input
                    id="isinCode"
                    value={stockData.isinCode}
                    readOnly
                  />
                </div>
              )}

              {stockData.dividendRate !== null && stockData.dividendRate !== undefined && (
                <div className="space-y-2">
                  <Label htmlFor="dividendRate">{t("tauxDividende")}</Label>
                  <Input
                    id="dividendRate"
                    value={`${stockData.dividendRate}%`}
                    readOnly
                  />
                </div>
              )}
            </div>

            {stockData.yieldRate && (
              <div className="space-y-2">
                <Label htmlFor="yieldRate">{t("rendement")}</Label>
                <Input
                  id="yieldRate"
                  value={`${stockData.yieldRate}%`}
                  readOnly
                />
              </div>
            )}
          </div>

          {/* Prix actuels */}
          {stockPrices.length > 0 && (
            <div className="pt-4 border-t">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="openingPrice">{t("prixOuverture")}</Label>
                  <Input
                    id="openingPrice"
                    value={formatPrice(stockPrices[0]?.price || 0)}
                    readOnly
                    className="text-green-600 font-semibold"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="currentPrice">{t("prixActuel")}</Label>
                  <Input
                    id="currentPrice"
                    value={formatPrice(stockPrices[stockPrices.length - 1]?.price || 0)}
                    readOnly
                    className="text-blue-600 font-semibold"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Dates */}
          {(stockData.emissionDate || stockData.closingDate) && (
            <div className="pt-4 border-t">
              <div className="grid grid-cols-2 gap-4">
                {stockData.emissionDate && (
                  <div className="space-y-2">
                    <Label htmlFor="emissionDate">{t("dateEmission")}</Label>
                    <Input
                      id="emissionDate"
                      value={formatDate(stockData.emissionDate)}
                      readOnly
                    />
                  </div>
                )}
                {stockData.closingDate && (
                  <div className="space-y-2">
                    <Label htmlFor="closingDate">{t("dateCloture")}</Label>
                    <Input
                      id="closingDate"
                      value={formatDate(stockData.closingDate)}
                      readOnly
                    />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-4 border-t">
            <Button
              onClick={onClose}
              variant="outline"
              className="flex-1"
            >
              {t("fermer")}
            </Button>
            <Link href={`${pathname}/${stockData.id}`} className="flex-1">
              <Button className="w-full">
                {t("passerOrdre")}
              </Button>
            </Link>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 