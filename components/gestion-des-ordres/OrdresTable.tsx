"use client";
/**
 * Order Status Flow:
 * 0 - Draft (initial state)
 * 1 - Pending (waiting for agency_first_approver)
 * 2 - In Progress (waiting for agency_final_approver)
 * 3 - Validated (waiting for tcc_first_approver)
 * 4 - Being Processed (waiting for tcc_final_approver)
 * 5 - Completed (waiting for iob_order_executor)
 * 6 - Awaiting Approval (waiting for iob_result_submitter)
 * 7 - Ongoing (in execution)
 * 8 - Partially Validated
 * 9 - Expired
 * 10 - Rejected
 * 11 - Cancelled
 *
 * Workflow by role:
 * agency_first_approver - Validates orders with status 1, moving them to status 2
 * agency_final_approver - Validates orders with status 2, moving them to status 3
 * tcc_first_approver - Validates orders with status 3, moving them to status 4
 * tcc_final_approver - Validates orders with status 4, moving them to status 5
 * iob_order_executor - Executes orders with status 5, moving them to status 6
 * iob_result_submitter - Submits results for orders with status 6, moving them to status 7
 */
import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
  ColumnDef,
} from "@tanstack/react-table";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import PrintOrderDialog from "@/components/gestion-des-ordres/PrintOrderDialog";
import OrdreDrawer from "./OrdreDrawer";
import BulletinSubmitDialog from "../BulletinSubmitDialog";
import SupprimerOrdre from "../SupprimerOrdre";
import { List, AlertTriangle, Printer, ChevronDown, ChevronUp, ChevronsUpDown } from "lucide-react";
import RateLimitReached from "../RateLimitReached";
import { ValiderTotallement } from "../ValiderTotallement";
import { Order } from "@/lib/interfaces";
import {
  mockOrders,
  filterOrdersBySearchQuery,
  filterOrdersByStatus,
  filterOrdersByMarketType,
  paginateOrders,
} from "@/lib/mockData";
import OrderStateFilter from "./OrderStateFilter";
import MarketTypeFilter from "./MarketTypeFilter";

interface OrdresTableProps {
  searchquery: string;
  skip: number;
  state: string;
  marketType: string;
  pageType:
    | "ordres"
    | "souscriptions"
    | "firstValidation"
    | "finalValidation"
    | "tccFirstValidation"
    | "tccFinalValidation"
    | "orderExecution"
    | "submitResults"
    | "carnetordres"
    | "dashboard";
  userRole: string;
  userType: "agence" | "tcc" | "iob";
  activeTab: string;
  showActionColumn?: boolean;
  onActionToggle?: () => void;
  showResponseButton?: boolean;
  data?: Order[];
}

type SortField = 'id' | 'titre' | 'investisseur' | 'iob' | 'sens' | 'type' | 'quantity' | 'statut' | 'date';
type SortDirection = 'asc' | 'desc' | null;

