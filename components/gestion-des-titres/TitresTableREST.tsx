"use client";

import * as React from "react";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUpDown, ChevronDown, Info, MoreHorizontal } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslations } from "next-intl";
import { formatDate, formatPrice } from "@/lib/utils";
import { Suspense, useState, useEffect } from "react";
import { Stock } from "@/lib/services/stockService";
import { useStockApi } from "@/hooks/useStockApi";
import { useSession } from "next-auth/react";
import { Link } from "@/i18n/routing";
import { useToast } from "@/hooks/use-toast";
import { usePathname } from "next/navigation";
import { TitreDetailsModal } from "./TitreDetailsModal";
import { TitreDetails } from "@/components/titres/TitreDetails";
import { TitreFormValues } from "@/components/titres/titreSchemaValidation";
import { createPortal } from "react-dom";

interface TitresTableProps {
  type: string;
  isPrimary?: boolean; // Added back for compatibility with passation ordre tables
}

export function TitresTableREST({ type, isPrimary = true }: TitresTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const t = useTranslations("TitresTable");
  const [data, setData] = React.useState<Stock[]>([]);
  const { data: session } = useSession();
  const { toast } = useToast();
  const pathname = usePathname();
  const [selectedStock, setSelectedStock] = React.useState<Stock | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = React.useState(false);
  const [companies, setCompanies] = useState<{ id: string; name: string }[]>(
    []
  );
  const [institutions, setInstitutions] = useState<
    { id: string; name: string }[]
  >([]);
  const [loadingDetails, setLoadingDetails] = useState(true);

  // Determine the stock type based on the 'type' prop and 'isPrimary'
  let stockType: "action" = "action";

  // Map common types to API stock types
  if (type === "opv" || type === "action") {
    stockType = "action";
  }

  /**
   * This component now uses the same data fetching mechanism as MarketTable.
   * It calls api.filterStocks with the same parameters, ensuring data consistency
   * between this component and the MarketTable component used in Gestion des Titres.
   */
  const api = useStockApi();
  const [stocks, setStocks] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  // Fetch stocks using the same API as MarketTable
  React.useEffect(() => {
    const fetchStocks = async () => {
      try {
        setLoading(true);
        setError(null);

        // Use the same filterStocks API as MarketTable
        const marketType = isPrimary ? "primaire" : "secondaire";
        const response = await api.filterStocks({
          marketType,
          stockType: stockType,
        });

        setStocks(response || []);
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to fetch stocks";
        setError(errorMessage);
        toast({
          variant: "destructive",
          title: "Error loading stocks",
          description: errorMessage,
        });
        setStocks([]);
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();
  }, [api, stockType, isPrimary, toast]);

  // Extract roleId with type assertion
  const roleId = (session?.user as any)?.roleid;

  // Define your columns for the table
  const columns = (t: (key: string) => string): ColumnDef<Stock>[] => [
    {
      accessorKey: "isinCode",
      header: t("isinCode"),
      cell: ({ row }) => {
        const stock = row.original;
        return (
          <div className="text-xs text-gray-500">{stock.isinCode || "N/A"}</div>
        );
      },
    },
    {
      accessorKey: "issuer",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {t("titre")}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const stock = row.original as any;
        const issuer = stock.issuer;
        const issuerName = typeof issuer === "object" ? issuer?.name : issuer;

        return (
          <div className="capitalize flex flex-col gap-1">
            <div className="font-semibold">
              {issuerName || stock.name || "N/A"}
            </div>
            <div className="uppercase text-gray-500 font-semibold text-xs">
              {stock.code || "N/A"}
            </div>
          </div>
        );
      },
    },

    {
      accessorKey: "faceValue",
      header: t("faceValue"),
      cell: ({ row }) => {
        const stock = row.original;
        return (
          <div className="text-xs text-gray-500">
            {stock.faceValue || "N/A"}
          </div>
        );
      },
    },
    {
      accessorKey: "quantity",
      header: t("quantity"),
      cell: ({ row }) => {
        const stock = row.original;
        return (
          <div className="text-xs text-gray-500">{stock.quantity || "N/A"}</div>
        );
      },
    },
    ...(type !== "action" &&
    type !== "obligation" &&
    type !== "sukukms" &&
    type !== "titresparticipatifsms"
      ? [
          {
            accessorKey: "price",
            header: t("price"),
            cell: ({ row }: { row: { original: Stock } }) => {
              const stock = row.original;
              return (
                <div className="text-sm font-medium text-gray-900">
                  {stock.name || "N/A"}
                </div>
              );
            },
          },
          {
            accessorKey: "emissionDate",
            header: t("ouverture"),
            cell: ({ row }: { row: any }) => {
              const stock = row.original as any;
              return (
                <div className="capitalize">
                  {stock.emissionDate ? formatDate(stock.emissionDate) : "NC"}
                </div>
              );
            },
          },
          {
            accessorKey: "closingDate",
            header: t("cloture"),
            cell: ({ row }: { row: any }) => {
              const stock = row.original as any;
              return (
                <div className="capitalize">
                  {stock.closingDate ? formatDate(stock.closingDate) : "NC"}
                </div>
              );
            },
          },
        ]
      : [
          {
            accessorKey: "enjoymentDate",
            header: t("valeurOuverture"),
            cell: ({ row }: { row: any }) => {
              const stock = row.original as any;
              const stockPrices = stock.stockPrices || [];

              if (stockPrices.length > 0) {
                return (
                  <div className="capitalize">
                    {formatPrice(stockPrices[0]?.price || 0)}
                  </div>
                );
              }

              return <div className="capitalize">NC</div>;
            },
          },
          {
            accessorKey: "currentPrice",
            header: t("valeurActuelle"),
            cell: ({ row }: { row: any }) => {
              const stock = row.original as any;
              const stockPrices = stock.stockPrices || [];

              if (stockPrices.length > 0) {
                const currentValue =
                  stockPrices[stockPrices.length - 1]?.price || 0;
                return (
                  <div className="capitalize">{formatPrice(currentValue)}</div>
                );
              }

              return <div className="capitalize">NC</div>;
            },
          },
        ]),
    {
      accessorKey: "status",
      header: t("statut"),
      cell: ({ row }) => {
        const status = row.original.status;
        return (
          t(
            status === "activated"
              ? "actif"
              : status === "deactivated"
              ? "inactif"
              : status === "delisted"
              ? "deliste"
              : "NC"
          ) ?? "NC"
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const stock = row.original;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem
                onClick={() => {
                  setSelectedStock(stock);
                  setIsDetailsModalOpen(true);
                }}
              >
                {t("voirDetails")}
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`${pathname}/${stock.id}`}>{t("passerOrdre")}</Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];

  // Update data when stocks change
  useEffect(() => {
    if (stocks && Array.isArray(stocks)) {
      setData(stocks);
    } else if (error) {
      toast({
        variant: "destructive",
        title: "Error loading stocks",
        description:
          error || "Failed to load stock data. Please try again later.",
      });
      console.error("❌ Error loading stocks:", error);
    }
  }, [stocks, error, toast, stockType]);

  useEffect(() => {
    // MOCK: Remplace par tes vrais appels API si besoin
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

  const getTableData = () => {
    if (data && Array.isArray(data)) {
      return data;
    }
    return [];
  };

  const table = useReactTable({
    data: getTableData(),
    columns: columns(t),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  if (loading) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center p-8 gap-4">
        <div className="text-center">
          <p className="text-red-500 font-semibold mb-2">Error loading data</p>
          <p className="text-gray-500">{error}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="bg-primary text-white px-4 py-2 rounded-md text-sm"
        >
          Retry
        </button>
        <div className="text-xs text-gray-400 mt-2">
          Try enabling debug mode to see more information
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder={t("filterTitres")}
          value={(table.getColumn("issuer")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("issuer")?.setFilterValue(event.target.value)
          }
          className="max-w-sm"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="ml-auto">
              {t("colonnes")} <ChevronDown className="ml-2 h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {table
              .getAllColumns()
              .filter((column) => column.getCanHide())
              .map((column) => {
                return (
                  <DropdownMenuCheckboxItem
                    key={column.id}
                    className="capitalize"
                    checked={column.getIsVisible()}
                    onCheckedChange={(value) =>
                      column.toggleVisibility(!!value)
                    }
                  >
                    {column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border">
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
                  colSpan={columns(t).length}
                  className="h-24 text-center"
                >
                  {t("aucunResultat")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {t("precedent")}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {t("suivant")}
          </Button>
        </div>
      </div>

      {/* Modal pour les détails */}
      {isDetailsModalOpen && selectedStock && (
        <Modal
          open={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedStock(null);
          }}
        >
          {loadingDetails ? (
            <div>Chargement des détails...</div>
          ) : (
            <TitreDetails
              data={mapStockToTitreFormValues(selectedStock)}
              companies={companies}
              institutions={institutions.map((inst) => ({
                id: inst.id,
                institutionName: inst.name,
                taxIdentificationNumber: "",
                agreementNumber: "",
                legalForm: "",
                establishmentDate: "",
                fullAddress: "",
              }))}
              isValidationReturnPage={false}
              orderResponse={undefined}
            />
          )}
        </Modal>
      )}
    </div>
  );
}

// Utilitaire pour transformer un Stock en TitreFormValues
function mapStockToTitreFormValues(stock: Stock): TitreFormValues {
  const s = stock as any;
  return {
    id: s.id,
    name: s.name || "",
    issuer: typeof s.issuer === "object" ? s.issuer.id || "" : s.issuer || "",
    isinCode: s.isinCode || s.isincode || "",
    code: s.code || "",
    faceValue: s.faceValue ?? s.facevalue ?? 0,
    quantity: s.quantity ?? 0,
    stockType: s.stockType || "action", // Added missing required property
    emissionDate: s.emissionDate
      ? new Date(s.emissionDate)
      : s.emissiondate
      ? new Date(s.emissiondate)
      : new Date(),
    closingDate: s.closingDate
      ? new Date(s.closingDate)
      : s.closingdate
      ? new Date(s.closingdate)
      : new Date(),
    enjoymentDate: s.enjoymentDate
      ? new Date(s.enjoymentDate)
      : s.enjoymentdate
      ? new Date(s.enjoymentdate)
      : new Date(),
    marketListing: "CAS", // Changed from "primary" to "CAS" to match the expected MarketListing type
    type: s.type || "",
    status: ["activated", "suspended", "delisted"].includes(s.status as string)
      ? (s.status as "activated" | "suspended" | "delisted")
      : "activated",
    dividendRate: s.dividendRate,
    capitalOperation: undefined,
    maturityDate: s.maturityDate
      ? new Date(s.maturityDate)
      : s.maturitydate
      ? new Date(s.maturitydate)
      : undefined,
    durationYears: undefined,
    // Removed paymentSchedule as it doesn't exist in the target type
    commission: s.commission,
    shareClass: undefined,
    votingRights: undefined,
    master: undefined,
    institutions: undefined,
    stockPrice: {
      price: s.price ?? 0,
      date: new Date(),
      gap: 0,
    },
    // Add missing required properties
    capitalRepaymentSchedule: s.capitalRepaymentSchedule || [],
    couponSchedule: s.couponSchedule || [],
  };
}

// Composant Modal utilisant un portail pour couvrir tout l'écran
function Modal({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return createPortal(
    <div className="fixed inset-0 z-[1000] flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white rounded-lg shadow-lg max-w-2xl w-full p-6 relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
          onClick={onClose}
        >
          <span className="text-xl">×</span>
        </button>
        {children}
      </div>
    </div>,
    typeof window !== "undefined" ? document.body : (null as any)
  );
}
