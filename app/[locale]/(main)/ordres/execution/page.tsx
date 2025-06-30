"use client";

import MyMarquee from "@/components/MyMarquee";
import { useTranslations } from "next-intl";
import MyPagination from "@/components/navigation/MyPagination";
import TabSearch from "@/components/TabSearch";
import Link from "next/link"; 
import { CalendarClock } from "lucide-react";
import OrdresTable from "@/components/gestion-des-ordres/OrdresTable";
import { useSession } from "next-auth/react";
import { ExportButton } from "@/components/ExportButton";
import type { Order } from "@/lib/interfaces";
import PDFDropdownMenu from "@/components/gestion-des-ordres/PDFDropdownMenu";
import { mockOrders, filterOrdersByMarketType } from "@/lib/mockData";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";

// Helper function to determine if an order is from primary or secondary market
const isPrimaryMarketOrder = (securitytype: string) => {
  return [
    "empruntobligataire",
    "opv",
    "sukukmp",
    "titresparticipatifsmp",
  ].includes(securitytype);
};

const isSecondaryMarketOrder = (securitytype: string) => {
  return ["action", "obligation", "sukukms", "titresparticipatifsms"].includes(
    securitytype
  );
};

const sessionName = "Session 003"; 
const sessionDate = "01-06-2024"; 

const page = () => {
  const session = useSession();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams?.get("page")) || 0;
  const searchquery = searchParams?.get("searchquery") || "";
  const state = searchParams?.get("state") || "99";
  const marketType = searchParams?.get("marketType") || "all";
  const userRole = (session.data as any)?.user?.roleid;

  const t = useTranslations("mesOrdres");
  const tStatus = useTranslations("status");
  const [showActionColumn, setShowActionColumn] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  
  // Use mock data instead of GraphQL
  const data = mockOrders;

  // Filter data based on market type
  let filteredData = [...data];
  if (marketType === "primaire") {
    filteredData = filterOrdersByMarketType(data, "primaire");
  } else if (marketType === "secondaire") {
    filteredData = filterOrdersByMarketType(data, "secondaire");
  }

  const exportData = filteredData?.map((order) => ({
    id: order.id,
    ordertypes: order.orderdirection === 1 ? "Achat" : "Vente",
    direction: order.orderdirection === 1 ? "Achat" : "Vente",
    securityid: order.securityid,
    securitytype: order.securitytype,
    securityquantity: order.securityquantity,
    currentMarketPrice: order.securityquantity,
    quantity: order.quantity,
    pricelimitmin: order.mst || "N/A",
    pricelimitmax: order.mst || "N/A",
    duration: order.duration,
    orderdate: order.orderdate,
    orderstatus:
      order?.orderstatus === 0 && order?.payedWithCard
        ? "Brouillon payé"
        : order?.orderstatus === 0 && !order?.payedWithCard
        ? tStatus("Draft")
        : order?.orderstatus === 1
        ? tStatus("Pending")
        : order?.orderstatus === 2
        ? tStatus("In_Progress")
        : order?.orderstatus === 3
        ? tStatus("Validated")
        : order?.orderstatus === 4
        ? tStatus("Being_Processed")
        : order?.orderstatus === 5
        ? tStatus("Completed")
        : order?.orderstatus === 6
        ? tStatus("Awaiting_Approval")
        : order?.orderstatus === 7
        ? tStatus("Ongoing")
        : order?.orderstatus === 8
        ? tStatus("Partially_Validated")
        : order?.orderstatus === 9
        ? tStatus("Expired")
        : order?.orderstatus === 10
        ? tStatus("Rejected")
        : order?.orderstatus === 11
        ? tStatus("Cancelled")
        : "Unknown",
    investor: order.investorid,
    negotiator: order.negotiatorid,
    securityissuer: order.securityissuer,
    validity: order.validity,
    createdat: order.createdat,
  }));

  const handleActionToggle = () => {
    setShowActionColumn(!showActionColumn);
  };

  const handleActionConfirm = () => {
    setShowActionColumn(true);
    setIsConfirmDialogOpen(false);
  };

  return (
    <div className="motion-preset-focus motion-duration-2000">
      <div className="mt-3">
        <MyMarquee />
      </div>
      <div className="flex flex-col gap-1 mt-16 mb-8 ml-8">
        <div className="flex items-center justify-between w-full pr-8">
          <div className="text-3xl font-bold text-primary text-center md:ltr:text-left md:rtl:text-right">
            Carnet d'Ordres
          </div>
          <div className="text-lg font-semibold uppercase tracking-wide flex flex-col items-end text-primary bg-primary/10 px-6 py-2 rounded shadow-sm border border-primary/20 min-w-[180px]">
            <div className="flex items-center gap-2 w-full justify-center">
              <CalendarClock className="w-5 h-5 text-primary" />
              <span>{sessionName}</span>
            </div>
            <span className="text-xs text-gray-500 font-normal w-full flex justify-center text-center mt-1">{sessionDate}</span>
          </div>
        </div>
        <div className="text-xs text-gray-500 md:w-[50%] text-center md:ltr:text-left md:rtl:text-right">
          Gestion et suivi des ordres de bourse
        </div>
      </div>
      <div className="border border-gray-100 rounded-md p-4 mt-10">
        <div className="flex justify-between w-full gap-4">
          <div className="w-[30%]">
            <TabSearch />
          </div>
          <div className="flex gap-4 flex-shrink-0">
            <PDFDropdownMenu />
            <Link
              href="/ordres/sessions"
              className="py-2 px-4 bg-primary hover:bg-primary/90 text-white rounded-md shadow text-sm flex gap-2 items-center"
            >
              <CalendarClock size={20} />
              Sessions de Bourse
            </Link>
            <ExportButton data={exportData} />
          </div>
        </div>
        <div className="my-8">
          <OrdresTable
            searchquery={searchquery}
            skip={currentPage}
            state={state}
            marketType={marketType}
            pageType="orderExecution"
            userRole={userRole?.toString() || "1"}
            userType="iob"
            activeTab="all"
            showActionColumn={showActionColumn}
            onActionToggle={handleActionToggle}
          />
        </div>
        <div className="flex justify-between items-center">
          <MyPagination />
          <div className="flex justify-end">
            <Button
              className="py-2 px-4 bg-primary hover:bg-primary/90 text-white rounded-md shadow text-sm flex gap-2 items-center"
              onClick={() => setIsConfirmDialogOpen(true)}
            >
              Action
            </Button>
            <AlertDialog open={isConfirmDialogOpen} onOpenChange={setIsConfirmDialogOpen}>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Êtes-vous sûr de vouloir fermer la session ?</AlertDialogTitle>
                  <AlertDialogDescription>
                  Tout nouvel ordre sera redirigé vers la session suivante. 
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Annuler</AlertDialogCancel>
                  <AlertDialogAction onClick={handleActionConfirm}>Oui</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </div>
      </div>
    </div>
  );
};

export default page;
