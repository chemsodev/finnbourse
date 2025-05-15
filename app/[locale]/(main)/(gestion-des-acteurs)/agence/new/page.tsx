"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import AgenceFormSteps from "../_components/AgenceFormSteps";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NewAgencePage() {
  const router = useRouter();
  const t = useTranslations("AgencyPage");

  return (
    <div className="shadow-inner bg-gray-50 rounded-md min-h-screen">
      <div className="container mx-auto px-4 py-6 overflow-y-auto">
        <div className="flex items-center mb-6">
          <Button
            onClick={() => router.push("/agence")}
            variant="outline"
            className="mr-4"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            {t("back")}
          </Button>
          <h1 className="text-3xl font-bold text-secondary">
            {t("addNewAgency")}
          </h1>
        </div>
        <AgenceFormSteps
          mode="add"
          initialData={null}
          onComplete={() => router.push("/agence")}
        />
      </div>
    </div>
  );
}
