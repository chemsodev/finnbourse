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
  FormDescription,
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
import { Save, X, Check, ChevronsUpDown, Loader2, Plus } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { fr, ar, enUS } from "date-fns/locale";
import { fetchGraphQL } from "@/app/actions/fetchGraphQL";
import { CREATE_BOND } from "@/graphql/mutations";
import { GET_LISTED_COMPANIES_QUERY } from "@/graphql/queries";
import { useTranslations, useLocale } from "next-intl";
import MyMarquee from "@/components/MyMarquee";
import { useFieldArray } from "react-hook-form";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";

// Define the form schema for obligations, TP, and sukuk
const formSchema = z.object({
  titre: z.string().min(1, { message: "Le titre est requis" }),
  marche: z.string().min(1, { message: "Le marché est requis" }),
  codeISIN: z.string().min(1, { message: "Le code ISIN est requis" }),
  isin: z.string().optional(),
  quantite: z.string().min(1, { message: "La quantité est requise" }),
  modeEnregistrement: z.string().optional(),
  teneurDuCompteConservateur: z.string().optional(),
  code1: z.string().optional(),
  code2: z.string().optional(),
  codeValeur: z.string().min(1, { message: "Le code valeur est requis" }),
  typeTitre: z.string().optional(),
  emetteur: z.string().min(1, { message: "L'émetteur est requis" }),
  devise: z.string().optional(),
  natureJuridique: z.string().optional(),
  depositaire: z.string().optional(),
  titreLocal: z.string().optional(),
  nombreTotalTitres: z
    .string()
    .min(1, { message: "Le nombre total de titres est requis" }),
  ordreALaCote: z.string().optional(),
  dPresentation: z.string().optional(),
  dateReference: z.coerce.date().optional(),
  remunerationALaSource: z.string().optional(),
  dureeDeVie: z.string().optional(),
  nominal: z.string().min(1, { message: "Le nominal est requis" }),
  dateEmission: z.coerce.date(),
  dateJouissance: z.coerce.date(),
  dateEcheance: z.coerce.date().optional(),
  tauxRendement: z.string().optional(),
  tauxCoupon: z.string().optional(),
  modeRemboursement: z.string().optional(),
  coteEnBourse: z.boolean().default(false),
  // Fields specific to sukuk
  tauxEstime: z.string().optional(),
  tauxVariable: z.string().optional(),
  // Fields specific to TP
  tauxFixe: z.string().optional(),
  // Common fields for all types
  commission: z.string().optional(),
  couponSchedule: z
    .array(
      z.object({
        year: z.number().int().positive(),
        rate: z.number().positive(),
      })
    )
    .optional(),
});

interface GetListedCompaniesResponse {
  listListedCompanies: {
    id: string;
    nom: string;
  }[];
}

