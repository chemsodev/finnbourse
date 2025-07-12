"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Edit,
  Trash2,
  Plus,
  TrendingUp,
  LineChart,
  ArrowUpRight,
  ArrowDownRight,
  History,
} from "lucide-react";
import { useClients } from "@/hooks/useClients";
import Loading from "@/components/ui/loading";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { actorAPI } from "@/app/actions/actorAPI";
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

// Portfolio data interface
interface PortfolioData {
  myPortfolio: {
    holdings: {
      name: string;
      symbol: string;
      quantity: number;
      currentValue: number;
      investmentValue: number;
      profit: number;
      profitPercentage: number;
    }[];
    totalInvestment: number;
    totalCurrentValue: number;
    totalProfit: number;
    totalProfitPercentage: number;
  };
  transactionHistoryExample: {
    id: string;
    date: string;
    type: string;
    status: string;
    symbol: string;
    name: string;
    quantity: number;
    price: number;
    total: number;
  }[];
}

export default function ClientView() {
  const t = useTranslations("ClientDashboard");
  const params = useParams();
  const router = useRouter();
  const clientId = params.id as string;

  const [client, setClient] = useState<any>(null);
  const [clientUsers, setClientUsers] = useState<any[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [loadingPortfolio, setLoadingPortfolio] = useState(false);
  const dataFetchedRef = useRef<boolean>(false);

  const { getClientById, deleteClient, loading } = useClients();

  useEffect(() => {
    // Prevent multiple API calls
    if (dataFetchedRef.current) return;

    const fetchClient = async () => {
      try {
        const data = await getClientById(clientId);
        console.log("Client data:", data); // Debug the client data
        setClient(data);
      } catch (error) {
        console.error("Error fetching client:", error);
      }
    };

    const fetchClientUsers = async () => {
      try {
        setLoadingUsers(true);
        // In a real implementation, you would fetch users from the API
        // The endpoint may not yet be fully implemented in actorAPI.client
        // For now, we'll just use an empty array
        // const response = await actorAPI.client.getUsers(clientId);
        // const users = response?.data || response || [];

        console.log(
          "Fetching client users would go here with clientId:",
          clientId
        );
        // Mock empty array for now
        setClientUsers([]);
      } catch (error) {
        console.error("Error fetching client users:", error);
        setClientUsers([]);
      } finally {
        setLoadingUsers(false);
      }
    };

    const fetchPortfolio = async () => {
      try {
        setLoadingPortfolio(true);
        // Fetch from the Mockoon API using environment variable
        const portfolioApiUrl =
          process.env.NEXT_PUBLIC_PORTFOLIO_API_URL || "http://localhost:8081";
        const response = await fetch(
          `${portfolioApiUrl}/portfolio/${clientId}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch portfolio data");
        }
        const apiData = await response.json();

        // Transform the API data to match the expected structure
        const transformedData = {
          myPortfolio: {
            holdings: apiData.myPortfolio.holdings.map((holding: any) => ({
              name: holding.stockName,
              symbol: holding.stockCode,
              quantity: holding.quantity,
              currentValue: holding.currentValue,
              investmentValue: holding.totalInvestment,
              profit: holding.totalProfit,
              profitPercentage: holding.profitPercentage,
            })),
            totalInvestment: apiData.myPortfolio.totalInvestment,
            totalCurrentValue: apiData.myPortfolio.totalCurrentValue,
            totalProfit: apiData.myPortfolio.totalProfit,
            totalProfitPercentage: apiData.myPortfolio.totalProfitPercentage,
          },
          transactionHistoryExample: apiData.transactionHistoryExample.map(
            (transaction: any, index: number) => ({
              id: `TX${String(index + 1).padStart(3, "0")}`,
              date: transaction.createdAt,
              type: transaction.quantity > 0 ? "BUY" : "SELL",
              status: transaction.status,
              symbol: transaction.stockCode,
              name: transaction.stockName,
              quantity: Math.abs(transaction.quantity), // Always show positive quantity
              price: transaction.price,
              total: Math.abs(transaction.quantity * transaction.price),
            })
          ),
        };

        setPortfolio(transformedData);
      } catch (error) {
        console.error("Error fetching portfolio:", error);
        // Create a fallback portfolio data if the API is not available
        setPortfolio({
          myPortfolio: {
            holdings: [
              {
                name: "CPA Bank",
                symbol: "CPA",
                quantity: 100,
                currentValue: 15000,
                investmentValue: 12000,
                profit: 3000,
                profitPercentage: 25,
              },
              {
                name: "Banque de Développement Local",
                symbol: "BDL",
                quantity: 50,
                currentValue: 8500,
                investmentValue: 8000,
                profit: 500,
                profitPercentage: 6.25,
              },
            ],
            totalInvestment: 20000,
            totalCurrentValue: 23500,
            totalProfit: 3500,
            totalProfitPercentage: 17.5,
          },
          transactionHistoryExample: [
            {
              id: "TX001",
              date: "2023-04-15",
              type: "BUY",
              status: "completed",
              symbol: "CPA",
              name: "CPA Bank",
              quantity: 100,
              price: 120,
              total: 12000,
            },
            {
              id: "TX002",
              date: "2023-05-20",
              type: "BUY",
              status: "completed",
              symbol: "BDL",
              name: "Banque de Développement Local",
              quantity: 50,
              price: 160,
              total: 8000,
            },
            {
              id: "TX003",
              date: "2023-06-10",
              type: "SELL",
              status: "completed",
              symbol: "CPA",
              name: "CPA Bank",
              quantity: 20,
              price: 130,
              total: 2600,
            },
            {
              id: "TX004",
              date: "2023-07-05",
              type: "BUY",
              status: "pending",
              symbol: "BDL",
              name: "Banque de Développement Local",
              quantity: 25,
              price: 155,
              total: 3875,
            },
          ],
        });
      } finally {
        setLoadingPortfolio(false);
      }
    };

    if (clientId) {
      dataFetchedRef.current = true;
      fetchClient();
      fetchClientUsers();
      fetchPortfolio();
    }
  }, [clientId]); // Remove getClientById from dependencies

  const handleDelete = async () => {
    try {
      setIsDeleting(true);
      await deleteClient(clientId);
      router.push("/clients");
    } catch (error) {
      console.error("Error deleting client:", error);
    } finally {
      setIsDeleting(false);
      setIsDeleteDialogOpen(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat("fr-DZ", {
      style: "currency",
      currency: "DZD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  if (loading || !client) {
    return <Loading className="min-h-[400px]" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push("/clients")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">
            {client.type === "individual" ? client.name : client.raison_sociale}
          </h1>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/clients/${clientId}`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            {t("edit")}
          </Button>
          <Button
            variant="destructive"
            onClick={() => setIsDeleteDialogOpen(true)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            {t("delete")}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
              <Edit className="h-4 w-4 text-gray-600" />
            </div>
            {t("clientDetails")}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg border">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {t("basicInformation") || "Basic Information"}
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      {t("code")}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {client.client_code || "-"}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      {t("type")}
                    </span>
                    <Badge variant="outline">
                      {client.type === "individual"
                        ? t("individual")
                        : client.type === "corporate"
                        ? t("company")
                        : t("financialInstitution")}
                    </Badge>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      {client.type === "individual"
                        ? t("name")
                        : t("companyName")}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {client.type === "individual"
                        ? client.name
                        : client.raison_sociale}
                    </span>
                  </div>
                </div>
              </div>

              {client.type !== "individual" && (
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    {t("companyDetails") || "Company Details"}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">
                        {t("nif")}
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        {client.nif || "-"}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">
                        {t("regNumber")}
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        {client.reg_number || "-"}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">
                        {t("legalForm")}
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        {client.legal_form || "-"}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {client.type === "individual" && (
                <div className="bg-gray-50 p-4 rounded-lg border">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    {t("personalDetails") || "Personal Details"}
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">
                        {t("nin")}
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        {client.nin || "-"}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">
                        {t("nationality")}
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        {client.nationalite || "-"}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">
                        {t("idType")}
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        {client.id_type || "-"}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">
                        {t("idNumber")}
                      </span>
                      <span className="text-sm font-semibold text-gray-900">
                        {client.id_number || "-"}
                      </span>
                    </div>
                    {client.lieu_naissance && (
                      <>
                        <Separator />
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-gray-600">
                            {t("birthPlace")}
                          </span>
                          <span className="text-sm font-semibold text-gray-900">
                            {client.lieu_naissance}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 p-4 rounded-lg border">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {t("contactInformation") || "Contact Information"}
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      {t("email")}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {client.email || "-"}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      {t("phone")}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {client.phone_number || "-"}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      {t("mobilePhone")}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {client.mobile_phone || "-"}
                    </span>
                  </div>
                  <Separator />
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600">
                      {t("wilaya")}
                    </span>
                    <span className="text-sm font-semibold text-gray-900">
                      {client.wilaya || "-"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">
                  {t("accountDetails") || "Account Details"}
                </h3>
                <div className="space-y-3">
                  {client.securities_account_number && (
                    <>
                      <div className="flex justify-between">
                        <span className="text-sm font-medium text-gray-600">
                          {t("securitiesAccount")}
                        </span>
                        <span className="text-sm font-semibold text-gray-900 font-mono">
                          {client.securities_account_number}
                        </span>
                      </div>
                      <Separator />
                    </>
                  )}
                  {(client.cash_account_rip_full ||
                    client.cash_account_bank_code ||
                    client.cash_account_agency_code ||
                    client.cash_account_number) && (
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600">
                        {t("cashAccount")}
                      </span>
                      <span className="text-sm font-semibold text-gray-900 font-mono">
                        {client.cash_account_rip_full ||
                          [
                            client.cash_account_bank_code,
                            client.cash_account_agency_code,
                            client.cash_account_number,
                            client.cash_account_rip_key,
                          ]
                            .filter(Boolean)
                            .join(" ") ||
                          "-"}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
              <TrendingUp className="h-4 w-4 text-gray-600" />
            </div>
            {t("portfolio") || "Portfolio"}
          </CardTitle>
          <Button
            size="sm"
            variant="outline"
            onClick={() => router.push(`/clients/${clientId}/portfolio`)}
          >
            <LineChart className="h-4 w-4 mr-2" />
            {t("viewFullPortfolio") || "View Full Portfolio"}
          </Button>
        </CardHeader>
        <CardContent>
          {loadingPortfolio ? (
            <Loading className="min-h-[200px]" />
          ) : portfolio ? (
            <div>
              <Tabs defaultValue="summary">
                <TabsList>
                  <TabsTrigger value="summary">
                    {t("summary") || "Summary"}
                  </TabsTrigger>
                  <TabsTrigger value="transactions">
                    {t("transactions") || "Transactions"}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="summary">
                  <div className="space-y-6">
                    {/* Portfolio Summary */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                      <div className="bg-white shadow-sm rounded-lg p-4 border">
                        <h3 className="text-sm text-gray-500 font-medium">
                          {t("totalInvestment") || "Total Investment"}
                        </h3>
                        <p className="text-2xl font-bold">
                          {formatCurrency(
                            portfolio.myPortfolio.totalInvestment
                          )}
                        </p>
                      </div>
                      <div className="bg-white shadow-sm rounded-lg p-4 border">
                        <h3 className="text-sm text-gray-500 font-medium">
                          {t("currentValue") || "Current Value"}
                        </h3>
                        <p className="text-2xl font-bold">
                          {formatCurrency(
                            portfolio.myPortfolio.totalCurrentValue
                          )}
                        </p>
                      </div>
                      <div className="bg-white shadow-sm rounded-lg p-4 border">
                        <div className="flex justify-between items-start">
                          <h3 className="text-sm text-gray-500 font-medium">
                            {t("totalProfit") || "Total Profit"}
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
                            {portfolio.myPortfolio.totalProfitPercentage}%
                          </Badge>
                        </div>
                        <p className="text-2xl font-bold text-emerald-600">
                          {formatCurrency(portfolio.myPortfolio.totalProfit)}
                        </p>
                      </div>
                    </div>

                    {/* Holdings */}
                    <div>
                      <h3 className="text-lg font-medium mb-3">
                        {t("holdings") || "Holdings"}
                      </h3>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>{t("name") || "Name"}</TableHead>
                            <TableHead>{t("quantity") || "Quantity"}</TableHead>
                            <TableHead>
                              {t("investment") || "Investment"}
                            </TableHead>
                            <TableHead>
                              {t("currentValue") || "Current Value"}
                            </TableHead>
                            <TableHead>{t("profit") || "Profit"}</TableHead>
                            <TableHead>{t("percentage") || "%"}</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {portfolio.myPortfolio.holdings.map((holding) => (
                            <TableRow key={holding.symbol}>
                              <TableCell>
                                <div className="font-medium">
                                  {holding.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {holding.symbol}
                                </div>
                              </TableCell>
                              <TableCell>{holding.quantity}</TableCell>
                              <TableCell>
                                {formatCurrency(holding.investmentValue)}
                              </TableCell>
                              <TableCell>
                                {formatCurrency(holding.currentValue)}
                              </TableCell>
                              <TableCell
                                className={
                                  holding.profit >= 0
                                    ? "text-green-600"
                                    : "text-red-600"
                                }
                              >
                                {formatCurrency(holding.profit)}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center">
                                  {holding.profit >= 0 ? (
                                    <ArrowUpRight className="h-3 w-3 text-green-500 mr-1" />
                                  ) : (
                                    <ArrowDownRight className="h-3 w-3 text-red-500 mr-1" />
                                  )}
                                  {holding.profitPercentage}%
                                </div>
                                <Progress
                                  value={
                                    holding.profitPercentage > 0
                                      ? holding.profitPercentage
                                      : holding.profitPercentage * -1
                                  }
                                  max={100}
                                  className={`h-1.5 mt-1 ${
                                    holding.profit >= 0
                                      ? "bg-green-200"
                                      : "bg-red-200"
                                  }`}
                                  indicatorClassName={
                                    holding.profit >= 0
                                      ? "bg-green-500"
                                      : "bg-red-500"
                                  }
                                />
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="transactions">
                  <div className="space-y-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium">
                        {t("recentTransactions") || "Recent Transactions"}
                      </h3>
                      <Badge variant="outline" className="flex items-center">
                        <History className="h-3 w-3 mr-1" />
                        {portfolio.transactionHistoryExample.length}{" "}
                        {t("transactions") || "transactions"}
                      </Badge>
                    </div>
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>{t("date") || "Date"}</TableHead>
                          <TableHead>{t("type") || "Type"}</TableHead>
                          <TableHead>{t("status") || "Status"}</TableHead>
                          <TableHead>{t("security") || "Security"}</TableHead>
                          <TableHead>{t("quantity") || "Quantity"}</TableHead>
                          <TableHead>{t("price") || "Price"}</TableHead>
                          <TableHead>{t("total") || "Total"}</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {portfolio.transactionHistoryExample.map(
                          (transaction) => (
                            <TableRow key={transaction.id}>
                              <TableCell>
                                <div className="font-mono text-sm">
                                  {new Date(
                                    transaction.date
                                  ).toLocaleDateString("fr-DZ")}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    transaction.type === "BUY"
                                      ? "default"
                                      : "destructive"
                                  }
                                  className={
                                    transaction.type === "BUY"
                                      ? "bg-green-100 text-green-800 hover:bg-green-200"
                                      : "bg-red-100 text-red-800 hover:bg-red-200"
                                  }
                                >
                                  {transaction.type === "BUY" ? (
                                    <ArrowUpRight className="h-3 w-3 mr-1" />
                                  ) : (
                                    <ArrowDownRight className="h-3 w-3 mr-1" />
                                  )}
                                  {transaction.type}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    transaction.status === "completed"
                                      ? "default"
                                      : "secondary"
                                  }
                                  className={
                                    transaction.status === "completed"
                                      ? "bg-blue-100 text-blue-800 hover:bg-blue-200"
                                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                                  }
                                >
                                  {transaction.status === "completed"
                                    ? t("completed") || "Completed"
                                    : t("pending") || "Pending"}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="flex flex-col">
                                  <div className="font-medium text-sm">
                                    {transaction.name}
                                  </div>
                                  <div className="text-xs text-gray-500 font-mono">
                                    {transaction.symbol}
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="font-mono text-sm">
                                  {transaction.quantity.toLocaleString("fr-DZ")}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="font-mono text-sm">
                                  {formatCurrency(transaction.price)}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="font-medium font-mono text-sm">
                                  {formatCurrency(transaction.total)}
                                </div>
                              </TableCell>
                            </TableRow>
                          )
                        )}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              {t("noPortfolioData") ||
                "No portfolio data available for this client."}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Related Users Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
              <Plus className="h-4 w-4 text-gray-600" />
            </div>
            {t("relatedUsers")}
          </CardTitle>
          <Button
            size="sm"
            onClick={() => router.push(`/clients/${clientId}/users/new`)}
          >
            <Plus className="h-4 w-4 mr-2" />
            {t("addUser")}
          </Button>
        </CardHeader>
        <CardContent>
          {loadingUsers ? (
            <Loading className="min-h-[200px]" />
          ) : clientUsers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {t("noUsersFound")}
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("name")}</TableHead>
                  <TableHead>{t("email")}</TableHead>
                  <TableHead>{t("phone")}</TableHead>
                  <TableHead>{t("userType")}</TableHead>
                  <TableHead>{t("role")}</TableHead>
                  <TableHead>{t("status")}</TableHead>
                  <TableHead className="text-right">{t("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {clientUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.firstname} {user.lastname}
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.telephone || "-"}</TableCell>
                    <TableCell>
                      {user.clientUserType === "proprietaire"
                        ? t("owner")
                        : user.clientUserType === "mandataire"
                        ? t("agent")
                        : t("legalGuardian")}
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-wrap gap-1">
                        {user.role?.map((role: string, index: number) => (
                          <Badge key={index} variant="outline">
                            {role}
                          </Badge>
                        )) || "-"}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.status === "actif" ? "default" : "destructive"
                        }
                      >
                        {user.status === "actif" ? t("active") : t("inactive")}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          router.push(`/clients/${clientId}/users/${user.id}`)
                        }
                      >
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">{t("editUser")}</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteClient")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteConfirmation")}{" "}
              <span className="font-medium">
                {client.name || client.raison_sociale}
              </span>
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={isDeleting}
            >
              {isDeleting ? t("deleting") : t("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
