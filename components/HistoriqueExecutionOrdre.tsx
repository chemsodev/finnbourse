"use client";

import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { fetchGraphQL } from "@/app/actions/fetchGraphQL";
import { useTranslations } from "next-intl";
import { HISTORIQUE_EXECUTION_ORDRE_QUERY } from "@/graphql/queries";
import RateLimitReached from "./RateLimitReached";

type ExecutionData = {
  statusKey: number;
  status: string;
  totalPrice: number;
  totalQuantity: number;
  count: number;
};

const chartConfig = {
  totalPrice: {
    label: "Total Value",
    color: "hsl(var(--chart-1))",
  },
  totalQuantity: {
    label: "Total Quantity",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function HistoriqueExecutionOrdre({ titre }: { titre: string }) {
  const [chartData, setChartData] = useState<ExecutionData[]>([]);
  const session = useSession();
  const userid = session?.data?.user?.id;
  const tStatus = useTranslations("status");

  const processData = (rawData: any[]): ExecutionData[] => {
    return rawData.map((item) => ({
      statusKey: item.orderstatus,
      status: getStatusLabel(item.orderstatus),
      totalPrice: item._sum.validatedprice || 0,
      totalQuantity: item._sum.validatedquantity || 0,
      count: item._count.id,
    }));
  };

  const getStatusLabel = (status: number): string => {
    return tStatus(
      {
        0: "Draft",
        1: "Pending",
        2: "In_Progress",
        3: "Validated",
        4: "Being_Processed",
        5: "Completed",
        6: "Awaiting_Approval",
        7: "Ongoing",
        8: "Partially_Validated",
        9: "Expired",
        10: "Rejected",
        11: "Cancelled",
      }[status] || "Unknown"
    );
  };

  const fetchExecutionHistory = async () => {
    try {
      const result = await fetchGraphQL<any>(HISTORIQUE_EXECUTION_ORDRE_QUERY, {
        userid,
      });
      const processedData = processData(result.groupByOrder);
      setChartData(processedData);
    } catch (error) {
      if (error === "Too many requests") {
        return <RateLimitReached />;
      }
      console.error("Error fetching execution data:", error);
    }
  };

  useEffect(() => {
    fetchExecutionHistory();
  }, []);

  return (
    <Card className="border-0 shadow-none w-[45%]">
      <CardHeader>
        <CardTitle>{titre}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full">
          <BarChart data={chartData} margin={{ top: 20 }} barCategoryGap="20%">
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="statusKey"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => getStatusLabel(value)}
            />
            <ChartTooltip
              cursor={false}
              content={({ payload, label }: any) => {
                if (!payload || payload.length === 0) return null;

                return (
                  <ChartTooltipContent>
                    <div className="flex flex-col gap-1">
                      <p className="font-medium">{getStatusLabel(label)}</p>
                      {payload.map((entry: any, index: number) => (
                        <div
                          key={`tooltip-${index}`}
                          className="flex items-center gap-2"
                        >
                          <span
                            className="w-2 h-2 rounded-full"
                            style={{ backgroundColor: entry.color }}
                          />
                          <span>
                            {entry.name === "totalPrice"
                              ? `Total Value: DZD${entry.value.toLocaleString()}`
                              : `Total Quantity: ${entry.value.toLocaleString()} shares`}
                          </span>
                        </div>
                      ))}
                    </div>
                  </ChartTooltipContent>
                );
              }}
            />
            <Bar
              dataKey="totalPrice"
              fill="var(--color-totalPrice)"
              radius={[8, 8, 0, 0]}
            >
              <LabelList
                dataKey="totalPrice"
                position="top"
                formatter={(value: number) => `DZD${value.toLocaleString()}`}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
            <Bar
              dataKey="totalQuantity"
              fill="var(--color-totalQuantity)"
              radius={[8, 8, 0, 0]}
            >
              <LabelList
                dataKey="totalQuantity"
                position="top"
                formatter={(value: number) => `${value.toLocaleString()}`}
                className="fill-foreground"
                fontSize={12}
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
