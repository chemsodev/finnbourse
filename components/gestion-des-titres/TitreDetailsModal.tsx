"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
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
          <Button
            variant="ghost"
            size="sm"
            className="absolute right-4 top-4"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>

        <div className="space-y-6">
          {/* En-tête avec code et nom */}
          <div className="bg-gradient-to-r from-primary/10 to-secondary/10 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-primary">
                  {stockData.code || "N/A"}
                </h3>
                <p className="text-lg text-gray-700">
                  {issuerName || stockData.name || "N/A"}
                </p>
              </div>
              <div className="text-right">
                <span
                  className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    stockData.status
                  )}`}
                >
                  {getStatusText(stockData.status)}
                </span>
              </div>
            </div>
          </div>

          {/* Informations générales */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">{t("id")}:</span>
                <span className="font-medium">{stockData.id}</span>
              </div>
              
              <div className="flex items-center gap-2">
                <Building className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-600">{t("emetteur")}:</span>
                <span className="font-medium">{issuerName || "N/A"}</span>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-600">{t("type")}:</span>
                <span className="font-medium capitalize">
                  {stockData.type || type}
                </span>
              </div>
            </div>

            <div className="space-y-3">
              {stockData.isinCode && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{t("codeIsin")}:</span>
                  <span className="font-medium">{stockData.isinCode}</span>
                </div>
              )}

              {stockData.facevalue && (
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <span className="text-sm text-gray-600">{t("valeurNominale")}:</span>
                  <span className="font-medium">
                    {formatPrice(stockData.facevalue)} {t("currency")}
                  </span>
                </div>
              )}

              {stockData.quantity && (
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">{t("quantiteDisponible")}:</span>
                  <span className="font-medium">
                    {formatNumber(stockData.quantity)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Dates */}
          {(stockData.emissionDate || stockData.closingDate) && (
            <div className="space-y-3">
              <h4 className="font-semibold text-lg flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                {t("dates")}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {stockData.emissionDate && (
                  <div>
                    <span className="text-sm text-gray-600">{t("dateEmission")}:</span>
                    <div className="font-medium">
                      {formatDate(stockData.emissionDate)}
                    </div>
                  </div>
                )}
                {stockData.closingDate && (
                  <div>
                    <span className="text-sm text-gray-600">{t("dateCloture")}:</span>
                    <div className="font-medium">
                      {formatDate(stockData.closingDate)}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Prix */}
          {stockPrices.length > 0 && (
            <div className="space-y-3">
              <h4 className="font-semibold text-lg flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                {t("prix")}
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm text-gray-600">{t("prixOuverture")}:</span>
                  <div className="font-medium text-lg">
                    {formatPrice(stockPrices[0]?.price || 0)} {t("currency")}
                  </div>
                </div>
                <div>
                  <span className="text-sm text-gray-600">{t("prixActuel")}:</span>
                  <div className="font-medium text-lg">
                    {formatPrice(
                      stockPrices[stockPrices.length - 1]?.price || 0
                    )}{" "}
                    {t("currency")}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Informations supplémentaires */}
          {stockData.description && (
            <div className="space-y-2">
              <h4 className="font-semibold text-lg">{t("description")}</h4>
              <p className="text-gray-700 bg-gray-50 p-3 rounded-lg">
                {stockData.description}
              </p>
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