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
import { useFieldArray } from "react-hook-form";
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

import { Check, ChevronsUpDown, Loader2, Trash, TrashIcon } from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "@/i18n/routing";
import { fr, ar, enUS } from "date-fns/locale";

interface GetListedCompaniesResponse {
  listListedCompanies: {
    id: string;
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
  dureeVie: z.coerce.number().optional(),
  nombreTitres: z.number().min(1),
  ModeRemboursement: z.string().optional(),
  tauxRendement: z.number().optional(),
  tauxCoupon: z.string().optional(),
  taux: z.string().optional(),
  frequance: z.string().optional(),
  marge: z.string().optional(),
  indice: z.string().optional(),
  revision: z.string().optional(),
  maj: z.string().optional(),
  formule: z.string().optional(),
  progression: z.string().optional(),
  remuneration: z.string().optional(),
  capitalOperation: z.string().optional(),
  closingDate: z.coerce.date(),
  dividendrate: z.number().min(0).optional(),
  couponSchedule: z
    .array(
      z.object({
        year: z.number().int().positive(),
        rate: z.number().positive(),
      })
    )
    .optional(),
  commission: z.number().min(0).optional(),
  irg: z.number().min(0).optional(),
  tva: z.number().min(0).optional(),
  tauxFixe: z.string().optional(),
  tauxVariable: z.string().optional(),
  tauxEstime: z.string().optional(),
});

