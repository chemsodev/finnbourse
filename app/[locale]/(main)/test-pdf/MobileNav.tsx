"use client";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Link } from "@/i18n/routing";
import Image from "next/image";
import React from "react";
import { HiOutlineSupport } from "react-icons/hi";
import { PiBookOpenText } from "react-icons/pi";
import { TbWallet } from "react-icons/tb";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImStatsBars } from "react-icons/im";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import {
  ArrowRightLeft,
  LayoutDashboard,
  FileBarChart,
  Settings,
  Menu,
} from "lucide-react";
import LocaleButton from "../../../../components/Locales/LocaleButton";
import NavbarLink from "../../../../components/navigation/NavbarLink";
import { DeconnexionDialog } from "../../../../components/DeconnexionDialog";
import TitresEtEmissionDropDown from "../../../../components/navigation/TitresEtEmissionDropDown";
import GestionDeCompteDropDown from "../../../../components/navigation/GestionDeCompteDropDown";
import OperationsSurTitresDropDown from "../../../../components/navigation/OperationsSurTitresDropDown";

interface MobileNavProps {
  translations: {
    tableauDeBord: string;
    passerUnOrdre: string;
    marche: string;
    portefeuille: string;
    mesOrdres: string;
    ordres: string;
    chiffresEtEditions: string;
    operationsSurTitres: string;
    annonceOst: string;
    paiementDividendes: string;
    paiementDroitsDeGarde: string;
    paiementCoupon: string;
    remboursement: string;
  };
  userRole: number | undefined;
  userName: string | undefined;
  userEmail: string | undefined;
}

const MobileNav: React.FC<MobileNavProps> = ({
  translations,
  userRole,
  userName,
  userEmail,
}) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <button className="rounded-md bg-primary text-white  p-2">
          <Menu className="h-6 w-6 text-white" />
        </button>
      </SheetTrigger>
      <SheetContent className="p-6  sm:max-w-sm">
        <div className="flex gap-4 items-center mb-4">
          <div className="flex items-center z-50">
            <div className="rounded-full bg-white border-secondary  border-2 shadow-sm p-2 w-fit">
              <Image
                src="/favicon.ico"
                width={100}
                height={100}
                alt="logo"
                className="w-8 h-8 p-1"
              />
            </div>
          </div>
          <div className="text-primary font-bold">FinnBourse</div>
        </div>
        <div className="grid gap-4 py-4">
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
                href: "/ordres",
                icon:
                  userRole === 1 ? (
                    <ArrowRightLeft size={15} />
                  ) : (
                    <PiBookOpenText size={15} />
                  ),
                label:
                  userRole === 1 ? translations.mesOrdres : translations.ordres,
              }}
            />
          )}
          {userRole !== 0 && userRole !== 1 && (
            <>
              <TitresEtEmissionDropDown />
              <GestionDeCompteDropDown />
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
          <DeconnexionDialog />
          <div className="flex flex-col gap-2">
            <Link
              href="/profile"
              className="flex bg-white shadow-sm items-center gap-4 hover:shadow-inner p-2 w-full rounded-xl"
            >
              <Avatar>
                <AvatarImage src="" />
                <AvatarFallback>
                  {userName?.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex flex-col text-xs">
                <div className="font-medium capitalize text-sm">{userName}</div>
                <div className="text-[8px] text-gray-500">{userEmail}</div>
              </div>
            </Link>
            <LocaleButton />
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
