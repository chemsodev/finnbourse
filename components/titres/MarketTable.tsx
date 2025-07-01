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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, ChevronDown, MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { useToast } from "@/hooks/use-toast";
import { useStocksREST } from "@/hooks/useStockREST";
import { formatDate, formatPrice } from "@/lib/utils";
import { Link } from "@/i18n/routing";

import { Stock, StockType } from "@/types/gestionTitres";

interface MarketTableProps {
  type: StockType;
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

export function MarketTable({ type }: MarketTableProps) {
  const t = useTranslations("TitresTable");
  const { toast } = useToast();
  const [data, setData] = React.useState<Stock[]>([]);
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

  const stockType = mapToStockType(type);
  const { stocks, loading, error } = useStocksREST(stockType);

  React.useEffect(() => {
    if (stocks?.length) {
      setData(stocks);
    } else if (error) {
      toast({
        variant: "destructive",
        title: "Erreur de chargement",
        description: error || "Impossible de charger les données.",
      });
    }
  }, [stocks, error, toast]);

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
            const price = row.original.stockPrices?.[0]?.price;
            return formatPrice(price ?? 0) ?? "NC";
          },
        },
        {
          accessorKey: "currentPrice",
          header: t("valeurActuelle"),
          cell: ({ row }) => {
            const prices = row.original.stockPrices ?? [];
            const current = prices[prices.length - 1]?.price;
            return formatPrice(current) ?? "NC";
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
              status === "active" || status === "activated"
                ? "actif"
                : status === "suspended"
                ? "suspendu"
                : status === "moved_to_secondary"
                ? "marche_secondaire"
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
                    href={`/gestion-des-titres/marcheprimaire/${type}/${stock.id}`}
                  >
                    {t("voirDetails")}
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href={`/gestion-des-titres/marcheprimaire/${type}/${stock.id}/edit`}
                  >
                    {t("modifier")}
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          );
        },
      }
    );

    return cols;
  }, [t, type]);

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
    return <div className="p-8 text-center animate-pulse">Loading...</div>;
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
    </div>
  );
}
