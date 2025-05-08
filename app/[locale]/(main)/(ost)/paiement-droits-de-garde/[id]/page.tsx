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
  createDroitsGarde,
  updateDroitsGarde,
  getDroitsGardeById,
} from "@/lib/droits-garde-service";
import { createDroitsGardeSchema, type DroitsGardeFormValues } from "../schema";

export default function DroitsGardeForm({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const t = useTranslations("PaiementDroitsDeGarde");
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEditMode = params.id !== "nouveau";

  // Create schema with translations
  const droitsGardeSchema = createDroitsGardeSchema(t);

  const form = useForm<DroitsGardeFormValues>({
    resolver: zodResolver(droitsGardeSchema),
    defaultValues: {
      titrePrincipal: "",
      referenceost: "",
      descriptionOst: "",
      dateExecution: new Date(),
      actionAnc: "",
      titreResultant: "",
      nouvelleAction: "",
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
        const payment = await getDroitsGardeById(parseInt(params.id));
        if (!payment) {
          toast({
            title: t("error"),
            description: t("paymentNotFound"),
            variant: "destructive",
          });
          router.push("/paiement-droits-de-garde");
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

  const onSubmit = async (values: DroitsGardeFormValues) => {
    setIsSubmitting(true);
    try {
      if (isEditMode) {
        await updateDroitsGarde(parseInt(params.id), values);
        toast({
          title: t("success"),
          description: t("updateSuccess"),
          variant: "success",
        });
      } else {
        await createDroitsGarde(values);
        toast({
          title: t("success"),
          description: t("createSuccess"),
          variant: "success",
        });
      }
      router.push("/paiement-droits-de-garde");
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
    return <div>{t("loading")}</div>; // Consider adding a proper loading skeleton
  }

  return (
    <div className="container mx-auto py-10">
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.push("/paiement-droits-de-garde")}
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">{t("back")}</span>
        </Button>
        <h1 className="text-3xl font-bold text-gray-800">
          {isEditMode ? t("editDroitsGarde") : t("addNewDroitsGarde")}
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
                name="dateExecution"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("dateExecution")}</FormLabel>
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
                name="actionAnc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("actionAnc")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="titreResultant"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("titreResultant")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="nouvelleAction"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("nouvelleAction")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
                    <FormLabel>{t("descriptionOST")}</FormLabel>
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
                    <FormLabel>{t("commentaire")}</FormLabel>
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
                onClick={() => router.push("/paiement-droits-de-garde")}
              >
                {t("cancel")}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                <Save className="mr-2 h-4 w-4" />
                {t("validate")}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
