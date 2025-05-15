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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { clientFetchGraphQL } from "@/app/actions/fetchGraphQL";
import { format } from "date-fns";
import {
  LIST_STOCKS_NAME_PRICE_QUERY,
  LIST_STOCKS_QUERY,
  LIST_TWO_STOCKS_QUERY,
} from "@/graphql/queries";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useEffect, useState, useMemo, useCallback } from "react";

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
import { useSession } from "next-auth/react";

const formSchema = z.object({
  firstAction: z.string().optional(),
  secondAction: z.string().optional(),
  fromDate: z.date().optional(),
  toDate: z.date().optional(),
  compareMode: z.boolean().default(true),
});

// Define proper session user type
interface CustomUser {
  id?: string;
  token?: string;
  roleid?: number;
  name?: string;
  email?: string;
}

export function StockTracker() {
  const t = useTranslations("DashLineChart");
  const locale = useLocale();
  const session = useSession();
  const user = session?.data?.user as CustomUser;
  const accessToken = user?.token || "";
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("graphe");
  const [fromDate, setFromDate] = useState<Date | undefined>();
  const [toDate, setToDate] = useState<Date | undefined>();
  const [stockOne, setStockOne] = useState<any>();
  const [stockTwo, setStockTwo] = useState<any>();
  const [stockOneData, setStockOneData] = useState<any[]>([]);
  const [stockTwoData, setStockTwoData] = useState<any[]>([]);
  const [snpData, setSnpData] = useState<any[]>([]);
  const [compareMode, setCompareMode] = useState(true);

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

  const fetchTwoRandomStocks = useCallback(async () => {
    setLoading(true);
    try {
      const result = await clientFetchGraphQL<any>(
        LIST_STOCKS_QUERY,
        {
          skip: 0,
          take: 2,
          type: "action",
        },
        {},
        accessToken
      );

      setStockOne(result.listStocks[0]);
      setStockTwo(result.listStocks[1]);
      setStockOneData(result.listStocks[0].marketmetadata.cours);
      setStockTwoData(result.listStocks[1].marketmetadata.cours);

      if (
        result.listStocks[0].marketmetadata.cours &&
        result.listStocks[1].marketmetadata.cours
      ) {
        const allDates = [
          ...result.listStocks[0].marketmetadata.cours?.map(
            (item: any) => new Date(item.date)
          ),
          ...result.listStocks[1].marketmetadata.cours?.map(
            (item: any) => new Date(item.date)
          ),
        ];

        const sortedDates = allDates.sort((a, b) => a.getTime() - b.getTime());

        if (sortedDates.length > 0) {
          setFromDate(sortedDates[0]);
          setToDate(sortedDates[sortedDates.length - 1]);
        }
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  const fetchSnp = useCallback(async () => {
    try {
      const snp = await clientFetchGraphQL<any>(
        LIST_STOCKS_NAME_PRICE_QUERY,
        {
          type: "action",
        },
        {},
        accessToken
      );
      setSnpData(snp.listStocks);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  }, [accessToken]);

  const fetchTwoStocks = useCallback(
    async (idOne: string, idTwo: string) => {
      setLoading(true);
      try {
        const result = await clientFetchGraphQL<any>(
          LIST_TWO_STOCKS_QUERY,
          {
            idOne,
            idTwo,
            type: "action",
          },
          {},
          accessToken
        );

        setStockOne(result.listStocks[0]);
        setStockTwo(result.listStocks[1]);
        setStockOneData(result.listStocks[0].marketmetadata.cours);
        setStockTwoData(result.listStocks[1].marketmetadata.cours);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    },
    [accessToken]
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      compareMode: true,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);
    try {
      if (values.firstAction) {
        if (values.compareMode && values.secondAction) {
          fetchTwoStocks(values.firstAction, values.secondAction);
        } else {
          // Fetch only one stock
          fetchTwoStocks(values.firstAction, values.firstAction);
        }
      }
      if (values.fromDate && values.toDate) {
        setFromDate(values.fromDate);
        setToDate(values.toDate);
      }

      setCompareMode(values.compareMode);
      setActiveTab("graphe");
    } catch (error) {
      console.error("Form submission error", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchTwoRandomStocks();
    fetchSnp();
  }, [fetchTwoRandomStocks, fetchSnp]);

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

  return (
    <>
      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        defaultValue="graphe"
        className="w-full"
      >
        <div className="flex justify-between">
          <div className="flex items-center gap-2 space-y-0 py-3 sm:flex-row">
            <div className="grid flex-1 gap-1 font-bold text-xl capitalize">
              {t("title")}
            </div>
          </div>
          <TabsList>
            <TabsTrigger value="graphe"> {t("graph")}</TabsTrigger>
            <TabsTrigger value="actions"> {t("stocks")}</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="graphe">
          {!stockOneData || !stockTwoData ? (
            <div className="h-60 border rounded-md flex justify-center text-center items-center shadow-inner">
              {t("noData")}
            </div>
          ) : (
            <div className="pr-2 pt-4 sm:pr-6 sm:pt-6 animate-fade-in">
              <ChartContainer
                config={chartConfig}
                className="aspect-auto h-[200px] w-full"
              >
                <AreaChart data={mergedData}>
                  {/* <defs>
                    <linearGradient
                      id="fillStockOne"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={chartConfig.stockOne.color}
                      />
                      <stop offset="95%" stopColor="rgba(255,255,255,0.2)" />
                    </linearGradient>
                    <linearGradient
                      id="fillStockTwo"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={chartConfig.stockTwo.color}
                      />
                      <stop offset="95%" stopColor="rgba(255,255,255,0.2)" />
                    </linearGradient>
                  </defs> */}
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
        </TabsContent>
        <TabsContent value="actions">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="pt-4">
              <div className="flex w-full items-center">
                <div className="flex flex-col gap-4 justify-between items-baseline w-full">
                  <div className="w-full">
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
                              {snpData?.map((t: any) => (
                                <SelectItem value={t.id}>{t.issuer}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="compareMode"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between space-x-2 space-y-0 rounded-md border p-4">
                        <FormLabel className="text-sm">
                          {t("compareStocks")}
                        </FormLabel>

                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  {form.watch("compareMode") && (
                    <div className="w-full">
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
                                {snpData?.map((t: any) => (
                                  <SelectItem value={t.id}>
                                    {t.issuer}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormDescription>
                              {t("stockToCompare")}
                            </FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  )}
                </div>
                <Separator
                  orientation="vertical"
                  className="h-48 mx-4 text-primary"
                />
                <div className="flex flex-col gap-4 justify-between items-baseline w-full">
                  <div className="w-full">
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
                  <div className="w-full">
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

              <Button type="submit" disabled={loading} className="w-full my-4">
                {loading ? "chargement..." : "Voir"}
              </Button>
            </form>
          </Form>
        </TabsContent>
      </Tabs>
    </>
  );
}
