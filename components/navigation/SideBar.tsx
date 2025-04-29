import { Link } from "@/i18n/routing";
import Image from "next/image";
import React from "react";
import { HiOutlineSupport } from "react-icons/hi";
import { PiBookOpenText } from "react-icons/pi";
import { TbWallet } from "react-icons/tb";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImStatsBars } from "react-icons/im";
import { DeconnexionDialog } from "../DeconnexionDialog";
import { getServerSession } from "next-auth";
import auth from "@/auth";
import { getTranslations } from "next-intl/server";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import NavbarLink from "./NavbarLink";

import {
  ArrowRightLeft,
  LayoutDashboard,
  Settings,
  FileBarChart,
} from "lucide-react";

import LocaleButton from "../Locales/LocaleButton";
import OperationsSurTitresDropDown from "./OperationsSurTitresDropDown";
import TitresEtEmissionDropDown from "./TitresEtEmissionDropDown";
import GestionDeCompteDropDown from "./GestionDeCompteDropDown";
import GestionDesActeurs from "../GestionDesActeurs";

const SideBar = async () => {
  const session = await getServerSession(auth);
  const userRole = session?.user?.roleid;
  const t = await getTranslations("SideBar");

  // Resolve translations and pass them as props
  const translations = {
    tableauDeBord: t("TableauDeBord"),
    passerUnOrdre: t("PasserUnOrdre"),
    marche: t("marche"),
    portefeuille: t("portefeuille"),
    mesOrdres: t("mesOrdres"),
    carnetOrdres: t("carnetOrdres"),
    chiffresEtEditions: t("chiffresEtEditions"),
    serviceClients: t("ServiceClients"),
    parametres: t("parametres"),
    statistiques: t("Statistiques"),
    operationsSurTitres: t("operationsSurTitres"),
    annonceOst: t("annonceOst"),
    paiementDividendes: t("paiementDividendes"),
    paiementDroitsDeGarde: t("paiementDroitsDeGarde"),
    paiementCoupon: t("paiementCoupon"),
    remboursement: t("remboursement"),
  };

  return (
    <>
      <div className="hidden md:flex bg-gray-50 w-1/6 px-3 py-5 shadow-inner h-screen overflow-scroll flex-col justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex gap-4 justify-center items-center py-8">
            <div className="rounded-full bg-white shadow-sm p-2 w-fit">
              <Image
                src="/favicon.ico"
                width={100}
                height={100}
                alt="logo"
                className="w-8 h-8 p-1"
              />
            </div>
            <div className="text-primary font-bold">FinnBourse</div>
          </div>
          <div className="flex flex-col gap-2">
            <NavbarLink
              link={{
                href: "/",
                icon: <LayoutDashboard size={15} />,
                label: translations.tableauDeBord,
              }}
            />
            <NavbarLink
              link={{
                href: "/passerunordre",
                icon:
                  userRole === 1 ? (
                    <PiBookOpenText size={15} />
                  ) : (
                    <RiMoneyDollarCircleLine size={15} />
                  ),
                label:
                  userRole === 1
                    ? translations.passerUnOrdre
                    : translations.marche,
              }}
            />

            {userRole === 1 && (
              <NavbarLink
                link={{
                  href: "/portefeuille",
                  icon: <TbWallet size={20} />,
                  label: translations.portefeuille,
                }}
              />
            )}
            {userRole !== 0 && (
              <NavbarLink
                link={{
                  href: "/carnetordres",
                  icon:
                    userRole === 1 ? (
                      <ArrowRightLeft size={15} />
                    ) : (
                      <PiBookOpenText size={15} />
                    ),
                  label:
                    userRole === 1
                      ? translations.mesOrdres
                      : translations.carnetOrdres,
                }}
              />
            )}
            {userRole !== 0 && userRole !== 1 && (
              <>
                <TitresEtEmissionDropDown />
                <GestionDeCompteDropDown />
                <GestionDesActeurs />
                <OperationsSurTitresDropDown
                  titre={translations.operationsSurTitres}
                  annonceOst={translations.annonceOst}
                  paiementDividendes={translations.paiementDividendes}
                  paiementDroitsDeGarde={translations.paiementDroitsDeGarde}
                  paiementCoupon={translations.paiementCoupon}
                  remboursement={translations.remboursement}
                />
              </>
            )}

            {userRole !== 0 && userRole !== 1 && (
              <NavbarLink
                link={{
                  href: "/chiffres-et-editions",
                  icon: <FileBarChart size={15} />,
                  label: translations.chiffresEtEditions,
                }}
              />
            )}
          </div>
        </div>
        <div className="flex flex-col gap-2">
          {(userRole === 1 || userRole === 0) && (
            <Link
              href="/serviceclients"
              className="flex items-center gap-4 hover:bg-secondary/20 hover:text-primary hover:shadow-sm py-2 px-6 w-full rounded-xl "
            >
              <HiOutlineSupport size={15} />
              <div className="capitalize text-sm">
                {translations.serviceClients}
              </div>
            </Link>
          )}

          {(userRole === 3 || userRole === 2) && (
            <Link
              href="/parametres"
              className="flex items-center gap-4 hover:bg-secondary/20 hover:text-primary hover:shadow-sm py-2 px-6 w-full rounded-xl "
            >
              <Settings size={15} />
              <div className="capitalize text-xs">
                {translations.parametres}
              </div>
            </Link>
          )}
          {userRole === 1 && (
            <NavbarLink
              link={{
                href: "/statistiques",
                icon: <ImStatsBars size={15} />,
                label: translations.statistiques,
              }}
            />
          )}
          <DeconnexionDialog />
          <div className="flex">
            <Link
              href="/profile"
              className="flex bg-white shadow-sm items-center gap-4 hover:shadow-inner p-2 w-full ltr:rounded-l-xl rtl:rounded-r-xl"
            >
              <Avatar>
                <AvatarImage src="" />
                <AvatarFallback>
                  {session?.user?.name?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>

              <div className="flex flex-col text-xs">
                <div className="font-medium capitalize text-sm">
                  {session?.user?.name}
                </div>
                <div className="text-[8px] text-gray-500">
                  {session?.user?.email}
                </div>
              </div>
            </Link>
            <LocaleButton />
          </div>
        </div>
      </div>
    </>
  );
};

export default SideBar;
