"use client";

import React, { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import MarqueeObject from "./MarqueeObject";
import { LIST_STOCKS_SIMPLE_QUERY } from "@/graphql/queries";
import { Stock } from "@/lib/interfaces";
import { fetchGraphQLClient } from "@/app/actions/clientGraphQL";
import { calculateVariation } from "@/lib/utils";

const MyMarquee = () => {
  const [stocksWithVariation, setStocksWithVariation] = useState<
    Array<Stock & { variation: string }>
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchGraphQLClient<{ listStocks: Stock[] }>(LIST_STOCKS_SIMPLE_QUERY, {
      type: "action",
    })
      .then((data) => {
        const stocks = data.listStocks?.map((stock: any) => {
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

        setStocksWithVariation(stocks);
      })
      .catch((error) => {
        console.error("Error fetching stocks:", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="bg-primary text-white rounded-md py-2 px-4">
        Loading stocks...
      </div>
    );
  }

  return (
    <Marquee
      pauseOnHover
      className="bg-primary text-white rounded-md py-2 px-4"
    >
      {stocksWithVariation?.map((stock) => (
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
