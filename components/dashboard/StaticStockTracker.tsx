"use client";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { useLocale, useTranslations } from "next-intl";
import { format } from "date-fns";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRestToken } from "@/hooks/useRestToken";
import {
  useEffect,
  useState,
  useMemo,
  useCallback,
  useRef,
  useLayoutEffect,
} from "react";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "../ui/separator";
import { fr, ar, enUS } from "date-fns/locale";
import { Calendar } from "../ui/calendar";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CarnetOrdre from "./CarnetOrdre";

// Interface for the API response
interface StockPrice {
  id: string;
  stock: string;
  price: number;
  gap: number;
  date: string;
  createdAt: string;
  updatedAt: string;
}

interface Issuer {
  id: string;
  name: string;
  website: string;
  activitySector: string;
  createdAt: string;
  updatedAt: string;
  capital: string;
  email: string;
  address: string;
  tel: string;
}

interface ApiStock {
  id: string;
  name: string | null;
  stockType: string;
  isPrimary: boolean;
  createdAt: string;
  updatedAt: string;
  issuer: Issuer;
  isinCode: string;
  code: string;
  faceValue: number;
  quantity: number;
  emissionDate: string;
  closingDate: string;
  enjoymentDate: string;
  maturityDate: string | null;
  marketListing: string;
  status: string;
  dividendRate: number;
  yieldRate: number | null;
  fixedRate: number | null;
  estimatedRate: number | null;
  variableRate: number | null;
  price: number;
  capitalOperation: string;
  shareClass: string | null;
  votingRights: boolean;
  stockPrices: StockPrice[];
}

// Transform API data to match the expected format
const transformApiDataToStock = (apiStock: ApiStock) => {
  // If no stock prices, generate a single data point with current price
  let priceData = apiStock.stockPrices || [];

  if (priceData.length === 0) {
    // Create a single data point with current price if no historical data
    priceData = [
      {
        id: "current",
        stock: apiStock.id,
        price: apiStock.price,
        gap: 0,
        date: new Date().toISOString(),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ];
  }

  // Create a display name with stock type
  const displayName = apiStock.name || apiStock.issuer.name;
  const stockTypeLabel =
    apiStock.stockType === "action" ? "Action" : "Obligation";

  return {
    id: apiStock.id,
    issuer: apiStock.issuer.name,
    code: apiStock.code,
    name: `${displayName} (${stockTypeLabel})`,
    stockType: apiStock.stockType,
    facevalue: apiStock.faceValue,
    marketmetadata: {
      cours: priceData
        .map((price) => ({
          date: price.date,
          price: price.price,
        }))
        .sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        ),
    },
  };
};

const formSchema = z.object({
  firstAction: z.string().optional(),
  secondAction: z.string().optional(),
  fromDate: z.date().optional(),
  toDate: z.date().optional(),
});

