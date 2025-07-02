"use client";
import { Link } from "@/i18n/routing";
import React from "react";
import { IoReloadSharp } from "react-icons/io5";
import { MdDoneOutline } from "react-icons/md";
import { TbMessages } from "react-icons/tb";
import { useTranslations } from "next-intl";
import OrderCounter from "./gestion-des-ordres/OrderCounter";

const MyPortfolio = () => {
  const t = useTranslations("MyPortfolio");
  
  // Static mock data
  const validatedOrderCounter = 42;
  const nbMessages = 7;

  return (
    <div className="flex flex-row gap-2 justify-between">
      <Link
        href="/ordres"
        className="bg-white transition-all duration-300 rounded-xl flex-1 text-gray-900 flex gap-2 justify-start ltr:pl-4 rtl:pr-4 py-3 items-center border border-gray-200 shadow hover:shadow-md"
      >
        <div className="bg-white/20 p-[0.25vw] rounded-full flex justify-center items-center">
          <MdDoneOutline style={{ fontSize: '0.7vw' }} />
        </div>
        <div className="flex flex-row items-center justify-between w-full">
          <div className="text-[0.9vw]">{t("ordresExecute")}</div>
          <span className="text-[0.8vw] font-semibold flex flex-col justify-end pr-6">{validatedOrderCounter}</span>
        </div>
      </Link>
      <Link
        href="/ordres?state=1"
        className="bg-white transition-all duration-300 rounded-xl flex-1 text-gray-900 flex gap-2 justify-start ltr:pl-4 rtl:pr-4 py-3 items-center border border-gray-200 shadow hover:shadow-md"
      >
        <div className="bg-white/20 p-[0.25vw] rounded-full flex justify-center items-center">
          <IoReloadSharp style={{ fontSize: '0.7vw' }} />
        </div>
        <div className="flex flex-row items-center justify-between w-full">
          <div className="text-[0.9vw]">{t("ordresEnAttente")}</div>
          <span className="text-[0.8vw] font-semibold flex flex-col justify-end pr-6"><OrderCounter /></span>
        </div>
      </Link>
      <Link
        href="/serviceclients"
        className="bg-white transition-all duration-300 rounded-xl flex-1 text-gray-900 flex gap-2 justify-start ltr:pl-4 rtl:pr-4 py-3 items-center border border-gray-200 shadow hover:shadow-md"
      >
        <div className="bg-white/20 p-[0.25vw] rounded-full flex justify-center items-center">
          <TbMessages style={{ fontSize: '0.7vw' }} />
        </div>
        <div className="flex flex-row items-center justify-between w-full">
          <div className="text-[0.9vw]">{t("messages")}</div>
          <span className="text-[0.8vw] font-semibold flex flex-col justify-end pr-6">{nbMessages}</span>
        </div>
      </Link>
    </div>
  );
};

export default MyPortfolio;
