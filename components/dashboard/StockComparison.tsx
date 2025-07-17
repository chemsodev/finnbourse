"use client";

import React, { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, TrendingUp, TrendingDown, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { useTranslations, useLocale } from "next-intl";
import { useChartData } from "@/hooks/useChartData";
import {
  formatChartDate,
  formatTooltipDate,
  createAxisTickFormatter,
  formatChartValue,
  type SupportedLocale,
} from "@/lib/chart-utils";
import { cn } from "@/lib/utils";

// Types for the API response
interface StockPrice {
  id: string;
  stock: string;
  price: number;
  gap: number;
  date: string;
  createdAt: string;
  updatedAt: string;
}

interface Issuer {
  id: string;
  name: string;
  website: string;
  activitySector: string;
  capital: string;
  email: string;
  address: string;
  tel: string;
}

interface Stock {
  id: string;
  name: string | null;
  stockType: string;
  isPrimary: boolean;
  issuer: Issuer;
  isinCode: string;
  code: string;
  faceValue: number;
  quantity: number;
  emissionDate: string;
  closingDate: string;
  enjoymentDate: string;
  maturityDate: string | null;
  marketListing: string;
  status: string;
  dividendRate: number;
  price: number;
  stockPrices: StockPrice[];
  capitalOperation: string;
  shareClass: string | null;
  votingRights: boolean;
}

interface StockComparisonProps {
  stocks?: Stock[];
  onStockSelect?: (stock: Stock) => void;
}

const StockComparison: React.FC<StockComparisonProps> = ({
  stocks = [],
  onStockSelect,
}) => {
  const t = useTranslations("StockComparison");
  const locale = useLocale() as SupportedLocale;
  const [selectedStock1, setSelectedStock1] = useState<string>("");
  const [selectedStock2, setSelectedStock2] = useState<string>("");
  const [loading, setLoading] = useState(false);

  // Transform API data to chart format
  const transformStockData = (stock: Stock) => {
    const baseData = {
      date: stock.emissionDate,
      price: stock.price,
      stock: stock.id,
      name: stock.issuer.name,
      code: stock.code,
    };

    const priceHistory = stock.stockPrices.map((pricePoint) => ({
      date: pricePoint.date,
      price: pricePoint.price,
      stock: stock.id,
      name: stock.issuer.name,
      code: stock.code,
    }));

    return [baseData, ...priceHistory].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  };

  // Create chart data from selected stocks
  const chartData = useMemo(() => {
    if (!selectedStock1) return [];

    const stock1 = stocks.find((s) => s.id === selectedStock1);
    const stock2 = selectedStock2
      ? stocks.find((s) => s.id === selectedStock2)
      : null;

    if (!stock1) return [];

    const stock1Data = transformStockData(stock1);
    const stock2Data = stock2 ? transformStockData(stock2) : [];

    const dateMap = new Map();

    stock1Data.forEach((item) => {
      dateMap.set(item.date, {
        date: item.date,
        security1: item.price,
        security1Name: `${item.name} (${item.code})`,
      });
    });

    if (stock2Data.length > 0) {
      stock2Data.forEach((item) => {
        const existing = dateMap.get(item.date) || { date: item.date };
        dateMap.set(item.date, {
          ...existing,
          security2: item.price,
          security2Name: `${item.name} (${item.code})`,
        });
      });
    }

    return Array.from(dateMap.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [selectedStock1, selectedStock2, stocks]);

  // Use the chart data hook
  const {
    data: processedData,
    loading: dataLoading,
    error,
    dateRange,
    startDate,
    endDate,
    dateRangePresets,
    setDateRange,
    setStartDate,
    setEndDate,
    applyDateRangePreset,
    resetChart,
    statistics,
  } = useChartData({
    data: chartData,
    dateKey: "date",
    initialDateRange: "30d",
  });

  const handleCompare = () => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const getStock1Info = () => {
    const stock = stocks.find((s) => s.id === selectedStock1);
    return stock
      ? {
          name: stock.issuer.name,
          code: stock.code,
          sector: stock.issuer.activitySector,
          price: stock.price,
          faceValue: stock.faceValue,
          quantity: stock.quantity,
        }
      : null;
  };

  const getStock2Info = () => {
    const stock = stocks.find((s) => s.id === selectedStock2);
    return stock
      ? {
          name: stock.issuer.name,
          code: stock.code,
          sector: stock.issuer.activitySector,
          price: stock.price,
          faceValue: stock.faceValue,
          quantity: stock.quantity,
        }
      : null;
  };

  // Calculate performance metrics
  const performanceMetrics = useMemo(() => {
    if (processedData.length === 0) return null;

    const firstData = processedData[0];
    const lastData = processedData[processedData.length - 1];

    const calculateChange = (start: number, end: number) => {
      if (!start || !end) return { change: 0, percentage: 0 };
      const change = end - start;
      const percentage = (change / start) * 100;
      return { change, percentage };
    };

    const metrics: any = {};

    if (firstData.security1 && lastData.security1) {
      metrics.security1 = calculateChange(
        firstData.security1,
        lastData.security1
      );
    }

    if (firstData.security2 && lastData.security2) {
      metrics.security2 = calculateChange(
        firstData.security2,
        lastData.security2
      );
    }

    return metrics;
  }, [processedData]);

  if (stocks.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>{t?.("title") || "Stock Comparison"}</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <div className="text-muted-foreground">
            {t?.("noStocksAvailable") || "No stocks available for comparison"}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {t?.("title") || "Stock Comparison"}
          {(loading || dataLoading) && (
            <Loader2 className="h-4 w-4 animate-spin" />
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Stock Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              {t?.("selectStock1") || "Select First Stock"}
            </label>
            <Select value={selectedStock1} onValueChange={setSelectedStock1}>
              <SelectTrigger>
                <SelectValue
                  placeholder={t?.("selectStock") || "Select a stock"}
                />
              </SelectTrigger>
              <SelectContent>
                {stocks.map((stock) => (
                  <SelectItem key={stock.id} value={stock.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{stock.issuer.name}</span>
                      <span className="text-sm text-muted-foreground">
                        {stock.code} • {stock.issuer.activitySector}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              {t?.("selectStock2") || "Select Second Stock (Optional)"}
            </label>
            <Select value={selectedStock2} onValueChange={setSelectedStock2}>
              <SelectTrigger>
                <SelectValue
                  placeholder={t?.("selectStock") || "Select a stock"}
                />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t?.("none") || "None"}</SelectItem>
                {stocks
                  .filter((stock) => stock.id !== selectedStock1)
                  .map((stock) => (
                    <SelectItem key={stock.id} value={stock.id}>
                      <div className="flex flex-col">
                        <span className="font-medium">{stock.issuer.name}</span>
                        <span className="text-sm text-muted-foreground">
                          {stock.code} • {stock.issuer.activitySector}
                        </span>
                      </div>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Date Range Presets */}
        <div className="space-y-2">
          <label className="text-sm font-medium">
            {t?.("dateRange") || "Date Range"}
          </label>
          <div className="flex flex-wrap gap-2">
            {Object.entries(dateRangePresets).map(([key, preset]) => (
              <Button
                key={key}
                variant={dateRange === key ? "default" : "outline"}
                size="sm"
                onClick={() => applyDateRangePreset(key)}
              >
                {preset.label}
              </Button>
            ))}
            <Button
              variant={dateRange === "custom" ? "default" : "outline"}
              size="sm"
              onClick={() => setDateRange("custom")}
            >
              {t?.("custom") || "Custom"}
            </Button>
          </div>
        </div>

        {/* Custom Date Range Selection */}
        {dateRange === "custom" && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">
                {t?.("startDate") || "Start Date"}
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {startDate
                      ? formatTooltipDate(startDate, locale)
                      : t?.("pickDate") || "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                {t?.("endDate") || "End Date"}
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className="w-full justify-start text-left font-normal"
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {endDate
                      ? formatTooltipDate(endDate, locale)
                      : t?.("pickDate") || "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-2">
          <Button
            onClick={handleCompare}
            disabled={!selectedStock1 || loading || dataLoading}
            className="flex-1"
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {t?.("loading") || "Loading..."}
              </>
            ) : (
              t?.("compare") || "Compare"
            )}
          </Button>
          <Button
            variant="outline"
            onClick={resetChart}
            disabled={loading || dataLoading}
          >
            {t?.("reset") || "Reset"}
          </Button>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4">
            <div className="text-red-800 text-sm">{error}</div>
          </div>
        )}

        {/* Stock Information Cards */}
        {(getStock1Info() || getStock2Info()) && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {getStock1Info() && (
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">{getStock1Info()?.name}</h4>
                      <span className="text-sm text-muted-foreground">
                        {getStock1Info()?.code}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {getStock1Info()?.sector}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Current Price:</span>
                      <span className="font-medium">
                        {formatChartValue(
                          getStock1Info()?.price || 0,
                          "currency",
                          locale
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Face Value:</span>
                      <span className="font-medium">
                        {formatChartValue(
                          getStock1Info()?.faceValue || 0,
                          "currency",
                          locale
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Quantity:</span>
                      <span className="font-medium">
                        {getStock1Info()?.quantity?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {getStock2Info() && (
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <h4 className="font-medium">{getStock2Info()?.name}</h4>
                      <span className="text-sm text-muted-foreground">
                        {getStock2Info()?.code}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {getStock2Info()?.sector}
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Current Price:</span>
                      <span className="font-medium">
                        {formatChartValue(
                          getStock2Info()?.price || 0,
                          "currency",
                          locale
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Face Value:</span>
                      <span className="font-medium">
                        {formatChartValue(
                          getStock2Info()?.faceValue || 0,
                          "currency",
                          locale
                        )}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm">Quantity:</span>
                      <span className="font-medium">
                        {getStock2Info()?.quantity?.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Performance Metrics */}
        {performanceMetrics && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {performanceMetrics.security1 && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">
                        {getStock1Info()?.name}
                      </p>
                      <p className="text-2xl font-bold">
                        {formatChartValue(
                          performanceMetrics.security1.change,
                          "currency",
                          locale
                        )}
                      </p>
                    </div>
                    <div
                      className={cn(
                        "flex items-center",
                        performanceMetrics.security1.percentage >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      )}
                    >
                      {performanceMetrics.security1.percentage >= 0 ? (
                        <TrendingUp className="h-4 w-4 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 mr-1" />
                      )}
                      <span className="text-sm font-medium">
                        {formatChartValue(
                          performanceMetrics.security1.percentage,
                          "percentage",
                          locale
                        )}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {performanceMetrics.security2 && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium">
                        {getStock2Info()?.name}
                      </p>
                      <p className="text-2xl font-bold">
                        {formatChartValue(
                          performanceMetrics.security2.change,
                          "currency",
                          locale
                        )}
                      </p>
                    </div>
                    <div
                      className={cn(
                        "flex items-center",
                        performanceMetrics.security2.percentage >= 0
                          ? "text-green-600"
                          : "text-red-600"
                      )}
                    >
                      {performanceMetrics.security2.percentage >= 0 ? (
                        <TrendingUp className="h-4 w-4 mr-1" />
                      ) : (
                        <TrendingDown className="h-4 w-4 mr-1" />
                      )}
                      <span className="text-sm font-medium">
                        {formatChartValue(
                          performanceMetrics.security2.percentage,
                          "percentage",
                          locale
                        )}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}

        {/* Chart */}
        {selectedStock1 && processedData.length > 0 && (
          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={processedData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 12 }}
                  tickFormatter={createAxisTickFormatter("short", locale)}
                />
                <YAxis
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) =>
                    formatChartValue(value, "currency", locale)
                  }
                />
                <Tooltip
                  labelFormatter={(value) => formatTooltipDate(value, locale)}
                  formatter={(value, name) => [
                    formatChartValue(value as number, "currency", locale),
                    name === "security1"
                      ? processedData[0]?.security1Name
                      : processedData[0]?.security2Name,
                  ]}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="security1"
                  stroke="#8884d8"
                  name={processedData[0]?.security1Name || "Stock 1"}
                  strokeWidth={2}
                  dot={{ r: 4 }}
                  connectNulls={false}
                />
                {selectedStock2 && processedData.some((d) => d.security2) && (
                  <Line
                    type="monotone"
                    dataKey="security2"
                    stroke="#82ca9d"
                    name={
                      processedData.find((d) => d.security2Name)
                        ?.security2Name || "Stock 2"
                    }
                    strokeWidth={2}
                    dot={{ r: 4 }}
                    connectNulls={false}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Statistics */}
        {statistics && (
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {t?.("statistics") || "Statistics"}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {statistics.security1 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">{getStock1Info()?.name}</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Min:</span>
                        <span className="ml-2 font-medium">
                          {formatChartValue(
                            statistics.security1.min,
                            "currency",
                            locale
                          )}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Max:</span>
                        <span className="ml-2 font-medium">
                          {formatChartValue(
                            statistics.security1.max,
                            "currency",
                            locale
                          )}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Avg:</span>
                        <span className="ml-2 font-medium">
                          {formatChartValue(
                            statistics.security1.avg,
                            "currency",
                            locale
                          )}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Median:</span>
                        <span className="ml-2 font-medium">
                          {formatChartValue(
                            statistics.security1.median,
                            "currency",
                            locale
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                )}

                {statistics.security2 && (
                  <div className="space-y-2">
                    <h4 className="font-medium">{getStock2Info()?.name}</h4>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Min:</span>
                        <span className="ml-2 font-medium">
                          {formatChartValue(
                            statistics.security2.min,
                            "currency",
                            locale
                          )}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Max:</span>
                        <span className="ml-2 font-medium">
                          {formatChartValue(
                            statistics.security2.max,
                            "currency",
                            locale
                          )}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Avg:</span>
                        <span className="ml-2 font-medium">
                          {formatChartValue(
                            statistics.security2.avg,
                            "currency",
                            locale
                          )}
                        </span>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Median:</span>
                        <span className="ml-2 font-medium">
                          {formatChartValue(
                            statistics.security2.median,
                            "currency",
                            locale
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
      </CardContent>
    </Card>
  );
};

export default StockComparison;
