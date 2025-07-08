import { getTranslations } from "next-intl/server";
import MyMarquee from "@/components/MyMarquee";
import Link from "next/link";
import TabSearch from "@/components/TabSearch";
import MyPagination from "@/components/navigation/MyPagination";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExportButton } from "@/components/ExportButton";
import PDFDropdownMenu from "@/components/gestion-des-ordres/PDFDropdownMenu";
import OrdresTableHistory from "@/components/order-history/OrdresTableHistory";

export default async function OrdersHistoryPage({
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
  const currentPage = Number(searchParams?.page) || 0;
  const searchquery = searchParams?.searchquery || "";
  const state = searchParams?.state || "99";
  const marketType = searchParams?.marketType || "S";
  const activeTab = searchParams?.tab || "all";

  const t = await getTranslations("orderHistory");

  return (
    <div className="motion-preset-focus motion-duration-2000">
      <div className="mt-3">
        <MyMarquee />
      </div>

      <div className="flex gap-8 mt-16">
        {/* Main content */}
        <div className="flex-1">

          <div className="flex flex-col gap-1 mb-8">
            <div className="text-2xl font-bold text-primary flex items-center justify-between">
              <div>
                {activeTab === "souscriptions"
                  ? t("subscriptionsHistory")
                  : t("orderHistory")}

                {activeTab === "souscriptions" && (
                  <span className="ml-3 inline-flex items-center px-2.5 py-0.5 rounded-md text-sm font-medium bg-primary/20 text-primary">
                    {t("primaryMarket")}
                  </span>
                )}
              </div>
            </div>

            <p className="text-gray-500 mt-2 mb-6">
              {t("orderHistoryDescription")}
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

              {/*<div className="flex gap-4">
                <PDFDropdownMenu
                  customTitle={
                    activeTab === "souscriptions"
                      ? t("subscriptionsHistory")
                      : t("orderHistory")
                  }
                />
              </div>*/}
            </div>

            <div className="my-8">
              <OrdresTableHistory
                key={`orders-history-${activeTab}-${marketType}-${state}-${currentPage}`}
                searchquery={searchquery}
                taskID="historique-des-ordres"
                marketType={activeTab === "souscriptions" ? "P" : marketType}
                pageType="orderHistory"
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
