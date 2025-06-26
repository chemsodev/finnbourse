/**
 * Static version of GraphPerfNegociateurs that uses mock data instead of GraphQL
 */

"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock data for negotiator performance
const mockNegociateursData = [
  { fullName: "Alice Martin", totalVolume: 15420000, totalOrders: 87 },
  { fullName: "Jean Dupont", totalVolume: 12750000, totalOrders: 64 },
  { fullName: "Marie Bernard", totalVolume: 18340000, totalOrders: 92 },
  { fullName: "Pierre Durand", totalVolume: 9870000, totalOrders: 51 },
  { fullName: "Sophie Lefebvre", totalVolume: 21600000, totalOrders: 108 },
  { fullName: "Laurent Moreau", totalVolume: 16900000, totalOrders: 79 },
  { fullName: "Camille Rousseau", totalVolume: 13250000, totalOrders: 68 },
  { fullName: "Nicolas Petit", totalVolume: 19680000, totalOrders: 95 },
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-slate-800 p-4 rounded-lg border border-slate-600">
        <p className="text-slate-200 font-medium">{`Négociateur: ${label}`}</p>
        <p className="text-blue-400">
          {`Volume: ${(payload[0].value / 1000000).toFixed(1)}M €`}
        </p>
        <p className="text-green-400">
          {`Ordres: ${payload[1]?.value || payload[0].payload.totalOrders}`}
        </p>
      </div>
    );
  }
  return null;
};

export default function StaticGraphPerfNegociateurs() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Performance des Négociateurs</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={mockNegociateursData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis
              dataKey="fullName"
              tick={{ fontSize: 10, fill: "#9ca3af" }}
              tickLine={{ stroke: "#6b7280" }}
              angle={-45}
              textAnchor="end"
              height={100}
            />
            <YAxis
              tick={{ fontSize: 12, fill: "#9ca3af" }}
              tickLine={{ stroke: "#6b7280" }}
              tickFormatter={(value) => `${(value / 1000000).toFixed(0)}M`}
            />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar
              dataKey="totalVolume"
              fill="#3b82f6"
              name="Volume (€)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
        <div className="mt-4 text-sm text-slate-600 dark:text-slate-400">
          <p>Meilleur négociateur: Sophie Lefebvre (21.6M € sur 108 ordres)</p>
        </div>
      </CardContent>
    </Card>
  );
}
