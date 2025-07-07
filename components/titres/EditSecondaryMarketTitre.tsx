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
import { useTranslations } from "next-intl";
import { useToast } from "@/hooks/use-toast";
import { TitreFormValues } from "./titreSchemaValidation";
import { preventNonNumericInput } from "@/lib/utils";

interface EditSecondaryMarketTitreProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues: TitreFormValues;
  onSuccess?: () => void;
}

export function EditSecondaryMarketTitre({
  open,
  onOpenChange,
  defaultValues,
  onSuccess,
}: EditSecondaryMarketTitreProps) {
  const t = useTranslations("GestionDesTitres.EditSecondaryMarketTitre");
  const { toast } = useToast();

  const form = useForm<TitreFormValues>({
    defaultValues: {
      ...defaultValues,
      stockPrice: {
        price: defaultValues.stockPrice?.price || 0,
        gap: defaultValues.stockPrice?.gap || 0,
      },
    },
  });

  async function onSubmit(values: TitreFormValues) {
    try {
      console.log("Submitting secondary market values:", values);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: t("success.title"),
        description: t("success.description"),
      });

      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      toast({
        variant: "destructive",
        title: t("error.title"),
        description: t("error.description"),
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
                      step="0.01"
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
                        step="0.01"
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
