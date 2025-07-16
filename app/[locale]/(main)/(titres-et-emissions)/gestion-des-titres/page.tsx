import PrimaryMarketIcon from "@/components/icons/PrimaryMarketIcon";
import SecondaryMarketIcon from "@/components/icons/SecondaryMarketIcon";
import MarketCard from "@/components/titres/MarketCard";
import { MarketCardProps } from "@/types/gestionTitres";
import { getTranslations } from "next-intl/server";

export default async function Titres() {
  const t = await getTranslations("GestionDesTitres");

  const cards: MarketCardProps[] = [
    {
      title: t("primaryMarket.title"),
      href: "/gestion-des-titres/marcheprimaire",
      Icon: PrimaryMarketIcon,
      description: t("infoDialogue.primaryMarket.description"),
      listItems: [
        t("infoDialogue.primaryMarket.li1P"),
        t("infoDialogue.primaryMarket.li2P"),
        t("infoDialogue.primaryMarket.li3P"),
      ],
    },
    {
      title: t("secondaryMarket.title"),
      href: "/gestion-des-titres/marchesecondaire",
      Icon: SecondaryMarketIcon,
      description: t("infoDialogue.secondaryMarket.description"),
      listItems: [
        t("infoDialogue.secondaryMarket.li1S"),
        t("infoDialogue.secondaryMarket.li2S"),
        t("infoDialogue.secondaryMarket.li3S"),
      ],
    },
  ];

  return (
    <div className=" motion-preset-focus motion-duration-2000 ">
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
