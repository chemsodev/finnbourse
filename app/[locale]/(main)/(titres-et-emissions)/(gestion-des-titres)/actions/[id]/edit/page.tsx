"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { fetchGraphQL } from "@/app/actions/fetchGraphQL";
import { FIND_UNIQUE_STOCKS_QUERY } from "@/graphql/queries";
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
  dividendrate?: number;
  type: string;
}

export default function ActionEditPage({ params }: { params: { id: string } }) {
  const t = useTranslations("Actions");
  const tableT = useTranslations("Actions.table");
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
    dividendrate: undefined,
    type: "stock",
  });

  useEffect(() => {
    const fetchStock = async () => {
      setLoading(true);
      try {
        const response = await fetchGraphQL(FIND_UNIQUE_STOCKS_QUERY, {
          id: params.id,
        });

        const typedResponse = response as any;
        if (typedResponse.stock) {
          const stock = typedResponse.stock;
          setFormData({
            name: stock.name || "",
            issuer: stock.issuer || "",
            marketlisting: stock.marketlisting || "",
            code: stock.code || "",
            isincode: stock.isincode || "",
            facevalue: stock.facevalue || 0,
            quantity: stock.quantity || 0,
            emissiondate: stock.emissiondate
              ? new Date(stock.emissiondate)
              : undefined,
            enjoymentdate: stock.enjoymentdate
              ? new Date(stock.enjoymentdate)
              : undefined,
            dividendrate: stock.dividendrate,
            type: stock.type || "stock",
          });
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
    router.push(`/actions/${params.id}`);
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
      };

      const response = await fetchGraphQL("UPDATE_STOCK", {
        id: params.id,
        data: formattedData,
      });

      const typedResponse = response as any;
      if (typedResponse.updateStock) {
        toast({
          title: "Success",
          description: "Stock updated successfully",
        });
        router.push(`/actions/${params.id}`);
      } else {
        throw new Error("Failed to update stock");
      }
    } catch (error) {
      console.error("Error updating stock:", error);
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
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={handleBack} className="mr-2">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">
          {t("formTitle")} - {formData.name}
        </h1>
      </div>

      <form onSubmit={handleSubmit}>
        <Tabs defaultValue="basic" className="space-y-4">
          <TabsList className="grid w-full md:w-auto md:inline-grid grid-cols-2 md:grid-cols-4">
            <TabsTrigger value="basic">{t("companyInfo")}</TabsTrigger>
            <TabsTrigger value="details">{t("stockDetails")}</TabsTrigger>
            <TabsTrigger value="dates">{t("dates")}</TabsTrigger>
            <TabsTrigger value="financial">{t("financialDetails")}</TabsTrigger>
          </TabsList>

          <TabsContent value="basic">
            <Card>
              <CardHeader>
                <CardTitle>{t("companyInfo")}</CardTitle>
                <CardDescription>{t("description")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                <CardTitle>{t("stockDetails")}</CardTitle>
                <CardDescription>{t("description")}</CardDescription>
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
                      placeholder={t("title")}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="code">{t("stockCode")}</Label>
                    <Input
                      id="code"
                      name="code"
                      value={formData.code}
                      onChange={handleInputChange}
                      placeholder={t("stockCodePlaceholder")}
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
                    <Label htmlFor="type">{t("securityType")}</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) =>
                        handleSelectChange("type", value)
                      }
                    >
                      <SelectTrigger id="type">
                        <SelectValue placeholder={t("selectType")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="stock">
                          {tableT("stockType")}
                        </SelectItem>
                        <SelectItem value="ipo">{tableT("ipoType")}</SelectItem>
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
                <CardDescription>{t("description")}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="financial">
            <Card>
              <CardHeader>
                <CardTitle>{t("financialDetails")}</CardTitle>
                <CardDescription>{t("description")}</CardDescription>
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
                      placeholder={t("quantityPlaceholder")}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="dividendrate">{t("dividendRate")}</Label>
                    <Input
                      id="dividendrate"
                      name="dividendrate"
                      type="number"
                      value={
                        formData.dividendrate === undefined
                          ? ""
                          : formData.dividendrate
                      }
                      onChange={handleInputChange}
                      placeholder={t("dividendRatePlaceholder")}
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
                {t("saving")}
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
