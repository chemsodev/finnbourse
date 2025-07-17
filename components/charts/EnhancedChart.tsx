import React, { useMemo } from "react";
import {
  ResponsiveContainer,
  LineChart,
  AreaChart,
  BarChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Line,
  Area,
  Bar,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLocale } from "next-intl";
import {
  normalizeChartData,
  filterDataByDateRange,
  createAxisTickFormatter,
  formatTooltipDate,
  formatChartValue,
  type SupportedLocale,
} from "@/lib/chart-utils";
import {
  EnhancedChartTooltip,
  EnhancedChartLegend,
  createEnhancedAxisTickFormatter,
  createEnhancedDateTickFormatter,
} from "./EnhancedChartComponents";

interface ChartDataPoint {
  [key: string]: any;
  date?: string;
}

interface ChartSeries {
  key: string;
  name: string;
  color: string;
  type?: "line" | "area" | "bar";
}

interface EnhancedChartProps {
  data: ChartDataPoint[];
  series: ChartSeries[];
  chartType: "line" | "area" | "bar";
  title?: string;
  subtitle?: string;
  height?: number;
  dateKey?: string;
  valueType?: "currency" | "percentage" | "number";
  showGrid?: boolean;
  showLegend?: boolean;
  showTooltip?: boolean;
  enableZoom?: boolean;
  startDate?: Date;
  endDate?: Date;
  fillMissingDates?: boolean;
  className?: string;
  responsive?: boolean;
  gradientFill?: boolean;
  strokeWidth?: number;
  dotSize?: number;
  showDots?: boolean;
  customTooltip?: React.ComponentType<any>;
  customLegend?: React.ComponentType<any>;
  onDataPointClick?: (data: ChartDataPoint) => void;
}

export const EnhancedChart: React.FC<EnhancedChartProps> = ({
  data,
  series,
  chartType,
  title,
  subtitle,
  height = 400,
  dateKey = "date",
  valueType = "number",
  showGrid = true,
  showLegend = true,
  showTooltip = true,
  enableZoom = false,
  startDate,
  endDate,
  fillMissingDates = false,
  className,
  responsive = true,
  gradientFill = false,
  strokeWidth = 2,
  dotSize = 4,
  showDots = true,
  customTooltip,
  customLegend,
  onDataPointClick,
}) => {
  const locale = useLocale() as SupportedLocale;

  // Process and filter data
  const processedData = useMemo(() => {
    let processedData = [...data];

    // Filter by date range if specified
    if (startDate && endDate) {
      processedData = filterDataByDateRange(
        processedData,
        startDate,
        endDate,
        dateKey
      );
    }

    // Normalize data and handle missing dates
    return normalizeChartData(processedData, dateKey, fillMissingDates);
  }, [data, startDate, endDate, dateKey, fillMissingDates]);

  // Create formatters
  const dateTickFormatter = createEnhancedDateTickFormatter("short", locale);
  const valueTickFormatter = createEnhancedAxisTickFormatter(
    valueType,
    locale,
    {
      shortForm: true,
    }
  );

  // Custom tooltip renderer
  const TooltipComponent = customTooltip || EnhancedChartTooltip;
  const LegendComponent = customLegend || EnhancedChartLegend;

  // Chart component selector
  const getChartComponent = () => {
    const commonProps = {
      data: processedData,
      margin: { top: 20, right: 30, left: 20, bottom: 5 },
      onClick: onDataPointClick,
    };

    switch (chartType) {
      case "line":
        return <LineChart {...commonProps} />;
      case "area":
        return <AreaChart {...commonProps} />;
      case "bar":
        return <BarChart {...commonProps} />;
      default:
        return <LineChart {...commonProps} />;
    }
  };

  // Render chart elements based on type
  const renderChartElements = () => {
    return series.map((serie, index) => {
      const commonProps = {
        key: serie.key,
        dataKey: serie.key,
        stroke: serie.color,
        fill: serie.color,
        name: serie.name,
        strokeWidth,
      };

      switch (chartType) {
        case "line":
          return (
            <Line
              {...commonProps}
              type="monotone"
              dot={showDots ? { r: dotSize, fill: serie.color } : false}
              activeDot={{ r: dotSize + 2 }}
            />
          );
        case "area":
          return (
            <Area
              {...commonProps}
              type="monotone"
              fillOpacity={gradientFill ? 0.6 : 0.3}
              dot={showDots ? { r: dotSize, fill: serie.color } : false}
            />
          );
        case "bar":
          return (
            <Bar {...commonProps} radius={[2, 2, 0, 0]} fillOpacity={0.8} />
          );
        default:
          return null;
      }
    });
  };

  const chartContent = (
    <div style={{ height: responsive ? "100%" : height }}>
      {responsive ? (
        <ResponsiveContainer width="100%" height="100%">
          {React.cloneElement(getChartComponent(), {
            children: (
              <>
                {showGrid && <CartesianGrid strokeDasharray="3 3" />}
                <XAxis
                  dataKey={dateKey}
                  tickFormatter={dateTickFormatter}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  tickFormatter={valueTickFormatter}
                  tick={{ fontSize: 12 }}
                />
                {showTooltip && (
                  <Tooltip
                    content={
                      <TooltipComponent locale={locale} valueType={valueType} />
                    }
                  />
                )}
                {showLegend && <Legend content={<LegendComponent />} />}
                {renderChartElements()}
              </>
            ),
          })}
        </ResponsiveContainer>
      ) : (
        React.cloneElement(getChartComponent(), {
          width: "100%",
          height,
          children: (
            <>
              {showGrid && <CartesianGrid strokeDasharray="3 3" />}
              <XAxis
                dataKey={dateKey}
                tickFormatter={dateTickFormatter}
                tick={{ fontSize: 12 }}
              />
              <YAxis
                tickFormatter={valueTickFormatter}
                tick={{ fontSize: 12 }}
              />
              {showTooltip && (
                <Tooltip
                  content={
                    <TooltipComponent locale={locale} valueType={valueType} />
                  }
                />
              )}
              {showLegend && <Legend content={<LegendComponent />} />}
              {renderChartElements()}
            </>
          ),
        })
      )}
    </div>
  );

  // Render with or without card wrapper
  if (title || subtitle) {
    return (
      <Card className={className}>
        {(title || subtitle) && (
          <CardHeader>
            {title && <CardTitle>{title}</CardTitle>}
            {subtitle && (
              <p className="text-sm text-muted-foreground">{subtitle}</p>
            )}
          </CardHeader>
        )}
        <CardContent>{chartContent}</CardContent>
      </Card>
    );
  }

  return <div className={className}>{chartContent}</div>;
};

