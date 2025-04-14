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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";

const algerianSecurities = [
  { value: "SAIDAL", label: "SAIDAL" },
  { value: "ALLIANCE", label: "ALLIANCE ASSURANCES" },
  { value: "BIOPHARM", label: "BIOPHARM" },
  { value: "AUR", label: "AUR" },
  { value: "DAHLI", label: "DAHLI" },
];

export default function OperationsForm() {
  const t = useTranslations("Remboursement");

  const [dates, setDates] = useState({
    dateExecution: undefined,
    dateValeurPaiement: undefined,
  });

  const [open, setOpen] = useState(false);

  const form = useForm({
    defaultValues: {
      titrePrincipal: "",
      referenceOst: "",
      evenement: "primaire-secondaire",
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
        <div className="flex justify-between items-center mb-8 pb-8 border-b">
          <h1 className="text-3xl font-bold text-secondary">{t("title")}</h1>
        </div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Row 1 */}
              <div>
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
                              className="justify-between bg-gray-50 border-gray-200"
                            >
                              {field.value
                                ? algerianSecurities.find(
                                    (security) => security.value === field.value
                                  )?.label
                                : t("selectTitle")}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="p-0">
                          <Command>
                            <CommandInput placeholder={t("searchTitle")} />
                            <CommandEmpty>{t("noTitleFound")}</CommandEmpty>
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
              </div>

              <div>
                <FormField
                  control={form.control}
                  name="referenceOst"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">
                        {t("referenceOst")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder=""
                          {...field}
                          className="bg-gray-50 border-gray-200"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div className="md:col-span-1">
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
                          <SelectTrigger className="bg-gray-400 text-white border-gray-400">
                            <SelectValue placeholder={t("primarySecondary")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="primaire">
                            {t("primary")}
                          </SelectItem>
                          <SelectItem value="secondaire">
                            {t("secondary")}
                          </SelectItem>
                          <SelectItem value="primaire-secondaire">
                            {t("primarySecondary")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>

              {/* Row 2 */}
              <div>
                <FormField
                  control={form.control}
                  name="descriptionOst"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">
                        {t("descriptionOST")}
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder=""
                          {...field}
                          className="bg-gray-50 border-gray-200"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              <div>
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
                          className="bg-gray-50 border-gray-200"
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>

              {/* Row 3 */}
              <div>
                <FormLabel className="text-gray-700">
                  {t("dateExecution")}
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal bg-gray-50 border-gray-200",
                        !dates.dateExecution && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dates.dateExecution ? (
                        format(dates.dateExecution, "PPP", { locale: fr })
                      ) : (
                        <span>{t("dateExecution")}</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
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
              </div>

              <div>
                <FormLabel className="text-gray-700">
                  {t("valuePaymentDate")}
                </FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full justify-start text-left font-normal bg-gray-50 border-gray-200",
                        !dates.dateValeurPaiement && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dates.dateValeurPaiement ? (
                        format(dates.dateValeurPaiement, "PPP", {
                          locale: fr,
                        })
                      ) : (
                        <span>{t("valuePaymentDate")}</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
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
              </div>

              <div className="md:col-span-3">
                <FormField
                  control={form.control}
                  name="commentaire"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700">
                        {t("comment")}
                      </FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder=""
                          className="resize-none h-32 bg-gray-50 border-gray-200"
                          {...field}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                className="border-gray-300 text-gray-700 hover:bg-gray-100"
              >
                {t("cancel")}
              </Button>
              <Button type="submit" className="bg-primary text-white">
                {t("validate")}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
