"use client";

import MyMarquee from "@/components/MyMarquee";
import { useTranslations } from "next-intl";
import MyPagination from "@/components/navigation/MyPagination";
import TabSearch from "@/components/TabSearch";
import Link from "next/link"; 
import { CalendarClock, RefreshCw } from "lucide-react";
import OrdresTable from "@/components/gestion-des-ordres/OrdresTable";
import { useSession } from "next-auth/react";

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
  return ["action", "obligation", "sukukms", "titresparticipatif"].includes(
    securitytype
  );
};

const sessionName = "Session 002"; 
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



  const handleActionToggle = () => {
    setShowActionColumn(!showActionColumn);
  };

  const handleActionConfirm = () => {
    setShowActionColumn(true);
    setIsConfirmDialogOpen(false);
    console.log('Action confirmée : OK cliqué dans le popup de confirmation');
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
      {/* Zone de recherche et actions globales */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6 px-2">
        <div className="">
          <TabSearch />
        </div>
        <div className="flex gap-4 flex-shrink-0 items-center">
          <PDFDropdownMenu />
        </div>
      </div>

      <div className="border border-gray-100 rounded-md p-4 mt-4">
        {/* Tabs et refresh dans le box */}
        <div className="flex flex-wrap gap-2 mb-6 items-center justify-between">
          <div className="flex">
            <Button
              variant={marketType === "all" || marketType === "secondaire" ? "default" : "outline"}
              size="sm"
              className="rounded-r-none"
              onClick={() => {
                const params = new URLSearchParams(searchParams);
                params.set("marketType", "secondaire");
                params.set("page", "0");
                window.location.search = params.toString();
              }}
            >
              Carnet d'ordres
            </Button>
            <Button
              variant={marketType === "primaire" ? "default" : "outline"}
              size="sm"
              className="rounded-l-none"
              onClick={() => {
                const params = new URLSearchParams(searchParams);
                params.set("marketType", "primaire");
                params.set("page", "0");
                window.location.search = params.toString();
              }}
            >
              Souscriptions
            </Button>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
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
            showResponseButton={true}
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
