"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { MultiStepForm } from "./multi-step-form";
import { IobForm } from "./iob-form";
import { EnhancedUsersForm } from "./enhanced-users-form-new";
import {
  IobFormValues,
  RelatedUserFormValues,
  CombinedFormValues,
  iobFormSchema,
} from "./schema";
import { useToast } from "@/hooks/use-toast";

interface FormPageProps {
  params: {
    id?: string;
  };
}

export default function FormPage({ params }: FormPageProps) {
  const router = useRouter();
  const t = useTranslations("IOBPage");
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreatingIOB, setIsCreatingIOB] = useState(false);
  const [createdIobId, setCreatedIobId] = useState<string | null>(null);
  const [iobUsers, setIobUsers] = useState<any[]>([]);
  const isEditMode = Boolean(params.id);

  // Form state
  const [formValues, setFormValues] = useState<CombinedFormValues>({
    iob: {
      financialInstitutionId: "",
      codeIob: "",
      libelleCourt: "",
      libelleLong: "",
      correspondant: "",
      email: "",
      fax: "",
      telephone: "",
      addresse: "",
      ordreDeTu: "",
    },
    relatedUsers: [],
  });

  // Fetch data for edit mode
  useEffect(() => {
    const fetchIOBData = async () => {
      if (isEditMode && params.id) {
        try {
          const { actorAPI } = await import("@/app/actions/actorAPI");

          // Fetch existing IOB data
          const existingIOB = await actorAPI.iob.getOne(params.id);

          console.log("Fetched IOB data:", existingIOB);

          // Store IOB users if available
          if (existingIOB.users && Array.isArray(existingIOB.users)) {
            setIobUsers(existingIOB.users);
          }

          // Transform backend data to frontend format
          const transformedIOB = {
            financialInstitutionId:
              existingIOB.financialInstitution?.id ||
              existingIOB.financialInstitutionId ||
              "",
            codeIob: existingIOB.code || "",
            libelleCourt: existingIOB.short_libel || "",
            libelleLong: existingIOB.long_libel || "",
            correspondant: existingIOB.correspondent || "",
            email: existingIOB.email || "",
            fax: existingIOB.fax || "",
            telephone: existingIOB.phone || "",
            addresse: existingIOB.address || "",
            ordreDeTu: existingIOB.order || "",
          };

          console.log("Transformed IOB data for form:", transformedIOB);
          console.log(
            "Financial Institution ID:",
            transformedIOB.financialInstitutionId
          );

          setFormValues((prev) => ({
            ...prev,
            iob: transformedIOB,
          }));

          // Set the IOB ID for user operations
          setCreatedIobId(params.id);

          toast({
            title: t("success"),
            description: t("dataLoadedSuccessfully"),
          });
        } catch (error) {
          console.error("Failed to fetch IOB data:", error);
          toast({
            title: t("error"),
            description: t("failedToLoadIOBData"),
            variant: "destructive",
          });
        }
      }
    };

    fetchIOBData();
  }, [isEditMode, params.id, toast]);

  // Function to refresh IOB users data
  const refreshIOBUsers = async () => {
    const iobId = createdIobId || params.id;
    if (iobId) {
      try {
        const { actorAPI } = await import("@/app/actions/actorAPI");
        const updatedIOB = await actorAPI.iob.getOne(iobId);
        if (updatedIOB.users && Array.isArray(updatedIOB.users)) {
          setIobUsers(updatedIOB.users);
        }
      } catch (error) {
        console.error("Failed to refresh IOB users:", error);
      }
    }
  };

  const handleUpdateIob = (iobValues: IobFormValues) => {
    setFormValues((prev) => ({
      ...prev,
      iob: iobValues,
    }));
  };

  const handleUpdateRelatedUsers = (relatedUsers: RelatedUserFormValues[]) => {
    setFormValues((prev) => ({
      ...prev,
      relatedUsers,
    }));
  };

  const handleNextStep = async () => {
    if (currentStep === 0) {
      // STEP 1: Handle IOB Creation/Update (moved from handleSubmit)
      setIsCreatingIOB(true);

      try {
        // Import the necessary functions
        const { actorAPI } = await import("@/app/actions/actorAPI");

        // Validate IOB form data
        const iobValidation = iobFormSchema.safeParse(formValues.iob);
        if (!iobValidation.success) {
          console.log("Validation errors:", iobValidation.error.errors);
          toast({
            title: t("validationError"),
            description: t("fillAllRequiredFields"),
            variant: "destructive",
          });
          setIsCreatingIOB(false);
          return;
        }

        console.log("Step 1: Processing IOB data...");

        // Transform frontend form data to backend API format
        const apiData = {
          financialInstitutionId: formValues.iob.financialInstitutionId,
          code: formValues.iob.codeIob,
          short_libel: formValues.iob.libelleCourt,
          long_libel: formValues.iob.libelleLong,
          correspondent: formValues.iob.correspondant,
          email: formValues.iob.email || "",
          fax: formValues.iob.fax || "",
          phone: formValues.iob.telephone || "",
          address: formValues.iob.addresse,
          order: formValues.iob.ordreDeTu || "",
        };

        console.log("Transformed API data:", apiData);

        if (!isEditMode) {
          // Create new IOB
          console.log("Creating new IOB...");
          const createdIOB = await actorAPI.iob.create(apiData);
          const newIobId = createdIOB.id || createdIOB.data?.id;

          if (!newIobId) {
            throw new Error("Failed to get IOB ID from creation response");
          }

          setCreatedIobId(newIobId);
          console.log("IOB created successfully with ID:", newIobId);

          toast({
            title: t("success"),
            description: t("iobCreatedSuccessfully"),
          });
        } else {
          // Update existing IOB
          console.log("Updating existing IOB with ID:", params.id);
          await actorAPI.iob.update(params.id!, apiData);

          // Ensure we have the IOB ID for user creation
          if (!createdIobId) {
            setCreatedIobId(params.id!);
          }

          console.log("IOB updated successfully");

          toast({
            title: t("success"),
            description: t("iobUpdatedSuccessfully"),
          });

          // Refresh IOB data to get updated users
          const updatedIOB = await actorAPI.iob.getOne(params.id!);
          if (updatedIOB.users && Array.isArray(updatedIOB.users)) {
            setIobUsers(updatedIOB.users);
          }
        }

        // Only move to next step after successful IOB creation/update
        console.log("Moving to step 2 (users)...");
        setCurrentStep((prev) => prev + 1);
      } catch (error) {
        console.error("IOB creation/update error:", error);
        toast({
          title: t("error"),
          description: t("failedToProcessIOB"),
          variant: "destructive",
        });
      } finally {
        setIsCreatingIOB(false);
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
    setIsSubmitting(true);

    try {
      // Step 2: Handle User Creation Process
      const iobId = createdIobId || params.id;
      if (!iobId) {
        throw new Error(t("noIOBIdAvailable"));
      }

      console.log("Step 2: Processing users for IOB ID:", iobId);

      if (formValues.relatedUsers.length > 0) {
        let successCount = 0;
        let errorCount = 0;

        // Create each user separately with detailed error handling
        for (let index = 0; index < formValues.relatedUsers.length; index++) {
          const user = formValues.relatedUsers[index];
          try {
            console.log(
              `Creating user ${index + 1}/${formValues.relatedUsers.length}:`,
              user.fullName
            );

            // Import API functions
            const { actorAPI } = await import("@/app/actions/actorAPI");

            // Transform form data to API format
            const apiUserData = {
              firstname: user.fullName.split(" ")[0] || user.fullName,
              lastname: user.fullName.split(" ").slice(1).join(" ") || "",
              email:
                user.email ||
                `${user.fullName.toLowerCase().replace(/\s+/g, ".")}@iob.com`,
              password: user.password || "TempPassword123!",
              telephone: user.phone || "",
              status: user.status === "active" ? "actif" : "inactif",
              posteIob: user.position,
              matriculeIob: user.matricule || "",
              role: user.roles || [],
            };

            console.log(`User ${index + 1} data:`, apiUserData);

            await actorAPI.iob.createUser(iobId, apiUserData);
            successCount++;

            console.log(`User ${index + 1} created successfully`);
          } catch (userError) {
            console.error(`Failed to create user ${index + 1}:`, userError);

            // Log specific error details for debugging
            if (userError && typeof userError === "object") {
              if (
                "message" in userError &&
                userError.message === "Email already in use"
              ) {
                console.error(
                  `Email already in use for user: ${
                    user.email || "auto-generated"
                  }`
                );
              } else if (
                "response" in userError &&
                (userError as any).response?.data?.message
              ) {
                console.error(
                  `API Error: ${(userError as any).response.data.message}`
                );
              }
            }

            errorCount++;
          }
        }

        // Show summary toast
        if (successCount > 0) {
          toast({
            title: t("success"),
            description: `${successCount} ${t("userCreatedSuccessfully")}${
              errorCount > 0 ? `, ${errorCount} ${t("failed")}` : ""
            }`,
          });
        }

        if (errorCount > 0 && successCount === 0) {
          toast({
            title: t("error"),
            description: t("failedToCreateAnyUsers"),
            variant: "destructive",
          });
        }
      } else {
        console.log("No users to create, workflow complete");
        toast({
          title: t("success"),
          description: isEditMode
            ? t("iobUpdatedSuccessfully")
            : t("iobCreatedSuccessfully"),
        });
      }

      // Navigate back to the IOB detail page or list
      console.log("Redirecting to IOB details...");
      router.push(`/iob/${iobId}`);
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

  // Update the form steps rendering
  const formSteps = [
    // Step 1: IOB Details
    <IobForm
      key={`iob-form-${isEditMode ? params.id : "new"}-${
        formValues.iob.financialInstitutionId
      }`}
      defaultValues={formValues.iob}
      onFormChange={handleUpdateIob}
    />,
    // Step 2: Related Users
    <EnhancedUsersForm
      key="users-form"
      defaultValues={{ users: formValues.relatedUsers }}
      onFormChange={handleUpdateRelatedUsers}
      entityName="IOB"
      iobId={createdIobId || params.id}
      isEditMode={isEditMode}
      existingUsers={iobUsers}
      onRefreshUsers={refreshIOBUsers}
    />,
  ];

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center gap-4 mb-8">
        <Button
          onClick={() => router.push("/iob")}
          variant="ghost"
          size="icon"
          aria-label="Back"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>
        <h1 className="text-3xl font-bold text-gray-800">
          {isEditMode ? t("editIOB") : t("createIOB")}
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-8 mb-6">
        <div className="bg-white rounded-lg shadow-sm p-6">
          <MultiStepForm
            steps={formSteps}
            currentStep={currentStep}
            onNextStep={handleNextStep}
            onPrevStep={handlePrevStep}
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting || isCreatingIOB}
            isLastStep={currentStep === formSteps.length - 1}
            isFirstStep={currentStep === 0}
          />
        </div>
      </div>
    </div>
  );
}