export function StaticStockTracker() {
  const t = useTranslations("DashLineChart");
  const locale = useLocale();
  const {
    restToken,
    isLoading: isTokenLoading,
    isAuthenticated,
    hasRestToken,
  } = useRestToken();
  const [loading, setLoading] = useState(false);
  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();
  const [availableStocks, setAvailableStocks] = useState<any[]>([]);
  const [stockOne, setStockOne] = useState<any>(null);
  const [stockTwo, setStockTwo] = useState<any>(null);
  const [stockOneData, setStockOneData] = useState<any[]>([]);
  const [stockTwoData, setStockTwoData] = useState<any[]>([]);
  const [compareMode, setCompareMode] = useState(true);
  const [view, setView] = useState<"graphe comparatif" | "carnet">(
    "graphe comparatif"
  );
  const [graphHeight, setGraphHeight] = useState<number | undefined>(undefined);
  const formCardContentRef = useRef<HTMLDivElement>(null);

  // Fetch available stocks from API
  const fetchAvailableStocks = useCallback(async () => {
    setLoading(true);
    try {
      const baseUrl =
        process.env.NEXT_PUBLIC_BACKEND_URL || "http://localhost:3001";

      const headers: HeadersInit = {
        "Content-Type": "application/json",
      };

      // Add authorization token if available
      if (restToken) {
        headers.Authorization = `Bearer ${restToken}`;
        console.log(
          "🔑 Using token:",
          restToken ? "Token available" : "No token"
        );
      } else {
        console.warn("⚠️ No authentication token available");
      }

      console.log("📡 Making API calls to:", baseUrl);

      try {
        // Fetch actions (stocks)
        const actionsResponse = await fetch(`${baseUrl}/api/v1/stock/filter`, {
          method: "POST",
          headers,
          body: JSON.stringify({
            marketType: "secondaire",
            stockType: "action",
          }),
        });

        console.log("📊 Actions response status:", actionsResponse.status);

        if (!actionsResponse.ok) {
          console.error("❌ Actions API error:", {
            status: actionsResponse.status,
            statusText: actionsResponse.statusText,
            headers: Object.fromEntries(actionsResponse.headers.entries()),
          });
        }

        // Fetch obligations (bonds)
        const obligationsResponse = await fetch(
          `${baseUrl}/api/v1/stock/filter`,
          {
            method: "POST",
            headers,
            body: JSON.stringify({
              marketType: "secondaire",
              stockType: "obligation",
            }),
          }
        );

        console.log(
          "📊 Obligations response status:",
          obligationsResponse.status
        );

        if (!obligationsResponse.ok) {
          console.error("❌ Obligations API error:", {
            status: obligationsResponse.status,
            statusText: obligationsResponse.statusText,
            headers: Object.fromEntries(obligationsResponse.headers.entries()),
          });
        }

        if (!actionsResponse.ok || !obligationsResponse.ok) {
          throw new Error(
            `HTTP error! Actions: ${actionsResponse.status}, Obligations: ${obligationsResponse.status}`
          );
        }

        const actionsData: ApiStock[] = await actionsResponse.json();
        const obligationsData: ApiStock[] = await obligationsResponse.json();

        console.log("📊 Fetched actions from API:", actionsData);
        console.log("📊 Fetched obligations from API:", obligationsData);

        // Combine both types of stocks
        const allApiStocks = [...actionsData, ...obligationsData];
        console.log("📊 Combined stocks:", allApiStocks);

        // Transform API data to component format
        const transformedStocks = allApiStocks.map(transformApiDataToStock);
        console.log("📊 Transformed stocks:", transformedStocks);

        setAvailableStocks(transformedStocks);

        // Set default stocks if available
        if (transformedStocks.length > 0) {
          const defaultStock = transformedStocks[0];
          setStockOne(defaultStock);
          setStockOneData(defaultStock.marketmetadata.cours);

          if (transformedStocks.length > 1) {
            const secondStock = transformedStocks[1];
            setStockTwo(secondStock);
            setStockTwoData(secondStock.marketmetadata.cours);
          } else {
            // If only one stock, set it as both for comparison
            setStockTwo(defaultStock);
            setStockTwoData(defaultStock.marketmetadata.cours);
          }
        } else {
          // No stocks available
          setStockOne(null);
          setStockTwo(null);
          setStockOneData([]);
          setStockTwoData([]);
        }
      } catch (apiError) {
        console.error("❌ API call failed:", apiError);
        throw apiError;
      }
    } catch (error) {
      console.error("Error fetching stocks:", error);
      // Fallback to empty array if API fails
      setAvailableStocks([]);
      setStockOne(null);
      setStockTwo(null);
      setStockOneData([]);
      setStockTwoData([]);
    } finally {
      setLoading(false);
    }
  }, [restToken]);

  // Fetch stocks on component mount - but only when authenticated and token is available
  useEffect(() => {
    // Don't make API calls until we're authenticated and have a REST token
    if (isAuthenticated && hasRestToken && !isTokenLoading) {
      console.log("🚀 Authentication ready, fetching stocks...");
      fetchAvailableStocks();
    } else {
      console.log(
        `⏳ Waiting for authentication: authenticated=${isAuthenticated}, hasToken=${hasRestToken}, loading=${isTokenLoading}`
      );
    }
  }, [fetchAvailableStocks, isAuthenticated, hasRestToken, isTokenLoading]);

  useLayoutEffect(() => {
    if (formCardContentRef.current) {
      setGraphHeight(formCardContentRef.current.offsetHeight);
    }
  }, [view, stockOne, stockTwo, fromDate, toDate]);

  const mergeData = useCallback((data1: any[], data2: any[]) => {
    const dateMap = new Map();
    data1?.forEach((item) =>
      dateMap.set(item.date, {
        ...dateMap.get(item.date),
        date: item.date,
        stockOne: item.price,
      })
    );
    data2.forEach((item) =>
      dateMap.set(item.date, {
        ...dateMap.get(item.date),
        date: item.date,
        stockTwo: item.price,
      })
    );
    return Array.from(dateMap.values());
  }, []);

  const fetchTwoStocks = useCallback(
    async (idOne: string, idTwo: string) => {
      setLoading(true);
      try {
        const stock1 = availableStocks.find((s: any) => s.id === idOne);
        const stock2 = availableStocks.find((s: any) => s.id === idTwo);

        if (stock1) {
          setStockOne(stock1);
          setStockOneData(stock1.marketmetadata.cours || []);
        }

        if (stock2) {
          setStockTwo(stock2);
          setStockTwoData(stock2.marketmetadata.cours || []);
        } else if (stock1) {
          // If no second stock found, use the first stock for both
          setStockTwo(stock1);
          setStockTwoData(stock1.marketmetadata.cours || []);
        }
      } catch (error) {
        console.error("Error fetching stock data:", error);
      } finally {
        setLoading(false);
      }
    },
    [availableStocks]
  );

  function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      if (values.firstAction) {
        if (values.secondAction && values.secondAction !== values.firstAction) {
          fetchTwoStocks(values.firstAction, values.secondAction);
          setCompareMode(true);
        } else {
          // Fetch only one stock
          fetchTwoStocks(values.firstAction, values.firstAction);
          setCompareMode(false);
        }
      }
      if (values.fromDate && values.toDate) {
        setFromDate(values.fromDate);
        setToDate(values.toDate);
      }
    } catch (error) {
      console.error("Form submission error", error);
    } finally {
      setLoading(false);
    }
  }

  // Add a refresh function to refetch data
  const refreshStocks = useCallback(() => {
    fetchAvailableStocks();
  }, [fetchAvailableStocks]);

  const mergedData = useMemo(() => {
    if (!stockOneData) return [];

    let data;
    if (compareMode && stockTwoData && stockTwoData.length > 0) {
      data = mergeData(stockOneData, stockTwoData).sort(
        (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    } else {
      // For single stock view, create data with only stockOne
      data = stockOneData
        .map((item) => ({
          date: item.date,
          stockOne: item.price,
        }))
        .sort(
          (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
        );
    }

    if (fromDate && toDate) {
      data = data.filter((item) => {
        const itemDate = new Date(item.date);
        const from = fromDate ? new Date(fromDate) : null;
        const to = toDate ? new Date(toDate) : null;

        if (from && itemDate < from) {
          return false;
        }
        if (to && itemDate > to) {
          return false;
        }
        return true;
      });
    }
    return data;
  }, [stockOneData, stockTwoData, fromDate, toDate, mergeData, compareMode]);

  const chartConfig = {
    stockOne: {
      label: stockOne ? stockOne.name || stockOne.code : "Stock One",
      color: "hsl(var(--chart-3))",
    },
    stockTwo: {
      label: stockTwo ? stockTwo.name || stockTwo.code : "Stock Two",
      color: "hsl(var(--chart-1))",
    },
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  // Show loading state while waiting for authentication
  if (isTokenLoading || !isAuthenticated || !hasRestToken) {
    return (
      <div className="w-full space-y-6">
        <div className="flex items-center justify-center p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-sm text-gray-600">
              {isTokenLoading
                ? "Loading authentication..."
                : !isAuthenticated
                ? "Please log in to continue..."
                : "Preparing data connection..."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-6">
      {/* Switch Buttons */}
      <div className="inline-flex shadow border border-gray-200">
        <button
          className={`px-4 py-1 text-[0.8vw] font-medium focus:z-10 ${
            view === "graphe comparatif"
              ? "bg-primary text-white"
              : "bg-gray-200 text-gray-700"
          } rounded-l`}
          onClick={() => setView("graphe comparatif")}
        >
          {t("grapheComparatif")}
        </button>
        <button
          className={`px-4 py-1 text-[0.8vw] font-medium focus:z-10 ${
            view === "carnet"
              ? "bg-primary text-white"
              : "bg-gray-200 text-gray-700"
          } rounded-r`}
          onClick={() => setView("carnet")}
        >
          {t("carnetOrdre")}
        </button>
      </div>

      {view === "graphe comparatif" ? (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Chart Section - Takes 60% of the space */}
          <div className="lg:col-span-3">
            <Card className="h-full flex flex-col flex-1">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  {t("grapheComparatif")}
                </CardTitle>
              </CardHeader>
              <CardContent
                className="flex-1 flex flex-col"
                style={graphHeight ? { height: graphHeight } : {}}
              >
                {!stockOneData ||
                !stockTwoData ||
                availableStocks.length === 0 ? (
                  <div className="h-60 border rounded-md flex justify-center text-center items-center shadow-inner">
                    {loading ? "Loading stocks..." : t("noData")}
                  </div>
                ) : (
                  <div className="pr-2 pt-4 sm:pr-6 sm:pt-6 animate-fade-in h-full">
                    <ChartContainer
                      config={chartConfig}
                      className="aspect-auto h-full w-full"
                    >
                      <AreaChart
                        data={mergedData}
                        height={graphHeight || 400}
                        width={800}
                        style={{ height: "100%", width: "100%" }}
                      >
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
                              year: "numeric",
                              month: "numeric",
                              day: "numeric",
                            });
                          }}
                        />
                        <YAxis
                          tickLine={false}
                          axisLine={false}
                          tickMargin={8}
                          tickCount={3}
                          domain={["dataMin", "auto"]}
                        />
                        <ChartTooltip
                          cursor={false}
                          content={
                            <ChartTooltipContent
                              labelFormatter={(value) => {
                                return new Date(value).toLocaleDateString(
                                  "fr-DZ",
                                  {
                                    year: "numeric",
                                    month: "numeric",
                                    day: "numeric",
                                  }
                                );
                              }}
                              indicator="dot"
                            />
                          }
                        />
                        <Area
                          dataKey="stockOne"
                          type="linear"
                          fill="url(#fillStockOne)"
                          stroke={chartConfig.stockOne.color}
                          strokeWidth={4}
                        />
                        {compareMode && (
                          <Area
                            dataKey="stockTwo"
                            type="linear"
                            fill="url(#fillStockTwo)"
                            stroke={chartConfig.stockTwo.color}
                            strokeWidth={4}
                          />
                        )}
                        <ChartLegend content={<ChartLegendContent />} />
                      </AreaChart>
                    </ChartContainer>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Actions Section - Takes 40% of the space */}
          <div className="lg:col-span-2 h-full flex flex-col">
            <Card className="h-full flex flex-col flex-1">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  {t("stocks")}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1" ref={formCardContentRef}>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-4 h-full flex flex-col"
                  >
                    <div className="space-y-4 flex-1">
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <FormField
                            control={form.control}
                            name="firstAction"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("stockOne")}</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue
                                        placeholder={t("selectStock")}
                                      />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {availableStocks?.map((stock: any) => (
                                      <SelectItem
                                        key={stock.id}
                                        value={stock.id}
                                      >
                                        {stock.name || stock.code}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="flex-1">
                          <FormField
                            control={form.control}
                            name="secondAction"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("stockTwo")}</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue
                                        placeholder={t("selectStock")}
                                      />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {availableStocks?.map((stock: any) => (
                                      <SelectItem
                                        key={stock.id}
                                        value={stock.id}
                                      >
                                        {stock.name || stock.code}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                      <div className="flex gap-4">
                        <div className="flex-1">
                          <FormField
                            control={form.control}
                            name="fromDate"
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel>{t("startPeriod")}</FormLabel>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant={"outline"}
                                        className={cn(
                                          " pl-3 text-left font-normal",
                                          !fromDate && "text-muted-foreground"
                                        )}
                                      >
                                        {fromDate ? (
                                          format(
                                            fromDate,
                                            locale === "ar"
                                              ? "dd/MM/yyyy"
                                              : "PPP",
                                            {
                                              locale:
                                                locale === "fr"
                                                  ? fr
                                                  : locale === "en"
                                                  ? enUS
                                                  : ar,
                                            }
                                          )
                                        ) : (
                                          <span>{t("pickADate")}</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    className="w-auto p-0"
                                    align="start"
                                  >
                                    <Calendar
                                      mode="single"
                                      defaultMonth={fromDate}
                                      selected={fromDate}
                                      onSelect={setFromDate}
                                      numberOfMonths={1}
                                      captionLayout="dropdown-buttons"
                                      fromYear={1950}
                                      toYear={2050}
                                      locale={
                                        locale === "fr"
                                          ? fr
                                          : locale === "en"
                                          ? enUS
                                          : ar
                                      }
                                    />
                                  </PopoverContent>
                                </Popover>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="flex-1">
                          <FormField
                            control={form.control}
                            name="toDate"
                            render={({ field }) => (
                              <FormItem className="flex flex-col">
                                <FormLabel>{t("endPeriod")}</FormLabel>
                                <Popover>
                                  <PopoverTrigger asChild>
                                    <FormControl>
                                      <Button
                                        variant={"outline"}
                                        className={cn(
                                          " pl-3 text-left font-normal",
                                          !toDate && "text-muted-foreground"
                                        )}
                                      >
                                        {toDate ? (
                                          format(
                                            toDate,
                                            locale === "ar"
                                              ? "dd/MM/yyyy"
                                              : "PPP",
                                            {
                                              locale:
                                                locale === "fr"
                                                  ? fr
                                                  : locale === "en"
                                                  ? enUS
                                                  : ar,
                                            }
                                          )
                                        ) : (
                                          <span>{t("pickADate")}</span>
                                        )}
                                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                      </Button>
                                    </FormControl>
                                  </PopoverTrigger>
                                  <PopoverContent
                                    className="w-auto p-0"
                                    align="start"
                                  >
                                    <Calendar
                                      mode="single"
                                      defaultMonth={toDate}
                                      selected={toDate}
                                      onSelect={setToDate}
                                      numberOfMonths={1}
                                      captionLayout="dropdown-buttons"
                                      fromYear={1950}
                                      toYear={2050}
                                      locale={
                                        locale === "fr"
                                          ? fr
                                          : locale === "en"
                                          ? enUS
                                          : ar
                                      }
                                    />
                                  </PopoverContent>
                                </Popover>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    </div>
                    <Button
                      type="submit"
                      disabled={loading || availableStocks.length === 0}
                      className="w-full mt-auto"
                    >
                      {loading
                        ? t("loading") || "Loading..."
                        : t("view") || "View"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      ) : (
        <CarnetOrdre />
      )}
    </div>
  );
}
