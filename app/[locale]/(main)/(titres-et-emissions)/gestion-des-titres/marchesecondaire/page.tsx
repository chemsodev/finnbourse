"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { ArrowLeft } from "lucide-react";

import TokenExpiredHandler from "@/components/TokenExpiredHandler";
import { useRestToken } from "@/hooks/useRestToken";
import { Link } from "@/i18n/routing";
import { MarketTable } from "@/components/titres/MarketTable";
import { Stock, StockType } from "@/types/gestionTitres";

type Props = {
  params: {
    type: string;
  };
};

type TabType = "action" | "obligation";

const SecondaryMarketTypePage = ({ params }: Props) => {
  const { type } = params;
  const t = useTranslations("Titres");
  const [activeTab, setActiveTab] = useState<TabType>("action");
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [iobStocks, setIobStocks] = useState<Stock[]>([]);
  const [refreshTable, setRefreshTable] = useState<
    (() => Promise<void>) | null
  >(null);
  const { data: session, status } = useSession();
  const { restToken, isLoading } = useRestToken();

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setIobStocks([]);
  };

  // Function to capture the refresh function from MarketTable
  const handleRefreshFunction = (refreshFn: () => Promise<void>) => {
    setRefreshTable(() => refreshFn);
  };

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

  console.log(stocks);

  return (
    <div className="motion-preset-focus motion-duration-2000">
      <Link
        href="/gestion-des-titres"
        className="flex gap-2 items-center border rounded-md py-1 px-2 bg-primary text-white w-fit md:mt-4"
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

      <div className="ml-8 mb-8">
        <h2 className="text-2xl font-bold text-primary/80 mb-4">
          1 . Introduction au marché secondaire
        </h2>
        <div className="border  border-gray-100 rounded-md p-4 bg-gray-50/80">
          <MarketTable
            type={type as StockType}
            marketType="secondaire"
            stocks={stocks}
            setStocks={setStocks}
            isIOB={false}
            onRefresh={handleRefreshFunction}
          />
        </div>
      </div>
      <div className="ml-8 mb-4">
        <h2 className="text-2xl font-bold text-primary/80 mb-4">
          2 . {t("marcheSecondaire")}
        </h2>
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === "action"
                ? "border-b-2 border-primary text-primary"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => handleTabChange("action")}
          >
            {t("stock")}
          </button>
          <button
            className={`py-2 px-4 font-medium text-sm ${
              activeTab === "obligation"
                ? "border-b-2 border-primary text-primary"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => handleTabChange("obligation")}
          >
            {t("bond")}
          </button>
        </div>
        <div className="border  border-gray-100 rounded-md p-4 bg-gray-50/80">
          <MarketTable
            type={activeTab}
            marketType="secondaire"
            stocks={iobStocks}
            setStocks={setIobStocks}
            isIOB={true}
            onRefresh={handleRefreshFunction}
            canEdit={false}
          />
        </div>
      </div>
    </div>
  );
};

export default SecondaryMarketTypePage;
