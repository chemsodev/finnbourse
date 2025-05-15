"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { fetchGraphQLClient } from "@/app/actions/clientGraphQL";
import { useTranslations } from "next-intl";
import { PERF_PLATEFORME_QUERY } from "@/graphql/queries";
import RateLimitReached from "../RateLimitReached";

type SecurityTransaction = {
  issuer: string;
  totalValue: number;
  totalQuantity: number;
  transactionCount: number;
};

const chartConfig = {
  totalValue: {
    label: "Total Value",
    color: "hsl(var(--chart-1))",
  },
  totalQuantity: {
    label: "Total Quantity",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function GraphPerfPlat(titre: { titre: string }) {
  const ititre = titre.titre;
  const [data, setData] = useState<SecurityTransaction[]>([]);
  const session = useSession();
  const userId = (session?.data?.user as any)?.id;
  const t = useTranslations("SecurityIssuers");

  const processData = (rawData: any[]): SecurityTransaction[] => {
    return rawData?.map((item) => ({
      issuer: item.securityissuer || "Unknown",
      totalValue: item._sum?.validatedprice || 0,
      totalQuantity: item._sum?.validatedquantity || 0,
      transactionCount: item._count?.id || 0,
    }));
  };

  const fetchTransactions = async () => {
    try {
      const result = await fetchGraphQLClient<any>(PERF_PLATEFORME_QUERY);
      console.log("API Response:", result); // Debug log

      if (result?.data?.groupByOrder) {
        setData(processData(result.data.groupByOrder));
      } else {
        console.error("Unexpected API response structure:", result);
      }
    } catch (error) {
      if (error === "Too many requests") {
        return <RateLimitReached />;
      }
      console.error("Error fetching transactions:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  return (
    <Card className="border-0 shadow-none w-[45%]">
      <CardHeader>
        <CardTitle>{ititre}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full">
          <BarChart
            data={data}
            margin={{ top: 20, right: 20, left: 20, bottom: 70 }} // Increased bottom margin
            barCategoryGap="15%"
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="issuer"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => t(value) || value}
              angle={-45}
              textAnchor="end"
              height={100} // Increased height for labels
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value.toLocaleString()}`}
            />
            <ChartTooltip
              cursor={false}
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;

                return (
                  <ChartTooltipContent>
                    <div className="bg-background p-4 rounded-lg shadow-lg border">
                      <h3 className="font-semibold mb-2">
                        {t(label) || label}
                      </h3>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Total Value
                          </p>
                          <p className="font-medium">
                            ${(payload[0].value || 0).toLocaleString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm text-muted-foreground">
                            Total Quantity
                          </p>
                          <p className="font-medium">
                            {(payload[1].value || 0).toLocaleString()}
                          </p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-sm text-muted-foreground">
                            Transactions
                          </p>
                          <p className="font-medium">
                            {payload[0].payload.transactionCount}
                          </p>
                        </div>
                      </div>
                    </div>
                  </ChartTooltipContent>
                );
              }}
            />
            <Bar
              dataKey="totalValue"
              fill="hsl(var(--chart-1))" // Direct color fallback
              radius={[4, 4, 0, 0]}
              stackId="a"
            >
              <LabelList
                dataKey="totalValue"
                position="top"
                formatter={(value: number) =>
                  value > 0 ? `$${value.toLocaleString()}` : ""
                }
                className="text-xs"
              />
            </Bar>
            <Bar
              dataKey="totalQuantity"
              fill="hsl(var(--chart-2))" // Direct color fallback
              radius={[4, 4, 0, 0]}
              stackId="a"
            >
              <LabelList
                dataKey="totalQuantity"
                position="top"
                formatter={(value: number) =>
                  value > 0 ? value.toLocaleString() : ""
                }
                className="text-xs"
              />
            </Bar>
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
