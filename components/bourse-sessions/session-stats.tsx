"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { useTranslations } from "next-intl";

// Mock data for demonstration
const sessionStats = [
  { name: "Session 1", validated: 12, rejected: 3, pending: 2 },
  { name: "Session 2", validated: 8, rejected: 1, pending: 0 },
  { name: "Session 3", validated: 15, rejected: 4, pending: 1 },
  { name: "Session 4", validated: 10, rejected: 2, pending: 3 },
];

const orderTypeData = [
  { name: "Actions", value: 45 },
  { name: "Obligations", value: 25 },
  { name: "Sukuk", value: 15 },
  { name: "OPV", value: 10 },
  { name: "Titres Participatifs", value: 5 },
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export default function SessionStats() {
  const t = useTranslations("bourseSessions.stats");

  // Translate order type names
  const translatedOrderTypeData = orderTypeData.map((item) => ({
    name: t(
      `orderTypes.${
        item.name === "Actions"
          ? "stocks"
          : item.name === "Obligations"
          ? "bonds"
          : item.name === "Sukuk"
          ? "sukuk"
          : item.name === "OPV"
          ? "ipo"
          : "participative"
      }`
    ),
    value: item.value,
  }));

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>{t("sessionsStatsTitle")}</CardTitle>
          <CardDescription>{t("sessionsStatsDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={sessionStats}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar
                  dataKey="validated"
                  name={t("chart.validated")}
                  fill="#22c55e"
                />
                <Bar
                  dataKey="rejected"
                  name={t("chart.rejected")}
                  fill="#ef4444"
                />
                <Bar
                  dataKey="pending"
                  name={t("chart.pending")}
                  fill="#f59e0b"
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("orderTypesTitle")}</CardTitle>
          <CardDescription>{t("orderTypesDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={translatedOrderTypeData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  label={({
                    name,
                    percent,
                  }: {
                    name: string;
                    percent: number;
                  }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {translatedOrderTypeData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
