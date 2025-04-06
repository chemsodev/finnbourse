import React from "react";
import { Card } from "../ui/card";
import { MdArrowOutward } from "react-icons/md";
import { useTranslations } from "next-intl";
import { Stock } from "@/lib/interfaces";
import { formatPrice } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import { getServerSession } from "next-auth";
import auth from "@/auth";

const StockCard = async ({
  stock,
  variation,
}: {
  stock: Stock;
  variation: string;
}) => {
  const t = useTranslations("StockCard");
  const session = await getServerSession(auth);
  const userRole = session?.user?.roleid;
  return (
    <Link
      href={
        userRole === 1
          ? `/passerunordre/marchesecondaire/action/${stock.id}`
          : `/passerunordre`
      }
    >
      <Card className="py-3 px-4 hover:scale-110 transition-transform duration-300 cursor-pointer">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-1">
            <div className="text-sm">{stock.issuer || "N/A"}</div>
            <div className="font-bold text-lg">
              {formatPrice(stock.facevalue || 0)} {t("dzd")}
            </div>
            <div
              className={`text-xs ${
                parseFloat(variation) > 0
                  ? "text-green-500"
                  : parseFloat(variation) < 0
                  ? "text-red-500"
                  : "text-gray-400"
              }`}
            >
              {variation} {t("fluct")}
            </div>
          </div>
          <div
            className={`${
              parseFloat(variation) > 0
                ? "bg-green-500"
                : parseFloat(variation) < 0
                ? "bg-red-500"
                : "bg-gray-400"
            }  w-10 h-10 rounded-md flex justify-center items-center`}
          >
            <MdArrowOutward
              className={`w-6 text-white transform ${
                parseFloat(variation) > 0
                  ? "rotate-0"
                  : parseFloat(variation) < 0
                  ? "rotate-180"
                  : "hidden"
              }`}
            />
            <div
              className={`w-10 text-white text-center font-bold ${
                parseFloat(variation) > 0
                  ? "hidden"
                  : parseFloat(variation) < 0
                  ? "hidden"
                  : "block"
              }`}
            >
              -
            </div>
          </div>
        </div>
      </Card>
    </Link>
  );
};

export default StockCard;
