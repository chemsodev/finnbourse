"use client";

import { useState } from "react";
import { CalendarIcon, Check, ChevronsUpDown } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { useTranslations } from "next-intl";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
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
import { useForm } from "react-hook-form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocale } from "next-intl";

const algerianSecurities = [
  { value: "SAIDAL", label: "SAIDAL" },
  { value: "ALLIANCE", label: "ALLIANCE ASSURANCES" },
  { value: "BIOPHARM", label: "BIOPHARM" },
  { value: "AUR", label: "AUR" },
  { value: "DAHLI", label: "DAHLI" },
];

export default function PaiementDuCoupon() {
  const t = useTranslations("PaiementCoupon");
  const locale = useLocale();

  const [dates, setDates] = useState({
    dateExecution: undefined,
    dateValeurPaiement: undefined,
  });

  const [open, setOpen] = useState(false);

  const form = useForm({
    defaultValues: {
      titrePrincipal: "",
      referenceost: "",
      evenement: "",
      descriptionOst: "",
      prixUnitaireNet: "",
      commentaire: "",
    },
  });

  const handleDateChange = (field: any, value: any) => {
    setDates((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const onSubmit = (data: any) => {
    console.log({ ...data, ...dates });
  };

  return (
    <div className="container mx-auto py-10 px-4 max-w-5xl">
      <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <div className="flex justify-between items-center mb-8 pb-4 border-b">
          <h1 className="text-3xl font-bold text-secondary">{t("title")}</h1>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Row 1 */}
              <FormField
                control={form.control}
                name="titrePrincipal"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel className="text-gray-700">
                      {t("selectionTitrePrincipal")}
                    </FormLabel>
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={open}
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
                            {algerianSecurities?.map((security) => (
                              <CommandItem
                                key={security.value}
                                value={security.value}
                                onSelect={(value) => {
                                  form.setValue("titrePrincipal", value);
                                  setOpen(false);
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
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="referenceost"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">
                      {t("referenceOst")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder=""
                        {...field}
                        className="border-gray-300 focus:border-blue-500"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="evenement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">
                      {t("evenement")}
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="border-gray-300 focus:border-blue-500">
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
                  </FormItem>
                )}
              />

              {/* Row 2 */}
              <FormField
                control={form.control}
                name="descriptionOst"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">
                      {t("descriptionOst")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder=""
                        {...field}
                        className="border-gray-300 focus:border-blue-500"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="prixUnitaireNet"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-gray-700">
                      {t("montantUnitaireNet")}
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder=""
                        {...field}
                        className="border-gray-300 focus:border-blue-500"
                      />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>

            {/* Date Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormItem>
                <FormLabel className="text-gray-700">
                  {t("dateExecution")}
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal border-gray-300 focus:border-blue-500",
                          !dates.dateExecution && "text-muted-foreground"
                        )}
                      >
                        {dates.dateExecution ? (
                          format(dates.dateExecution, "P", {
                            locale: locale === "fr" ? fr : undefined,
                          })
                        ) : (
                          <span></span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dates.dateExecution}
                      onSelect={(date) =>
                        handleDateChange("dateExecution", date)
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </FormItem>

              <FormItem>
                <FormLabel className="text-gray-700">
                  {t("dateValeurPaiement")}
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal border-gray-300 focus:border-blue-500",
                          !dates.dateValeurPaiement && "text-muted-foreground"
                        )}
                      >
                        {dates.dateValeurPaiement ? (
                          format(dates.dateValeurPaiement, "P", {
                            locale: locale === "fr" ? fr : undefined,
                          })
                        ) : (
                          <span></span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={dates.dateValeurPaiement}
                      onSelect={(date) =>
                        handleDateChange("dateValeurPaiement", date)
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </FormItem>
            </div>

            {/* Commentaire */}
            <FormField
              control={form.control}
              name="commentaire"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-gray-700">
                    {t("commentaire")}
                  </FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder=""
                      {...field}
                      className="border-gray-300 focus:border-blue-500 min-h-[100px]"
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            {/* Buttons */}
            <div className="flex justify-center gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 border-none px-6"
              >
                {t("annuler")}
              </Button>

              <Button type="submit">{t("valider")}</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
