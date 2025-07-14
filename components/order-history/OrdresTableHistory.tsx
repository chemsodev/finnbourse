"use client";

import {
  flexRender,
  getCoreRowModel,
  useReactTable,
  getPaginationRowModel,
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
import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { List, AlertTriangle, RefreshCw } from "lucide-react";
import orderService, { OrderElement } from "@/lib/services/orderService";
import { useToast } from "@/hooks/use-toast";
import { OrderDetailsDialog } from "./OrderDetailsDialog";
import { useJournalOrdersApi } from "@/hooks/useOrdersApi";
import { JournalOrder } from "@/types/orders";

interface StockDetails {
  id: string;
  code: string;
  name: string;
  type?: string;
}

interface ClientDetails {
  id: string;
  name: string;
  email?: string;
}

interface OrdresTableHistoryProps {
  searchquery?: string;
  taskID: string;
  marketType?: string;
  pageType: string;
}

export default function OrdresTableHistory({
  searchquery,
  taskID,
  marketType = "S",
  pageType,
}: OrdresTableHistoryProps) {
  const t = useTranslations("orderHistory");
  const api = useJournalOrdersApi();
  const session = useSession();
  const [data, setData] = useState<OrderElement[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const [selectedOrder, setSelectedOrder] = useState<OrderElement | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  // Validate taskID
  useEffect(() => {
    if (!taskID) {
      console.error("No taskID provided");
      setError("No taskID provided");
      setLoading(false);
    }
  }, [taskID]);

  // Initial fetch on component mount

  // Fetch orders from API
  // const fetchOrdersData = useCallback(async () => {
  //   try {
  //     setLoading(true);
  //     setError(null);
  //     const response = await api.getAllJournalOrders({
  //       market_type: marketType,
  //     });
  //     console.log(response);
  //     if (response.error) {
  //       throw new Error(response.error);
  //     }

  //     setData(
  //       (response.data.orders || []).map((order: JournalOrder) => ({
  //         ...order,
  //         time_condition: order.time_condition ?? "",
  //         quantitative_condition: order.quantitative_condition ?? "",
  //       }))
  //     );

  //     //   if (!restToken) {
  //     //     setError("No authentication token available");
  //     //     setLoading(false);
  //     //     return;
  //     //   }

  //     //   const result = await orderService.fetchOrders(
  //     //     restToken,
  //     //     taskID,
  //     //     marketType
  //     //   );

  //     //   setLoading(false);

  //     //   if (result.error) {
  //     //     setError(result.error);
  //     //   } else {
  //     //     const elements = result.data?.elements || [];
  //     //     setData(elements);

  //     // Extract unique stock IDs and client IDs
  //     // const stockIds = Array.from(
  //     //   new Set(
  //     //     elements
  //     //       .map((order: OrderElement) => order.stock_id)
  //     //       .filter(Boolean)
  //     //   )
  //     // ) as string[];
  //     // const clientIds = Array.from(
  //     //   new Set(
  //     //     elements
  //     //       .map((order: OrderElement) => order.client_id)
  //     //       .filter(Boolean)
  //     //   )
  //     // ) as string[];

  //     // if (stockIds.length > 0) {
  //     //   fetchStockDetails(stockIds, restToken);
  //     // }

  //     // if (clientIds.length > 0) {
  //     //   fetchClientDetails(clientIds, restToken);
  //     // }
  //   } catch (err) {
  //     console.error("Error fetching orders:", err);
  //     setError(err instanceof Error ? err.message : "Unknown error");
  //     const errorMessage =
  //       typeof err === "object" && err !== null && "message" in err
  //         ? String((err as { message?: unknown }).message)
  //         : "Failed to fetch stocks";
  //     toast({
  //       title: "Error",
  //       description: errorMessage,
  //       variant: "destructive",
  //     });
  //     setData([]);
  //   } finally {
  //     setLoading(false);
  //   }
  // }, [api, marketType, toast]);

  // useEffect(() => {
  //   fetchOrdersData();
  // }, [fetchOrdersData]);

  useEffect(() => {
    fetchOrdersData();
  }, [session, taskID, marketType, toast]);

  const fetchOrdersData = async () => {
    setLoading(true);
    setError(null);

    try {
      const restToken = (session.data?.user as any)?.restToken;

      if (!restToken) {
        setError("No authentication token available");
        setLoading(false);
        return;
      }

      // For debugging, directly fetch from the API
      const BACKEND_API =
        (process.env.NEXT_PUBLIC_MENU_ORDER || "https://poc.finnetude.com") +
        "/api/v1";

      try {
        const directResponse = await fetch(
          `${BACKEND_API}/journal/orders/all`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${restToken}`,
            },
            body: JSON.stringify({
              market_type: marketType,
            }),
          }
        );

        // try {
        //   const text = await directResponse.text();
        //   console.log("📦 Raw response text:", text);

        //   try {
        //     const json = JSON.parse(text);
        //     console.log("✅ Parsed JSON:", json);
        //   } catch (jsonErr) {
        //     console.warn("⚠️ Not valid JSON response.");
        //   }
        // } catch (err) {
        //   console.error("❌ Error reading response body:", err);
        // }

        if (directResponse.ok) {
          const directData = await directResponse.json();
          console.log("✅ Full API response data:", directData);

          // Process the direct response
          if (directData?.data?.orders) {
            // Handle nested structure
            setData(directData.data.orders);
          } else if (directData?.orders) {
            setData(directData.orders);
          } else if (directData?.data?.elements) {
            setData(directData.data.elements);
          } else if (directData?.elements) {
            setData(directData.elements);
          } else {
            console.warn("Unexpected data structure:", directData);
            setData([]);
          }
          // setLoading(false);
          // return;
        }
      } catch (directError) {
        console.error("Error in direct API call:", directError);
      }

      //If direct fetch failed, try using the service
      const result = await orderService.fetchOrdersJournal(
        restToken,
        marketType
      );

      setLoading(false);
      if (result.error) {
        setError(result.error);
      } else {
        // Data validation check - properly handle the nested structure
        if (!result.data) {
          console.error(
            "Invalid data structure - missing data property:",
            result
          );
          setError("Invalid data structure received from API");
          setData([]);
          // setActions([]);
        } else {
          // Force data to be set even if elements appears to be empty
          const elements = result.data.elements || [];
          setData(elements);
          // setActions(
          // //   Array.isArray(result.data.actions) ? result.data.actions : []
          // );
        }
      }
    } catch (err) {
      console.error("Error in fetchOrdersData:", err);
      // Use example data on error
      // setData(exampleOrders);
      setLoading(false);
    }
  };

  // Fetch stock details
  //   const fetchStockDetails = async (stockIds: string[], token: string) => {
  //     try {
  //       const stocksData: Record<string, StockDetails> = {};

  //       await Promise.all(
  //         stockIds.map(async (stockId) => {
  //           if (!stockId) return;

  //           try {
  //             const backendUrl =
  //               process.env.NEXT_PUBLIC_BACKEND_URL ||
  //               "https://kh.finnetude.com/api/v1";
  //             const response = await fetch(`${backendUrl}/stock/${stockId}`, {
  //               headers: {
  //                 Authorization: `Bearer ${token}`,
  //               },
  //             });

  //             if (response.ok) {
  //               const stockData = await response.json();
  //               stocksData[stockId] = {
  //                 id: stockId,
  //                 code: stockData.code || "N/A",
  //                 name: stockData.name || "Unknown Stock",
  //                 type: stockData.type,
  //               };
  //             } else {
  //               stocksData[stockId] = {
  //                 id: stockId,
  //                 code: "Error",
  //                 name: "Failed to load",
  //               };
  //             }
  //           } catch (error) {
  //             console.error(`Error fetching stock ${stockId}:`, error);
  //             stocksData[stockId] = {
  //               id: stockId,
  //               code: "Error",
  //               name: "Failed to load",
  //             };
  //           }
  //         })
  //       );

  //       setStocksMap(stocksData);
  //     } catch (error) {
  //       console.error("Error fetching stock details:", error);
  //     }
  //   };

  // Fetch client details
  //   const fetchClientDetails = async (clientIds: string[], token: string) => {
  //     try {
  //       const clientsData: Record<string, ClientDetails> = {};

  //       await Promise.all(
  //         clientIds.map(async (clientId) => {
  //           if (!clientId) return;

  //           try {
  //             const backendUrl =
  //               process.env.NEXT_PUBLIC_BACKEND_URL ||
  //               "https://kh.finnetude.com/api/v1";
  //             const response = await fetch(`${backendUrl}/client/${clientId}`, {
  //               headers: {
  //                 Authorization: `Bearer ${token}`,
  //               },
  //             });

  //             if (response.ok) {
  //               const clientData = await response.json();
  //               clientsData[clientId] = {
  //                 id: clientId,
  //                 name: clientData.name || "Unknown Client",
  //                 email: clientData.email,
  //               };
  //             } else {
  //               clientsData[clientId] = {
  //                 id: clientId,
  //                 name: "Failed to load",
  //               };
  //             }
  //           } catch (error) {
  //             console.error(`Error fetching client ${clientId}:`, error);
  //             clientsData[clientId] = {
  //               id: clientId,
  //               name: "Failed to load",
  //             };
  //           }
  //         })
  //       );

  //       setClientsMap(clientsData);
  //     } catch (error) {
  //       console.error("Error fetching client details:", error);
  //     }
  //   };

  // Define columns
  const baseColumns = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }: any) => <div>{row.original.id}</div>,
    },
    {
      accessorKey: "stock_code",
      header: "Titre",
      cell: ({ row }: any) => (
        <div className="flex flex-col">
          <span className="font-medium">{row.original.stock_code}</span>
          <span className="text-xs text-gray-500">
            {row.original.stock_issuer_nom}
          </span>
        </div>
      ),
    },
    {
      accessorKey: "client_nom",
      header: t("myOrders.client"),
      cell: ({ row }: any) => <div>{row.original.client_nom}</div>,
    },
    {
      accessorKey: "market_type",
      header: t("myOrders.marketType"),
      cell: ({ row }: any) => (
        <div className="capitalize">
          {row.original.market_type === "P" ? "Primaire" : "Secondaire"}
        </div>
      ),
    },
    {
      accessorKey: "quantity",
      header: t("myOrders.quantity"),
      cell: ({ row }: any) => <div>{row.original.quantity}</div>,
    },
    {
      accessorKey: "price",
      header: t("myOrders.price"),
      cell: ({ row }: any) => <div>{row.original.price} DA</div>,
    },

    // {
    //   accessorKey: "time_condition",
    //   header: t("myOrders.timeCondition"),
    //   cell: ({ row }: any) => <div>{row.original.time_condition}</div>,
    // },
    // {
    //   accessorKey: "quantitative_condition",
    //   header: t("myOrders.executionType"),
    //   cell: ({ row }: any) => <div>{row.original.quantitative_condition}</div>,
    // },
    {
      accessorKey: "status",
      header: t("myOrders.status.status"),
      cell: ({ row }: any) => {
        const statusMap: Record<string, { text: string; color: string }> = {
          "premiere-validation": {
            text: t("myOrders.status.premiereValidation"),
            color: "text-blue-600",
          },
          "validation-finale": {
            text: t("myOrders.status.validationFinale"),
            color: "text-green-600",
          },
          "validation-retour-premiere": {
            text: t("myOrders.status.validationRetourPremiere"),
            color: "text-amber-600",
          },
          "validation-retour-finale": {
            text: t("myOrders.status.validationRetourFinale"),
            color: "text-yellow-600",
          },
          "validation-tcc-premiere": {
            text: t("myOrders.status.validationTccPremiere"),
            color: "text-cyan-600",
          },
          "validation-tcc-finale": {
            text: t("myOrders.status.validationTccFinale"),
            color: "text-pink-600",
          },
          "validation-tcc-retour-premiere": {
            text: t("myOrders.status.validationTccRetourPremiere"),
            color: "text-purple-600",
          },
          "validation-tcc-retour-finale": {
            text: t("myOrders.status.validationTccRetourFinale"),
            color: "text-yellow-600",
          },
          execution: {
            text: t("myOrders.status.execution"),
            color: "text-purple-600",
          },
          resultats: {
            text: t("myOrders.status.resultats"),
            color: "text-gray-600",
          },
          "final-state": {
            text: t("myOrders.status.finalState"),
            color: "text-green-600",
          },
        };

        const statusInfo = statusMap[row.original.status] || {
          text: row.original.status,
          color: "text-gray-600",
        };

        return <span className={statusInfo.color}>{statusInfo.text}</span>;
      },
    },
  ];

  // Define market-specific columns
  const primaryMarketColumns = [
    {
      accessorKey: "operation_type",
      header: t("myOrders.operationType"),
      cell: ({ row }: any) => (
        <div className="capitalize">
          {row.original.operation_type === "A" ? "Achat" : "Vente"}
        </div>
      ),
    },
  ];

  const secondaryMarketColumns = [
    {
      accessorKey: "time_condition",
      header: t("myOrders.timeCondition"),
      cell: ({ row }: any) => <div>{row.original.time_condition}</div>,
    },
    {
      accessorKey: "quantitative_condition",
      header: t("myOrders.executionType"),
      cell: ({ row }: any) => <div>{row.original.quantitative_condition}</div>,
    },
  ];

  const getColumns = () => {
    if (marketType === "P") {
      return [...baseColumns, ...primaryMarketColumns];
    }
    return [...baseColumns, ...secondaryMarketColumns];
  };

  const table = useReactTable({
    data,
    columns: getColumns(),
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <div className="rounded-md border">
      <div className="flex justify-between items-center p-2 border-b">
        {/* Tabs à gauche */}
        <div className="flex items-center gap-0">
          <Button
            variant={marketType === "S" ? "default" : "outline"}
            size="sm"
            className="rounded-r-none"
            onClick={() => {
              const params = new URLSearchParams(window.location.search);
              params.set("tab", "all");
              params.set("marketType", "S");
              params.set("page", "0");
              window.location.search = params.toString();
            }}
          >
            Carnet d'ordres
          </Button>
          <Button
            variant={marketType === "P" ? "default" : "outline"}
            size="sm"
            className="rounded-l-none"
            onClick={() => {
              const params = new URLSearchParams(window.location.search);
              params.set("tab", "souscriptions");
              params.set("marketType", "P");
              params.set("page", "0");
              window.location.search = params.toString();
            }}
          >
            Souscriptions
          </Button>
        </div>
        {/* Refresh à droite */}
        <Button
          variant="outline"
          size="sm"
          onClick={() => fetchOrdersData()}
          disabled={loading}
          className="flex items-center gap-1"
        >
          <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>
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
      ) : error ? (
        <div className="text-center p-10 flex flex-col items-center justify-center text-gray-500">
          <AlertTriangle className="h-10 w-10 mb-2" />
          <h3 className="text-lg font-medium">Error loading orders</h3>
          <p className="text-sm max-w-xs mx-auto mt-1">{error}</p>
        </div>
      ) : data.length === 0 ? (
        <div className="text-center p-10 flex flex-col items-center justify-center text-gray-500">
          <List className="h-10 w-10 mb-2" />
          <h3 className="text-lg font-medium">Aucune donnée disponible</h3>
          <p className="text-sm max-w-xs mx-auto mt-1">
            Aucun ordre trouvé pour les critères sélectionnés.
          </p>
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
                  className={`cursor-pointer hover:bg-gray-50 ${
                    selectedOrder?.id === row.original.id ? "bg-blue-50" : ""
                  }`}
                  onClick={() => {
                    setSelectedOrder(row.original);
                    setDialogOpen(true);
                  }}
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
                  colSpan={table.getVisibleLeafColumns().length}
                  className="h-24 text-center"
                >
                  <div className="flex items-center justify-center">
                    <List className="w-4 h-4 mr-2" />
                    No rows to display
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}
      <OrderDetailsDialog
        order={selectedOrder}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}
