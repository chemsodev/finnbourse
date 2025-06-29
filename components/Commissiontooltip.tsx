import React from "react";
import { Separator } from "./ui/separator";
import { GoQuestion } from "react-icons/go";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { useTranslations } from "next-intl";

const Commissiontooltip = () => {
  const t = useTranslations("FormPassationOrdreObligation");

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          type="button"
          className="flex justify-between items-baseline group"
        >
          <div className="text-gray-400 capitalize text-lg flex items-center gap-3 cursor-pointer">
            {t("commission")} <GoQuestion width={30} />
          </div>
          <div className="text-lg font-semibold">3 %</div>
        </TooltipTrigger>
        <TooltipContent className="w-72">
          <ul className="flex flex-col gap-2 p-4 list-disc">
            <li className="flex justify-between items-baseline">
              <div className="text-xs text-gray-500">
                {t("commissionBourse")} :
              </div>
              <div className="font-semibold">0.32 %</div>
            </li>
            <li className="flex justify-between items-baseline">
              <div className="text-xs text-gray-500">
                {t("commissionInvestMarket")} :
              </div>
              <div className="font-semibold">0.44 %</div>
            </li>
            <li className="flex justify-between items-baseline">
              <div className="text-xs text-gray-500">
                {t("commissionSlickPay")} :
              </div>
              <div className="font-semibold">0.9 %</div>
            </li>
            <li className="flex justify-between items-baseline">
              <div className="text-xs text-gray-500">
                {t("commissionSamdi")} :
              </div>
              <div className="font-semibold">0.32 %</div>
            </li>
          </ul>
          <Separator />
          <div className="flex justify-between items-baseline p-4">
            <div className=" text-gray-500">{t("commissionTotale")} :</div>
            <div className="font-semibold text-lg">3 %</div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default Commissiontooltip;
