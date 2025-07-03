"use client";

import * as React from "react";
import { Area, AreaChart, CartesianGrid, XAxis } from "recharts";
import { chartData } from "@/lib/exportables";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartConfig = {
  visitors: {
    label: "Visitors",
  },
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  Saidal: {
    label: "Saidal",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;

export function StatAreaChart() {
  {
    /*  const [timeRange, setTimeRange] = React.useState("90d");*/
  }
  const [timeRange, setTimeRange] = React.useState("all");

  {
    /*const filteredData = chartData.filter((item) => {
    const date = new Date(item.date);
    const now = new Date();
    let daysToSubtract = 90;
    if (timeRange === "30d") {
      daysToSubtract = 30;
    } else if (timeRange === "7d") {
      daysToSubtract = 7;
    }
    now.setDate(now.getDate() - daysToSubtract);
    return date >= now;
  }); */
  }
  const filteredData = chartData;
  return (
    <div className="px-2 pt-4 sm:px-6 sm:pt-6">
      <ChartContainer
        config={chartConfig}
        className="aspect-auto h-[250px] w-full"
      >
        <AreaChart data={filteredData}>
          <defs>
            <linearGradient id="fillSaidal" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="5%"
                stopColor="var(--color-Saidal)"
                stopOpacity={0.8}
              />
              <stop
                offset="95%"
                stopColor="var(--color-Saidal)"
                stopOpacity={0.1}
              />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="date"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            minTickGap={32}
            tickFormatter={(value) => {
              const date = new Date(value);
              return date.toLocaleDateString("fr-DZ", {
                month: "short",
                day: "numeric",
              });
            }}
          />
          <ChartTooltip
            cursor={false}
            content={
              <ChartTooltipContent
                labelFormatter={(value) => {
                  return new Date(value).toLocaleDateString("fr-DZ", {
                    month: "short",
                    day: "numeric",
                  });
                }}
                indicator="dot"
              />
            }
          />
          <Area
            dataKey="Saidal"
            type="linear"
            fill="url(#fillSaidal)"
            stroke="var(--color-Saidal)"
            stackId="a"
          />
        </AreaChart>
      </ChartContainer>
    </div>
  );
}
