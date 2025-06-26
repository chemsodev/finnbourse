"use client";
import React from "react";
import VoletNotif from "../dashboard/StaticVoletNotif";
import { useLocale, useTranslations } from "next-intl";
import { formatPrice } from "@/lib/utils";
import { useSession } from "next-auth/react";
import LogOutAgent from "../LogOutAgent";
import DynamicMobileNav from "./DynamicMobileNav";

export const TopBarDash = () => {
  const locale = useLocale();
  const t = useTranslations("TopBarDash");
  const session = useSession();
  const userRole = (session?.data?.user as any)?.roleid;

  // Static mock wallet value
  const totalValue = 1150000;

  return (
    <div className="bg-primary rounded-md flex justify-between text-white py-3 px-6 relative">
      <div className="md:hidden absolute top-0 left-0 w-full bg-primary z-50 shadow-sm py-2 px-4 flex justify-between items-center">
        <DynamicMobileNav
          userName={session?.data?.user?.name || undefined}
          userEmail={session?.data?.user?.email || undefined}
        />
      </div>
      {userRole === 1 ? (
        <div className="flex gap-4">
          <div className="flex flex-col">
            <div className="text-xs capitalize">{t("title")}</div>
            <div className="flex items-baseline ">
              <div className="text-xl font-semibold capitalize">
                {(totalValue && formatPrice(totalValue)) || 0} {t("currency")}
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="text-xs capitalize">{t("tauxDeRendement")}</div>
            <div className="flex items-baseline ">
              <div className="text-xl font-semibold capitalize">4 %</div>
            </div>
          </div>
        </div>
      ) : (
        <div></div>
      )}
      <div className="flex items-center z-50">
        <VoletNotif />
      </div>
    </div>
  );
};

export default TopBarDash;
