"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { accountHolderData } from "@/lib/exportables";
import { MultiStepForm } from "./multi-step-form";
import { CustodianForm } from "./custodian-form";
import { RelatedUsersForm } from "./related-users-form";
import {
  CustodianFormValues,
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
  const t = useTranslations("TCCPage");
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formValues, setFormValues] = useState<CombinedFormValues>({
    custodian: {
      code: "",
      libelle: "",
      typeCompte: "",
      statut: "Actif",
      adresse: "",
      codePostal: "",
      ville: "",
      pays: "Algérie",
      telephone: "",
      email: "",
      dateCreation: new Date().toISOString().split("T")[0],
      swift: "",
      iban: "",
      numeroCompte: "",
      devise: "EUR",
      numeroAgrement: "",
      dateAgrement: "",
      autoriteSurveillance: "",
      codeCorrespondant: "",
      nomCorrespondant: "",
      commissionFixe: "",
      commissionVariable: "",
      tauxTva: "",
      commentaire: "",
    },
    relatedUsers: [],
  });

  const isEditMode = !!params.id;

  // Fetch existing data if in edit mode
  useEffect(() => {
    if (isEditMode && params.id) {
      const id = parseInt(params.id);
      const holder = accountHolderData.find((h) => h.id === id);

      if (holder) {
        // Update custodian form data
        setFormValues((prev) => ({
          ...prev,
          custodian: {
            code: holder.code || "",
            libelle: holder.libelle || "",
            typeCompte: holder.typeCompte || "",
            statut: holder.statut || "Actif",
            adresse: holder.adresse || "",
            codePostal: holder.codePostal || "",
            ville: holder.ville || "",
            pays: holder.pays || "Algérie",
            telephone: holder.telephone || "",
            email: holder.email || "",
            dateCreation: holder.dateCreation || "",
            swift: holder.swift || "",
            iban: holder.iban || "",
            numeroCompte: holder.numeroCompte || "",
            devise: holder.devise || "EUR",
            numeroAgrement: holder.numeroAgrement || "",
            dateAgrement: holder.dateAgrement || "",
            autoriteSurveillance: holder.autoriteSurveillance || "",
            codeCorrespondant: holder.codeCorrespondant || "",
            nomCorrespondant: holder.nomCorrespondant || "",
            commissionFixe: holder.commissionFixe || "",
            commissionVariable: holder.commissionVariable || "",
            tauxTva: holder.tauxTva || "",
            commentaire: holder.commentaire || "",
          },
          // In a real application, you would fetch related users from API
          relatedUsers: [
            // These are mock related users for demonstration
            {
              id: "1",
              fullName: "Sagi Salim",
              position: "DG",
              role: "validateur 2",
              type: "admin",
              status: "active",
              organization: "SLIK PIS",
              password: "securepass1",
            },
            {
              id: "2",
              fullName: "Gadh Mohamed",
              position: "DFC",
              role: "validateur 1",
              type: "member",
              status: "active",
              organization: "SLIK PIS",
              password: "securepass2",
            },
            {
              id: "3",
              fullName: "Slmi Kadour",
              position: "Trader",
              role: "initiator",
              type: "member",
              status: "active",
              organization: "SLIK PIS",
              password: "securepass3",
            },
          ],
        }));
      }
    }
  }, [isEditMode, params.id]);

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
        title: isEditMode
          ? t("accountHolderUpdated")
          : t("accountHolderCreated"),
        description: isEditMode
          ? t("accountHolderUpdateSuccess")
          : t("accountHolderCreateSuccess"),
        variant: "success",
      });

      // Navigate back to the list page
      router.push("/tcc");
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
