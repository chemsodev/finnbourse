"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { fetchGraphQLClient } from "@/app/actions/clientGraphQL";
import { FIND_UNIQUE_STOCKS_QUERY } from "@/graphql/queries";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import Loading from "@/components/ui/loading";

export default function ActionViewPage({ params }: { params: { id: string } }) {
  const t = useTranslations("Actions");
  const tableT = useTranslations("Actions.table");
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stock, setStock] = useState<any | null>(null);

  useEffect(() => {
    const fetchStock = async () => {
      setLoading(true);
      try {
        const response = await fetchGraphQLClient(FIND_UNIQUE_STOCKS_QUERY, {
          id: params.id,
        });

        const typedResponse = response as any;
        if (typedResponse.findUniqueStock) {
          setStock(typedResponse.findUniqueStock);
        } else {
          setError("Stock not found");
          toast({
            variant: "destructive",
            title: "Error",
            description: "Stock not found",
          });
        }
      } catch (error) {
        console.error("Error fetching stock:", error);
        setError(String(error));
        toast({
          variant: "destructive",
          title: "Error",
          description: String(error),
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStock();
  }, [params.id]);

  const handleBack = () => {
    router.push("/actions");
  };

  const handleEdit = () => {
    router.push(`/actions/${params.id}/edit`);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "dd/MM/yyyy");
    } catch (error) {
      return "Invalid date";
    }
  };

  if (loading) {
    return <Loading className="min-h-[400px]" />;
  }

  if (error || !stock) {
    return (
      <div className="container mx-auto py-6">
        <Button variant="ghost" onClick={handleBack} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          {tableT("title")}
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>Error</CardTitle>
            <CardDescription>
              {error || "Stock not found. Please try again."}
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button onClick={handleBack}>Go back</Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-6">
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" onClick={handleBack}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          {tableT("title")}
        </Button>
        <Button onClick={handleEdit}>
          <Edit className="mr-2 h-4 w-4" />
          {tableT("edit")}
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl">{stock.name}</CardTitle>
              <CardDescription>
                {stock.issuer} • {stock.isincode}
              </CardDescription>
            </div>
            <Badge className="ml-2">
              {stock.type === "ipo" ? tableT("ipoType") : tableT("stockType")}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">{t("companyInfo")}</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {tableT("issuer")}
                  </p>
                  <p className="font-medium">{stock.issuer}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t("market")}</p>
                  <p className="font-medium">{stock.marketlisting}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">
                {t("stockDetails")}
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {tableT("name")}
                  </p>
                  <p className="font-medium">{stock.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {tableT("isin")}
                  </p>
                  <p className="font-medium">{stock.isincode}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("stockCode")}
                  </p>
                  <p className="font-medium">{stock.code}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">{t("dates")}</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("issueDate")}
                  </p>
                  <p className="font-medium">
                    {formatDate(stock.emissiondate)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("enjoymentDate")}
                  </p>
                  <p className="font-medium">
                    {formatDate(stock.enjoymentdate)}
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">
                {t("financialDetails")}
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {tableT("nominal")}
                  </p>
                  <p className="font-medium">{stock.facevalue} DZD</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {tableT("quantity")}
                  </p>
                  <p className="font-medium">
                    {stock.quantity.toLocaleString()}
                  </p>
                </div>
                {stock.dividendrate !== null && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t("dividendRate")}
                    </p>
                    <p className="font-medium">{stock.dividendrate}%</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
