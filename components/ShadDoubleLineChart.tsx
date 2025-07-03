"use client"
import { CartesianGrid, Line, LineChart, XAxis } from "recharts"
import { type ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import type { DotProps } from "recharts"

const chartData = [
  { month: "January", clients: 186, visitors: 280 },
  { month: "February", clients: 305, visitors: 420 },
  { month: "March", clients: 237, visitors: 350 },
  { month: "April", clients: 473, visitors: 580 },
  { month: "May", clients: 209, visitors: 320 },
  { month: "June", clients: 214, visitors: 290 },
  { month: "July", clients: 390, visitors: 480 },
  { month: "August", clients: 180, visitors: 250 },
  { month: "September", clients: 520, visitors: 650 },
  { month: "October", clients: 290, visitors: 380 },
  { month: "November", clients: 450, visitors: 560 },
  { month: "December", clients: 320, visitors: 410 },
]

const chartConfig = {
  clients: {
    label: "Clients",
    color: "hsl(var(--chart-1))",
  },
  visitors: {
    label: "Visitors",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

const PointedDot = ({ cx, cy, stroke }: DotProps) => {
  if (typeof cx !== "number" || typeof cy !== "number" || Number.isNaN(cx) || Number.isNaN(cy)) {
    return null
  }

  const width = 6
  const height = 16

  return (
    <svg x={cx - width / 2} y={cy - height / 2} width={width} height={height}>
      <polygon points={`${width / 2},0 0,${height} ${width},${height}`} fill={stroke} />
    </svg>
  )
}

export function ShadDoubleLineChart() {
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
            tickFormatter={(value) => value.slice(0, 3)}
          />
          <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
          <Line dataKey="clients" type="linear" stroke="var(--color-clients)" strokeWidth={2} dot={<PointedDot />} />
          <Line dataKey="visitors" type="linear" stroke="var(--color-visitors)" strokeWidth={2} dot={<PointedDot />} />
        </LineChart>
      </ChartContainer>
    </div>
  )
}
