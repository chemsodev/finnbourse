"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { fetchGraphQLClient } from "@/app/actions/clientGraphQL";
import { FIND_UNIQUE_BOND_QUERY } from "@/graphql/queries";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";

interface FormData {
  name: string;
  issuer: string;
  marketlisting: string;
  code: string;
  isincode: string;
  facevalue: number;
  quantity: number;
  emissiondate: Date | undefined;
  enjoymentdate: Date | undefined;
  maturitydate: Date | undefined;
  repaymentmethod: string;
  yieldrate?: number;
  estimatedrate?: number;
  fixedrate?: number;
  variablerate?: number;
  type: string;
}

export default function ObligationEditPage({
  params,
}: {
  params: { id: string };
}) {
  const t = useTranslations("Obligations");
  const tableT = useTranslations("Obligations.table");
  const router = useRouter();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    issuer: "",
    marketlisting: "",
    code: "",
    isincode: "",
    facevalue: 0,
    quantity: 0,
    emissiondate: undefined,
    enjoymentdate: undefined,
    maturitydate: undefined,
    repaymentmethod: "constant_capital",
    yieldrate: undefined,
    estimatedrate: undefined,
    fixedrate: undefined,
    variablerate: undefined,
    type: "obligation",
  });

  useEffect(() => {
    const fetchBond = async () => {
      setLoading(true);
      try {
        const response = await fetchGraphQLClient(FIND_UNIQUE_BOND_QUERY, {
          id: params.id,
        });

        const typedResponse = response as any;
        if (typedResponse.bond) {
          const bond = typedResponse.bond;
          setFormData({
            name: bond.name || "",
            issuer: bond.issuer || "",
            marketlisting: bond.marketlisting || "",
            code: bond.code || "",
            isincode: bond.isincode || "",
            facevalue: bond.facevalue || 0,
            quantity: bond.quantity || 0,
            emissiondate: bond.emissiondate
              ? new Date(bond.emissiondate)
              : undefined,
            enjoymentdate: bond.enjoymentdate
              ? new Date(bond.enjoymentdate)
              : undefined,
            maturitydate: bond.maturitydate
              ? new Date(bond.maturitydate)
              : undefined,
            repaymentmethod: bond.repaymentmethod || "constant_capital",
            yieldrate: bond.yieldrate,
            estimatedrate: bond.estimatedrate,
            fixedrate: bond.fixedrate,
            variablerate: bond.variablerate,
            type: bond.type || "obligation",
          });
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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    // For number inputs, convert the value to a number
    if (type === "number") {
      setFormData({
        ...formData,
        [name]: value === "" ? "" : Number(value),
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleDateChange = (name: string, date: Date | undefined) => {
    setFormData({
      ...formData,
      [name]: date,
    });
  };

  const handleBack = () => {
    router.push(`/obligations/${params.id}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      // Format dates for GraphQL
      const formattedData = {
        ...formData,
        emissiondate: formData.emissiondate
          ? formData.emissiondate.toISOString()
          : null,
        enjoymentdate: formData.enjoymentdate
          ? formData.enjoymentdate.toISOString()
          : null,
        maturitydate: formData.maturitydate
          ? formData.maturitydate.toISOString()
          : null,
      };

      const response = await fetchGraphQLClient("UPDATE_BOND", {
        id: params.id,
        data: formattedData,
      });

      const typedResponse = response as any;
      if (typedResponse.updateBond) {
        toast({
          title: "Success",
          description: "Bond updated successfully",
        });
        router.push(`/obligations/${params.id}`);
      } else {
        throw new Error("Failed to update bond");
      }
    } catch (error) {
      console.error("Error updating bond:", error);
      setError(String(error));
      toast({
        variant: "destructive",
        title: "Error",
        description: String(error),
      });
    } finally {
      setSaving(false);
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
            Back
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
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error && !formData.name) {
    return (
      <div className="container mx-auto py-6">
        <Button variant="ghost" onClick={handleBack} className="mb-6">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
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
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={handleBack} className="mr-2">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">
          {formData.type === "obligation"
            ? t("obligationTitle")
            : formData.type === "sukuk"
            ? t("sukukTitle")
            : formData.type === "tp"
            ? t("tpTitle")
            : t("ebTitle")}{" "}
          - {formData.name}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="basic" className="space-y-4">
          <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="basic">{t("basicInfo")}</TabsTrigger>
            <TabsTrigger value="details">
              {formData.type === "obligation"
                ? t("bondDetails")
                : formData.type === "tp"
                ? t("tpDetails")
                : t("sukukDetails")}
            </TabsTrigger>
            <TabsTrigger value="dates">{t("dates")}</TabsTrigger>
            <TabsTrigger value="financial">Financial Details</TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle>{t("basicInfo")}</CardTitle>
                <CardDescription>{t("title")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="type">Type</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) =>
                        handleSelectChange("type", value)
                      }
                    >
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="obligation">
                          {tableT("obligationType")}
                        </SelectItem>
                        <SelectItem value="sukuk">
                          {tableT("sukukType")}
                        </SelectItem>
                        <SelectItem value="tp">{tableT("tpType")}</SelectItem>
                        <SelectItem value="eb">{tableT("ebType")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="issuer">{t("issuer")}</Label>
                    <Input
                      id="issuer"
                      name="issuer"
                      value={formData.issuer}
                      onChange={handleInputChange}
                      placeholder={t("selectIssuer")}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="marketlisting">{t("market")}</Label>
                    <Select
                      value={formData.marketlisting}
                      onValueChange={(value) =>
                        handleSelectChange("marketlisting", value)
                      }
                    >
                      <SelectTrigger id="marketlisting">
                        <SelectValue placeholder={t("selectMarket")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="main">{t("mainMarket")}</SelectItem>
                        <SelectItem value="sme">{t("smeMarket")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="details">
            <Card>
              <CardHeader>
                <CardTitle>
                  {formData.type === "obligation"
                    ? t("bondDetails")
                    : formData.type === "tp"
                    ? t("tpDetails")
                    : t("sukukDetails")}
                </CardTitle>
                <CardDescription>{t("title")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{tableT("name")}</Label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder={t("titlePlaceholder")}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="code">{t("valueCode")}</Label>
                    <Input
                      id="code"
                      name="code"
                      value={formData.code}
                      onChange={handleInputChange}
                      placeholder={t("valueCodePlaceholder")}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="isincode">{t("isinCode")}</Label>
                    <Input
                      id="isincode"
                      name="isincode"
                      value={formData.isincode}
                      onChange={handleInputChange}
                      placeholder={t("isinCodePlaceholder")}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="repaymentmethod">
                      {t("repaymentMethod")}
                    </Label>
                    <Select
                      value={formData.repaymentmethod}
                      onValueChange={(value) =>
                        handleSelectChange("repaymentmethod", value)
                      }
                    >
                      <SelectTrigger id="repaymentmethod">
                        <SelectValue placeholder={t("selectRepaymentMethod")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="constant_capital">
                          {t("constantCapital")}
                        </SelectItem>
                        <SelectItem value="constant_annuity">
                          {t("constantAnnuity")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="dates">
            <Card>
              <CardHeader>
                <CardTitle>{t("dates")}</CardTitle>
                <CardDescription>{t("selectDate")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="emissiondate">{t("issueDate")}</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.emissiondate && "text-muted-foreground"
                          )}
                        >
                          {formData.emissiondate ? (
                            format(formData.emissiondate, "PPP")
                          ) : (
                            <span>{t("selectDate")}</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.emissiondate}
                          onSelect={(date) =>
                            handleDateChange("emissiondate", date)
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="enjoymentdate">{t("enjoymentDate")}</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.enjoymentdate && "text-muted-foreground"
                          )}
                        >
                          {formData.enjoymentdate ? (
                            format(formData.enjoymentdate, "PPP")
                          ) : (
                            <span>{t("selectDate")}</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.enjoymentdate}
                          onSelect={(date) =>
                            handleDateChange("enjoymentdate", date)
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maturitydate">{t("maturityDate")}</Label>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full justify-start text-left font-normal",
                            !formData.maturitydate && "text-muted-foreground"
                          )}
                        >
                          {formData.maturitydate ? (
                            format(formData.maturitydate, "PPP")
                          ) : (
                            <span>{t("selectDate")}</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={formData.maturitydate}
                          onSelect={(date) =>
                            handleDateChange("maturitydate", date)
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financial">
            <Card>
              <CardHeader>
                <CardTitle>Financial Details</CardTitle>
                <CardDescription>{t("bondDetails")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="facevalue">{tableT("nominal")}</Label>
                    <Input
                      id="facevalue"
                      name="facevalue"
                      type="number"
                      value={formData.facevalue}
                      onChange={handleInputChange}
                      placeholder={t("nominalPlaceholder")}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantity">{tableT("quantity")}</Label>
                    <Input
                      id="quantity"
                      name="quantity"
                      type="number"
                      value={formData.quantity}
                      onChange={handleInputChange}
                      placeholder={t("totalSharesPlaceholder")}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="yieldrate">{t("yieldRate")}</Label>
                    <Input
                      id="yieldrate"
                      name="yieldrate"
                      type="number"
                      value={
                        formData.yieldrate === undefined
                          ? ""
                          : formData.yieldrate
                      }
                      onChange={handleInputChange}
                      placeholder={t("yieldRatePlaceholder")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="fixedrate">{t("fixedRate")}</Label>
                    <Input
                      id="fixedrate"
                      name="fixedrate"
                      type="number"
                      value={
                        formData.fixedrate === undefined
                          ? ""
                          : formData.fixedrate
                      }
                      onChange={handleInputChange}
                      placeholder={t("fixedRatePlaceholder")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="variablerate">{t("variableRate")}</Label>
                    <Input
                      id="variablerate"
                      name="variablerate"
                      type="number"
                      value={
                        formData.variablerate === undefined
                          ? ""
                          : formData.variablerate
                      }
                      onChange={handleInputChange}
                      placeholder={t("variableRatePlaceholder")}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="estimatedrate">{t("estimatedRate")}</Label>
                    <Input
                      id="estimatedrate"
                      name="estimatedrate"
                      type="number"
                      value={
                        formData.estimatedrate === undefined
                          ? ""
                          : formData.estimatedrate
                      }
                      onChange={handleInputChange}
                      placeholder={t("estimatedRatePlaceholder")}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6 flex justify-end space-x-4">
          <Button variant="outline" type="button" onClick={handleBack}>
            {t("cancel")}
          </Button>
          <Button type="submit" disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {t("validate")}
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
