"use client";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
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
  FormDescription,
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

import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CirclePlus } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { GET_LISTED_COMPANIES_QUERY } from "@/graphql/queries";
import { fetchGraphQL } from "@/app/actions/fetchGraphQL";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "@/i18n/routing";
import { fr, ar, enUS } from "date-fns/locale";

interface GetListedCompaniesResponse {
  listListedCompanies: {
    id: number;
    nom: string;
  }[];
}

const formSchema = z.object({
  societeEmettrice: z.string(),
  MarcheCotation: z.string(),
  codeBourse: z.string(),
  isin: z.string(),
  valeurNominale: z.number().min(0),
  dateEmission: z.coerce.date(),
  dateJouissance: z.coerce.date(),
  dateEcheance: z.coerce.date().optional(),
  dureeVie: z.coerce.date().optional(),
  nombreTitres: z.number().min(1),
  ModeRemboursement: z.string().optional(),
  tauxRendement: z.string().optional(),
  tauxCoupon: z.boolean().default(true).optional(),
  taux: z.string().optional(),
  frequance: z.string().optional(),
  marge: z.string().optional(),
  indice: z.string().optional(),
  revision: z.string().optional(),
  maj: z.string().optional(),
  formule: z.string().optional(),
  progression: z.string().optional(),
  remuneration: z.string().optional(),
});

