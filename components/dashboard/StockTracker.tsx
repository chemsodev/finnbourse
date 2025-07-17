"use client";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useLocale, useTranslations } from "next-intl";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { fr, ar, enUS } from "date-fns/locale";
import {
  formatChartDate,
  formatTooltipDate,
  createAxisTickFormatter,
  formatChartValue,
  normalizeChartData,
} from "@/lib/chart-utils";

// Static mock data for stocks
const mockStockData = [
  { date: "2024-01-01", stockOne: 100, stockTwo: 150 },
  { date: "2024-01-02", stockOne: 105, stockTwo: 155 },
  { date: "2024-01-03", stockOne: 102, stockTwo: 148 },
  { date: "2024-01-04", stockOne: 108, stockTwo: 162 },
  { date: "2024-01-05", stockOne: 112, stockTwo: 158 },
  { date: "2024-01-06", stockOne: 115, stockTwo: 165 },
  { date: "2024-01-07", stockOne: 110, stockTwo: 160 },
];

const mockStocks = [
  { id: "1", name: "AlphaStock Corp", symbol: "ALPH", currentPrice: 115 },
  { id: "2", name: "BetaFinance Ltd", symbol: "BETA", currentPrice: 160 },
  { id: "3", name: "GammaInvest SA", symbol: "GAMA", currentPrice: 85 },
  { id: "4", name: "DeltaTech Inc", symbol: "DELT", currentPrice: 95 },
];

const chartConfig: ChartConfig = {
  stockOne: {
    label: "Stock One",
    color: "hsl(var(--chart-1))",
  },
  stockTwo: {
    label: "Stock Two",
    color: "hsl(var(--chart-2))",
  },
};

export function StockTracker() {
  const t = useTranslations("DashLineChart");
  const locale = useLocale();
  const [activeTab, setActiveTab] = useState("graphe");
  const [selectedStockOne, setSelectedStockOne] = useState("1");
  const [selectedStockTwo, setSelectedStockTwo] = useState("2");
  const [compareMode, setCompareMode] = useState(true);

  const getDateLocale = () => {
    switch (locale) {
      case "ar":
        return ar;
      case "fr":
        return fr;
      default:
        return enUS;
    }
  };

  return (
    <div className="w-full">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="graphe">{t("graphe")}</TabsTrigger>
          <TabsTrigger value="table">{t("table")}</TabsTrigger>
        </TabsList>

        <TabsContent value="graphe" className="space-y-4">
          <div className="flex gap-4 items-center">
            <Select
              value={selectedStockOne}
              onValueChange={setSelectedStockOne}
            >
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Select first stock" />
              </SelectTrigger>
              <SelectContent>
                {mockStocks.map((stock) => (
                  <SelectItem key={stock.id} value={stock.id}>
                    {stock.name} ({stock.symbol})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {compareMode && (
              <Select
                value={selectedStockTwo}
                onValueChange={setSelectedStockTwo}
              >
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select second stock" />
                </SelectTrigger>
                <SelectContent>
                  {mockStocks.map((stock) => (
                    <SelectItem key={stock.id} value={stock.id}>
                      {stock.name} ({stock.symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            )}
          </div>

          <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
            <AreaChart data={mockStockData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis
                dataKey="date"
                tickFormatter={createAxisTickFormatter("short", locale as "fr" | "ar" | "en")}
              />
              <YAxis
                tickFormatter={(value) =>
                  formatChartValue(value, "currency", locale as "fr" | "ar" | "en")
                }
              />
              <ChartTooltip
                content={<ChartTooltipContent />}
                labelFormatter={(value) => formatTooltipDate(value, locale as "fr" | "ar" | "en")}
              />
              <ChartLegend content={<ChartLegendContent />} />
              <Area
                type="linear"
                dataKey="stockOne"
                stroke="var(--color-stockOne)"
                fill="var(--color-stockOne)"
                fillOpacity={0.3}
              />
              {compareMode && (
                <Area
                  type="linear"
                  dataKey="stockTwo"
                  stroke="var(--color-stockTwo)"
                  fill="var(--color-stockTwo)"
                  fillOpacity={0.3}
                />
              )}
            </AreaChart>
          </ChartContainer>
        </TabsContent>

        <TabsContent value="table" className="space-y-4">
          <div className="rounded-md border">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-4">Date</th>
                  <th className="text-left p-4">Stock One</th>
                  {compareMode && <th className="text-left p-4">Stock Two</th>}
                </tr>
              </thead>
              <tbody>
                {mockStockData.map((row, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-4">
                      {formatChartDate(row.date, "medium", locale as "fr" | "ar" | "en")}
                    </td>
                    <td className="p-4">{formatChartValue(row.stockOne, "currency", locale as "fr" | "ar" | "en")}</td>
                    {compareMode && <td className="p-4">{formatChartValue(row.stockTwo, "currency", locale as "fr" | "ar" | "en")}</td>}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
