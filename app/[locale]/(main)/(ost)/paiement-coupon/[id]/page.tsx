"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useTranslations, useLocale } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useToast } from "@/hooks/use-toast";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
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
} from "@/components/ui/command";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { couponPaymentSchema, type CouponPaymentFormValues } from "../schema";
import {
  getCouponPaymentById,
  createCouponPayment,
  updateCouponPayment,
} from "@/lib/coupon-service";

const algerianSecurities = [
  { value: "SAIDAL", label: "SAIDAL" },
  { value: "ALLIANCE", label: "ALLIANCE ASSURANCES" },
  { value: "BIOPHARM", label: "BIOPHARM" },
  { value: "AUR", label: "AUR" },
  { value: "DAHLI", label: "DAHLI" },
];

export default function CouponPaymentForm({
  params,
}: {
  params: { id: string };
}) {
  const t = useTranslations("PaiementCoupon");
  const locale = useLocale();
  const { toast } = useToast();
  const router = useRouter();
  const [openSecurity, setOpenSecurity] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEditMode = params.id !== "nouveau";

  const form = useForm<CouponPaymentFormValues>({
    resolver: zodResolver(couponPaymentSchema),
    defaultValues: {
      titrePrincipal: "",
      referenceost: "",
      evenement: "",
      dateExecution: new Date(),
      dateValeurPaiement: new Date(),
      prixUnitaireNet: "",
      descriptionOst: "",
      commentaire: "",
    },
  });

  useEffect(() => {
    const fetchPayment = async () => {
      if (!isEditMode) {
        setIsLoading(false);
        return;
      }

      try {
        const payment = await getCouponPaymentById(parseInt(params.id));
        if (!payment) {
          toast({
            title: t("error"),
            description: t("paymentNotFound"),
            variant: "destructive",
          });
          router.push("/paiement-coupon");
          return;
        }
        form.reset(payment);
      } catch (error) {
        console.error("Error fetching payment:", error);
        toast({
          title: t("error"),
          description: t("errorFetchingPayment"),
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchPayment();
  }, [isEditMode, params.id, form, router, toast, t]);

  const onSubmit = async (values: CouponPaymentFormValues) => {
    setIsSubmitting(true);
    try {
      if (isEditMode) {
        await updateCouponPayment(parseInt(params.id), values);
        toast({
          title: t("success"),
          description: t("updateSuccess"),
          variant: "success",
        });
      } else {
        await createCouponPayment(values);
        toast({
          title: t("success"),
          description: t("createSuccess"),
          variant: "success",
        });
      }
      router.push("/paiement-coupon");
    } catch (error) {
      console.error("Error saving payment:", error);
      toast({
        title: t("error"),
        description: isEditMode ? t("updateError") : t("createError"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) return <div>{t("loading")}</div>;

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.push("/paiement-coupon")}
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">{t("back")}</span>
        </Button>
        <h1 className="text-3xl font-bold text-gray-800">
          {isEditMode ? t("editCoupon") : t("addNewCoupon")}
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Security Selection */}
              <FormField
                control={form.control}
                name="titrePrincipal"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{t("selectionTitrePrincipal")}</FormLabel>
                    <Popover open={openSecurity} onOpenChange={setOpenSecurity}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={openSecurity}
                            className="justify-between"
                          >
                            {field.value
                              ? algerianSecurities.find(
                                  (security) => security.value === field.value
                                )?.label
                              : t("selectionnerTitre")}
                            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="p-0">
                        <Command>
                          <CommandInput placeholder={t("selectionnerTitre")} />
                          <CommandEmpty>{t("aucunTitreTrouve")}</CommandEmpty>
                          <CommandGroup>
                            {algerianSecurities.map((security) => (
                              <CommandItem
                                key={security.value}
                                value={security.value}
                                onSelect={() => {
                                  form.setValue(
                                    "titrePrincipal",
                                    security.value
                                  );
                                  setOpenSecurity(false);
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    field.value === security.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {security.label}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Reference OST */}
              <FormField
                control={form.control}
                name="referenceost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("referenceOst")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Event Type */}
              <FormField
                control={form.control}
                name="evenement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("evenement")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("evenement")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="primaire">
                          {t("primaire")}
                        </SelectItem>
                        <SelectItem value="secondaire">
                          {t("secondaire")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Description OST */}
              <FormField
                control={form.control}
                name="descriptionOst"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("descriptionOst")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Unit Price */}
              <FormField
                control={form.control}
                name="prixUnitaireNet"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("montantUnitaireNet")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Date Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="dateExecution"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{t("dateExecution")}</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "P", {
                                locale: locale === "fr" ? fr : undefined,
                              })
                            ) : (
                              <span>{t("selectDate")}</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
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
                name="dateValeurPaiement"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{t("dateValeurPaiement")}</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "P", {
                                locale: locale === "fr" ? fr : undefined,
                              })
                            ) : (
                              <span>{t("selectDate")}</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
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

            {/* Comment */}
            <FormField
              control={form.control}
              name="commentaire"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("commentaire")}</FormLabel>
                  <FormControl>
                    <Textarea className="min-h-[100px]" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Buttons */}
            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/paiement-coupon")}
              >
                {t("annuler")}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isEditMode ? t("sauvegarder") : t("creer")}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
