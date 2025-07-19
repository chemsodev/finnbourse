"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { MarketTable } from "@/components/titres/MarketTable";
import { useRestToken } from "@/hooks/useRestToken";
import { Stock } from "@/types/gestionTitres";
import { Loader2 } from "lucide-react";

type TabType = "action" | "obligation";

const SecondaryMarketTable = () => {
  const t = useTranslations("Titres");
  const {
    isLoading: isTokenLoading,
    isAuthenticated,
    hasRestToken,
  } = useRestToken();
  const [activeTab, setActiveTab] = useState<TabType>("action");
  const [stocks, setStocks] = useState<Stock[]>([]);

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    setStocks([]); // Reset stocks when changing tabs
  };

  // Show loading state while waiting for authentication
  if (isTokenLoading || !isAuthenticated || !hasRestToken) {
    return (
      <div className="w-full">
        <div className="mb-4">
          <h2 className="text-xl font-bold text-primary/80 mb-4">
            {t("marcheSecondaire")}
          </h2>
        </div>
        <div className="border border-gray-100 rounded-md p-8 bg-gray-50/80">
          <div className="flex justify-center items-center">
            <div className="text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-4" />
              <p className="text-sm text-gray-600">
                {isTokenLoading
                  ? "Loading authentication..."
                  : !isAuthenticated
                  ? "Please log in to continue..."
                  : "Preparing data connection..."}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-primary/80 mb-4">
          {t("marcheSecondaire")}
        </h2>

        {/* Tab Navigation */}
        <div className="flex border-b border-gray-200 mb-4">
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
      </div>

      {/* Market Table */}
      <div className="border border-gray-100 rounded-md p-4 bg-gray-50/80">
        <MarketTable
          type={activeTab}
          marketType="secondaire"
          stocks={stocks}
          setStocks={setStocks}
          isIOB={true}
          canEdit={false}
        />
      </div>
    </div>
  );
};

export default SecondaryMarketTable;
