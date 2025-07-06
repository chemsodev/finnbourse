"use client";
/**
 * OrdresTableREST.tsx
 * -----------------------
 * Table component for orders using REST API
 * Uses REST token for authentication
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
import { List, AlertTriangle, Printer, RefreshCw, CheckCircle, MessageSquare } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { OrderElement } from "@/lib/services/orderService";
import { useToast } from "@/hooks/use-toast";
import orderService from "@/lib/services/orderService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

// API base URL with fallback
const API_BASE =
  process.env.NEXT_PUBLIC_BACKEND_URL || "https://kh.finnetude.com/api/v1";

console.log("Using API Base URL:", API_BASE);

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

interface OrdresTableRESTProps {
  searchquery?: string;
  taskID: string;
  marketType?: string;
  pageType: string;
  activeTab?: string;
  activeAction?: string;
  searchqueryParam?: string;
  stateParam?: string;
}

export default function OrdresTableREST({
  searchquery,
  taskID,
  marketType = "S",
  pageType,
  activeTab,
  activeAction,
  searchqueryParam,
  stateParam,
}: OrdresTableRESTProps) {
  const session = useSession();
  const t = useTranslations("mesOrdres");
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [data, setData] = useState<OrderElement[]>([]);
  const [actions, setActions] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const [stocksMap, setStocksMap] = useState<Record<string, StockDetails>>({});
  const [clientsMap, setClientsMap] = useState<Record<string, ClientDetails>>(
    {}
  );

  // Validate taskID
  useEffect(() => {
    console.log("Current taskID:", taskID);
    if (!taskID) {
      console.error("No taskID provided");
      setError("No taskID provided");
      setLoading(false);
    }
  }, [taskID]);

  // Action dialog state
  const [actionDialogOpen, setActionDialogOpen] = useState(false);
  const [currentAction, setCurrentAction] = useState<{
    orderId: number;
    action: string;
    motif: string;
  }>({ orderId: 0, action: "", motif: "" });

  // Initial fetch on component mount
  useEffect(() => {
    fetchOrdersData();
  }, [session, taskID, marketType, toast]);

  // Fetch orders from API
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
        const directResponse = await fetch(`${BACKEND_API}/order/list`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${restToken}`,
          },
          body: JSON.stringify({
            marketType,
            taskID,
          }),
        });

        if (directResponse.ok) {
          const directData = await directResponse.json();

          // Process the direct response
          if (directData && directData.data && directData.data.elements) {
            // Handle nested structure
            setData(directData.data.elements);
            setActions(directData.data.actions || []);

            // Process stock and client IDs
            const elements = directData.data.elements || [];
            const stockIds = Array.from(
              new Set(
                elements.map((order: any) => order.stock_id).filter(Boolean)
              )
            ) as string[];
            const clientIds = Array.from(
              new Set(
                elements.map((order: any) => order.client_id).filter(Boolean)
              )
            ) as string[];

            if (stockIds.length > 0) {
              fetchStockDetails(stockIds, restToken);
            }

            if (clientIds.length > 0) {
              fetchClientDetails(clientIds, restToken);
            }

            setLoading(false);
            return;
          } else if (directData && directData.elements) {
            // Handle flat structure
            setData(directData.elements);
            setActions(directData.actions || []);

            // Process stock and client IDs
            const elements = directData.elements || [];
            const stockIds = Array.from(
              new Set(
                elements.map((order: any) => order.stock_id).filter(Boolean)
              )
            ) as string[];
            const clientIds = Array.from(
              new Set(
                elements.map((order: any) => order.client_id).filter(Boolean)
              )
            ) as string[];

            if (stockIds.length > 0) {
              fetchStockDetails(stockIds, restToken);
            }

            if (clientIds.length > 0) {
              fetchClientDetails(clientIds, restToken);
            }

            setLoading(false);
            return;
          }
        }
      } catch (directError) {
        console.error("Error in direct API call:", directError);
      }

      // If direct fetch failed, try using the service
      const result = await orderService.fetchOrders(
        restToken,
        taskID,
        marketType
      );

      // Always set loading to false after receiving response
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
          setActions([]);
        } else {
          // Force data to be set even if elements appears to be empty
          const elements = result.data.elements || [];
          setData(elements);
          setActions(
            Array.isArray(result.data.actions) ? result.data.actions : []
          );

          // Extract unique stock IDs and client IDs
          const stockIdsSet = new Set(
            elements
              .map((order: OrderElement) => order.stock_id)
              .filter(Boolean)
          );
          const clientIdsSet = new Set(
            elements
              .map((order: OrderElement) => order.client_id)
              .filter(Boolean)
          );

          const stockIds = Array.from(stockIdsSet);
          const clientIds = Array.from(clientIdsSet);

          // Fetch stock details
          if (stockIds.length > 0) {
            fetchStockDetails(stockIds, restToken);
          }

          // Fetch client details
          if (clientIds.length > 0) {
            fetchClientDetails(clientIds, restToken);
          }
        }
      }
    } catch (err) {
      console.error("Error fetching orders:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
      toast({
        title: "Error",
        description: "Failed to load orders. Please try again.",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  // Fetch stock details
  const fetchStockDetails = async (stockIds: string[], token: string) => {
    try {
      const stocksData: Record<string, StockDetails> = {};

      // For each stock ID, fetch details
      await Promise.all(
        stockIds.map(async (stockId) => {
          if (!stockId) return; // Skip if stockId is null or undefined

          try {
            // Direct fetch from backend API
            const backendUrl =
              process.env.NEXT_PUBLIC_BACKEND_URL ||
              "https://kh.finnetude.com/api/v1";
            const response = await fetch(`${backendUrl}/stock/${stockId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (response.ok) {
              const stockData = await response.json();
              stocksData[stockId] = {
                id: stockId,
                code: stockData.code || "N/A",
                name: stockData.name || "Unknown Stock",
                type: stockData.type,
              };
            } else {
              stocksData[stockId] = {
                id: stockId,
                code: "Error",
                name: "Failed to load",
              };
            }
          } catch (error) {
            console.error(`Error fetching stock ${stockId}:`, error);
            stocksData[stockId] = {
              id: stockId,
              code: "Error",
              name: "Failed to load",
            };
          }
        })
      );

      setStocksMap(stocksData);
    } catch (error) {
      console.error("Error fetching stock details:", error);
    }
  };

  // Fetch client details
  const fetchClientDetails = async (clientIds: string[], token: string) => {
    try {
      const clientsData: Record<string, ClientDetails> = {};

      // For each client ID, fetch details
      await Promise.all(
        clientIds.map(async (clientId) => {
          if (!clientId) return; // Skip if clientId is null or undefined

          try {
            // Direct fetch from backend API
            const backendUrl =
              process.env.NEXT_PUBLIC_BACKEND_URL ||
              "https://kh.finnetude.com/api/v1";
            const response = await fetch(`${backendUrl}/client/${clientId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            });

            if (response.ok) {
              const clientData = await response.json();
              clientsData[clientId] = {
                id: clientId,
                name: clientData.name || "Unknown Client",
                email: clientData.email,
              };
            } else {
              clientsData[clientId] = {
                id: clientId,
                name: "Failed to load",
              };
            }
          } catch (error) {
            console.error(`Error fetching client ${clientId}:`, error);
            clientsData[clientId] = {
              id: clientId,
              name: "Failed to load",
            };
          }
        })
      );

      setClientsMap(clientsData);
    } catch (error) {
      console.error("Error fetching client details:", error);
    }
  };

  // Open action dialog
  const openActionDialog = (orderId: number, action: string) => {
    setCurrentAction({
      orderId,
      action,
      motif: "",
    });
    setActionDialogOpen(true);
  };

  // Handle action with reason
  const handleActionWithReason = async () => {
    try {
      const restToken = (session.data?.user as any)?.restToken;
      if (!restToken) {
        toast({
          title: "Error",
          description: "No authentication token available",
          variant: "destructive",
        });
        return;
      }

      setLoading(true);
      setActionDialogOpen(false);

      const result = await orderService.processOrderActionWithReason(
        restToken,
        currentAction.orderId,
        taskID,
        currentAction.action,
        currentAction.motif
      );

      if (result.success) {
        toast({
          title: "Success",
          description: "Action effectuée avec succès",
        });

        // Refresh orders
        await fetchOrdersData();
      } else {
        toast({
          title: "Error",
          description: result.message,
          variant: "destructive",
        });
      }
    } catch (err) {
      console.error(`Error during action:`, err);
      toast({
        title: "Error",
        description: `L'action a échoué. Veuillez réessayer.`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Define columns
  const columns = [
    {
      accessorKey: "id",
      header: "ID",
      cell: ({ row }: any) => <div>{row.original.id}</div>,
    },
    {
      accessorKey: "stock_id",
      header: "Titre",
      cell: ({ row }: any) => {
        const stockId = row.original.stock_id;
        const stock = stocksMap[stockId];
        return (
          <div className="flex flex-col">
            <span className="font-medium">
              {stock?.code || `ID: ${stockId || "N/A"}`}
            </span>
            <span className="text-xs text-gray-500">
              {stock?.name || "Loading..."}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "client_id",
      header: "Client",
      cell: ({ row }: any) => {
        const clientId = row.original.client_id;
        const client = clientsMap[clientId];
        return <div>{client?.name || `Client ID: ${clientId || "N/A"}`}</div>;
      },
    },
    {
      accessorKey: "market_type",
      header: "Marché",
      cell: ({ row }: any) => (
        <div className="capitalize">
          {row.original.market_type === "P" ? "Primaire" : "Secondaire"}
        </div>
      ),
    },
    {
      accessorKey: "quantity",
      header: t("qte"),
      cell: ({ row }: any) => <div>{row.original.quantity}</div>,
    },
    {
      accessorKey: "price",
      header: t("prix"),
      cell: ({ row }: any) => <div>{row.original.price} DA</div>,
    },
    {
      accessorKey: "time_condition",
      header: "Condition",
      cell: ({ row }: any) => <div>{row.original.time_condition}</div>,
    },
    {
      accessorKey: "quantitative_condition",
      header: "Type d'exécution",
      cell: ({ row }: any) => <div>{row.original.quantitative_condition}</div>,
    },
    {
      id: "actions",
      header: t("actions"),
      cell: ({ row }: any) => {
        const order = row.original;
        const isReturnValidationPage = pageType === "validationRetour" || pageType === "tccValidationRetour";
        
        return (
          <div className="flex items-center space-x-2">
            {isReturnValidationPage ? (
              // Pour les pages de validation du retour, afficher un bouton pour voir les détails et réponses
              <Button
                variant="outline"
                size="sm"
                className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-200"
                onClick={() => {
                  // Ici on pourrait ouvrir un modal ou naviguer vers une page de détails
                  console.log("Voir détails et réponses pour l'ordre:", order.id);
                }}
              >
                <MessageSquare className="h-4 w-4 mr-1" />
                Voir Détails
              </Button>
            ) : (
              // Pour les autres pages, afficher les boutons d'action normaux
              <>
                {actions.includes("validate") && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => openActionDialog(order.id, "validate")}
                  >
                    Valider
                  </Button>
                )}
                {actions.includes("reject") && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-red-600 border-red-600 hover:bg-red-50"
                    onClick={() => openActionDialog(order.id, "reject")}
                  >
                    Rejeter
                  </Button>
                )}
                {actions.includes("cancel") && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-gray-600 border-gray-600 hover:bg-gray-50"
                    onClick={() => openActionDialog(order.id, "cancel")}
                  >
                    Annuler
                  </Button>
                )}
              </>
            )}
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
  });

  return (
    <>
      <div className="rounded-md border">
        {taskID !== "validation-tcc-retour" && (
          <div className="flex justify-between items-center p-2 border-b">
            {/* Market Type Tabs - Left side */}
            <div className="flex items-center gap-0">
              <Button
                variant={activeTab === "all" ? "default" : "outline"}
                size="sm"
                className="rounded-r-none"
                onClick={() => {
                  const params = new URLSearchParams(searchParams);
                  params.set("tab", "all");
                  params.set("marketType", "S");
                  params.set("page", "0");
                  router.replace(`${pathname}?${params.toString()}`);
                }}
              >
                Carnet d'ordres
              </Button>
              <Button
                variant={activeTab === "souscriptions" ? "default" : "outline"}
                size="sm"
                className="rounded-l-none"
                onClick={() => {
                  const params = new URLSearchParams(searchParams);
                  params.set("tab", "souscriptions");
                  params.set("marketType", "P");
                  params.set("page", "0");
                  router.replace(`${pathname}?${params.toString()}`);
                }}
              >
                Souscriptions
              </Button>
            </div>

            {/* Refresh Button - Right side */}
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
        )}

        {taskID === "validation-tcc-retour" && (
          <div className="flex justify-end items-center p-2 border-b">
            {/* Refresh Button only for validation-tcc-retour */}
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
        )}
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
                      No rows to display
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </div>

      {/* Action Dialog */}
      <Dialog open={actionDialogOpen} onOpenChange={setActionDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {currentAction.action === "validate"
                ? "Valider l'ordre"
                : currentAction.action === "reject"
                ? "Rejeter l'ordre"
                : "Annuler l'ordre"}
            </DialogTitle>
            <DialogDescription>
              {currentAction.action === "validate"
                ? "Veuillez fournir un motif pour la validation de cet ordre."
                : currentAction.action === "reject"
                ? "Veuillez fournir un motif pour le rejet de cet ordre."
                : "Veuillez fournir un motif pour l'annulation de cet ordre."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="motif">Motif</Label>
              <Textarea
                id="motif"
                placeholder="Entrez le motif ici..."
                value={currentAction.motif}
                onChange={(e) =>
                  setCurrentAction({ ...currentAction, motif: e.target.value })
                }
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-between">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setActionDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button type="button" onClick={handleActionWithReason}>
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
