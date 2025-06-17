import { getTranslations } from "next-intl/server";
import React from "react";
import { GraphPerfPortefeille } from "./statistics-charts/GraphPerfPortefeille";
import { GraphHistoriqueOrdres } from "./statistics-charts/GraphHistoriqueOrdres";
import { HistoriqueExecutionOrdre } from "./HistoriqueExecutionOrdre";
import { GraphVueEnsembleTransactions } from "./statistics-charts/GraphVueEnsembleTransactions";
import { GraphPerfNegociateurs } from "./statistics-charts/GraphPerfNegociateurs";

const StatCharts = async () => {
  const t = await getTranslations("StatCharts");
  return (
    <div className="mx-10 my-4">
      <div className="space-y-8">
        <div className="flex justify-between gap-16">
          <GraphPerfPortefeille titre={t("perfPortefeille")} />
          <GraphHistoriqueOrdres titre={t("HistoriqueOrdres")} />
        </div>
        <div className="flex justify-between gap-16">
          <HistoriqueExecutionOrdre titre={t("HistoriqueExecutionOrdre")} />
          <GraphVueEnsembleTransactions titre={t("VueEnsembleTransactions")} />
        </div>
        <div className="flex justify-between gap-16">
          <GraphPerfPortefeille titre={t("perfPlat")} />
          <GraphPerfNegociateurs titre={t("perNeg")} />
        </div>
      </div>
    </div>
  );
};

export default StatCharts;
