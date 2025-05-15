"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { agencyData, type AgencyData } from "@/lib/exportables";
import AgenceFormSteps from "../_components/AgenceFormSteps";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function EditAgencePage() {
  const router = useRouter();
  const { id } = useParams();
  const t = useTranslations("AgencyPage");
  const [agence, setAgence] = useState<AgencyData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, fetch the agency data from the API
    // Convert string id to number for comparison with agency.id which is a number
    const agencyId =
      typeof id === "string"
        ? parseInt(id, 10)
        : Array.isArray(id)
        ? parseInt(id[0], 10)
        : 0;
    const foundAgency = agencyData.find((agency) => agency.id === agencyId);

    if (foundAgency) {
      setAgence(foundAgency);
    } else {
      // Agence not found, redirect back to the list
      router.push("/agence");
    }
    setLoading(false);
  }, [id, router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (!agence) {
    return null; // Will redirect in the useEffect
  }

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
            {t("editAgency")}
          </h1>
        </div>
        <AgenceFormSteps
          mode="edit"
          initialData={agence}
          onComplete={() => router.push("/agence")}
        />
      </div>
    </div>
  );
}
