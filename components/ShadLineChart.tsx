"use client";
import { CartesianGrid, Line, LineChart, XAxis } from "recharts";
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { useLocale } from "next-intl";
import { 
  formatChartDate, 
  formatTooltipDate, 
  createAxisTickFormatter,
  type SupportedLocale 
} from "@/lib/chart-utils";
import type { DotProps } from "recharts";

const chartData = [
  { month: "January", desktop: 186 },
  { month: "February", desktop: 305 },
  { month: "March", desktop: 237 },
  { month: "April", desktop: 473 },
  { month: "May", desktop: 209 },
  { month: "June", desktop: 214 },
  { month: "July", desktop: 390 },
  { month: "August", desktop: 180 },
  { month: "September", desktop: 520 },
  { month: "October", desktop: 290 },
  { month: "November", desktop: 450 },
  { month: "December", desktop: 320 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

// Recharts passes cx & cy for every point. During first render or when
// a point is outside the visible area they can be null / undefined.
// Guard against that to avoid "NaN for the x attribute" warnings.

const PointedDot = ({ cx, cy, stroke }: DotProps) => {
  // Bail out if coordinates aren’t valid numbers
  if (typeof cx !== "number" || typeof cy !== "number" || Number.isNaN(cx) || Number.isNaN(cy)) {
    return null
  }

  const width = 6
  const height = 16

  return (
    <svg x={cx - width / 2} y={cy - height / 2} width={width} height={height}>
      <polygon points={`${width / 2},0 0,${height} ${width},${height}`} fill={stroke || "var(--color-desktop)"} />
    </svg>
  )
}

export function ShadLineChart() {
  const locale = useLocale() as SupportedLocale;

  return (
    <div>
      <ChartContainer config={chartConfig} className="max-h-60 w-full">
        <LineChart
          accessibilityLayer
          data={chartData}
          margin={{
            left: 12,
            right: 12,
          }}
        >
          <CartesianGrid vertical={false} />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            tickFormatter={(value) => formatChartDate(`2024-${value}-01`, "short", locale)}
          />
          <ChartTooltip 
            cursor={false} 
            content={
              <ChartTooltipContent
                hideLabel
                labelFormatter={(label) => formatTooltipDate(`2024-${label}-01`, locale)}
              />
            }
          />
          <Line dataKey="desktop" type="linear" stroke="var(--color-desktop)" strokeWidth={2} dot={<PointedDot />} />
        </LineChart>
      </ChartContainer>
    </div>
  )
}
