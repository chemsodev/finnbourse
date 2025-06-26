"use client";

import React from "react";
import { Card } from "../ui/card";
import { MdArrowOutward } from "react-icons/md";
import { useTranslations } from "next-intl";
import { Stock } from "@/lib/interfaces";
import { formatPrice } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import { useSession } from "next-auth/react";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";

const StockCard = ({
  stock,
  variation,
}: {
  stock: Stock;
  variation: string;
}) => {
  const t = useTranslations("StockCard");
  const { data: session } = useSession();
  const userRole = (session?.user as any)?.roleid;
  
  const isPositive = parseFloat(variation) > 0;
  const isNegative = parseFloat(variation) < 0;
  const isNeutral = parseFloat(variation) === 0;

  return (
    <Link
      href={
        userRole === 1
          ? `/passerunordre/marchesecondaire/action/${stock.id}`
          : `/passerunordre`
      }
    >
      <Card className="p-6 transition-all duration-300 cursor-pointer shadow-md rounded-xl border-0 bg-gradient-to-br from-white to-slate-50">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-3">
            <div className="text-sm font-medium text-slate-600">
              {stock.issuer || "N/A"}
            </div>
            <div className="font-bold text-2xl text-primary">
              {formatPrice(stock.facevalue || 0)} {t("dzd")}
            </div>
            <div
              className={`text-sm font-medium ${
                isPositive
                  ? "text-green-600"
                  : isNegative
                  ? "text-red-600"
                  : "text-slate-500"
              }`}
            >
              {variation} {t("fluct")}
            </div>
          </div>
          <div
            className={`w-12 h-12 rounded-xl flex justify-center items-center shadow-sm ${
              isPositive
                ? "bg-green-100 text-green-600"
                : isNegative
                ? "bg-red-100 text-red-600"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            {isPositive ? (
              <TrendingUp className="w-6 h-6" />
            ) : isNegative ? (
              <TrendingDown className="w-6 h-6" />
            ) : (
              <Minus className="w-6 h-6" />
            )}
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default StockCard;