const AjoutTitre = ({ type }: { type: string }) => {
  const { toast } = useToast();
  const locale = useLocale();
  const t = useTranslations("AjouterUnTitre");
  const [selectedMode, setSelectedMode] = useState("");
  const [companies, setCompanies] = useState<GetListedCompaniesResponse | null>(
    null
  );
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        // TODO: Replace with REST API call
        // const response = await clientFetchGraphQL<GetListedCompaniesResponse>(
        //   GET_LISTED_COMPANIES_QUERY
        // );
        // setCompanies(response);

        // For now, use mock data or call REST endpoint
        // Example: const response = await fetch('/api/companies');
        // const data = await response.json();
        // setCompanies(data);

        // Mock response
        setCompanies({ listListedCompanies: [] });
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
      valeurNominale: 0,
      dateJouissance: new Date(),
      dateEcheance: new Date(),
      closingDate: new Date(new Date().setMonth(new Date().getMonth() + 1)), // Set to one month from now
      dureeVie: 12,
      dividendrate: 0,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      setLoading(true);
      // TODO: Replace with REST API call
      // const mutation = type === "action" || type === "opv" ? CREATE_STOCK : CREATE_BOND;
      // await clientFetchGraphQL<String>(mutation, { ... });

      // For now, simulate the submission
      // Example REST call:
      // const response = await fetch('/api/securities', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ ...values, type })
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        variant: "success",
        title: t("success"),
        description: t("successDescription"),
      });

      form.reset();
      setOpen(false);
    } catch (error) {
      console.error("Form submission error", error);
      toast({
        variant: "destructive",
        title: t("error"),
        description: t("errorDescription"),
      });
    } finally {
      setLoading(false);
    }
  }

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "couponSchedule",
  });
  return (
    <>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <Button className="flex gap-2 my-4">
            {t("ajouterUnTitre")} <CirclePlus size={20} />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-fit max-h-[90vh] overflow-y-scroll">
          <DialogHeader>
            <DialogTitle className="flex justify-center items-center">
              <div className="text-primary text-3xl">{t("ajouterUnTitre")}</div>
            </DialogTitle>
          </DialogHeader>
          {companies ? (
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)}>
                <DialogDescription className="space-y-8 max-w-3xl mx-auto pt-10 w-[40vw]">
                  <FormField
                    control={form.control}
                    name="societeEmettrice"
                    render={({ field }) => (
                      <FormItem className="flex flex-col w-full">
                        <FormLabel>{t("societeEmettrice")}</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "justify-between ",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value
                                  ? companies?.listListedCompanies?.find(
                                      (company) => company.id === field.value
                                    )?.nom
                                  : t("selectionnerUneSociete")}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50 " />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="p-0 z-50">
                            <Command>
                              <CommandInput
                                placeholder={t("rechercherUneSociete")}
                              />
                              <CommandList>
                                <CommandEmpty>
                                  {t("aucuneSocieteTrouvee")}
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
                  {(type === "opv" ||
                    type === "empruntobligataire" ||
                    type === "sukukmp" ||
                    type === "titresparticipatifsmp") && (
                    <FormField
                      control={form.control}
                      name="capitalOperation"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("capitalOperation")}</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={t(
                                    "selectionnerCapitalOperation"
                                  )}
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="OuvertureCapital">
                                {t("OuvertureCapital")}
                              </SelectItem>
                              <SelectItem value="AugmentationCapital">
                                {t("AugmentationCapital")}
                              </SelectItem>
                            </SelectContent>
                          </Select>

                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  <div className="flex gap-4">
                    <div className="w-full">
                      <FormField
                        control={form.control}
                        name="MarcheCotation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("marcheCotation")}</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger>
                                  <SelectValue
                                    placeholder={t("marcheCotation")}
                                  />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="Marché principal">
                                  {t("marchePrincipal")}
                                </SelectItem>
                                <SelectItem value="Marché PME">
                                  {t("marchePme")}
                                </SelectItem>
                                <SelectItem value="Marché de croissance">
                                  {t("marcheCroissance")}
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
                                {...field}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                                onKeyDown={preventNonNumericInput}
                                onFocus={(e) => {
                                  if (e.target.value === "0") {
                                    e.target.value = "";
                                  }
                                }}
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
                  </div>
                  {type !== "opv" && type !== "action" && (
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

                      <div className="w-full  flex gap-4 items-center justify-center">
                        <FormField
                          control={form.control}
                          name="dureeVie"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>{t("dureeVie")}</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder={t("dureeVie")}
                                  type="number"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(Number(e.target.value))
                                  }
                                  onKeyDown={preventNonNumericInput}
                                  onFocus={(e) => {
                                    if (e.target.value === "0") {
                                      e.target.value = "";
                                    }
                                  }}
                                />
                              </FormControl>

                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="mt-6">{t("months")}</div>
                      </div>
                    </div>
                  )}
                  {type !== "opv" &&
                    type !== "action" &&
                    (type === "obligation" ||
                      type === "empruntobligataire") && (
                      <div className="flex flex-col gap-4">
                        <div className="font-medium">{t("couponSchedule")}</div>
                        {fields?.map((field, index) => (
                          <div key={field.id} className="flex gap-4 items-end">
                            <FormField
                              control={form.control}
                              name={`couponSchedule.${index}.year`}
                              render={({ field }) => (
                                <FormItem className="w-full">
                                  <FormLabel>{t("year")}</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      min="1"
                                      placeholder="Year"
                                      {...field}
                                      onChange={(e) =>
                                        field.onChange(Number(e.target.value))
                                      }
                                      onKeyDown={preventNonNumericInput}
                                      onFocus={(e) => {
                                        if (e.target.value === "0") {
                                          e.target.value = "";
                                        }
                                      }}
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
                                  <FormLabel>{t("rate")} (%)</FormLabel>
                                  <FormControl>
                                    <Input
                                      type="number"
                                      step="0.01"
                                      placeholder="Rate"
                                      {...field}
                                      onChange={(e) =>
                                        field.onChange(Number(e.target.value))
                                      }
                                      onKeyDown={preventNonNumericInput}
                                      onFocus={(e) => {
                                        if (e.target.value === "0") {
                                          e.target.value = "";
                                        }
                                      }}
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
                              <TrashIcon className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => append({ year: 1, rate: 0 })}
                        >
                          {t("addCoupon")}
                        </Button>
                      </div>
                    )}
                  {type !== "opv" &&
                    type !== "action" &&
                    (type === "obligation" ||
                      type === "empruntobligataire") && (
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
                                    <SelectItem value="Infine">
                                      Infine
                                    </SelectItem>
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
                                    placeholder={t("tauxRendement")}
                                    type="number"
                                    step="0.01"
                                    {...field}
                                    onChange={(e) =>
                                      field.onChange(Number(e.target.value))
                                    }
                                    onKeyDown={preventNonNumericInput}
                                    onFocus={(e) => {
                                      if (e.target.value === "0") {
                                        e.target.value = "";
                                      }
                                    }}
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
                            {...field}
                            onChange={(e) =>
                              field.onChange(Number(e.target.value))
                            }
                            onKeyDown={preventNonNumericInput}
                            onFocus={(e) => {
                              if (e.target.value === "0") {
                                e.target.value = "";
                              }
                            }}
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {(type === "action" || type === "opv") && (
                    <FormField
                      control={form.control}
                      name="dividendrate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("dividendRate")} (%)</FormLabel>
                          <FormControl>
                            <Input
                              placeholder={t("enterDividendRate")}
                              type="number"
                              step="0.01"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                              onKeyDown={preventNonNumericInput}
                              onFocus={(e) => {
                                if (e.target.value === "0") {
                                  e.target.value = "";
                                }
                              }}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}
                  {/*type !== "opv" &&
                    type !== "action" &&
                    (type === "obligation" ||
                      type === "empruntobligataire") && (
                      <FormField
                        control={form.control}
                        name="tauxCoupon"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("choisirUnTauxDeCoupon")}</FormLabel>
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
                  {type !== "opv" &&
                    type !== "action" &&
                    (type === "obligation" || type === "empruntobligataire") &&
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
                                    placeholder={t("frequance")}
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
                  {type !== "opv" &&
                    type !== "action" &&
                    (type === "obligation" || type === "empruntobligataire") &&
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
                  {type !== "opv" &&
                    type !== "action" &&
                    (type === "obligation" || type === "empruntobligataire") &&
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
                      </div>
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
                    {t("submit")}
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

export default AjoutTitre;
