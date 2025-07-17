import React, { useState, useMemo, useCallback } from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
} from "recharts";
import {
  Search,
  Filter,
  Download,
  TrendingUp,
  TrendingDown,
  Activity,
  DollarSign,
  BarChart3,
  Calendar,
  Eye,
  Settings,
  RefreshCw,
  Star,
  StarOff,
} from "lucide-react";

import { useStockData } from "@/hooks/useStockData";
import { Stock } from "@/lib/stock-utils";
import {
  formatChartDate,
  formatChartValue,
  type SupportedLocale,
} from "@/lib/chart-utils";

interface StockPortfolioProps {
  stocks: Stock[];
  initialSelectedStocks?: string[];
  onStockSelect?: (stock: Stock) => void;
  showComparison?: boolean;
  enableRealtime?: boolean;
}

export const StockPortfolio: React.FC<StockPortfolioProps> = ({
  stocks,
  initialSelectedStocks = [],
  onStockSelect,
  showComparison = true,
  enableRealtime = false,
}) => {
  const t = useTranslations("portfolio");
  const locale = useLocale() as SupportedLocale;

  const [selectedStockIds, setSelectedStockIds] = useState<string[]>(
    initialSelectedStocks
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "price" | "performance">(
    "name"
  );
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [activeTab, setActiveTab] = useState("overview");
  const [showFilters, setShowFilters] = useState(false);
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [viewType, setViewType] = useState<"grid" | "list">("grid");

  const {
    stocks: filteredStocks,
    selectedStocks,
    comparisonData,
    loading,
    error,
    filters,
    dateRange,
    performanceMetrics,
    marketStats,
    availableSectors,
    availableMarketListings,
    availableStockTypes,
    applyFilter,
    clearFilters,
    applyDateRangePreset,
    searchStocks,
    sortStocks,
    exportData,
    getStockChartData,
  } = useStockData({
    stocks,
    selectedStockIds,
    enableAutoRefresh: enableRealtime,
    onStockSelect,
  });

  // Search filtered stocks
  const searchedStocks = useMemo(() => {
    if (!searchQuery.trim()) return filteredStocks;
    return searchStocks(searchQuery);
  }, [filteredStocks, searchQuery, searchStocks]);

  // Sorted stocks
  const sortedStocks = useMemo(() => {
    return sortStocks(sortBy as any, sortDirection);
  }, [sortStocks, sortBy, sortDirection]);

  // Handle stock selection
  const handleStockSelect = useCallback(
    (stock: Stock) => {
      setSelectedStockIds((prev) => {
        const isSelected = prev.includes(stock.id);
        const newSelection = isSelected
          ? prev.filter((id) => id !== stock.id)
          : [...prev, stock.id];

        return newSelection;
      });

      if (onStockSelect) {
        onStockSelect(stock);
      }
    },
    [onStockSelect]
  );

  // Toggle favorite
  const toggleFavorite = useCallback((stockId: string) => {
    setFavorites((prev) => {
      const newFavorites = new Set(prev);
      if (newFavorites.has(stockId)) {
        newFavorites.delete(stockId);
      } else {
        newFavorites.add(stockId);
      }
      return newFavorites;
    });
  }, []);

  // Export functionality
  const handleExport = useCallback(
    (format: "json" | "csv") => {
      const data = exportData(format);
      const blob = new Blob([data], {
        type: format === "json" ? "application/json" : "text/csv",
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `stocks-${new Date().toISOString().split("T")[0]}.${format}`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    },
    [exportData]
  );

  // Custom tooltip for charts
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-3 border rounded shadow-lg">
          <p className="font-medium">
            {formatChartDate(label, "medium", locale)}
          </p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.dataKey}: {formatChartValue(entry.value, "currency")}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  // Performance badge component
  const PerformanceBadge = ({ stockId }: { stockId: string }) => {
    const performance = performanceMetrics[stockId];
    if (!performance) return null;

    const isPositive = performance.changePercent >= 0;
    return (
      <Badge
        variant={isPositive ? "default" : "destructive"}
        className="flex items-center gap-1"
      >
        {isPositive ? (
          <TrendingUp className="h-3 w-3" />
        ) : (
          <TrendingDown className="h-3 w-3" />
        )}
        {performance.changePercent.toFixed(2)}%
      </Badge>
    );
  };

  // Stock card component
  const StockCard = ({ stock }: { stock: Stock }) => {
    const isSelected = selectedStockIds.includes(stock.id);
    const isFavorite = favorites.has(stock.id);
    const performance = performanceMetrics[stock.id];

    return (
      <Card
        className={`cursor-pointer transition-all hover:shadow-md ${
          isSelected ? "ring-2 ring-blue-500" : ""
        }`}
        onClick={() => handleStockSelect(stock)}
      >
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex-1 min-w-0">
              <CardTitle className="text-lg truncate">
                {stock.issuer.name}
              </CardTitle>
              <CardDescription className="text-sm text-gray-600">
                {stock.code} • {stock.isinCode}
              </CardDescription>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                toggleFavorite(stock.id);
              }}
            >
              {isFavorite ? (
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              ) : (
                <StarOff className="h-4 w-4" />
              )}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-2xl font-bold">
                {formatChartValue(stock.price, "currency")}
              </span>
              <PerformanceBadge stockId={stock.id} />
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-500">{t("sector")}</span>
                <p className="font-medium truncate">
                  {stock.issuer.activitySector}
                </p>
              </div>
              <div>
                <span className="text-gray-500">{t("market")}</span>
                <p className="font-medium">{stock.marketListing}</p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-sm">
              <div>
                <span className="text-gray-500">{t("quantity")}</span>
                <p className="font-medium">{stock.quantity.toLocaleString()}</p>
              </div>
              <div>
                <span className="text-gray-500">{t("dividend")}</span>
                <p className="font-medium">{stock.dividendRate}%</p>
              </div>
            </div>

            <Badge variant="secondary" className="w-fit">
              {stock.status}
            </Badge>
          </div>
        </CardContent>
      </Card>
    );
  };

  // Filters component
  const FiltersPanel = () => (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-lg">{t("filters")}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="text-sm font-medium mb-1 block">
              {t("sector")}
            </label>
            <Select
              value={filters.activitySector || ""}
              onValueChange={(value) =>
                applyFilter({ activitySector: value || undefined })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={t("allSectors")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t("allSectors")}</SelectItem>
                {availableSectors.map((sector) => (
                  <SelectItem key={sector} value={sector}>
                    {sector}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">
              {t("market")}
            </label>
            <Select
              value={filters.marketListing || ""}
              onValueChange={(value) =>
                applyFilter({ marketListing: value || undefined })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={t("allMarkets")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t("allMarkets")}</SelectItem>
                {availableMarketListings.map((market) => (
                  <SelectItem key={market} value={market}>
                    {market}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">
              {t("stockType")}
            </label>
            <Select
              value={filters.stockType || ""}
              onValueChange={(value) =>
                applyFilter({ stockType: value || undefined })
              }
            >
              <SelectTrigger>
                <SelectValue placeholder={t("allTypes")} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">{t("allTypes")}</SelectItem>
                {availableStockTypes.map((type) => (
                  <SelectItem key={type} value={type}>
                    {type}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <Button variant="outline" onClick={clearFilters}>
            {t("clearFilters")}
          </Button>
          <Button variant="outline" onClick={() => setShowFilters(false)}>
            {t("close")}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">{t("portfolio")}</h2>
          <p className="text-gray-600">
            {t("totalStocks", { count: filteredStocks.length })}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            {t("filters")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport("csv")}
          >
            <Download className="h-4 w-4 mr-2" />
            {t("exportCSV")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleExport("json")}
          >
            <Download className="h-4 w-4 mr-2" />
            {t("exportJSON")}
          </Button>
        </div>
      </div>

      {/* Search and controls */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder={t("searchStocks")}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">{t("sortByName")}</SelectItem>
            <SelectItem value="price">{t("sortByPrice")}</SelectItem>
            <SelectItem value="performance">
              {t("sortByPerformance")}
            </SelectItem>
          </SelectContent>
        </Select>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            setSortDirection(sortDirection === "asc" ? "desc" : "asc")
          }
        >
          {sortDirection === "asc" ? "↑" : "↓"}
        </Button>
      </div>

      {/* Filters panel */}
      {showFilters && <FiltersPanel />}

      {/* Market stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t("totalValue")}</p>
                <p className="text-2xl font-bold">
                  {formatChartValue(
                    marketStats?.totalMarketCap || 0,
                    "currency"
                  )}
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t("averagePrice")}</p>
                <p className="text-2xl font-bold">
                  {formatChartValue(marketStats?.avgPrice || 0, "currency")}
                </p>
              </div>
              <BarChart3 className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t("topPerformer")}</p>
                <p className="text-lg font-bold text-green-600">
                  +{marketStats?.highestPrice || 0}
                </p>
              </div>
              <TrendingUp className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">{t("worstPerformer")}</p>
                <p className="text-lg font-bold text-red-600">
                  {marketStats?.lowestPrice || 0}
                </p>
              </div>
              <TrendingDown className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Main content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">{t("overview")}</TabsTrigger>
          <TabsTrigger value="comparison">{t("comparison")}</TabsTrigger>
          <TabsTrigger value="table">{t("table")}</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {searchedStocks.map((stock) => (
              <StockCard key={stock.id} stock={stock} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="comparison" className="space-y-4">
          {selectedStocks.length > 0 ? (
            <Card>
              <CardHeader>
                <CardTitle>{t("stockComparison")}</CardTitle>
                <CardDescription>
                  {t("comparingStocks", { count: selectedStocks.length })}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={comparisonData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={(value) =>
                          formatChartDate(value, "short", locale)
                        }
                      />
                      <YAxis
                        tickFormatter={(value) =>
                          formatChartValue(value, "currency")
                        }
                      />
                      <Tooltip content={<CustomTooltip />} />
                      {selectedStocks.map((stock, index) => (
                        <Line
                          key={stock.id}
                          type="monotone"
                          dataKey={stock.code}
                          stroke={`hsl(${index * 60}, 70%, 50%)`}
                          strokeWidth={2}
                          dot={false}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-lg font-medium">{t("noStocksSelected")}</p>
                <p className="text-gray-600">{t("selectStocksToCompare")}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="table" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>{t("stockTable")}</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("name")}</TableHead>
                    <TableHead>{t("code")}</TableHead>
                    <TableHead>{t("price")}</TableHead>
                    <TableHead>{t("change")}</TableHead>
                    <TableHead>{t("sector")}</TableHead>
                    <TableHead>{t("market")}</TableHead>
                    <TableHead>{t("actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {searchedStocks.map((stock) => (
                    <TableRow key={stock.id}>
                      <TableCell className="font-medium">
                        {stock.issuer.name}
                      </TableCell>
                      <TableCell>{stock.code}</TableCell>
                      <TableCell>
                        {formatChartValue(stock.price, "currency")}
                      </TableCell>
                      <TableCell>
                        <PerformanceBadge stockId={stock.id} />
                      </TableCell>
                      <TableCell>{stock.issuer.activitySector}</TableCell>
                      <TableCell>{stock.marketListing}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleStockSelect(stock)}
                          >
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleFavorite(stock.id)}
                          >
                            {favorites.has(stock.id) ? (
                              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                            ) : (
                              <StarOff className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Loading and error states */}
      {loading && (
        <div className="flex items-center justify-center p-8">
          <RefreshCw className="h-8 w-8 animate-spin text-blue-500" />
        </div>
      )}

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
