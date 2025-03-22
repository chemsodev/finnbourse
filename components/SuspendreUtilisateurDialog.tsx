"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { useLocale, useTranslations } from "next-intl";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { cn } from "@/lib/utils";
import { fr, ar, enUS } from "date-fns/locale";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { format, isBefore, startOfDay } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, Loader2 } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "@/i18n/routing";
import { useSession } from "next-auth/react";

const formSchema = z.object({
  dateSuspension: z.coerce.date(),
  motifSuspention: z.string(),
});

const SuspendreUtilisateurDialog = (userEmail: { userEmail: string }) => {
  const locale = useLocale();
  const router = useRouter();
  const session = useSession();
  const t = useTranslations("clients");
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      dateSuspension: new Date(),
      motifSuspention: "",
    },
  });
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/ban-user`,
        {
          method: "POST",
          body: JSON.stringify({
            email: userEmail.userEmail,
            bandto: values.dateSuspension.toISOString(),
            banreason: values.motifSuspention,
          }),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.data?.user.token}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Failed to suspend user");
      }
      router.refresh();
      toast({
        variant: "success",
        title: t("success"),
        description: t("successDescription"),
      });
      setOpen(false);
    } catch (error) {
      console.error("Error fetching data:", error);
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

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button className="w-full bg-orange-400 hover:bg-orange-300 shadow">
          {t("suspend")}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("description")}</AlertDialogTitle>
          <AlertDialogDescription>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-8 max-w-3xl mx-auto pt-10"
              >
                <FormField
                  control={form.control}
                  name="dateSuspension"
                  render={({ field }) => (
                    <FormItem className="flex flex-col">
                      <FormLabel>{t("selectDate")}</FormLabel>
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
                                <span>{t("pickDate")}</span>
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
                            disabled={(date) =>
                              isBefore(date, startOfDay(new Date()))
                            }
                            captionLayout="dropdown-buttons"
                            fromYear={1950}
                            toYear={2050}
                            locale={
                              locale === "fr" ? fr : locale === "en" ? enUS : ar
                            }
                          />
                        </PopoverContent>
                      </Popover>
                      <FormDescription>{t("descriptionDate")}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="motifSuspention"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("motif")}</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Motif..."
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>{t("descriptionMotif")}</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end gap-2">
                  <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="bg-orange-400 hover:bg-orange-300 shadow"
                  >
                    {t("continue")}
                    {loading && <Loader2 className="animate-spin ml-2" />}
                  </Button>
                </div>
              </form>
            </Form>
          </AlertDialogDescription>
        </AlertDialogHeader>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SuspendreUtilisateurDialog;
