"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useTranslations } from "next-intl";
import { AgenceFormValues, agenceFormSchema } from "./schema";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useFinancialInstitutions } from "@/hooks/useFinancialInstitutions";
import { useToast } from "@/hooks/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface AgenceFormProps {
  defaultValues: AgenceFormValues;
  onFormChange: (values: AgenceFormValues) => void;
  isEditMode?: boolean;
}

export function AgenceForm({
  defaultValues,
  onFormChange,
  isEditMode = false,
}: AgenceFormProps) {
  const t = useTranslations("AgencyPage");
  const { toast } = useToast();
  const { institutions, isLoading: loadingFIs } = useFinancialInstitutions();

  // The useFinancialInstitutions hook already handles fetching internally
  // No need to call fetchInstitutions manually

  // Initialize form with React Hook Form and Zod validation
  const form = useForm<AgenceFormValues>({
    resolver: zodResolver(agenceFormSchema),
    defaultValues,
    mode: "onBlur",
  });

  // When form values change, propagate changes to parent component
  const onSubmit = (data: AgenceFormValues) => {
    onFormChange(data);
  };

  // Reset form when defaultValues change (important for edit mode)
  useEffect(() => {
    console.log("Agence form default values changed:", defaultValues);
    console.log(
      "Financial Institution ID in defaultValues:",
      defaultValues?.financialInstitutionId
    );

    if (defaultValues) {
      // Reset the form with the new default values
      console.log("Resetting Agence form with values:", defaultValues);
      form.reset(defaultValues);

      // Verify form values after reset
      setTimeout(() => {
        console.log("Current form values after reset:", form.getValues());
        console.log(
          "Current FI value:",
          form.getValues().financialInstitutionId
        );
      }, 100);
    }
  }, [defaultValues, form]);

  // Watch for changes and propagate to parent component
  useEffect(() => {
    const subscription = form.watch((value) => {
      if (Object.keys(value).length > 0) {
        onFormChange(form.getValues());
      }
    });

    return () => subscription.unsubscribe();
  }, [form, onFormChange]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>{isEditMode ? t("editAgency") : t("newAgency")}</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("codeAgence")} *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="financialInstitutionId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("financialInstitution")} *</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                      disabled={loadingFIs}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              loadingFIs
                                ? t("loadingFinancialInstitutions")
                                : t("selectFinancialInstitution")
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {institutions.length === 0 && !loadingFIs && (
                          <SelectItem value="" disabled>
                            {t("noFinancialInstitutionsFound")}
                          </SelectItem>
                        )}
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
                name="director_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("directeurNom")} *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="director_email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("directeurEmail")} *</FormLabel>
                    <FormControl>
                      <Input {...field} type="email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="director_phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("directeurTelephone")} *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="code_swift"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("codeSwiftBic")} *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="currency"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("devise")}</FormLabel>
                    <FormControl>
                      <Input {...field} defaultValue="DZD" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>{t("address")} *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
