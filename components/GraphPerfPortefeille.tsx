"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import {
  LIST_STOCKS_QUERY,
  PORTFOLIO_PERFORMANCE_QUERY,
} from "@/graphql/queries";
import { fetchGraphQL } from "@/app/actions/fetchGraphQL";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import RateLimitReached from "./RateLimitReached";

// Updated type definitions
type SecurityData = {
  security: string;
  faceValue: number;
  validatedPrice: number;
};

type ProcessedSecurity = SecurityData & {
  count: number;
};

export function GraphPerfPortefeille(titre: { titre: string }) {
  const ititre = titre.titre;

  const [chartData, setChartData] = useState<SecurityData[]>([]);
  const session = useSession();
  const userid = session?.data?.user?.id;

  const chartConfig = {
    faceValue: {
      label: "Face Value",
      color: "hsl(var(--chart-1))",
    },
    validatedPrice: {
      label: "Validated Price",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  const processData = (orders: any[]): SecurityData[] => {
    const securityMap = new Map<string, ProcessedSecurity>();

    orders.forEach((order) => {
      const securityId = order.securityid.id;
      const current = securityMap.get(securityId) || {
        security: order.securityissuer,
        faceValue: order.securityid.facevalue,
        validatedPrice: 0,
        count: 0,
      };

      securityMap.set(securityId, {
        ...current,
        validatedPrice: current.validatedPrice + order.validatedprice,
        count: current.count + 1,
      });
    });

    return Array.from(securityMap.values()).map((security) => ({
      security: security.security,
      faceValue: security.faceValue,
      validatedPrice: security.validatedPrice / security.count,
    }));
  };

  const fetchPortfolioData = async () => {
    try {
      const result = await fetchGraphQL<any>(PORTFOLIO_PERFORMANCE_QUERY, {
        userid,
      });

      const processedData = processData(result.listOrdersExtended);
      setChartData(processedData);
    } catch (error) {
      if (error === "Too many requests") {
        return <RateLimitReached />;
      }
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchPortfolioData();
  }, []);

  return (
    <Card className="border-0 shadow-none w-[45%]">
      <CardHeader>
        <CardTitle>{ititre}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="security"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="faceValue"
              fill="var(--color-faceValue)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="validatedPrice"
              fill="var(--color-validatedPrice)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
