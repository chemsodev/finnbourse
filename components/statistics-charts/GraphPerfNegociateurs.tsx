"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  YAxis,
  ResponsiveContainer,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useEffect, useState } from "react";
import { fetchGraphQL } from "@/app/actions/fetchGraphQL";
import { useTranslations } from "next-intl";
import { PERF_NEGOCIATEURS_QUERY } from "@/graphql/queries";
import RateLimitReached from "../RateLimitReached";

// New GraphQL query to fetch the list of users with their fullnames
const LIST_USERS_QUERY = `
query {
  listUsers {
    id
    fullname
  }
}
`;

type NegotiatorPerformance = {
  negotiatorId: string;
  negotiatorName?: string; // added field for the full name
  totalValue: number;
  totalQuantity: number;
  transactionCount: number;
};

const chartConfig = {
  performance: {
    label: "Performance",
    color: "#6366f1",
  },
} satisfies ChartConfig;

export function GraphPerfNegociateurs({ titre }: { titre: string }) {
  const [data, setData] = useState<NegotiatorPerformance[]>([]);
  const t = useTranslations("Negotiators");

  // Process the performance data from the performance query.
  const processPerformanceData = (rawData: any[]): NegotiatorPerformance[] => {
    if (!rawData) return [];
    return rawData
      .map((item) => ({
        negotiatorId: item.negotiatorid || "Unknown",
        totalValue: item._sum?.validatedprice ?? 0,
        totalQuantity: item._sum?.validatedquantity ?? 0,
        transactionCount: item._count?.id ?? 0,
      }))
      .filter((item) => item.transactionCount > 0); // Filter out negotiators with no transactions
  };

  // Fetch performance data and list of users, then merge them.
  const fetchNegotiatorData = async () => {
    try {
      // Fetch performance data
      const performanceResult = await fetchGraphQL<any>(
        PERF_NEGOCIATEURS_QUERY
      );
      const performanceData = processPerformanceData(
        performanceResult.groupByOrder
      );

      // Fetch users data
      const usersResult = await fetchGraphQL<any>(LIST_USERS_QUERY);
      const users = usersResult.listUsers || [];

      // Create a lookup map for user full names: { userId: fullname, ... }
      const usersMap: Record<string, string> = {};
      users.forEach((user: { id: string; fullname: string }) => {
        usersMap[user.id] = user.fullname;
      });

      // Merge full names into performance data based on negotiatorId.
      const mergedData = performanceData.map((item) => ({
        ...item,
        negotiatorName: usersMap[item.negotiatorId] || item.negotiatorId,
      }));

      setData(mergedData);
    } catch (error) {
      if (error === "Too many requests") {
        return <RateLimitReached />;
      }
      console.error("Fetch error:", error);
    }
  };

  useEffect(() => {
    fetchNegotiatorData();
  }, []);

  return (
    <Card className="border-0 shadow-none w-[45%]">
      <CardHeader>
        <CardTitle>{titre}</CardTitle>
      </CardHeader>
      <CardContent className="w-full">
        <ChartContainer config={chartConfig} className="w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 20 }} barCategoryGap="20%">
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                // Use negotiatorName instead of negotiatorId for display
                dataKey="negotiatorName"
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => value}
                angle={-45}
                textAnchor="end"
                height={80}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tickFormatter={(value) => `DA ${value.toLocaleString()}`}
              />
              <ChartTooltip
                cursor={false}
                content={({ active, payload, label }) => {
                  if (!active || !payload?.length) return null;

                  const currentData = payload[0].payload;
                  return (
                    <ChartTooltipContent>
                      <div className="bg-background p-3 rounded-md shadow-sm border">
                        <h3 className="font-semibold mb-2">
                          {t(label) || label}
                        </h3>
                        <div className="grid gap-2">
                          <div className="flex justify-between">
                            <span>Total Value:</span>
                            <span>
                              DA{" "}
                              {(currentData.totalValue || 0).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Total Quantity:</span>
                            <span>
                              {(
                                currentData.totalQuantity || 0
                              ).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span>Transactions:</span>
                            <span>{currentData.transactionCount}</span>
                          </div>
                        </div>
                      </div>
                    </ChartTooltipContent>
                  );
                }}
              />
              <Bar
                dataKey="totalValue"
                fill={chartConfig.performance.color}
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
