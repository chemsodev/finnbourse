/**
 * Static version of GraphPerfPlat that uses mock data instead of GraphQL
 */

"use client";

import React from "react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Line,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock data for platform performance
const mockPlatformPerformanceData = [
  { month: "Jan", totalVolume: 15420000, totalTransactions: 234 },
  { month: "Fév", totalVolume: 18750000, totalTransactions: 287 },
  { month: "Mar", totalVolume: 22340000, totalTransactions: 298 },
  { month: "Avr", totalVolume: 19870000, totalTransactions: 276 },
  { month: "Mai", totalVolume: 25600000, totalTransactions: 341 },
  { month: "Juin", totalVolume: 28900000, totalTransactions: 389 },
  { month: "Juil", totalVolume: 31250000, totalTransactions: 412 },
  { month: "Août", totalVolume: 27680000, totalTransactions: 367 },
  { month: "Sep", totalVolume: 33150000, totalTransactions: 445 },
  { month: "Oct", totalVolume: 36420000, totalTransactions: 478 },
  { month: "Nov", totalVolume: 34780000, totalTransactions: 456 },
  { month: "Déc", totalVolume: 39650000, totalTransactions: 521 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 p-4 rounded-lg border border-slate-600">
        <p className="text-slate-200 font-medium">{`Mois: ${label}`}</p>
        <p className="text-blue-400">
          {`Volume Total: ${(payload[0].value / 1000000).toFixed(1)}M €`}
        </p>
        <p className="text-green-400">
          {`Transactions: ${
            payload[1]?.value || payload[0].payload.totalTransactions
          }`}
        </p>
      </div>
    );
  }
  return null;
};

export default function StaticGraphPerfPlat() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Performance de la Plateforme</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <AreaChart data={mockPlatformPerformanceData}>
            <defs>
              <linearGradient id="colorVolume" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="month"
              tick={{ fontSize: 12, fill: "#9ca3af" }}
              tickLine={{ stroke: "#6b7280" }}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#9ca3af" }}
              tickLine={{ stroke: "#6b7280" }}
              tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M €`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="linear"
              dataKey="totalVolume"
              stroke="#3b82f6"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#colorVolume)"
            />
          </AreaChart>
        </ResponsiveContainer>
        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded">
            <p className="text-slate-600 dark:text-slate-400">
              Volume Total Annuel
            </p>
            <p className="text-xl font-bold text-blue-600">322.8M €</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-800 p-3 rounded">
            <p className="text-slate-600 dark:text-slate-400">
              Transactions Totales
            </p>
            <p className="text-xl font-bold text-green-600">4,504</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