export default function OrdresTable({
  searchquery,
  skip,
  state,
  marketType,
  pageType,
  userRole,
  userType,
  activeTab,
  showActionColumn = false,
  onActionToggle,
  showResponseButton = true,
  data: injectedData,
}: OrdresTableProps) {
  const session = useSession();
  const t = useTranslations("mesOrdres");
  const tStatus = useTranslations("status");
  const [data, setData] = useState<Order[]>(injectedData ?? []);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortField, setSortField] = useState<SortField | null>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [isResponseDialogOpen, setIsResponseDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [responseForm, setResponseForm] = useState({
    reliquat: "",
    quantite: "",
    prix: "",
  });
  const [ordersWithResponses, setOrdersWithResponses] = useState<Record<string, boolean>>({});
  const [responsesData, setResponsesData] = useState<Record<string, { reliquat: string; quantite: string; prix: string }>>({});

  // Sort function
  const sortData = (data: Order[], field: SortField, direction: SortDirection) => {
    if (!direction) return data;

    return [...data].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (field) {
        case 'id':
          aValue = a.id || '';
          bValue = b.id || '';
          break;
        case 'titre':
          aValue = (a.securityissuer || '') + (a.securityid || '');
          bValue = (b.securityissuer || '') + (b.securityid || '');
          break;
        case 'investisseur':
          aValue = a.investorid || '';
          bValue = b.investorid || '';
          break;
        case 'iob':
          aValue = a.negotiatorid || '';
          bValue = b.negotiatorid || '';
          break;
        case 'sens':
          aValue = a.orderdirection === 1 ? t("achat") : t("vente");
          bValue = b.orderdirection === 1 ? t("achat") : t("vente");
          break;
        case 'type':
          aValue = a.securitytype || '';
          bValue = b.securitytype || '';
          break;
        case 'quantity':
          aValue = a.quantity || 0;
          bValue = b.quantity || 0;
          break;
        case 'statut':
          aValue = a.orderstatus || 0;
          bValue = b.orderstatus || 0;
          break;
        case 'date':
          aValue = new Date(a.createdat || '').getTime();
          bValue = new Date(b.createdat || '').getTime();
          break;
        default:
          return 0;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (direction === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });
  };

  // Handle sort click
  const handleSort = (field: SortField) => {
    if (sortField === field) {
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortDirection(null);
        setSortField(null);
      }
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Get sort icon
  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ChevronsUpDown className="ml-1 h-4 w-4 text-gray-400" />;
    }
    if (sortDirection === 'asc') {
      return <ChevronUp className="ml-1 h-4 w-4 text-blue-600" />;
    }
    if (sortDirection === 'desc') {
      return <ChevronDown className="ml-1 h-4 w-4 text-blue-600" />;
    }
    return <ChevronsUpDown className="ml-1 h-4 w-4 text-gray-400" />;
  };

  // Handle response click
  const handleResponseClick = (order: Order) => {
    setSelectedOrder(order);
    // Si l'ordre a déjà une réponse, pré-remplir le formulaire avec les anciennes valeurs
    if (ordersWithResponses[order.id] && responsesData[order.id]) {
      setResponseForm({
        reliquat: responsesData[order.id].reliquat,
        quantite: responsesData[order.id].quantite,
        prix: responsesData[order.id].prix,
      });
    } else {
      setResponseForm({
        reliquat: "",
        quantite: "",
        prix: "",
      });
    }
    setIsResponseDialogOpen(true);
  };

  // Handle response submit
  const handleResponseSubmit = () => {
    // Ici vous pouvez traiter la soumission du formulaire
    console.log("Réponse soumise:", {
      orderId: selectedOrder?.id,
      ...responseForm
    });
    // Ajouter l'ordre à la liste des ordres avec réponses soumises
    if (selectedOrder?.id) {
      setOrdersWithResponses({ ...ordersWithResponses, [selectedOrder.id]: true });
      setResponsesData({
        ...responsesData,
        [selectedOrder.id]: {
          reliquat: responseForm.reliquat,
          quantite: responseForm.quantite,
          prix: responseForm.prix,
        },
      });
    }
    setIsResponseDialogOpen(false);
  };

  // Filter data based on pageType and userRole
  const filterOrdersByPageAndRole = (orders: Order[]) => {
    // Each page shows orders in a specific status
    switch (pageType) {
      case "firstValidation":
        return orders.filter((order) => order.orderstatus === 1);
      case "finalValidation":
        return orders.filter((order) => order.orderstatus === 2);
      case "tccFirstValidation":
        return orders.filter((order) => order.orderstatus === 3);
      case "tccFinalValidation":
        return orders.filter((order) => order.orderstatus === 4);
      case "orderExecution":
        return orders.filter((order) => order.orderstatus === 5);
      case "submitResults":
        return orders.filter((order) => order.orderstatus === 6);
      case "carnetordres":
        return orders.filter((order) => order.orderstatus >= 0 && order.orderstatus <= 11);
      case "souscriptions":
        // For subscriptions page, filter by primary market
        return filterOrdersByMarketType(orders, "primaire");
      case "ordres":
        // For regular orders page, filter by secondary market
        return filterOrdersByMarketType(orders, "secondaire");
      case "dashboard":
        return orders.slice(0, 4);
      default:
        return orders;
    }
  };

  useEffect(() => {
    setLoading(true);
    setError(null);

    const timer = setTimeout(() => {
      try {
        let filteredData = injectedData ? [...injectedData] : [...mockOrders];

        // Apply search filter
        if (searchquery) {
          filteredData = filterOrdersBySearchQuery(filteredData, searchquery);
        }

        // Apply status filter
        if (state !== "99") {
          filteredData = filterOrdersByStatus(filteredData, state);
        }

        // Apply market type filter
        if (marketType !== "all") {
          filteredData = filterOrdersByMarketType(filteredData, marketType);
        }

        // Apply page-specific filters
        filteredData = filterOrdersByPageAndRole(filteredData);

        // Calculate total count
        setCount(filteredData.length);

        // Apply pagination
        filteredData = paginateOrders(filteredData, skip);

        setData(filteredData);
      } catch (error) {
        console.error("Error processing orders:", error);
        setError("An error occurred while processing data.");
      } finally {
        setLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchquery, skip, state, marketType, pageType, userRole, injectedData]);

  // Separate effect for sorting to avoid loading state
  useEffect(() => {
    if (!loading && data.length > 0) {
      let sortedData = [...data];
      
      // Apply sorting
      if (sortField && sortDirection) {
        sortedData = sortData(sortedData, sortField, sortDirection);
      }
      
      setData(sortedData);
    }
  }, [sortField, sortDirection, loading]);

  const getStatusBgColor = (statut: number) => {
    switch (statut) {
      case 0:
        return "bg-gray-600";
      case 1:
        return "bg-yellow-600";
      case 2:
        return "bg-secondary";
      case 3:
        return "bg-green-600";
      case 4:
        return "bg-purple-600";
      case 5:
        return "bg-teal-600";
      case 6:
        return "bg-orange-600";
      case 7:
        return "bg-indigo-600";
      case 8:
        return "bg-orange-600";
      case 9:
        return "bg-red-700";
      case 10:
        return "bg-red-600";
      case 11:
        return "bg-gray-700";
      default:
        return "bg-gray-700";
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead></TableHead>
            {pageType !== "dashboard" && (
              <TableHead 
                className="font-bold uppercase cursor-pointer"
                onClick={() => handleSort('id')}
              >
                <div className="flex items-center">
                  ID
                  {getSortIcon('id')}
                </div>
              </TableHead>
            )}
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('titre')}
            >
              <div className="flex items-center">
                {t("titre")}
                {getSortIcon('titre')}
              </div>
            </TableHead>
            {pageType === "carnetordres" && (
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('investisseur')}
              >
                <div className="flex items-center">
                  {t("investisseur")}
                  {getSortIcon('investisseur')}
                </div>
              </TableHead>
            )}
            {pageType === "carnetordres" && (
              <TableHead 
                className="cursor-pointer"
                onClick={() => handleSort('iob')}
              >
                <div className="flex items-center">
                  IOB
                  {getSortIcon('iob')}
                </div>
              </TableHead>
            )}
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('sens')}
            >
              <div className="flex items-center">
                {t("sens")}
                {getSortIcon('sens')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('type')}
            >
              <div className="flex items-center">
                {t("type")}
                {getSortIcon('type')}
              </div>
            </TableHead>
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('quantity')}
            >
              <div className="flex items-center">
                {t("quantity")}
                {getSortIcon('quantity')}
              </div>
            </TableHead>
            <TableHead>
              {pageType === "carnetordres" ? (
                <OrderStateFilter />
              ) : (
                <div 
                  className="flex items-center cursor-pointer"
                  onClick={() => handleSort('statut')}
                >
                  {t("statut")}
                  {getSortIcon('statut')}
                </div>
              )}
              </TableHead>
              {pageType === "carnetordres" && (
                <TableHead>
                  <MarketTypeFilter />
                </TableHead>
              )}
            <TableHead 
              className="cursor-pointer"
              onClick={() => handleSort('date')}
            >
              <div className="flex items-center">
                {t("date")}
                {getSortIcon('date')}
              </div>
            </TableHead>
            {pageType !== "dashboard" && <TableHead>Transaction</TableHead>}
            {showActionColumn && (
              <TableHead>Réponse</TableHead>
            )}
            {pageType !== "dashboard" && <TableHead></TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
        {data.map((order: Order, idx) => (
            <TableRow key={order.id}>
              <TableCell>{skip + idx + 1}</TableCell>
              {pageType !== "dashboard" && (
                <TableCell className="font-bold overflow-x-scroll w-60">
                  {order?.id
                    ? order.id.split("-").slice(0, 2).join("-")
                    : "N/A"}
                </TableCell>
              )}
              <TableCell>
                <div className="flex flex-col">
                  <div className="font-medium capitalize">
                  {order?.securityissuer || "N/A"}
                  </div>
                  <div className="font-medium text-xs uppercase text-gray-400">
                  {order?.securityid || "N/A"}
                </div>
                </div>
              </TableCell>
            {pageType === "carnetordres" && (
              <TableCell>{order?.investorid || "N/A"}</TableCell>
              )}
            {pageType === "carnetordres" && (
              <TableCell>{order?.negotiatorid || "N/A"}</TableCell>
              )}
              <TableCell
                className={`${
                  order.orderdirection === 1 ? "text-green-500" : "text-red-600"
                }`}
              >
                {order.orderdirection === 1 ? t("achat") : t("vente")}
              </TableCell>
              <TableCell>
              {order.securitytype === "action"
                  ? t("action")
                : order.securitytype === "obligation"
                  ? t("obligation")
                : order.securitytype === "sukuk"
                  ? t("sukuk")
                : order.securitytype === "opv"
                  ? t("opv")
                : order.securitytype === "titresparticipatifs"
                  ? t("titre_participatif")
                  : order.securitytype === "empruntobligataire"
                  ? t("emprunt_obligataire")
                  : order.securitytype}
              </TableCell>
              <TableCell>{order.quantity}</TableCell>
              <TableCell>
                <div
                  className={`w-fit py-0.5 px-2 rounded-full text-xs text-center text-white ${
                    pageType === "orderExecution"
                      ? ordersWithResponses[order.id]
                        ? "bg-green-600"
                        : "bg-green-600"
                      : pageType === "carnetordres"
                      ? "bg-green-600"  
                      : getStatusBgColor(Number(order.orderstatus))
                  }`}
                >
                  {pageType === "orderExecution"
                    ? ordersWithResponses[order.id]
                      ? "Terminée"
                      : "En cours"
                    : pageType === "carnetordres"
                    ? "Active"
                    : order?.orderstatus === 0 && order?.payedWithCard
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
                    : "Unknown"}
                </div>
              </TableCell>
                <TableCell className="text-xs">
                  {(() => {
                    const d = new Date(order.createdat);
                    const day = String(d.getDate()).padStart(2, '0');
                    const month = String(d.getMonth() + 1).padStart(2, '0');
                    const year = d.getFullYear();
                    return `${day}/${month}/${year}`;
                  })()}
                </TableCell>
                {pageType !== "dashboard" && (
                  <TableCell>
                    {'sessionsCount' in order ? (order as any).sessionsCount : 0}
                  </TableCell>
                )}
                {showActionColumn && (
                  <TableCell>
                    <Button size="sm" variant="outline" onClick={() => handleResponseClick(order)}>
                      {ordersWithResponses[order.id] ? 'Modifier' : 'Réponse'}
                    </Button>
                  </TableCell>
                )}
                {pageType !== "dashboard" && (
                  <TableCell>
                    <OrdreDrawer 
                      titreId={order.id} 
                      orderData={order}
                      isSouscription={order.securitytype === "empruntobligataire" || order.securitytype === "opv"}
                    />
                  </TableCell>
                )}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Dialog de réponse */}
      <Dialog open={isResponseDialogOpen} onOpenChange={setIsResponseDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {selectedOrder && ordersWithResponses[selectedOrder.id] 
                ? "Modifier la réponse à l'ordre" 
                : "Réponse à l'ordre"
              }
            </DialogTitle>
            <DialogDescription>
              Ordre ID: {selectedOrder?.id}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="reliquat" className="text-right">
                Reliquat
              </Label>
              <Input
                id="reliquat"
                value={responseForm.reliquat}
                onChange={(e) =>
                  setResponseForm({ ...responseForm, reliquat: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantite" className="text-right">
                Quantité
              </Label>
              <Input
                id="quantite"
                value={responseForm.quantite}
                onChange={(e) =>
                  setResponseForm({ ...responseForm, quantite: e.target.value })
                }
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="prix" className="text-right">
                Prix
              </Label>
              <Input
                id="prix"
                value={responseForm.prix}
                onChange={(e) =>
                  setResponseForm({ ...responseForm, prix: e.target.value })
                }
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="submit" onClick={handleResponseSubmit}>
              Soumettre
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
