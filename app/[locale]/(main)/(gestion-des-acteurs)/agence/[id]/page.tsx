"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { agencyData, type AgencyData } from "@/lib/exportables";
import AgenceFormSteps from "../_components/AgenceFormSteps";

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
    <div className="shadow-inner bg-gray-50 rounded-md">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-secondary my-4">
          {t("editAgency")}
        </h1>
        <AgenceFormSteps
          mode="edit"
          initialData={agence}
          onComplete={() => router.push("/agence")}
        />
      </div>
    </div>
  );
}
