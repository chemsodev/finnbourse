"use client";

import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
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
import { Checkbox } from "@/components/ui/checkbox";
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
import { useTranslations } from "next-intl";
import MyMarquee from "@/components/MyMarquee";

// Define the form schema based on the original ajout-titre.tsx
const formSchema = z.object({
  quantite: z.string().optional(),
  nombreTotalTitres: z.string().optional(),
  code1: z.string().optional(),
  code2: z.string().optional(),
  codeValeur: z.string().optional(),
  typeTitre: z.string().optional(),
  codeISIN: z.string().optional(),
  nominal: z.string().optional(),
  libelleCourt: z.string().optional(),
  emetteur: z.string().optional(),
  libelleLong: z.string().optional(),
  modeCotation: z.string().optional(),
  natureJuridique: z.string().optional(),
  typeCotation: z.string().optional(),
  depositaire: z.string().optional(),
  tauxVariation: z.string().optional(),
  devise: z.string().optional(),
  ordreCote: z.string().optional(),
  titreParent: z.string().optional(),
  modeEnregistrement: z.string().optional(),
  titreLocal: z.string().optional(),
  refSource: z.string().optional(),
  teneurRegistre: z.string().optional(),
  secteurEconomique: z.string().optional(),
  statusTitre: z.string().optional(),
  droitGarde: z.boolean().default(false),
  fraisTransaction: z.boolean().default(false),
  plusInformation: z.boolean().default(false),
  dateBourse: z.boolean().default(false),
  dateEmission: z.coerce.date().optional(),
  dateJouissance: z.coerce.date().optional(),
});

interface GetListedCompaniesResponse {
  listListedCompanies: {
    id: string;
    nom: string;
  }[];
}

