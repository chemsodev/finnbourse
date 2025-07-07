"use client";

import React, { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { ArrowLeft } from "lucide-react";

import MyMarquee from "@/components/MyMarquee";
import TokenExpiredHandler from "@/components/TokenExpiredHandler";
import { useRestToken } from "@/hooks/useRestToken";
import Link from "next/link";
import { MarketTable } from "@/components/titres/MarketTable";
import { StockType } from "@/types/gestionTitres";

type Props = {
  params: {
    type: string;
  };
};

const SecondaryMarketTypePage = ({ params }: Props) => {
  const { type } = params;
  const t = useTranslations("Titres");
  const { data: session, status } = useSession();
  const { restToken, isLoading } = useRestToken();

  if (status === "loading" || isLoading || !restToken) {
    return (
      <>
        <TokenExpiredHandler />
        <div className="fixed top-4 right-4">
          <button
            onClick={() => {
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

  const getTypeLabel = (t: (key: string) => string, type: string) => {
    const typeMap: Record<string, string> = {
      actions: t("stock"),
      obligations: t("bond"),
      titresparticipatifsms: t("participativeTitles"),
      sukukms: t("sukuk"),
    };
    return typeMap[type] || "";
  };

  return (
    <div className="motion-preset-focus motion-duration-2000">
      <div className="mt-3">
        <MyMarquee />
      </div>

      <Link
        href="/gestion-des-titres/marchesecondaire"
        className="flex gap-2 items-center border rounded-md py-1 px-2 bg-primary text-white w-fit absolute md:mt-4"
      >
        <ArrowLeft className="w-5" />
        <div>{t("back")}</div>
      </Link>

      <div className="flex flex-col gap-1 mt-16 mb-8 ml-8 text-center md:ltr:text-left md:rtl:text-right">
        <div className="text-3xl font-bold text-primary">
          {t("marcheSecondaire")}
          <span className="text-lg text-black mx-1">
            {getTypeLabel(t, type)}
          </span>
        </div>
        <div className="text-xs text-gray-500">{t("explMS")}</div>
      </div>

      <div className="border ml-4 border-gray-100 rounded-md p-4 bg-gray-50/80">
        <MarketTable type={type as StockType} marketType="secondary" />
      </div>
    </div>
  );
};

export default SecondaryMarketTypePage;
