"use client";

import { useTranslations } from "next-intl";
import MyPagination from "@/components/navigation/MyPagination";
import TabSearch from "@/components/TabSearch";
import { CalendarClock, RefreshCw, Printer } from "lucide-react";
import OrdresTable from "@/components/gestion-des-ordres/OrdresTable";
import OrdresTableREST from "@/components/gestion-des-ordres/OrdresTableREST";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";
import { format } from "date-fns";
import PDFDropdownMenu from "@/components/gestion-des-ordres/PDFDropdownMenu";
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

// First, update the session card to change color based on session status
const getSessionCardStyle = (isClosed: boolean) => {
  return isClosed
    ? "bg-gray-100 text-gray-700 border-gray-300"
    : "bg-primary/10 text-primary border-primary/20";
};

interface SessionData {
  id: number;
  session_code: string;
  session_date: string;
  session_status: string;
  session_closed: boolean;
  can_download: boolean;
}

interface OrderData {
  id: number;
  stock_id: string;
  client_id: string;
  status: string;
  quantity: number;
  price: number;
  market_type: string;
  operation_type: string;
  time_condition: string;
  price_condition: string;
  quantitative_condition: string;
  minQuantity: number;
  validity: string | null;
  souscripteur: {
    qualite_souscripteur: string;
    nom_prenom: string;
    adresse: string;
    wilaya: string;
    date_naissance: string;
    num_cni_pc: string;
    nationalite: string;
  };
  created_by: string;
}

interface SessionResponse {
  error: string | null;
  data: {
    session: SessionData;
    orders: {
      [key: string]: {
        data: OrderData;
        actions?: string;
      };
    };
  };
}

