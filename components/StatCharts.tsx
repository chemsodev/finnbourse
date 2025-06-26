import { getTranslations } from "next-intl/server";
import React from "react";
import StaticGraphPerfPortefeille from "./statistics-charts/StaticGraphPerfPortefeille";
import StaticGraphHistoriqueOrdres from "./statistics-charts/StaticGraphHistoriqueOrdres";
import StaticGraphVueEnsembleTransactions from "./statistics-charts/StaticGraphVueEnsembleTransactions";
import StaticGraphPerfNegociateurs from "./statistics-charts/StaticGraphPerfNegociateurs";
import StaticGraphPerfPlat from "./statistics-charts/StaticGraphPerfPlat";

const StatCharts = async () => {
  const t = await getTranslations("StatCharts");
  return (
    <div className="mx-10 my-4">
      <div className="space-y-8">
        <div className="flex justify-between gap-16">
          <StaticGraphPerfPortefeille />
          <StaticGraphHistoriqueOrdres />
        </div>
        <div className="flex justify-between gap-16">
          <StaticGraphVueEnsembleTransactions />
          <StaticGraphPerfPlat />
        </div>
        <div className="flex justify-between gap-16">
          <StaticGraphPerfNegociateurs />
          <StaticGraphVueEnsembleTransactions />
        </div>
      </div>
    </div>
  );
};

export default StatCharts;