export default function AjoutTitrePage() {
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState<GetListedCompaniesResponse | null>(
    null
  );
  const [open, setOpen] = useState(false);

  // Get translations
  const t = useTranslations("Actions");

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      quantite: "",
      nombreTotalTitres: "",
      code1: "",
      code2: "",
      codeValeur: "",
      typeTitre: "",
      codeISIN: "",
      nominal: "",
      libelleCourt: "",
      emetteur: "",
      libelleLong: "",
      modeCotation: "",
      natureJuridique: "",
      typeCotation: "",
      depositaire: "",
      tauxVariation: "",
      devise: "",
      ordreCote: "",
      titreParent: "",
      modeEnregistrement: "",
      titreLocal: "",
      refSource: "",
      teneurRegistre: "",
      secteurEconomique: "",
      statusTitre: "",
      droitGarde: false,
      fraisTransaction: false,
      plusInformation: false,
      dateBourse: false,
      dateEmission: new Date(),
      dateJouissance: new Date(),
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
        name: values.codeValeur,
        isincode: values.codeISIN,
        issuer: companies?.listListedCompanies?.find(
          (company) => company.id === values.emetteur
        )?.nom,
        code: values.codeValeur,
        listedcompanyid: values.emetteur,
        marketlisting: values.modeCotation,
        emissiondate: values.dateEmission?.toISOString(),
        enjoymentdate: values.dateJouissance?.toISOString(),
        quantity: Number.parseInt(values.nombreTotalTitres || "0"),
        type: "action",
        facevalue: Number.parseFloat(values.nominal || "0"),
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
    <div className="container mx-auto mb-6">
      <div className="mb-6">
        <MyMarquee />
      </div>
      <h1 className="text-3xl text-secondary font-bold mb-6">{t("title")}</h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Row 1 */}
            <FormField
              control={form.control}
              name="quantite"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.quantity")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("form.quantityPlaceholder")}
                      {...field}
                      type="number"
                      onKeyDown={preventNonNumericInput}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Row 2 */}
            <FormField
              control={form.control}
              name="nombreTotalTitres"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.totalShares")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("form.totalSharesPlaceholder")}
                      {...field}
                      type="number"
                      onKeyDown={preventNonNumericInput}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="code1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.code1")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("form.code1Placeholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="code2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.code2")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("form.code2Placeholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Row 3 */}
            <FormField
              control={form.control}
              name="codeValeur"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.valueCode")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("form.valueCodePlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="typeTitre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.securityType")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("form.selectType")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="action">{t("form.action")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="codeISIN"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.isinCode")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("form.isinCodePlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Row 4 */}
            <FormField
              control={form.control}
              name="nominal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.nominal")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("form.nominalPlaceholder")}
                      {...field}
                      type="number"
                      onKeyDown={preventNonNumericInput}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="libelleCourt"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.shortLabel")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("form.shortLabelPlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="emetteur"
              render={({ field }) => (
                <FormItem>
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
                    <PopoverContent className="p-0 w-full">
                      <Command>
                        <CommandInput placeholder={t("form.searchIssuer")} />
                        <CommandList>
                          <CommandEmpty>{t("form.noIssuerFound")}</CommandEmpty>
                          <CommandGroup>
                            {companies?.listListedCompanies?.map((company) => (
                              <CommandItem
                                value={company.nom}
                                key={company.id}
                                onSelect={() => {
                                  form.setValue(
                                    "emetteur",
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
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Row 5 */}
            <FormField
              control={form.control}
              name="libelleLong"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.longLabel")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("form.longLabelPlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="modeCotation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.quotationMode")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("form.selectMode")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Continu">
                        {t("form.continuous")}
                      </SelectItem>
                      <SelectItem value="Fixing">{t("form.fixing")}</SelectItem>
                      <SelectItem value="Bloc">{t("form.block")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="natureJuridique"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.legalNature")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("form.selectNature")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="SPA">SPA</SelectItem>
                      <SelectItem value="SARL">SARL</SelectItem>
                      <SelectItem value="EURL">EURL</SelectItem>
                      <SelectItem value="SNC">SNC</SelectItem>
                      <SelectItem value="SCS">SCS</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Row 6 */}
            <FormField
              control={form.control}
              name="typeCotation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.quotationType")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("form.selectQuotationType")}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Ordinaire">
                        {t("form.ordinary")}
                      </SelectItem>
                      <SelectItem value="Préférentielle">
                        {t("form.preferential")}
                      </SelectItem>
                      <SelectItem value="Prioritaire">
                        {t("form.priority")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="depositaire"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.custodian")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("form.selectCustodian")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Algérie Clearing">
                        Algérie Clearing
                      </SelectItem>
                      <SelectItem value="Banque">{t("form.bank")}</SelectItem>
                      <SelectItem value="Autre">{t("form.other")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tauxVariation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.variationRate")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("form.variationRatePlaceholder")}
                      {...field}
                      type="number"
                      onKeyDown={preventNonNumericInput}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Row 7 */}
            <FormField
              control={form.control}
              name="devise"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.currency")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("form.selectCurrency")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="DZD">DZD</SelectItem>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="ordreCote"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.listingOrder")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("form.listingOrderPlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="titreParent"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.parentSecurity")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("form.selectParentSecurity")}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="none">{t("form.none")}</SelectItem>
                      {/* This would ideally be populated from your API */}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Row 8 */}
            <FormField
              control={form.control}
              name="modeEnregistrement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.registrationMode")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("form.selectRegistrationMode")}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Nominatif">
                        {t("form.nominative")}
                      </SelectItem>
                      <SelectItem value="Au porteur">
                        {t("form.bearer")}
                      </SelectItem>
                      <SelectItem value="Mixte">{t("form.mixed")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="titreLocal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.localSecurity")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("form.localSecurityPlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="refSource"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.sourceRef")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("form.sourceRefPlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Row 9 */}
            <FormField
              control={form.control}
              name="teneurRegistre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.registryKeeper")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("form.selectRegistryKeeper")}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Algérie Clearing">
                        Algérie Clearing
                      </SelectItem>
                      <SelectItem value="Émetteur">
                        {t("form.issuer")}
                      </SelectItem>
                      <SelectItem value="Autre">{t("form.other")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="secteurEconomique"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.economicSector")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("form.selectEconomicSector")}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Finance">
                        {t("form.finance")}
                      </SelectItem>
                      <SelectItem value="Industrie">
                        {t("form.industry")}
                      </SelectItem>
                      <SelectItem value="Services">
                        {t("form.services")}
                      </SelectItem>
                      <SelectItem value="Agriculture">
                        {t("form.agriculture")}
                      </SelectItem>
                      <SelectItem value="Technologie">
                        {t("form.technology")}
                      </SelectItem>
                      <SelectItem value="Énergie">
                        {t("form.energy")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="statusTitre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.securityStatus")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("form.selectStatus")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Actif">{t("form.active")}</SelectItem>
                      <SelectItem value="Suspendu">
                        {t("form.suspended")}
                      </SelectItem>
                      <SelectItem value="Radié">{t("form.deleted")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Date fields */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="dateEmission"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{t("form.issueDate")}</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "dd/MM/yyyy", {
                              locale: fr,
                            })
                          ) : (
                            <span>{t("form.selectDate")}</span>
                          )}
                          <span className="ml-auto h-4 w-4 opacity-50">📅</span>
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        captionLayout="dropdown-buttons"
                        fromYear={1950}
                        toYear={2050}
                        locale={fr}
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
                <FormItem className="flex flex-col">
                  <FormLabel>{t("form.enjoymentDate")}</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "dd/MM/yyyy", {
                              locale: fr,
                            })
                          ) : (
                            <span>{t("form.selectDate")}</span>
                          )}
                          <span className="ml-auto h-4 w-4 opacity-50">📅</span>
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        captionLayout="dropdown-buttons"
                        fromYear={1950}
                        toYear={2050}
                        locale={fr}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Checkboxes */}
          <div className="flex flex-wrap gap-4 justify-center">
            <FormField
              control={form.control}
              name="droitGarde"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2 space-y-0 bg-muted/20 px-4 py-2 rounded-md">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal cursor-pointer">
                    {t("form.custodyRight")}
                  </FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="fraisTransaction"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2 space-y-0 bg-muted/20 px-4 py-2 rounded-md">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal cursor-pointer">
                    {t("form.transactionFees")}
                  </FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="plusInformation"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2 space-y-0 bg-muted/20 px-4 py-2 rounded-md">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal cursor-pointer">
                    {t("form.moreInformation")}
                  </FormLabel>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dateBourse"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center space-x-2 space-y-0 bg-muted/20 px-4 py-2 rounded-md">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <FormLabel className="font-normal cursor-pointer">
                    {t("form.stockExchangeDate")}
                  </FormLabel>
                </FormItem>
              )}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 pt-4">
            <Button type="button" variant="outline">
              <X className="mr-2 h-4 w-4" /> {t("form.cancel")}
            </Button>
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              <Save className="mr-2 h-4 w-4" /> {t("form.validate")}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
