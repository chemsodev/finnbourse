"use client";

import React, { useState, useMemo } from "react";
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

// Static mock data for securities
const mockSecurities = [
  { id: "1", name: "AlphaStock Corp", code: "ALPH", issuer: "AlphaStock Corp" },
  { id: "2", name: "BetaFinance Ltd", code: "BETA", issuer: "BetaFinance Ltd" },
  { id: "3", name: "GammaInvest SA", code: "GAMA", issuer: "GammaInvest SA" },
  { id: "4", name: "DeltaTech Inc", code: "DELT", issuer: "DeltaTech Inc" },
];

// Static mock data for security history
const mockSecurityHistory = {
  "1": [
    { date: "2024-01-01", price: 100 },
    { date: "2024-01-02", price: 105 },
    { date: "2024-01-03", price: 102 },
    { date: "2024-01-04", price: 108 },
    { date: "2024-01-05", price: 112 },
    { date: "2024-01-06", price: 115 },
    { date: "2024-01-07", price: 110 },
  ],
  "2": [
    { date: "2024-01-01", price: 150 },
    { date: "2024-01-02", price: 155 },
    { date: "2024-01-03", price: 148 },
    { date: "2024-01-04", price: 162 },
    { date: "2024-01-05", price: 158 },
    { date: "2024-01-06", price: 165 },
    { date: "2024-01-07", price: 160 },
  ],
  "3": [
    { date: "2024-01-01", price: 80 },
    { date: "2024-01-02", price: 82 },
    { date: "2024-01-03", price: 85 },
    { date: "2024-01-04", price: 88 },
    { date: "2024-01-05", price: 84 },
    { date: "2024-01-06", price: 87 },
    { date: "2024-01-07", price: 85 },
  ],
  "4": [
    { date: "2024-01-01", price: 90 },
    { date: "2024-01-02", price: 95 },
    { date: "2024-01-03", price: 92 },
    { date: "2024-01-04", price: 98 },
    { date: "2024-01-05", price: 96 },
    { date: "2024-01-06", price: 100 },
    { date: "2024-01-07", price: 95 },
  ],
};

interface Security {
  id: string;
  name: string;
  code: string;
  issuer: string;
}

interface SecurityHistory {
  date: string;
  price: number;
}

const StockComparison: React.FC = () => {
  const t = useTranslations("StockComparison");
  const [selectedSecurity1, setSelectedSecurity1] = useState<string>("");
  const [selectedSecurity2, setSelectedSecurity2] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [loading, setLoading] = useState(false);

  // Process data for chart
  const chartData = useMemo(() => {
    if (!selectedSecurity1) return [];

    const security1Data = mockSecurityHistory[selectedSecurity1 as keyof typeof mockSecurityHistory] || [];
    const security2Data = selectedSecurity2 
      ? mockSecurityHistory[selectedSecurity2 as keyof typeof mockSecurityHistory] || []
      : [];

    const dateMap = new Map();
    
    security1Data.forEach((item) => {
      dateMap.set(item.date, {
        date: item.date,
        security1: item.price,
      });
    });

    if (selectedSecurity2) {
      security2Data.forEach((item) => {
        const existing = dateMap.get(item.date) || { date: item.date };
        dateMap.set(item.date, {
          ...existing,
          security2: item.price,
        });
      });
    }

    return Array.from(dateMap.values()).sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
  }, [selectedSecurity1, selectedSecurity2]);

  const handleCompare = () => {
    setLoading(true);
    // Simulate loading
    setTimeout(() => {
      setLoading(false);
    }, 500);
  };

  const getSecurity1Name = () => {
    const security = mockSecurities.find(s => s.id === selectedSecurity1);
    return security ? `${security.name} (${security.code})` : "Security 1";
  };

  const getSecurity2Name = () => {
    const security = mockSecurities.find(s => s.id === selectedSecurity2);
    return security ? `${security.name} (${security.code})` : "Security 2";
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>{t?.("title") || "Stock Comparison"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Security Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              {t?.("selectSecurity1") || "Select First Security"}
            </label>
            <Select value={selectedSecurity1} onValueChange={setSelectedSecurity1}>
              <SelectTrigger>
                <SelectValue placeholder={t?.("selectSecurity") || "Select a security"} />
              </SelectTrigger>
              <SelectContent>
                {mockSecurities.map((security) => (
                  <SelectItem key={security.id} value={security.id}>
                    {security.name} ({security.code})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">
              {t?.("selectSecurity2") || "Select Second Security (Optional)"}
            </label>
            <Select value={selectedSecurity2} onValueChange={setSelectedSecurity2}>
              <SelectTrigger>
                <SelectValue placeholder={t?.("selectSecurity") || "Select a security"} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">None</SelectItem>
                {mockSecurities
                  .filter(security => security.id !== selectedSecurity1)
                  .map((security) => (
                    <SelectItem key={security.id} value={security.id}>
                      {security.name} ({security.code})
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Date Range Selection */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              {t?.("startDate") || "Start Date"}
            </label>
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {startDate ? format(startDate, "PPP") : (t?.("pickDate") || "Pick a date")}
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
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {endDate ? format(endDate, "PPP") : (t?.("pickDate") || "Pick a date")}
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

        {/* Compare Button */}
        <Button 
          onClick={handleCompare}
          disabled={!selectedSecurity1 || loading}
          className="w-full"
        >
          {loading ? (t?.("loading") || "Loading...") : (t?.("compare") || "Compare")}
        </Button>

        {/* Chart */}
        {selectedSecurity1 && chartData.length > 0 && (
          <div className="h-96 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickFormatter={(value) => format(new Date(value), "MMM dd")}
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip 
                  labelFormatter={(value) => format(new Date(value), "PPP")}
                  formatter={(value, name) => [
                    `$${value}`,
                    name === "security1" ? getSecurity1Name() : getSecurity2Name()
                  ]}
                />
                <Legend />
                <Line 
                  type="linear" 
                  dataKey="security1" 
                  stroke="#8884d8" 
                  name={getSecurity1Name()}
                  strokeWidth={2}
                />
                {selectedSecurity2 && (
                  <Line 
                    type="linear" 
                    dataKey="security2" 
                    stroke="#82ca9d" 
                    name={getSecurity2Name()}
                    strokeWidth={2}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Summary Statistics */}
        {selectedSecurity1 && chartData.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">{getSecurity1Name()}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>{t?.("currentPrice") || "Current Price"}:</span>
                    <span className="font-semibold">
                      ${chartData[chartData.length - 1]?.security1 || 0}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>{t?.("startPrice") || "Start Price"}:</span>
                    <span className="font-semibold">
                      ${chartData[0]?.security1 || 0}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {selectedSecurity2 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{getSecurity2Name()}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>{t?.("currentPrice") || "Current Price"}:</span>
                      <span className="font-semibold">
                        ${chartData[chartData.length - 1]?.security2 || 0}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t?.("startPrice") || "Start Price"}:</span>
                      <span className="font-semibold">
                        ${chartData[0]?.security2 || 0}
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StockComparison;
