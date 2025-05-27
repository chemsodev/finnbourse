"use client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const MarketTypeFilter = () => {
  const t = useTranslations("PasserUnOrdre");
  const tOrders = useTranslations("mesOrdres");

  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const currentTab = searchParams.get("tab") || "all";
  const currentMarketType = searchParams.get("marketType") || "all";

  // If we're in the souscriptions tab, this filter should be disabled
  const isSubscriptionsTab = currentTab === "souscriptions";

  const handleMarketTypeChange = (marketType: string) => {
    if (isSubscriptionsTab) return; // Don't allow changing market type in subscriptions tab

    const params = new URLSearchParams(searchParams);
    params.set("marketType", marketType);
    router.replace(`${pathname}?${params.toString()}`);
  };
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={`flex items-center gap-1 ${
          isSubscriptionsTab
            ? "cursor-not-allowed bg-secondary/80 border border-secondary/20"
            : ""
        }`}
        disabled={isSubscriptionsTab}
      >
        {isSubscriptionsTab ? (
          <span className="flex items-center">
            {t("marcheprimaire")}{" "}
            <span className="ml-1 text-xs opacity-70">(marché fixé)</span>
          </span>
        ) : (
          <>
            {currentMarketType === "primaire"
              ? t("marcheprimaire")
              : currentMarketType === "secondaire"
              ? t("marchesecondaire")
              : tOrders("marche")}
            <ChevronDown className="text-white w-4 ml-1" />
          </>
        )}
      </DropdownMenuTrigger>
      {!isSubscriptionsTab ? (
        <DropdownMenuContent>
          <DropdownMenuLabel>{tOrders("filterMarche")}</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => handleMarketTypeChange("primaire")}
            className={`text-xs ${
              currentMarketType === "primaire" ? "bg-gray-100" : ""
            }`}
          >
            {t("marcheprimaire")}
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={() => handleMarketTypeChange("secondaire")}
            className={`text-xs ${
              currentMarketType === "secondaire" ? "bg-gray-100" : ""
            }`}
          >
            {t("marchesecondaire")}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={() => handleMarketTypeChange("all")}
            className={`text-xs ${
              currentMarketType === "all" ? "bg-gray-100" : ""
            }`}
          >
            {tOrders("Tous")}
          </DropdownMenuItem>
        </DropdownMenuContent>
      ) : null}
    </DropdownMenu>
  );
};

export default MarketTypeFilter;
