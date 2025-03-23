"use client";

import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
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
import { it } from "node:test";
import { VUE_ENSEMBLE_TRANSACTIONS_QUERY } from "@/graphql/queries";
import RateLimitReached from "../RateLimitReached";

type TransactionData = {
  securityIssuer: string;
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

export function GraphVueEnsembleTransactions(titre: { titre: string }) {
  const ititre = titre.titre;
  const [chartData, setChartData] = useState<TransactionData[]>([]);
  const session = useSession();
  const userid = session?.data?.user?.id;
  const t = useTranslations("SecurityIssuers");

  const processData = (rawData: any[]): TransactionData[] => {
    return rawData.map((item) => ({
      securityIssuer: item.securityissuer,
      totalPrice: item._sum.validatedprice || 0,
      totalQuantity: item._sum.validatedquantity || 0,
      count: item._count.id,
    }));
  };

  const fetchTransactionData = async () => {
    try {
      const result = await fetchGraphQL<any>(VUE_ENSEMBLE_TRANSACTIONS_QUERY, {
        userid,
      });
      const processedData = processData(result.groupByOrder);
      setChartData(processedData);
    } catch (error) {
      if (error === "Too many requests") {
        return <RateLimitReached />;
      }
      console.error("Error fetching transaction data:", error);
    }
  };

  useEffect(() => {
    fetchTransactionData();
  }, []);

  return (
    <Card className="border-0 shadow-none w-[45%]">
      <CardHeader>
        <CardTitle>{ititre}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full">
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 20, left: 20 }}
            barCategoryGap="20%"
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="securityIssuer"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value}
            />
            <ChartTooltip
              cursor={false}
              content={({ payload, label }: any) => {
                if (!payload || payload.length === 0) return null;

                return (
                  <ChartTooltipContent>
                    <div className="flex flex-col gap-1">
                      <p className="font-medium">{label}</p>
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
                              ? `Total Value: DA${entry.value.toLocaleString()}`
                              : `Total Quantity: ${entry.value.toLocaleString()}`}
                          </span>
                        </div>
                      ))}
                      <p className="text-muted-foreground text-xs mt-1">
                        {payload[0]?.payload.count} transactions
                      </p>
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
                formatter={(value: number) => `DA${value.toLocaleString()}`}
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
