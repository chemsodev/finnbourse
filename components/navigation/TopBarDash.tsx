"use client";
import React, { useEffect, useState } from "react";
import VoletNotif from "../dashboard/VoletNotif";
import { useTranslations } from "next-intl";
import { formatPrice } from "@/lib/utils";
import auth from "@/auth";
import { getServerSession } from "next-auth";
import { fetchGraphQL } from "@/app/actions/fetchGraphQL";
import { CALCULATE_TOTAL_WALLET_VALUE } from "@/graphql/queries";
import { useSession } from "next-auth/react";
import LogOutAgent from "../LogOutAgent";
import MobileNav from "../../app/[locale]/(main)/test-pdf/MobileNav";

const TopBarDash = () => {
  const t = useTranslations("TopBarDash");
  const [value, setValue] = useState(0);
  const session = useSession();
  const userid = session?.data?.user?.id;
  const userRole = session?.data?.user.roleid;
  useEffect(() => {
    const fetchData = async () => {
      if (userRole === 1) {
        try {
          const queryReturn = await fetchGraphQL<any>(
            CALCULATE_TOTAL_WALLET_VALUE,
            {
              userid,
            }
          );
          const totalValue =
            queryReturn?.aggregatePortfolio?._sum.totalPayed || 0;
          setValue(Math.abs(totalValue));
        } catch (error) {
          console.error("Error fetching total value:", error);
        }
      }
    };

    fetchData();
  }, []);

  const translations = {
    tableauDeBord: t("tableauDeBord"),
    passerUnOrdre: t("passerUnOrdre"),
    marche: t("marche"),
    portefeuille: t("portefeuille"),
    mesOrdres: t("mesOrdres"),
    carnetOrdres: t("carnetOrdres"),
    chiffresEtEditions: t("chiffresEtEditions"),
    serviceClients: t("serviceClients"),
    parametres: t("parametres"),
    statistiques: t("statistiques"),
    operationsSurTitres: t("operationsSurTitres"),
    annonceOst: t("annonceOst"),
    paiementDividendes: t("paiementDividendes"),
    paiementDroitsDeGarde: t("paiementDroitsDeGarde"),
    paiementCoupon: t("paiementCoupon"),
    remboursement: t("remboursement"),
  };

  return (
    <div className="bg-primary rounded-md flex justify-between text-white py-3 px-6 relative">
      <div className="md:hidden absolute top-0 left-0 w-full bg-primary z-50 shadow-sm py-2 px-4 flex justify-between items-center">
        <MobileNav
          translations={translations}
          userRole={userRole}
          userName={session?.data?.user?.name}
          userEmail={session?.data?.user?.email}
        />
      </div>
      {userRole === 1 ? (
        <div className="flex gap-4">
          <div className="flex flex-col">
            <div className="text-xs capitalize">{t("title")}</div>
            <div className="flex items-baseline ">
              <div className="text-xl font-semibold capitalize">
                {(value && formatPrice(value)) || 0} {t("currency")}
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
