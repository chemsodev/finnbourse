"use client";
import { useForm } from "react-hook-form";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLocale, useTranslations } from "next-intl";
import { useToast } from "@/hooks/use-toast";
import { TitreFormValues } from "./titreSchemaValidation";
import { cn, preventNonNumericInput } from "@/lib/utils";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { CalendarIcon } from "lucide-react";
import { fr, ar, enUS } from "date-fns/locale";
import { format } from "date-fns";
import { useStockApi } from "@/hooks/useStockApi";

interface EditSecondaryMarketTitreProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues: TitreFormValues;
  onSuccess?: () => void;
  isIOB?: boolean;
}

export function EditSecondaryMarketTitre({
  open,
  onOpenChange,
  defaultValues,
  onSuccess,
  isIOB = false,
}: EditSecondaryMarketTitreProps) {
  const t = useTranslations("GestionDesTitres.EditSecondaryMarketTitre");
  const { toast } = useToast();
  const locale = useLocale();
  const api = useStockApi();

  const form = useForm<TitreFormValues>({
    defaultValues: {
      ...defaultValues,
      stockPrice: {
        price: defaultValues.stockPrice?.price || 0,
        date: defaultValues.stockPrice?.date || new Date(),
        gap: defaultValues.stockPrice?.gap || 0,
      },
    },
  });

  console.log(isIOB, "isIOB prop value");
  const getDateLocale = () => {
    switch (locale) {
      case "fr":
        return fr;
      case "ar":
        return ar;
      default:
        return enUS;
    }
  };

  const formatDateDisplay = (date: Date) => {
    return format(date, locale === "ar" ? "dd/MM/yyyy" : "PPP", {
      locale: getDateLocale(),
    });
  };

  async function onSubmit(values: TitreFormValues) {
    try {
      // Validate required fields
      if (!values.id) {
        throw new Error("Stock ID is required");
      }

      const moveToSecondaryData = {
        price: values.stockPrice.price,
        gap: values.stockPrice.gap,
        date: values.stockPrice.date.toISOString(),
      };

      const response = isIOB
        ? await api.updateIobMarketSecondary(values.id, moveToSecondaryData)
        : await api.moveToSecondary(values.id, moveToSecondaryData);

      console.log("Update response:", response);

      toast({
        variant: "success",
        title: t("success.title"),
        description: t("success.description"),
      });

      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("Update failed:", error);
      toast({
        variant: "destructive",
        title: t("error.title"),
        description:
          error instanceof Error ? error.message : t("error.description"),
      });
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-primary">
            {t("editStockPrice")}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            {/* Price Field */}
            <FormField
              control={form.control}
              name="stockPrice.price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("price")}</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      step="1"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Gap Field */}
            {/* <FormField
              control={form.control}
              name="stockPrice.gap"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("gap")} (%)</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="-100"
                      max="100"
                      step="0.01"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            /> */}

            <FormField
              control={form.control}
              name="stockPrice.gap"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("gap")} (%)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type="number"
                        min="-100"
                        max="100"
                        step="0.1"
                        placeholder="Enter gap"
                        value={field.value ?? ""}
                        onChange={(e) => {
                          const value = e.target.value;

                          if (value === "") {
                            field.onChange(undefined);
                            return;
                          }

                          const numValue = parseFloat(value);

                          // Validate the number
                          if (!isNaN(numValue)) {
                            // Clamp between -100 and 100
                            const clampedValue = Math.min(
                              Math.max(numValue, -100),
                              100
                            );
                            field.onChange(clampedValue);
                          }
                        }}
                        onBlur={() => {
                          // Format to 2 decimal places on blur
                          if (
                            field.value !== undefined &&
                            field.value !== null
                          ) {
                            field.onChange(Number(field.value.toFixed(2)));
                          }
                        }}
                        onKeyDown={preventNonNumericInput}
                        className="w-full pr-8"
                      />
                      <span className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground text-sm font-medium">
                        %
                      </span>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Date Field */}
            <FormField
              control={form.control}
              name="stockPrice.date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>{t("date")}</FormLabel>
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
                            formatDateDisplay(field.value)
                          ) : (
                            <span>{t("form.pickDate")}</span>
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
                        fromYear={2000}
                        toYear={2050}
                        locale={getDateLocale()}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-end space-x-2 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                {t("cancel")}
              </Button>
              <Button type="submit" className="w-full">
                {t("saveChanges")}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
