import { useState, useEffect, useMemo, useCallback } from "react";
import { useLocale } from "next-intl";
import { 
  Stock, 
  transformStockToChartData, 
  transformStocksForComparison,
  calculateStockPerformance,
  filterStocks,
  calculateMarketStats,
  type StockPrice 
} from "@/lib/stock-utils";
import { 
  filterDataByDateRange, 
  getDateRangePresets,
  type SupportedLocale 
} from "@/lib/chart-utils";

interface UseStockDataProps {
  stocks: Stock[];
  selectedStockIds?: string[];
  enableAutoRefresh?: boolean;
  refreshInterval?: number;
  onStockSelect?: (stock: Stock) => void;
  onDataChange?: (stocks: Stock[]) => void;
}

export const useStockData = ({
  stocks,
  selectedStockIds = [],
  enableAutoRefresh = false,
  refreshInterval = 30000,
  onStockSelect,
  onDataChange,
}: UseStockDataProps) => {
  const locale = useLocale() as SupportedLocale;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dateRange, setDateRange] = useState("30d");
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [filters, setFilters] = useState<{
    stockType?: string;
    marketListing?: string;
    activitySector?: string;
    minPrice?: number;
    maxPrice?: number;
    status?: string;
    votingRights?: boolean;
  }>({});

  const dateRangePresets = getDateRangePresets();

  // Initialize date range
  useEffect(() => {
    const range = dateRangePresets[dateRange as keyof typeof dateRangePresets];
    if (range) {
      setStartDate(range.start);
      setEndDate(range.end);
    }
  }, [dateRange, dateRangePresets]);

  // Auto-refresh functionality
  useEffect(() => {
    if (!enableAutoRefresh) return;

    const interval = setInterval(() => {
      if (onDataChange) {
        onDataChange(stocks);
      }
    }, refreshInterval);

    return () => clearInterval(interval);
  }, [enableAutoRefresh, refreshInterval, onDataChange, stocks]);

  // Filter stocks based on criteria
  const filteredStocks = useMemo(() => {
    try {
      return filterStocks(stocks, filters);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error filtering stocks");
      return stocks;
    }
  }, [stocks, filters]);

  // Selected stocks
  const selectedStocks = useMemo(() => {
    return filteredStocks.filter(stock => selectedStockIds.includes(stock.id));
  }, [filteredStocks, selectedStockIds]);

  // Chart data for comparison
  const comparisonData = useMemo(() => {
    if (selectedStocks.length === 0) return [];

    try {
      setLoading(true);
      const data = transformStocksForComparison(selectedStocks);
      
      // Filter by date range if specified
      let filteredData = data;
      if (startDate && endDate) {
        filteredData = filterDataByDateRange(data, startDate, endDate);
      }

      setLoading(false);
      return filteredData;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error processing comparison data");
      setLoading(false);
      return [];
    }
  }, [selectedStocks, startDate, endDate]);

  // Individual stock chart data
  const getStockChartData = useCallback((stockId: string) => {
    const stock = filteredStocks.find(s => s.id === stockId);
    if (!stock) return [];

    try {
      const data = transformStockToChartData(stock);
      
      // Filter by date range if specified
      if (startDate && endDate) {
        return filterDataByDateRange(data, startDate, endDate);
      }

      return data;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error processing stock data");
      return [];
    }
  }, [filteredStocks, startDate, endDate]);

  // Performance metrics for selected stocks
  const performanceMetrics = useMemo(() => {
    return selectedStocks.reduce((acc, stock) => {
      acc[stock.id] = calculateStockPerformance(stock);
      return acc;
    }, {} as { [key: string]: ReturnType<typeof calculateStockPerformance> });
  }, [selectedStocks]);

  // Market statistics
  const marketStats = useMemo(() => {
    return calculateMarketStats(filteredStocks);
  }, [filteredStocks]);

  // Available sectors
  const availableSectors = useMemo(() => {
    const sectors = new Set(stocks.map(stock => stock.issuer.activitySector));
    return Array.from(sectors);
  }, [stocks]);

  // Available market listings
  const availableMarketListings = useMemo(() => {
    const listings = new Set(stocks.map(stock => stock.marketListing));
    return Array.from(listings);
  }, [stocks]);

  // Stock types
  const availableStockTypes = useMemo(() => {
    const types = new Set(stocks.map(stock => stock.stockType));
    return Array.from(types);
  }, [stocks]);

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

  // Filter functions
  const applyFilter = useCallback((newFilters: typeof filters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  }, []);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, []);

  // Stock selection functions
  const selectStock = useCallback((stock: Stock) => {
    if (onStockSelect) {
      onStockSelect(stock);
    }
  }, [onStockSelect]);

  const getStockById = useCallback((id: string) => {
    return filteredStocks.find(stock => stock.id === id);
  }, [filteredStocks]);

  // Search function
  const searchStocks = useCallback((query: string) => {
    if (!query.trim()) return filteredStocks;

    const lowerQuery = query.toLowerCase();
    return filteredStocks.filter(stock => 
      stock.issuer.name.toLowerCase().includes(lowerQuery) ||
      stock.code.toLowerCase().includes(lowerQuery) ||
      stock.isinCode.toLowerCase().includes(lowerQuery) ||
      stock.issuer.activitySector.toLowerCase().includes(lowerQuery)
    );
  }, [filteredStocks]);

  // Sort function
  const sortStocks = useCallback((key: keyof Stock | "performance", direction: "asc" | "desc" = "asc") => {
    return [...filteredStocks].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      if (key === "performance") {
        aValue = calculateStockPerformance(a).changePercent;
        bValue = calculateStockPerformance(b).changePercent;
      } else {
        aValue = a[key];
        bValue = b[key];
      }

      // Handle nested objects
      if (typeof aValue === "object" && aValue !== null) {
        aValue = JSON.stringify(aValue);
        bValue = JSON.stringify(bValue);
      }

      if (typeof aValue === "string" && typeof bValue === "string") {
        return direction === "asc" 
          ? aValue.localeCompare(bValue) 
          : bValue.localeCompare(aValue);
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        return direction === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });
  }, [filteredStocks]);

  // Export data
  const exportData = useCallback((format: "json" | "csv" = "json") => {
    const data = selectedStocks.length > 0 ? selectedStocks : filteredStocks;
    
    if (format === "json") {
      return JSON.stringify(data, null, 2);
    }

    // CSV format
    const headers = [
      "ID", "Name", "Code", "ISIN", "Sector", "Type", "Market", "Price", 
      "Face Value", "Quantity", "Dividend Rate", "Status", "Change %"
    ];
    
    const rows = data.map(stock => {
      const performance = calculateStockPerformance(stock);
      return [
        stock.id,
        stock.issuer.name,
        stock.code,
        stock.isinCode,
        stock.issuer.activitySector,
        stock.stockType,
        stock.marketListing,
        stock.price,
        stock.faceValue,
        stock.quantity,
        stock.dividendRate,
        stock.status,
        performance.changePercent.toFixed(2)
      ];
    });

    return [headers, ...rows].map(row => row.join(",")).join("\n");
  }, [selectedStocks, filteredStocks]);

  return {
    // Data
    stocks: filteredStocks,
    originalStocks: stocks,
    selectedStocks,
    comparisonData,
    
    // State
    loading,
    error,
    
    // Filters
    filters,
    dateRange,
    startDate,
    endDate,
    dateRangePresets,
    
    // Computed data
    performanceMetrics,
    marketStats,
    availableSectors,
    availableMarketListings,
    availableStockTypes,
    
    // Actions
    applyFilter,
    clearFilters,
    setDateRange,
    setStartDate,
    setEndDate,
    applyDateRangePreset,
    selectStock,
    getStockById,
    getStockChartData,
    searchStocks,
    sortStocks,
    exportData,
    
    // Utility
    locale,
  };
};