const ExecutionPage = () => {
  const session = useSession();
  const { toast } = useToast();
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams?.get("page")) || 0;
  const searchquery = searchParams?.get("searchquery") || "";
  const state = searchParams?.get("state") || "99";
  const marketType = searchParams?.get("marketType") || "all";
  const userRole = (session.data as any)?.user?.roleid;

  const t = useTranslations("mesOrdres");
  const tStatus = useTranslations("status");

  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [loading, setLoading] = useState(true);
  const [showActionColumn, setShowActionColumn] = useState(false);
  const [isConfirmDialogOpen, setIsConfirmDialogOpen] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [isPrinting, setIsPrinting] = useState(false);

  // Handler for toggling action column
  const handleActionToggle = () => {
    setShowActionColumn(!showActionColumn);
  };

  // Fetch session data
  useEffect(() => {
    const fetchSessionData = async () => {
      try {
        setLoading(true);
        const restToken = (session.data?.user as any)?.restToken;

        if (!restToken) {
          toast({
            title: "Error",
            description: "No authentication token available",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        // Get API base URL from environment variables
        const BACKEND_API =
          (process.env.NEXT_PUBLIC_MENU_ORDER || "https://poc.finnetude.com") +
          "/api/v1";

        const response = await fetch(`${BACKEND_API}/session/fetch`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${restToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Error ${response.status}: ${response.statusText}`);
        }

        const data: SessionResponse = await response.json();

        if (data.error) {
          throw new Error(data.error);
        }

        setSessionData(data.data.session);

        // Convert orders object to array with actions
        const ordersArray = Object.entries(data.data.orders).map(
          ([id, item]) => ({
            ...item.data,
            actions: item.actions || null,
          })
        );
        console.log("Raw orders from API:", ordersArray);
        setOrders(ordersArray);
      } catch (error) {
        console.error("Error fetching session data:", error);
        toast({
          title: "Error",
          description:
            error instanceof Error
              ? error.message
              : "Failed to fetch session data",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (session.status === "authenticated") {
      fetchSessionData();
    }
  }, [session, refreshKey, toast]);

  const handleCloseSession = async () => {
    try {
      const restToken = (session.data?.user as any)?.restToken;

      if (!restToken || !sessionData) {
        toast({
          title: "Error",
          description: "No authentication token or session data available",
          variant: "destructive",
        });
        return;
      }

      const BACKEND_API =
        (process.env.NEXT_PUBLIC_MENU_ORDER || "https://poc.finnetude.com") +
        "/api/v1";

      const response = await fetch(`${BACKEND_API}/session/close`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${restToken}`,
        },
        body: JSON.stringify({
          session_code: sessionData.session_code,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      const result = await response.json();

      if (result.error) {
        throw new Error(result.error);
      }

      toast({
        title: "Success",
        description: "Session closed successfully",
      });

      // Refresh data
      setRefreshKey((prevKey) => prevKey + 1);
      setIsConfirmDialogOpen(false);
    } catch (error) {
      console.error("Error closing session:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error ? error.message : "Failed to close session",
        variant: "destructive",
      });
    }
  };

  const handleRefresh = () => {
    setRefreshKey((prevKey) => prevKey + 1);
  };

  const formatSessionDate = (dateString: string | undefined) => {
    if (!dateString) return "";
    try {
      return format(new Date(dateString), "dd-MM-yyyy");
    } catch (e) {
      return dateString;
    }
  };

  // Status is handled by the backend API

  // Filter orders based on market type
  let filteredOrders = [...orders];
  if (marketType === "primaire") {
    filteredOrders = orders.filter((order) => order.market_type === "P");
  } else if (marketType === "secondaire") {
    filteredOrders = orders.filter((order) => order.market_type === "S");
  }

  // Now fix the data transformation for the OrdresTable
  const convertToTableOrders = (apiOrders: OrderData[]): any[] => {
    console.log("Converting orders:", apiOrders); // Debug log

    if (!apiOrders || apiOrders.length === 0) {
      console.log("No orders to convert");
      return [];
    }

    const convertedOrders = apiOrders.map((order) => ({
      id: order.id.toString(),
      clientName: order.souscripteur?.nom_prenom || "Client",
      securityissuer: "Emetteur", // Default value
      securitytype: order.market_type === "P" ? "empruntobligataire" : "action",
      securityid: order.stock_id,
      isin: order.stock_id, // Add this for compatibility
      quantity: order.quantity,
      securityquantity: order.quantity,
      price: order.price,
      orderdate: order.souscripteur?.date_naissance || new Date().toISOString(),
      orderstatus: 1, // Default status (the actual status is handled by backend API)
      status: order.status, // Add raw status for debugging
      investorid: order.client_id,
      negotiatorid: "",
      validity: order.validity || "",
      duration: 0,
      createdat: new Date().toISOString(),
      payedWithCard: false,
      visaCosob: "",
      isinCode: order.stock_id,
      emissionDate: "",
      orderdirection: order.operation_type === "A" ? 1 : 2,
      marketType: order.market_type === "P" ? "primaire" : "secondaire", // Add this for compatibility
      validationType: order.operation_type === "A" ? "achat" : "vente", // Add this for compatibility
      priceInstruction: order.price_condition,
      timeInstruction: order.time_condition,
      condition: `${order.time_condition}, ${order.price_condition}, ${order.quantitative_condition}`, // Add this for compatibility
      // Add the actions from API
      apiActions: (order as any).actions || null,
    }));

    console.log("Converted orders:", convertedOrders);
    return convertedOrders;
  };

  // New function to download session results
  const handlePrintSession = async () => {
    try {
      setIsPrinting(true);
      const restToken = (session.data?.user as any)?.restToken;

      if (!restToken || !sessionData) {
        toast({
          title: "Error",
          description: "No authentication token or session data available",
          variant: "destructive",
        });
        return;
      }

      const BACKEND_API =
        (process.env.NEXT_PUBLIC_MENU_ORDER || "https://poc.finnetude.com") +
        "/api/v1";

      // Assuming the API endpoint for downloading session results
      const response = await fetch(`${BACKEND_API}/session/download`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${restToken}`,
        },
        body: JSON.stringify({
          session_code: sessionData.session_code,
        }),
      });

      if (!response.ok) {
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }

      // Check if the response is a PDF or other document
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Create a link and trigger download
      const a = document.createElement("a");
      a.href = url;
      a.download = `session-${sessionData.session_code}-results.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      a.remove();

      toast({
        title: "Success",
        description: "Session results downloaded successfully",
      });
    } catch (error) {
      console.error("Error downloading session results:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Failed to download session results",
        variant: "destructive",
      });
    } finally {
      setIsPrinting(false);
    }
  };

  return (
    <div className="motion-preset-focus motion-duration-2000">
      <div className="flex flex-col gap-1 mt-16 mb-8 ml-8">
        <div className="flex items-center justify-between w-full pr-8">
          <div className="text-3xl font-bold text-primary text-center md:ltr:text-left md:rtl:text-right">
            {marketType === "primaire"
              ? "Exécution - Souscriptions"
              : "Carnet d'Ordres"}
          </div>
          {/* Only show session info for Carnet d'ordres (secondary market) */}
          {marketType !== "primaire" && sessionData && (
            <div
              className={`text-lg font-semibold uppercase tracking-wide flex flex-col items-end ${getSessionCardStyle(
                sessionData.session_closed
              )} px-6 py-2 rounded shadow-sm border min-w-[180px]`}
            >
              <div className="flex items-center gap-2 w-full justify-center">
                <CalendarClock
                  className={`w-5 h-5 ${
                    sessionData.session_closed
                      ? "text-gray-600"
                      : "text-primary"
                  }`}
                />
                <span>Session {sessionData.session_code}</span>
              </div>
              <span className="text-xs text-gray-500 font-normal w-full flex justify-center text-center mt-1">
                {formatSessionDate(sessionData.session_date)}
                <span
                  className={`ml-2 font-medium ${
                    sessionData.session_closed
                      ? "text-red-500"
                      : "text-green-500"
                  }`}
                >
                  {sessionData.session_closed ? "(Fermée)" : "(Active)"}
                </span>
              </span>
            </div>
          )}
        </div>
        <div className="text-xs text-gray-500 md:w-[50%] text-center md:ltr:text-left md:rtl:text-right">
          {marketType === "primaire"
            ? "Gestion et exécution des ordres de souscription"
            : "Gestion et suivi des ordres de bourse"}
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
              variant={
                marketType === "all" || marketType === "secondaire"
                  ? "default"
                  : "outline"
              }
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
            onClick={handleRefresh}
            className="flex items-center gap-1"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>
        <div className="my-8">
          {marketType === "primaire" ? (
            // Use OrdresTableREST for Souscriptions (primary market)
            <OrdresTableREST
              key={`orders-table-execution-primaire-${refreshKey}`}
              searchquery={searchquery}
              taskID="execution"
              marketType="P"
              pageType="orderExecution"
              activeTab="souscriptions"
              activeAction="execution"
              searchqueryParam={searchquery}
              stateParam={state}
            />
          ) : loading ? (
            <div className="py-20 text-center">Chargement des données...</div>
          ) : (
            <>
              {filteredOrders.length === 0 ? (
                <div className="py-20 text-center text-gray-500">
                  Aucun ordre trouvé
                </div>
              ) : (
                // Use session-based OrdresTable for Carnet d'ordres (secondary market)
                <OrdresTable
                  searchquery={searchquery}
                  skip={currentPage}
                  state={state}
                  marketType={marketType}
                  pageType="orderExecution"
                  userRole={userRole?.toString() || "1"}
                  userType="iob"
                  activeTab="all"
                  showActionColumn={true}
                  onActionToggle={handleActionToggle}
                  showResponseButton={!sessionData?.session_closed}
                  data={convertToTableOrders(filteredOrders)}
                  onRefresh={handleRefresh}
                />
              )}
            </>
          )}
        </div>
        <div className="flex justify-between items-center">
          {/* Only show pagination and session controls for Carnet d'ordres (secondary market) */}
          {marketType !== "primaire" && (
            <>
              <MyPagination />
              <div className="flex justify-end gap-2">
                {/* Add print button if can_download is true */}
                {sessionData?.can_download && (
                  <Button
                    className="py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md shadow text-sm flex gap-2 items-center"
                    onClick={handlePrintSession}
                    disabled={isPrinting}
                  >
                    <Printer
                      className={`h-4 w-4 ${isPrinting ? "animate-spin" : ""}`}
                    />
                    {isPrinting
                      ? "Téléchargement..."
                      : "Imprimer les résultats"}
                  </Button>
                )}

                {/* Show close button only if session is not closed */}
                {sessionData && !sessionData.session_closed && (
                  <Button
                    className="py-2 px-4 bg-primary hover:bg-primary/90 text-white rounded-md shadow text-sm flex gap-2 items-center"
                    onClick={() => setIsConfirmDialogOpen(true)}
                  >
                    Fermer la session
                  </Button>
                )}
                <AlertDialog
                  open={isConfirmDialogOpen}
                  onOpenChange={setIsConfirmDialogOpen}
                >
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Êtes-vous sûr de vouloir fermer la session ?
                      </AlertDialogTitle>
                      <AlertDialogDescription>
                        Tout nouvel ordre sera redirigé vers la session
                        suivante.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Annuler</AlertDialogCancel>
                      <AlertDialogAction onClick={handleCloseSession}>
                        Oui
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ExecutionPage;
