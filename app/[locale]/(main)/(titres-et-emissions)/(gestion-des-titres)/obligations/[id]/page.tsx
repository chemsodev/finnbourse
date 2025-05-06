"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { fetchGraphQL } from "@/app/actions/fetchGraphQL";
import { FIND_UNIQUE_BOND_QUERY } from "@/graphql/queries";
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

export default function ObligationViewPage({
  params,
}: {
  params: { id: string };
}) {
  const t = useTranslations("Obligations");
  const tableT = useTranslations("Obligations.table");
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [bond, setBond] = useState<any | null>(null);

  useEffect(() => {
    const fetchBond = async () => {
      setLoading(true);
      try {
        const response = await fetchGraphQL(FIND_UNIQUE_BOND_QUERY, {
          id: params.id,
        });

        const typedResponse = response as any;
        if (typedResponse.bond) {
          setBond(typedResponse.bond);
        } else {
          setError("Bond not found");
          toast({
            variant: "destructive",
            title: "Error",
            description: "Bond not found",
          });
        }
      } catch (error) {
        console.error("Error fetching bond:", error);
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

    fetchBond();
  }, [params.id]);

  const handleBack = () => {
    router.push("/obligations");
  };

  const handleEdit = () => {
    router.push(`/obligations/${params.id}/edit`);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "dd/MM/yyyy");
    } catch (error) {
      return "Invalid date";
    }
  };

  const getBondTypeLabel = (type: string) => {
    switch (type) {
      case "obligation":
        return tableT("obligationType");
      case "sukuk":
        return tableT("sukukType");
      case "tp":
        return tableT("tpType");
      case "eb":
        return tableT("ebType");
      default:
        return type;
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center mb-6">
          <Button variant="ghost" onClick={handleBack} className="mr-2">
            <ArrowLeft className="mr-2 h-4 w-4" />
            {tableT("title")}
          </Button>
          <Skeleton className="h-8 w-64" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-8 w-48 mb-2" />
            <Skeleton className="h-4 w-full max-w-md" />
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-8 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error || !bond) {
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
              {error || "Bond not found. Please try again."}
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
              <CardTitle className="text-2xl">{bond.name}</CardTitle>
              <CardDescription>
                {bond.issuer} • {bond.isincode}
              </CardDescription>
            </div>
            <Badge className="ml-2">{getBondTypeLabel(bond.type)}</Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">{t("basicInfo")}</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {tableT("issuer")}
                  </p>
                  <p className="font-medium">{bond.issuer}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{t("market")}</p>
                  <p className="font-medium">{bond.marketlisting}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {tableT("isin")}
                  </p>
                  <p className="font-medium">{bond.isincode}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("valueCode")}
                  </p>
                  <p className="font-medium">{bond.code}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">
                {bond.type === "obligation"
                  ? t("bondDetails")
                  : bond.type === "tp"
                  ? t("tpDetails")
                  : t("sukukDetails")}
              </h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {tableT("name")}
                  </p>
                  <p className="font-medium">{bond.name}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {tableT("nominal")}
                  </p>
                  <p className="font-medium">{bond.facevalue} DZD</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {tableT("quantity")}
                  </p>
                  <p className="font-medium">
                    {bond.quantity.toLocaleString()}
                  </p>
                </div>
                {bond.repaymentmethod && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t("repaymentMethod")}
                    </p>
                    <p className="font-medium">
                      {bond.repaymentmethod === "constant_capital"
                        ? t("constantCapital")
                        : t("constantAnnuity")}
                    </p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">{t("dates")}</h3>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("issueDate")}
                  </p>
                  <p className="font-medium">{formatDate(bond.emissiondate)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("enjoymentDate")}
                  </p>
                  <p className="font-medium">
                    {formatDate(bond.enjoymentdate)}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    {t("maturityDate")}
                  </p>
                  <p className="font-medium">{formatDate(bond.maturitydate)}</p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Financial Details</h3>
              <div className="space-y-4">
                {bond.yieldrate !== null && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t("yieldRate")}
                    </p>
                    <p className="font-medium">{bond.yieldrate}%</p>
                  </div>
                )}
                {bond.fixedrate !== null && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t("fixedRate")}
                    </p>
                    <p className="font-medium">{bond.fixedrate}%</p>
                  </div>
                )}
                {bond.variablerate !== null && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t("variableRate")}
                    </p>
                    <p className="font-medium">{bond.variablerate}%</p>
                  </div>
                )}
                {bond.estimatedrate !== null && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {t("estimatedRate")}
                    </p>
                    <p className="font-medium">{bond.estimatedrate}%</p>
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
