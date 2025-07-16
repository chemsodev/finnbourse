"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
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
import { IobFormValues, iobFormSchema } from "./schema";
import { useFinancialInstitutions } from "@/hooks/useFinancialInstitutions";
import { useEffect } from "react";

interface IobFormProps {
  defaultValues: IobFormValues;
  onFormChange: (values: IobFormValues) => void;
}

export function IobForm({ defaultValues, onFormChange }: IobFormProps) {
  const t = useTranslations("IOBPage");
  const { institutions, isLoading: loadingFIs } = useFinancialInstitutions();

  const form = useForm<IobFormValues>({
    resolver: zodResolver(iobFormSchema),
    defaultValues,
    mode: "onChange",
  });

  // Update form with defaultValues when they change (especially in edit mode)
  useEffect(() => {
    if (defaultValues) {
      console.log("IOB Form - Updating with default values:", defaultValues);
      // Reset the form with new default values to ensure proper rendering
      form.reset(defaultValues);
    }
  }, [defaultValues, form]);

  // Update parent form when this form changes
  const handleFormChange = () => {
    const values = form.getValues();
    onFormChange(values);
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-3xl mx-auto">
      <p className="text-center text-muted-foreground mb-6">
        Veuillez remplir les informations de l'IOB. Tous les champs marqués
        d'une * sont obligatoires.
      </p>
      <Form {...form}>
        <form
          onChange={handleFormChange}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <FormField
            control={form.control}
            name="financialInstitutionId"
            render={({ field }) => (
              <FormItem className="md:col-span-2">
                <FormLabel className="font-semibold text-lg">
                  Institution Financière *
                </FormLabel>
                <Select
                  onValueChange={(value) => {
                    field.onChange(value);
                    handleFormChange();
                  }}
                  value={field.value}
                  defaultValue={field.value}
                  disabled={loadingFIs}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner une institution financière" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {institutions.map((fi) => (
                      <SelectItem key={fi.id} value={fi.id}>
                        {fi.institutionName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="codeIob"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-lg">
                  {t("codeIOB")} *
                </FormLabel>
                <FormControl>
                  <Input id="codeIob" className="w-full" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Fields for libelleCourt, libelleLong, and correspondant removed */}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-lg">
                  {t("email")}
                </FormLabel>
                <FormControl>
                  <Input
                    id="email"
                    type="email"
                    className="w-full"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fax"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-lg">
                  {t("fax")}
                </FormLabel>
                <FormControl>
                  <Input id="fax" className="w-full" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="telephone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-lg">
                  {t("phone")}
                </FormLabel>
                <FormControl>
                  <Input id="telephone" className="w-full" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="addresse"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="font-semibold text-lg">
                  {t("address")} *
                </FormLabel>
                <FormControl>
                  <Input id="addresse" className="w-full" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          {/* Order field removed */}
        </form>
      </Form>
    </div>
  );
}
