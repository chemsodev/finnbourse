"use client";

import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn, preventNonNumericInput } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Input } from "@/components/ui/input";
import { Save, X, Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { fr, ar, enUS } from "date-fns/locale";
import { fetchGraphQL } from "@/app/actions/fetchGraphQL";
import { CREATE_STOCK } from "@/graphql/mutations";
import { GET_LISTED_COMPANIES_QUERY } from "@/graphql/queries";
import { useTranslations, useLocale } from "next-intl";
import MyMarquee from "@/components/MyMarquee";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

// Define the form schema for actions
const formSchema = z.object({
  societeEmettrice: z.string(),
  MarcheCotation: z.string(),
  codeBourse: z.string(),
  isin: z.string(),
  valeurNominale: z.number().min(0),
  dateEmission: z.coerce.date(),
  dateJouissance: z.coerce.date(),
  nombreTitres: z.number().min(1),
  dividendrate: z.number().min(0).optional(),
  capitalOperation: z.string().optional(),
  commission: z.number().min(0).optional(),
});

interface GetListedCompaniesResponse {
  listListedCompanies: {
    id: string;
    nom: string;
  }[];
}

export default function AjoutActionPage() {
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState<GetListedCompaniesResponse | null>(
    null
  );
  const locale = useLocale();
  const t = useTranslations("Actions");

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dateEmission: new Date(),
      valeurNominale: 0,
      dateJouissance: new Date(),
      dividendrate: 0,
    },
  });

  // Fetch companies on component mount
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const response = await fetchGraphQL<GetListedCompaniesResponse>(
          GET_LISTED_COMPANIES_QUERY
        );
        setCompanies(response);
      } catch (error) {
        console.error("Error fetching companies:", error);
      }
    };

    fetchCompanies();
  }, []);

  // Handle form submission
  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      console.log(values);

      await fetchGraphQL(CREATE_STOCK, {
        name: values.codeBourse,
        isincode: values.isin,
        issuer: companies?.listListedCompanies?.find(
          (company) => company.id === values.societeEmettrice
        )?.nom,
        code: values.codeBourse,
        listedcompanyid: values.societeEmettrice,
        marketlisting: values.MarcheCotation,
        emissiondate: values.dateEmission.toISOString(),
        enjoymentdate: values.dateJouissance.toISOString(),
        quantity: values.nombreTitres,
        type: "action",
        facevalue: values.valeurNominale,
        capitaloperation: values.capitalOperation,
        commission: values.commission,
        dividendrate: values.dividendrate,
      });

      // Reset form after successful submission
      form.reset();

      // Show success message
      alert(t("form.success"));
    } catch (error) {
      console.error("Form submission error", error);
      // Show error message
      alert(
        `${t("form.error")}: ${
          error instanceof Error ? error.message : t("form.unknownError")
        }`
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="pb-6">
        <MyMarquee />
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            {t("title")}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {t("form.description") || "Enter stock details below"}
          </p>
        </div>

        <Card className="w-full max-w-5xl mx-auto shadow-lg">
          <CardHeader>
            <CardTitle className="text-2xl font-semibold text-center">
              {t("form.formTitle") || "Stock Information"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8"
              >
                {/* Company Information Section */}
                <div className="space-y-4">
                  <div className="flex items-center">
                    <h3 className="text-lg font-medium">
                      {t("form.companyInfo") || "Company Information"}
                    </h3>
                    <Separator className="flex-1 ml-4" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="societeEmettrice"
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel>{t("form.issuer")}</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  role="combobox"
                                  className={cn(
                                    "justify-between w-full",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value && companies
                                    ? companies.listListedCompanies?.find(
                                        (company) => company.id === field.value
                                      )?.nom || t("form.selectIssuer")
                                    : t("form.selectIssuer")}
                                  <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="p-0 w-[300px]">
                              <Command>
                                <CommandInput
                                  placeholder={t("form.searchIssuer")}
                                />
                                <CommandList>
                                  <CommandEmpty>
                                    {t("form.noIssuerFound")}
                                  </CommandEmpty>
                                  <CommandGroup>
                                    {companies?.listListedCompanies?.map(
                                      (company) => (
                                        <CommandItem
                                          value={company.nom}
                                          key={company.id}
                                          onSelect={() => {
                                            form.setValue(
                                              "societeEmettrice",
                                              company.id.toString()
                                            );
                                          }}
                                        >
                                          <Check
                                            className={cn(
                                              "mr-2 h-4 w-4",
                                              company.id === field.value
                                                ? "opacity-100"
                                                : "opacity-0"
                                            )}
                                          />
                                          {company.nom}
                                        </CommandItem>
                                      )
                                    )}
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="MarcheCotation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("form.market")}</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue
                                  placeholder={t("form.selectMarket")}
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Marché principal">
                                {t("form.mainMarket")}
                              </SelectItem>
                              <SelectItem value="Marché PME">
                                {t("form.smeMarket")}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="codeBourse"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("form.stockCode")}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t("form.stockCodePlaceholder")}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Stock Details Section */}
                <div className="space-y-4">
                  <div className="flex items-center">
                    <h3 className="text-lg font-medium">
                      {t("form.stockDetails") || "Stock Details"}
                    </h3>
                    <Separator className="flex-1 ml-4" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <FormField
                      control={form.control}
                      name="isin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("form.isin")}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t("form.isinPlaceholder")}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="valeurNominale"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("form.nominal")}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t("form.nominalPlaceholder")}
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                              onKeyDown={preventNonNumericInput}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="nombreTitres"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("form.quantity")}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t("form.quantityPlaceholder")}
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                              onKeyDown={preventNonNumericInput}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Dates Section */}
                <div className="space-y-4">
                  <div className="flex items-center">
                    <h3 className="text-lg font-medium">
                      {t("form.dates") || "Important Dates"}
                    </h3>
                    <Separator className="flex-1 ml-4" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="dateEmission"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("form.issueDate")}</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP", {
                                      locale:
                                        locale === "fr"
                                          ? fr
                                          : locale === "en"
                                          ? enUS
                                          : ar,
                                    })
                                  ) : (
                                    <span>{t("form.selectDate")}</span>
                                  )}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="dateJouissance"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("form.enjoymentDate")}</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP", {
                                      locale:
                                        locale === "fr"
                                          ? fr
                                          : locale === "en"
                                          ? enUS
                                          : ar,
                                    })
                                  ) : (
                                    <span>{t("form.selectDate")}</span>
                                  )}
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Financial Details Section */}
                <div className="space-y-4">
                  <div className="flex items-center">
                    <h3 className="text-lg font-medium">
                      {t("form.financialDetails") || "Financial Details"}
                    </h3>
                    <Separator className="flex-1 ml-4" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="dividendrate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("form.dividendRate")} </FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t("form.dividendRatePlaceholder")}
                              type="number"
                              step="0.01"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                              onKeyDown={preventNonNumericInput}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="commission"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("form.commission")}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t("form.commissionPlaceholder")}
                              type="number"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                              onKeyDown={preventNonNumericInput}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-4 pt-6">
                  <Button type="button" variant="outline" className="w-32">
                    <X className="mr-2 h-4 w-4" /> {t("form.cancel")}
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="mr-2 h-4 w-4" />
                    )}
                    {t("form.validate")}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
