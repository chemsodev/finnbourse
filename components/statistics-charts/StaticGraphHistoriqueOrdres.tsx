/**
 * Static version of GraphHistoriqueOrdres that uses mock data instead of GraphQL
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
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// Mock data for order history
const mockOrderHistoryData = [
  { date: "2024-01", confirmedOrders: 45, rejectedOrders: 5 },
  { date: "2024-02", confirmedOrders: 52, rejectedOrders: 3 },
  { date: "2024-03", confirmedOrders: 48, rejectedOrders: 7 },
  { date: "2024-04", confirmedOrders: 61, rejectedOrders: 4 },
  { date: "2024-05", confirmedOrders: 55, rejectedOrders: 6 },
  { date: "2024-06", confirmedOrders: 67, rejectedOrders: 2 },
  { date: "2024-07", confirmedOrders: 71, rejectedOrders: 5 },
  { date: "2024-08", confirmedOrders: 59, rejectedOrders: 8 },
  { date: "2024-09", confirmedOrders: 64, rejectedOrders: 3 },
  { date: "2024-10", confirmedOrders: 72, rejectedOrders: 4 },
  { date: "2024-11", confirmedOrders: 68, rejectedOrders: 6 },
  { date: "2024-12", confirmedOrders: 75, rejectedOrders: 2 },
];

export default function StaticGraphHistoriqueOrdres() {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Historique des Ordres</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={mockOrderHistoryData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tick={{ fontSize: 12 }}
              tickLine={{ stroke: "#94a3b8" }}
            />
            <YAxis tick={{ fontSize: 12 }} tickLine={{ stroke: "#94a3b8" }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1e293b",
                border: "1px solid #475569",
                borderRadius: "8px",
                color: "#f1f5f9",
              }}
            />
            <Legend />
            <Line
              type="monotone"
              dataKey="confirmedOrders"
              stroke="#22c55e"
              strokeWidth={2}
              name="Ordres Confirmés"
              dot={{ fill: "#22c55e" }}
            />
            <Line
              type="monotone"
              dataKey="rejectedOrders"
              stroke="#ef4444"
              strokeWidth={2}
              name="Ordres Rejetés"
              dot={{ fill: "#ef4444" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
