import { Link } from "@/i18n/routing";
import Image from "next/image";
import React from "react";
import { HiOutlineSupport } from "react-icons/hi";
import { PiBookOpenText } from "react-icons/pi";
import { TbWallet } from "react-icons/tb";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ImStatsBars } from "react-icons/im";
import { DeconnexionDialog } from "./DeconnexionDialog";
import { getServerSession } from "next-auth";
import auth from "@/auth";
import { getTranslations } from "next-intl/server";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import NavbarLink from "./NavbarLink";

import {
  ArrowRightLeft,
  Calculator,
  LayoutDashboard,
  Settings,
  UserRound,
} from "lucide-react";

import LocaleButton from "./Locales/LocaleButton";

const SideBar = async () => {
  const session = await getServerSession(auth);
  const userRole = session?.user?.roleid;
  const t = await getTranslations("SideBar");

  return (
    <div className="hidden md:flex bg-gray-50 w-1/6 px-3 py-5 shadow-inner h-screen overflow-scroll flex-col justify-between">
      <div className="flex flex-col gap-16 ">
        <div className="flex gap-4 justify-center items-center py-8">
          <div className="rounded-full bg-white shadow-sm p-2  w-fit">
            <Image
              src="/favicon.ico"
              width={100}
              height={100}
              alt="logo"
              className="w-10 "
            />
          </div>
          <div className="text-primary font-bold">Invest Market</div>
        </div>
        <div className="flex flex-col gap-4">
          <NavbarLink
            link={{
              href: "/",
              icon: <LayoutDashboard size={20} />,
              label: t("TableauDeBord"),
            }}
          />
          <NavbarLink
            link={{
              href: "/passerunordre",
              icon:
                userRole === 1 ? (
                  <PiBookOpenText size={20} />
                ) : (
                  <RiMoneyDollarCircleLine size={20} />
                ),
              label: userRole === 1 ? t("PasserUnOrdre") : t("marche"),
            }}
          />

          {userRole === 1 && (
            <NavbarLink
              link={{
                href: "/portefeuille",
                icon: <TbWallet size={20} />,
                label: t("portefeuille"),
              }}
            />
          )}
          {userRole !== 0 && (
            <NavbarLink
              link={{
                href: "/carnetordres",
                icon:
                  userRole === 1 ? (
                    <ArrowRightLeft size={20} />
                  ) : (
                    <PiBookOpenText size={20} />
                  ),
                label: userRole === 1 ? t("mesOrdres") : t("carnetOrdres"),
              }}
            />
          )}
          {/*(userRole !== 0 && userRole !== 1) && (
        <OperationsSurTitresDropDown
          titre={t("operationsSurTitres")} 
          annonceOst={t("annonceOst")} 
          paiementDividendes={t("paiementDividendes")} 
          paiementDroitsDeGarde={t("paiementDroitsDeGarde")}  
          paiementCoupon={t("paiementCoupon")}  
          remboursement={t("remboursement")}  
        />
          )*/}
          {(userRole === 3 || userRole === 2) && (
            <NavbarLink
              link={{
                href: "/utilisateurs",
                icon: <UserRound size={20} />,
                label: t("utilisateurs"),
              }}
            />
          )}
          {userRole !== 0 && (
            <NavbarLink
              link={{
                href: "/statistiques",
                icon: <ImStatsBars size={20} />,
                label: t("Statistiques"),
              }}
            />
          )}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        {(userRole === 1 || userRole === 0) && (
          <Link
            href="/serviceclients"
            className="flex items-center gap-4 hover:bg-green-600/20 hover:text-primary hover:shadow-sm py-2 px-6 w-full rounded-xl "
          >
            <HiOutlineSupport size={20} />
            <div className="capitalize text-sm">{t("ServiceClients")}</div>
          </Link>
        )}

        {(userRole === 3 || userRole === 2) && (
          <Link
            href="/parametres"
            className="flex items-center gap-4 hover:bg-green-600/20 hover:text-primary hover:shadow-sm py-2 px-6 w-full rounded-xl "
          >
            <Settings size={20} />
            <div className="capitalize text-sm">{t("parametres")}</div>
          </Link>
        )}

        <DeconnexionDialog />
        <div className="flex mt-2">
          {" "}
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
              <div className="font-semibold capitalize">
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
  );
};

export default SideBar;
