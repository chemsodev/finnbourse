import { Link } from "@/i18n/routing";

import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PiBookOpenText } from "react-icons/pi";
import { TbWallet } from "react-icons/tb";
import { ImStatsBars } from "react-icons/im";
import { IoSettingsOutline } from "react-icons/io5";
import { getTranslations } from "next-intl/server";
import { RiMoneyDollarCircleLine } from "react-icons/ri";
import { UserRound } from "lucide-react";
import { HiOutlineSupport } from "react-icons/hi";

const BottomNav = async () => {
  const t = await getTranslations("SideBar");
  return (
    <div className="md:hidden fixed bg-primary border-t-2 border-secondary w-screen bottom-0 text-white flex justify-around items-center py-2 px-6 z-50">
      <Link
        href="/passerunordre"
        className="flex flex-col items-center gap-1 w-14"
      >
        <RiMoneyDollarCircleLine size={20} />
        <div className="text-[40%] font-extralight text-center">
          {t("marche")}
        </div>
      </Link>
      <Link href="/ordres" className="flex flex-col items-center gap-1 w-14">
        <PiBookOpenText size={20} />
        <div className="text-[40%] font-extralight text-center">
          {t("ordres")}
        </div>
      </Link>
      <Link
        href="/"
        className="flex justify-center items-center gap-1  rounded-full bg-white w-14 h-14 -mt-8 shadow-lg"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="25"
          height="25"
          fill="currentColor"
          className="text-secondary"
          viewBox="0 0 16 16"
        >
          <path d="M6.5 14.5v-3.505c0-.245.25-.495.5-.495h2c.25 0 .5.25.5.5v3.5a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5v-7a.5.5 0 0 0-.146-.354L13 5.793V2.5a.5.5 0 0 0-.5-.5h-1a.5.5 0 0 0-.5.5v1.293L8.354 1.146a.5.5 0 0 0-.708 0l-6 6A.5.5 0 0 0 1.5 7.5v7a.5.5 0 0 0 .5.5h4a.5.5 0 0 0 .5-.5" />
        </svg>
      </Link>
      <Link
        href="/portefeuille"
        className="flex flex-col items-center gap-1 w-14"
      >
        <TbWallet size={20} />{" "}
        <div className="text-[40%] font-extralight text-center">
          {t("portefeuille")}
        </div>
      </Link>
      <Link
        href="/utilisateurs"
        className="flex flex-col items-center gap-1 w-14"
      >
        <UserRound size={20} />{" "}
        <div className="text-[40%] font-extralight text-center">
          {t("utilisateurs")}
        </div>
      </Link>
      <DropdownMenu>
        <DropdownMenuTrigger className="flex flex-col items-center gap-1 w-14 z-20">
          <IoSettingsOutline size={20} />
          <div className="text-[40%] font-extralight text-center">
            {t("Parametres")}
          </div>
        </DropdownMenuTrigger>{" "}
        <DropdownMenuContent>
          <DropdownMenuLabel>User Menu</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <Link href="/profile" className="flex items-center gap-2">
              <UserRound size={16} />
              {t("Profile")}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/statistiques" className="flex items-center gap-2">
              <ImStatsBars size={16} />
              {t("Statistiques")}
            </Link>
          </DropdownMenuItem>{" "}
          <DropdownMenuItem>
            <Link href="/parametres" className="flex items-center gap-2">
              <IoSettingsOutline size={16} />
              {t("Parametres")}
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Link href="/serviceclients" className="flex items-center gap-2">
              <HiOutlineSupport size={16} />
              {t("ServiceClients")}
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default BottomNav;
