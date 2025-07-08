import { getTranslations } from "next-intl/server";
import { getServerSession } from "next-auth/next";
import auth from "@/auth";
import MyMarquee from "@/components/MyMarquee";
import OrderManagementNav from "@/components/gestion-des-ordres/OrderManagementNav";
import OrdresTableREST from "@/components/gestion-des-ordres/OrdresTableREST";
import Link from "next/link";
import { ArrowLeft, CalendarClock, CheckCircle, MessageSquare, Filter, Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import TabSearch from "@/components/TabSearch";
import MyPagination from "@/components/navigation/MyPagination";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ExportButton } from "@/components/ExportButton";
import PDFDropdownMenu from "@/components/gestion-des-ordres/PDFDropdownMenu";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export default async function validationRetourFinalePage({
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
    <div className="min-h-screen">
      {/* Header with Marquee */}
      <div className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-200/50">
        <div className="">
          <MyMarquee />
        </div>
      </div>

      {/* Main Content */}
      <div className="mt-16">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                  <span>
                    Validation du Retour
                  </span>
                  {activeTab === "souscriptions" && (
                    <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
                      {tOrders("marcheprimaire")}
                    </Badge>
                  )}
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
            Validez les retours des ordres et consultez les détails des réponses reçues
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
                taskID="validation-retour-finale"
                marketType={activeTab === "souscriptions" ? "P" : marketType}
                pageType="validationRetourFinale"
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