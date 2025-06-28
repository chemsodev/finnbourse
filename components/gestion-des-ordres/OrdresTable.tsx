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
import { useTranslations } from "next-intl";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import PrintOrderDialog from "@/components/gestion-des-ordres/PrintOrderDialog";
import OrdreDrawer from "./OrdreDrawer";
import BulletinSubmitDialog from "../BulletinSubmitDialog";
import SupprimerOrdre from "../SupprimerOrdre";
import { List, AlertTriangle, Printer } from "lucide-react";
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
}

export default function OrdresTable({
  searchquery,
  skip,
  state,
  marketType,
  pageType,
  userRole,
  userType,
  activeTab,
}: OrdresTableProps) {
  const session = useSession();
  const t = useTranslations("mesOrdres");
  const tStatus = useTranslations("status");
  const [data, setData] = useState<Order[]>([]);
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
        return orders.slice(0, 4); // Show only 4 orders for dashboard
      default:
        // Default fallback - filter by user type
        if (userType === "agence") {
          return orders.filter(
            (order) => order.orderstatus >= 0 && order.orderstatus <= 3
          );
        } else if (userType === "tcc") {
          return orders.filter(
            (order) => order.orderstatus >= 3 && order.orderstatus <= 5
          );
        } else if (userType === "iob") {
          return orders.filter(
            (order) => order.orderstatus >= 5 && order.orderstatus <= 7
          );
        }
        return orders;
    }
  };

  useEffect(() => {
    // Simulate API loading
    setLoading(true);
    setError(null);

    // Add a small delay to simulate network request
    const timer = setTimeout(() => {
      try {
        // Apply filters in sequence
        let filteredData = [...mockOrders];

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
    }, 500); // 500ms delay to simulate network

    return () => clearTimeout(timer);
  }, [searchquery, skip, state, marketType, pageType, userRole]);

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
    <Table>
      <TableHeader>
        <TableRow>
          {pageType !== "dashboard" && (
            <TableHead className="font-bold uppercase">ID</TableHead>
          )}
          <TableHead>{t("titre")}</TableHead>
          {pageType === "carnetordres" && (
            <TableHead>{t("investisseur")}</TableHead>
          )}
          {pageType === "carnetordres" && (
            <TableHead>IOB</TableHead>
          )}
          <TableHead>{t("sens")}</TableHead>
          <TableHead>{t("type")}</TableHead>
          <TableHead>{t("quantity")}</TableHead>
          <TableHead>
            {pageType === "carnetordres" ? <OrderStateFilter /> : t("statut")}
          </TableHead>
          {pageType === "carnetordres" && (
            <TableHead>
              <MarketTypeFilter />
            </TableHead>
          )}
          <TableHead>{t("date")}</TableHead>
          {pageType !== "dashboard" && <TableHead></TableHead>}
        </TableRow>
      </TableHeader>
      <TableBody>
        {data.map((order: Order) => (
          <TableRow key={order.id}>
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
                className={`w-fit py-0.5 px-2 rounded-full text-xs text-center text-white ${getStatusBgColor(
                  Number(order.orderstatus)
                )}`}
              >
                {order?.orderstatus === 0 && order?.payedWithCard
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
              {new Date(order.createdat).toLocaleDateString()}
            </TableCell>
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
  );
}
