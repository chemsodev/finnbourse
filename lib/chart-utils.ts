import { format, parseISO, isValid, addDays, subDays } from "date-fns";
import { fr, ar, enUS } from "date-fns/locale";

export type SupportedLocale = "fr" | "ar" | "en";

// Enhanced date formatting utility for charts
export const getDateLocale = (locale: SupportedLocale = "en") => {
  switch (locale) {
    case "fr":
      return fr;
    case "ar":
      return ar;
    default:
      return enUS;
  }
};

// Enhanced chart date formatter with locale support
export const formatChartDate = (
  dateValue: string | Date | number,
  formatType: "short" | "medium" | "long" | "iso" = "short",
  locale: SupportedLocale = "en"
) => {
  try {
    let date: Date;

    if (typeof dateValue === "string") {
      date = parseISO(dateValue) || new Date(dateValue);
    } else if (typeof dateValue === "number") {
      date = new Date(dateValue);
    } else {
      date = dateValue;
    }

    if (!isValid(date)) {
      return "Invalid Date";
    }

    const dateLocale = getDateLocale(locale);

    switch (formatType) {
      case "short":
        return format(date, locale === "ar" ? "dd/MM" : "MMM dd", {
          locale: dateLocale,
        });
      case "medium":
        return format(date, locale === "ar" ? "dd/MM/yyyy" : "MMM dd, yyyy", {
          locale: dateLocale,
        });
      case "long":
        return format(date, locale === "ar" ? "dd/MM/yyyy" : "PPP", {
          locale: dateLocale,
        });
      case "iso":
        return format(date, "yyyy-MM-dd");
      default:
        return format(date, "MMM dd", { locale: dateLocale });
    }
  } catch (error) {
    console.error("Error formatting chart date:", error);
    return "Invalid Date";
  }
};

// Enhanced tooltip date formatter
export const formatTooltipDate = (
  dateValue: string | Date | number,
  locale: SupportedLocale = "en"
) => {
  return formatChartDate(dateValue, "long", locale);
};

// Chart axis tick formatter
export const createAxisTickFormatter = (
  formatType: "short" | "medium" = "short",
  locale: SupportedLocale = "en"
) => {
  return (value: any) => formatChartDate(value, formatType, locale);
};

// Generate date range for charts
export const generateDateRange = (
  startDate: Date | string,
  endDate: Date | string,
  stepDays: number = 1
): string[] => {
  const dates: string[] = [];
  const start = typeof startDate === "string" ? new Date(startDate) : startDate;
  const end = typeof endDate === "string" ? new Date(endDate) : endDate;

  if (!isValid(start) || !isValid(end)) {
    return [];
  }

  let current = start;
  while (current <= end) {
    dates.push(format(current, "yyyy-MM-dd"));
    current = addDays(current, stepDays);
  }

  return dates;
};

// Enhanced chart data processing with date normalization
export const normalizeChartData = (
  data: any[],
  dateKey: string = "date",
  fillMissingDates: boolean = false
) => {
  if (!Array.isArray(data) || data.length === 0) {
    return [];
  }

  // Sort data by date
  const sortedData = [...data].sort((a, b) => {
    const dateA = new Date(a[dateKey]);
    const dateB = new Date(b[dateKey]);
    return dateA.getTime() - dateB.getTime();
  });

  // Normalize date format
  const normalizedData = sortedData.map((item) => ({
    ...item,
    [dateKey]: format(new Date(item[dateKey]), "yyyy-MM-dd"),
  }));

  if (!fillMissingDates || normalizedData.length < 2) {
    return normalizedData;
  }

  // Fill missing dates with null values
  const firstDate = new Date(normalizedData[0][dateKey]);
  const lastDate = new Date(normalizedData[normalizedData.length - 1][dateKey]);
  const allDates = generateDateRange(firstDate, lastDate);

  const dataMap = new Map(normalizedData.map((item) => [item[dateKey], item]));

  return allDates.map((date) => {
    const existingData = dataMap.get(date);
    if (existingData) {
      return existingData;
    }

    // Create placeholder entry with null values for missing dates
    const placeholder: any = { [dateKey]: date };
    const sampleData = normalizedData[0];
    Object.keys(sampleData).forEach((key) => {
      if (key !== dateKey) {
        placeholder[key] = null;
      }
    });

    return placeholder;
  });
};

// Enhanced chart configuration with better defaults
export const createChartConfig = (
  dataKeys: string[],
  colors: string[] = [
    "hsl(var(--chart-1))",
    "hsl(var(--chart-2))",
    "hsl(var(--chart-3))",
    "hsl(var(--chart-4))",
    "hsl(var(--chart-5))",
  ]
) => {
  const config: any = {};

  dataKeys.forEach((key, index) => {
    config[key] = {
      label: key.charAt(0).toUpperCase() + key.slice(1),
      color: colors[index % colors.length],
    };
  });

  return config;
};

// Date range presets for chart filtering
export const getDateRangePresets = () => {
  const today = new Date();

  return {
    "7d": {
      label: "Last 7 days",
      start: subDays(today, 7),
      end: today,
    },
    "30d": {
      label: "Last 30 days",
      start: subDays(today, 30),
      end: today,
    },
    "90d": {
      label: "Last 90 days",
      start: subDays(today, 90),
      end: today,
    },
    "1y": {
      label: "Last year",
      start: subDays(today, 365),
      end: today,
    },
    all: {
      label: "All time",
      start: subDays(today, 1000), // Arbitrary large range
      end: today,
    },
  };
};

// Filter chart data by date range
export const filterDataByDateRange = (
  data: any[],
  startDate: Date | string,
  endDate: Date | string,
  dateKey: string = "date"
) => {
  const start = typeof startDate === "string" ? new Date(startDate) : startDate;
  const end = typeof endDate === "string" ? new Date(endDate) : endDate;

  return data.filter((item) => {
    const itemDate = new Date(item[dateKey]);
    return itemDate >= start && itemDate <= end;
  });
};

// Enhanced number formatting for chart values
export const formatChartValue = (
  value: number | string,
  type: "currency" | "percentage" | "number" = "number",
  locale: SupportedLocale = "en"
) => {
  const numValue = typeof value === "string" ? parseFloat(value) : value;

  if (isNaN(numValue)) {
    return "N/A";
  }

  const localeCode =
    locale === "ar" ? "ar-SA" : locale === "fr" ? "fr-FR" : "en-US";

  switch (type) {
    case "currency":
      return new Intl.NumberFormat(localeCode, {
        style: "currency",
        currency: "EUR",
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(numValue);
    case "percentage":
      return new Intl.NumberFormat(localeCode, {
        style: "percent",
        minimumFractionDigits: 1,
        maximumFractionDigits: 2,
      }).format(numValue / 100);
    case "number":
      return new Intl.NumberFormat(localeCode, {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      }).format(numValue);
    default:
      return numValue.toString();
  }
};

// Chart responsive breakpoints
export const getChartDimensions = (containerWidth: number) => {
  if (containerWidth < 640) {
    return {
      height: 250,
      margin: { top: 10, right: 10, left: 10, bottom: 20 },
    };
  } else if (containerWidth < 1024) {
    return {
      height: 300,
      margin: { top: 20, right: 20, left: 20, bottom: 30 },
    };
  } else {
    return {
      height: 400,
      margin: { top: 20, right: 30, left: 20, bottom: 40 },
    };
  }
};
