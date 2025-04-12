"use client";
import { Link } from "@/i18n/routing";
import React, { useEffect, useState } from "react";
import { IoReloadSharp } from "react-icons/io5";
import { MdDoneOutline } from "react-icons/md";
import { TbMessages } from "react-icons/tb";
import { useTranslations } from "next-intl";
import OrderCounter from "./gestion-des-ordres/OrderCounter";
import { useSession } from "next-auth/react";
import { fetchGraphQL } from "@/app/actions/fetchGraphQL";
import {
  COUNT_UNOPENED_MESSAGES_QUERY,
  COUNT_VALIDATED_ORDERS_QUERY,
} from "@/graphql/queries";
import { startOfWeek, endOfWeek } from "date-fns";
import RateLimitReached from "./RateLimitReached";

const NegotiatiorStats = () => {
  const t = useTranslations("NegotiatiorStats");
  const session = useSession();
  const userId = session?.data?.user?.id;
  const [nbMessages, setNbMessages] = useState(0);
  const userRole = session?.data?.user?.roleid || "";
  const currentWeekStart = startOfWeek(new Date(), { weekStartsOn: 1 });
  const currentWeekEnd = endOfWeek(new Date(), { weekStartsOn: 1 });
  const variables =
    userRole === 2
      ? {
          negotiatorid: userId,
          startOfWeek: currentWeekStart.toISOString(),
          endOfWeek: currentWeekEnd.toISOString(),
        }
      : {
          startOfWeek: currentWeekStart.toISOString(),
          endOfWeek: currentWeekEnd.toISOString(),
        };
  const [validatedOrderCounter, setValidatedOrderCounter] = useState(0);

  const countValidatedOrders = async () => {
    try {
      const response = await fetchGraphQL<any>(COUNT_VALIDATED_ORDERS_QUERY, {
        variables,
      });

      setValidatedOrderCounter(response.aggregateOrder._count._all);
    } catch (error) {
      if (error === "Too many requests") {
        return <RateLimitReached />;
      }
      console.error("Error fetching orders:", error);
    }
  };
  const countMessages = async () => {
    try {
      const response = await fetchGraphQL<any>(COUNT_UNOPENED_MESSAGES_QUERY);
      setNbMessages(response.aggregateSupportqa._count._all);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    countMessages();
  }, [userId]);
  return (
    <div className="flex flex-col gap-6 h-full justify-between">
      <Link
        href="/carnetordres"
        className="bg-primary hover:scale-105 transition-all duration-300 rounded-md h-full w-full text-white flex gap-6 justify-start ltr:pl-6 rtl:pr-6 py-4 items-center"
      >
        <div className="bg-white/20 w-16 h-16 rounded-full flex justify-center items-center">
          <MdDoneOutline size={30} />
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-xl ">{t("ordresExecute")}</div>
          <div className="text-2xl font-semibold">
            {validatedOrderCounter || 0}
          </div>
        </div>
      </Link>
      <Link
        href="/carnetordres?state=1"
        className="bg-primary hover:scale-105 transition-all duration-300 rounded-md h-full w-full text-white flex gap-6 justify-start ltr:pl-6 rtl:pr-6 py-4 items-center"
      >
        <div className="bg-white/20 w-16 h-16 rounded-full flex justify-center items-center">
          <IoReloadSharp size={30} />
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-xl">{t("ordresEnAttente")}</div>
          <div className="text-2xl font-semibold">
            <OrderCounter />
          </div>
        </div>
      </Link>
      <Link
        href="/serviceclients"
        className="bg-primary hover:scale-105 transition-all duration-300 rounded-md h-full w-full text-white flex gap-6 justify-start ltr:pl-6 rtl:pr-6 py-4 items-center"
      >
        <div className="bg-white/20 w-16 h-16 rounded-full flex justify-center items-center">
          <TbMessages size={30} />
        </div>
        <div className="flex flex-col gap-1">
          <div className="text-xl">{t("messages")}</div>
          <div className="text-2xl font-semibold">{nbMessages || 0}</div>
        </div>
      </Link>
    </div>
  );
};

export default NegotiatiorStats;
