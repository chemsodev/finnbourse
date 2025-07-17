import { useState, useEffect, useMemo, useCallback } from "react";
import { useLocale } from "next-intl";
import {
  filterDataByDateRange,
  getDateRangePresets,
  normalizeChartData,
  type SupportedLocale,
} from "@/lib/chart-utils";

interface ChartDataPoint {
  [key: string]: any;
  date?: string;
}

interface UseChartDataProps {
  data: ChartDataPoint[];
  dateKey?: string;
  initialDateRange?: string;
  enableAutoRefresh?: boolean;
  refreshInterval?: number;
  onDataChange?: (data: ChartDataPoint[]) => void;
}

export const useChartData = ({
  data,
  dateKey = "date",
  initialDateRange = "30d",
  enableAutoRefresh = false,
  refreshInterval = 30000,
  onDataChange,
}: UseChartDataProps) => {
  const locale = useLocale() as SupportedLocale;
  const [dateRange, setDateRange] = useState(initialDateRange);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const dateRangePresets = getDateRangePresets();

  // Initialize date range
  useEffect(() => {
    if (initialDateRange !== "custom") {
      const range = dateRangePresets[initialDateRange as keyof typeof dateRangePresets];
      if (range) {
        setStartDate(range.start);
        setEndDate(range.end);
      }
    }
  }, [initialDateRange, dateRangePresets]);

  // Auto-refresh functionality
  useEffect(() => {
    if (!enableAutoRefresh) return;

    const interval = setInterval(() => {
      // Trigger data refresh
      if (onDataChange) {
        onDataChange(data);
      }
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [enableAutoRefresh, refreshInterval, onDataChange, data]);

  // Process and filter data
  const processedData = useMemo(() => {
    try {
      setLoading(true);
      setError(null);

      let processedData = [...data];

      // Filter by date range if specified
      if (startDate && endDate) {
        processedData = filterDataByDateRange(processedData, startDate, endDate, dateKey);
      }

      // Normalize data
      const normalizedData = normalizeChartData(processedData, dateKey);

      setLoading(false);
      return normalizedData;
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setLoading(false);
      return [];
    }
  }, [data, startDate, endDate, dateKey]);

  // Apply date range preset
  const applyDateRangePreset = useCallback((preset: string) => {
    setDateRange(preset);
    if (preset !== "custom") {
      const range = dateRangePresets[preset as keyof typeof dateRangePresets];
      if (range) {
        setStartDate(range.start);
        setEndDate(range.end);
      }
    }
  }, [dateRangePresets]);

  // Reset to default state
  const resetChart = useCallback(() => {
    setDateRange(initialDateRange);
    setError(null);
    applyDateRangePreset(initialDateRange);
  }, [initialDateRange, applyDateRangePreset]);

  // Calculate basic statistics
  const statistics = useMemo(() => {
    if (processedData.length === 0) return null;

    const numericKeys = Object.keys(processedData[0]).filter(
      (key) => key !== dateKey && typeof processedData[0][key] === "number"
    );

    const stats: { [key: string]: any } = {};

    numericKeys.forEach((key) => {
      const values = processedData
        .map((item) => item[key])
        .filter((value) => typeof value === "number" && !isNaN(value));

      if (values.length > 0) {
        const sorted = [...values].sort((a, b) => a - b);
        stats[key] = {
          min: Math.min(...values),
          max: Math.max(...values),
          avg: values.reduce((sum, val) => sum + val, 0) / values.length,
          median: sorted[Math.floor(sorted.length / 2)],
          count: values.length,
          change: values.length > 1 ? values[values.length - 1] - values[0] : 0,
          changePercent: values.length > 1 && values[0] !== 0 
            ? ((values[values.length - 1] - values[0]) / values[0]) * 100 
            : 0,
        };
      }
    });

    return stats;
  }, [processedData, dateKey]);

  return {
    // Data
    data: processedData,
    originalData: data,
    
    // State
    loading,
    error,
    
    // Date range
    dateRange,
    startDate,
    endDate,
    dateRangePresets,
    
    // Actions
    setDateRange,
    setStartDate,
    setEndDate,
    applyDateRangePreset,
    resetChart,
    
    // Statistics
    statistics,
    
    // Utility
    locale,
  };
};

// Hook for managing chart zoom and pan functionality
export const useChartZoom = (data: ChartDataPoint[], dateKey: string = "date") => {
  const [zoomDomain, setZoomDomain] = useState<[number, number] | null>(null);
  const [panOffset, setPanOffset] = useState(0);

  const zoomedData = useMemo(() => {
    if (!zoomDomain || zoomDomain[0] === zoomDomain[1]) return data;

    const startIndex = Math.max(0, Math.floor(zoomDomain[0]));
    const endIndex = Math.min(data.length - 1, Math.ceil(zoomDomain[1]));

    return data.slice(startIndex, endIndex + 1);
  }, [data, zoomDomain]);

  const zoomIn = useCallback(() => {
    if (!zoomDomain) {
      const start = Math.floor(data.length * 0.25);
      const end = Math.floor(data.length * 0.75);
      setZoomDomain([start, end]);
    } else {
      const range = zoomDomain[1] - zoomDomain[0];
      const newRange = Math.max(1, range * 0.5);
      const center = (zoomDomain[0] + zoomDomain[1]) / 2;
      setZoomDomain([center - newRange / 2, center + newRange / 2]);
    }
  }, [data.length, zoomDomain]);

  const zoomOut = useCallback(() => {
    if (!zoomDomain) return;

    const range = zoomDomain[1] - zoomDomain[0];
    const newRange = Math.min(data.length - 1, range * 2);
    const center = (zoomDomain[0] + zoomDomain[1]) / 2;
    
    let newStart = center - newRange / 2;
    let newEnd = center + newRange / 2;

    if (newStart < 0) {
      newStart = 0;
      newEnd = newRange;
    }
    if (newEnd >= data.length) {
      newEnd = data.length - 1;
      newStart = newEnd - newRange;
    }

    if (newStart <= 0 && newEnd >= data.length - 1) {
      setZoomDomain(null);
    } else {
      setZoomDomain([newStart, newEnd]);
    }
  }, [data.length, zoomDomain]);

  const resetZoom = useCallback(() => {
    setZoomDomain(null);
    setPanOffset(0);
  }, []);

  const pan = useCallback((direction: "left" | "right") => {
    if (!zoomDomain) return;

    const range = zoomDomain[1] - zoomDomain[0];
    const step = range * 0.1;
    const newOffset = direction === "left" ? -step : step;

    let newStart = zoomDomain[0] + newOffset;
    let newEnd = zoomDomain[1] + newOffset;

    if (newStart < 0) {
      newStart = 0;
      newEnd = range;
    }
    if (newEnd >= data.length) {
      newEnd = data.length - 1;
      newStart = newEnd - range;
    }

    setZoomDomain([newStart, newEnd]);
    setPanOffset(panOffset + newOffset);
  }, [zoomDomain, data.length, panOffset]);

  return {
    zoomedData,
    zoomDomain,
    panOffset,
    zoomIn,
    zoomOut,
    resetZoom,
    pan,
    isZoomed: zoomDomain !== null,
  };
};

// Hook for managing chart animations
export const useChartAnimations = () => {
  const [animationEnabled, setAnimationEnabled] = useState(true);
  const [animationDuration, setAnimationDuration] = useState(1000);
  const [animationEasing, setAnimationEasing] = useState<"ease" | "ease-in" | "ease-out" | "ease-in-out" | "linear">("ease-out");

  const animationConfig = useMemo(() => ({
    animationBegin: 0,
    animationDuration: animationEnabled ? animationDuration : 0,
    animationEasing,
  }), [animationEnabled, animationDuration, animationEasing]);

  return {
    animationEnabled,
    animationDuration,
    animationEasing,
    animationConfig,
    setAnimationEnabled,
    setAnimationDuration,
    setAnimationEasing,
  };
};
