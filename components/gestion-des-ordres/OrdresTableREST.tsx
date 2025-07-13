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
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import {
  List,
  AlertTriangle,
  Printer,
  RefreshCw,
  CheckCircle,
  MessageSquare,
  XCircle,
  X,
} from "lucide-react";
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
import { Input } from "@/components/ui/input";
import { createPortal } from "react-dom";
import { TitreDetails } from "@/components/titres/TitreDetails";
import { OrderDetailsDialog } from "@/components/order-history/OrderDetailsDialog";
import { TitreFormValues } from "@/components/titres/titreSchemaValidation";
import { Checkbox } from "@/components/ui/checkbox";

// API base URL with fallback - using MENU_ORDER for order management
const API_BASE =
  (process.env.NEXT_PUBLIC_MENU_ORDER || "https://poc.finnetude.com") +
  "/api/v1";

console.log("Using API Base URL:", API_BASE);

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
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedOrderForDetails, setSelectedOrderForDetails] =
    useState<OrderElement | null>(null);
  const [companies, setCompanies] = useState<{ id: string; name: string }[]>(
    []
  );
  const [institutions, setInstitutions] = useState<
    { id: string; name: string }[]
  >([]);
  const [loadingDetails, setLoadingDetails] = useState(true);

  // State pour la sélection multiple
  const [selectedOrders, setSelectedOrders] = useState<number[]>([]);

  // Handler pour sélectionner/désélectionner tout
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedOrders(data.map((order) => order.id));
    } else {
      setSelectedOrders([]);
    }
  };

  // Handler pour sélectionner/désélectionner une ligne
  const handleSelectRow = (id: number, checked: boolean) => {
    setSelectedOrders((prev) =>
      checked ? [...prev, id] : prev.filter((orderId) => orderId !== id)
    );
  };

  // Handler pour valider/refuser la sélection - maintenant géré par handleBulkConfirm
  // Fonction supprimée pour éviter les alerts non désirées

  // State pour le dialog de motif groupé
  const [bulkDialogOpen, setBulkDialogOpen] = useState<
    null | "validate" | "reject"
  >(null);
  const [bulkMotif, setBulkMotif] = useState("");
  const motifInputRef = useRef<HTMLInputElement | null>(null);

  // Handler pour valider/refuser la sélection avec motif
  const handleBulkConfirm = async () => {
    console.log("handleBulkConfirm called with", {
      bulkDialogOpen,
      selectedOrders,
    });
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
      // Store the action type before closing dialog
      const actionType = bulkDialogOpen === "validate" ? "validate" : "reject";
      setBulkDialogOpen(null);

      // Process orders one by one
      let successCount = 0;
      let failCount = 0;

      for (const orderId of selectedOrders) {
        try {
          const result = await orderService.processOrderActionWithReason(
            restToken,
            orderId,
            taskID,
            actionType,
            bulkMotif
          );

          if (result.success) {
            successCount++;
          } else {
            failCount++;
          }
        } catch (err) {
          console.error(`Error processing order ${orderId}:`, err);
          failCount++;
        }
      }

      // Show success message
      if (successCount > 0) {
        toast({
          title: "Success",
          description: `${successCount} ordre(s) traité(s) avec succès${
            failCount > 0 ? `. ${failCount} échec(s).` : ""
          }`,
        });
      } else if (failCount > 0) {
        toast({
          title: "Error",
          description: `Échec de traitement pour ${failCount} ordre(s).`,
          variant: "destructive",
        });
      }

      // Refresh orders
      await fetchOrdersData();
    } catch (err) {
      console.error(`Error during bulk action:`, err);
      toast({
        title: "Error",
        description: `L'action groupée a échoué. Veuillez réessayer.`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
      setBulkMotif("");
      setSelectedOrders([]);
    }
  };

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

  // Results submission dialog state (for execution page)
  const [isResultsDialogOpen, setIsResultsDialogOpen] = useState(false);
  const [selectedOrderForResults, setSelectedOrderForResults] =
    useState<OrderElement | null>(null);
  const [responseForm, setResponseForm] = useState({
    quantite: "",
    prix: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initial fetch on component mount
  useEffect(() => {
    // Always fetch actual data from API regardless of page type
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
            setLoading(false);
            return;
          } else if (directData && directData.elements) {
            // Handle flat structure
            setData(directData.elements);
            setActions(directData.actions || []);
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
        }
      }
    } catch (err) {
      console.error("Error in fetchOrdersData:", err);
      // Use example data on error
      setData(exampleOrders);
      setActions(["validate", "reject"]);
      setLoading(false);
    }
  };

  // Open action dialog
  const openActionDialog = (orderId: number, action: string) => {
    if (action === "submit") {
      // Find the order for results submission
      const order = data.find((o) => o.id === orderId);
      if (order) {
        setSelectedOrderForResults(order);
        setResponseForm({
          quantite: order.quantity?.toString() || "",
          prix: order.price?.toString() || "",
        });
        setIsResultsDialogOpen(true);
      }
    } else {
      // Handle regular actions (validate/reject)
      setCurrentAction({
        orderId,
        action,
        motif: "",
      });
      setActionDialogOpen(true);
    }
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

  // Handle results submission for execution page
  const handleResultsSubmit = async () => {
    try {
      if (!selectedOrderForResults) return;

      const restToken = (session.data?.user as any)?.restToken;
      if (!restToken) {
        toast({
          title: "Error",
          description: "No authentication token available",
          variant: "destructive",
        });
        return;
      }

      setIsSubmitting(true);

      // Here you would call the API to submit the execution results
      // For now, I'll use a placeholder API call structure
      const BACKEND_API =
        (process.env.NEXT_PUBLIC_MENU_ORDER || "https://poc.finnetude.com") +
        "/api/v1";

      const response = await fetch(`${BACKEND_API}/order/submit-results`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${restToken}`,
        },
        body: JSON.stringify({
          orderId: selectedOrderForResults.id,
          executedQuantity: parseInt(responseForm.quantite),
          executionPrice: parseFloat(responseForm.prix),
          taskID,
        }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Résultats d'exécution soumis avec succès",
        });
        setIsResultsDialogOpen(false);
        setResponseForm({ quantite: "", prix: "" });
        await fetchOrdersData();
      } else {
        throw new Error("Failed to submit results");
      }
    } catch (err) {
      console.error("Error submitting results:", err);
      toast({
        title: "Error",
        description: "Échec de soumission des résultats",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
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
      accessorKey: "stock_code",
      header: "Titre",
      cell: ({ row }: any) => {
        const stockCode = row.original.stock_code;
        const issuerName = row.original.stock_issuer_nom;
        return (
          <div className="flex flex-col">
            <span className="font-medium">{stockCode || "N/A"}</span>
            <span className="text-xs text-gray-500">{issuerName || "N/A"}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "client_nom",
      header: "Client",
      cell: ({ row }: any) => {
        const clientName = row.original.client_nom;
        return <div>{clientName || "N/A"}</div>;
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
      accessorKey: "status",
      header: "Statut",
      cell: ({ row }: any) => {
        const status = row.original.status;
        const getStatusLabel = (status: string) => {
          switch (status) {
            case "E":
              return "En attente";
            case "F":
              return "Finalisé";
            case "pending":
              return "En attente";
            case "validated":
              return "Validé";
            case "rejected":
              return "Rejeté";
            default:
              return status;
          }
        };

        const getStatusColor = (status: string) => {
          switch (status) {
            case "E":
            case "pending":
              return "bg-yellow-100 text-yellow-800";
            case "F":
            case "validated":
              return "bg-green-100 text-green-800";
            case "rejected":
              return "bg-red-100 text-red-800";
            default:
              return "bg-gray-100 text-gray-800";
          }
        };

        return (
          <span
            className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
              status
            )}`}
          >
            {getStatusLabel(status)}
          </span>
        );
      },
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
        const isReturnValidationPage =
          pageType === "validationRetourFinale" ||
          pageType === "tccvalidationRetour";
        const isExecutionPage = pageType === "orderExecution";

        return (
          <div className="flex items-center space-x-2">
            {/* For execution page with souscriptions, handle status-based buttons */}
            {isExecutionPage && marketType === "P" ? (
              <>
                {order.status === "E" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-green-50 hover:bg-green-100 text-green-700 border-green-300 hover:border-green-400 transition-colors"
                    onClick={() => openActionDialog(order.id, "validate")}
                  >
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                )}
                {order.status === "F" && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-blue-50 hover:bg-blue-100 text-blue-700 border-blue-300 hover:border-blue-400 transition-colors"
                    onClick={() => openActionDialog(order.id, "submit")}
                  >
                    <MessageSquare className="h-4 w-4" />
                  </Button>
                )}
              </>
            ) : (
              /* Default action buttons for other pages */
              <>
                {actions.includes("validate") && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-green-50 hover:bg-green-100 text-green-700 border-green-300 hover:border-green-400 transition-colors"
                    onClick={() => openActionDialog(order.id, "validate")}
                  >
                    <CheckCircle className="h-4 w-4" />
                  </Button>
                )}
                {actions.includes("reject") && (
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-red-50 hover:bg-red-100 text-red-700 border-red-300 hover:border-red-400 transition-colors"
                    onClick={() => openActionDialog(order.id, "reject")}
                  >
                    <XCircle className="h-4 w-4" />
                  </Button>
                )}
              </>
            )}
          </div>
        );
      },
    },
    {
      id: "details",
      header: "",
      cell: ({ row }: any) => {
        const order = row.original;
        return (
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDetailsClick(order)}
          >
            <List className="h-4 w-4" />
          </Button>
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

  // Utilitaire pour transformer un OrderElement en TitreFormValues
  function mapOrderElementToTitreFormValues(
    order: OrderElement
  ): TitreFormValues {
    return {
      id: order.id.toString(),
      name: order.stock_issuer_nom || "N/A",
      issuer: order.stock_issuer_nom || "N/A",
      isinCode: order.stock_code || "N/A",
      code: order.stock_code || "N/A",
      faceValue: 0,
      quantity: order.quantity || 0,
      emissionDate: new Date(),
      closingDate: new Date(),
      enjoymentDate: new Date(),
      marketListing: "ALG",
      type: "action",
      stockType: "action",
      status: "activated",
      dividendRate: undefined,
      capitalOperation: undefined,
      maturityDate: undefined,
      durationYears: undefined,
      commission: undefined,
      shareClass: undefined,
      votingRights: undefined,
      master: undefined,
      institutions: undefined,
      stockPrice: {
        price: order.price || 0,
        date: new Date(),
        gap: 0,
      },
      capitalRepaymentSchedule: [],
      couponSchedule: [],
    };
  }

  // Charger les données des entreprises et institutions
  useEffect(() => {
    setTimeout(() => {
      setCompanies([
        { id: "1", name: "Company A" },
        { id: "2", name: "Company B" },
      ]);
      setInstitutions([
        { id: "1", name: "Institution X" },
        { id: "2", name: "Institution Y" },
      ]);
      setLoadingDetails(false);
    }, 500);
  }, []);

  const handleDetailsClick = (order: OrderElement) => {
    setSelectedOrderForDetails(order);
    setIsDetailsModalOpen(true);
  };

  // Données d'exemple pour les tests
  const exampleOrders: OrderElement[] = [
    {
      id: 1,
      stock_id: "STOCK001",
      client_id: "CLIENT001",
      market_type: "P",
      quantity: 1000,
      price: 1500.5,
      time_condition: "GTC",
      quantitative_condition: "All or None",
      status: "pending",
    },
    {
      id: 2,
      stock_id: "STOCK002",
      client_id: "CLIENT002",
      market_type: "S",
      quantity: 500,
      price: 2750.75,
      time_condition: "IOC",
      quantitative_condition: "Partial",
      status: "validated",
    },
    {
      id: 3,
      stock_id: "STOCK003",
      client_id: "CLIENT003",
      market_type: "P",
      quantity: 2000,
      price: 890.25,
      time_condition: "FOK",
      quantitative_condition: "All or None",
      status: "completed",
    },
    {
      id: 4,
      stock_id: "STOCK004",
      client_id: "CLIENT004",
      market_type: "S",
      quantity: 750,
      price: 3200.0,
      time_condition: "GTC",
      quantitative_condition: "Partial",
      status: "pending",
    },
    {
      id: 5,
      stock_id: "STOCK005",
      client_id: "CLIENT005",
      market_type: "P",
      quantity: 1500,
      price: 1200.75,
      time_condition: "IOC",
      quantitative_condition: "All or None",
      status: "validated",
    },
  ];

  return (
    <>
      <div className="rounded-md border">
        <div className="flex justify-between items-center p-2 border-b">
          {/* Actions groupées (texte) à gauche */}
          {(taskID === "validation-tcc-finale" ||
            pageType === "tccFinalValidation") &&
            data.length > 0 && (
              <div className="flex gap-2">
                {actions.includes("validate") && (
                  <Button
                    variant="outline"
                    className="bg-green-50 hover:bg-green-100 text-green-700 border-green-300 hover:border-green-400 transition-colors text-base p-2"
                    onClick={() => setBulkDialogOpen("validate")}
                    disabled={selectedOrders.length === 0}
                  >
                    <CheckCircle className="h-5 w-5" />
                  </Button>
                )}
                {actions.includes("reject") && (
                  <Button
                    variant="outline"
                    className="bg-red-50 hover:bg-red-100 text-red-700 border-red-300 hover:border-red-400 transition-colors text-sm p-2"
                    onClick={() => setBulkDialogOpen("reject")}
                    disabled={selectedOrders.length === 0}
                  >
                    <XCircle className="h-5 w-5" />
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="text-sm font-normal p-2"
                  onClick={() => {
                    if (selectedOrders.length === data.length) {
                      setSelectedOrders([]);
                    } else {
                      setSelectedOrders(data.map((order) => order.id));
                    }
                  }}
                >
                  {selectedOrders.length === data.length
                    ? "Deselectionner"
                    : "Tout selectionner"}
                </Button>
              </div>
            )}
          {/* Refresh Button à droite */}
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
            <div className="mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setData(exampleOrders);
                  setActions(["validate", "reject"]);
                  setError(null);
                }}
              >
                Charger des exemples
              </Button>
            </div>
          </div>
        ) : data.length === 0 ? (
          <div className="text-center p-10 flex flex-col items-center justify-center text-gray-500">
            <List className="h-10 w-10 mb-2" />
            <h3 className="text-lg font-medium">Aucune donnée disponible</h3>
            <p className="text-sm max-w-xs mx-auto mt-1">
              Aucun ordre trouvé pour les critères sélectionnés.
            </p>
            <div className="mt-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setData(exampleOrders);
                  setActions(["validate", "reject"]);
                }}
              >
                Charger des exemples
              </Button>
            </div>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                {/* Checkbox header */}
                {(taskID === "validation-tcc-finale" ||
                  pageType === "tccFinalValidation") && (
                  <TableHead>
                    <Checkbox
                      checked={
                        selectedOrders.length === data.length && data.length > 0
                      }
                      onCheckedChange={handleSelectAll}
                      aria-label="Tout sélectionner"
                    />
                  </TableHead>
                )}
                {table.getHeaderGroups()[0].headers.map((header) => (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {/* Checkbox row */}
                    {(taskID === "validation-tcc-finale" ||
                      pageType === "tccFinalValidation") && (
                      <TableCell>
                        <Checkbox
                          checked={selectedOrders.includes(row.original.id)}
                          onCheckedChange={(checked) =>
                            handleSelectRow(row.original.id, !!checked)
                          }
                          aria-label={`Sélectionner l'ordre ${row.original.id}`}
                        />
                      </TableCell>
                    )}
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
                : currentAction.action === "submit"
                ? "Soumettre les résultats"
                : "Rejeter l'ordre"}
            </DialogTitle>
            <DialogDescription>
              {currentAction.action === "validate"
                ? "Veuillez fournir un motif pour la validation de cet ordre."
                : currentAction.action === "reject"
                ? "Veuillez fournir un motif pour le rejet de cet ordre."
                : currentAction.action === "submit"
                ? "Veuillez fournir les détails des résultats à soumettre."
                : "Veuillez fournir un motif pour le rejet de cet ordre."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="motif">
                {currentAction.action === "submit" ? "Résultats" : "Motif"}
              </Label>
              <Textarea
                id="motif"
                placeholder={
                  currentAction.action === "submit"
                    ? "Entrez les résultats ici..."
                    : "Entrez le motif ici..."
                }
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

      {/* Dialog de motif pour action groupée */}
      <Dialog
        open={!!bulkDialogOpen}
        onOpenChange={(open) => {
          if (!open) setBulkDialogOpen(null);
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {bulkDialogOpen === "validate"
                ? "Valider la sélection"
                : bulkDialogOpen === "reject"
                ? "Refuser la sélection"
                : ""}
            </DialogTitle>
            <DialogDescription>
              {bulkDialogOpen === "validate"
                ? "Veuillez fournir un motif pour la validation de tous les ordres sélectionnés."
                : bulkDialogOpen === "reject"
                ? "Veuillez fournir un motif pour le refus de tous les ordres sélectionnés."
                : ""}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="motif-bulk">Motif</Label>
              <Textarea
                id="motif-bulk"
                placeholder="Entrez le motif ici..."
                value={bulkMotif}
                onChange={(e) => setBulkMotif(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-between">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setBulkDialogOpen(null)}
            >
              Annuler
            </Button>
            <Button
              type="button"
              onClick={handleBulkConfirm}
              disabled={!bulkMotif.trim()}
            >
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Results Submission Dialog (for execution page) */}
      <Dialog open={isResultsDialogOpen} onOpenChange={setIsResultsDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Soumettre le résultat d'exécution</DialogTitle>
            <DialogDescription>
              Ordre ID: {selectedOrderForResults?.id}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="quantite" className="text-right">
                Quantité exécutée
              </Label>
              <Input
                id="quantite"
                type="number"
                value={responseForm.quantite}
                onChange={(e) =>
                  setResponseForm({ ...responseForm, quantite: e.target.value })
                }
                className="col-span-3"
                placeholder={
                  selectedOrderForResults?.quantity?.toString() || ""
                }
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="prix" className="text-right">
                Prix d'exécution
              </Label>
              <Input
                id="prix"
                type="number"
                step="0.01"
                value={responseForm.prix}
                onChange={(e) =>
                  setResponseForm({ ...responseForm, prix: e.target.value })
                }
                className="col-span-3"
                placeholder={selectedOrderForResults?.price?.toString() || ""}
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-between">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsResultsDialogOpen(false)}
            >
              Annuler
            </Button>
            <Button
              type="submit"
              onClick={handleResultsSubmit}
              disabled={isSubmitting}
            >
              {isSubmitting ? "Soumission..." : "Soumettre"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {isDetailsModalOpen && selectedOrderForDetails && !loadingDetails && (
        <OrderDetailsDialog
          order={selectedOrderForDetails}
          open={isDetailsModalOpen}
          onOpenChange={setIsDetailsModalOpen}
        />
      )}
      {isDetailsModalOpen && loadingDetails && (
        <div className="fixed inset-0 z-[1000] flex items-center justify-center">
          <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative text-center">
            Chargement des détails...
          </div>
        </div>
      )}
    </>
  );
}
