"use client";
import { Link } from "@/i18n/routing";
import React from "react";
import { IoReloadSharp } from "react-icons/io5";
import { MdDoneOutline } from "react-icons/md";
import { TbMessages } from "react-icons/tb";
import { useTranslations } from "next-intl";
import OrderCounter from "./gestion-des-ordres/OrderCounter";

const NegotiatiorStats = () => {
  const t = useTranslations("NegotiatiorStats");
  
  // Static mock data
  const validatedOrderCounter = 42;
  const nbMessages = 7;

  return (
    <div className="flex flex-row gap-4 justify-between">
      <Link
        href="/ordres"
        className="bg-primary transition-all duration-300 rounded-md h-20 flex-1 text-white flex gap-4 justify-start ltr:pl-4 rtl:pr-4 py-3 items-center"
      >
        <div className="bg-white/20 w-12 h-12 rounded-full flex justify-center items-center">
          <MdDoneOutline size={24} />
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-sm font-medium">{t("ordresExecute")}</div>
          <div className="text-xl font-semibold">
            {validatedOrderCounter}
          </div>
        </div>
      </Link>
      <Link
        href="/ordres?state=1"
        className="bg-primary transition-all duration-300 rounded-md h-20 flex-1 text-white flex gap-4 justify-start ltr:pl-4 rtl:pr-4 py-3 items-center"
      >
        <div className="bg-white/20 w-12 h-12 rounded-full flex justify-center items-center">
          <IoReloadSharp size={24} />
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-sm font-medium">{t("ordresEnAttente")}</div>
          <div className="text-xl font-semibold">
            <OrderCounter />
          </div>
        </div>
      </Link>
      <Link
        href="/serviceclients"
        className="bg-primary transition-all duration-300 rounded-md h-20 flex-1 text-white flex gap-4 justify-start ltr:pl-4 rtl:pr-4 py-3 items-center"
      >
        <div className="bg-white/20 w-12 h-12 rounded-full flex justify-center items-center">
          <TbMessages size={24} />
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-sm font-medium">{t("messages")}</div>
          <div className="text-xl font-semibold">{nbMessages}</div>
        </div>
      </Link>
    </div>
  );
};

export default NegotiatiorStats;
