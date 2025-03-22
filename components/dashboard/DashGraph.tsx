import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ShadLineChart } from "../ShadLineChart";
import { ShadAreaChart } from "../ShadAreaChart";
import { ShadBarChart } from "../ShadBarChart";
import { ShadDoubleLineChart } from "../ShadDoubleLineChart";
import { getServerSession } from "next-auth";
import auth from "@/auth";
import { getTranslations } from "next-intl/server";

const DashGraph = async () => {
  const session = await getServerSession(auth);
  const userRole = session?.user?.roleid;
  const t = await getTranslations("dashGraph");
  if (userRole === 1) {
    return (
      <Tabs defaultValue="Valeur">
        <div className="flex justify-between">
          <div className="font-semibold text-lg">
            <TabsContent value="Valeur">{t("evolutionValeur")}</TabsContent>
            <TabsContent value="Rendement">
              {t("evolutionRendement")}
            </TabsContent>
            <TabsContent value="Fluctuations">{t("fluctuations")}</TabsContent>
          </div>
          <TabsList>
            <TabsTrigger value="Valeur" className="text-xs">
              {t("evolutionValeurShort")}
            </TabsTrigger>
            <TabsTrigger value="Rendement" className="text-xs">
              {t("evolutionRendementShort")}
            </TabsTrigger>
            <TabsTrigger value="Fluctuations" className="text-xs">
              {t("fluctuationsShort")}
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="Valeur">
          <ShadLineChart />
        </TabsContent>
        <TabsContent value="Rendement">
          <ShadAreaChart />
        </TabsContent>
        <TabsContent value="Fluctuations">
          <ShadBarChart />
        </TabsContent>
      </Tabs>
    );
  } else {
    return (
      <Tabs defaultValue="Clients">
        <div className="flex justify-between">
          <div className="font-semibold text-lg">
            <TabsContent value="Clients">
              {t("evolutionNbClientsVsVisiteurs")}
            </TabsContent>
            <TabsContent value="Actifs">{t("EvolutionActifs")}</TabsContent>
          </div>
          <TabsList>
            <TabsTrigger value="Clients" className="text-xs">
              {t("evolutionNbClientsVsVisiteursShort")}
            </TabsTrigger>
            <TabsTrigger value="Actifs" className="text-xs">
              {t("EvolutionActifsShort")}
            </TabsTrigger>
          </TabsList>
        </div>
        <TabsContent value="Clients">
          <ShadDoubleLineChart />
        </TabsContent>
        <TabsContent value="Actifs">
          <ShadBarChart />
        </TabsContent>
      </Tabs>
    );
  }
};

export default DashGraph;
