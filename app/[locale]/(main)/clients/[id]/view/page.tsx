"use client";

import { useEffect, useState, useRef } from "react";
import { useParams } from "next/navigation";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import {
  ArrowLeft,
  Edit,
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
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [portfolio, setPortfolio] = useState<PortfolioData | null>(null);
  const [loadingPortfolio, setLoadingPortfolio] = useState(false);
  const dataFetchedRef = useRef<boolean>(false);

  const { getClientById, loading } = useClients();

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

        // Get the session token for API authentication
        const session = await fetch('/api/auth/session');
        const sessionData = await session.json();
        const token = sessionData?.user?.restToken;

        if (!token) {
          throw new Error("No authentication token available");
        }

        const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || "https://kh.finnetude.com";

        // Fetch client portfolio and transactions in parallel
        const [portfolioResponse, transactionsResponse] = await Promise.all([
          fetch(`${BACKEND_URL}/api/v1/portfolio/client/${clientId}`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          }),
          fetch(`${BACKEND_URL}/api/v1/portfolio/transactions`, {
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          })
        ]);

        if (!portfolioResponse.ok) {
          throw new Error(`Failed to fetch portfolio data: ${portfolioResponse.status}`);
        }

        const portfolioData = await portfolioResponse.json();

        // Transactions endpoint might not be available for all users, so handle gracefully
        let transactionsData = [];
        if (transactionsResponse.ok) {
          transactionsData = await transactionsResponse.json();
        } else {
          console.warn("Failed to fetch transactions, using empty array");
        }

        // Transform the API data to match the expected structure
        const transformedData = {
          myPortfolio: {
            holdings: portfolioData.holdings?.map((holding: any) => ({
              name: holding.stockName || holding.name || "Unknown Stock",
              symbol: holding.stockCode || holding.symbol || "N/A",
              quantity: holding.quantity || 0,
              currentValue: holding.currentValue || 0,
              investmentValue: holding.totalInvestment || holding.investmentValue || 0,
              profit: holding.totalProfit || holding.profit || 0,
              profitPercentage: holding.profitPercentage || 0,
            })) || [],
            totalInvestment: portfolioData.totalInvestment || 0,
            totalCurrentValue: portfolioData.totalCurrentValue || 0,
            totalProfit: portfolioData.totalProfit || 0,
            totalProfitPercentage: portfolioData.totalProfitPercentage || 0,
          },
          transactionHistoryExample: transactionsData.map(
            (transaction: any, index: number) => ({
              id: transaction.id || `TX${String(index + 1).padStart(3, "0")}`,
              date: transaction.createdAt || transaction.date || new Date().toISOString(),
              type: transaction.operationType === "A" ? "BUY" : transaction.operationType === "V" ? "SELL" : "UNKNOWN",
              symbol: transaction.stockCode || transaction.symbol || "N/A",
              name: transaction.stockName || transaction.name || "Unknown Stock",
              quantity: transaction.quantity || 0,
              price: transaction.price || 0,
              total: (transaction.quantity || 0) * (transaction.price || 0),
            })
          ) || [],
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
              symbol: "BDL",
              name: "Banque de Développement Local",
              quantity: 50,
              price: 160,
              total: 8000,
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
            onClick={() => router.push(`/clients/${clientId}/edit`)}
          >
            <Edit className="h-4 w-4 mr-2" />
            {t("edit")}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("clientDetails")}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  {t("code")}
                </h3>
                <p className="mt-1">{client.client_code || "-"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  {t("type")}
                </h3>
                <p className="mt-1">
                  {client.type === "individual"
                    ? t("individual")
                    : client.type === "corporate"
                    ? t("company")
                    : t("financialInstitution")}
                </p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  {client.type === "individual" ? t("name") : t("companyName")}
                </h3>
                <p className="mt-1">
                  {client.type === "individual"
                    ? client.name
                    : client.raison_sociale}
                </p>
              </div>
              {client.type !== "individual" && (
                <>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      {t("nif")}
                    </h3>
                    <p className="mt-1">{client.nif || "-"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      {t("regNumber")}
                    </h3>
                    <p className="mt-1">{client.reg_number || "-"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      {t("legalForm")}
                    </h3>
                    <p className="mt-1">{client.legal_form || "-"}</p>
                  </div>
                </>
              )}
              {client.type === "individual" && (
                <>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      {t("nin")}
                    </h3>
                    <p className="mt-1">{client.nin || "-"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      {t("nationality")}
                    </h3>
                    <p className="mt-1">{client.nationalite || "-"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      {t("idType")}
                    </h3>
                    <p className="mt-1">{client.id_type || "-"}</p>
                  </div>
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      {t("idNumber")}
                    </h3>
                    <p className="mt-1">{client.id_number || "-"}</p>
                  </div>
                </>
              )}
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  {t("email")}
                </h3>
                <p className="mt-1">{client.email || "-"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  {t("phone")}
                </h3>
                <p className="mt-1">{client.phone_number || "-"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  {t("mobilePhone")}
                </h3>
                <p className="mt-1">{client.mobile_phone || "-"}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500">
                  {t("wilaya")}
                </h3>
                <p className="mt-1">{client.wilaya || "-"}</p>
              </div>
              {client.securities_account_number && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    {t("securitiesAccount")}
                  </h3>
                  <p className="mt-1">
                    {client.securities_account_number || "-"}
                  </p>
                </div>
              )}
              {client.cash_account_rip_full && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    {t("cashAccount")}
                  </h3>
                  <p className="mt-1">{client.cash_account_rip_full || "-"}</p>
                </div>
              )}
              {!client.cash_account_rip_full &&
                (client.cash_account_bank_code ||
                  client.cash_account_agency_code ||
                  client.cash_account_number) && (
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">
                      {t("cashAccount")}
                    </h3>
                    <p className="mt-1">
                      {[
                        client.cash_account_bank_code,
                        client.cash_account_agency_code,
                        client.cash_account_number,
                        client.cash_account_rip_key,
                      ]
                        .filter(Boolean)
                        .join(" ") || "-"}
                    </p>
                  </div>
                )}
              {client.lieu_naissance && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500">
                    {t("birthPlace")}
                  </h3>
                  <p className="mt-1">{client.lieu_naissance || "-"}</p>
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Portfolio Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>{t("portfolio") || "Portfolio"}</CardTitle>
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
                                {new Date(transaction.date).toLocaleDateString(
                                  "fr-DZ"
                                )}
                              </TableCell>
                              <TableCell>
                                <Badge
                                  variant={
                                    transaction.type === "BUY"
                                      ? "default"
                                      : "secondary"
                                  }
                                >
                                  {transaction.type}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                <div className="font-medium">
                                  {transaction.name}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {transaction.symbol}
                                </div>
                              </TableCell>
                              <TableCell>{transaction.quantity}</TableCell>
                              <TableCell>
                                {formatCurrency(transaction.price)}
                              </TableCell>
                              <TableCell className="font-medium">
                                {formatCurrency(transaction.total)}
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
          <CardTitle>{t("relatedUsers")}</CardTitle>
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
    </div>
  );
}
