"use client";

import * as React from "react";
import {
  ColumnDef,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  SortingState,
  ColumnFiltersState,
  VisibilityState,
  RowSelectionState,
  flexRender,
} from "@tanstack/react-table";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  // DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowUpDown,
  ChevronDown,
  Loader2,
  MoreHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { useToast } from "@/hooks/use-toast";

import { formatDate, formatPrice } from "@/lib/utils";
import { Link } from "@/i18n/routing";

import { Stock, StockType } from "@/types/gestionTitres";
import { TitreFormValues } from "./titreSchemaValidation";
import { EditTitre } from "./EditTitre";
import { EditSecondaryMarketTitre } from "./EditSecondaryMarketTitre";
import { useStockApi } from "@/hooks/useStockApi";
import { is } from "date-fns/locale";

interface MarketTableProps {
  type: StockType;
  marketType: "primaire" | "secondaire";
  isIOB?: boolean;
  stocks: Stock[];
  setStocks: React.Dispatch<React.SetStateAction<Stock[]>>;
  onRefresh?: (refreshFn: () => Promise<void>) => void;
}

interface TableState {
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  columnVisibility: VisibilityState;
  rowSelection: RowSelectionState;
}

function mapToStockType(
  type: StockType
): "action" | "obligation" | "sukuk" | "participatif" {
  const mapping: Record<
    StockType,
    "action" | "obligation" | "sukuk" | "participatif"
  > = {
    opv: "action",
    empruntobligataire: "obligation",
    action: "action",
    obligation: "obligation",
    sukuk: "sukuk",
    sukukmp: "sukuk",
    sukukms: "sukuk",
    titresparticipatifs: "participatif",
    titresparticipatifsmp: "participatif",
    titresparticipatifsms: "participatif",
    participatif: "participatif",
  };
  return mapping[type] || "action";
}

