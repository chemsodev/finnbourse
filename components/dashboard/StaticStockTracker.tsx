/**
 * StaticStockTracker.tsx
 * -----------------------
 * Static version of StockTracker that uses mock data instead of GraphQL
 */

"use client";

import { useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { mockStocks } from "@/lib/staticData";

interface StockData {
  date: string;
  price: number;
}

export function StaticStockTracker() {
  const t = useTranslations("DashLineChart");
  const locale = useLocale();
  const [activeTab, setActiveTab] = useState("graphe");

  // Use static mock data
  const stockOne = mockStocks[0];
  const stockTwo = mockStocks[1] || mockStocks[0];

  // Generate mock historical data
  const generateMockData = (
    basePrice: number,
    days: number = 30
  ): StockData[] => {
    const data: StockData[] = [];
    let currentPrice = basePrice;

    for (let i = days; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);

      // Add some realistic price variation
      const variation = (Math.random() - 0.5) * 0.1; // ±10% max variation
      currentPrice = currentPrice * (1 + variation);

      data.push({
        date: date.toISOString(),
        price: parseFloat(currentPrice.toFixed(2)),
      });
    }
    return data;
  };

  const stockOneData = generateMockData(stockOne.facevalue);
  const stockTwoData = generateMockData(stockTwo.facevalue);

  const calculateChange = (data: StockData[]) => {
    if (data.length < 2) return { change: 0, percentage: 0 };

    const latest = data[data.length - 1].price;
    const previous = data[data.length - 2].price;
    const change = latest - previous;
    const percentage = (change / previous) * 100;

    return { change, percentage };
  };

  const stockOneChange = calculateChange(stockOneData);
  const stockTwoChange = calculateChange(stockTwoData);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat(locale, {
      style: "currency",
      currency: "MAD",
    }).format(price);
  };

  const formatChange = (change: number, percentage: number) => {
    const icon =
      percentage > 0 ? (
        <TrendingUp className="w-4 h-4" />
      ) : percentage < 0 ? (
        <TrendingDown className="w-4 h-4" />
      ) : (
        <Minus className="w-4 h-4" />
      );

    const variant =
      percentage > 0 ? "default" : percentage < 0 ? "destructive" : "secondary";

    return (
      <Badge variant={variant} className="flex items-center gap-1">
        {icon}
        {percentage > 0 ? "+" : ""}
        {percentage.toFixed(2)}%
      </Badge>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>{t("stockTracker") || "Stock Tracker"}</span>
          <Badge variant="outline">{t("liveData") || "Static Data"}</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="graphe">{t("chart") || "Chart"}</TabsTrigger>
            <TabsTrigger value="tableau">{t("table") || "Table"}</TabsTrigger>
          </TabsList>

          <TabsContent value="graphe" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Stock One Card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stockOne.issuer}
                  </CardTitle>
                  <div className="text-xs text-muted-foreground">
                    {stockOne.code} • {stockOne.name}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold">
                      {formatPrice(
                        stockOneData[stockOneData.length - 1]?.price ||
                          stockOne.facevalue
                      )}
                    </div>
                    {formatChange(
                      stockOneChange.change,
                      stockOneChange.percentage
                    )}
                    <div className="text-xs text-muted-foreground">
                      {t("lastUpdate") || "Last updated"}:{" "}
                      {new Date().toLocaleTimeString(locale)}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Stock Two Card */}
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stockTwo.issuer}
                  </CardTitle>
                  <div className="text-xs text-muted-foreground">
                    {stockTwo.code} • {stockTwo.name}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="text-2xl font-bold">
                      {formatPrice(
                        stockTwoData[stockTwoData.length - 1]?.price ||
                          stockTwo.facevalue
                      )}
                    </div>
                    {formatChange(
                      stockTwoChange.change,
                      stockTwoChange.percentage
                    )}
                    <div className="text-xs text-muted-foreground">
                      {t("lastUpdate") || "Last updated"}:{" "}
                      {new Date().toLocaleTimeString(locale)}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Chart Placeholder */}
            <Card>
              <CardContent className="p-6">
                <div className="h-64 flex items-center justify-center bg-muted rounded-lg">
                  <div className="text-center space-y-2">
                    <TrendingUp className="w-12 h-12 mx-auto text-muted-foreground" />
                    <div className="text-sm text-muted-foreground">
                      {t("chartPlaceholder") ||
                        "Interactive chart will be displayed here"}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {t("chartNote") ||
                        "Chart functionality moved to static display"}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="tableau" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-sm">
                  {t("priceHistory") || "Price History"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {stockOneData
                    .slice(-10)
                    .reverse()
                    .map((data, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center p-2 border-b last:border-b-0"
                      >
                        <div className="text-sm">
                          {new Date(data.date).toLocaleDateString(locale)}
                        </div>
                        <div className="text-sm font-medium">
                          {formatPrice(data.price)}
                        </div>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
