"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import SearchFilter from "../listed-company/search-filter";
import { useStockApi } from "@/hooks/useStockApi";
import { useRestToken } from "@/hooks/useRestToken";
import { Stock, StockType } from "@/types/gestionTitres";
import { useToast } from "@/hooks/use-toast";
import { formatDate } from "@/lib/utils";

const PrimaryMarketTable = () => {
  const router = useRouter();
  const { toast } = useToast();
  const api = useStockApi();
  const {
    isLoading: isTokenLoading,
    isAuthenticated,
    hasRestToken,
  } = useRestToken();
  const t = useTranslations("TitresTable");

  const [activeTab, setActiveTab] = useState<StockType>("action");
  const [searchTerm, setSearchTerm] = useState("");
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch stocks based on active tab
  const fetchStocks = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.filterStocks({
        marketType: "primaire",
        stockType: activeTab === "action" ? "action" : "obligation",
      });

      setStocks(response || []);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch stocks";
      setError(errorMessage);
      toast({
        variant: "destructive",
        title: t("error"),
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Don't make API calls until we're authenticated and have a REST token
    if (isAuthenticated && hasRestToken && !isTokenLoading) {
      console.log("🚀 Authentication ready, fetching primary market stocks...");
      fetchStocks();
    } else {
      console.log(
        `⏳ Waiting for authentication in PrimaryMarketTable: authenticated=${isAuthenticated}, hasToken=${hasRestToken}, loading=${isTokenLoading}`
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeTab, isAuthenticated, hasRestToken, isTokenLoading]);

  const filteredStocks = stocks.filter(
    (stock) =>
      stock.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      stock.isinCode?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleRowClick = (stockId: string) => {
    router.push(`/gestion-des-titres/marcheprimaire/${activeTab}/${stockId}`);
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "activated":
        return "bg-green-100 text-green-800 ";
      case "deactivated":
        return "bg-yellow-100 text-yellow-800 ";
      case "delisted":
        return "bg-red-100 text-red-800 ";
      default:
        return "bg-gray-100 text-gray-800 ";
    }
  };

  // Show loading state while waiting for authentication
  if (isTokenLoading || !isAuthenticated || !hasRestToken) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
          <p className="text-sm text-gray-600">
            {isTokenLoading
              ? "Loading authentication..."
              : !isAuthenticated
              ? "Please log in to continue..."
              : "Preparing data connection..."}
          </p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-center flex flex-col justify-center items-center text-red-500">
        {error}
        <Button variant="outline" onClick={fetchStocks} className="mt-4 w-fit">
          {t("retry")}
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full min-h-[400px] space-y-4">
      {/* Header and Tabs */}
      <div className="flex flex-col justify-between items-start  gap-4">
        <h2 className="text-2xl font-bold text-gray-900">{t("titre")}</h2>

        <div className="flex flex-col  gap-4 w-full sm:w-auto">
          <div className="inline-flex rounded-md shadow-sm">
            <Button
              variant={activeTab === "action" ? "default" : "outline"}
              onClick={() => setActiveTab("action")}
              className="rounded-r-none"
            >
              {t("actions")}
            </Button>
            <Button
              variant={activeTab === "obligation" ? "default" : "outline"}
              onClick={() => setActiveTab("obligation")}
              className="rounded-l-none border-l-0"
            >
              {t("obligations")}
            </Button>
          </div>

          {/* <div className="w-full sm:w-64">
            <SearchFilter
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
            />
          </div> */}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader className="bg-gray-50">
            <TableRow>
              <TableHead className="w-[120px]">{t("isinCode")}</TableHead>
              <TableHead>{t("titre")}</TableHead>
              <TableHead>{t("code")}</TableHead>
              <TableHead className="text-right">{t("faceValue")}</TableHead>
              <TableHead className="text-right">{t("quantity")}</TableHead>
              <TableHead className="text-right">{t("price")}</TableHead>
              {/* <TableHead>{t("emissionDate")}</TableHead> */}
              <TableHead>{t("status")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredStocks.length > 0 ? (
              filteredStocks.map((stock) => (
                <TableRow
                  key={stock.id ?? ""}
                  className="hover:bg-gray-50 cursor-pointer"
                  onClick={() => stock.id && handleRowClick(stock.id)}
                >
                  <TableCell className="font-medium">
                    {stock.isinCode || "N/A"}
                  </TableCell>
                  <TableCell>
                    <div className="font-medium">
                      {stock.name || "N/A"}
                      {stock.issuer && typeof stock.issuer === "object" && (
                        <div className="text-xs text-gray-500">
                          {(stock.issuer as { name: string }).name}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>{stock.code || "N/A"}</TableCell>
                  <TableCell className="text-right">
                    {stock.faceValue?.toLocaleString() || "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    {stock.quantity?.toLocaleString() || "N/A"}
                  </TableCell>
                  <TableCell className="text-right">
                    {stock.price?.toLocaleString() || "N/A"}
                  </TableCell>
                  {/* <TableCell>
                    {stock.emissionDate
                      ? formatDate(stock.emissionDate)
                      : "N/A"}
                  </TableCell> */}
                  <TableCell>
                    <span
                      className={`px-3 py-2 rounded-full text-xs ${getStatusColor(
                        stock.status
                      )}`}
                    >
                      {t(stock.status || "unknown")}
                    </span>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={8} className="text-center h-24">
                  {t("noStocksFound")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
};

export default PrimaryMarketTable;