// Helper function to map StockType to ObligationType
function mapToObligationType(type: StockType): "participatif" | "sukuk" {
  if (type.includes("sukuk")) {
    return "sukuk";
  }
  if (type.includes("participatif")) {
    return "participatif";
  }
  return "participatif";
}
export function MarketTable({
  type,
  marketType,
  isIOB = false,
  stocks,
  setStocks,
  onRefresh,
}: MarketTableProps) {
  const t = useTranslations("TitresTable");
  const { toast } = useToast();
  const api = useStockApi();
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [sorting, setSorting] = React.useState<TableState["sorting"]>([]);
  const [columnFilters, setColumnFilters] = React.useState<
    TableState["columnFilters"]
  >([]);
  const [columnVisibility, setColumnVisibility] = React.useState<
    TableState["columnVisibility"]
  >({});
  const [rowSelection, setRowSelection] = React.useState<
    TableState["rowSelection"]
  >({});
  const [editingTitre, setEditingTitre] =
    React.useState<TitreFormValues | null>(null);

  // Fetch stocks based on type and market
  const fetchStocks = React.useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const stockType = mapToStockType(type);
      const response =
        marketType === "primaire" || (marketType === "secondaire" && isIOB)
          ? await api.filterStocks({ marketType, stockType })
          : await api.getPrimaryClosingStocks();

      setStocks(response || []);
    } catch (err) {
      const errorMessage =
        typeof err === "object" && err !== null && "message" in err
          ? String((err as { message?: unknown }).message)
          : "Failed to fetch stocks";
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
  }, [type, marketType, api, toast, setStocks, isIOB]);

  React.useEffect(() => {
    fetchStocks();
  }, [fetchStocks]);

  // Expose refresh function to parent component
  React.useEffect(() => {
    if (onRefresh) {
      onRefresh(fetchStocks);
    }
  }, [onRefresh, fetchStocks]);

  const handleEditClick = React.useCallback(
    (stock: Stock) => {
      try {
        const issuerString =
          typeof stock.issuer === "string"
            ? stock.issuer
            : typeof stock.issuer === "object" &&
              stock.issuer !== null &&
              "id" in stock.issuer
            ? (stock.issuer as { id: string }).id
            : "";

        const isSecondaryMarket = marketType === "secondaire";
        const stockType = mapToStockType(type);

        const formType = isSecondaryMarket
          ? stockType
          : mapToObligationType(type);

        const defaultValues: TitreFormValues = {
          id: stock.id,
          type: stockType,
          name: stock.name || "",
          stockType: stockType,
          code: stock.code || "",
          issuer: issuerString,
          isinCode: stock.isinCode || "",
          faceValue: stock.faceValue || 0,
          quantity: stock.quantity || 1,
          emissionDate: stock.emissionDate
            ? new Date(stock.emissionDate)
            : new Date(),
          closingDate: stock.closingDate
            ? new Date(stock.closingDate)
            : new Date(),
          enjoymentDate: stock.enjoymentDate
            ? new Date(stock.enjoymentDate)
            : new Date(),
          marketListing: stock.marketListing || "ALG",
          status: ["activated", "suspended", "delisted"].includes(
            stock.status as string
          )
            ? (stock.status as "activated" | "suspended" | "delisted")
            : "activated",

          // Optional fields
          dividendRate: stock.dividendRate,
          capitalOperation: stock.capitalOperation,
          maturityDate: stock.maturityDate
            ? new Date(stock.maturityDate)
            : undefined,
          durationYears: undefined,
          commission: undefined,
          shareClass: undefined,
          votingRights: stock.votingRights || false,
          master: stock.master || "",
          institutions: Array.isArray(stock.institutions)
            ? stock.institutions.map((inst: string | { id: string }) =>
                typeof inst === "string" ? inst : inst.id
              )
            : [],
          // StockPrice - get the latest price from stockPrices array
          stockPrice: (() => {
            const stockPrices = stock.stockPrices;
            let latestPrice;

            if (Array.isArray(stockPrices) && stockPrices.length > 0) {
              // Sort by date descending to get the most recent price
              const sortedPrices = [...stockPrices].sort(
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime()
              );
              latestPrice = sortedPrices[0];
            }

            return {
              price: latestPrice?.price || stock.stockPrice?.price || 0,
              date: latestPrice?.date ? new Date(latestPrice.date) : new Date(),
              gap: latestPrice?.gap || stock.stockPrice?.gap || 0,
            };
          })(),
          // Schedules
          capitalRepaymentSchedule:
            stock.capitalRepaymentSchedule?.map((item) => ({
              date: new Date(item.date),
              rate: item.rate || 0,
            })) || [],
          couponSchedule:
            stock.couponSchedule?.map((item) => ({
              date: new Date(item.date),
              rate: item.rate || 0,
            })) || [],
        };
        setEditingTitre(defaultValues);
      } catch (error) {
        console.error("Error preparing edit data:", error);
        toast({
          variant: "destructive",
          title: "Error preparing edit data",
          description: "Failed to prepare data for editing.",
        });
      }
    },
    [type, toast]
  );

  // Helper function to get the details link for a stock
  const getDetailsLink = (
    marketType: "primaire" | "secondaire",
    stockType: StockType,
    stockId: string,
    isIOB: boolean = false
  ) => {
    if (marketType === "primaire") {
      return `/gestion-des-titres/marcheprimaire/${stockType}/${stockId}`;
    } else {
      // Secondary market
      if (isIOB) {
        return `/iob-secondary-market/${stockType}/${stockId}`;
      } else {
        return `/gestion-des-titres/marchesecondaire/${stockId}`;
      }
    }
  };

  // Column definitions for the table
  const columns = React.useMemo<ColumnDef<Stock>[]>(() => {
    const cols: ColumnDef<Stock>[] = [
      {
        accessorKey: "issuer",
        header: () => (
          <Button variant="ghost">
            {t("titre")}
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        ),
        cell: ({ row }) => {
          const stock = row.original;
          // Handle both object and string cases - prioritize issuer.name over stock.name
          const issuerName =
            (typeof stock.issuer === "object" &&
            stock.issuer !== null &&
            "name" in stock.issuer
              ? (stock.issuer as { name: string }).name
              : stock.issuer) ||
            stock.name ||
            "N/A";
          const code = stock.code || "N/A";

          return (
            <div className="capitalize flex flex-col gap-1">
              <div className="font-semibold">{issuerName}</div>
              <div className="uppercase text-xs text-gray-500">{code}</div>
            </div>
          );
        },
      },
    ];
    if (marketType === "secondaire" || type === "obligation") {
      cols.splice(1, 0, {
        accessorKey: "bondType",
        header: t("type"),
        cell: ({ row }) => {
          const stock = row.original as any;
          return (
            <div className="capitalize text-xs font-semibold text-gray-700">
              {stock.type || ""}
            </div>
          );
        },
      });
    }
    const hasEmissionData = ![
      "action",
      "obligation",
      "sukuk",
      "sukukms",
      "titresparticipatifsms",
      "participatif",
    ].includes(type);
    // Check if any stock in the data has stockPrices to determine if we should show price columns
    const hasStockPrices = stocks.some(
      (stock) =>
        Array.isArray(stock.stockPrices) && stock.stockPrices.length > 0
    );

    if (hasEmissionData) {
      cols.push(
        {
          accessorKey: "emissionDate",
          header: t("ouverture"),
          cell: ({ row }) =>
            row.original.emissionDate
              ? formatDate(row.original.emissionDate)
              : "NC",
        },
        {
          accessorKey: "closingDate",
          header: t("cloture"),
          cell: ({ row }) =>
            row.original.closingDate
              ? formatDate(row.original.closingDate)
              : "NC",
        }
      );
    }

    if (hasStockPrices) {
      cols.push(
        {
          accessorKey: "enjoymentDate",
          header: t("valeurOuverture"),
          cell: ({ row }) => {
            const stockPrices = row.original?.stockPrices;

            // Get the earliest price entry (opening price)
            let openingPrice;
            if (Array.isArray(stockPrices) && stockPrices.length > 0) {
              // Sort by date ascending to get the earliest price
              const sortedPrices = [...stockPrices].sort(
                (a, b) =>
                  new Date(a.date).getTime() - new Date(b.date).getTime()
              );
              openingPrice = sortedPrices[0];
            }

            const price = openingPrice?.price;
            const date = openingPrice?.date;
            return (
              <div className="flex flex-col">
                <span className="font-medium">
                  {formatPrice(price ?? 0) ?? "NC"}
                </span>
                {date && (
                  <span className="text-xs text-gray-500">
                    {formatDate(date)}
                  </span>
                )}
              </div>
            );
          },
        },
        {
          accessorKey: "currentPrice",
          header: t("valeurActuelle"),
          cell: ({ row }) => {
            const stockPrices = row.original?.stockPrices;

            // Get the latest price entry (most recent)
            let latestPrice;
            if (Array.isArray(stockPrices) && stockPrices.length > 0) {
              // Sort by date descending to get the most recent price
              const sortedPrices = [...stockPrices].sort(
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime()
              );
              latestPrice = sortedPrices[0];
            }

            const currentPrice = latestPrice?.price;
            const date = latestPrice?.date;
            return (
              <div className="flex flex-col">
                <span className="font-medium">
                  {formatPrice(currentPrice ?? 0) ?? "NC"}
                </span>
                {date && (
                  <span className="text-xs text-gray-500">
                    {formatDate(date)}
                  </span>
                )}
              </div>
            );
          },
        },
        {
          accessorKey: "gap",
          header: t("ecart") || "Gap",
          cell: ({ row }) => {
            const stockPrices = row.original?.stockPrices;

            // Get the latest price entry (most recent)
            let latestPrice;
            if (Array.isArray(stockPrices) && stockPrices.length > 0) {
              // Sort by date descending to get the most recent price
              const sortedPrices = [...stockPrices].sort(
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime()
              );
              latestPrice = sortedPrices[0];
            }

            const gap = latestPrice?.gap;
            const date = latestPrice?.date;

            if (gap === undefined || gap === null) {
              return <span className="text-gray-400">NC</span>;
            }

            const gapValue = formatPrice(Math.abs(gap));
            const isPositive = gap >= 0;
            return (
              <div className="flex flex-col">
                <span
                  className={
                    isPositive
                      ? "text-green-600 font-medium"
                      : "text-red-600 font-medium"
                  }
                >
                  {isPositive ? "+" : ""}
                  {gapValue}
                </span>
                {date && (
                  <span className="text-xs text-gray-500">
                    {formatDate(date)}
                  </span>
                )}
              </div>
            );
          },
        },
        {
          accessorKey: "priceHistory",
          header: "Historique des Prix",
          cell: ({ row }) => {
            const stockPrices = row.original?.stockPrices;

            if (!Array.isArray(stockPrices) || stockPrices.length === 0) {
              return <span className="text-gray-400">Aucun historique</span>;
            }

            // Sort by date descending to show most recent first
            const sortedPrices = [...stockPrices].sort(
              (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            );

            return (
              <div className="max-w-xs">
                <div className="text-xs text-gray-600 mb-1">
                  {sortedPrices.length} entrée(s)
                </div>
                <div className="space-y-1 max-h-32 overflow-y-auto">
                  {sortedPrices.slice(0, 3).map((priceEntry, index) => (
                    <div
                      key={`${row.original.id}-price-${index}`}
                      className="text-xs border-l-2 pl-2 border-gray-200"
                    >
                      <div className="flex justify-between items-center">
                        <span className="font-medium">
                          {formatPrice(priceEntry.price)}
                        </span>
                        <span
                          className={`ml-2 ${
                            (priceEntry.gap ?? 0) >= 0
                              ? "text-green-600"
                              : "text-red-600"
                          }`}
                        >
                          {(priceEntry.gap ?? 0) >= 0 ? "+" : ""}
                          {formatPrice(Math.abs(priceEntry.gap ?? 0))}
                        </span>
                      </div>
                      <div className="text-gray-500">
                        {formatDate(priceEntry.date)}
                      </div>
                    </div>
                  ))}
                  {sortedPrices.length > 3 && (
                    <div className="text-xs text-gray-500 text-center">
                      +{sortedPrices.length - 3} autres...
                    </div>
                  )}
                </div>
              </div>
            );
          },
        }
      );
    }

    cols.push(
      {
        accessorKey: "status",
        header: t("statut"),
        cell: ({ row }) => {
          const status = row.original.status;
          return (
            t(
              status === "activated"
                ? "actif"
                : status === "suspended"
                ? "suspendu"
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
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {/* <DropdownMenuSeparator /> */}
                <DropdownMenuItem asChild>
                  <Link
                    href={getDetailsLink(
                      marketType,
                      type,
                      stock?.id ?? "",
                      isIOB
                    )}
                  >
                    {t("voirDetails")}
                  </Link>
                </DropdownMenuItem>
                {marketType === "secondaire" && (
                  <DropdownMenuItem onClick={() => handleEditClick(stock)}>
                    {t("modifier")}
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      }
    );

    return cols;
  }, [t, type, marketType, handleEditClick, isIOB]);

  const table = useReactTable({
    data: stocks || [],
    columns,
    state: { sorting, columnFilters, columnVisibility, rowSelection },
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  if (loading) {
    return (
      <div className="p-8 text-center animate-pulse">
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
    );
  }

  if (error) {
    return <div className="p-8 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="w-full">
      <div className="flex items-center py-4">
        <Input
          placeholder={t("filterTitres")}
          value={(table.getColumn("issuer")?.getFilterValue() as string) ?? ""}
          onChange={(e) =>
            table.getColumn("issuer")?.setFilterValue(e.target.value)
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
              .filter((col) => col.getCanHide())
              .map((column) => (
                <DropdownMenuCheckboxItem
                  key={column.id}
                  checked={column.getIsVisible()}
                  onCheckedChange={(value) => column.toggleVisibility(!!value)}
                >
                  {column.id}
                </DropdownMenuCheckboxItem>
              ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
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
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length ? (
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
                  {t("aucunResultat")}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="text-sm text-muted-foreground flex-1">
          {table.getFilteredSelectedRowModel().rows.length} {t("de")}{" "}
          {table.getFilteredRowModel().rows.length} {t("lignesSelectionnees")}
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
      {/* {editingTitre &&
        (marketType === "secondaire" ? (
          <EditSecondaryMarketTitre
            open={!!editingTitre}
            onOpenChange={(open) => !open && setEditingTitre(null)}
            defaultValues={editingTitre}
            onSuccess={() => {
              setEditingTitre(null);
            }}
          />
        ) : (
          <EditTitre
            type={type}
            open={!!editingTitre}
            onOpenChange={(open) => !open && setEditingTitre(null)}
            defaultValues={editingTitre}
            onSuccess={() => {
              setEditingTitre(null);
            }}
          />
        ))} */}
      {editingTitre && (
        <EditSecondaryMarketTitre
          open={!!editingTitre}
          isIOB={isIOB}
          onOpenChange={(open) => !open && setEditingTitre(null)}
          defaultValues={editingTitre}
          onSuccess={async () => {
            setEditingTitre(null);
            // Refresh the table to show updated data
            await fetchStocks();
          }}
        />
      )}
    </div>
  );
}
