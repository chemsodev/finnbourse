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

interface TitresTableProps {
  type: string;
}

export function TitresTableREST({ type }: TitresTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const t = useTranslations("titresTable");
  const [data, setData] = React.useState<Stock[]>([]);
  const { data: session } = useSession();
  const { toast } = useToast();
  const pathname = usePathname();
  const [selectedStock, setSelectedStock] = React.useState<Stock | null>(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = React.useState(false);

  // Map the type parameter to the correct backend filter value
  let stockType: "action" | "obligation" | "sukuk" | "participatif" = "action";
  if (type === "opv") {
    stockType = "action";
  } else if (type === "empruntobligataire") {
    stockType = "obligation";
  } else if (type === "sukukmp" || type === "sukukms" || type === "sukuk") {
    stockType = "sukuk";
  } else if (
    type === "titresparticipatifsmp" ||
    type === "titresparticipatifsms" ||
    type === "titresparticipatifs"
  ) {
    stockType = "participatif";
  } else if (type === "action" || type === "obligation") {
    stockType = type;
  }

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

      // Check if we have the expected properties
      if (stocks.length > 0) {
        const firstStock = stocks[0];
        console.log("📋 First stock sample:", {
          id: firstStock.id,
          name: firstStock.name,
          code: firstStock.code,
          issuer: firstStock.issuer,
          status: firstStock.status,
          stockPrices: firstStock.stockPrices,
        });
      }

      setData(stocks);
      console.log(`✅ Loaded ${stocks.length} ${stockType} stocks`);
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
      <TitreDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedStock(null);
        }}
        stock={selectedStock}
        type={type}
      />
    </div>
  );
}