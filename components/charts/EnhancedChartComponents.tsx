import React from "react";
import {
  formatChartDate,
  formatTooltipDate,
  formatChartValue,
  type SupportedLocale,
} from "@/lib/chart-utils";
import { cn } from "@/lib/utils";

interface EnhancedChartTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: any;
    name: string;
    color: string;
    dataKey: string;
  }>;
  label?: any;
  locale?: SupportedLocale;
  valueType?: "currency" | "percentage" | "number";
  showLabel?: boolean;
  className?: string;
}

export const EnhancedChartTooltip: React.FC<EnhancedChartTooltipProps> = ({
  active,
  payload,
  label,
  locale = "en",
  valueType = "number",
  showLabel = true,
  className,
}) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  return (
    <div
      className={cn(
        "bg-background border border-border rounded-lg shadow-lg p-3 min-w-[150px]",
        className
      )}
    >
      {showLabel && label && (
        <div className="font-medium text-sm mb-2 border-b border-border pb-1">
          {formatTooltipDate(label, locale)}
        </div>
      )}
      <div className="space-y-1">
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-sm text-muted-foreground">
                {entry.name}
              </span>
            </div>
            <span className="text-sm font-medium">
              {formatChartValue(entry.value, valueType, locale)}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

interface ChartLegendProps {
  payload?: Array<{
    value: string;
    color: string;
    type?: string;
  }>;
  className?: string;
}

export const EnhancedChartLegend: React.FC<ChartLegendProps> = ({
  payload,
  className,
}) => {
  if (!payload || payload.length === 0) {
    return null;
  }

  return (
    <div className={cn("flex flex-wrap gap-4 justify-center mt-4", className)}>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2">
          <div
            className="w-3 h-3 rounded-sm"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-muted-foreground">{entry.value}</span>
        </div>
      ))}
    </div>
  );
};

// Enhanced axis tick formatter for currency values
export const createEnhancedAxisTickFormatter = (
  valueType: "currency" | "percentage" | "number" = "number",
  locale: SupportedLocale = "en",
  options?: {
    shortForm?: boolean;
    maxDecimals?: number;
  }
) => {
  return (value: any) => {
    if (valueType === "currency" && options?.shortForm) {
      // Format large numbers with K, M, B suffixes
      const numValue = parseFloat(value);
      if (numValue >= 1000000000) {
        return `${(numValue / 1000000000).toFixed(1)}B €`;
      } else if (numValue >= 1000000) {
        return `${(numValue / 1000000).toFixed(1)}M €`;
      } else if (numValue >= 1000) {
        return `${(numValue / 1000).toFixed(1)}K €`;
      }
    }
    
    return formatChartValue(value, valueType, locale);
  };
};

// Enhanced date axis tick formatter
export const createEnhancedDateTickFormatter = (
  formatType: "short" | "medium" | "long" = "short",
  locale: SupportedLocale = "en",
  options?: {
    showYear?: boolean;
    showWeekday?: boolean;
  }
) => {
  return (value: any) => {
    try {
      const date = new Date(value);
      if (isNaN(date.getTime())) {
        return value;
      }

      if (options?.showWeekday) {
        return formatChartDate(date, "long", locale);
      }

      if (options?.showYear) {
        return formatChartDate(date, "medium", locale);
      }

      return formatChartDate(date, formatType, locale);
    } catch (error) {
      return value;
    }
  };
};

// Responsive chart dimensions helper
export const getResponsiveChartConfig = (width: number) => {
  if (width < 640) {
    return {
      height: 250,
      margin: { top: 10, right: 10, left: 10, bottom: 20 },
      fontSize: 10,
      strokeWidth: 1,
    };
  } else if (width < 1024) {
    return {
      height: 300,
      margin: { top: 15, right: 15, left: 15, bottom: 25 },
      fontSize: 11,
      strokeWidth: 1.5,
    };
  } else {
    return {
      height: 400,
      margin: { top: 20, right: 20, left: 20, bottom: 30 },
      fontSize: 12,
      strokeWidth: 2,
    };
  }
};
