import { getTranslations } from "next-intl/server";
import OrdresTableREST from "@/components/gestion-des-ordres/OrdresTableREST";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import TabSearch from "@/components/TabSearch";
import MyPagination from "@/components/navigation/MyPagination";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default async function TCCFinalValidationPage({
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

  const t = await getTranslations("orderManagement");
  const tOrders = await getTranslations("mesOrdres");

  return (
    <div className="min-h-screen">
      {/* Main Content */}
      <div className="mt-16">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <span>Validation TCC Finale</span>
                </h1>
              </div>
            </div>

            <Link href="/ordres/validation-tcc-premiere">
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

          <p className="text-gray-600 text-sm leading-relaxed max-w-3xl">
            {t("tccFinalValidationDescription")}
          </p>
        </div>

        {/* Main Content Card */}
        <Card className="border-0 overflow-hidden bg-white">
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-initial">
                  <TabSearch />
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
              <OrdresTableREST
                key={`orders-table-${activeTab}-${marketType}-${state}-${currentPage}`}
                searchquery={searchquery}
                taskID="validation-tcc-finale"
                marketType={marketType}
                pageType="tccFinalValidation"
                activeTab={activeTab}
                searchqueryParam={searchquery}
                stateParam={state}
              />
            </div>

            <div className="flex justify-end mt-8 pt-6 border-t border-gray-100">
              <MyPagination preserveParams={["tab", "marketType", "state"]} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
