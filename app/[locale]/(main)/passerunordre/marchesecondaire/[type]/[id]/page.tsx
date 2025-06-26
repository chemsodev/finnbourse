"use client";

import FormPassationOrdreAction from "@/components/passation-ordre/FormPassationOrdreMarcheSecondaire";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { useRestToken } from "@/hooks/useRestToken";
import TokenExpiredHandler from "@/components/TokenExpiredHandler";

const SecondaryMarketStockPage = ({
  params,
}: {
  params: { type: string; id: string };
}) => {
  const t = useTranslations("FormPassationOrdreS");
  const { type, id } = params;
  const { status } = useSession();
  const { restToken, isLoading } = useRestToken();

  // Show loading or authentication required state
  if (status === "loading" || isLoading || !restToken) {
    return (
      <>
        <TokenExpiredHandler />
        <div className="fixed top-4 right-4">
          <button
            onClick={() => {
              // Enable debug mode
              localStorage.setItem("finnbourse_debug", "true");
              window.location.reload();
            }}
            className="bg-gray-200 text-gray-700 px-3 py-1 rounded text-xs"
          >
            Debug Mode
          </button>
        </div>
      </>
    );
  }

  return (
    <div className="flex flex-col gap-10 motion-preset-focus motion-duration-2000">
      <div className="h-32 bg-gray-100 rounded-md flex justify-center items-center text-3xl font-bold text-primary uppercase">
        {type === "action"
          ? t("action")
          : type === "sukukms"
          ? t("Sukuk")
          : type === "titresparticipatifsms"
          ? t("TitresParticipatifs")
          : t("obligation")}
      </div>

      <FormPassationOrdreAction titreId={id} type={type} />
    </div>
  );
};

export default SecondaryMarketStockPage;
