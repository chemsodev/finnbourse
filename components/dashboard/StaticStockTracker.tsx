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
import { useEffect, useState, useMemo, useCallback, useRef, useLayoutEffect } from "react";

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

// Mock data for stocks
const mockStocks = [
  {
    id: "1",
    issuer: "TOTAL",
    code: "TOTAL",
    name: "Total Energies",
    facevalue: 52.30,
    marketmetadata: {
      cours: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString(),
        price: 52.30 + (Math.random() - 0.5) * 5
      }))
    }
  },
  {
    id: "2",
    issuer: "BNP Paribas",
    code: "BNP",
    name: "BNP Paribas",
    facevalue: 45.80,
    marketmetadata: {
      cours: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString(),
        price: 45.80 + (Math.random() - 0.5) * 3
      }))
    }
  },
  {
    id: "3",
    issuer: "Orange",
    code: "ORA",
    name: "Orange SA",
    facevalue: 12.50,
    marketmetadata: {
      cours: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString(),
        price: 12.50 + (Math.random() - 0.5) * 2
      }))
    }
  },
  {
    id: "4",
    issuer: "LVMH",
    code: "MC",
    name: "LVMH Moët Hennessy",
    facevalue: 850.00,
    marketmetadata: {
      cours: Array.from({ length: 30 }, (_, i) => ({
        date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString(),
        price: 850.00 + (Math.random() - 0.5) * 50
      }))
    }
  }
];

const formSchema = z.object({
  firstAction: z.string().optional(),
  secondAction: z.string().optional(),
  fromDate: z.date().optional(),
  toDate: z.date().optional(),
});

export function StaticStockTracker() {
  const t = useTranslations("DashLineChart");
  const locale = useLocale();
  const [loading, setLoading] = useState(false);
  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();
  const [stockOne, setStockOne] = useState<any>(mockStocks[0]);
  const [stockTwo, setStockTwo] = useState<any>(mockStocks[1]);
  const [stockOneData, setStockOneData] = useState<any[]>(mockStocks[0].marketmetadata.cours);
  const [stockTwoData, setStockTwoData] = useState<any[]>(mockStocks[1].marketmetadata.cours);
  const [compareMode, setCompareMode] = useState(true);
  const [view, setView] = useState<'graphe comparatif' | 'carnet'>('graphe comparatif');
  const [graphHeight, setGraphHeight] = useState<number | undefined>(undefined);
  const formCardContentRef = useRef<HTMLDivElement>(null);

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
        const stock1 = mockStocks.find(s => s.id === idOne) || mockStocks[0];
        const stock2 = mockStocks.find(s => s.id === idTwo) || mockStocks[1];
        
        setStockOne(stock1);
        setStockTwo(stock2);
        setStockOneData(stock1.marketmetadata.cours);
        setStockTwoData(stock2.marketmetadata.cours);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    },
    []
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
      label: stockOne ? stockOne.issuer : "Stock One",
      color: "hsl(var(--chart-3))",
    },
    stockTwo: {
      label: stockTwo ? stockTwo.issuer : "Stock Two",
      color: "hsl(var(--chart-1))",
    },
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  return (
    <div className="w-full space-y-6">

      {/* Switch Buttons */}
      <div className="flex mb-4">
        <button
          className={`px-4 py-2 rounded ${view === "graphe comparatif" ? "bg-primary text-white" : "bg-gray-200"}`}
          onClick={() => setView("graphe comparatif")}
        >
          graphe comparatife
        </button>
        <button
          className={`px-4 py-2 rounded ${view === "carnet" ? "bg-primary text-white" : "bg-gray-200"}`}
          onClick={() => setView("carnet")}
        >
          Carnet d'ordre
        </button>
      </div>

      {view === 'graphe comparatif' ? (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Chart Section - Takes 60% of the space */}
          <div className="lg:col-span-3">
            <Card className="h-full flex flex-col flex-1">
              <CardHeader>
                <CardTitle className="text-lg font-semibold">
                  {t("graphe comparatif")}
                </CardTitle>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col" style={graphHeight ? {height: graphHeight} : {}}>
                {!stockOneData || !stockTwoData ? (
                  <div className="h-60 border rounded-md flex justify-center text-center items-center shadow-inner">
                    {t("noData")}
                  </div>
                ) : (
                  <div className="pr-2 pt-4 sm:pr-6 sm:pt-6 animate-fade-in h-full">
                    <ChartContainer
                      config={chartConfig}
                      className="aspect-auto h-full w-full"
                    >
                      <AreaChart data={mergedData} height={graphHeight || 400} width={800} style={{height: '100%', width: '100%'}}>
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
                                return new Date(value).toLocaleDateString("fr-DZ", {
                                  year: "numeric",
                                  month: "numeric",
                                  day: "numeric",
                                });
                              }}
                              indicator="dot"
                            />
                          }
                        />
                        <Area
                          dataKey="stockOne"
                          type="natural"
                          fill="url(#fillStockOne)"
                          stroke={chartConfig.stockOne.color}
                          strokeWidth={4}
                        />
                        {compareMode && (
                          <Area
                            dataKey="stockTwo"
                            type="natural"
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
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 h-full flex flex-col">
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
                                      <SelectValue placeholder={t("selectStock")} />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {mockStocks?.map((t: any) => (
                                      <SelectItem key={t.id} value={t.id}>{t.issuer}</SelectItem>
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
                                      <SelectValue placeholder={t("selectStock")} />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {mockStocks?.map((t: any) => (
                                      <SelectItem key={t.id} value={t.id}>
                                        {t.issuer}
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
                                            locale === "ar" ? "dd/MM/yyyy" : "PPP",
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
                                            locale === "ar" ? "dd/MM/yyyy" : "PPP",
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
                    <Button type="submit" disabled={loading} className="w-full mt-auto">
                      {loading ? "chargement..." : "Voir"}
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
