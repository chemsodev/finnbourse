"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  ArrowUpRight,
  ArrowDownRight,
  LineChart,
  History,
  Filter,
  Download,
  FileText,
} from "lucide-react";
import { useClients } from "@/hooks/useClients";
import Loading from "@/components/ui/loading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";

// Updated portfolio data interface to match the provided data structure
interface Holding {
  stockId: string;
  stockCode: string;
  stockName: string;
  quantity: number;
  averagePurchasePrice: number;
  currentPrice: number;
  totalInvestment: number;
  currentValue: number;
  totalProfit: number;
  profitPercentage: number;
}

interface Transaction {
  stockCode: string;
  stockName: string;
  clientId: string;
  clientName: string;
  quantity: number;
  price: number;
  status: "pending" | "completed";
  createdAt: string;
}

interface Portfolio {
  myPortfolio: {
    clientId: string;
    clientName: string;
    holdings: Holding[];
    totalInvestment: number;
    totalCurrentValue: number;
    totalProfit: number;
    totalProfitPercentage: number;
  };
  transactionHistoryExample: Transaction[];
}

export default function ClientPortfolio() {
  const t = useTranslations("ClientDashboard");
  const params = useParams();
  const router = useRouter();
  const clientId = params.id as string;

  const [client, setClient] = useState<any>(null);
  const [portfolio, setPortfolio] = useState<Portfolio | null>(null);
  const [loadingPortfolio, setLoadingPortfolio] = useState(false);
  const [selectedTab, setSelectedTab] = useState("holdings");
  const [apiError, setApiError] = useState<string | null>(null);

  const { getClientById, loading } = useClients();

  // Fallback portfolio data
  const fallbackData: Portfolio = {
    myPortfolio: {
      clientId: "client-id-1",
      clientName: "Client No 1",
      holdings: [
        {
          stockId: "stock-id-cpa",
          stockCode: "CPA",
          stockName: "Credit Populaire d'Algerie",
          quantity: 42,
          averagePurchasePrice: 600.0,
          currentPrice: 650.0,
          totalInvestment: 25200.0,
          currentValue: 27300.0,
          totalProfit: 2100.0,
          profitPercentage: 8.33,
        },
        {
          stockId: "stock-id-bdl",
          stockCode: "BDL",
          stockName: "Banque de Developpement Local",
          quantity: 200,
          averagePurchasePrice: 450.0,
          currentPrice: 460.0,
          totalInvestment: 90000.0,
          currentValue: 92000.0,
          totalProfit: 2000.0,
          profitPercentage: 2.22,
        },
      ],
      totalInvestment: 115200.0,
      totalCurrentValue: 119300.0,
      totalProfit: 4100.0,
      totalProfitPercentage: 3.56,
    },
    transactionHistoryExample: [
      {
        stockCode: "CPA",
        stockName: "Credit Populaire d'Algerie",
        clientId: "client-id-1",
        clientName: "Client No 1",
        quantity: 12,
        price: 500.0,
        status: "completed" as const,
        createdAt: "2025-01-01T10:00:00Z",
      },
      {
        stockCode: "CPA",
        stockName: "Credit Populaire d'Algerie",
        clientId: "client-id-1",
        clientName: "Client No 1",
        quantity: 20,
        price: 600.0,
        status: "completed" as const,
        createdAt: "2025-01-02T11:00:00Z",
      },
      {
        stockCode: "CPA",
        stockName: "Credit Populaire d'Algerie",
        clientId: "client-id-1",
        clientName: "Client No 1",
        quantity: 10,
        price: 700.0,
        status: "pending" as const,
        createdAt: "2025-01-03T12:00:00Z",
      },
      {
        stockCode: "BDL",
        stockName: "Banque de Developpement Local",
        clientId: "client-id-1",
        clientName: "Client No 1",
        quantity: 200,
        price: 450.0,
        status: "pending" as const,
        createdAt: "2025-01-04T13:00:00Z",
      },
    ],
  };

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const data = await getClientById(clientId);
        setClient(data);
      } catch (error) {
        console.error("Error fetching client:", error);
      }
    };

    const fetchPortfolio = async () => {
      try {
        setLoadingPortfolio(true);
        console.log("Fetching portfolio data...");
        setApiError(null);

        // In production, you would uncomment this section to use the real API
        /*
        try {
          // Add timeout to the fetch call
          const portfolioApiUrl = process.env.NEXT_PUBLIC_PORTFOLIO_API_URL || 'http://localhost:8081';
          const fetchPromise = fetch(`${portfolioApiUrl}/portfolio/${clientId}`);
          const timeoutPromise = new Promise((_, reject) =>
            setTimeout(() => reject(new Error("Fetch timeout")), 5000)
          );

          // Race the fetch against a timeout
          const response = await Promise.race([fetchPromise, timeoutPromise]);

          if (!response.ok) {
            throw new Error(`Failed to fetch portfolio data: ${response.status}`);
          }

          const data = await response.json();
          console.log("Portfolio data received:", data);
          setPortfolio(data);
          return;
        } catch (apiErr) {
          console.error("API error:", apiErr);
          setApiError("Could not connect to portfolio service. Using sample data.");
        }
        */

        // Always use fallback data for now
        console.log("Using fallback portfolio data");
        setPortfolio(fallbackData);
      } catch (error) {
        console.error("Error in portfolio flow:", error);
        setPortfolio(fallbackData);
      } finally {
        console.log("Portfolio loading completed");
        // Short timeout to prevent immediate flash of content
        setTimeout(() => {
          setLoadingPortfolio(false);
        }, 300);
      }
    };

    if (clientId) {
      fetchClient();
      fetchPortfolio();
    }
  }, [clientId, getClientById]);

  const formatDate = (dateString: string) => {
    try {
      // Check if dateString is valid
      if (!dateString) return "-";

      // Parse the date - handle ISO format dates correctly
      const date = new Date(dateString);

      // Check if date is valid
      if (isNaN(date.getTime())) return "-";

      // Format the date in a locale-friendly way
      return format(date, "dd/MM/yyyy");
    } catch (error) {
      console.error("Error formatting date:", error);
      return "-";
    }
  };

  const formatCurrency = (value: number) => {
    // Check if value is a valid number
    if (value === undefined || value === null || isNaN(value)) {
      return "-";
    }

    try {
      return new Intl.NumberFormat("fr-DZ", {
        style: "currency",
        currency: "DZD",
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value);
    } catch (error) {
      console.error("Error formatting currency:", error);
      return `${value} DA`;
    }
  };

  const handleGenerateReport = () => {
    // Implementation for generating portfolio report would go here
    alert(
      "Portfolio report generation functionality would be implemented here"
    );
  };

  const handleExportData = (format: string) => {
    // Implementation for exporting data would go here
    alert(`Export to ${format} would be implemented here`);
  };

  // Update the loading state display
  if (loading) {
    return <Loading className="min-h-[400px]" />;
  }

  if (!client) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px]">
        <h2 className="text-xl font-semibold mb-2">Client not found</h2>
        <p className="text-muted-foreground">
          The requested client could not be found.
        </p>
        <Button
          variant="outline"
          className="mt-4"
          onClick={() => router.push("/clients")}
        >
          Back to Clients List
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push(`/clients/${clientId}/view`)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
              {t("portfolio")}
              {client && (
                <span className="text-lg font-normal text-muted-foreground">
                  -{" "}
                  {client.type === "individual"
                    ? client.name
                    : client.raison_sociale}
                </span>
              )}
            </h1>
            <p className="text-sm text-muted-foreground">
              {t("clientCode")}: {client.client_code || "-"}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleGenerateReport}>
            <FileText className="h-4 w-4 mr-2" />
            {t("generateReport")}
          </Button>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                {t("export")}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => handleExportData("pdf")}>
                PDF
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExportData("excel")}>
                Excel
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleExportData("csv")}>
                CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Portfolio Summary */}
      <Card>
        <CardHeader>
          <CardTitle>{t("summary")}</CardTitle>
        </CardHeader>
        <CardContent>
          {loadingPortfolio ? (
            <div className="flex flex-col items-center justify-center min-h-[200px]">
              <Loading className="mb-4" />
              <p className="text-muted-foreground">Loading portfolio data...</p>
            </div>
          ) : portfolio ? (
            <div className="space-y-6">
              {apiError && (
                <div className="bg-amber-50 border border-amber-200 text-amber-800 px-4 py-2 rounded-md mb-4 text-sm">
                  {apiError}
                </div>
              )}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="bg-white shadow-sm rounded-lg p-4 border">
                  <h3 className="text-sm text-gray-500 font-medium">
                    {t("totalInvestment")}
                  </h3>
                  <p className="text-2xl font-bold">
                    {formatCurrency(portfolio.myPortfolio.totalInvestment)}
                  </p>
                </div>
                <div className="bg-white shadow-sm rounded-lg p-4 border">
                  <h3 className="text-sm text-gray-500 font-medium">
                    {t("currentValue")}
                  </h3>
                  <p className="text-2xl font-bold">
                    {formatCurrency(portfolio.myPortfolio.totalCurrentValue)}
                  </p>
                </div>
                <div className="bg-white shadow-sm rounded-lg p-4 border">
                  <div className="flex justify-between items-start">
                    <h3 className="text-sm text-gray-500 font-medium">
                      {t("totalProfit")}
                    </h3>
                    <Badge
                      variant={
                        portfolio.myPortfolio.totalProfit >= 0
                          ? "default"
                          : "destructive"
                      }
                      className="flex items-center"
                    >
                      {portfolio.myPortfolio.totalProfit >= 0 ? (
                        <ArrowUpRight className="h-3 w-3 mr-1" />
                      ) : (
                        <ArrowDownRight className="h-3 w-3 mr-1" />
                      )}
                      {portfolio.myPortfolio.totalProfitPercentage.toFixed(2)}%
                    </Badge>
                  </div>
                  <p
                    className={`text-2xl font-bold ${
                      portfolio.myPortfolio.totalProfit >= 0
                        ? "text-emerald-600"
                        : "text-red-600"
                    }`}
                  >
                    {formatCurrency(portfolio.myPortfolio.totalProfit)}
                  </p>
                </div>
                <div className="bg-white shadow-sm rounded-lg p-4 border">
                  <h3 className="text-sm text-gray-500 font-medium">
                    {t("totalTransactions")}
                  </h3>
                  <p className="text-2xl font-bold">
                    {portfolio.transactionHistoryExample.length}
                  </p>
                </div>
              </div>

              <div className="mt-6">
                <div className="bg-muted/20 p-8 rounded-lg border border-dashed flex items-center justify-center">
                  <div className="text-center">
                    <LineChart className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <h3 className="text-lg font-medium mb-2">
                      {t("portfolioPerformance")}
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-md mx-auto">
                      Historical performance chart would be displayed here. This
                      is a placeholder for visualization that would show the
                      portfolio value over time.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              {t("noPortfolioData") ||
                "No portfolio data available for this client."}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Detailed Portfolio Data */}
      {portfolio && (
        <Card>
          <CardHeader>
            <CardTitle>{t("portfolioDetails")}</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs
              defaultValue="holdings"
              value={selectedTab}
              onValueChange={setSelectedTab}
              className="w-full"
            >
              <div className="flex justify-between items-center mb-6">
                <TabsList>
                  <TabsTrigger value="holdings">{t("holdings")}</TabsTrigger>
                  <TabsTrigger value="transactions">
                    {t("transactions")}
                  </TabsTrigger>
                  <TabsTrigger value="performance">
                    {t("performance")}
                  </TabsTrigger>
                </TabsList>

                <div className="flex gap-2">
                  <Button variant="outline" size="sm">
                    <Filter className="h-4 w-4 mr-2" />
                    {t("filter")}
                  </Button>
                </div>
              </div>

              <TabsContent value="holdings" className="mt-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>{t("name")}</TableHead>
                      <TableHead className="text-right">
                        {t("quantity")}
                      </TableHead>
                      <TableHead className="text-right">
                        {t("averagePrice")}
                      </TableHead>
                      <TableHead className="text-right">
                        {t("currentPrice")}
                      </TableHead>
                      <TableHead className="text-right">
                        {t("investment")}
                      </TableHead>
                      <TableHead className="text-right">
                        {t("currentValue")}
                      </TableHead>
                      <TableHead className="text-right">
                        {t("profit")}
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {portfolio.myPortfolio.holdings.map((holding) => (
                      <TableRow key={holding.stockId}>
                        <TableCell>
                          <div className="font-medium">{holding.stockName}</div>
                          <div className="text-sm text-gray-500">
                            {holding.stockCode}
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          {holding.quantity}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(holding.averagePurchasePrice)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(holding.currentPrice)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(holding.totalInvestment)}
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(holding.currentValue)}
                        </TableCell>
                        <TableCell className="text-right">
                          <div
                            className={`flex items-center justify-end ${
                              holding.totalProfit >= 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {holding.totalProfit >= 0 ? (
                              <ArrowUpRight className="h-3 w-3 mr-1" />
                            ) : (
                              <ArrowDownRight className="h-3 w-3 mr-1" />
                            )}
                            {formatCurrency(holding.totalProfit)}
                            <span className="ml-1 text-xs">
                              ({holding.profitPercentage.toFixed(2)}%)
                            </span>
                          </div>
                          <Progress
                            value={
                              holding.profitPercentage > 0
                                ? Math.min(holding.profitPercentage * 2, 100) // Scale for better visualization
                                : Math.min(
                                    Math.abs(holding.profitPercentage) * 2,
                                    100
                                  )
                            }
                            max={100}
                            className={`h-1.5 mt-1 ${
                              holding.totalProfit >= 0
                                ? "bg-green-200"
                                : "bg-red-200"
                            }`}
                            indicatorClassName={
                              holding.totalProfit >= 0
                                ? "bg-green-500"
                                : "bg-red-500"
                            }
                          />
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TabsContent>

              <TabsContent value="transactions" className="mt-0">
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>{t("security")}</TableHead>
                        <TableHead>{t("date")}</TableHead>
                        <TableHead className="text-right">
                          {t("quantity")}
                        </TableHead>
                        <TableHead className="text-right">
                          {t("price")}
                        </TableHead>
                        <TableHead className="text-right">
                          {t("total")}
                        </TableHead>
                        <TableHead>{t("status")}</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {portfolio.transactionHistoryExample.map(
                        (transaction, index) => {
                          // Calculate the total value for each transaction
                          const totalValue =
                            transaction.price * transaction.quantity;
                          const isPending = transaction.status === "pending";

                          return (
                            <TableRow
                              key={`${transaction.stockCode}-${index}`}
                              className={isPending ? "opacity-60" : ""}
                            >
                              <TableCell>
                                <div className="font-medium">
                                  {transaction.stockName}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {transaction.stockCode}
                                </div>
                              </TableCell>
                              <TableCell>
                                {formatDate(transaction.createdAt)}
                              </TableCell>
                              <TableCell className="text-right">
                                {transaction.quantity}
                              </TableCell>
                              <TableCell className="text-right">
                                {formatCurrency(transaction.price)}
                              </TableCell>
                              <TableCell className="text-right font-medium">
                                {formatCurrency(totalValue)}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={isPending ? "secondary" : "default"}
                                  className={
                                    isPending
                                      ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                                      : ""
                                  }
                                >
                                  {isPending ? t("pending") : t("completed")}
                                </Badge>
                              </TableCell>
                            </TableRow>
                          );
                        }
                      )}
                    </TableBody>
                  </Table>
                </div>
              </TabsContent>

              <TabsContent value="performance" className="mt-0">
                <div className="space-y-8">
                  <div className="bg-muted/20 p-10 rounded-lg border border-dashed flex items-center justify-center">
                    <div className="text-center">
                      <LineChart className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                      <h3 className="text-lg font-medium mb-2">
                        {t("historicalPerformance")}
                      </h3>
                      <p className="text-sm text-muted-foreground max-w-md mx-auto">
                        Detailed historical performance chart would be displayed
                        here, showing portfolio growth over time with key
                        milestones and market events.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-muted/20 p-8 rounded-lg border border-dashed flex items-center justify-center">
                      <div className="text-center">
                        <h3 className="text-lg font-medium mb-2">
                          {t("assetAllocation")}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Pie chart showing asset allocation would be displayed
                          here.
                        </p>
                      </div>
                    </div>

                    <div className="bg-muted/20 p-8 rounded-lg border border-dashed flex items-center justify-center">
                      <div className="text-center">
                        <h3 className="text-lg font-medium mb-2">
                          {t("sectorDistribution")}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          Bar chart showing sector distribution would be
                          displayed here.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
