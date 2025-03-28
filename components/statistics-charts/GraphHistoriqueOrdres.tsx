"use client";

import { Bar, BarChart, CartesianGrid, LabelList, XAxis } from "recharts";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { fetchGraphQL } from "@/app/actions/fetchGraphQL";
import { ORDER_HISTORY_QUERY } from "@/graphql/queries";
import { useTranslations } from "next-intl";
import RateLimitReached from "../RateLimitReached";

type OrderStatusData = {
  status: string;
  count: number;
  statusKey: number;
};

const chartConfig = {
  count: {
    label: "Orders",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

export function GraphHistoriqueOrdres(titre: { titre: string }) {
  const ititre = titre.titre;
  const [chartData, setChartData] = useState<OrderStatusData[]>([]);
  const session = useSession();
  const userid = session?.data?.user?.id;
  const tStatus = useTranslations("status");

  const processData = (rawData: any[]): OrderStatusData[] => {
    return rawData?.map((item) => ({
      statusKey: item.orderstatus,
      status: getStatusLabel(item.orderstatus),
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

  const fetchOrderHistoryData = async () => {
    try {
      const result = await fetchGraphQL<any>(ORDER_HISTORY_QUERY, { userid });
      const processedData = processData(result.groupByOrder);
      setChartData(processedData);
    } catch (error) {
      if (error === "Too many requests") {
        return <RateLimitReached />;
      }
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    fetchOrderHistoryData();
  }, []);

  return (
    <Card className="border-0 shadow-none w-[45%]">
      <CardHeader>
        <CardTitle>{ititre}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full">
          <BarChart accessibilityLayer data={chartData} margin={{ top: 20 }}>
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
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => getStatusLabel(value)}
                />
              }
            />
            <Bar dataKey="count" fill="var(--color-count)" radius={8}>
              <LabelList
                dataKey="count"
                position="top"
                offset={12}
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
