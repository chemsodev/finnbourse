"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Save } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Button } from "@/components/ui/button";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { CalendarIcon } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import {
  createDividendPayment,
  updateDividendPayment,
  getDividendPaymentById,
} from "@/lib/dividend-service";
import {
  dividendPaymentSchema,
  type DividendPaymentFormValues,
} from "../schema";
import Loading from "@/components/ui/loading";

export default function DividendPaymentForm({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const t = useTranslations("PaiementDividende");
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = params.id !== "nouveau";

  const form = useForm<DividendPaymentFormValues>({
    resolver: zodResolver(dividendPaymentSchema),
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

  // Fetch payment data if in edit mode
  useEffect(() => {
    const fetchPayment = async () => {
      if (!isEditMode) {
        setIsLoading(false);
        return;
      }

      try {
        const payment = await getDividendPaymentById(parseInt(params.id));
        if (!payment) {
          toast({
            title: t("error"),
            description: t("paymentNotFound"),
            variant: "destructive",
          });
          router.push("/paiement-de-dividendes");
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

  const onSubmit = async (values: DividendPaymentFormValues) => {
    setIsSubmitting(true);
    try {
      if (isEditMode) {
        await updateDividendPayment(parseInt(params.id), values);
        toast({
          title: t("success"),
          description: t("updateSuccess"),
          variant: "success",
        });
      } else {
        await createDividendPayment(values);
        toast({
          title: t("success"),
          description: t("createSuccess"),
          variant: "success",
        });
      }
      router.push("/paiement-de-dividendes");
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

  if (isLoading) {
    return <Loading className="min-h-[400px]" />;
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.push("/paiement-de-dividendes")}
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">{t("back")}</span>
        </Button>
        <h1 className="text-3xl font-bold text-gray-800">
          {isEditMode ? t("editDividend") : t("addNewDividend")}
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="titrePrincipal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("selectionTitrePrincipal")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="referenceost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("referenceOST")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

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
                          <SelectValue placeholder={t("selectEvent")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="primaire">{t("primary")}</SelectItem>
                        <SelectItem value="secondaire">
                          {t("secondary")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="dateExecution"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("executionDate")}</FormLabel>
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
                              format(field.value, "PPP", { locale: fr })
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
                          disabled={(date) => date < new Date()}
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
                  <FormItem>
                    <FormLabel>{t("paymentValueDate")}</FormLabel>
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
                              format(field.value, "PPP", { locale: fr })
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
                          disabled={(date) => date < new Date()}
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
                name="prixUnitaireNet"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("netUnitAmount")}</FormLabel>
                    <FormControl>
                      <Input type="number" step="0.01" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="descriptionOst"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("ostDescription")}</FormLabel>
                    <FormControl>
                      <Textarea className="min-h-[100px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="commentaire"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("comment")}</FormLabel>
                    <FormControl>
                      <Textarea className="min-h-[100px]" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/paiement-de-dividendes")}
              >
                {t("cancel")}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                <Save className="mr-2 h-4 w-4" />
                {isEditMode ? t("save") : t("create")}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
