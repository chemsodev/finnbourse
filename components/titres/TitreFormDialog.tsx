"use client";
import * as React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn, preventNonNumericInput } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFieldArray } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon } from "lucide-react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useLocale, useTranslations } from "next-intl";
import { useToast } from "@/hooks/use-toast";
import { fr, ar, enUS } from "date-fns/locale";
import { TitreFormValues, TitreSchema } from "./titreSchemaValidation";
import { MultiSelect } from "@/components/ui/multi-select";

interface Company {
  id: string;
  name: string;
}

type TitreFormDialogProps = {
  type: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues?: TitreFormValues;
  onSuccess?: () => void;
  isEdit?: boolean;
  companies?: Company[];
};

export function TitreFormDialog({
  type,
  open,
  onOpenChange,
  defaultValues,
  onSuccess,
  isEdit = false,
}: //   companies = [],
TitreFormDialogProps) {
  const { toast } = useToast();
  const locale = useLocale();
  const obligations = ["empruntobligataire", "titresparticipatifs", "sukukmp"];
  const t = useTranslations(
    isEdit ? "GestionDesTitres.EditTitre" : "GestionDesTitres.CreateTitre"
  );

  const [companies, setCompanies] = React.useState<Company[]>([]);
  const [fetchingCompanies, setFetchingCompanies] = React.useState(true);
  const [institutions, setInstitutions] = React.useState<
    { id: string; name: string }[]
  >([]);
  const [fetchingInstitutions, setFetchingInstitutions] = React.useState(false);

  // Fetch institutions from backend
  React.useEffect(() => {
    if (!open) return;

    const fetchInstitutions = async () => {
      try {
        setFetchingInstitutions(true);
        // TODO: Replace with actual API call
        // const response = await fetch('/api/institutions');
        // const data = await response.json();

        // Mock data
        const mockInstitutions = [
          { id: "1", name: "Bank A" },
          { id: "2", name: "Bank B" },
          { id: "3", name: "Bank C" },
        ];

        setInstitutions(mockInstitutions);
      } catch (error) {
        console.error("Error fetching institutions:", error);
        toast({
          variant: "destructive",
          title: t("error"),
          description: t("fetchError"),
        });
      } finally {
        setFetchingInstitutions(false);
      }
    };

    fetchInstitutions();
  }, [open, toast, t]);

  // Fetch companies on mount
  React.useEffect(() => {
    if (!open) return;
    const fetchCompanies = async () => {
      try {
        // TODO: Replace with actual API call
        setCompanies([
          { id: "1", name: "Company A" },
          { id: "2", name: "Company B" },
        ]);
      } catch (error) {
        console.error("Error fetching companies:", error);
        toast({
          variant: "destructive",
          title: t("error"),
          description: t("fetchError"),
        });
      } finally {
        setFetchingCompanies(false);
      }
    };

    fetchCompanies();
  }, [open, toast, t]);

  const form = useForm<TitreFormValues>({
    resolver: zodResolver(TitreSchema),
    defaultValues: defaultValues || {
      name: "",
      issuer: "",
      isinCode: "",
      code: "",
      faceValue: 0,
      quantity: 1,
      emissionDate: new Date(),
      closingDate: new Date(),
      enjoymentDate: new Date(),
      marketListing: "",
      type: type,
      status: "activated",
      stockPrice: {
        price: 0,
        date: new Date(),
        gap: 0,
      },
    },
  });

  // Watch for changes in the form
  const durationYears = form.watch("durationYears");
  const watchedType = form.watch("type");
  React.useEffect(() => {
    console.log("TitreFormDialog type:", watchedType);
  }, [watchedType]);

  // Payment Schedule Field Array setup
  const {
    fields: paymentScheduleFields,
    append: appendPaymentSchedule,
    remove: removePaymentSchedule,
  } = useFieldArray({
    control: form.control,
    name: "paymentSchedule",
  });

  // Effect to update payment schedule when duration changes
  React.useEffect(() => {
    if (!obligations.includes(watchedType) || !durationYears) return;

    // Clear existing fields
    paymentScheduleFields.forEach((_, index) => removePaymentSchedule(index));

    // Add new fields based on duration
    for (let i = 0; i < durationYears; i++) {
      appendPaymentSchedule({
        date: new Date(
          new Date().setFullYear(new Date().getFullYear() + i + 1)
        ),
        couponRate: 0,
        capitalRate: 0,
      });
    }
  }, [durationYears, watchedType]);

  async function onSubmit(values: TitreFormValues) {
    try {
      // TODO: Replace with actual API call
      // const url = isEdit
      //   ? `/api/securities/${values.id}`
      //   : '/api/securities';
      // const method = isEdit ? 'PUT' : 'POST';
      //
      // const response = await fetch(url, {
      //   method,
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(values)
      // });

      // Simulate API call using values
      console.log("Submitting form values:", values);
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        variant: "success",
        title: t("success.title"),
        description: t("success.description"),
      });

      form.reset();
      onOpenChange(false);
      onSuccess?.();
    } catch (error) {
      console.error("Form submission error", error);
      toast({
        variant: "destructive",
        title: t("error.title"),
        description: t("error.description"),
      });
    }
  }

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

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto space-y- p-8">
        <DialogHeader>
          <DialogTitle className="text-primary text-2xl text-center">
            {t(isEdit ? "editTitre" : "ajouterUnTitre")}
          </DialogTitle>
        </DialogHeader>
        {fetchingCompanies ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Basic Information Section */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold border-b pb-2">
                  {/* {t("form.basicInformation")} */} Essential Informations
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {/* Issuer Selection */}
                  <FormField
                    control={form.control}
                    name="issuer"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>{t("form.issuer")}</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant="outline"
                                role="combobox"
                                className={cn(
                                  "justify-between",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value
                                  ? companies.find(
                                      (company) => company.id === field.value
                                    )?.name
                                  : t("form.selectIssuer")}
                                <ChevronsUpDown className="ml-2 h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="p-0">
                            <Command>
                              <CommandInput
                                placeholder={t("form.searchIssuer")}
                              />
                              <CommandList>
                                <CommandEmpty>
                                  {t("form.noIssuersFound")}
                                </CommandEmpty>
                                <CommandGroup>
                                  {companies.map((company) => (
                                    <CommandItem
                                      value={company.name}
                                      key={company.id}
                                      onSelect={() => {
                                        form.setValue("issuer", company.id);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          company.id === field.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {company.name}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* ISIN Code */}
                    <FormField
                      control={form.control}
                      name="isinCode"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("form.isinCode")}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Code */}
                    <FormField
                      control={form.control}
                      name="code"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("form.code")}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  {/* Status */}
                  <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("form.status")}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={t("form.selectStatus")}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="activated">
                              {t("form.active")}
                            </SelectItem>
                            <SelectItem value="suspended">
                              {t("form.suspended")}
                            </SelectItem>
                            <SelectItem value="expired">
                              {t("form.expired")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  {/* Capital Operation Field */}
                  <FormField
                    control={form.control}
                    name="capitalOperation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Capital Operation</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select operation type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="augmentation">
                              Augmentation
                            </SelectItem>
                            <SelectItem value="ouverture">Ouverture</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {/* Financial Details Section */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold border-b pb-2">
                    {/* {t("form.financialDetails")} */} Financial Details
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Face Value */}
                    <FormField
                      control={form.control}
                      name="faceValue"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("form.faceValue")}</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                              onKeyDown={preventNonNumericInput}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Quantity */}
                    <FormField
                      control={form.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("form.quantity")}</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="1"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                              onKeyDown={preventNonNumericInput}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Market Listing */}
                    <FormField
                      control={form.control}
                      name="marketListing"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("form.marketListing")}</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={t("form.selectMarket")}
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="primary">
                                {t("form.primaryMarket")}
                              </SelectItem>
                              <SelectItem value="secondary">
                                {t("form.secondaryMarket")}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Voting Rights */}
                    <FormField
                      control={form.control}
                      name="votingRights"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("form.votingRights")}</FormLabel>
                          <Select
                            onValueChange={(value) =>
                              field.onChange(value === "true")
                            }
                            defaultValue={field.value ? "true" : "false"}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue
                                  placeholder={t("form.selectOption")}
                                />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="true">
                                {t("form.yes")}
                              </SelectItem>
                              <SelectItem value="false">
                                {t("form.no")}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Price */}
                    <FormField
                      control={form.control}
                      name="stockPrice.price"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("form.price")}</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                              onKeyDown={preventNonNumericInput}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {/* Dividend Rate */}
                    <FormField
                      control={form.control}
                      name="dividendRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("form.dividendRate")}</FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type="number"
                                min="0"
                                max="100"
                                step="0.01"
                                placeholder="Enter rate"
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
                                    // Clamp between 0 and 100
                                    const clampedValue = Math.min(
                                      Math.max(numValue, 0),
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
                                    field.onChange(
                                      Number(field.value.toFixed(2))
                                    );
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
                    {/* Institutions Section */}
                    <div className="space-y-6 md:col-span-2">
                      <h3 className="text-lg font-semibold border-b pb-2">
                        {/* {t("form.institutionsSection")}  */} Participating
                        Institutions
                      </h3>
                      <FormField
                        control={form.control}
                        name="institutions"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Institutions</FormLabel>
                            <MultiSelect
                              options={institutions.map((inst) => ({
                                value: inst.id,
                                label: inst.name,
                              }))}
                              selected={field.value || []}
                              onChange={field.onChange}
                              placeholder="Select institutions..."
                            />
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>

                {/* Dates Section */}
                <div className="space-y-6 ">
                  <h3 className="text-lg font-semibold border-b pb-2">
                    {t("form.datesSection")}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {/* Emission Date */}
                    <FormField
                      control={form.control}
                      name="emissionDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>{t("form.emissionDate")}</FormLabel>
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
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
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

                    {/* Closing Date */}
                    <FormField
                      control={form.control}
                      name="closingDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>{t("form.closingDate")}</FormLabel>
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
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
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

                    {/* Enjoyment Date */}
                    <FormField
                      control={form.control}
                      name="enjoymentDate"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>{t("form.enjoymentDate")}</FormLabel>
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
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
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
                  </div>
                </div>

                {/* Conditional Fields for obligations */}
                {obligations.includes(watchedType) && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold border-b pb-2">
                      Bond Specific Details
                    </h3>
                    <div className="grid grid-cols-1  gap-4">
                      {/* Maturity Date */}
                      <FormField
                        control={form.control}
                        name="maturityDate"
                        render={({ field }) => (
                          <FormItem className="flex flex-col">
                            <FormLabel>Maturity Date</FormLabel>
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
                                      <span>Select date</span>
                                    )}
                                    <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                  </Button>
                                </FormControl>
                              </PopoverTrigger>
                              <PopoverContent
                                className="w-auto p-0"
                                align="start"
                              >
                                <Calendar
                                  mode="single"
                                  selected={field.value}
                                  onSelect={field.onChange}
                                  fromYear={new Date().getFullYear()}
                                  toYear={new Date().getFullYear() + 30}
                                  locale={getDateLocale()}
                                />
                              </PopoverContent>
                            </Popover>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Duration in Years */}
                      <FormField
                        control={form.control}
                        name="durationYears"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Duration (Years)</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                min="1"
                                max="30"
                                {...field}
                                onChange={(e) =>
                                  field.onChange(Number(e.target.value))
                                }
                                onKeyDown={preventNonNumericInput}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                )}
                {obligations.includes(watchedType) &&
                  durationYears &&
                  durationYears > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold border-b pb-2">
                        Payment Schedule
                      </h3>
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Coupon Rate (%)
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Capital Rate (%)
                              </th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {Array.from({ length: durationYears }).map(
                              (_, index) => (
                                <tr key={index}>
                                  {/* Date Field */}
                                  <td className="px-4 py-4 whitespace-nowrap">
                                    <FormField
                                      control={form.control}
                                      name={`paymentSchedule.${index}.date`}
                                      render={({ field }) => (
                                        <FormItem className="flex flex-col">
                                          <Popover>
                                            <PopoverTrigger asChild>
                                              <FormControl>
                                                <Button
                                                  variant="outline"
                                                  className={cn(
                                                    "w-full pl-3 text-left font-normal",
                                                    !field.value &&
                                                      "text-muted-foreground"
                                                  )}
                                                >
                                                  {field.value ? (
                                                    formatDateDisplay(
                                                      field.value
                                                    )
                                                  ) : (
                                                    <span>Select date</span>
                                                  )}
                                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                                </Button>
                                              </FormControl>
                                            </PopoverTrigger>
                                            <PopoverContent
                                              className="w-auto p-0"
                                              align="start"
                                            >
                                              <Calendar
                                                mode="single"
                                                selected={field.value}
                                                onSelect={field.onChange}
                                                fromYear={new Date().getFullYear()}
                                                toYear={
                                                  new Date().getFullYear() +
                                                  durationYears
                                                }
                                                locale={getDateLocale()}
                                              />
                                            </PopoverContent>
                                          </Popover>
                                          <FormMessage />
                                        </FormItem>
                                      )}
                                    />
                                  </td>

                                  {/* Coupon Rate Field */}
                                  <td className="px-4 py-4 whitespace-nowrap">
                                    <FormField
                                      control={form.control}
                                      name={`paymentSchedule.${index}.couponRate`}
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormControl>
                                            <div className="relative">
                                              <Input
                                                type="number"
                                                min="0"
                                                max="100"
                                                step="0.01"
                                                placeholder="Enter rate"
                                                value={field.value ?? ""}
                                                onChange={(e) => {
                                                  const value = e.target.value;
                                                  if (value === "") {
                                                    field.onChange(undefined);
                                                    return;
                                                  }
                                                  const numValue =
                                                    parseFloat(value);
                                                  if (!isNaN(numValue)) {
                                                    const clampedValue =
                                                      Math.min(
                                                        Math.max(numValue, 0),
                                                        100
                                                      );
                                                    field.onChange(
                                                      clampedValue
                                                    );
                                                  }
                                                }}
                                                onBlur={() => {
                                                  if (
                                                    field.value !== undefined &&
                                                    field.value !== null
                                                  ) {
                                                    field.onChange(
                                                      Number(
                                                        field.value.toFixed(2)
                                                      )
                                                    );
                                                  }
                                                }}
                                                onKeyDown={
                                                  preventNonNumericInput
                                                }
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
                                  </td>

                                  {/* Capital Rate Field */}
                                  <td className="px-4 py-4 whitespace-nowrap">
                                    <FormField
                                      control={form.control}
                                      name={`paymentSchedule.${index}.capitalRate`}
                                      render={({ field }) => (
                                        <FormItem>
                                          <FormControl>
                                            <div className="relative">
                                              <Input
                                                type="number"
                                                min="0"
                                                max="100"
                                                step="0.01"
                                                placeholder="Enter rate"
                                                value={field.value ?? ""}
                                                onChange={(e) => {
                                                  const value = e.target.value;

                                                  if (value === "") {
                                                    field.onChange(undefined);
                                                    return;
                                                  }

                                                  const numValue =
                                                    parseFloat(value);

                                                  // Validate the number
                                                  if (!isNaN(numValue)) {
                                                    // Clamp between 0 and 100
                                                    const clampedValue =
                                                      Math.min(
                                                        Math.max(numValue, 0),
                                                        100
                                                      );
                                                    field.onChange(
                                                      clampedValue
                                                    );
                                                  }
                                                }}
                                                onBlur={() => {
                                                  // Format to 2 decimal places on blur
                                                  if (
                                                    field.value !== undefined &&
                                                    field.value !== null
                                                  ) {
                                                    field.onChange(
                                                      Number(
                                                        field.value.toFixed(2)
                                                      )
                                                    );
                                                  }
                                                }}
                                                onKeyDown={
                                                  preventNonNumericInput
                                                }
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
                                  </td>
                                </tr>
                              )
                            )}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    {t("form.cancel")}
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  disabled={form.formState.isSubmitting}
                  className="flex w-full"
                >
                  {form.formState.isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("form.submitting")}
                    </>
                  ) : (
                    t(isEdit ? "form.update" : "form.submit")
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}
