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
import { Check, ChevronsUpDown, Loader2, Trash2 } from "lucide-react";
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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { useToast } from "@/hooks/use-toast";
import { fr, ar, enUS } from "date-fns/locale";
import { TitreFormValues, TitreSchema } from "./titreSchemaValidation";

interface Company {
  id: string;
  name: string;
}

type CreateTitreProps = {
  type: string;
};

export function CreateTitre({ type }: CreateTitreProps) {
  const { toast } = useToast();
  const locale = useLocale();
  const t = useTranslations("GestionDesTitres.CreateTitre");
  const [open, setOpen] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [companies, setCompanies] = React.useState<Company[]>([]);
  const [fetchingCompanies, setFetchingCompanies] = React.useState(true);

  // Fetch companies on mount
  React.useEffect(() => {
    const fetchCompanies = async () => {
      try {
        // TODO: Replace with actual API call
        // const response = await fetch('/api/companies');
        // const data = await response.json();
        // setCompanies(data);

        // Mock data
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
  }, [toast, t]);

  const form = useForm<TitreFormValues>({
    resolver: zodResolver(TitreSchema),
    defaultValues: {
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

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "institutions",
  });

  async function onSubmit(values: TitreFormValues) {
    try {
      setLoading(true);

      // TODO: Replace with actual API call
      // const response = await fetch('/api/securities', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(values)
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        variant: "success",
        title: t("success.title"),
        description: t("success.description"),
      });

      form.reset();
      setOpen(false);
    } catch (error) {
      console.error("Form submission error", error);
      toast({
        variant: "destructive",
        title: t("error.title"),
        description: t("error.description"),
      });
    } finally {
      setLoading(false);
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
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus size={16} />
          {t("ajouterUnTitre")}
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-primary text-2xl text-center">
            {t("ajouterUnTitre")}
          </DialogTitle>
        </DialogHeader>

        {fetchingCompanies ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                {/* Name */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("form.name")}</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
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
                            <SelectValue placeholder={t("form.selectMarket")} />
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
                            <SelectValue placeholder={t("form.selectStatus")} />
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
                {/* Dates Section */}
                <div className="space-y-4 md:col-span-2">
                  <h3 className="font-medium">{t("form.datesSection")}</h3>
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
                {/* Stock Price Section */}
                <div className="space-y-4 md:col-span-2">
                  <h3 className="font-medium">{t("form.stockPriceSection")}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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

                    {/* Price Date */}
                    <FormField
                      control={form.control}
                      name="stockPrice.date"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>{t("form.priceDate")}</FormLabel>
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

                    {/* Gap */}
                    <FormField
                      control={form.control}
                      name="stockPrice.gap"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("form.gap")}</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
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
                  </div>
                </div>
                {/* Institutions Section */}
                <div className="space-y-4 md:col-span-2">
                  <h3 className="font-medium">
                    {t("form.institutionsSection")}
                  </h3>
                  {fields.map((field, index) => (
                    <div key={field.id} className="flex items-end gap-2">
                      <FormField
                        control={form.control}
                        name={`institutions.${index}.name`}
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel className={cn(index > 0 && "sr-only")}>
                              {t("form.institutionName")}
                            </FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder={t("form.institutionPlaceholder")}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    className="gap-2"
                    onClick={() =>
                      append({ id: crypto.randomUUID(), name: "" })
                    }
                  >
                    <Plus className="h-4 w-4" />
                    {t("form.addInstitution")}
                  </Button>
                </div>
                {/* Optional Fields */}
                <div className="space-y-4 md:col-span-2">
                  <h3 className="font-medium">{t("form.optionalSection")}</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Dividend Rate */}
                    <FormField
                      control={form.control}
                      name="dividendRate"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("form.dividendRate")}</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value === ""
                                    ? undefined
                                    : Number(e.target.value)
                                )
                              }
                              onKeyDown={preventNonNumericInput}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Commission */}
                    <FormField
                      control={form.control}
                      name="commission"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("form.commission")}</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              {...field}
                              onChange={(e) =>
                                field.onChange(
                                  e.target.value === ""
                                    ? undefined
                                    : Number(e.target.value)
                                )
                              }
                              onKeyDown={preventNonNumericInput}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Share Class */}
                    <FormField
                      control={form.control}
                      name="shareClass"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("form.shareClass")}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
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
                  </div>
                </div>
              </div>

              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    {t("form.cancel")}
                  </Button>
                </DialogClose>
                <Button type="submit" disabled={loading}>
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      {t("form.submitting")}
                    </>
                  ) : (
                    t("form.submit")
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
