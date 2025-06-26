"use client";

import React from "react";
import StockCard from "./dashboard/StockCard";
import { mockStocks } from "@/lib/staticData";
import { calculateVariation } from "@/lib/utils";

const MyPortfolio = () => {
  // Use static mock data instead of GraphQL
  const data = { listStocks: mockStocks.slice(0, 4) };

  const stocksWithVariation = data?.listStocks?.map((stock: any) => {
    const marketMetadata = stock.marketmetadata;
    let variation = "0.00%";
    if (
      typeof marketMetadata === "object" &&
      marketMetadata !== null &&
      Array.isArray(marketMetadata.cours) &&
      marketMetadata.cours.length >= 2
    ) {
      variation = calculateVariation(marketMetadata.cours);
    } else {
      // Generate random variation for demo purposes
      const randomVariation = (Math.random() - 0.5) * 10;
      variation = `${randomVariation > 0 ? "+" : ""}${randomVariation.toFixed(
        2
      )}%`;
    }
    return { ...stock, variation };
  });

  return (
    <div className="flex flex-col md:grid md:grid-cols-2 gap-4 ">
      {stocksWithVariation?.map((stock) => (
        <StockCard key={stock.id} stock={stock} variation={stock.variation} />
      ))}
    </div>
  );
};

export default MyPortfolio;
