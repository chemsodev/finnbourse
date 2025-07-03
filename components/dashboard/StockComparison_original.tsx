"use client";

import React, { useState, useEffect, useMemo, useCallback } from "react";
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
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { useTranslations } from "next-intl";

interface Security {
  id: string;
  name: string;
  code: string;
  issuer: string;
}

interface SecurityHistoryPoint {
  date: string;
  price: number;
}

export function StockComparison() {
  const t = useTranslations("stockComparison");

  const [security1, setSecurity1] = useState<string>("");
  const [security2, setSecurity2] = useState<string>("");
  const [fromDate, setFromDate] = useState<Date>(
    new Date(new Date().setMonth(new Date().getMonth() - 1))
  );
  const [toDate, setToDate] = useState<Date>(new Date());
  const [chartData, setChartData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [securities, setSecurities] = useState<Security[]>([]);

  // Fetch available securities
  useEffect(() => {
    generateMockSecurities();
  }, []);

  // Generate mock securities for testing
  const generateMockSecurities = () => {
    setSecurities([
      { id: "stock1", name: "AIR ALGÉRIE", code: "AIR", issuer: "AIR ALGÉRIE" },
      { id: "stock2", name: "SONATRACH", code: "SON", issuer: "SONATRACH" },
      {
        id: "stock3",
        name: "BANQUE EXTÉRIEURE D'ALGÉRIE",
        code: "BEA",
        issuer: "BEA",
      },
      {
        id: "stock4",
        name: "BANQUE DE DÉVELOPPEMENT LOCAL",
        code: "BDL",
        issuer: "BDL",
      },
      { id: "stock5", name: "SAIDAL", code: "SAI", issuer: "SAIDAL" },
    ]);
  };

  // Generate mock data for a specific security
  const generateMockDataForSecurity = (
    securityId: string,
    dataMap: Map<string, any>,
    isSecond = false
  ) => {
    const currentDate = new Date(fromDate);
    const endDate = new Date(toDate);
    const securityCode =
      securities.find((s) => s.id === securityId)?.code ||
      (isSecond ? "Security 2" : "Security 1");

    // Base value and trend for the security
    const baseValue = isSecond ? 120 : 100;
    const volatility = isSecond ? 0.8 : 1.2;

    while (currentDate <= endDate) {
      const dateStr = format(currentDate, "yyyy-MM-dd");
      const daysPassed = Math.floor(
        (currentDate.getTime() - fromDate.getTime()) / (1000 * 60 * 60 * 24)
      );

      // Create a realistic price movement with some randomness and trend
      const trendComponent = isSecond
        ? Math.sin(daysPassed / 15) * 10
        : daysPassed * 0.5;

      const randomComponent = (Math.random() - 0.5) * 10 * volatility;
      const price = baseValue + trendComponent + randomComponent;

      const existing = dataMap.get(dateStr) || { date: dateStr };
      dataMap.set(dateStr, {
        ...existing,
        [securityCode]: Math.max(price, 10).toFixed(2),
      });

      currentDate.setDate(currentDate.getDate() + 1);
    }
  };

  // Generate full mock data for both securities
  const generateFullMockData = useCallback(() => {
    const mockData = [];
    const currentDate = new Date(fromDate);
    const endDate = new Date(toDate);

    const security1Code =
      securities.find((s) => s.id === security1)?.code || "Security 1";
    const security2Code =
      securities.find((s) => s.id === security2)?.code || "Security 2";

    // Base values and trends
    const baseValue1 = 100;
    const baseValue2 = security2 ? 120 : 0;
    let trend1 = 0;
    let trend2 = 0;

    // Limit the number of data points to improve performance
    const totalDays = Math.ceil(
      (endDate.getTime() - currentDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const interval = totalDays > 60 ? Math.ceil(totalDays / 30) : 1; // Sample at most ~30 points

    let dayCount = 0;
    while (currentDate <= endDate) {
      // Only add data points at specified intervals to reduce load
      if (dayCount % interval === 0) {
        // Add some realistic price movements
        trend1 += (Math.random() - 0.48) * 2;
        trend2 += (Math.random() - 0.52) * 2;

        // Limit the trend to prevent extreme values
        trend1 = Math.max(-15, Math.min(15, trend1));
        trend2 = Math.max(-15, Math.min(15, trend2));

        const dataPoint: any = {
          date: format(currentDate, "yyyy-MM-dd"),
          [security1Code]: (baseValue1 + trend1).toFixed(2),
        };

        if (security2) {
          dataPoint[security2Code] = (baseValue2 + trend2).toFixed(2);
        }

        mockData.push(dataPoint);
      }

      currentDate.setDate(currentDate.getDate() + 1);
      dayCount++;
    }

    return mockData;
  }, [fromDate, toDate, security1, security2, securities]);

  // Function to fetch security history data
  const fetchSecurityData = async () => {
    if (!security1 || !fromDate || !toDate) {
      return;
    }
    setLoading(true);
    try {
      // Always use mock data
      const combinedData = new Map();
      generateMockDataForSecurity(security1, combinedData);
      if (security2) {
        generateMockDataForSecurity(security2, combinedData, true);
      }
      let chartDataArray = Array.from(combinedData.values()).sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
      if (chartDataArray.length === 0) {
        chartDataArray = generateFullMockData();
      }
      setChartData(chartDataArray);
    } catch (error) {
      setChartData(generateFullMockData());
    } finally {
      setLoading(false);
    }
  };

  // Memoize the chart lines to prevent unnecessary re-renders
  const chartLines = useMemo(() => {
    if (!chartData.length) return [];

    return Object.keys(chartData[0])
      .filter((key) => key !== "date")
      .map((key, index) => (
        <Line
          key={key}
          type="linear"
          dataKey={key}
          stroke={index === 0 ? "#8884d8" : "#82ca9d"}
          activeDot={{ r: 8 }}
          name={key}
          // Optimize rendering by reducing the number of segments
          isAnimationActive={false}
        />
      ));
  }, [chartData]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t("title")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <h3 className="text-sm font-medium mb-2">{t("stock1")}</h3>
            <Select value={security1} onValueChange={setSecurity1}>
              <SelectTrigger>
                <SelectValue placeholder={t("chooseStock")} />
              </SelectTrigger>
              <SelectContent>
                {securities.map((security) => (
                  <SelectItem key={security.id} value={security.id}>
                    {security.issuer} ({security.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              {t("compareWith")}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">{t("stock2")}</h3>
            <Select value={security2} onValueChange={setSecurity2}>
              <SelectTrigger>
                <SelectValue placeholder={t("chooseStock")} />
              </SelectTrigger>
              <SelectContent>
                {securities.map((security) => (
                  <SelectItem key={security.id} value={security.id}>
                    {security.issuer} ({security.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-muted-foreground mt-1">
              {t("stockToCompare")}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">{t("fromDate")}</h3>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {fromDate ? format(fromDate, "PPP") : t("pickDate")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={fromDate}
                  onSelect={(date) => date && setFromDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div>
            <h3 className="text-sm font-medium mb-2">{t("toDate")}</h3>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {toDate ? format(toDate, "PPP") : t("pickDate")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={toDate}
                  onSelect={(date) => date && setToDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <Button
          className="w-full mb-6"
          onClick={fetchSecurityData}
          disabled={loading || !security1 || !fromDate || !toDate}
        >
          {loading ? t("loading") : t("view")}
        </Button>

        {chartData.length > 0 && (
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={chartData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  // Optimize X-axis rendering by showing fewer ticks
                  interval="preserveStartEnd"
                  minTickGap={50}
                />
                <YAxis />
                <Tooltip />
                <Legend />
                {chartLines}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
