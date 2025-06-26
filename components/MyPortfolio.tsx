"use client";

import React from "react";
import StockCard from "./dashboard/StockCard";
import { mockStocks } from "@/lib/staticData";
import { calculateVariation } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Wallet } from "lucide-react";

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
      variation = calculateVariation(marketMetadata.cours);
    } else {
      // Generate random variation for demo purposes
      const randomVariation = (Math.random() - 0.5) * 10;
      variation = `${randomVariation > 0 ? "+" : ""}${randomVariation.toFixed(
        2
      )}%`;
    }
    return { ...stock, variation };
  });

  return (
    <Card className="w-full h-full bg-gradient-to-br from-white to-slate-100 shadow-lg rounded-2xl">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-2xl font-bold">
          <span className="flex items-center gap-2">
            <Wallet className="w-6 h-6 text-primary" />
            {t("portefeuille")}
          </span>
          <Badge variant="outline">Portfolio</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1">
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