const ModifierTitre = ({
  type,
  titreData,
  listedCompanyData,
}: {
  type: string;
  titreData: any;
  listedCompanyData: any;
}) => {
  const locale = useLocale();
  const { toast } = useToast();
  const t = useTranslations("AjoutTitre");
  const [selectedMode, setSelectedMode] = useState("");
  const [companies, setCompanies] = useState<GetListedCompaniesResponse | null>(
    null
  );

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
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
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dateEmission: new Date(),
      dateJouissance: new Date(),
      dateEcheance: new Date(),
      dureeVie: new Date(),
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);

      // Calculate all changed fields
      const changedFields: Record<string, any> = {};

      // Common fields for both stocks and bonds
      if (values.MarcheCotation !== titreData.marketlisting) {
        changedFields.marketlisting = values.MarcheCotation;
      }
      if (values.codeBourse !== titreData.code) {
        changedFields.code = values.codeBourse;
      }
      if (values.isin !== titreData.isincode) {
        changedFields.isincode = values.isin;
      }
      if (values.valeurNominale !== titreData.facevalue) {
        changedFields.facevalue = values.valeurNominale;
      }
      if (values.nombreTitres !== titreData.quantity) {
        changedFields.quantity = values.nombreTitres;
      }

      // Handle dates
      if (values.dateEmission) {
        changedFields.emissiondate = values.dateEmission.toISOString();
      }
      if (values.dateJouissance) {
        changedFields.enjoymentdate = values.dateJouissance.toISOString();
      }

      // Bond-specific fields
      if (type === "obligation" || type === "empruntobligataire") {
        if (values.dateEcheance) {
          changedFields.maturitydate = values.dateEcheance.toISOString();
        }
        if (values.dureeVie) {
          changedFields.lifetime = values.dureeVie.toISOString();
        }
        if (values.ModeRemboursement) {
          changedFields.repaymentmode = values.ModeRemboursement;
        }
        if (values.tauxRendement) {
          changedFields.yieldrate = values.tauxRendement;
        }
        if (values.taux) {
          changedFields.rate = values.taux;
        }
        if (values.frequance) {
          changedFields.frequency = values.frequance;
        }
        if (values.marge) {
          changedFields.margin = values.marge;
        }
        if (values.indice) {
          changedFields.index = values.indice;
        }
        if (values.revision) {
          changedFields.revision = values.revision;
        }
        if (values.formule) {
          changedFields.formula = values.formule;
        }
        if (values.progression) {
          changedFields.progression = values.progression;
        }
      }

      // Sukuk-specific fields
      if (type === "sukukms" || type === "sukukmp") {
        if (values.remuneration) {
          changedFields.remuneration = values.remuneration;
        }
      }

      // Ensure ID is included
      changedFields.id = titreData.id;

      // Generate the appropriate mutation based on type
      const mutation = generateMutation(type, changedFields);

      await fetchGraphQL<String>(mutation, changedFields);

      toast({
        variant: "success",
        title: t("success"),
        description: t("titreajouteSucces"),
      });

      form.reset();
      setOpen(false);
      window.location.reload();
    } catch (error) {
      console.error("Form submission error", error);
      toast({
        variant: "destructive",
        title: t("error"),
        description:
          error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setLoading(false);
    }
  }

  // Helper function to generate the mutation
  function generateMutation(
    type: string,
    changedFields: Record<string, any>
  ): string {
    const isStock = type === "action" || type === "opv";
    const entityType = isStock ? "Stock" : "Bond";

    const fieldUpdates = Object.entries(changedFields)
      .filter(([key]) => key !== "id")
      .map(([key, value]) => {
        if (typeof value === "string") {
          return `${key}: { set: "${value}" }`;
        }
        return `${key}: { set: ${value} }`;
      })
      .join(",\n");

    return `
      mutation Edit${entityType} {
        update${entityType}(
          where: { id: "${changedFields.id}" },
          data: {
            ${fieldUpdates}
          }
        ) {
          id
        }
      }
    `;
  }

  useEffect(() => {
    if (companies) {
      form.reset({
        ...form.getValues(),
        societeEmettrice: listedCompanyData.id || "",
        MarcheCotation: titreData.marketlisting || "",
        codeBourse: titreData.code || "",
        isin: titreData.isincode || "",
        valeurNominale: titreData.facevalue || 0,
        nombreTitres: titreData.quantity || 1,
        dateEmission: titreData.emissiondate || "",
        dateEcheance: titreData.enjoymentdate || "",
        dateJouissance: titreData.enjoymentdate || "",
      });
    }
  }, [companies, titreData]);
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button variant="outline">{t("modifier")}</Button>
        </DialogTrigger>
        <DialogContent className="max-w-fit max-h-[90vh] overflow-y-scroll">
          <DialogHeader>
            <DialogTitle className="flex justify-center items-center">
              <div className="text-primary text-3xl">{t("ModifierTitre")}</div>
            </DialogTitle>
          </DialogHeader>
          {companies ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <DialogDescription className="space-y-8 max-w-3xl mx-auto pt-10 w-[40vw]">
                  <div className="flex gap-4 items-baseline">
                    <div>{t("societeEmettrice")}</div>
                    <div className="text-black font-semibold text-lg">
                      {listedCompanyData.nom}
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-full">
                      <FormField
                        control={form.control}
                        name="MarcheCotation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("marcheCotation")}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={t("marcheCotation")}
                                type="text"
                                {...field}
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="w-full">
                      <FormField
                        control={form.control}
                        name="codeBourse"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("codeBourse")}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={t("codeBourse")}
                                type=""
                                {...field}
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-full">
                      <FormField
                        control={form.control}
                        name="isin"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("codeISIN")}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={t("codeISIN")}
                                type="text"
                                {...field}
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="w-full">
                      <FormField
                        control={form.control}
                        name="valeurNominale"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("valeurNominale")}</FormLabel>
                            <FormControl>
                              <Input
                                placeholder={t("valeurNominale")}
                                type="number"
                                min="0"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                              />
                            </FormControl>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-full">
                      <FormField
                        control={form.control}
                        name="dateEmission"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>{t("dateEmission")}</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      " pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(
                                        field.value,
                                        locale === "ar" ? "dd/MM/yyyy" : "PPP",
                                        {
                                          locale:
                                            locale === "fr"
                                              ? fr
                                              : locale === "en"
                                              ? enUS
                                              : ar,
                                        }
                                      )
                                    ) : (
                                      <span>{t("pickADate")}</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
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
                                  captionLayout="dropdown-buttons"
                                  fromYear={1950}
                                  toYear={2050}
                                  locale={
                                    locale === "fr"
                                      ? fr
                                      : locale === "en"
                                      ? enUS
                                      : ar
                                  }
                                />
                              </PopoverContent>
                            </Popover>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="w-full">
                      <FormField
                        control={form.control}
                        name="dateJouissance"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>{t("dateJouissance")}</FormLabel>
                            <Popover>
                              <PopoverTrigger asChild>
                                <FormControl>
                                  <Button
                                    variant={"outline"}
                                    className={cn(
                                      "pl-3 text-left font-normal",
                                      !field.value && "text-muted-foreground"
                                    )}
                                  >
                                    {field.value ? (
                                      format(
                                        field.value,
                                        locale === "ar" ? "dd/MM/yyyy" : "PPP",
                                        {
                                          locale:
                                            locale === "fr"
                                              ? fr
                                              : locale === "en"
                                              ? enUS
                                              : ar,
                                        }
                                      )
                                    ) : (
                                      <span>{t("pickADate")}</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0  z-[100]"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  captionLayout="dropdown-buttons"
                                  fromYear={1950}
                                  toYear={2050}
                                  locale={
                                    locale === "fr"
                                      ? fr
                                      : locale === "en"
                                      ? enUS
                                      : ar
                                  }
                                />
                              </PopoverContent>
                            </Popover>

                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                  {(type === "obligation" || type === "empruntobligataire") && (
                    <div className="flex gap-4">
                      <div className="w-full">
                        <FormField
                          control={form.control}
                          name="dateEcheance"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>{t("dateEcheance")}</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        " pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value ? (
                                        format(
                                          field.value,
                                          locale === "ar"
                                            ? "dd/MM/yyyy"
                                            : "PPP",
                                          {
                                            locale:
                                              locale === "fr"
                                                ? fr
                                                : locale === "en"
                                                ? enUS
                                                : ar,
                                          }
                                        )
                                      ) : (
                                        <span>{t("pickADate")}</span>
                                      )}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
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
                                    captionLayout="dropdown-buttons"
                                    fromYear={1950}
                                    toYear={2050}
                                    locale={
                                      locale === "fr"
                                        ? fr
                                        : locale === "en"
                                        ? enUS
                                        : ar
                                    }
                                  />
                                </PopoverContent>
                              </Popover>

                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="w-full">
                        <FormField
                          control={form.control}
                          name="dureeVie"
                          render={({ field }) => (
                            <FormItem className="flex flex-col">
                              <FormLabel>{t("dureeVie")}</FormLabel>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <FormControl>
                                    <Button
                                      variant={"outline"}
                                      className={cn(
                                        "pl-3 text-left font-normal",
                                        !field.value && "text-muted-foreground"
                                      )}
                                    >
                                      {field.value ? (
                                        format(
                                          field.value,
                                          locale === "ar"
                                            ? "dd/MM/yyyy"
                                            : "PPP",
                                          {
                                            locale:
                                              locale === "fr"
                                                ? fr
                                                : locale === "en"
                                                ? enUS
                                                : ar,
                                          }
                                        )
                                      ) : (
                                        <span>{t("pickADate")}</span>
                                      )}
                                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                    </Button>
                                  </FormControl>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-auto p-0  z-[100]"
                                  align="start"
                                >
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    captionLayout="dropdown-buttons"
                                    fromYear={1950}
                                    toYear={2050}
                                    locale={
                                      locale === "fr"
                                        ? fr
                                        : locale === "en"
                                        ? enUS
                                        : ar
                                    }
                                  />
                                </PopoverContent>
                              </Popover>

                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  )}
                  {type !== "action" && type !== "opv" && (
                    <div className="flex gap-4">
                      <div className="w-full">
                        <FormField
                          control={form.control}
                          name="ModeRemboursement"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("modeRemboursement")}</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue
                                      placeholder={t("selectionnerUnMode")}
                                    />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="Infine">Infine</SelectItem>
                                  <SelectItem value="Par capital constant">
                                    {t("parCapitalConstant")}
                                  </SelectItem>
                                  <SelectItem value="Par annuité constante">
                                    {t("parAnnuiteConstante")}
                                  </SelectItem>
                                </SelectContent>
                              </Select>

                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="w-full">
                        <FormField
                          control={form.control}
                          name="tauxRendement"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("tauxRendement")}</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Taux de rendement actuariel"
                                  type="text"
                                  {...field}
                                />
                              </FormControl>

                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  )}
                  <FormField
                    control={form.control}
                    name="nombreTitres"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("nombreDeTitres")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("nombreDeTitres")}
                            type="number"
                            min="0"
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/*(type === "obligation" || type === "empruntobligataire") && (
                    <FormField
                      control={form.control}
                      name="ModeRemboursement"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("modeRemboursement")}</FormLabel>
                          <Select
                            onValueChange={(value) => {
                              field.onChange(value);
                              setSelectedMode(value);
                            }}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={t("choisirUnTauxDeCoupon")}
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="Taux fixe">
                                {t("tauxFixe")}
                              </SelectItem>
                              <SelectItem value="Taux variable">
                                {t("tauxVariable")}
                              </SelectItem>
                              <SelectItem value="Taux zéro">
                                {t("tauxZero")}
                              </SelectItem>
                              <SelectItem value="Taux indexé">
                                {t("tauxIndexe")}
                              </SelectItem>
                              <SelectItem value="Taux progressif">
                                {t("tauxProgressif")}
                              </SelectItem>
                            </SelectContent>
                          </Select>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )*/}
                  {(type === "obligation" || type === "empruntobligataire") &&
                    selectedMode === "Taux fixe" && (
                      <div className="flex gap-4">
                        <div className="w-full">
                          <FormField
                            control={form.control}
                            name="taux"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("taux")}</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder={t("enterLeTaux")}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="w-full">
                          <FormField
                            control={form.control}
                            name="frequance"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("frequance")}</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Enter une fréquence"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    )}
                  {(type === "obligation" || type === "empruntobligataire") &&
                    selectedMode === "Taux variable" && (
                      <div className="flex flex-col gap-4">
                        <div className="flex gap-4">
                          <div className="w-full">
                            <FormField
                              control={form.control}
                              name="taux"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t("tauxInitial")}</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder={t("enterLeTaux")}
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="w-full">
                            <FormField
                              control={form.control}
                              name="indice"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>
                                    {t("indiceDeReference")}
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder={t(
                                        "enterUnIndiceDeReference"
                                      )}
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <div className="w-full">
                            <FormField
                              control={form.control}
                              name="marge"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t("marge")}</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder={t("enterUneMarge")}
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="w-full">
                            <FormField
                              control={form.control}
                              name="revision"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Révision</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder={t("revision")}
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  {(type === "obligation" || type === "empruntobligataire") &&
                    selectedMode === "Taux indexé" && (
                      <div className="flex flex-col gap-4">
                        <div className="flex gap-4">
                          <div className="w-full">
                            <FormField
                              control={form.control}
                              name="taux"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t("tauxInitial")}</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder={t("enterLeTaux")}
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="w-full">
                            <FormField
                              control={form.control}
                              name="indice"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t("indice")}</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder={t("enterUnIndice")}
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                        <div className="flex gap-4">
                          <div className="w-full">
                            <FormField
                              control={form.control}
                              name="maj"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t("maj")}</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder={t("miseAJour")}
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                          <div className="w-full">
                            <FormField
                              control={form.control}
                              name="formule"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>{t("formule")}</FormLabel>
                                  <FormControl>
                                    <Input
                                      placeholder={t("entrerUneFormule")}
                                      {...field}
                                    />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>
                        </div>
                      </div>
                    )}
                  {(type === "obligation" || type === "empruntobligataire") &&
                    selectedMode === "Taux progressif" && (
                      <div className="flex gap-4">
                        <div className="w-full">
                          <FormField
                            control={form.control}
                            name="taux"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("tauxInitial")}</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder={t("enterLeTaux")}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div className="w-full">
                          <FormField
                            control={form.control}
                            name="progression"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t("progression")}</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder={t("enterUneProgression")}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    )}
                  {(type === "sukukms" || type === "sukukmp") && (
                    <FormField
                      control={form.control}
                      name="remuneration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("remuneration")}</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t("enterLaRemuneration")}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                </DialogDescription>
                <DialogFooter className="mt-10">
                  <DialogClose asChild>
                    <Button type="button" variant="outline">
                      {t("fermer")}
                    </Button>
                  </DialogClose>
                  <Button
                    disabled={loading}
                    type="submit"
                    className="flex w-full"
                  >
                    {t("modifier")}
                    {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          ) : (
            <div className="flex justify-center items-center h-full w-full">
              <div role="status">
                <svg
                  aria-hidden="true"
                  className="w-10 h-10 text-gray-200 animate-spin fill-secondary"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="sr-only">loading...</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ModifierTitre;
