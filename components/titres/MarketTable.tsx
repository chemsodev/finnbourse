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

interface MarketTableProps {
  type: StockType;
  marketType: "primaire" | "secondaire";
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
  return mapping[type];
}

export function MarketTable({ type, marketType }: MarketTableProps) {
  const t = useTranslations("TitresTable");
  const { toast } = useToast();
  const api = useStockApi();
  const [data, setData] = React.useState<Stock[]>([]);
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

  React.useEffect(() => {
    const fetchStocks = async () => {
      try {
        setLoading(true);
        setError(null);

        const stockType = mapToStockType(type);
        const response = await api.filterStocks({
          marketType,
          stockType,
        });

        setData(response);
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
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();
  }, [type, marketType, api, toast]);

  const handleEditClick = React.useCallback(
    (stock: Stock) => {
      const defaultValues: TitreFormValues = {
        id: stock.id,
        type: type,
        name: stock.name || "",
        code: stock.code || "",
        issuer:
          typeof stock.issuer === "object"
            ? stock.issuer.id || ""
            : String(stock.issuer) || "",
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
        marketListing: "primary",
        status: ["activated", "suspended", "delisted"].includes(
          stock.status as string
        )
          ? (stock.status as "activated" | "suspended" | "delisted")
          : "activated",
        stockPrice: {
          price: stock.stockPrices?.[stock.stockPrices.length - 1]?.price || 0,
          date: new Date(),
          gap: 0,
        },
        // Add other required fields with default values as needed
        dividendRate: undefined,
        commission: undefined,
        shareClass: "",
        votingRights: false,
        institutions: [],
      };

      setEditingTitre(defaultValues);
    },
    [type]
  );

  // Helper function to get the details link for a stock
  const getDetailsLink = (
    marketType: "primaire" | "secondaire",
    stockType: StockType,
    stockId: string
  ) => {
    const basePath =
      marketType === "primaire"
        ? "/gestion-des-titres/marcheprimaire"
        : "/gestion-des-titres/marchesecondaire";

    return `${basePath}/${stockType}/${stockId}`;
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
          const issuerName =
            typeof stock.issuer === "object" ? stock.issuer.name : stock.issuer;
          const code =
            stock.code ??
            (typeof stock.issuer === "object" ? stock.issuer.code : "N/A");

          return (
            <div className="capitalize flex flex-col gap-1">
              <div className="font-semibold">{issuerName ?? "N/A"}</div>
              <div className="uppercase text-xs text-gray-500">{code}</div>
            </div>
          );
        },
      },
    ];
    if (type === "empruntobligataire" || type === "obligation") {
      cols.splice(1, 0, {
        // Insert after the first column
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
      "sukukms",
      "titresparticipatifsms",
    ].includes(type);
    const hasStockPrices = ["action", "obligation"].includes(type);

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
            const price =
              Array.isArray(stockPrices) && stockPrices.length > 0
                ? stockPrices[0]?.price
                : undefined;
            return formatPrice(price ?? 0) ?? "NC";
          },
        },
        {
          accessorKey: "currentPrice",
          header: t("valeurActuelle"),
          cell: ({ row }) => {
            const stockPrice = row.original?.stockPrices;
            let current: number | undefined;
            if (Array.isArray(stockPrice)) {
              current =
                stockPrice.length > 0
                  ? stockPrice[stockPrice.length - 1]?.price
                  : undefined;
            } else if (
              stockPrice &&
              typeof stockPrice === "object" &&
              "price" in stockPrice
            ) {
              current = (stockPrice as { price: number }).price;
            }
            return formatPrice(current ?? 0) ?? "NC";
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
                  <Link href={getDetailsLink(marketType, type, stock.id)}>
                    {t("voirDetails")}
                  </Link>
                </DropdownMenuItem>

                <DropdownMenuItem onClick={() => handleEditClick(stock)}>
                  {t("modifier")}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      }
    );

    return cols;
  }, [t, type, handleEditClick]);

  const table = useReactTable({
    data,
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
      {editingTitre &&
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
        ))}
    </div>
  );
}
