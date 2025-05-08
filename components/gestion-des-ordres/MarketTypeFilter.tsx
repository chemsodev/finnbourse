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

  const currentMarketType = searchParams.get("marketType") || "all";

  const handleMarketTypeChange = (marketType: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("marketType", marketType);
    router.replace(`${pathname}?${params.toString()}`);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-1">
        {tOrders("marche")} <ChevronDown className="text-white w-4" />
      </DropdownMenuTrigger>
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
    </DropdownMenu>
  );
};

export default MarketTypeFilter;
