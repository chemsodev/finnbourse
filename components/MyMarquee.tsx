"use client";

import React, { useEffect, useState } from "react";
import Marquee from "react-fast-marquee";
import MarqueeObject from "./MarqueeObject";
import { mockStocks } from "@/lib/staticData";
import { Stock } from "@/lib/interfaces";

const MyMarquee = () => {
  const [stocksWithVariation, setStocksWithVariation] = useState<
    Array<Stock & { variation: string }>
  >([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    // Use static mock data instead of GraphQL
    const stocksWithVar = mockStocks.map((stock: any) => {
      // Calculate mock variation
      const lastPrice = stock.marketmetadata?.cours?.[0] || stock.price;
      const prevPrice = stock.marketmetadata?.cours?.[1] || stock.price * 0.98;
      const variation = (((lastPrice - prevPrice) / prevPrice) * 100).toFixed(
        2
      );

      return {
        ...stock,
        variation: `${variation}%`,
      };
    });

    setStocksWithVariation(stocksWithVar);
    setLoading(false);
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
