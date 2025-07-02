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
    <div className="flex flex-row gap-2 justify-between">
      <Link
        href="/ordres"
        className="bg-gray-200 transition-all duration-300 rounded flex-1 text-gray-900 flex gap-2 justify-start ltr:pl-4 rtl:pr-4 py-2.5 items-center border border-gray-200 shadow hover:shadow-md"
      >
        <div className="flex flex-row items-center justify-between w-full">
          <div className="text-[0.9vw]">Nouvelle Demande</div>
          <span className="text-[1vw] font-semibold flex flex-col justify-end pr-4">{validatedOrderCounter}</span>
        </div>
      </Link>
      <Link
        href="/ordres?state=1"
        className="bg-gray-200 transition-all duration-300 rounded flex-1 text-gray-900 flex gap-2 justify-start ltr:pl-4 rtl:pr-4 py-2.5 items-center border border-gray-200 shadow hover:shadow-md"
      >
        <div className="flex flex-row items-center justify-between w-full">
          <div className="text-[0.9vw]">Clients</div>
          <span className="text-[1vw] font-semibold flex flex-col justify-end pr-4"><OrderCounter /></span>
        </div>
      </Link>
      <Link
        href="/serviceclients"
        className="bg-gray-200 transition-all duration-300 rounded flex-1 text-gray-900 flex gap-2 justify-start ltr:pl-4 rtl:pr-4 py-2.5 items-center border border-gray-200 shadow hover:shadow-md"
      >
        <div className="flex flex-row items-center justify-between w-full">
          <div className="text-[0.9vw]">Message Clients</div>
          <span className="text-[1vw] font-semibold flex flex-col justify-end pr-4">{nbMessages}</span>
        </div>
      </Link>
    </div>
  );
};

export default NegotiatiorStats;
