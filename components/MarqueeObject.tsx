import { Link } from "@/i18n/routing";
import { Stock } from "@/lib/interfaces";
import { formatPrice } from "@/lib/utils";
import React from "react";
import { TiArrowSortedUp } from "react-icons/ti";

const MarqueeObject = ({
  stock,
  variation,
}: {
  stock: Stock;
  variation: string;
}) => {
  return (
    <Link
      href="/passerunordre/marchesecondaire/action"
      className="flex items-center mx-10"
    >
      <div>
        <div className="flex font-bold text-xl gap-2">
          <div className="uppercase">{stock.code || "N/A"}</div>
          <div>{formatPrice(stock.facevalue || 0)}</div>
        </div>
        <div className="text-yellow-500 text-xs text-right">{variation}</div>
      </div>
      <TiArrowSortedUp
        size={30}
        className={`${
          parseFloat(variation) > 0
            ? "text-green-500"
            : parseFloat(variation) < 0
            ? "text-red-500 rotate-180"
            : "text-white ltr:rotate-90 rtl:-rotate-90"
        }`}
      />
    </Link>
  );
};

export default MarqueeObject;
