/**
 * Static version of GraphPerfPortefeille that uses mock data instead of GraphQL
 */

"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock data for portfolio performance
const mockPortfolioData = [
  { date: "Jan 2024", portfolioValue: 850000, benchmark: 800000 },
  { date: "Fév 2024", portfolioValue: 870000, benchmark: 820000 },
  { date: "Mar 2024", portfolioValue: 920000, benchmark: 850000 },
  { date: "Avr 2024", portfolioValue: 890000, benchmark: 840000 },
  { date: "Mai 2024", portfolioValue: 950000, benchmark: 880000 },
  { date: "Juin 2024", portfolioValue: 980000, benchmark: 910000 },
  { date: "Juil 2024", portfolioValue: 1020000, benchmark: 940000 },
  { date: "Août 2024", portfolioValue: 990000, benchmark: 930000 },
  { date: "Sep 2024", portfolioValue: 1050000, benchmark: 970000 },
  { date: "Oct 2024", portfolioValue: 1080000, benchmark: 1000000 },
  { date: "Nov 2024", portfolioValue: 1120000, benchmark: 1030000 },
  { date: "Déc 2024", portfolioValue: 1150000, benchmark: 1050000 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 p-4 rounded-lg border border-slate-600">
        <p className="text-slate-200 font-medium">{`Période: ${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            {`${entry.name}: ${(entry.value / 1000).toFixed(0)}k €`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function StaticGraphPerfPortefeille() {
  const initialValue = mockPortfolioData[0].portfolioValue;
  const finalValue =
    mockPortfolioData[mockPortfolioData.length - 1].portfolioValue;
  const performance = (
    ((finalValue - initialValue) / initialValue) *
    100
  ).toFixed(1);

  const benchmarkInitial = mockPortfolioData[0].benchmark;
  const benchmarkFinal =
    mockPortfolioData[mockPortfolioData.length - 1].benchmark;
  const benchmarkPerformance = (
    ((benchmarkFinal - benchmarkInitial) / benchmarkInitial) *
    100
  ).toFixed(1);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Performance du Portefeuille</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={mockPortfolioData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 10, fill: "#9ca3af" }}
              tickLine={{ stroke: "#6b7280" }}
              angle={-45}
              textAnchor="end"
              height={100}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#9ca3af" }}
              tickLine={{ stroke: "#6b7280" }}
              tickFormatter={(value) => `${(value / 1000).toFixed(0)}k €`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="portfolioValue"
              stroke="#22c55e"
              strokeWidth={3}
              name="Portefeuille"
              dot={{ fill: "#22c55e", r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="benchmark"
              stroke="#94a3b8"
              strokeWidth={2}
              strokeDasharray="5 5"
              name="Benchmark"
              dot={{ fill: "#94a3b8", r: 3 }}
            />
            <ReferenceLine y={1000000} stroke="#ef4444" strokeDasharray="3 3" />
          </LineChart>
        </ResponsiveContainer>

        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
            <p className="text-sm text-green-800 dark:text-green-200">
              Performance Portefeuille
            </p>
            <p className="text-2xl font-bold text-green-600">+{performance}%</p>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Performance Benchmark
            </p>
            <p className="text-2xl font-bold text-slate-600">
              +{benchmarkPerformance}%
            </p>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <p className="text-sm text-blue-800 dark:text-blue-200">
              Surperformance
            </p>
            <p className="text-2xl font-bold text-blue-600">
              +
              {(
                parseFloat(performance) - parseFloat(benchmarkPerformance)
              ).toFixed(1)}
              %
            </p>
          </div>
        </div>

        <div className="mt-4 text-sm text-slate-600 dark:text-slate-400">
          <p>
            <strong>Valeur actuelle:</strong> {(finalValue / 1000).toFixed(0)}k
            € |<strong> Plus-value:</strong> +
            {((finalValue - initialValue) / 1000).toFixed(0)}k €
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
