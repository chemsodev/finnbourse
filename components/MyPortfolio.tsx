"use client";

import React from "react";
import StockCard from "./dashboard/StockCard";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet } from "lucide-react";

// Mock data for stocks
const mockStocks = [
  {
    id: "1",
    issuer: "TOTAL",
    code: "TOTAL",
    name: "Total Energies",
    facevalue: 52.30,
    marketmetadata: {
      cours: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString(),
        price: 52.30 + (Math.random() - 0.5) * 5
      }))
    }
  },
  {
    id: "2",
    issuer: "BNP Paribas",
    code: "BNP",
    name: "BNP Paribas",
    facevalue: 45.80,
    marketmetadata: {
      cours: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString(),
        price: 45.80 + (Math.random() - 0.5) * 3
      }))
    }
  },
  {
    id: "3",
    issuer: "Orange",
    code: "ORA",
    name: "Orange SA",
    facevalue: 12.50,
    marketmetadata: {
      cours: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString(),
        price: 12.50 + (Math.random() - 0.5) * 2
      }))
    }
  },
  {
    id: "4",
    issuer: "LVMH",
    code: "MC",
    name: "LVMH Moët Hennessy",
    facevalue: 850.00,
    marketmetadata: {
      cours: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString(),
        price: 850.00 + (Math.random() - 0.5) * 50
      }))
    }
  }
];

const MyPortfolio = () => {
  const t = useTranslations("HomePage");
  
  const data = { listStocks: mockStocks.slice(0, 4) };

  const stocksWithVariation = data?.listStocks?.map((stock: any) => {
    const marketMetadata = stock.marketmetadata;
    let variation = "0.00%";
    if (
      typeof marketMetadata === "object" &&
      marketMetadata !== null &&
      Array.isArray(marketMetadata.cours) &&
      marketMetadata.cours.length >= 2
    ) {
      // Calculate variation based on first and last price
      const firstPrice = marketMetadata.cours[0].price;
      const lastPrice = marketMetadata.cours[marketMetadata.cours.length - 1].price;
      const change = ((lastPrice - firstPrice) / firstPrice) * 100;
      variation = `${change > 0 ? "+" : ""}${change.toFixed(2)}%`;
    } else {
      // Generate random variation for demo purposes
      const randomVariation = (Math.random() - 0.5) * 10;
      variation = `${randomVariation > 0 ? "+" : ""}${randomVariation.toFixed(2)}%`;
    }
    return { ...stock, variation };
  });

  return (
    <Card className="w-full h-full border border-gray-200 bg-white">
      <CardHeader className="pb-4 border-b border-gray-100">
        <CardTitle className="flex items-center gap-3 text-xl font-semibold text-gray-900">
          <div className="p-2 bg-gray-100 rounded-lg">
            <Wallet className="w-5 h-5 text-gray-600" />
          </div>
          {t("portefeuille")}
          <Badge variant="secondary" className="ml-auto text-xs bg-gray-100 text-gray-600 border-gray-200">
            Portfolio
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
          {stocksWithVariation?.map((stock) => (
            <StockCard key={stock.id} stock={stock} variation={stock.variation} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default MyPortfolio;
