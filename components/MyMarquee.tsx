import React from "react";
import Marquee from "react-fast-marquee";
import { TiArrowSortedUp } from "react-icons/ti";
import MarqueeObject from "./MarqueeObject";
import { LIST_STOCKS_SIMPLE_QUERY } from "@/graphql/queries";
import { Stock } from "@/lib/interfaces";
import { fetchGraphQL } from "@/app/actions/fetchGraphQL";
import { calculateVariation } from "@/lib/utils";

const MyMarquee = async () => {
  const data = await fetchGraphQL<{ listStocks: Stock[] }>(
    LIST_STOCKS_SIMPLE_QUERY,
    { type: "action" }
  );

  const stocksWithVariation = data.listStocks.map((stock: any) => {
    const marketMetadata = stock.marketmetadata;
    let variation = "0.00%";
    if (
      typeof marketMetadata === "object" &&
      marketMetadata !== null &&
      Array.isArray(marketMetadata.cours) &&
      marketMetadata.cours.length >= 2
    ) {
      variation = calculateVariation(marketMetadata.cours);
    }
    return { ...stock, variation };
  });

  return (
    <Marquee
      pauseOnHover
      className="bg-primary text-white rounded-md py-2 px-4"
    >
      {stocksWithVariation.map((stock) => (
        <MarqueeObject
          key={stock.id}
          stock={stock}
          variation={stock.variation}
        />
      ))}
    </Marquee>
  );
};

export default MyMarquee;
