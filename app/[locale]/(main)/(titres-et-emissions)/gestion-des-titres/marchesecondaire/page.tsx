// import MyMarquee from "@/components/MyMarquee";
// import { getTranslations } from "next-intl/server";
// import { BondIcon2, OPVIcon } from "@/components/icons/PrimaryMarketTypesIcons";
// import { MarketCardProps } from "@/types/gestionTitres";
// import { taintObjectReference } from "next/dist/server/app-render/entry-base";
// import Link from "next/link";
// import { ArrowLeft } from "lucide-react";
// import MarketCard from "@/components/titres/MarketCard";

// taintObjectReference;
// export default async function SecondaryMarketPage() {
//   const t = await getTranslations("GestionDesTitres.secondaryMarket");
//   const tActions = await getTranslations("GestionDesTitres.actions");

//   const cards: MarketCardProps[] = [
//     {
//       title: t("types.stock.title"),
//       description: t("types.stock.description"),
//       href: "/gestion-des-titres/marchesecondaire/action",
//       Icon: OPVIcon,
//     },
//     {
//       title: t("types.bond.title"),
//       description: t("types.bond.description"),
//       href: "/gestion-des-titres/marchesecondaire/obligation",
//       Icon: BondIcon2,
//     },
//   ];

//   return (
//     <div className=" motion-preset-focus motion-duration-2000 ">
//       <div className="mt-3 flex flex-col gap-4">
//         <MyMarquee />
//       </div>
//       <Link
//         href="/gestion-des-titres"
//         className="flex gap-2 items-center border rounded-md py-1 px-2 bg-primary text-white w-fit absolute md:mt-10"
//       >
//         <ArrowLeft className="w-5" /> <div>{tActions("back")}</div>
//       </Link>
//       <div className="flex justify-center m-12 ">
//         <h1 className="text-3xl font-bold text-primary  text-center md:ltr:text-left md:rtl:text-right">
//           {t("title")}
//         </h1>
//       </div>
//       <div className="flex justify-center">
//         <div className="flex flex-col md:flex-row justify-center gap-12">
//           {cards.map((card) => (
//             <MarketCard key={card.href} {...card} />
//           ))}
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import React, { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useTranslations } from "next-intl";
import { ArrowLeft } from "lucide-react";

import MyMarquee from "@/components/MyMarquee";
import TokenExpiredHandler from "@/components/TokenExpiredHandler";
import { useRestToken } from "@/hooks/useRestToken";
import Link from "next/link";
import { MarketTable } from "@/components/titres/MarketTable";
import { Stock, StockType } from "@/types/gestionTitres";

type Props = {
  params: {
    type: string;
  };
};

const SecondaryMarketTypePage = ({ params }: Props) => {
  const { type } = params;
  const t = useTranslations("Titres");
  const [stocks, setStocks] = useState<Stock[]>([]);
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

  console.log(stocks);

  return (
    <div className="motion-preset-focus motion-duration-2000">
      <div className="mt-3">
        <MyMarquee />
      </div>

      <Link
        href="/gestion-des-titres"
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
        <MarketTable
          type={type as StockType}
          marketType="secondaire"
          stocks={stocks}
          setStocks={setStocks}
        />
      </div>
    </div>
  );
};

export default SecondaryMarketTypePage;
