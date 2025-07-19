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

import { Stock, StockPrices, StockType } from "@/types/gestionTitres";
import { TitreFormValues } from "./titreSchemaValidation";
import { EditTitre } from "./EditTitre";
import { EditSecondaryMarketTitre } from "./EditSecondaryMarketTitre";
import { useStockApi } from "@/hooks/useStockApi";

interface MarketTableProps {
  type: StockType;
  marketType: "primaire" | "secondaire";
  isIOB?: boolean;
  canEdit?: boolean;
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
): "action" | "obligation" | "sukuk" | "obligationsOrdinaires" | "oat" {
  const mapping: Record<
    StockType,
    "action" | "obligation" | "sukuk" | "obligationsOrdinaires" | "oat"
  > = {
    opv: "action",
    empruntobligataire: "obligation",
    action: "action",
    obligation: "obligation",
    sukuk: "sukuk",
    sukukmp: "sukuk",
    sukukms: "sukuk",
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
  canEdit = true,
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

      console.error("❌ Error fetching stocks:", err);

      // Handle 401 specifically
      if (
        typeof err === "object" &&
        err !== null &&
        "status" in err &&
        (err as any).status === 401
      ) {
        console.warn("🔒 Authentication error - token may be expired");
        toast({
          variant: "destructive",
          title: "Authentication Error",
          description:
            "Your session may have expired. Please try refreshing the page.",
        });
      } else {
        setError(errorMessage);
        toast({
          variant: "destructive",
          title: "Error loading stocks",
          description: errorMessage,
        });
      }
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

  // Function to get StockPrices
  const getPrices = (stockPrices: StockPrices[]) => {
    if (!Array.isArray(stockPrices)) return { opening: null, latest: null };

    const sortedAsc = [...stockPrices].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    const sortedDesc = [...stockPrices].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );

    return {
      opening: sortedAsc[0],
      latest: sortedDesc[0],
    };
  };

  const PriceCell = ({ price, date }: StockPrices) => (
    <div className="flex flex-col">
      <span className="font-medium">{formatPrice(price ?? 0) ?? "NC"}</span>
      {date && (
        <span className="text-xs text-gray-500">{formatDate(date)}</span>
      )}
    </div>
  );

  //
  const getStatusColor = (status?: string) => {
    switch (status) {
      case "activated":
        return "bg-green-100 text-green-800 ";
      case "deactivated":
        return "bg-yellow-100 text-yellow-800 ";
      case "delisted":
        return "bg-red-100 text-red-800 ";
      default:
        return "bg-gray-100 text-gray-800 ";
    }
  };

  //
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
          // type: stockType,
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
          status: ["activated", "deactivated", "delisted"].includes(
            stock.status as string
          )
            ? (stock.status as "activated" | "deactivated" | "delisted")
            : "activated",

          // Optional fields
          dividendRate: stock.dividendRate,
          capitalOperation: stock.capitalOperation,
          maturityDate: stock.maturityDate
            ? new Date(stock.maturityDate)
            : undefined,
          duration: undefined,
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
          stockPrices: (() => {
            const stockPrices = stock.stockPrices;
            if (Array.isArray(stockPrices) && stockPrices.length > 0) {
              // Map all prices to ensure correct type
              return stockPrices.map((sp) => ({
                price: sp.price ?? 0,
                date: sp.date ? new Date(sp.date) : new Date(),
                gap: sp.gap,
              }));
            }
            // If no prices, fallback to stock.stockPrices if available
            if (stock.stockPrices && stock.stockPrices.length > 0) {
              return [
                {
                  price: stock.stockPrices[0].price ?? 0,
                  date: stock.stockPrices[0].date
                    ? new Date(stock.stockPrices[0].date)
                    : new Date(),
                  gap: stock.stockPrices[0].gap,
                },
              ];
            }
            // Default to empty array
            return [];
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
  const baseColumns = React.useMemo<ColumnDef<Stock>[]>(
    () => [
      {
        accessorKey: "isinCode",
        header: t("isinCode"),
        cell: ({ row }) => {
          const stock = row.original;
          return (
            <div className="text-xs text-gray-500">
              {stock.isinCode || "N/A"}
            </div>
          );
        },
      },
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
            <div className="text-xs text-gray-500">
              {stock.quantity || "N/A"}
            </div>
          );
        },
      },
    ],
    [t]
  );

  const columns = React.useMemo<ColumnDef<Stock>[]>(() => {
    const primaryCols: ColumnDef<Stock>[] = [
      ...baseColumns,
      {
        accessorKey: "price",
        header: t("price"),
        cell: ({ row }) => {
          const stock = row.original;
          return (
            <div className="text-sm font-medium text-gray-900">
              {stock.price || "N/A"}
            </div>
          );
        },
      },
      {
        accessorKey: "emissionDate",
        header: t("emissionDate"),
        cell: ({ row }) =>
          row.original.emissionDate
            ? formatDate(row.original.emissionDate)
            : "NC",
      },
      {
        accessorKey: "closingDate",
        header: t("closingDate"),
        cell: ({ row }) =>
          row.original.closingDate
            ? formatDate(row.original.closingDate)
            : "NC",
      },
    ];

    const secondaryCols: ColumnDef<Stock>[] = [
      ...baseColumns,
      {
        accessorKey: "enjoymentDate",
        header: t("enjoymentDate"),
        cell: ({ row }) =>
          row.original.enjoymentDate
            ? formatDate(row.original.enjoymentDate)
            : "NC",
      },
      {
        accessorKey: "openingPrice",
        header: t("valeurOuverture"),
        cell: ({ row }) => {
          const { opening } = getPrices(row.original?.stockPrices ?? []);
          return (
            <PriceCell
              price={opening?.price ?? 0}
              date={opening?.date ?? new Date()}
            />
          );
        },
      },
      {
        accessorKey: "currentPrice",
        header: t("valeurActuelle"),
        cell: ({ row }) => {
          const { latest } = getPrices(row.original?.stockPrices ?? []);
          return (
            <PriceCell
              price={latest?.price ?? 0}
              date={latest?.date ?? new Date()}
            />
          );
        },
      },
      {
        accessorKey: "gap",
        header: t("ecart"),
        cell: ({ row }) => {
          const stockPrices = row.original?.stockPrices ?? [];
          // Get both latest and opening prices
          const { latest, opening } = getPrices(stockPrices);

          // Calculate gap percentage if both prices exist
          const gapPercentage =
            latest?.price !== undefined &&
            opening?.price !== undefined &&
            opening?.price !== 0
              ? ((latest.price - opening.price) / opening.price) * 100
              : null;

          const date = latest?.date;

          if (gapPercentage === null) {
            return <span className="text-gray-400">NC</span>;
          }

          const gapValue = gapPercentage.toFixed(2);
          const isPositive = gapPercentage >= 0;

          return (
            <div className="flex flex-col">
              <span
                className={
                  isPositive
                    ? "text-green-600 font-medium"
                    : "text-red-600 font-medium"
                }
              >
                {isPositive && gapPercentage !== 0 ? "+" : ""}
                {gapValue}%
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
    ];

    const cols =
      marketType === "primaire" ? [...primaryCols] : [...secondaryCols];

    if ((marketType === "secondaire" && !isIOB) || type === "obligation") {
      cols.splice(2, 0, {
        accessorKey: "bondType",
        header: t("type"),
        cell: ({ row }) => {
          const stock = row.original as any;
          return (
            <div className="capitalize text-xs font-semibold text-gray-700">
              {stock.stockType ? stock.stockType : stock.type || "N/A"}
            </div>
          );
        },
      });
      cols.splice(6, 0, {
        accessorKey: "maturityDate",
        header: t("maturityDate"),
        cell: ({ row }) =>
          row.original.maturityDate
            ? formatDate(row.original.maturityDate)
            : "NC",
      });
    }

    // Add status and actions columns
    cols.push(
      {
        accessorKey: "status",
        header: t("statut"),
        cell: ({ row }) => {
          const stock = row.original;
          const statusText =
            stock.status === "activated"
              ? "actif"
              : stock.status === "deactivated"
              ? "inactif"
              : stock.status === "delisted"
              ? "deliste"
              : "NC";

          return (
            <span
              className={`px-3 py-2 rounded-full text-xs ${getStatusColor(
                stock.status
              )}`}
            >
              {t(statusText) ?? "N/A"}
            </span>
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
                {marketType === "secondaire" && canEdit === true && (
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
  }, [baseColumns, marketType, t, type, handleEditClick, , isIOB, canEdit]);

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
