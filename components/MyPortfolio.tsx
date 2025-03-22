import React from "react";
import StockCard from "./StockCard";
import { Stock } from "@/lib/interfaces";
import { LIST_STOCKS_SIMPLE_QUERY } from "@/graphql/queries";
import { fetchGraphQL } from "@/app/actions/fetchGraphQL";
import { calculateVariation } from "@/lib/utils";

const MyPortfolio = async () => {
  const data = await fetchGraphQL<{ listStocks: Stock[] }>(
    LIST_STOCKS_SIMPLE_QUERY,
    {
      take: 4,
      type: "action",
    }
  );

  const stocksWithVariation = data?.listStocks.map((stock: any) => {
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
    <div className="flex flex-col md:grid md:grid-cols-2 gap-4 ">
      {stocksWithVariation.map((stock) => (
        <StockCard key={stock.id} stock={stock} variation={stock.variation} />
      ))}
    </div>
  );
};

export default MyPortfolio;
