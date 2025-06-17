"use client";
import React, { useEffect, useState } from "react";
import VoletNotif from "../dashboard/VoletNotif";
import { useLocale, useTranslations } from "next-intl";
import { formatPrice } from "@/lib/utils";
import auth from "@/auth";
import { fetchGraphQLClient } from "@/app/actions/clientGraphQL";
import { CALCULATE_TOTAL_WALLET_VALUE } from "@/graphql/queries";
import { useSession } from "next-auth/react";
import LogOutAgent from "../LogOutAgent";
import DynamicMobileNav from "./DynamicMobileNav";

export const TopBarDash = () => {
  const locale = useLocale();
  const t = useTranslations("TopBarDash");
  const [totalValue, setTotalValue] = useState<number>(0);
  const session = useSession();
  const userid = (session?.data?.user as any)?.id;
  const userRole = (session?.data?.user as any)?.roleid;

  useEffect(() => {
    const fetchData = async () => {
      if (userRole === 1) {
        try {
          const queryReturn = await fetchGraphQLClient<any>(
            CALCULATE_TOTAL_WALLET_VALUE,
            {
              userid,
            }
          );
          const totalValue =
            queryReturn?.aggregatePortfolio?._sum.totalPayed || 0;
          setTotalValue(Math.abs(totalValue));
        } catch (error) {
          console.error("Error fetching total value:", error);
        }
      }
    };
    fetchData();
  }, []);

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
