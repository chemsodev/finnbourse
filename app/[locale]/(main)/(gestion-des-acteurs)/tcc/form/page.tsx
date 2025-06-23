"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { MultiStepForm } from "./multi-step-form";
import { CustodianForm } from "./custodian-form";
import { RelatedUsersForm } from "./related-users-form";
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

        setFormValues((prev) => ({
          ...prev,
          custodian: {
            ...prev.custodian,
            ...transformedData,
          },
          tccId: currentTCC.id,
        }));

        toast({
          title: "Data Loaded",
          description: "Existing TCC data loaded for editing",
        });
      } else {
        console.log("🔍 No existing TCC found, form will be for creation");
      }
    } catch (error) {
      console.error("Failed to load TCC data:", error);
      // Don't show error toast for this as it's not critical
    } finally {
      setIsLoadingData(false);
    }
  };

  const [formValues, setFormValues] = useState<CombinedFormValues>({
    custodian: {
      code: "",
      libelle: "",
      typeCompte: "DEPOSIT",
      statut: "ACTIVE",
      adresse: "",
      codePostal: "",
      ville: "",
      pays: "Algeria",
      telephone: "",
      email: "",
      dateCreation: new Date().toISOString().split("T")[0],
      swift: "",
      iban: "",
      numeroCompte: "",
      devise: "DZD",
      numeroAgrement: "",
      dateAgrement: "",
      autoriteSurveillance: "",
      codeCorrespondant: "",
      nomCorrespondant: "",
      commissionFixe: "",
      commissionVariable: "",
      tauxTva: "",
      commentaire: "",
      financialInstitutionId: "", // Will be selected by user
    },
    relatedUsers: [],
    tccId: undefined, // Will be set after TCC creation
  });

  const isEditMode = !!params.id && params.id !== "new";

  // Load existing TCC data if in edit mode
  useEffect(() => {
    if (isEditMode && params.id) {
      loadExistingTCC();
    }
  }, [isEditMode, params.id]);
  const loadExistingTCC = async () => {
    try {
      const currentTCC = await fetchTCC();

      if (currentTCC) {
        console.log("🔍 Loading TCC data into form:", currentTCC);
        const formData = TCCService.transformAPIDataToForm(currentTCC);
        setFormValues((prev) => ({
          ...prev,
          custodian: {
            ...prev.custodian,
            ...formData,
          },
        }));
      } else {
        console.log("🔍 No existing TCC found, form will be for creation");
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load TCC data",
        variant: "destructive",
      });
      console.error("Failed to load TCC data:", error);
    }
  };

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
            title: "Validation Error",
            description: "Please fill in all required fields correctly",
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

        toast({
          title: isEditMode ? "TCC Updated" : "TCC Created",
          description: isEditMode
            ? "TCC updated successfully. You can now manage users."
            : "TCC created successfully. You can now add users.",
        });

        // Move to next step
        setCurrentStep((prev) => prev + 1);
      } catch (error) {
        console.error("Error creating TCC:", error);
        toast({
          title: "Error",
          description: "Failed to create TCC. Please check the form data.",
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
      // At this point, TCC should already be created (in step 1)
      // We only need to create users if there are any
      if (formValues.relatedUsers.length > 0 && formValues.tccId) {
        console.log("Creating users for TCC ID:", formValues.tccId);

        // Create users one by one
        for (const userData of formValues.relatedUsers) {
          const apiUserData = TCCService.transformUserFormDataToAPI(userData);
          await TCCService.createUser(apiUserData, formValues.tccId);
        }

        toast({
          title: "Users Created",
          description: `Successfully created ${formValues.relatedUsers.length} users for the TCC`,
        });
      }

      toast({
        title: isEditMode ? "TCC Updated" : "TCC Process Complete",
        description: isEditMode
          ? "TCC updated successfully"
          : "TCC and users created successfully",
      });

      // Navigate back to the list page
      router.push("/tcc");
    } catch (error) {
      console.error("User creation error:", error);
      toast({
        title: "Error",
        description: "Failed to create users. TCC was created successfully.",
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
    <RelatedUsersForm
      key="related-users-form"
      defaultValues={{ users: formValues.relatedUsers }}
      onFormChange={handleUpdateRelatedUsers}
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
