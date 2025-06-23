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
import { useStocks } from "@/hooks/useStocks";
import { useSession } from "next-auth/react";
import { Link } from "@/i18n/routing";

interface TitresTableProps {
  type: string;
}

export function TitresTable({ type }: TitresTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const t = useTranslations("titresTable");
  const [data, setData] = React.useState<Stock[]>([]);
  const [error, setError] = React.useState<string | null>(null);
  const [hasLoaded, setHasLoaded] = React.useState(false);
  const { data: session } = useSession();

  // Use the stocks hook
  const { fetchStocks, isLoading: loading, hasToken } = useStocks();

  // Extract roleId with type assertion and safety check
  const roleId = React.useMemo(() => {
    try {
      return (session?.user as any)?.roleid;
    } catch (error) {
      console.error("Error accessing session:", error);
      return null;
    }
  }, [session]);

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
        // Only show the code, not the issuer object
        return (
          <div className="capitalize flex flex-col gap-1">
            <div className="font-semibold">
              {typeof row.original.code === "string"
                ? row.original.code
                : "N/A"}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "code",
      header: t("code"),
      cell: ({ row }) => {
        const codeValue = row.getValue("code");
        let displayCode = "N/A";

        if (codeValue) {
          if (typeof codeValue === "object" && codeValue !== null) {
            displayCode = JSON.stringify(codeValue);
          } else {
            displayCode = String(codeValue);
          }
        }

        return (
          <div className="uppercase text-gray-500 font-semibold text-xs">
            {displayCode}
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
            cell: ({ row }: { row: any }) => (
              <div className="capitalize">
                {row.getValue("emissionDate")
                  ? formatDate(row.getValue("emissionDate"))
                  : "NC"}
              </div>
            ),
          },
          {
            accessorKey: "closingDate",
            header: t("cloture"),
            cell: ({ row }: { row: any }) => (
              <div className="capitalize">
                {row.getValue("closingDate")
                  ? formatDate(row.getValue("closingDate"))
                  : "NC"}
              </div>
            ),
          },
        ]
      : [
          {
            accessorKey: "enjoymentDate",
            header: t("valeurOuverture"),
            cell: ({ row }: { row: any }) => {
              const marketMetadata = row.getValue("marketMetadata");
              const cours = marketMetadata?.cours || [];

              if (cours.length >= 2) {
                return (
                  <div className="capitalize">
                    {formatPrice(cours[0]?.value || 0)}
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
              const marketMetadata = row.getValue("marketMetadata");
              const cours = marketMetadata?.cours || [];

              if (cours.length >= 2) {
                const currentValue = cours[cours.length - 1]?.value || 0;
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
        const statusValue = row.getValue("status");
        let statusDisplay = "NC";

        if (statusValue) {
          // Check if status is an object
          if (typeof statusValue === "object" && statusValue !== null) {
            // Try to extract a usable string representation
            // Use a type assertion to handle the object properties
            const objValue = statusValue as Record<string, any>;
            statusDisplay =
              objValue.value || objValue.label || JSON.stringify(statusValue);
          } else {
            // Handle string status values
            statusDisplay = String(statusValue);
          }
        }

        // Now apply the translations to the string representation
        return (
          <div className="capitalize">
            {statusDisplay === "active"
              ? t("actif")
              : statusDisplay === "suspended"
              ? t("suspendu")
              : statusDisplay === "moved_to_secondary"
              ? t("marche_secondaire")
              : statusDisplay}
          </div>
        );
      },
    },
    {
      id: "actions",
      enableHiding: false,
      cell: ({ row }) => {
        const stock = row.original;
        // Handle any type of ID safely
        let stockId = "";
        if (stock.id !== undefined && stock.id !== null) {
          if (typeof stock.id === "string") {
            stockId = stock.id;
          } else if (typeof stock.id === "number") {
            stockId = String(stock.id);
          } else if (typeof stock.id === "object") {
            stockId = JSON.stringify(stock.id);
          }
        }

        if (!stockId) {
          return null; // No actions if no valid ID
        }

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
                onClick={() => navigator.clipboard.writeText(stockId)}
              >
                {t("copierID")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href={
                    type === "action" ||
                    type === "obligation" ||
                    type === "sukuk" ||
                    type === "titresparticipatifs"
                      ? `/passerunordre/marchesecondaire/${type}/${stockId}`
                      : `/passerunordre/marcheprimaire/${type}/${stockId}`
                  }
                >
                  {t("voirDetails")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={
                    type === "action" ||
                    type === "obligation" ||
                    type === "sukuk" ||
                    type === "titresparticipatifs"
                      ? `/passerunordre/marchesecondaire/${type}/${stockId}`
                      : `/passerunordre/marcheprimaire/${type}/${stockId}`
                  }
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

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      // Prevent loading if already loaded for this type or no token
      if (hasLoaded || !hasToken) {
        console.log("⏳ Waiting for token or already loaded");
        return;
      }

      try {
        console.log("🔄 Loading stocks for type:", type);

        // Map the type parameter to the correct API endpoint
        let typeToFilter = type;

        // Always map to the base type regardless of primary/secondary market
        if (type === "opv" || type === "action") {
          typeToFilter = "action";
        } else if (type === "empruntobligataire" || type === "obligation") {
          typeToFilter = "obligation";
        } else if (
          type === "sukukmp" ||
          type === "sukukms" ||
          type === "sukuk"
        ) {
          typeToFilter = "sukuk";
        } else if (
          type === "titresparticipatifsmp" ||
          type === "titresparticipatifsms" ||
          type === "titresparticipatifs" ||
          type === "participatif"
        ) {
          typeToFilter = "participatif";
        }

        console.log(`Using API endpoint /api/v1/stock/${typeToFilter}`);

        // Always use the same API endpoint for both primary and secondary markets
        const result = await fetchStocks(typeToFilter);

        if (isMounted) {
          setData(result || []);
          setError(null);
          setHasLoaded(true);
          console.log("✅ Stocks loaded successfully:", result);
        }
      } catch (error) {
        console.error("Error loading stocks:", error);
        if (isMounted) {
          setError("Failed to load stocks");
          setData([]);
        }
      }
    };

    loadData();

    return () => {
      isMounted = false;
    };
  }, [type, hasToken, fetchStocks, hasLoaded]);

  // Reset loaded state when type changes
  useEffect(() => {
    setHasLoaded(false);
    setError(null);
  }, [type]);

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
      <div className="flex justify-center items-center p-8">
        <div className="text-center">
          <p className="text-red-500">{error}</p>
          <button
            onClick={() => {
              setError(null);
              setHasLoaded(false);
            }}
            className="mt-2 px-4 py-2 bg-primary text-white rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!hasToken) {
    return (
      <div className="flex justify-center items-center p-8">
        <div className="text-center">
          <p className="text-gray-500">
            Token required or authentication loading...
          </p>
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
    </div>
  );
}