export default function AjoutObligationPage() {
  const [loading, setLoading] = useState(false);
  const [companies, setCompanies] = useState<GetListedCompaniesResponse | null>(
    null
  );
  const [selectedType, setSelectedType] = useState("obligation");
  const locale = useLocale();

  // Get translations
  const t = useTranslations("Obligations");

  // Initialize the form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titre: "",
      marche: "",
      codeISIN: "",
      isin: "",
      quantite: "",
      modeEnregistrement: "",
      teneurDuCompteConservateur: "",
      code1: "",
      code2: "",
      codeValeur: "",
      typeTitre: "obligation",
      emetteur: "",
      devise: "DZD",
      natureJuridique: "",
      depositaire: "",
      titreLocal: "",
      nombreTotalTitres: "",
      ordreALaCote: "",
      dPresentation: "",
      remunerationALaSource: "",
      dureeDeVie: "",
      nominal: "",
      dateEmission: new Date(),
      dateJouissance: new Date(),
      dateEcheance: new Date(
        new Date().setFullYear(new Date().getFullYear() + 5)
      ),
      tauxRendement: "",
      tauxCoupon: "",
      modeRemboursement: "",
      tauxEstime: "",
      tauxVariable: "",
      tauxFixe: "",
      commission: "",
      coteEnBourse: false,
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "couponSchedule",
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

      await fetchGraphQL(CREATE_BOND, {
        name: values.titre,
        isincode: values.codeISIN,
        issuer: companies?.listListedCompanies?.find(
          (company) => company.id === values.emetteur
        )?.nom,
        code: values.codeValeur,
        listedcompanyid: values.emetteur,
        marketlisting: values.marche,
        emissiondate: values.dateEmission.toISOString(),
        enjoymentdate: values.dateJouissance.toISOString(),
        maturitydate: values.dateEcheance?.toISOString(),
        quantity: Number.parseInt(values.nombreTotalTitres || "0"),
        type: selectedType,
        facevalue: Number.parseFloat(values.nominal || "0"),
        repaymentmethod: values.modeRemboursement,
        yieldrate: Number.parseFloat(values.tauxRendement || "0"),
        couponschedule: fields?.map((field) => ({
          year: field.year,
          rate: field.rate,
        })),
        fixedrate: values.tauxFixe,
        variablerate: values.tauxVariable,
        estimatedrate: values.tauxEstime,
        commission: Number.parseFloat(values.commission || "0"),
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
    <div className="container mx-auto pb-6">
      <div className="pb-6">
        <MyMarquee />
      </div>

      <Tabs
        defaultValue="obligation"
        onValueChange={setSelectedType}
        className="mb-6"
      >
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="obligation">{t("tabs.obligation")}</TabsTrigger>
          <TabsTrigger value="titresparticipatifs">{t("tabs.tp")}</TabsTrigger>
          <TabsTrigger value="sukuk">{t("tabs.sukuk")}</TabsTrigger>
        </TabsList>
      </Tabs>

      <h1 className="text-3xl text-secondary font-bold mb-6">
        {selectedType === "obligation"
          ? t("title.obligation")
          : selectedType === "titresparticipatifs"
          ? t("title.tp")
          : t("title.sukuk")}
      </h1>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Row 1 */}
            <FormField
              control={form.control}
              name="titre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.title")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("form.titlePlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="marche"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.market")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("form.selectMarket")} />
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

            {/* Row 2 */}
            <FormField
              control={form.control}
              name="isin"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.isin")}</FormLabel>
                  <FormControl>
                    <Input placeholder={t("form.isinPlaceholder")} {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

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

            {/* Row 3 */}
            <FormField
              control={form.control}
              name="teneurDuCompteConservateur"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.accountKeeper")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("form.selectAccountKeeper")}
                        />
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

            {/* Row 4 */}
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
                    onValueChange={(value) => {
                      field.onChange(value);
                      setSelectedType(value);
                    }}
                    value={selectedType}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder={t("form.selectType")} />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="obligation">
                        {t("form.obligation")}
                      </SelectItem>
                      <SelectItem value="titresparticipatifs">
                        {t("form.tp")}
                      </SelectItem>
                      <SelectItem value="sukuk">{t("form.sukuk")}</SelectItem>
                    </SelectContent>
                  </Select>
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

            {/* Row 6 */}
            <FormField
              control={form.control}
              name="titreLocal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.localSecurity")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("form.selectLocalSecurity")}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Oui">{t("form.yes")}</SelectItem>
                      <SelectItem value="Non">{t("form.no")}</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

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
              name="ordreALaCote"
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

            {/* Row 7 */}
            <FormField
              control={form.control}
              name="dPresentation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.presentation")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("form.presentationPlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="remunerationALaSource"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.sourceRemuneration")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("form.sourceRemunerationPlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dureeDeVie"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.lifespan")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("form.lifespanPlaceholder")}
                      {...field}
                      type="number"
                      onKeyDown={preventNonNumericInput}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Row 8 */}
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
          </div>

          {/* Date fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="dateReference"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{t("form.referenceDate")}</FormLabel>
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
                        locale={
                          locale === "fr" ? fr : locale === "en" ? enUS : ar
                        }
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

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
                        locale={
                          locale === "fr" ? fr : locale === "en" ? enUS : ar
                        }
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
                        locale={
                          locale === "fr" ? fr : locale === "en" ? enUS : ar
                        }
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Bond specific fields */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="dateEcheance"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{t("form.maturityDate")}</FormLabel>
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
                        locale={
                          locale === "fr" ? fr : locale === "en" ? enUS : ar
                        }
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="tauxRendement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.yieldRate")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("form.yieldRatePlaceholder")}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="modeRemboursement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.repaymentMethod")}</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue
                          placeholder={t("form.selectRepaymentMethod")}
                        />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="Infine">Infine</SelectItem>
                      <SelectItem value="Par capital constant">
                        {t("form.constantCapital")}
                      </SelectItem>
                      <SelectItem value="Par annuité constante">
                        {t("form.constantAnnuity")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Type-specific fields */}
          {selectedType === "obligation" && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">
                {t("form.couponSchedule")}
              </h3>
              {fields?.map((field, index) => (
                <div key={field.id} className="flex gap-4 items-end">
                  <FormField
                    control={form.control}
                    name={`couponSchedule.${index}.year`}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>{t("form.year")}</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            placeholder={t("form.yearPlaceholder")}
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
                    name={`couponSchedule.${index}.rate`}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormLabel>{t("form.rate")} (%)</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder={t("form.ratePlaceholder")}
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
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={() => remove(index)}
                    className="mb-1"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                type="button"
                variant="outline"
                onClick={() => append({ year: 1, rate: 0 })}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" /> {t("form.addCoupon")}
              </Button>
            </div>
          )}

          {/* TP specific fields */}
          {selectedType === "titresparticipatifs" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="tauxFixe"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.fixedRate")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("form.fixedRatePlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tauxVariable"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.variableRate")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("form.variableRatePlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* Sukuk specific fields */}
          {selectedType === "sukuk" && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="tauxEstime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.estimatedRate")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("form.estimatedRatePlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tauxVariable"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("form.variableRate")}</FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("form.variableRatePlaceholder")}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          )}

          {/* Common fields for all types */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="commission"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("form.commission")}</FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("form.commissionPlaceholder")}
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
              name="coteEnBourse"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Coté en bourse</FormLabel>
                    <FormDescription>
                      {field.value ? "Oui" : "Non"}
                    </FormDescription>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
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