// Pre-configured chart components for common use cases
export const StockPriceChart: React.FC<{
  data: ChartDataPoint[];
  securities: Array<{ key: string; name: string; color: string }>;
  title?: string;
  startDate?: Date;
  endDate?: Date;
}> = ({ data, securities, title, startDate, endDate }) => {
  return (
    <EnhancedChart
      data={data}
      series={securities}
      chartType="line"
      title={title}
      valueType="currency"
      height={400}
      showDots={true}
      dotSize={4}
      strokeWidth={2}
      startDate={startDate}
      endDate={endDate}
      fillMissingDates={true}
    />
  );
};

export const VolumeChart: React.FC<{
  data: ChartDataPoint[];
  volumeKey: string;
  title?: string;
  startDate?: Date;
  endDate?: Date;
}> = ({ data, volumeKey, title, startDate, endDate }) => {
  return (
    <EnhancedChart
      data={data}
      series={[
        {
          key: volumeKey,
          name: "Volume",
          color: "#8884d8",
        },
      ]}
      chartType="bar"
      title={title}
      valueType="number"
      height={300}
      startDate={startDate}
      endDate={endDate}
    />
  );
};

export const PerformanceChart: React.FC<{
  data: ChartDataPoint[];
  performanceKey: string;
  title?: string;
  startDate?: Date;
  endDate?: Date;
}> = ({ data, performanceKey, title, startDate, endDate }) => {
  return (
    <EnhancedChart
      data={data}
      series={[
        {
          key: performanceKey,
          name: "Performance",
          color: "#82ca9d",
        },
      ]}
      chartType="area"
      title={title}
      valueType="percentage"
      height={350}
      gradientFill={true}
      startDate={startDate}
      endDate={endDate}
    />
  );
};
