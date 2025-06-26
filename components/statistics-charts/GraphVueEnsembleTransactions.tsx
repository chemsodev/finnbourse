"use client";

import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";
import { Card, CardContent, CardTitle, CardHeader } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useTranslations } from "next-intl";

// Static mock data for transaction overview
const mockTransactionData = [
  {
    securityIssuer: "AlphaStock Corp",
    totalPrice: 1250000,
    totalQuantity: 15000,
    count: 25,
  },
  {
    securityIssuer: "BetaFinance Ltd",
    totalPrice: 890000,
    totalQuantity: 12000,
    count: 18,
  },
  {
    securityIssuer: "GammaInvest SA",
    totalPrice: 675000,
    totalQuantity: 8500,
    count: 14,
  },
  {
    securityIssuer: "DeltaTech Inc",
    totalPrice: 560000,
    totalQuantity: 7200,
    count: 12,
  },
  {
    securityIssuer: "EpsilonHoldings",
    totalPrice: 420000,
    totalQuantity: 5800,
    count: 9,
  },
];

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
  const t = useTranslations("SecurityIssuers");
  
  // Use static mock data instead of GraphQL
  const chartData = mockTransactionData;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("transactionOverview")}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              top: 20,
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="securityIssuer"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 10) + "..."}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="dashed" />}
            />
            <Bar dataKey="totalPrice" fill="var(--color-totalPrice)" radius={4}>
              <LabelList
                position="top"
                offset={12}
                className="fill-foreground"
                fontSize={12}
                formatter={(value: number) => 
                  new Intl.NumberFormat("en-US", {
                    style: "currency",
                    currency: "USD",
                    notation: "compact",
                  }).format(value)
                }
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
