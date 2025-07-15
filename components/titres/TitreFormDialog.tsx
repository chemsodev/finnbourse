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
import { useStockApi } from "@/hooks/useStockApi";
import { useIssuer } from "@/hooks/useIssuer";
import { useFinancialInstitution } from "@/hooks/useFinancialInstitution";
import { MoveToSecondaryData, Stock } from "@/types/gestionTitres";
import { Label } from "../ui/label";

interface Company {
  id: string;
  name: string;
}

type TitreFormDialogProps = {
  type: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues?: TitreFormValues;
  onSuccess?: (newStock: Stock) => void;
  isEdit?: boolean;
  companies?: Company[];
  isIOB?: boolean;
};

export function TitreFormDialog({
  type,
  open,
  onOpenChange,
  defaultValues,
  onSuccess,
  isEdit = false,
  isIOB = false,
}: //   companies = [],
TitreFormDialogProps) {
  const { toast } = useToast();
  const locale = useLocale();
  const api = useStockApi();
  const obligations = ["oat", "obligationsOrdinaires", "sukuk"];
  const t = useTranslations(
    isEdit ? "GestionDesTitres.EditTitre" : "GestionDesTitres.CreateTitre"
  );

  // const [institutions, setInstitutions] = React.useState<
  //   { id: string; institutionName: string }[]
  // >([]);

  // Fetch financial institutions and issuers
  const {
    institutions: financialInstitutions,
    isLoading: institutionsLoading,
  } = useFinancialInstitution();

  const { issuers, isLoading: issuersLoading } = useIssuer();

  const form = useForm<TitreFormValues>({
    resolver: zodResolver(TitreSchema),
    defaultValues: defaultValues || {
      // name: "",
      stockType: type as
        | "action"
        | "obligation"
        | "sukuk"
        | "obligationsOrdinaires"
        | "oat"
        | undefined,
      issuer: "",
      isinCode: "",
      code: "",
      // faceValue: 0,
      // quantity: 1,
      emissionDate: new Date(),
      closingDate: new Date(),
      enjoymentDate: new Date(),
      maturityDate: new Date(),
      marketListing: "PME",
      capitalOperation:
        type === "action" ? "ouverture" : "empruntObligatairePublic",
      votingRights: false,
      master: "",
      institutions: [],
      capitalRepaymentSchedule: [],
      couponSchedule: [],
      status: "activated",
      price: 0,
      stockPrice: {
        price: 0,
        date: new Date(),
        gap: 0,
      },
    },
  });

  React.useEffect(() => {
    const subscription = form.watch((value, { name, type }) => {
      console.log("Form values:", value);
      console.log("Form errors:", form.formState.errors);
      isEdit &&
        console.log("Editing stock with ID:", defaultValues?.id, defaultValues);
    });
    return () => subscription.unsubscribe();
  }, [form, defaultValues, isEdit]);

  // Watch for changes in the form
  const durationYears = form.watch("durationYears");
  const watchedType = form.watch("stockType");
  console.log(watchedType);
  const watchedMaster = form.watch("institutions.0");

  const { replace: replaceCapitalRepayment } = useFieldArray({
    control: form.control,
    name: "capitalRepaymentSchedule",
  });

  const { replace: replaceCoupon } = useFieldArray({
    control: form.control,
    name: "couponSchedule",
  });

  React.useEffect(() => {
    if (
      watchedType !== "obligation" ||
      obligations.includes(watchedType) ||
      !durationYears ||
      durationYears <= 0
    ) {
      // Clear schedules if not obligation or no duration
      replaceCapitalRepayment([]);
      replaceCoupon([]);
      return;
    }

    // Generate capital repayment schedule
    const capitalSchedule = Array.from({ length: durationYears }, (_, i) => ({
      date: new Date(new Date().setFullYear(new Date().getFullYear() + i + 1)),
      rate: 0,
    }));

    // Generate coupon schedule
    const couponScheduleItems = Array.from(
      { length: durationYears },
      (_, i) => ({
        date: new Date(
          new Date().setFullYear(new Date().getFullYear() + i + 1)
        ),
        rate: 0,
      })
    );
    replaceCapitalRepayment(capitalSchedule);
    replaceCoupon(couponScheduleItems);
  }, [durationYears, watchedType, replaceCapitalRepayment, replaceCoupon]);

  async function onSubmit(values: TitreFormValues) {
    try {
      await form.trigger();

      if (!form.formState.isValid) {
        console.log("Form is invalid, not submitting");
        return;
      }
      // Simulate API call using values
      console.log("Submitting form values:", values);
      const firstInstitutionId = values.institutions?.[0] ?? "";

      const payload = {
        ...values,
        master: watchedMaster ? watchedMaster : firstInstitutionId,
        votingRights: values.votingRights ?? false,
        stockType: watchedType ? watchedType : "action",
        emissionDate: new Date(values.emissionDate),
        closingDate: new Date(values.closingDate),
        enjoymentDate: new Date(values.enjoymentDate),

        ...(watchedType === "obligation" && values.maturityDate
          ? { maturityDate: new Date(values.maturityDate) }
          : {}),

        // isPrimary: values.isPrimary ?? false,
        // paymentSchedule: values?.paymentSchedule?.map((item) => ({
        //   ...item,
        //   date: item.date.toISOString(),
        // })),
        institutions: values.institutions || [],
        stockPrice: {
          ...values.stockPrice,
          date: new Date(values.stockPrice.date),
        },
        // payment schedule arrays
        // type == "obligation"
        capitalRepaymentSchedule:
          values.capitalRepaymentSchedule?.map((item) => ({
            date: new Date(item.date),
            rate: item.rate,
          })) || [],
        couponSchedule:
          values.couponSchedule?.map((item) => ({
            date: new Date(item.date),
            rate: item.rate,
          })) || [],
      };

      console.log("Submitting payload:", payload);

      // let response;
      // if (isEdit && defaultValues?.id) {
      //   const moveToSecondaryData: MoveToSecondaryData = {
      //     price: payload.stockPrice.price,
      //     gap: payload.stockPrice.gap,
      //     date: payload.stockPrice.date.toISOString(),
      //   };
      //   if (isIOB) {
      //     // Use IOB-specific endpoint
      //     response = await api.updateIobMarketSecondary(
      //       defaultValues.id,
      //       moveToSecondaryData
      //     );
      //   } else {
      //     // Use regular secondary market endpoint
      //     response = await api.moveToSecondary(
      //       defaultValues.id,
      //       moveToSecondaryData
      //     );
      //   }
      // } else {

      //   response = await api.createStock(payload);
      // }
      const response = await api.createStock(payload);

      console.log("Create stock response:", response);

      toast({
        variant: "success",
        title: t("success.title"),
        description: t("success.description"),
      });

      form.reset();
      onOpenChange(false);
      if (onSuccess) {
        onSuccess(response);
      }
    } catch (error) {
      console.error("Form submission error", error);
      toast({
        variant: "destructive",
        title: t("error.title"),
        description:
          typeof error === "object" && error !== null && "message" in error
            ? String((error as { message?: string }).message)
            : t("error.description"),
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

  const isLoading = institutionsLoading || issuersLoading;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto space-y- p-8">
        <DialogHeader>
          <DialogTitle className="text-primary text-2xl text-center">
            {t(isEdit ? "editTitre" : "ajouterUnTitre")}
          </DialogTitle>
        </DialogHeader>
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <Form {...form}>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                form.handleSubmit(onSubmit)(e);
              }}
              className="space-y-6"
            >
              {/* Basic Information Section */}
              <div className="space-y-6">
                <h3 className="text-lg font-semibold border-b pb-2">
                  {t("form.basicInformation")}
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
                                  ? issuers.find(
                                      (issuer) => issuer.id === field.value
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
                                  {issuers.map((issuer) => (
                                    <CommandItem
                                      value={issuer.name}
                                      key={issuer.id}
                                      onSelect={() => {
                                        form.setValue("issuer", issuer.id);
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          issuer.id === field.value
                                            ? "opacity-100"
                                            : "opacity-0"
                                        )}
                                      />
                                      {issuer.name}
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
                            <SelectItem value="deactivated">
                              {t("form.inactive")}
                            </SelectItem>
                            <SelectItem value="delisted">
                              {t("form.delisted")}
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
                        <FormLabel>{t("form.operation")}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select operation type" />
                            </SelectTrigger>
                          </FormControl>
                          {watchedType === "action" ? (
                            <SelectContent>
                              <SelectItem value="augmentation">
                                {t("form.augmentation")}
                              </SelectItem>
                              <SelectItem value="ouverture">
                                {t("form.ouverture")}
                              </SelectItem>
                            </SelectContent>
                          ) : (
                            <SelectContent>
                              <SelectItem value="empruntObligatairePublic">
                                {t("form.empruntObligatairePublic")}
                              </SelectItem>
                              <SelectItem value="empruntObligataireInstitutionnel">
                                {t("form.empruntObligataireInstitutionnel")}
                              </SelectItem>
                              <SelectItem value="placementOrganise">
                                {t("form.placementOrganise")}
                              </SelectItem>
                            </SelectContent>
                          )}
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                {/* Financial Details Section */}
                <div className="space-y-6">
                  <h3 className="text-lg font-semibold border-b pb-2">
                    {t("form.financialDetails")}
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
                              step="1"
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
                              // min="1"
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
                              <SelectItem value="PME">
                                {t("form.pme")}
                              </SelectItem>
                              <SelectItem value="PRINCIPAL">
                                {t("form.principal")}
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
                              min=""
                              // step="0.01"
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
                                // step="0.01"
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
                        {t("form.institutionsSection")}
                      </h3>
                      <FormField
                        control={form.control}
                        name="institutions"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("form.institutions")}</FormLabel>
                            <MultiSelect
                              options={financialInstitutions.map((inst) => ({
                                value: inst.id,
                                label: inst.institutionName,
                              }))}
                              selected={field.value || []}
                              onChange={field.onChange}
                              placeholder={t("form.selectInstitution")}
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
                {(watchedType === "obligation" ||
                  obligations.includes(watchedType)) && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold border-b pb-2">
                      {t("form.bondSpecificDetails")}
                    </h3>

                    {/* Obligation Type  */}
                    <FormField
                      control={form.control}
                      name="stockType"
                      render={({ field }) => (
                        <FormItem className="space-y-3">
                          <FormLabel className="text-base font-medium">
                            {t("form.obligationType")}
                          </FormLabel>
                          <FormControl>
                            <div className="flex items-center space-x-6">
                              <div className="flex items-center space-x-2">
                                <Input
                                  type="radio"
                                  id="obligationsOrdinaires"
                                  value="obligationsOrdinaires"
                                  checked={
                                    field.value === "obligationsOrdinaires"
                                  }
                                  onChange={() =>
                                    field.onChange("obligationsOrdinaires")
                                  }
                                  className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                                />
                                <Label
                                  htmlFor="obligationsOrdinaires"
                                  className="text-sm font-medium text-gray-700 cursor-pointer"
                                >
                                  {t("form.obligationsOrdinaires")}
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Input
                                  type="radio"
                                  id="sukuk"
                                  value="sukuk"
                                  checked={field.value === "sukuk"}
                                  onChange={() => field.onChange("sukuk")}
                                  className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                                />
                                <Label
                                  htmlFor="sukuk"
                                  className="text-sm font-medium text-gray-700 cursor-pointer"
                                >
                                  {t("form.sukuk")}
                                </Label>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Input
                                  type="radio"
                                  id="oat"
                                  value="oat"
                                  checked={field.value === "oat"}
                                  onChange={() => field.onChange("oat")}
                                  className="w-4 h-4 text-primary border-gray-300 focus:ring-primary"
                                />
                                <Label
                                  htmlFor="oat"
                                  className="text-sm font-medium text-gray-700 cursor-pointer"
                                >
                                  {t("form.vt")}
                                </Label>
                              </div>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

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
                            <FormLabel>{t("form.duration")}</FormLabel>
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
                    </div>
                  </div>
                )}
                {(watchedType === "obligation" ||
                  obligations.includes(watchedType)) &&
                  durationYears &&
                  durationYears > 0 && (
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold border-b pb-2">
                        {t("form.payementSchedule")}
                      </h3>
                      <FormField
                        control={form.control}
                        name="durationYears"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("form.nombreDeTranches")}</FormLabel>
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
                      <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t("form.date")}
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t("form.couponRate")}
                              </th>
                              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                {t("form.capitalRate")}
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
                                      name={`capitalRepaymentSchedule.${index}.date`}
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
                                                onSelect={(date) => {
                                                  field.onChange(date);
                                                  if (date) {
                                                    form.setValue(
                                                      `couponSchedule.${index}.date`,
                                                      date
                                                    );
                                                  }
                                                }}
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
                                      name={`couponSchedule.${index}.rate`}
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
                                      name={`capitalRepaymentSchedule.${index}.rate`}
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
