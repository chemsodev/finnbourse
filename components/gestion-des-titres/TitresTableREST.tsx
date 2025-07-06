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
import { useStocksREST } from "@/hooks/useStockREST";
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
  isPrimary?: boolean;
}

export function TitresTableREST({ type, isPrimary = false }: TitresTableProps) {
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
  const [companies, setCompanies] = useState<{ id: string; name: string }[]>([]);
  const [institutions, setInstitutions] = useState<{ id: string; name: string }[]>([]);
  const [loadingDetails, setLoadingDetails] = useState(true);

  // TitresTableREST gère uniquement les actions
  const stockType: "action" = "action";

  // Use the REST stocks hook
  const { stocks, loading, error } = useStocksREST(stockType);

  // Extract roleId with type assertion
  const roleId = (session?.user as any)?.roleid;

  // Define your columns for the table
  const columns = (t: (key: string) => string): ColumnDef<Stock>[] => [
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
      accessorKey: "code",
      header: t("code"),
      cell: ({ row }) => {
        const stock = row.original as any;
        return (
          <div className="uppercase text-gray-500 font-semibold text-xs">
            {stock.code || "N/A"}
          </div>
        );
      },
    },
    ...(type !== "action" &&
    type !== "obligation" &&
    type !== "sukukms" &&
    type !== "titresparticipatifsms"
      ? [
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
        const stock = row.original as any;
        const status = stock.status;

        return (
          <div className="capitalize">
            {status === "active" || status === "activated"
              ? t("actif")
              : status === "suspended"
              ? t("suspendu")
              : status === "moved_to_secondary"
              ? t("marche_secondaire")
              : status || "NC"}
          </div>
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
                <Link
                  href={`${pathname}/${stock.id}`}
                >
                  {t("passerOrdre")}
                </Link>
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
      console.log("📊 Raw stocks data:", stocks);

      // Filter stocks based on market type (primary vs secondary)
      const filteredStocks = stocks.filter((stock: any) => {
        const stockIsPrimary = stock.isPrimary === true;
        return stockIsPrimary === isPrimary;
      });

      console.log(`🔍 Filtered stocks for ${isPrimary ? 'primary' : 'secondary'} market:`, filteredStocks);

      // Check if we have the expected properties
      if (filteredStocks.length > 0) {
        const firstStock = filteredStocks[0];
        console.log("📋 First stock sample:", {
          id: firstStock.id,
          name: firstStock.name,
          code: firstStock.code,
          issuer: firstStock.issuer,
          status: firstStock.status,
          stockPrices: firstStock.stockPrices,
          isPrimary: firstStock.isPrimary,
        });
      }

      setData(filteredStocks);
      console.log(`✅ Loaded ${filteredStocks.length} ${stockType} stocks for ${isPrimary ? 'primary' : 'secondary'} market`);
    } else if (error) {
      toast({
        variant: "destructive",
        title: "Error loading stocks",
        description:
          error || "Failed to load stock data. Please try again later.",
      });
      console.error("❌ Error loading stocks:", error);
    }
  }, [stocks, error, toast, stockType, isPrimary]);

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
        <div className="flex-1 text-sm text-muted-foreground">
          {table.getFilteredSelectedRowModel().rows.length} {t("de")}{" "}
          {table.getFilteredRowModel().rows.length} {t("lignesSelectionnees")}.
        </div>
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
              institutions={institutions}
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
    marketListing: "primary",
    type: s.type || "",
    status: ["activated", "suspended", "expired"].includes(s.status as string)
      ? (s.status as "activated" | "suspended" | "expired")
      : "activated",
    dividendRate: s.dividendRate,
    capitalOperation: undefined,
    maturityDate: s.maturityDate
      ? new Date(s.maturityDate)
      : s.maturitydate
      ? new Date(s.maturitydate)
      : undefined,
    durationYears: undefined,
    paymentSchedule: undefined,
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
  };
}

// Composant Modal utilisant un portail pour couvrir tout l'écran
function Modal({ open, onClose, children }: { open: boolean; onClose: () => void; children: React.ReactNode }) {
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
    typeof window !== 'undefined' ? document.body : (null as any)
  );
}