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
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState, useMemo } from "react";
import { TrendingUp, TrendingDown, BarChart3, Repeat } from "lucide-react";
import {
  formatChartDate,
  formatTooltipDate,
  createAxisTickFormatter,
  formatChartValue,
  normalizeChartData,
  type SupportedLocale,
} from "@/lib/chart-utils";
import {
  Stock,
  transformStockToChartData,
  calculateStockPerformance,
  type StockPrice,
} from "@/lib/stock-utils";

interface StockTrackerProps {
  stocks: Stock[];
  initialStockOne?: string;
  initialStockTwo?: string;
  showCompareToggle?: boolean;
}

// Chart data type definition
interface ChartDataPoint {
  date: string;
  stockOne: number;
  stockTwo: number | null;
  stockOneName: string;
  stockTwoName: string | null;
  stockOneCode: string;
  stockTwoCode: string | null;
}

export function StockTracker({
  stocks,
  initialStockOne,
  initialStockTwo,
  showCompareToggle = true,
}: StockTrackerProps) {
  const t = useTranslations("DashLineChart");
  const locale = useLocale() as SupportedLocale;
  const [activeTab, setActiveTab] = useState("graphe");
  const [selectedStockOne, setSelectedStockOne] = useState(
    initialStockOne || stocks[0]?.id || ""
  );
  const [selectedStockTwo, setSelectedStockTwo] = useState(
    initialStockTwo || stocks[1]?.id || ""
  );
  const [compareMode, setCompareMode] = useState(true);

  // Get selected stocks
  const stockOne = stocks.find((s) => s.id === selectedStockOne);
  const stockTwo = stocks.find((s) => s.id === selectedStockTwo);

  // Transform stock data for comparison
  const chartData = useMemo((): ChartDataPoint[] => {
    if (!stockOne) return [];

    const stockOneData = transformStockToChartData(stockOne);

    if (!compareMode || !stockTwo) {
      return stockOneData.map((point) => ({
        date: point.date,
        stockOne: point.price,
        stockTwo: null as number | null,
        stockOneName: stockOne.issuer.name,
        stockTwoName: null as string | null,
        stockOneCode: stockOne.code,
        stockTwoCode: null as string | null,
      }));
    }

    const stockTwoData = transformStockToChartData(stockTwo);

    // Merge data by date
    const mergedData = stockOneData.map((point) => {
      const stockTwoPoint = stockTwoData.find((p) => p.date === point.date);
      return {
        date: point.date,
        stockOne: point.price,
        stockTwo: stockTwoPoint ? stockTwoPoint.price : null,
        stockOneName: stockOne.issuer.name,
        stockTwoName: stockTwo.issuer.name,
        stockOneCode: stockOne.code,
        stockTwoCode: stockTwo.code,
      };
    });

    return mergedData;
  }, [stockOne, stockTwo, compareMode]);

  // Calculate performance metrics
  const performanceOne = useMemo(() => {
    return stockOne ? calculateStockPerformance(stockOne) : null;
  }, [stockOne]);

  const performanceTwo = useMemo(() => {
    return stockTwo ? calculateStockPerformance(stockTwo) : null;
  }, [stockTwo]);

  // Dynamic chart configuration
  const chartConfig: ChartConfig = useMemo(() => {
    const config: ChartConfig = {
      stockOne: {
        label: stockOne?.issuer.name || "Stock One",
        color: "hsl(var(--chart-1))",
      },
    };

    if (compareMode && stockTwo) {
      config.stockTwo = {
        label: stockTwo.issuer.name,
        color: "hsl(var(--chart-2))",
      };
    }

    return config;
  }, [stockOne, stockTwo, compareMode]);

  // Performance badge component
  const PerformanceBadge = ({
    performance,
  }: {
    performance: typeof performanceOne;
  }) => {
    if (!performance) return null;

    const isPositive = performance.changePercent >= 0;
    return (
      <Badge
        variant={isPositive ? "default" : "destructive"}
        className="flex items-center gap-1"
      >
        {isPositive ? (
          <TrendingUp className="h-3 w-3" />
        ) : (
          <TrendingDown className="h-3 w-3" />
        )}
        {performance.changePercent.toFixed(2)}%
      </Badge>
    );
  };

  // Stock info card
  const StockInfoCard = ({
    stock,
    performance,
  }: {
    stock: Stock;
    performance: typeof performanceOne;
  }) => (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg">{stock.issuer.name}</CardTitle>
            <CardDescription>
              {stock.code} • {stock.isinCode}
            </CardDescription>
          </div>
          <PerformanceBadge performance={performance} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-500">Price</span>
            <p className="font-bold text-2xl">
              {formatChartValue(stock.price, "currency")}
            </p>
          </div>
          <div>
            <span className="text-gray-500">Market</span>
            <p className="font-medium">{stock.marketListing}</p>
          </div>
          <div>
            <span className="text-gray-500">Sector</span>
            <p className="font-medium">{stock.issuer.activitySector}</p>
          </div>
          <div>
            <span className="text-gray-500">Dividend</span>
            <p className="font-medium">{stock.dividendRate}%</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="w-full space-y-6">
      {/* Header with controls */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{t("stockTracker")}</h2>
          <p className="text-gray-600">
            {compareMode ? t("comparingStocks") : t("trackingStock")}
          </p>
        </div>
        {showCompareToggle && (
          <Button
            variant="outline"
            onClick={() => setCompareMode(!compareMode)}
            className="flex items-center gap-2"
          >
            <Repeat className="h-4 w-4" />
            {compareMode ? t("singleView") : t("compareView")}
          </Button>
        )}
      </div>

      {/* Stock selection */}
      <div className="flex gap-4 items-center">
        <Select value={selectedStockOne} onValueChange={setSelectedStockOne}>
          <SelectTrigger className="w-64">
            <SelectValue placeholder={t("selectFirstStock")} />
          </SelectTrigger>
          <SelectContent>
            {stocks.map((stock) => (
              <SelectItem key={stock.id} value={stock.id}>
                {stock.issuer.name} ({stock.code})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {compareMode && (
          <Select value={selectedStockTwo} onValueChange={setSelectedStockTwo}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder={t("selectSecondStock")} />
            </SelectTrigger>
            <SelectContent>
              {stocks.map((stock) => (
                <SelectItem key={stock.id} value={stock.id}>
                  {stock.issuer.name} ({stock.code})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}
      </div>

      {/* Stock info cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {stockOne && (
          <StockInfoCard stock={stockOne} performance={performanceOne} />
        )}
        {compareMode && stockTwo && (
          <StockInfoCard stock={stockTwo} performance={performanceTwo} />
        )}
      </div>

      {/* Main content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="graphe">{t("graphe")}</TabsTrigger>
          <TabsTrigger value="table">{t("table")}</TabsTrigger>
        </TabsList>

        <TabsContent value="graphe" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                {compareMode ? t("stockComparison") : t("stockTracking")}
              </CardTitle>
              <CardDescription>
                {compareMode && stockOne && stockTwo
                  ? `${stockOne.issuer.name} vs ${stockTwo.issuer.name}`
                  : stockOne?.issuer.name || t("selectStock")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChartContainer
                config={chartConfig}
                className="min-h-[400px] w-full"
              >
                <AreaChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={createAxisTickFormatter("short", locale)}
                  />
                  <YAxis
                    tickFormatter={(value) =>
                      formatChartValue(value, "currency")
                    }
                  />
                  <ChartTooltip
                    content={<ChartTooltipContent />}
                    labelFormatter={(value) => formatTooltipDate(value, locale)}
                  />
                  <ChartLegend content={<ChartLegendContent />} />
                  <Area
                    type="monotone"
                    dataKey="stockOne"
                    stroke="var(--color-stockOne)"
                    fill="var(--color-stockOne)"
                    fillOpacity={0.3}
                    name={stockOne?.issuer.name || "Stock One"}
                  />
                  {compareMode && stockTwo && (
                    <Area
                      type="monotone"
                      dataKey="stockTwo"
                      stroke="var(--color-stockTwo)"
                      fill="var(--color-stockTwo)"
                      fillOpacity={0.3}
                      name={stockTwo.issuer.name}
                    />
                  )}
                </AreaChart>
              </ChartContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="table" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("priceHistory")}</CardTitle>
              <CardDescription>
                {compareMode
                  ? t("historicalComparison")
                  : t("historicalPrices")}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-4">{t("date")}</th>
                      <th className="text-left p-4">
                        {stockOne?.issuer.name || t("stockOne")}
                      </th>
                      {compareMode && stockTwo && (
                        <th className="text-left p-4">
                          {stockTwo.issuer.name}
                        </th>
                      )}
                      {compareMode && stockTwo && (
                        <th className="text-left p-4">{t("difference")}</th>
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {chartData.map((row, index) => (
                      <tr key={index} className="border-b">
                        <td className="p-4">
                          {formatChartDate(row.date, "medium", locale)}
                        </td>
                        <td className="p-4">
                          {formatChartValue(row.stockOne, "currency")}
                        </td>
                        {compareMode && stockTwo && (
                          <td className="p-4">
                            {row.stockTwo
                              ? formatChartValue(row.stockTwo, "currency")
                              : "—"}
                          </td>
                        )}
                        {compareMode && stockTwo && (
                          <td className="p-4">
                            {row.stockTwo ? (
                              <span
                                className={`font-medium ${
                                  row.stockOne - row.stockTwo > 0
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {formatChartValue(
                                  row.stockOne - row.stockTwo,
                                  "currency"
                                )}
                              </span>
                            ) : (
                              "—"
                            )}
                          </td>
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