// Hook for managing stock price updates
export const useStockPriceUpdates = (stockId: string, enableRealtime: boolean = false) => {
  const [prices, setPrices] = useState<StockPrice[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const addPriceUpdate = useCallback((newPrice: StockPrice) => {
    setPrices(prev => {
      const updated = [...prev, newPrice];
      return updated.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    });
  }, []);

  const updatePrice = useCallback((priceId: string, updatedPrice: Partial<StockPrice>) => {
    setPrices(prev => prev.map(price => 
      price.id === priceId ? { ...price, ...updatedPrice } : price
    ));
  }, []);

  const removePrice = useCallback((priceId: string) => {
    setPrices(prev => prev.filter(price => price.id !== priceId));
  }, []);

  const clearPrices = useCallback(() => {
    setPrices([]);
  }, []);

  // Latest price
  const latestPrice = useMemo(() => {
    if (prices.length === 0) return null;
    return prices[prices.length - 1];
  }, [prices]);

  // Price change
  const priceChange = useMemo(() => {
    if (prices.length < 2) return { change: 0, changePercent: 0 };
    
    const latest = prices[prices.length - 1];
    const previous = prices[prices.length - 2];
    const change = latest.price - previous.price;
    const changePercent = previous.price !== 0 ? (change / previous.price) * 100 : 0;

    return { change, changePercent };
  }, [prices]);

  return {
    prices,
    latestPrice,
    priceChange,
    loading,
    error,
    addPriceUpdate,
    updatePrice,
    removePrice,
    clearPrices,
    setLoading,
    setError,
  };
};
