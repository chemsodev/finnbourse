"use client";
import { useRouter } from "@/i18n/routing";
import * as z from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ArrowRight,
  Check,
  CheckIcon,
  ChevronDown,
  CircleAlert,
} from "lucide-react";
import {
  calculateTotalValue,
  cn,
  formatPrice,
  getNextMonthDate,
  preventNonNumericInput,
  updateTotalAmount,
  calculateGrossAmount,
} from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "../ui/separator";
import { useEffect, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useToast } from "@/hooks/use-toast";
import { formatDate, formatNumber } from "@/lib/utils";
import Commissiontooltip from "../Commissiontooltip";
import { fr, ar, enUS } from "date-fns/locale";

import {
  FIND_UNIQUE_STOCKS_QUERY,
  LIST_STOCKS_NAME_PRICE_QUERY,
  FIND_UNIQUE_LISTED_COMPANY_EXTRA_FIELDS_QUERY,
} from "@/graphql/queries";
import { fetchGraphQLClient } from "@/app/actions/clientGraphQL";
import PasserUnOrdreSkeleton from "../PasserUnOrdreSkeleton";
import { CREATE_ORDER_MUTATION } from "@/graphql/mutations";
import BulletinSubmitDialog from "../BulletinSubmitDialog";
import { useSession } from "next-auth/react";

interface CreateOrderResponse {
  createOrder: {
    id: string;
  };
}

