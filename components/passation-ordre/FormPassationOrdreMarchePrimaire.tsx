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
  ArrowRight,
  Check,
  CheckIcon,
  ChevronDown,
  CircleAlert,
} from "lucide-react";
import {
  cn,
  formatPrice,
  getNextMonthDate,
  preventNonNumericInput,
  updateTotalAmount,
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
import { fr } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Separator } from "../ui/separator";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { useToast } from "@/hooks/use-toast";
import { formatDate, formatNumber } from "@/lib/utils";
import PasserUnOrdreSkeleton from "../PasserUnOrdreSkeleton";
import BulletinSubmitDialog from "../BulletinSubmitDialog";
import { useSession } from "next-auth/react";
import CouponTable from "../CouponTable";
import { useStockREST, useStocksREST } from "@/hooks/useStockREST";
import { Stock } from "@/lib/services/stockService";

const FormPassationOrdreMarchePrimaire = ({
  titreId,
  type,
}: {
  titreId?: string;
  type: string;
}) => {
  const session = useSession();
  const userId = (session.data?.user as any)?.id;
  const negotiatorId = (session.data?.user as any)?.negotiatorId;
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [titre, setTitre] = useState("");
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [createdOrdreId, setCreatedOrdreId] = useState<string | null>(null);
  const [selectedTitreName, setSelectedTitreName] = useState<string | null>(
    null
  );
  const [extraFieldsData, setExtraFieldsData] = useState<any>(null);
  const t = useTranslations("FormPassationOrdre");

  // Map the type parameter to the correct backend filter value
  let stockType: "action" | "obligation" | "sukuk" | "participatif" = "action";
  if (type === "opv") {
    stockType = "action";
  } else if (type === "empruntobligataire") {
    stockType = "obligation";
  } else if (type === "sukukmp") {
    stockType = "sukuk";
  } else if (type === "titresparticipatifsmp") {
    stockType = "participatif";
  } else {
    stockType = type as any;
  }

  // Use REST hooks for fetching data
  const { stocks: securityData, loading: stocksLoading } =
    useStocksREST(stockType);
  const { stock: data, loading } = useStockREST(titreId || "", stockType);
  const { stock: data, loading } = useStockREST(titreId || "", stockType);

  const router = useRouter();
  const handleGoBack = () => {
    router.back();
  };

  const formSchema = z.object({
    issuer: z.string().optional(),
    quantite: z
      .number()
      .int()
      .min(1)
      .max(data?.quantity || 1, {
        message: `La quantité ne peut pas dépasser ${data?.quantity || 1}.`,
      }),
    selectedTitreId: z.string(),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      selectedTitreId: "",
      quantite: 1,
    },
  });

  // Initialize form with data when available
  useEffect(() => {
    if (data && securityData?.length > 0) {
      const selectedTitre = securityData.find((t: any) => t.id === titreId);

      if (selectedTitre) {
        setTitre(selectedTitre.name || selectedTitre.issuer?.name || "");
        setSelectedPrice(selectedTitre.faceValue || selectedTitre.facevalue);
        setSelectedTitreName(selectedTitre.name || "");
        form.setValue("selectedTitreId", selectedTitre.id);

        // Extract issuer data if available
        if (selectedTitre.issuer) {
          setExtraFieldsData({
            notice: selectedTitre.issuer.website || "",
          });
        }

        setTotalAmount(
          updateTotalAmount(
            selectedTitre.faceValue || selectedTitre.facevalue,
            form.getValues("quantite")
          )
        );
      }
    }
  }, [data, securityData, titreId]);

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "quantite" && selectedPrice) {
        const quantity = value.quantite as number;
        setTotalAmount(Number(selectedPrice) * quantity);
      }
    });
    return () => subscription.unsubscribe();
  }, [form, selectedPrice]);

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    try {
      // Create order using REST API
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          securityid: data.selectedTitreId,
          investorid: userId,
          negotiatorid: negotiatorId || "",
          securitytype: stockType,
          quantity: data.quantite,
          orderstatus: 0,
          securityissuer: selectedTitreName,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to create order");
      }

      const result = await response.json();
      setCreatedOrdreId(result.id);
      setIsDialogOpen(true);

      toast({
        title: "Success",
        description: "Order submitted successfully",
      });
    } catch (error) {
      console.error("Error submitting order:", error);
      toast({
        title: "Error",
        description: "Failed to submit order",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || stocksLoading) {
    return <PasserUnOrdreSkeleton />;
  }

  // Si aucun titre sélectionné, afficher le dropdown de sélection
  if (!form.watch("selectedTitreId")) {
    return (
      <div className="flex flex-col items-center justify-center w-full">
        <div className="w-full flex justify-start mb-2">
          <Button
            type="button"
            variant="outline"
            className="flex gap-2 items-center border rounded-md py-1.5 px-2 bg-primary text-white hover:bg-primary hover:text-white w-fit"
            onClick={handleGoBack}
          >
            <ArrowRight className="w-5" /> <div>{t("annuler")}</div>
          </Button>
        </div>
        <h2 className="text-2xl font-bold mb-4">
          {t("selectTitre") || "Sélectionner un titre"}
        </h2>
        <div className="w-full max-w-2xl">
          <Form {...form}>
            <FormField
              control={form.control}
              name="selectedTitreId"
              render={({ field }) => (
                <FormItem className="flex justify-between text-xl items-baseline">
                  <FormControl className="w-full">
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={open}
                          className="w-full justify-between rounded-md mb-6 h-14"
                        >
                          <div className="flex gap-4 items-center">
                            <div className="text-xl text-primary font-semibold">
                              {titre ||
                                t("selectTitre") ||
                                "Sélectionnez un titre"}
                            </div>
                          </div>
                          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-96 p-0">
                        <Command>
                          <CommandInput
                            placeholder={
                              t("searchTitre") || "Rechercher un titre..."
                            }
                          />
                          <CommandList>
                            <CommandEmpty>{t("noTitle")}</CommandEmpty>
                            <CommandGroup>
                              {securityData &&
                                securityData?.map((t: any) => (
                                  <CommandItem
                                    key={t.id}
                                    value={t.name || t.issuer?.name}
                                    onSelect={() => {
                                      setTitre(t.name || t.issuer?.name || "");
                                      setSelectedTitreName(t.name || "");
                                      setSelectedPrice(
                                        t.faceValue || t.facevalue
                                      );
                                      field.onChange(t.id);
                                      setTotalAmount(
                                        (t.faceValue || t.facevalue) *
                                          form.getValues("quantite")
                                      );
                                      setOpen(false);
                                      if (t.issuer) {
                                        setExtraFieldsData({
                                          notice: t.issuer.website || "",
                                        });
                                      }
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
                                    {t.name || t.issuer?.name || t.id}
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
          </Form>
        </div>
      </div>
    );
  }

  // Si un titre est sélectionné, afficher le formulaire harmonisé
  return (
    <>
      <BulletinSubmitDialog
        createdOrdreId={createdOrdreId || ""}
        isDialogOpen={isDialogOpen}
        setIsDialogOpen={setIsDialogOpen}
      />
      <div className="flex flex-col justify-center items-center w-full">
        {/* Bouton Retour aligné à gauche */}
        <div className="w-full flex justify-start mb-2">
          <Button
            type="button"
            variant="outline"
            className="flex gap-2 items-center border rounded-md py-1.5 px-2 bg-primary text-white hover:bg-primary hover:text-white w-fit"
            onClick={() => form.setValue("selectedTitreId", "")}
          >
            <ArrowRight className="w-5" /> <div>{t("retour") || "Retour"}</div>
          </Button>
        </div>
        {/* Bloc titre sélectionné */}
        <div className="w-[100%] flex items-center justify-between rounded-md mb-6 h-14 border px-4 bg-muted">
          <div className="flex gap-4 items-center">
            {titre && <div className="w-10 h-10 bg-primary rounded-md"></div>}
            <div className="text-xl text-primary font-semibold">
              {titre || t("aucunTitre") || "Aucun titre sélectionné"}
            </div>
          </div>
          <div className="flex items-center">
            {titre && (
              <div>
                {formatPrice(Number(selectedPrice) || 0)} {t("currency")}
              </div>
            )}
          </div>
        </div>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="w-full max-w-2xl"
          >
            {/* Quantité */}
            <FormField
              control={form.control}
              name="quantite"
              render={({ field }) => (
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
              )}
            />
            {/* Détails du titre */}
            <div className="p-10 border rounded-md shadow flex flex-col gap-10 mt-6">
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
                  {data?.isinCode || data?.isincode || "N/A"}
                </div>
              </div>
              <div className="flex justify-between items-baseline">
                <div className=" text-gray-400 capitalize">
                  {t("dateEmission")}
                </div>
                <div className="text-lg font-semibold">
                  {(data?.emissionDate || data?.emissiondate) &&
                    formatDate(data?.emissionDate || data?.emissiondate)}
                </div>
              </div>
              <div className="flex justify-between items-baseline">
                <div className=" text-gray-400 capitalize">{t("nbTitres")}</div>
                <div className="text-lg font-semibold">
                  {data?.quantity && formatNumber(data?.quantity)}
                </div>
              </div>
              <div className="flex justify-between items-baseline">
                <div className=" text-gray-400 capitalize">
                  {t("commission")}
                </div>
                <div className="text-lg font-semibold">
                  {t("pasDeCommission")}
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
            {/* CouponTable si applicable */}
            {type !== "opv" && data?.couponschedule && (
              <div className="px-10 py-4 border rounded-md shadow flex flex-col gap-10 mt-6">
                <CouponTable
                  couponschedule={data.couponschedule}
                  facevalue={data.facevalue || data.faceValue}
                />
              </div>
            )}
            {/* Notice émetteur */}
            <div className="flex justify-between gap-6 mt-4">
              {extraFieldsData?.notice && (
                <Link
                  href={extraFieldsData?.notice || ""}
                  className="w-full flex gap-2 justify-center items-center text-gray-600 border rounded-md p-2 text-center"
                  target="_blank"
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
            {/*<div className="flex justify-between gap-6 mt-4">
              <Button onClick={handleGoBack} type="reset" variant="outline">
                {t("annuler")}
              </Button>
              <Button type="submit" className="w-full group gap-2" disabled={isSubmitting}>
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
            </div>*/}
          </form>
        </Form>
      </div>
    </>
  );
};

export default FormPassationOrdreMarchePrimaire;
