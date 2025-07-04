import { getTranslations } from "next-intl/server";
import { getServerSession } from "next-auth/next";
import auth from "@/auth";
import MyMarquee from "@/components/MyMarquee";
import OrderManagementNav from "@/components/gestion-des-ordres/OrderManagementNav";
import OrdresTableREST from "@/components/gestion-des-ordres/OrdresTableREST";
import Link from "next/link";
import { ArrowLeft, CalendarClock } from "lucide-react";
import { Button } from "@/components/ui/button";
import TabSearch from "@/components/TabSearch";
import MyPagination from "@/components/navigation/MyPagination";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExportButton } from "@/components/ExportButton";
import PDFDropdownMenu from "@/components/gestion-des-ordres/PDFDropdownMenu";

export default async function ResultsSubmissionPage({
  searchParams,
}: {
  searchParams?: {
    searchquery?: string;
    page?: string;
    state?: string;
    marketType?: string;
    tab?: string;
  };
}) {
  const session = await getServerSession(auth);
  const userRole = (session as any)?.user?.roleid;
  const userType = (session as any)?.user?.type;

  const currentPage = Number(searchParams?.page) || 0;
  const searchquery = searchParams?.searchquery || "";
  const state = searchParams?.state || "99";
  const marketType = searchParams?.marketType || "S";
  const activeTab = searchParams?.tab || "all";

  const t = await getTranslations("orderManagement");
  const tOrders = await getTranslations("mesOrdres");

  return (
    <div className="motion-preset-focus motion-duration-2000">
      <div className="mt-3">
        <MyMarquee />
      </div>

      <div className="flex gap-8 mt-16">
        {/* Main content */}
        <div className="flex-1">
          {/* Tabs at the top */}
          <div className="mb-2">
            <Tabs value={activeTab} className="w-auto">
              <TabsList className="bg-gray-100/70 p-1 flex gap-2">
                <TabsTrigger
                  value="all"
                  className={`${
                    activeTab === "all"
                      ? "bg-white/90 font-medium shadow-sm"
                      : "hover:bg-gray-200/80"
                  } transition-all duration-200`}
                >
                  <Link
                    href={`/ordres/resultats?${new URLSearchParams({
                      searchquery: searchquery || "",
                      page: "0",
                      tab: "all",
                      state: state || "99",
                      marketType: "S",
                    }).toString()}`}
                    className="w-full h-full flex items-center justify-center"
                  >
                    {"Carnet d'ordres"}
                  </Link>
                </TabsTrigger>
                <TabsTrigger
                  value="souscriptions"
                  className={`${
                    activeTab === "souscriptions"
                      ? "bg-white/90 font-medium shadow-sm"
                      : "hover:bg-gray-200/80"
                  } transition-all duration-200`}
                >
                  <Link
                    href={`/ordres/resultats?${new URLSearchParams({
                      searchquery: searchquery || "",
                      page: "0",
                      tab: "souscriptions",
                      state: state || "99",
                      marketType: "P",
                    }).toString()}`}
                    className="w-full h-full flex items-center justify-center"
                  >
                    {tOrders("souscriptions")}
                  </Link>
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          <div className="flex flex-col gap-1 mb-8">
            <div className="text-2xl font-bold text-primary flex items-center justify-between">
              <div>
                {activeTab === "souscriptions"
                  ? tOrders("souscriptions")
                  : t("resultsSubmission")}

                {activeTab === "souscriptions" && (
                  <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-primary/20 text-primary">
                    {tOrders("marcheprimaire")}
                  </span>
                )}
              </div>

              <Link href="/ordres/execution">
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
              </Link>
            </div>

            <p className="text-gray-500 mt-2 mb-6">
              {t("resultsSubmissionDescription")}
            </p>
          </div>

          <div
            className={`border ${
              activeTab === "souscriptions"
                ? "border-primary/20 bg-primary/5"
                : "border-gray-100"
            } rounded-md p-4 transition-colors duration-300`}
          >
            <div className="flex justify-between w-full">
              <div className="flex flex-col sm:flex-row gap-4 items-center">
                <TabSearch />
              </div>

              <div className="flex gap-4">
                <PDFDropdownMenu
                  customTitle={
                    activeTab === "souscriptions"
                      ? tOrders("souscriptions")
                      : t("resultsSubmission")
                  }
                />

                <ExportButton
                  data={[]}
                  customTitle={
                    activeTab === "souscriptions"
                      ? tOrders("souscriptions")
                      : tOrders("ordres")
                  }
                />
              </div>
            </div>

            <div className="my-8">
              <OrdresTableREST
                key={`orders-table-${activeTab}-${marketType}-${state}-${currentPage}`}
                searchquery={searchquery}
                taskID="resultats"
                marketType={activeTab === "souscriptions" ? "P" : marketType}
                pageType="submitResults"
              />
            </div>

            <div className="flex justify-end">
              <MyPagination preserveParams={["tab", "marketType", "state"]} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
