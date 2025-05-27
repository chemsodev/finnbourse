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
    | "submitResults";
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
      case "souscriptions":
        // For subscriptions page, filter by primary market
        return filterOrdersByMarketType(orders, "primaire");
      case "ordres":
        // For regular orders page, filter by secondary market
        return filterOrdersByMarketType(orders, "secondaire");
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

  // Define columns based on table type and user role
  const getColumns = () => {
    type ColumnType = ColumnDef<any> & {
      id?: string;
      accessorKey?: string;
      header: any;
      cell: any;
    };

    // Base columns for both types
    const baseColumns = [
      {
        accessorKey: "securityissuer",
        header: t("societe"),
        cell: ({ row }: any) => <div>{row.original.securityissuer}</div>,
      },
      {
        accessorKey: "securitytype",
        header: t("type"),
        cell: ({ row }: any) => (
          <div className="capitalize">
            {row.original.securitytype === "action"
              ? t("action")
              : row.original.securitytype === "obligation"
              ? t("obligation")
              : row.original.securitytype === "sukukms"
              ? t("sukuk")
              : row.original.securitytype === "titresparticipatifsms"
              ? t("titresparticipatifs")
              : row.original.securitytype === "opv"
              ? t("opv")
              : row.original.securitytype === "empruntobligataire"
              ? t("empruntobligataire")
              : row.original.securitytype === "sukukmp"
              ? t("sukuk")
              : row.original.securitytype === "titresparticipatifsmp"
              ? t("titresparticipatifs")
              : row.original.securitytype}
          </div>
        ),
      },
    ];

    // Souscription specific columns - minimal view
    const souscriptionColumns = [
      {
        accessorKey: "bdl",
        header: "BDL",
        cell: ({ row }: any) => <div>{row.original.bdl || "1400 DA"}</div>,
      },
      {
        accessorKey: "quantity",
        header: t("qte"),
        cell: ({ row }: any) => <div>{row.original.quantity}</div>,
      },
      {
        accessorKey: "totalShares",
        header: "Nombre de titres",
        cell: ({ row }: any) => (
          <div>
            {row.original.totalShares?.toLocaleString() || "44 200 000"}
          </div>
        ),
      },
      {
        accessorKey: "netAmount",
        header: "Montant Net",
        cell: ({ row }: any) => (
          <div>{row.original.netAmount || "1 400.00 DA"}</div>
        ),
      },
    ];

    // Ordre specific columns - minimal view
    const ordreColumns = [
      {
        accessorKey: "mst",
        header: "MST",
        cell: ({ row }: any) => <div>{row.original.mst || "760.00 DA"}</div>,
      },
      {
        accessorKey: "orderdirection",
        header: "Type",
        cell: ({ row }: any) => (
          <div
            className={
              row.original.orderdirection === 1
                ? "text-green-600"
                : "text-red-600"
            }
          >
            {row.original.orderdirection === 1 ? t("achat") : t("vente")}
          </div>
        ),
      },
      {
        accessorKey: "quantity",
        header: t("qte"),
        cell: ({ row }: any) => <div>{row.original.quantity}</div>,
      },
      {
        accessorKey: "validityDate",
        header: "Date de validité",
        cell: ({ row }: any) => (
          <div>
            {new Date(
              row.original.validityDate || "2025-06-27"
            ).toLocaleDateString()}
          </div>
        ),
      },
      {
        accessorKey: "netAmount",
        header: "Montant Net",
        cell: ({ row }: any) => (
          <div>{row.original.netAmount || "766.84 DA"}</div>
        ),
      },
    ];

    // Add status column
    const statusColumn = {
      accessorKey: "orderstatus",
      header: t("status"),
      cell: ({ row }: any) => (
        <div
          className={`px-2 py-1 rounded-md text-white text-xs inline-block w-fit ${
            row.original?.orderstatus === 0 && row.original?.payedWithCard
              ? "bg-gray-600"
              : row.original?.orderstatus === 0 && !row.original?.payedWithCard
              ? "bg-gray-600"
              : row.original?.orderstatus === 1
              ? "bg-yellow-600"
              : row.original?.orderstatus === 2
              ? "bg-secondary"
              : row.original?.orderstatus === 3
              ? "bg-green-600"
              : row.original?.orderstatus === 4
              ? "bg-purple-600"
              : row.original?.orderstatus === 5
              ? "bg-teal-600"
              : row.original?.orderstatus === 6
              ? "bg-orange-600"
              : row.original?.orderstatus === 7
              ? "bg-indigo-600"
              : row.original?.orderstatus === 8
              ? "bg-orange-600"
              : row.original?.orderstatus === 9
              ? "bg-red-700"
              : row.original?.orderstatus === 10
              ? "bg-red-600"
              : row.original?.orderstatus === 11
              ? "bg-gray-700"
              : "bg-gray-600"
          }`}
        >
          {row.original?.orderstatus === 0 && row.original?.payedWithCard
            ? "Brouillon payé"
            : row.original?.orderstatus === 0 && !row.original?.payedWithCard
            ? tStatus("Draft")
            : row.original?.orderstatus === 1
            ? tStatus("Pending")
            : row.original?.orderstatus === 2
            ? tStatus("In_Progress")
            : row.original?.orderstatus === 3
            ? tStatus("Validated")
            : row.original?.orderstatus === 4
            ? tStatus("Being_Processed")
            : row.original?.orderstatus === 5
            ? tStatus("Completed")
            : row.original?.orderstatus === 6
            ? tStatus("Awaiting_Approval")
            : row.original?.orderstatus === 7
            ? tStatus("Ongoing")
            : row.original?.orderstatus === 8
            ? tStatus("Partially_Validated")
            : row.original?.orderstatus === 9
            ? tStatus("Expired")
            : row.original?.orderstatus === 10
            ? tStatus("Rejected")
            : row.original?.orderstatus === 11
            ? tStatus("Cancelled")
            : "Unknown"}
        </div>
      ),
    };

    // Add actions column with details button
    const actionsColumn = {
      id: "actions",
      header: t("actions"),
      cell: ({ row }: any) => {
        const order = row.original;
        return (
          <div className="flex items-center space-x-2">
            <OrdreDrawer
              titreId={order.id}
              orderData={order}
              isSouscription={
                pageType === "souscriptions" || activeTab === "souscriptions"
              }
            />

            {userRole === "1" && order.orderstatus === 0 && (
              <BulletinSubmitDialog
                createdOrdreId={order.id}
                ispayedWithCard={order.payedWithCard}
                page="TablePage"
              />
            )}
            {userRole === "1" &&
              (order.orderstatus === 0 || order.orderstatus === 1) && (
                <SupprimerOrdre titreId={order.id} />
              )}

            {userType === "agence" &&
              userRole === "agency_first_approver" &&
              order.orderstatus === 1 && (
                <ValiderTotallement
                  ordreId={order.id}
                  quantity={order.quantity}
                />
              )}

            {userType === "agence" &&
              userRole === "agency_final_approver" &&
              order.orderstatus === 2 && (
                <ValiderTotallement
                  ordreId={order.id}
                  quantity={order.quantity}
                />
              )}

            {userType === "tcc" &&
              userRole === "tcc_first_approver" &&
              order.orderstatus === 3 && (
                <ValiderTotallement
                  ordreId={order.id}
                  quantity={order.quantity}
                />
              )}

            {userType === "tcc" &&
              userRole === "tcc_final_approver" &&
              order.orderstatus === 4 && (
                <ValiderTotallement
                  ordreId={order.id}
                  quantity={order.quantity}
                />
              )}

            {userType === "iob" &&
              userRole === "iob_order_executor" &&
              Number(order.orderstatus) === 5 && (
                <BulletinSubmitDialog
                  createdOrdreId={order.id}
                  ispayedWithCard={order.payedWithCard}
                  page="TablePage"
                />
              )}

            {userType === "iob" &&
              userRole === "iob_result_submitter" &&
              Number(order.orderstatus) === 6 && (
                <BulletinSubmitDialog
                  createdOrdreId={order.id}
                  ispayedWithCard={order.payedWithCard}
                  page="TablePage"
                />
              )}
          </div>
        );
      },
    };

    // Return appropriate columns based on page type
    if (pageType === "souscriptions" || activeTab === "souscriptions") {
      return [
        ...baseColumns,
        ...souscriptionColumns,
        statusColumn,
        actionsColumn,
      ];
    } else {
      return [...baseColumns, ...ordreColumns, statusColumn, actionsColumn];
    }
  };

  const columns = getColumns();

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  if (error === "rate-limit") return <RateLimitReached />;

  return (
    <div className="rounded-md border">
      {loading ? (
        <div className="py-14 w-full flex justify-center">
          <div role="status">
            <svg
              aria-hidden="true"
              className="w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-secondary"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        </div>
      ) : data.length === 0 ? (
        <div className="text-center p-10 flex flex-col items-center justify-center text-gray-500">
          <AlertTriangle className="h-10 w-10 mb-2" />
          <h3 className="text-lg font-medium">{t("noData")}</h3>
          <p className="text-sm max-w-xs mx-auto mt-1">{t("noDataExpl")}</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  <div className="flex items-center justify-center">
                    <List className="w-4 h-4 mr-2" />
                    {t("noData")}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
    </div>
  );
}
