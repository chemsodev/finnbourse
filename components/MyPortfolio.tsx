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
    <div className="h-full min-h-[400px] w-full flex flex-col flex-1">
      <h2 className="text-[1vw] font-semibold mb-3">{t("etatsDesOrdres")}</h2>
      <div className="flex flex-col gap-[1vw] justify-between flex-1">
        <div className="flex flex-col bg-primary rounded p-4 text-white  items-start justify-between w-full">
          <div className="flex flex-row items-center">
            <span className="w-3 h-3 rounded-full bg-green-400 mr-2"></span>
            <div className="text-[1vw]">{t("status.pending")}</div>
          </div>
          <span className="text-[1vw] font-semibold ml-6 p-[0.2vw]">
            {validatedOrderCounter}
          </span>
        </div>
        <div className="flex flex-col bg-primary rounded p-4 text-white items-start justify-between w-full">
          <div className="flex flex-row items-center">
            <span className="w-3 h-3 rounded-full bg-purple-400 mr-2"></span>
            <div className="text-[1vw]">{t("status.operated")}</div>
          </div>
          <span className="text-[1vw] font-semibold ml-6 p-[0.2vw]">
            {nbMessages}
          </span>
        </div>
        <div className="flex flex-col bg-primary rounded p-4 text-white items-start justify-between w-full">
          <div className="flex flex-row items-center">
            <span className="w-3 h-3 rounded-full bg-blue-400 mr-2"></span>
            <div className="text-[1vw]">{t("status.executed")}</div>
          </div>
          <span className="text-[1vw] font-semibold ml-6 p-[0.2vw]">
            <OrderCounter />
          </span>
        </div>
        <div className="flex flex-col bg-primary rounded p-4 text-white items-start justify-between w-full">
          <div className="flex flex-row items-center">
            <span className="w-3 h-3 rounded-full bg-orange-400 mr-2"></span>
            <div className="text-[1vw]">{t("status.nonExecuted")}</div>
          </div>
          <span className="text-[1vw] font-semibold ml-6 p-[0.2vw]">
            {nbMessages}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MyPortfolio;
