"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { MultiStepForm } from "./multi-step-form";
import { AgenceForm } from "./agence-form";
import { EnhancedAgenceUsersForm } from "./enhanced-users-form";
import {
  AgenceFormValues,
  RelatedUserFormValues,
  CombinedFormValues,
  agenceFormSchema,
} from "./schema";
import { useToast } from "@/hooks/use-toast";
import { useAgence } from "@/hooks/useAgence";
import { AgenceService } from "@/lib/services/agenceService";
import { useRestToken } from "@/hooks/useRestToken";

interface FormPageProps {
  params: {
    id?: string;
  };
}

export default function FormPage({ params }: FormPageProps) {
  const router = useRouter();
  const t = useTranslations("AgencyPage");
  const { toast } = useToast();
  const { restToken } = useRestToken();
  const [currentStep, setCurrentStep] = useState(0);
  const [isCreatingAgence, setIsCreatingAgence] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { createOrUpdateAgence, getAgence } = useAgence();
  const [isLoadingData, setIsLoadingData] = useState(false);

  const [formValues, setFormValues] = useState<CombinedFormValues>({
    agence: {
      code: "",
      address: "",
      code_swift: "",
      agence_name: "",
      agence_email: "",
      agence_phone: "",
      financialInstitutionId: "",
    },
    relatedUsers: [],
    agenceId: undefined,
  });

  const isEditMode = !!params.id && params.id !== "new";

  // Load existing agence data on mount for editing
  useEffect(() => {
    loadExistingAgenceData();
  }, [params.id, isEditMode]); // Removed restToken dependency since we're not making separate API calls

  const loadExistingAgenceData = async () => {
    if (isLoadingData || !isEditMode || !params.id) return;

    try {
      setIsLoadingData(true);
      console.log("🔍 Starting to load agency data for ID:", params.id);

      const currentAgence = await getAgence(params.id);

      if (currentAgence) {
        console.log(
          "🔍 Loading existing Agence data into form:",
          currentAgence
        );

        // Transform Agence data to form format
        const transformedData =
          AgenceService.transformAPIDataToForm(currentAgence);

        // Ensure financial institution ID is properly set with more thorough checking
        if (currentAgence.financialInstitution?.id) {
          transformedData.financialInstitutionId =
            currentAgence.financialInstitution.id;
          console.log(
            "✅ Financial institution ID set from financialInstitution.id:",
            transformedData.financialInstitutionId
          );
        } else if (currentAgence.financialInstitutionId) {
          transformedData.financialInstitutionId =
            currentAgence.financialInstitutionId;
          console.log(
            "✅ Financial institution ID set from financialInstitutionId:",
            transformedData.financialInstitutionId
          );
        } else {
          console.warn("⚠️ No financial institution ID found in agency data");
          // Try to extract from the API data structure if available
          const agencyAsAny = currentAgence as any;
          if (agencyAsAny.financialInstitution?.id) {
            transformedData.financialInstitutionId =
              agencyAsAny.financialInstitution.id;
            console.log(
              "✅ Financial institution ID found via fallback:",
              transformedData.financialInstitutionId
            );
          }
        }

        // Load existing users for this agency from the agency data itself
        let existingUsers: RelatedUserFormValues[] = [];

        // Check if the agency data already contains users (which it should)
        const agencyWithUsers = currentAgence as any;
        if (agencyWithUsers.users && Array.isArray(agencyWithUsers.users)) {
          console.log(
            "🔍 Loading users from agency data:",
            agencyWithUsers.users
          );

          try {
            existingUsers = agencyWithUsers.users.map(
              (user: any, index: number) => {
                console.log(`🔍 Transforming user ${index}:`, user);

                const transformedUser = {
                  fullName: `${user.firstname || ""} ${
                    user.lastname || ""
                  }`.trim(),
                  email: user.email || "",
                  password: "", // Don't load existing passwords
                  phone: user.telephone || "",
                  position: user.positionAgence || user.position || "",
                  matricule: user.matriculeAgence || user.matricule || "",
                  organization:
                    user.organisationIndividu || user.organisation || "",
                  status: (user.status === "actif" ? "active" : "inactive") as
                    | "active"
                    | "inactive",
                  roles: Array.isArray(user.role)
                    ? user.role
                    : user.role
                    ? [user.role]
                    : [],
                };

                console.log(`✅ Transformed user ${index}:`, transformedUser);
                return transformedUser;
              }
            );

            console.log("✅ All transformed users for form:", existingUsers);
          } catch (transformError) {
            console.error("❌ Error transforming users:", transformError);
            existingUsers = [];
          }
        } else {
          console.log("🔍 No users found in agency data");
        }

        console.log("Transformed Agence data for form:", transformedData);
        console.log(
          "Financial Institution ID for form:",
          transformedData.financialInstitutionId
        );
        console.log("Raw agency financial institution data:", {
          "currentAgence.financialInstitution":
            currentAgence.financialInstitution,
          "currentAgence.financialInstitutionId":
            currentAgence.financialInstitutionId,
        });

        // Force a re-render with the new data by creating a new object
        const newFormValues = {
          agence: transformedData,
          relatedUsers: existingUsers, // Load existing users
          agenceId: currentAgence.id,
        };

        console.log("🔄 Setting new form values:", newFormValues);
        console.log("🔄 Agency form data being set:", newFormValues.agence);
        setFormValues(newFormValues);

        // Data loaded successfully - no toast needed to avoid UI noise
        console.log(
          `✅ Agency data loaded successfully${
            existingUsers.length > 0
              ? ` with ${existingUsers.length} user(s)`
              : ""
          }`
        );
      } else {
        console.log("🔍 No existing Agence found, form will be for creation");
      }
    } catch (error) {
      console.error("❌ Failed to load Agence data:", error);
      toast({
        title: "Error",
        description: "Failed to load agency data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoadingData(false);
    }
  };

  const handleUpdateAgence = (agenceValues: AgenceFormValues) => {
    setFormValues((prev) => ({
      ...prev,
      agence: agenceValues,
    }));
  };

  const handleUpdateRelatedUsers = (relatedUsers: RelatedUserFormValues[]) => {
    setFormValues((prev) => ({
      ...prev,
      relatedUsers,
    }));
  };

  const handleNextStep = async () => {
    // If moving from step 0 (Agence info) to step 1 (users), create the Agence first
    if (currentStep === 0) {
      try {
        setIsCreatingAgence(true);

        // Validate agence form data
        const validationResult = agenceFormSchema.safeParse(formValues.agence);
        if (!validationResult.success) {
          toast({
            title: "Validation Error",
            description: "Please fill in all required fields correctly",
            variant: "destructive",
          });
          return;
        }

        console.log("Creating Agence with data:", formValues.agence);

        // Transform form data to API format and create/update Agence
        const apiData = AgenceService.transformFormDataToAPI(formValues.agence);
        const resultAgence = await createOrUpdateAgence(
          apiData,
          isEditMode ? params.id : undefined
        );

        // Store the Agence ID for user creation
        setFormValues((prev) => ({
          ...prev,
          agenceId: resultAgence.id || params.id, // Store Agence ID for user creation
        }));

        toast({
          title: isEditMode ? "Agence Updated" : "Agence Created",
          description: isEditMode
            ? "Agence updated successfully. You can now manage users."
            : "Agence created successfully. You can now add users.",
        });

        // Move to next step
        setCurrentStep((prev) => prev + 1);
      } catch (error) {
        console.error("Error creating Agence:", error);
        toast({
          title: "Error",
          description: "Failed to create Agence. Please check the form data.",
          variant: "destructive",
        });
        return; // Don't proceed to next step if creation failed
      } finally {
        setIsCreatingAgence(false);
      }
    } else {
      // For other steps, just move forward
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);

      const agenceId = formValues.agenceId;

      if (!agenceId) {
        throw new Error("No Agence ID available");
      }

      // Users are already created individually when added to the form
      // So we just need to show completion message and navigate

      console.log("Agency creation workflow complete");
      console.log(`Agency ID: ${agenceId}`);
      console.log(`Users created: ${formValues.relatedUsers.length}`);

      toast({
        title: t("success"),
        description: isEditMode
          ? `${t("agencyUpdatedSuccessfully")} ${
              formValues.relatedUsers.length > 0 ? t("withUsers") : ""
            }`
          : `${t("agencyCreatedSuccessfully")} ${
              formValues.relatedUsers.length > 0 ? t("withUsers") : ""
            }`,
      });

      // Navigate back to the list page
      console.log("Redirecting to Agence list...");
      router.push("/agence");
    } catch (error) {
      console.error("Error in submit handler:", error);
      toast({
        title: t("error"),
        description:
          error instanceof Error ? error.message : t("somethingWentWrong"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderSteps = () => {
    return [
      {
        title: t("addNewAgency"),
        content: (
          <AgenceForm
            defaultValues={formValues.agence}
            onFormChange={handleUpdateAgence}
            isEditMode={isEditMode}
          />
        ),
      },
      {
        title: t("users"),
        content: (
          <div className="p-6 bg-white rounded-lg border">
            <h3 className="text-lg font-medium mb-4">{t("relatedUsers")}</h3>
            <p className="text-muted-foreground mb-4">
              {t("addUsersInstruction")}
            </p>
            {/* Debug info - remove in production */}
            {process.env.NODE_ENV === "development" && (
              <div className="mb-4 p-2 bg-gray-100 rounded text-xs">
                <strong>Debug:</strong> Current users count:{" "}
                {formValues.relatedUsers.length}
                {formValues.relatedUsers.length > 0 && (
                  <details className="mt-1">
                    <summary>Show users</summary>
                    <pre className="mt-1 text-xs overflow-auto max-h-40">
                      {JSON.stringify(formValues.relatedUsers, null, 2)}
                    </pre>
                  </details>
                )}
              </div>
            )}
            <EnhancedAgenceUsersForm
              key={`users-${formValues.relatedUsers.length}-${Date.now()}`} // Force re-render
              users={formValues.relatedUsers}
              onUsersChange={handleUpdateRelatedUsers}
              agenceId={formValues.agenceId}
            />
          </div>
        ),
      },
    ];
  };

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.push("/agence")}
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">{t("back")}</span>
        </Button>
        <h1 className="text-3xl font-bold text-gray-800">
          {isEditMode ? t("editAgency") : t("addNewAgency")}
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        {isLoadingData && isEditMode && (
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center space-x-2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
              <span className="text-blue-700">Loading agency data...</span>
            </div>
          </div>
        )}

        <MultiStepForm
          steps={renderSteps()}
          currentStep={currentStep}
          onNextStep={handleNextStep}
          onPrevStep={handlePrevStep}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting || isCreatingAgence}
          isLastStep={currentStep === renderSteps().length - 1}
          isFirstStep={currentStep === 0}
        />
      </div>
    </div>
  );
}
