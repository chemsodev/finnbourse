"use client";

import * as React from "react";
import { Label, Pie, PieChart } from "recharts";

import {
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
import { TbWallet } from "react-icons/tb";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { fetchGraphQL } from "@/app/actions/fetchGraphQL";
import { GROUP_BY_PORTFOLIIOS_QUERY } from "@/graphql/queries";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

const chartConfig = {
  issuer: {
    label: "issuer",
  },
  chrome: {
    label: "Chrome",
    color: "hsl(var(--chart-1))",
  },
  safari: {
    label: "Safari",
    color: "hsl(var(--chart-2))",
  },
  firefox: {
    label: "Firefox",
    color: "hsl(var(--chart-3))",
  },
  edge: {
    label: "Edge",
    color: "hsl(var(--chart-4))",
  },
  other: {
    label: "Other",
    color: "hsl(var(--chart-5))",
  },
} satisfies ChartConfig;

const pastelColors = [
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))", // Light Green
  "hsl(var(--chart-4))",
  "#FFDAB9", // Mint
  "hsl(var(--chart-5))", // Lavender

  "#FFFFE0", // Light Yellow
  "#F08080", // Light Coral
  "#D3D3D3", // Light Grey
  "#D8BFD8", // Soft Purple
];

export function DashbpardPie() {
  const session = useSession();
  const userid = session?.data?.user?.id;

  const t = useTranslations("DashboardPie");
  const [totalSecurities, setTotalSecurities] = React.useState<any[]>([]);

  async function getTotalSecurities() {
    try {
      const MyPortfolio = await fetchGraphQL<any>(
        GROUP_BY_PORTFOLIIOS_QUERY,
        {
          userid,
        },
        {
          headers: {
            "Cache-Control": "no-cache",
          },
        }
      );
      setTotalSecurities(MyPortfolio?.groupByPortfolio || []);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  }
  useEffect(() => {
    getTotalSecurities();
  }, []);

  let totalQuantity = 0;
  if (Array.isArray(totalSecurities) && totalSecurities.length > 0) {
    console.log("totalSecurities", totalSecurities);
    totalQuantity = totalSecurities.reduce(
      (acc, item) => acc + (item._sum.quantity || 0),
      0
    );
  }

  const dataWithColors = totalSecurities.map((item: any, index: number) => ({
    ...item._sum,
    ...item,
    fill: pastelColors[index % pastelColors.length],
  }));
  console.log("dataWithColors", dataWithColors);
  return (
    <div className="flex flex-col bg-primary text-white rounded-md p-2  h-fit">
      <CardHeader>
        <CardTitle className="flex gap-2 justify-center">
          <TbWallet size={24} />
          <div className="capitalize text-lg"> {t("title")}</div>
        </CardTitle>
        <CardDescription className="text-gray-400 text-center">
          {t("description")}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[250px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent hideLabel />}
            />
            <Pie
              data={dataWithColors as any}
              dataKey="quantity"
              nameKey="issuer"
              innerRadius={60}
              strokeWidth={5}
            >
              <Label
                content={({ viewBox }) => {
                  if (viewBox && "cx" in viewBox && "cy" in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                      >
                        <tspan
                          x={viewBox.cx}
                          y={viewBox.cy}
                          className="fill-white text-3xl font-bold"
                        >
                          {totalQuantity}
                        </tspan>
                        <tspan
                          x={viewBox.cx}
                          y={(viewBox.cy || 0) + 24}
                          className="fill-gray-200"
                        >
                          {t("securities")}
                        </tspan>
                      </text>
                    );
                  }
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
        <Link
          href="/portefeuille"
          className="flex justify-center bg-white/10 rounded-full py-1 my-6"
        >
          {t("seeMore")}
        </Link>
      </CardContent>
    </div>
  );
}
