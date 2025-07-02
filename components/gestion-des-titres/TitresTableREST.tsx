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
import { ArrowUpDown, ChevronDown, ChevronUp, ChevronsUpDown, Info, MoreHorizontal } from "lucide-react";

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

interface TitresTableProps {
  type: string;
  basePath: string;
}

// Exemples de titres mock
const mockStocks = [
  {
    id: "1",
    issuer: { name: "Credit Populaire D'Algérie" },
    code: "CPA",
    status: "active",
    stockPrices: [{ price: 100 }, { price: 105 }],
    type: "obligation",
  },
  {
    id: "2",
    issuer: { name: "Saidal" },
    code: "SAID",
    status: "suspended",
    stockPrices: [{ price: 200 }, { price: 210 }],
    type: "obligation",
  },
  {
    id: "3",
    issuer: { name: "Alliance Assurances" },
    code: "ALLI",
    status: "active",
    stockPrices: [{ price: 300 }, { price: 320 }],
    type: "sukuk",
  },
  {
    id: "4",
    issuer: { name: "Al Baraka" },
    code: "ALBK",
    status: "active",
    stockPrices: [{ price: 400 }, { price: 420 }],
    type: "titre participatif",
  },
];

export function TitresTableREST({ type, basePath }: TitresTableProps) {
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
    type === "titresparticipatif" ||
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
        const stock = row.original as any; // Cast to any to avoid TypeScript errors
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
      accessorKey: "id",
      header: t("id"),
      cell: ({ row }) => {
        const stock = row.original as any;
        return (
          <div className="uppercase text-gray-500 font-semibold text-xs">
            {stock.id || "N/A"}
          </div>
        );
      },
    },
    {
      accessorKey: "type",
      header: "Type",
      cell: ({ row }) => {
        const stock = row.original as any;
        // Affiche le type de la ligne si présent, sinon fallback sur stockType
        const typeLabel = stock.type || (
          stockType === "sukuk" ? "sukuk"
          : stockType === "participatif" ? "titre participatif"
          : stockType === "obligation" ? "obligation"
          : stockType === "action" ? "action"
          : ""
        );
        return (
          <div className="capitalize text-xs font-semibold text-gray-700">{typeLabel}</div>
        );
      },
    },
    ...(type !== "action" &&
    type !== "obligation" &&
    type !== "sukukms" &&
    type !== "titresparticipatif"
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
                onClick={() => navigator.clipboard.writeText(stock.id)}
              >
                {t("copierID")}
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link
                  href={(('link' in stock && (stock as any).link) || ('url' in stock && (stock as any).url) ? `${('link' in stock && (stock as any).link) || (stock as any).url}/${type}/${stock.id}` : `${basePath}/${type}/${stock.id}`)}
                >
                  {t("voirDetails")}
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link
                  href={(('link' in stock && (stock as any).link) || ('url' in stock && (stock as any).url) ? `${('link' in stock && (stock as any).link) || (stock as any).url}/${type}/${stock.id}` : `${basePath}/${type}/${stock.id}`)}
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

  const getTableData = (): Stock[] => {
    if (data && Array.isArray(data) && data.length > 0) {
      return data;
    }
    // Si pas de données API, retourne les exemples (castés en Stock[])
    return mockStocks as unknown as Stock[];
  };

  // Tri manuel comme dans session-orders
  const [sortField, setSortField] = useState<string | null>(null);
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc' | null>(null);

  const handleSort = (field: string) => {
    if (sortField === field) {
      if (sortDirection === 'asc') setSortDirection('desc');
      else if (sortDirection === 'desc') { setSortDirection(null); setSortField(null); }
      else setSortDirection('asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: string) => {
    if (sortField !== field) return <ChevronsUpDown className="inline ml-1 h-4 w-4 text-gray-400" />;
    if (sortDirection === 'asc') return <ChevronUp className="inline ml-1 h-4 w-4 text-blue-600" />;
    if (sortDirection === 'desc') return <ChevronDown className="inline ml-1 h-4 w-4 text-blue-600" />;
    return <ChevronsUpDown className="inline ml-1 h-4 w-4 text-gray-400" />;
  };

  const sortedData = [...getTableData()].sort((a, b) => {
    if (!sortField || !sortDirection) return 0;
    let aValue: any = (a as any)[sortField];
    let bValue: any = (b as any)[sortField];
    if (sortField === 'stockPrices') {
      aValue = Array.isArray(aValue) && aValue.length > 0 ? aValue[aValue.length - 1].price : 0;
      bValue = Array.isArray(bValue) && bValue.length > 0 ? bValue[bValue.length - 1].price : 0;
    } else {
      if (typeof aValue === 'string') aValue = aValue.toLowerCase();
      if (typeof bValue === 'string') bValue = bValue.toLowerCase();
    }
    if (sortDirection === 'asc') return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
    return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
  });

  const table = useReactTable({
    data: sortedData,
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
            <TableRow>
              <TableHead className="cursor-pointer" onClick={() => handleSort('id')}>ID{getSortIcon('id')}</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('issuer')}>{t('titre')}{getSortIcon('issuer')}</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('type')}>Type{getSortIcon('type')}</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('stockPrices')}>Prix{getSortIcon('stockPrices')}</TableHead>
              <TableHead className="cursor-pointer" onClick={() => handleSort('status')}>{t('statut')}{getSortIcon('status')}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedData.length ? (
              sortedData.map((stock, idx) => {
                const s = stock as any;
                return (
                  <TableRow key={s.id}>
                    <TableCell>
                      <div className="uppercase text-gray-500 font-semibold text-xs">
                        {s.id || 'N/A'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="capitalize flex flex-col gap-1">
                        <div className="font-semibold">
                          {typeof s.issuer === 'object' ? s.issuer?.name : s.issuer || s.name || 'N/A'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="capitalize text-xs font-semibold text-gray-700">
                        {s.type || (stockType === 'sukuk' ? 'sukuk' : stockType === 'participatif' ? 'titre participatif' : stockType === 'obligation' ? 'obligation' : stockType === 'action' ? 'action' : '')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="capitalize text-xs font-semibold text-gray-700">
                        {Array.isArray(s.stockPrices) && s.stockPrices.length > 0
                          ? s.stockPrices[s.stockPrices.length - 1].price
                          : 'NC'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="capitalize">
                        {s.status === 'active' || s.status === 'activated'
                          ? t('actif')
                          : s.status === 'suspended'
                          ? t('suspendu')
                          : s.status === 'moved_to_secondary'
                          ? t('marche_secondaire')
                          : s.status || 'NC'}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  {t('aucunResultat')}
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
