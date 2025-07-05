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

export default async function PremiereValidationPage({
  searchParams,
}: {
  searchParams?: {
    searchquery?: string;
    page?: string;
    state?: string;
    marketType?: string;
    tab?: string;
    action?: string;
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
  const activeAction = searchParams?.action || "validation";

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
                    {activeAction === "validation" ? "Premier validation" : "Réponse"}
                  </span>
                  <span>
                    {activeTab === "souscriptions"
                      ? tOrders("souscriptions")
                      : "Carnet d'ordres"}
                  </span>
                </h1>
                
                {activeTab === "souscriptions" && (
                  <Badge variant="secondary" className="mt-2 bg-primary/10 text-primary border-primary/20">
                    {tOrders("marcheprimaire")}
                  </Badge>
                )}
              </div>
            </div>

                          <div className="flex items-center gap-2">
                {/* Action Tabs */}
                <Button
                  variant={activeAction === "validation" ? "default" : "outline"}
                  size="sm"
                  asChild
                  className="flex items-center gap-2"
                >
                  <Link
                    href={`/ordres/premiere-validation?${new URLSearchParams({
                      searchquery: searchquery || "",
                      page: "0",
                      action: "validation",
                      tab: activeTab,
                      state: state || "99",
                      marketType: activeTab === "souscriptions" ? "P" : "S",
                    }).toString()}`}
                  >
                    <CheckCircle className="w-4 h-4" />
                    Validation
                  </Link>
                </Button>
                <Button
                  variant={activeAction === "reponse" ? "default" : "outline"}
                  size="sm"
                  asChild
                  className="flex items-center gap-2"
                >
                  <Link
                    href={`/ordres/premiere-validation?${new URLSearchParams({
                      searchquery: searchquery || "",
                      page: "0",
                      action: "reponse",
                      tab: activeTab,
                      state: state || "99",
                      marketType: activeTab === "souscriptions" ? "P" : "S",
                    }).toString()}`}
                  >
                    <MessageSquare className="w-4 h-4" />
                    Réponse
                  </Link>
                </Button>
              </div>
          </div>

          <p className="text-gray-600 text-sm leading-relaxed max-w-3xl">
            {activeAction === "validation" 
              ? t("firstValidationDescription")
              : "Gestion des réponses aux ordres et suivi des interactions"}
          </p>
        </div>

        {/* Main Content Card */}
        <Card className={`border-0 overflow-hidden ${
          activeTab === "souscriptions"
            ? "bg-gradient-to-br from-primary/5 via-white to-primary/5 border-primary/20"
            : "bg-white"
        }`}>
          <CardHeader className="pb-4">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex items-center gap-4 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-initial">
                  <TabSearch />
                </div>
              </div>

              <div className="flex items-center gap-3">
                <PDFDropdownMenu
                  customTitle={
                    `${activeAction === "validation" ? "Validation" : "Réponse"} - ${
                      activeTab === "souscriptions"
                        ? tOrders("souscriptions")
                        : "Carnet d'ordres"
                    }`
                  }
                />
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-0">
            <div className="bg-white rounded-lg border border-gray-100 overflow-hidden">
              <OrdresTableREST
                key={`orders-table-${activeAction}-${activeTab}-${marketType}-${state}-${currentPage}`}
                searchquery={searchquery}
                taskID={activeAction === "validation" ? "premiere-validation" : "reponse"}
                marketType={activeTab === "souscriptions" ? "P" : marketType}
                pageType={activeAction === "validation" ? "firstValidation" : "reponse"}
                activeTab={activeTab}
                activeAction={activeAction}
                searchqueryParam={searchquery}
                stateParam={state}
              />
            </div>

            <div className="flex justify-end mt-8 pt-6 border-t border-gray-100">
              <MyPagination preserveParams={["tab", "action", "marketType", "state"]} />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