const FormPassationOrdreAction = ({
  titreId,
  type,
}: {
  titreId: string;
  type: string;
}) => {
  const session = useSession();
  const userId = (session.data?.user as any)?.id;
  const negotiatorId = (session.data?.user as any)?.negotiatorId;
  const locale = useLocale().toLowerCase();
  const { toast } = useToast();
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [titre, setTitre] = useState("");
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [grossAmount, setGrossAmount] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [stockData, setStockData] = useState<any>(null);
  const [createdOrdreId, setCreatedOrdreId] = useState<string | null>(null);
  const [selectedTitreName, setSelectedTitreName] = useState<string | null>(
    null
  );

  const [extraFieldsData, setExtraFieldsData] = useState<any>(null); // New state variables for form conditions
  const [conditionDuree, setConditionDuree] = useState("deJour");
  const [conditionPrix, setConditionPrix] = useState("prixMarche");
  const [conditionQuantite, setConditionQuantite] = useState("toutOuRien");

  const t = useTranslations("FormPassationOrdre");

  useEffect(() => {
    const ListStockData = async () => {
      setLoading(true);
      try {
        const result = await fetchGraphQLClient<any>(
          LIST_STOCKS_NAME_PRICE_QUERY,
          {
            type,
          }
        );
        setStockData(result.listStocks);
        const selectedTitreId = titreId;
        if (selectedTitreId) {
          const selectedTitre = result.listStocks.find(
            (t: any) => t.id === selectedTitreId
          );
          if (selectedTitre) {
            setTitre(selectedTitre.name);
            setSelectedPrice(Number(selectedTitre.facevalue));
            form.setValue("selectedTitreId", selectedTitre.id);
            form.setValue("coursLimite", Number(selectedTitre.facevalue));

            setTotalAmount(
              calculateTotalValue(
                selectedTitre.facevalue,
                form.getValues("quantite"),
                "action"
              )
            );
            setGrossAmount(
              calculateGrossAmount(
                Number(selectedTitre.facevalue),
                form.getValues("quantite")
              )
            );
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    ListStockData();
  }, []);

  const fetchData = async (id: string) => {
    setLoading(true);
    try {
      const result = await fetchGraphQLClient<any>(FIND_UNIQUE_STOCKS_QUERY, {
        id,
      });
      setData(result.findUniqueStock);
      setSelectedTitreName(result.findUniqueStock.name);
      fetchExtraFieldsData(result.findUniqueStock.listedcompanyid);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchExtraFieldsData = async (id: string) => {
    try {
      const result = await fetchGraphQLClient<any>(
        FIND_UNIQUE_LISTED_COMPANY_EXTRA_FIELDS_QUERY,
        {
          id,
        }
      );

      setExtraFieldsData(result.findUniqueListedCompany.extrafields);
    } catch (error) {
      console.error("Error fetching extra fields data:", error);
    }
  };

  useEffect(() => {
    fetchData(titreId);
  }, [titreId]);

  const router = useRouter();
  const handleGoBack = () => {
    router.back();
  };
  const formSchema = z
    .object({
      buyTransaction: z.boolean(),
      issuer: z.string().optional(),
      quantite: z
        .number()
        .int()
        .min(1)
        .max(data?.quantity || 1, {
          message: `La quantité ne peut pas dépasser ${data?.quantity || 1}.`,
        }), // Conditions de Durée
      conditionDuree: z.enum(["deJour", "dateDefinie", "sansStipulation"]),
      validite: z.date().optional(),
      // Conditions de Prix
      conditionPrix: z.enum(["prixLimite", "prixMarche"]),
      coursLimite: z.number().optional(),
      // Conditions Quantitatives
      conditionQuantite: z.enum(["toutOuRien", "quantiteMinimale"]),
      quantiteMinimale: z.number().int().min(1).optional(),
      selectedTitreId: z.string(),
    })
    .refine(
      (data) => {
        // Validation conditionnelle pour date de validité
        if (data.conditionDuree === "dateDefinie") {
          return data.validite !== undefined;
        }
        return true;
      },
      {
        message: "La date de validité est requise pour une durée définie",
        path: ["validite"],
      }
    )
    .refine(
      (data) => {
        // Validation conditionnelle pour cours limite
        if (data.conditionPrix === "prixLimite") {
          return data.coursLimite !== undefined && data.coursLimite > 0;
        }
        return true;
      },
      {
        message: "Le cours limite est requis pour un ordre à prix limite",
        path: ["coursLimite"],
      }
    )
    .refine(
      (data) => {
        // Validation conditionnelle pour quantité minimale
        if (data.conditionQuantite === "quantiteMinimale") {
          return (
            data.quantiteMinimale !== undefined &&
            data.quantiteMinimale > 0 &&
            data.quantiteMinimale <= data.quantite
          );
        }
        return true;
      },
      {
        message:
          "La quantité minimale est requise et doit être inférieure ou égale à la quantité totale",
        path: ["quantiteMinimale"],
      }
    );
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      selectedTitreId: "",
      buyTransaction: true,
      quantite: 1,
      conditionDuree: "deJour",
      conditionPrix: "prixMarche",
      conditionQuantite: "toutOuRien",
      validite: getNextMonthDate(),
      coursLimite: 0,
      quantiteMinimale: 1,
    },
  });

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "quantite" && Number(selectedPrice)) {
        const quantity = value.quantite as number;
        setTotalAmount(
          calculateTotalValue(Number(selectedPrice), quantity, "action")
        );
        setGrossAmount(calculateGrossAmount(Number(selectedPrice), quantity));
      }
    });
    return () => subscription.unsubscribe();
  }, [form, selectedPrice]);
  useEffect(() => {
    const selectedTitreId = form.getValues("selectedTitreId");
    if (selectedTitreId) {
      fetchData(selectedTitreId.toString());
    }
  }, [form.watch("selectedTitreId")]);

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      const retrunedData = await fetchGraphQLClient<CreateOrderResponse>(
        CREATE_ORDER_MUTATION,
        {
          ordertypeone: data.conditionDuree,
          ordertypetwo: data.conditionPrix,
          orderdirection: Number(data.buyTransaction) ? 1 : 0,
          securityid: data.selectedTitreId,
          investorid: userId,
          negotiatorid: negotiatorId || "",
          securitytype: "stock",
          quantity: data.quantite,
          pricelimitmin:
            data.conditionPrix === "prixLimite" ? data.coursLimite : 0,
          pricelimitmax:
            data.conditionPrix === "prixLimite" ? data.coursLimite : 0,
          orderstatus: 0,
          securityissuer: selectedTitreName,
          validity: data.validite || new Date(),
          quantityCondition: data.conditionQuantite,
          minQuantity:
            data.conditionQuantite === "quantiteMinimale"
              ? data.quantiteMinimale
              : undefined,
        }
      );
      setCreatedOrdreId(retrunedData.createOrder.id);

      setIsDialogOpen(true);

      toast({
        variant: "success",
        action: (
          <div className="w-full flex gap-6 items-center">
            <CheckIcon size={40} />
            <span className="first-letter:capitalize text-xs">
              {t("ordrePasse")}
            </span>
          </div>
        ),
      });
    } catch (error) {
      console.error("Form submission error", error);
      toast({
        variant: "destructive",
        action: (
          <div className="w-full flex gap-6 items-center">
            <CircleAlert size={40} />
            <span className="first-letter:capitalize text-xs">
              {t("erreur")}
            </span>
          </div>
        ),
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  const setTransactionType = (type: boolean) => {
    form.setValue("buyTransaction", type);
  };

  const isAchatSelected = form.watch("buyTransaction");
  const watchedConditionDuree = form.watch("conditionDuree");
  const watchedConditionPrix = form.watch("conditionPrix");
  const watchedConditionQuantite = form.watch("conditionQuantite");

  if (loading || !stockData || !data) {
    return <PasserUnOrdreSkeleton />;
  }

  return (
    <>
      <BulletinSubmitDialog
        createdOrdreId={createdOrdreId || ""}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
      />
      <div className="flex justify-center items-center">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="w-full max-w-2xl"
          >
            <FormField
              control={form.control}
              name="selectedTitreId"
              render={({ field }) => (
                <FormItem className="flex justify-between text-xl items-baseline">
                  <FormControl className="w-40">
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={open}
                          className="w-[100%] justify-between rounded-md mb-6 h-14"
                        >
                          <div className="flex gap-4 items-center">
                            {titre && (
                              <div className="w-10 h-10 bg-primary rounded-md"></div>
                            )}
                            <div className="text-xl text-primary font-semibold">
                              {titre || "Selectionnez un titre"}
                            </div>
                          </div>
                          <div className="flex items-center">
                            {titre && (
                              <div>
                                {formatPrice(Number(selectedPrice) || 0)}
                                {t("currency")}
                              </div>
                            )}
                            <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </div>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-96 p-0">
                        <Command>
                          <CommandInput placeholder="Rechercher un titre..." />
                          <CommandList>
                            <CommandEmpty>{t("noTitle")}</CommandEmpty>
                            <CommandGroup>
                              {stockData &&
                                stockData?.map((t: any) => (
                                  <CommandItem
                                    key={t.id}
                                    value={t.name}
                                    onSelect={() => {
                                      setTitre(t.name);
                                      setSelectedPrice(Number(t.facevalue));
                                      form.setValue(
                                        "coursLimite",
                                        Number(t.facevalue)
                                      );
                                      field.onChange(t.id);
                                      setTotalAmount(
                                        calculateTotalValue(
                                          t.facevalue,
                                          form.getValues("quantite"),
                                          "action"
                                        )
                                      );
                                      setGrossAmount(
                                        calculateGrossAmount(
                                          Number(t.facevalue),
                                          form.getValues("quantite")
                                        )
                                      );
                                      setOpen(false);
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        field.value === t.id
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {t.name}
                                  </CommandItem>
                                ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="p-10 border rounded-md shadow flex flex-col gap-10">
              <div className="flex justify-between items-baseline">
                <div className=" text-gray-400 capitalize">
                  {t("visaCOSOB")}
                </div>
                <div className="text-lg font-semibold">
                  {process.env.NEXT_PUBLIC_VISA_COSOB}
                </div>
              </div>
              <div className="flex justify-between items-baseline">
                <div className=" text-gray-400 capitalize">{t("codeIsin")}</div>
                <div className="text-lg font-semibold">
                  {data?.isincode || "N/A"}
                </div>
              </div>{" "}
              <FormField
                control={form.control}
                name="buyTransaction"
                render={({ field }) => {
                  return (
                    <FormItem className="gap-32 text-lg">
                      <div className="flex items-baseline justify-between ">
                        <FormLabel className="text-gray-400 capitalize text-lg">
                          {t("TypeTransaction")}
                        </FormLabel>
                        <FormControl>
                          <div className="flex gap-4">
                            <button
                              type="button"
                              onClick={() => setTransactionType(true)}
                              className={`border px-8 rounded-full ${
                                isAchatSelected
                                  ? "bg-green-600 text-white border-green-600"
                                  : "text-green-600 border-green-600 hover:bg-green-600 hover:text-white"
                              }`}
                            >
                              {t("achat")}
                            </button>
                            <button
                              type="button"
                              onClick={() => setTransactionType(false)}
                              className={`border px-8 rounded-full ${
                                !isAchatSelected
                                  ? "bg-red-600 text-white border-red-600"
                                  : "text-red-600 border-red-600 hover:bg-red-600 hover:text-white"
                              }`}
                            >
                              {t("vente")}
                            </button>
                          </div>
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              <FormField
                control={form.control}
                name="quantite"
                render={({ field }) => {
                  return (
                    <FormItem className="text-xl items-baseline">
                      <div className="flex justify-between ">
                        <FormLabel className="text-gray-400 capitalize text-lg">
                          {t("quantite")}
                        </FormLabel>
                        <FormControl className="w-40">
                          <Input
                            placeholder="Quantité"
                            type="number"
                            min="0"
                            {...field}
                            onChange={(e) => {
                              const value = Math.max(
                                1,
                                Math.min(
                                  data?.quantity || 1,
                                  parseInt(e.target.value) || 0
                                )
                              );
                              field.onChange(value);
                            }}
                            onKeyDown={preventNonNumericInput}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              {/* Conditions de Prix */}
              <FormField
                control={form.control}
                name="conditionPrix"
                render={({ field }) => {
                  return (
                    <FormItem className="flex justify-between text-xl items-baseline">
                      <FormLabel className="text-gray-400 capitalize text-lg">
                        Conditions de Prix
                      </FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          setConditionPrix(value);
                        }}
                        value={field.value}
                      >
                        <FormControl className="w-60">
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez une condition"></SelectValue>
                          </SelectTrigger>
                        </FormControl>{" "}
                        <SelectContent>
                          <SelectItem value="prixMarche">
                            Au prix du marché
                          </SelectItem>
                          <SelectItem value="prixLimite">
                            À prix limite
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              {/* Cours limite field - only show when prix limite is selected */}
              {watchedConditionPrix === "prixLimite" && (
                <FormField
                  control={form.control}
                  name="coursLimite"
                  render={({ field }) => (
                    <FormItem className="text-xl items-baseline">
                      {" "}
                      <div className="flex justify-between ">
                        <FormLabel className="text-gray-400 capitalize text-lg">
                          {isAchatSelected ? (
                            <>
                              Cours{" "}
                              <span className="text-green-500">maximal</span>
                            </>
                          ) : (
                            <>
                              Cours{" "}
                              <span className="text-red-500">minimal</span>
                            </>
                          )}
                        </FormLabel>
                        <FormControl className="w-40">
                          <Input
                            placeholder="Cours limite"
                            type="number"
                            min="0"
                            step="0.01"
                            value={field.value || ""}
                            onChange={(e) =>
                              field.onChange(
                                Math.max(0, parseFloat(e.target.value) || 0)
                              )
                            }
                            onKeyDown={preventNonNumericInput}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {/* Conditions de Durée */}
              <FormField
                control={form.control}
                name="conditionDuree"
                render={({ field }) => {
                  return (
                    <FormItem className="flex justify-between text-xl items-baseline w-full">
                      <FormLabel className="text-gray-400 capitalize text-lg">
                        Conditions de Durée
                      </FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          setConditionDuree(value);
                        }}
                        value={field.value}
                      >
                        <FormControl className="w-60">
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez une durée"></SelectValue>
                          </SelectTrigger>
                        </FormControl>{" "}
                        <SelectContent>
                          <SelectItem value="deJour">De jour</SelectItem>
                          <SelectItem value="dateDefinie">
                            Jusqu'à une date définie (max 30 jours)
                          </SelectItem>
                          <SelectItem value="sansStipulation">
                            Sans stipulation (jusqu'à exécution)
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              {/* Date de validité - only show when date definie is selected */}
              {watchedConditionDuree === "dateDefinie" && (
                <FormField
                  control={form.control}
                  name="validite"
                  render={({ field }) => (
                    <FormItem className="text-xl items-baseline">
                      <div className="flex justify-between w-full">
                        <FormLabel className="text-gray-400 capitalize text-lg w-full">
                          Date de validité
                        </FormLabel>
                        <FormControl>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "min-w-60 justify-start text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {field.value ? (
                                  format(field.value, "dd MMMM yyyy", {
                                    locale: fr,
                                  })
                                ) : (
                                  <span>Choisir une date</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={(date) => {
                                  // Limit to max 30 days from today
                                  const maxDate = new Date();
                                  maxDate.setDate(maxDate.getDate() + 30);
                                  if (date && date <= maxDate) {
                                    field.onChange(date);
                                  }
                                }}
                                captionLayout="dropdown-buttons"
                                fromDate={new Date()}
                                toDate={(() => {
                                  const maxDate = new Date();
                                  maxDate.setDate(maxDate.getDate() + 30);
                                  return maxDate;
                                })()}
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
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              {/* Conditions Quantitatives */}
              <FormField
                control={form.control}
                name="conditionQuantite"
                render={({ field }) => {
                  return (
                    <FormItem className="flex justify-between text-xl items-baseline w-full">
                      <FormLabel className="text-gray-400 capitalize text-lg">
                        Conditions Quantitatives
                      </FormLabel>
                      <Select
                        onValueChange={(value) => {
                          field.onChange(value);
                          setConditionQuantite(value);
                        }}
                        value={field.value}
                      >
                        <FormControl className="w-60">
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionnez une condition"></SelectValue>
                          </SelectTrigger>
                        </FormControl>{" "}
                        <SelectContent>
                          <SelectItem value="toutOuRien">
                            Tout ou rien
                          </SelectItem>
                          <SelectItem value="quantiteMinimale">
                            Quantité minimale d'exécution
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  );
                }}
              />
              {/* Quantité minimale - only show when quantite minimale is selected */}
              {watchedConditionQuantite === "quantiteMinimale" && (
                <FormField
                  control={form.control}
                  name="quantiteMinimale"
                  render={({ field }) => (
                    <FormItem className="text-xl items-baseline">
                      <div className="flex justify-between ">
                        <FormLabel className="text-gray-400 capitalize text-lg">
                          Quantité minimale
                        </FormLabel>
                        <FormControl className="w-40">
                          <Input
                            placeholder="Quantité min"
                            type="number"
                            min="1"
                            value={field.value || ""}
                            onChange={(e) => {
                              const maxQuantity = form.getValues("quantite");
                              const value = Math.max(
                                1,
                                Math.min(
                                  maxQuantity,
                                  parseInt(e.target.value) || 1
                                )
                              );
                              field.onChange(value);
                            }}
                            onKeyDown={preventNonNumericInput}
                          />
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <div className="flex justify-between items-baseline">
                <div className=" text-gray-400 capitalize">
                  {t("dateEmission")}
                </div>
                <div className="text-lg font-semibold">
                  {(data?.emissiondate && formatDate(data.emissiondate)) ||
                    "N/A"}
                </div>
              </div>
              <div className="flex justify-between items-baseline">
                <div className=" text-gray-400 capitalize">
                  {t("nbActions")}
                </div>
                <div className="text-lg font-semibold">
                  {(data?.quantity && formatNumber(data?.quantity)) || "N/A"}
                </div>
              </div>
              <div className="flex justify-between items-baseline">
                <div className=" text-gray-500">{t("montantBrut")}:</div>
                <div className="font-semibold text-lg flex gap-1">
                  <span>{formatPrice(grossAmount || 0)}</span>
                  <span> {t("currency")}</span>
                </div>
              </div>
              <div className="flex justify-between items-baseline">
                <div className=" text-gray-500">{t("commission")}:</div>
                <div className="font-semibold text-lg">
                  {process.env.NEXT_PUBLIC_COMMISSION_ACTION} %
                </div>
              </div>
              <Separator />
              <div className="flex justify-between items-baseline">
                <div className="text-gray-400 capitalize text-lg ">
                  {t("mtt")}
                </div>
                <div className="text-xl font-bold flex gap-1">
                  <span>{formatPrice(totalAmount || 0)}</span>
                  <span> {t("currency")}</span>
                </div>
              </div>
            </div>

            <div className="flex justify-between gap-6 mt-4">
              {extraFieldsData?.notice && (
                <Link
                  href={extraFieldsData?.notice || ""}
                  className="w-full flex gap-2 justify-center items-center text-gray-600 border rounded-md p-2 text-center"
                >
                  <div>{t("tn")}</div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8.5 6.5a.5.5 0 0 0-1 0v3.793L6.354 9.146a.5.5 0 1 0-.708.708l2 2a.5.5 0 0 0 .708 0l2-2a.5.5 0 0 0-.708-.708L8.5 10.293z" />
                    <path d="M14 14V4.5L9.5 0H4a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2M9.5 3A1.5 1.5 0 0 0 11 4.5h2V14a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1h5.5z" />
                  </svg>
                </Link>
              )}
            </div>
            <div className="flex justify-between gap-6 mt-4">
              <Button onClick={handleGoBack} type="reset" variant="outline">
                {t("annuler")}
              </Button>

              <Button
                type="submit"
                className="w-full group gap-2"
                disabled={isSubmitting}
              >
                {t("suivant")}
                {isSubmitting ? (
                  <svg
                    aria-hidden="true"
                    className="w-5 h-5 text-gray-200 animate-spin fill-gray-400"
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
                ) : (
                  <ArrowRight className="hidden group-hover:block text-white " />
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};

export default FormPassationOrdreAction;
