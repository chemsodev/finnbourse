"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { type AgencyData } from "@/lib/exportables";
import AgenceFormSteps from "../_components/AgenceFormSteps";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { actorAPI } from "@/app/actions/actorAPI";
import { useRestToken } from "@/hooks/useRestToken";
import { useToast } from "@/hooks/use-toast";
import { extractErrorMessage } from "@/lib/utils/errorHandling";

export default function EditAgencePage() {
  const router = useRouter();
  const { id } = useParams();
  const t = useTranslations("AgencyPage");
  const { toast } = useToast();
  const { restToken } = useRestToken();
  const [agence, setAgence] = useState<AgencyData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAgency = async () => {
      if (!id || !restToken) {
        console.log("🏦 EditAgence - Missing id or token:", {
          id,
          hasToken: !!restToken,
        });
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const agencyId =
          typeof id === "string" ? id : Array.isArray(id) ? id[0] : "";
        console.log("🏦 EditAgence - Fetching agency with ID:", agencyId);

        const result = await actorAPI.agence.getOne(agencyId, restToken);
        console.log("🏦 EditAgence - API result:", result);

        if (result.success && result.data) {
          setAgence(result.data);
          console.log(
            "🏦 EditAgence - Agency loaded successfully:",
            result.data
          );
        } else {
          throw new Error(result.message || "Failed to fetch agency");
        }
      } catch (error) {
        console.error("🏦 EditAgence - Error fetching agency:", error);
        const errorMessage = extractErrorMessage(error);
        setError(errorMessage);
        toast({
          title: t("error"),
          description: errorMessage,
          variant: "destructive",
        });

        // If agency not found, redirect back to list
        if (
          errorMessage.includes("404") ||
          errorMessage.includes("not found")
        ) {
          setTimeout(() => router.push("/agence"), 2000);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchAgency();
  }, [id, restToken, router, t, toast]);

  if (loading) {
    return (
      <div className="shadow-inner bg-gray-50 rounded-md min-h-screen">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">{t("loading")}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="shadow-inner bg-gray-50 rounded-md min-h-screen">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-red-100 rounded-full flex items-center justify-center">
                <span className="text-red-600 text-2xl">✕</span>
              </div>
              <h3 className="text-lg font-semibold text-red-800 mb-2">
                {t("error")}
              </h3>
              <p className="text-red-600 mb-4">{error}</p>
              <Button onClick={() => router.push("/agence")} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-1" />
                {t("back")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!agence) {
    return (
      <div className="shadow-inner bg-gray-50 rounded-md min-h-screen">
        <div className="container mx-auto px-4 py-6">
          <div className="flex justify-center items-center h-64">
            <div className="text-center">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {t("agencyNotFound")}
              </h3>
              <p className="text-gray-600 mb-4">
                {t("agencyNotFoundDescription")}
              </p>
              <Button onClick={() => router.push("/agence")} variant="outline">
                <ArrowLeft className="h-4 w-4 mr-1" />
                {t("back")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
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
