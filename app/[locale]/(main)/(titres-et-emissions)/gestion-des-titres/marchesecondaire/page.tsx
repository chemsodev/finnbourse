import MyMarquee from "@/components/MyMarquee";
import { getTranslations } from "next-intl/server";
import {
  BondIcon,
  BondIcon2,
  OPVIcon,
  ParticipatifIcon,
  SukukIcon,
} from "@/components/icons/PrimaryMarketTypesIcons";
import { MarketCardProps } from "@/types/gestionTitres";
import { taintObjectReference } from "next/dist/server/app-render/entry-base";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import MarketCard from "@/components/titres/MarketCard";

taintObjectReference;
export default async function SecondaryMarketPage() {
  const t = await getTranslations("GestionDesTitres.secondaryMarket");
  const tActions = await getTranslations("GestionDesTitres.actions");

  const cards: MarketCardProps[] = [
    {
      title: t("types.stock.title"),
      description: t("types.stock.description"),
      href: "/gestion-des-titres/marchesecondaire/action",
      Icon: OPVIcon,
    },
    {
      title: t("types.bond.title"),
      description: t("types.bond.description"),
      href: "/gestion-des-titres/marchesecondaire/obligation",
      Icon: BondIcon2,
    },
    {
      title: t("types.participativeTitles.title"),
      description: t("types.participativeTitles.description"),
      href: "/gestion-des-titres/marchesecondaire/titresparticipatifsms",
      Icon: ParticipatifIcon,
    },
    {
      title: t("types.sukuk.title"),
      description: t("types.sukuk.description"),
      href: "/gestion-des-titres/marchesecondaire/sukukms",
      Icon: SukukIcon,
    },
  ];

  return (
    <div className=" motion-preset-focus motion-duration-2000 ">
      <div className="mt-3 flex flex-col gap-4">
        <MyMarquee />
      </div>
      <Link
        href="/gestion-des-titres"
        className="flex gap-2 items-center border rounded-md py-1 px-2 bg-primary text-white w-fit absolute md:mt-10"
      >
        <ArrowLeft className="w-5" /> <div>{tActions("back")}</div>
      </Link>
      <div className="flex justify-center m-12 ">
        <h1 className="text-3xl font-bold text-primary  text-center md:ltr:text-left md:rtl:text-right">
          {t("title")}
        </h1>
      </div>
      <div className="flex justify-center">
        <div className="flex flex-col md:flex-row justify-center gap-12">
          {cards.map((card) => (
            <MarketCard key={card.href} {...card} />
          ))}
        </div>
      </div>
    </div>
  );
}
