"use client";

import { useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CustodianFormValues, custodianFormSchema } from "./schema";
import { useFinancialInstitutions } from "@/hooks/useFinancialInstitutions";

interface CustodianFormProps {
  defaultValues: CustodianFormValues;
  onFormChange: (values: CustodianFormValues) => void;
}

export function CustodianForm({
  defaultValues,
  onFormChange,
}: CustodianFormProps) {
  const t = useTranslations("TCCPage");
  const { institutions, isLoading: isLoadingInstitutions } =
    useFinancialInstitutions();

  const form = useForm<CustodianFormValues>({
    resolver: zodResolver(custodianFormSchema),
    defaultValues,
    mode: "onChange",
  });

  // Reset form when defaultValues change (important for edit mode)
  useEffect(() => {
    console.log("TCC form default values changed:", defaultValues);
    console.log(
      "Financial Institution ID in defaultValues:",
      defaultValues?.financialInstitutionId
    );

    if (defaultValues) {
      // Reset the form with the new default values
      console.log("Resetting TCC form with values:", defaultValues);
      form.reset(defaultValues);

      // Explicitly set the financial institution ID to ensure it's selected in the dropdown
      if (defaultValues.financialInstitutionId) {
        form.setValue(
          "financialInstitutionId",
          defaultValues.financialInstitutionId,
          {
            shouldValidate: true,
          }
        );
      }

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

  // Debug financial institutions and form state
  useEffect(() => {
    console.log("🏦 Financial institutions loaded:", institutions.length);
    console.log("🏦 Is loading institutions:", isLoadingInstitutions);
    console.log("🏦 Available institutions:", institutions);

    const currentFiId = form.getValues().financialInstitutionId;
    console.log("🏦 Current form FI ID:", currentFiId);

    // Only run this logic when institutions are done loading
    if (!isLoadingInstitutions && institutions.length > 0) {
      if (currentFiId) {
        const matchingInstitution = institutions.find(
          (inst) => inst.id === currentFiId
        );
        console.log("🏦 Matching institution found:", matchingInstitution);

        // Always force the form to update with the current financial institution ID
        // This ensures the dropdown shows the correct selection
        if (matchingInstitution) {
          console.log("🏦 Forcing form update for financial institution");
          form.setValue("financialInstitutionId", currentFiId, {
            shouldValidate: true,
          });
        } else {
          console.warn("🏦 No matching institution found for ID:", currentFiId);
        }
      } else if (defaultValues?.financialInstitutionId) {
        // If form doesn't have the value but defaultValues does, use that
        console.log(
          "🏦 Using defaultValues financial institution ID:",
          defaultValues.financialInstitutionId
        );
        form.setValue(
          "financialInstitutionId",
          defaultValues.financialInstitutionId,
          {
            shouldValidate: true,
          }
        );
      }
    }
  }, [institutions, isLoadingInstitutions, form, defaultValues]);

  // Update parent form when this form changes
  const handleFormChange = () => {
    const values = form.getValues();
    onFormChange(values);
  };

  return (
    <Form {...form}>
      <form onChange={handleFormChange} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Identification */}
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("code")}</FormLabel>
                  <FormControl>
                    <Input id="code" className="w-full" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <FormField
              control={form.control}
              name="libelle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("label")}</FormLabel>
                  <FormControl>
                    <Input id="libelle" className="w-full" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Financial Institution Selection */}
        <div>
          <h3 className="text-lg font-medium mb-4">
            {t("financialInstitution")}
          </h3>
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="financialInstitutionId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("financialInstitution")} *</FormLabel>
                  <FormControl>
                    <Select
                      value={field.value || ""}
                      onValueChange={(value) => {
                        console.log(
                          "🏦 Financial Institution selected:",
                          value
                        );
                        field.onChange(value);
                      }}
                      disabled={isLoadingInstitutions}
                      defaultValue={defaultValues?.financialInstitutionId}
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue
                          placeholder={
                            isLoadingInstitutions
                              ? t("loadingFinancialInstitutions")
                              : t("selectFinancialInstitution")
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {isLoadingInstitutions ? (
                          <SelectItem value="" disabled>
                            {t("loadingFinancialInstitutions")}
                          </SelectItem>
                        ) : institutions.length === 0 ? (
                          <SelectItem value="" disabled>
                            {t("noFinancialInstitutionsAvailable")}
                          </SelectItem>
                        ) : (
                          institutions.map((institution) => (
                            <SelectItem
                              key={institution.id}
                              value={institution.id}
                            >
                              {institution.institutionName} -{" "}
                              {institution.agreementNumber}
                            </SelectItem>
                          ))
                        )}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        {/* Contact Information */}
        <div>
          <h3 className="text-lg font-medium mb-4">
            {t("contactInformation")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2 md:col-span-3">
              <FormField
                control={form.control}
                name="adresse"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("address")}</FormLabel>
                    <FormControl>
                      <Textarea id="adresse" className="w-full" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="codePostal"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("postalCode")}</FormLabel>
                    <FormControl>
                      <Input id="codePostal" className="w-full" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="ville"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("city")}</FormLabel>
                    <FormControl>
                      <Input id="ville" className="w-full" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="pays"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("country")}</FormLabel>
                    <FormControl>
                      <Input id="pays" className="w-full" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="telephone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("phone")}</FormLabel>
                    <FormControl>
                      <Input id="telephone" className="w-full" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("email")}</FormLabel>
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
            </div>
          </div>
        </div>

        {/* Regulatory Information */}
        <div>
          <h3 className="text-lg font-medium mb-4">
            {t("regulatoryInformation")}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="numeroAgrement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("approvalNumber")}</FormLabel>
                    <FormControl>
                      <Input
                        id="numeroAgrement"
                        className="w-full"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="dateAgrement"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("approvalDate")}</FormLabel>
                    <FormControl>
                      <Input
                        id="dateAgrement"
                        type="date"
                        className="w-full"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="space-y-2">
              <FormField
                control={form.control}
                name="autoriteSurveillance"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("surveillanceAuthority")}</FormLabel>
                    <FormControl>
                      <Input
                        id="autoriteSurveillance"
                        className="w-full"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        </div>
      </form>
    </Form>
  );
}
