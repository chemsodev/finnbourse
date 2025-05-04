"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { MultiStepForm } from "./multi-step-form";
import { IobForm } from "./iob-form";
import { RelatedUsersForm } from "./related-users-form";
import {
  IobFormValues,
  RelatedUserFormValues,
  CombinedFormValues,
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
  const isEditMode = Boolean(params.id);

  // Form state
  const [formValues, setFormValues] = useState<CombinedFormValues>({
    iob: {
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
    if (isEditMode && params.id) {
      // Mock data fetch - in a real app, you'd fetch from API
      setFormValues((prev) => ({
        ...prev,
        iob: {
          codeIob: "91001",
          libelleCourt: "SGA",
          libelleLong: "Société Générale Algérie",
          correspondant: "1",
          email: "contact@sga.dz",
          fax: "021-111-222",
          telephone: "021-333-444",
          addresse: "ALGER",
          ordreDeTu: "1",
        },
        // Mock related users data
        relatedUsers: [
          {
            id: "1",
            fullName: "John Doe",
            position: "DG",
            role: "validator2",
            status: "admin",
            organization: "SGA",
          },
          {
            id: "2",
            fullName: "Jane Smith",
            position: "DFC",
            role: "validator1",
            status: "member",
            organization: "SGA",
          },
        ],
      }));
    }
  }, [isEditMode, params.id]);

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

  const handleNextStep = () => {
    setCurrentStep((prev) => prev + 1);
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    try {
      // In a real application, you would submit to an API
      console.log("Form Values:", formValues);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: isEditMode ? t("iobUpdated") : t("iobCreated"),
        description: isEditMode ? t("iobUpdateSuccess") : t("iobCreateSuccess"),
        variant: "success",
      });

      // Navigate back to the list page
      router.push("/iob");
    } catch (error) {
      console.error(error);
      toast({
        title: t("error"),
        description: t("somethingWentWrong"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const steps = [
    <IobForm
      key="iob-form"
      defaultValues={formValues.iob}
      onFormChange={handleUpdateIob}
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
          onClick={() => router.push("/iob")}
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="sr-only">{t("back")}</span>
        </Button>
        <h1 className="text-3xl font-bold text-gray-800">
          {isEditMode ? t("editIOB") : t("addNewIOB")}
        </h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <MultiStepForm
          steps={steps}
          currentStep={currentStep}
          onNextStep={handleNextStep}
          onPrevStep={handlePrevStep}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          isLastStep={currentStep === steps.length - 1}
          isFirstStep={currentStep === 0}
        />
      </div>
    </div>
  );
}
