/**
 * Static version of GraphVueEnsembleTransactions that uses mock data instead of GraphQL
 */

"use client";

import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock data for transaction overview
const mockTransactionData = [
  { type: "Actions", value: 45, volume: 185000000 },
  { type: "Obligations", value: 30, volume: 120000000 },
  { type: "OPCVM", value: 15, volume: 60000000 },
  { type: "Autres", value: 10, volume: 40000000 },
];

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#ef4444"];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-slate-800 p-4 rounded-lg border border-slate-600">
        <p className="text-slate-200 font-medium">{`Type: ${data.type}`}</p>
        <p className="text-blue-400">{`Pourcentage: ${data.value}%`}</p>
        <p className="text-green-400">
          {`Volume: ${(data.volume / 1000000).toFixed(0)}M €`}
        </p>
      </div>
    );
  }
  return null;
};

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  percent,
}: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      fontSize={12}
      fontWeight="bold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

export default function StaticGraphVueEnsembleTransactions() {
  const totalVolume = mockTransactionData.reduce(
    (sum, item) => sum + item.volume,
    0
  );

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Vue d'ensemble des Transactions</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <PieChart>
            <Pie
              data={mockTransactionData}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={120}
              fill="#8884d8"
              dataKey="value"
            >
              {mockTransactionData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
            <Legend />
          </PieChart>
        </ResponsiveContainer>

        <div className="mt-6 grid grid-cols-2 gap-4">
          {mockTransactionData.map((item, index) => (
            <div
              key={item.type}
              className="flex items-center space-x-3 p-3 bg-slate-50 dark:bg-slate-800 rounded"
            >
              <div
                className="w-4 h-4 rounded"
                style={{ backgroundColor: COLORS[index] }}
              />
              <div>
                <p className="font-medium text-sm">{item.type}</p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {(item.volume / 1000000).toFixed(0)}M € ({item.value}%)
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            <strong>Volume Total:</strong> {(totalVolume / 1000000).toFixed(0)}M
            €
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
