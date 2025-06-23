"use client";
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
import { useRouter } from "@/i18n/routing";
import {
  ArrowRight,
  Check,
  CheckIcon,
  ChevronDown,
  CircleAlert,
  CloudUpload,
  Download,
  Paperclip,
  XIcon,
} from "lucide-react";
import {
  calculateTotalValue,
  cn,
  formatDate,
  formatNumber,
  formatPrice,
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
import { Separator } from "../ui/separator";
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";
import { preventNonNumericInput } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import { toast } from "@/hooks/use-toast";
import CouponTable from "../CouponTable";
import PasserUnOrdreSkeleton from "../PasserUnOrdreSkeleton";
import BulletinSubmitDialog from "../BulletinSubmitDialog";
import { useSession } from "next-auth/react";
import { useStockREST, useStocksREST } from "@/hooks/useStockREST";
import { stockService } from "@/lib/services/stockService";

const FormPassationOrdreObligation = ({
  titreId,
  type,
}: {
  titreId: string;
  type: string;
}) => {
  const session = useSession();
  const userId = (session.data?.user as any)?.id;
  const negotiatorId = (session.data?.user as any)?.negotiatorId;
  const [open, setOpen] = useState(false);
  const [titre, setTitre] = useState("");
  const [selectedPrice, setSelectedPrice] = useState<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [grossAmount, setGrossAmount] = useState<number>(0);
  const [createdOrdreId, setCreatedOrdreId] = useState<string | null>(null);
  const [selectedTitreName, setSelectedTitreName] = useState<string | null>(
    null
  );
  const [extraFieldsData, setExtraFieldsData] = useState<any>(null);

  // Use the REST hooks to fetch data
  const stockType =
    type === "obligation"
      ? "obligation"
      : type === "sukukms"
      ? "sukuk"
      : ("participatif" as const);

  const { stocks: obligationData, loading: stocksLoading } =
    useStocksREST(stockType);
  const { stock: data, loading } = useStockREST(titreId, stockType);

  const t = useTranslations("FormPassationOrdreObligation");

  const router = useRouter();

  const handleGoBack = () => {
    router.back();
  };

  const formSchema = z.object({
    issuer: z.string().optional(),
    typeTransaction: z.boolean(),
    selectedTitreId: z.string(),
    quantite: z
      .number()
      .min(1)
      .max(data?.quantity || 1, {
        message: `La quantité ne peut pas dépasser ${data?.quantity || 1}.`,
      }),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      selectedTitreId: "",
      typeTransaction: true,
      quantite: 1,
    },
  });

  // Initialize form with titreId when data is loaded
  useEffect(() => {
    if (data && obligationData?.length > 0) {
      const selectedTitre = obligationData.find((t: any) => t.id === titreId);

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
          calculateTotalValue(
            selectedTitre.faceValue || selectedTitre.facevalue,
            form.getValues("quantite"),
            "obligation"
          )
        );
        setGrossAmount(
          calculateGrossAmount(
            selectedTitre.faceValue || selectedTitre.facevalue,
            form.getValues("quantite")
          )
        );
      }
    }
  }, [data, obligationData, titreId]);

  // Update total amount when quantity changes
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "quantite" && selectedPrice) {
        const quantity = value.quantite as number;
        setTotalAmount(
          calculateTotalValue(Number(selectedPrice), quantity, "obligation")
        );
        setGrossAmount(calculateGrossAmount(Number(selectedPrice), quantity));
      }
    });
    return () => subscription.unsubscribe();
  }, [form, selectedPrice]);

  // Handle form submission
  const handleSubmit = async (formData: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);

    try {
      // Create order using REST API
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderdirection: formData.typeTransaction ? 1 : 0,
          securityid: formData.selectedTitreId,
          investorid: userId,
          negotiatorid: negotiatorId || "",
          securitytype: stockType,
          quantity: formData.quantite,
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
    form.setValue("typeTransaction", type);
  };

  const isAchatSelected = form.watch("typeTransaction");

  if (loading || stocksLoading || !data) {
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
                              {obligationData &&
                                obligationData?.map((t: any) => (
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
                                        calculateTotalValue(
                                          t.faceValue || t.facevalue,
                                          form.getValues("quantite"),
                                          "obligation"
                                        )
                                      );
                                      setGrossAmount(
                                        calculateGrossAmount(
                                          Number(t.faceValue || t.facevalue),
                                          form.getValues("quantite")
                                        )
                                      );
                                      setOpen(false);

                                      // Set extra fields data
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
                  {data?.isinCode || data?.isincode || "N/A"}
                </div>
              </div>
              <FormField
                control={form.control}
                name="typeTransaction"
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

              <div className="flex justify-between items-baseline">
                <div className=" text-gray-400 capitalize">
                  {t("dateEmission")}
                </div>
                <div className="text-lg font-semibold">
                  {((data?.emissionDate || data?.emissiondate) &&
                    formatDate(data.emissionDate || data.emissiondate)) ||
                    "N/A"}
                </div>
              </div>

              <div className="flex justify-between items-baseline">
                <div className=" text-gray-400 capitalize">
                  {t("NombreObligations")}
                </div>
                <div className="text-lg font-semibold">
                  {(data?.quantity && formatNumber(data?.quantity)) || "N/A"}
                </div>
              </div>

              <div className="flex justify-between items-baseline">
                <div className=" text-gray-400 capitalize">
                  {t("tauxInteret")}
                </div>
                <div className="text-lg font-semibold">
                  {data?.dividendRate ||
                    data?.fixedRate ||
                    data?.variableRate ||
                    data?.yieldRate ||
                    0}
                  %
                </div>
              </div>

              {data?.maturityDate && (
                <div className="flex justify-between items-baseline">
                  <div className=" text-gray-400 capitalize">
                    {t("dateEcheance")}
                  </div>
                  <div className="text-lg font-semibold">
                    {formatDate(data.maturityDate)}
                  </div>
                </div>
              )}

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
                  {data?.commission ||
                    process.env.NEXT_PUBLIC_COMMISSION_OBLIGATION ||
                    0}{" "}
                  %
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
                  <ArrowRight className="hidden group-hover:block text-white" />
                )}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </>
  );
};

export default FormPassationOrdreObligation;
