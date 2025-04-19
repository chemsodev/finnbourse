"use client";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import AgenceFormSteps from "../_components/AgenceFormSteps";

export default function NewAgencePage() {
  const router = useRouter();
  const t = useTranslations("AgencyPage");

  return (
    <div className="shadow-inner bg-gray-50 rounded-md">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-secondary my-4">
          {t("addNewAgency")}
        </h1>
        <AgenceFormSteps
          mode="add"
          initialData={null}
          onComplete={() => router.push("/agence")}
        />
      </div>
    </div>
  );
}
