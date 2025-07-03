"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { AgencyData } from "@/lib/exportables";
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
import { Card, CardContent } from "@/components/ui/card";
import RelatedUsersTable from "./RelatedUsersTable";
import { type RelatedUser } from "./types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { actorAPI } from "@/app/actions/actorAPI";
import { useFinancialInstitutions } from "@/hooks/useFinancialInstitutions";
import { extractErrorMessage } from "@/lib/utils/errorHandling";
import { useRestToken } from "@/hooks/useRestToken";

interface AgenceFormStepsProps {
  mode: "add" | "edit";
  initialData: AgencyData | null;
  onComplete: () => void;
}

export default function AgenceFormSteps({
  mode,
  initialData,
  onComplete,
}: AgenceFormStepsProps) {
  const t = useTranslations("AgencyPage");
  const { toast } = useToast();
  const {
    institutions,
    isLoading: loadingFIs,
    fetchInstitutions,
  } = useFinancialInstitutions();
  const { restToken } = useRestToken();

  // Debug logging
  useEffect(() => {
    console.log("🏦 AgenceFormSteps - institutions:", institutions);
    console.log("🏦 AgenceFormSteps - loadingFIs:", loadingFIs);
    console.log(
      "🏦 AgenceFormSteps - institutions.length:",
      institutions.length
    );
    console.log(
      "🏦 AgenceFormSteps - restToken:",
      restToken ? "Available" : "Not available"
    );
  }, [institutions, loadingFIs, restToken]);

  // Test function to manually fetch financial institutions
  const testFetchFIs = async () => {
    console.log("🏦 Manual test - Starting financial institutions fetch...");
    try {
      const result = await actorAPI.financialInstitution.getAll(
        restToken || undefined
      );
      console.log("🏦 Manual test - Success:", result);
      toast({
        title: "Test Success",
        description: `Fetched ${
          result?.data?.length || 0
        } financial institutions`,
      });
    } catch (error) {
      console.error("🏦 Manual test - Error:", error);
      toast({
        title: "Test Failed",
        description: extractErrorMessage(error),
        variant: "destructive",
      });
    }
  };

  // Manual refresh handler
  const handleRefreshFIs = () => {
    console.log(
      "🏦 Manual refresh - Triggering financial institutions refetch..."
    );
    fetchInstitutions();
  };

  const [currentStep, setCurrentStep] = useState(1);
  const [submissionStep, setSubmissionStep] = useState<
    "idle" | "submitting" | "success" | "error"
  >("idle");
  const [relatedUsers, setRelatedUsers] = useState<RelatedUser[]>([]);

  const schema = z.object({
    nomBanque: z.string().min(1, t("validation.agencyNameRequired")),
    agenceCode: z.string().min(1, t("validation.agencyCodeRequired")),
    financialInstitutionId: z
      .string()
      .min(1, t("validation.financialInstitutionRequired")),
    codeSwiftBic: z.string().min(1, t("validation.swiftCodeRequired")),
    adresseComplete: z.string().min(1, t("validation.addressRequired")),
    devise: z.string().min(1, t("validation.currencyRequired")),
    directeurNom: z.string().min(1, t("validation.directorNameRequired")),
    directeurTelephone: z.string().min(1, t("validation.phoneNumberRequired")),
    directeurEmail: z.string().email(t("validation.emailInvalid")),
  });

  const form = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
    defaultValues: {
      nomBanque: initialData?.nomBanque || "",
      agenceCode: initialData?.agenceCode || "",
      financialInstitutionId: "",
      codeSwiftBic: initialData?.codeSwiftBic || "",
      adresseComplete: initialData?.adresseComplete || "",
      devise: initialData?.devise || "",
      directeurNom: initialData?.directeurNom || "",
      directeurTelephone: initialData?.directeurTelephone || "",
      directeurEmail: initialData?.directeurEmail || "",
    },
  });

  const handleNextStep = async () => {
    if (currentStep === 1) {
      const isValid = await form.trigger([
        "nomBanque",
        "agenceCode",
        "financialInstitutionId",
        "codeSwiftBic",
      ]);
      if (isValid) {
        setCurrentStep(2);
      }
    } else if (currentStep === 2) {
      const isValid = await form.trigger([
        "adresseComplete",
        "devise",
        "directeurNom",
        "directeurTelephone",
        "directeurEmail",
      ]);
      if (isValid) {
        setCurrentStep(3);
      }
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const onSubmit = async (data: z.infer<typeof schema>) => {
    setSubmissionStep("submitting");
    try {
      const agencyData = {
        ...data,
        relatedUsers,
      };

      console.log("🏦 Submitting agency data:", agencyData);
      console.log("🏦 Mode:", mode);
      console.log("🏦 Initial data ID:", initialData?.id);

      let result;
      if (mode === "add") {
        result = await actorAPI.agence.create(
          agencyData,
          restToken || undefined
        );
      } else {
        result = await actorAPI.agence.update(
          String(initialData?.id || ""),
          agencyData,
          restToken || undefined
        );
      }

      console.log("🏦 Submission result:", result);

      if (result.success) {
        setSubmissionStep("success");
        toast({
          title: t("success"),
          description: mode === "add" ? t("agencyCreated") : t("agencyUpdated"),
        });
        setTimeout(() => {
          onComplete();
        }, 1500);
      } else {
        throw new Error(result.message || "Operation failed");
      }
    } catch (error) {
      console.error("Error submitting agency:", error);
      setSubmissionStep("error");
      toast({
        title: t("error"),
        description: extractErrorMessage(error),
        variant: "destructive",
      });
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={cn(
              "w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium",
              step === currentStep
                ? "bg-blue-600 text-white"
                : step < currentStep
                ? "bg-green-600 text-white"
                : "bg-gray-200 text-gray-600"
            )}
          >
            {step < currentStep ? "✓" : step}
          </div>
          {step < 3 && (
            <div
              className={cn(
                "w-16 h-1 mx-2",
                step < currentStep ? "bg-green-600" : "bg-gray-200"
              )}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold">{t("basicInformation")}</h3>
        <p className="text-gray-600">{t("enterBasicDetails")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="nomBanque"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("agencyName")}</FormLabel>
              <FormControl>
                <Input placeholder={t("enterAgencyName")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="agenceCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("agencyCode")}</FormLabel>
              <FormControl>
                <Input placeholder={t("enterAgencyCode")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="financialInstitutionId"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>{t("financialInstitution")}</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value}
                disabled={loadingFIs}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue
                      placeholder={t("selectFinancialInstitution")}
                    />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {loadingFIs && (
                    <SelectItem value="loading" disabled>
                      Loading financial institutions...
                    </SelectItem>
                  )}
                  {!loadingFIs && institutions.length === 0 && (
                    <SelectItem value="no-data" disabled>
                      No financial institutions found
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
              {/* Debug buttons - remove after testing */}
              <div className="flex gap-2 mt-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={testFetchFIs}
                >
                  🔧 Test Fetch FIs
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleRefreshFIs}
                >
                  🔄 Refresh FIs
                </Button>
              </div>
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="codeSwiftBic"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>{t("swiftCode")}</FormLabel>
              <FormControl>
                <Input placeholder={t("enterSwiftCode")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold">{t("contactInformation")}</h3>
        <p className="text-gray-600">{t("enterContactDetails")}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField
          control={form.control}
          name="adresseComplete"
          render={({ field }) => (
            <FormItem className="md:col-span-2">
              <FormLabel>{t("address")}</FormLabel>
              <FormControl>
                <Input placeholder={t("enterAddress")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="devise"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("currency")}</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectCurrency")} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="USD">USD</SelectItem>
                  <SelectItem value="EUR">EUR</SelectItem>
                  <SelectItem value="GBP">GBP</SelectItem>
                  <SelectItem value="XOF">XOF</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="directeurNom"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("directorName")}</FormLabel>
              <FormControl>
                <Input placeholder={t("enterDirectorName")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="directeurTelephone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("phoneNumber")}</FormLabel>
              <FormControl>
                <Input placeholder={t("enterPhoneNumber")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="directeurEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("email")}</FormLabel>
              <FormControl>
                <Input placeholder={t("enterEmail")} type="email" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold">{t("relatedUsers")}</h3>
        <p className="text-gray-600">{t("manageRelatedUsers")}</p>
      </div>

      <Card>
        <CardContent className="p-6">
          <RelatedUsersTable
            users={relatedUsers}
            onUsersChange={setRelatedUsers}
          />
        </CardContent>
      </Card>
    </div>
  );

  if (submissionStep === "success") {
    return (
      <div className="text-center py-12">
        <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
          <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">✓</span>
          </div>
        </div>
        <h3 className="text-lg font-semibold text-green-800 mb-2">
          {t("success")}
        </h3>
        <p className="text-green-600">
          {mode === "add" ? t("agencyCreated") : t("agencyUpdated")}
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {renderStepIndicator()}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}

          <div className="flex justify-between pt-6">
            <Button
              type="button"
              variant="outline"
              onClick={handlePreviousStep}
              disabled={currentStep === 1}
            >
              {t("previous")}
            </Button>

            <div className="flex gap-2">
              {currentStep < 3 ? (
                <Button type="button" onClick={handleNextStep}>
                  {t("next")}
                </Button>
              ) : (
                <Button
                  type="submit"
                  disabled={submissionStep === "submitting"}
                >
                  {submissionStep === "submitting"
                    ? t("submitting")
                    : mode === "add"
                    ? t("createAgency")
                    : t("updateAgency")}
                </Button>
              )}
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
}
