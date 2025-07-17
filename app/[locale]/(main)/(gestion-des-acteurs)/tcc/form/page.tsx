"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { MultiStepForm } from "./multi-step-form";
import { CustodianForm } from "./custodian-form";
import { EnhancedTCCUsersForm } from "./enhanced-users-form";
import {
  CustodianFormValues,
  RelatedUserFormValues,
  CombinedFormValues,
  custodianFormSchema,
} from "./schema";
import { useToast } from "@/hooks/use-toast";
import { useTCCForm, useTCC } from "@/hooks/useTCC";
import { TCCService } from "@/lib/services/tccService";

interface FormPageProps {
  params: {
    id?: string;
  };
}

export default function FormPage({ params }: FormPageProps) {
  const router = useRouter();
  const t = useTranslations("TCCPage");
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isCreatingTCC, setIsCreatingTCC] = useState(false);
  const { isSubmitting, submitForm } = useTCCForm();
  const { tcc, fetchTCC, createOrUpdateTCC, hasTCC } = useTCC();
  const [isLoadingData, setIsLoadingData] = useState(false);

  // Load existing TCC data on mount for editing
  useEffect(() => {
    loadExistingTCCData();
  }, []);

  const loadExistingTCCData = async () => {
    if (isLoadingData) return;

    try {
      setIsLoadingData(true);
      const currentTCC = await fetchTCC();

      if (currentTCC) {
        console.log("🔍 Loading existing TCC data into form:", currentTCC);

        // Transform TCC data to form format
        const transformedData = TCCService.transformAPIDataToForm(currentTCC);

        // Ensure financial institution ID is properly set and converted to string
        if (currentTCC.financialInstitutionId) {
          // Cast to string to ensure consistency in form data
          transformedData.financialInstitutionId = String(
            currentTCC.financialInstitutionId
          );
          console.log(
            "🏦 Set Financial Institution ID from direct property:",
            transformedData.financialInstitutionId
          );
        }

        // If there's a financialInstitution object in the response (from your example data)
        if (
          currentTCC.financialInstitution &&
          currentTCC.financialInstitution.id
        ) {
          transformedData.financialInstitutionId = String(
            currentTCC.financialInstitution.id
          );
          console.log(
            "🏦 Set Financial Institution ID from nested object:",
            transformedData.financialInstitutionId
          );
        }

        // Additional debugging to check the transformed data
        console.log("🔄 Transformed TCC data for form:", transformedData);
        console.log(
          "🏦 Final Financial Institution ID in form:",
          transformedData.financialInstitutionId
        );

        // Transform existing users for the form
        const existingUsers = currentTCC.users
          ? currentTCC.users.map((user) =>
              TCCService.transformUserAPIDataToForm(user)
            )
          : [];

        console.log("🔄 Transformed existing users for form:", existingUsers);

        // Force a re-render with the new data by creating a new object
        setFormValues({
          custodian: transformedData,
          relatedUsers: existingUsers, // Load existing users
          tccId: currentTCC.id,
        });

        console.log("✅ TCC data loaded successfully for editing");
      } else {
        console.log("🔍 No existing TCC found, form will be for creation");
      }
    } catch (error) {
      console.error("Failed to load TCC data:", error);
      toast({
        title: t("error"),
        description: t("failedToLoadTCC"),
        variant: "destructive",
      });
    } finally {
      setIsLoadingData(false);
    }
  };

  const [formValues, setFormValues] = useState<CombinedFormValues>({
    custodian: {
      code: "",
      libelle: "",
      adresse: "",
      codePostal: "",
      ville: "",
      pays: "Algeria",
      telephone: "",
      email: "",
      numeroAgrement: "",
      dateAgrement: "",
      autoriteSurveillance: "",
      financialInstitutionId: "", // Will be selected by user
    },
    relatedUsers: [],
    tccId: undefined, // Will be set after TCC creation
  });

  const isEditMode = !!formValues.tccId || hasTCC();

  const handleUpdateCustodian = (custodianValues: CustodianFormValues) => {
    setFormValues((prev) => ({
      ...prev,
      custodian: custodianValues,
    }));
  };

  const handleUpdateRelatedUsers = (relatedUsers: RelatedUserFormValues[]) => {
    setFormValues((prev) => ({
      ...prev,
      relatedUsers,
    }));
  };
  const handleNextStep = async () => {
    // If moving from step 0 (TCC info) to step 1 (users), create the TCC first
    if (currentStep === 0) {
      try {
        setIsCreatingTCC(true);

        // Validate custodian form data
        const validationResult = custodianFormSchema.safeParse(
          formValues.custodian
        );
        if (!validationResult.success) {
          toast({
            title: t("validationError"),
            description: t("fillRequiredFields"),
            variant: "destructive",
          });
          return;
        }
        console.log("Creating TCC with data:", formValues.custodian); // Transform form data to API format and create/update TCC
        const apiData = TCCService.transformFormDataToAPI(formValues.custodian);
        const resultTCC = await createOrUpdateTCC(apiData, isEditMode);

        // Store the TCC ID for user creation
        setFormValues((prev) => ({
          ...prev,
          tccId: resultTCC.id, // Store TCC ID for user creation
        }));

        console.log(
          isEditMode
            ? "✅ TCC updated successfully"
            : "✅ TCC created successfully"
        );

        // Move to next step
        setCurrentStep((prev) => prev + 1);
      } catch (error) {
        console.error("Error creating TCC:", error);
        toast({
          title: t("error"),
          description: t("failedToCreateTCC"),
          variant: "destructive",
        });
        return; // Don't proceed to next step if creation failed
      } finally {
        setIsCreatingTCC(false);
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
      // Step 2: Handle User Creation/Update
      const tccId = formValues.tccId;

      if (!tccId) {
        throw new Error("No TCC ID available for user creation");
      }

      console.log("Step 2: Processing users for TCC ID:", tccId);

      if (formValues.relatedUsers.length > 0) {
        let successCount = 0;
        let errorCount = 0;

        // In edit mode, we don't create new users - they already exist
        // Instead, we just show success message for TCC update
        if (isEditMode) {
          console.log(
            "✅ Edit mode: TCC updated successfully with existing users"
          );
          toast({
            title: t("processComplete"),
            description: t("tccUpdatedSuccessfully"),
          });
        } else {
          // Create mode: Create each user separately
          for (let index = 0; index < formValues.relatedUsers.length; index++) {
            const user = formValues.relatedUsers[index];
            try {
              console.log(
                `Creating user ${index + 1}/${formValues.relatedUsers.length}:`,
                user.fullName
              );

              // Transform form data to API format
              const apiUserData = {
                firstname: user.fullName.split(" ")[0] || user.fullName,
                lastname: user.fullName.split(" ").slice(1).join(" ") || "",
                email:
                  user.email ||
                  `${user.fullName.toLowerCase().replace(/\s+/g, ".")}@tcc.com`,
                password: user.password || "TempPassword123!",
                telephone: user.phone || "",
                positionTcc: user.position,
                role: user.roles || [],
                status: "actif" as "actif", // Default value since status field was removed
              };

              console.log(`User ${index + 1} data:`, apiUserData);

              await TCCService.createUser(apiUserData, tccId);
              successCount++;

              console.log(`User ${index + 1} created successfully`);
            } catch (userError) {
              console.error(`Failed to create user ${index + 1}:`, userError);
              errorCount++;
            }
          }

          // Show summary for create mode
          if (successCount > 0) {
            console.log(
              `✅ ${successCount} user(s) created successfully${
                errorCount > 0 ? `, ${errorCount} failed` : ""
              }`
            );
            toast({
              title: t("processComplete"),
              description: t("tccCreatedSuccessfully"),
            });
          }

          if (errorCount > 0 && successCount === 0) {
            toast({
              title: t("userCreationFailed"),
              description: t("failedToCreateUsers"),
              variant: "destructive",
            });
          }
        }
      } else {
        console.log("No users to process, workflow complete");
        toast({
          title: t("processComplete"),
          description: isEditMode
            ? t("tccUpdatedSuccessfully")
            : t("tccCreatedSuccessfully"),
        });
      }

      // Navigate back to the list page
      console.log("Redirecting to TCC list...");
      router.push("/tcc");
    } catch (error) {
      console.error("Error in submit handler:", error);
      toast({
        title: t("error"),
        description:
          error instanceof Error ? error.message : t("somethingWentWrong"),
        variant: "destructive",
      });
    }
  };

  const steps = [
    <CustodianForm
      key="custodian-form"
      defaultValues={formValues.custodian}
      onFormChange={handleUpdateCustodian}
    />,
    <EnhancedTCCUsersForm
      key="related-users-form"
      users={formValues.relatedUsers}
      onUsersChange={handleUpdateRelatedUsers}
      tccId={formValues.tccId}
    />,
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.push("/tcc")}
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">{t("back")}</span>
        </Button>
        <h1 className="text-3xl font-bold text-gray-800">
          {isEditMode ? t("editAccountHolder") : t("addNewAccountHolder")}
        </h1>
      </div>{" "}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <MultiStepForm
          steps={steps}
          currentStep={currentStep}
          onNextStep={handleNextStep}
          onPrevStep={handlePrevStep}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting || isCreatingTCC}
          isLastStep={currentStep === steps.length - 1}
          isFirstStep={currentStep === 0}
        />
      </div>
    </div>
  );
}
