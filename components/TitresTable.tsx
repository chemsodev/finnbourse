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
import { ArrowUpDown, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
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
import TitreDrawer from "./TitreDrawer";
import { useTranslations } from "next-intl";
import { formatDate, formatPrice } from "@/lib/utils";
import TitresTableSkeleton from "./TitresTableSkeleton";
import { LIST_STOCKS_QUERY, LIST_BOND_QUERY } from "@/graphql/queries";
import { Suspense, useState } from "react";
import { Bond, Stock, Sukuk, TitreParticipatif } from "@/lib/interfaces";

import { fetchGraphQL } from "@/app/actions/fetchGraphQL";
import AddSecurityHistory from "./AddSecurityHistory";
import { useSession } from "next-auth/react";
import UpdateFaceValue from "./UpdateFaceValue";
import LogOutAgent from "./LogOutAgent";
import RateLimitReached from "./RateLimitReached";

// Define the expected data structure for each query
interface QueryData {
  listStocks?: Stock[];
  listBonds?: Bond[];
}

interface TitresTableProps {
  type: string;
}

export function TitresTable({ type }: TitresTableProps) {
  const t = useTranslations("TitresTable");
  const session = useSession();
  const roleId = session?.data?.user?.roleid;
  const [data, setData] = useState<QueryData | null>(null);
  const [loading, setLoading] = useState(true);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({ code: false });
  const [rowSelection, setRowSelection] = React.useState({});
  const subscriptionTypes = [
    "action",
    "obligation",
    "sukukms",
    "titresparticipatifsms",
  ];

  // Define your columns for the table
  const columns = (t: (key: string) => string): ColumnDef<any>[] => [
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
      cell: ({ row }) => (
        <div className="capitalize flex flex-col gap-1">
          <div className="font-semibold">{row.getValue("issuer")}</div>
          <div className="uppercase text-gray-500 font-semibold text-xs">
            {row.getValue("code") || "N/A"}
          </div>
        </div>
      ),
    },
    {
      accessorKey: "code",
      header: t("code"),
      cell: ({ row }) => (
        <div className="uppercase text-gray-500 font-semibold text-xs">
          {row.getValue("code") || "N/A"}
        </div>
      ),
    },
    ...(type !== "action" &&
    type !== "obligation" &&
    type !== "sukukms" &&
    type !== "titresparticipatifsms"
      ? [
          {
            accessorKey: "emissiondate",
            header: t("ouverture"),
            cell: ({ row }: { row: any }) => (
              <div className="capitalize">
                {row.getValue("emissiondate")
                  ? formatDate(row.getValue("emissiondate"))
                  : "NC"}
              </div>
            ),
          },
          {
            accessorKey: "closingdate",
            header: t("cloture"),
            cell: ({ row }: { row: any }) => (
              <div className="capitalize">
                {row.getValue("closingdate")
                  ? formatDate(row.getValue("closingdate"))
                  : "NC"}
              </div>
            ),
          },
        ]
      : [
          {
            accessorKey: "enjoymentdate",
            header: t("valeurOuverture"),
            cell: ({ row }: { row: any }) => {
              const marketMetadata = row.getValue("marketmetadata");
              const cours = marketMetadata?.cours || [];

              // Check if there are at least two cours entries
              if (cours.length < 2) {
                return <div>NC</div>;
              }

              // Sort the cours by date
              const sortedCours = [...cours].sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                return dateA.getTime() - dateB.getTime();
              });

              // Get the second-to-last cours entry
              const secondToLast = sortedCours[sortedCours.length - 2];

              return (
                <div className="capitalize">
                  {secondToLast?.price !== null ? secondToLast.price : "NC"}
                </div>
              );
            },
          },
          {
            accessorKey: "facevalue",
            header: t("valeurCloture"),
            cell: ({ row }: { row: any }) => (
              <div className="capitalize">
                {row.getValue("facevalue") ? row.getValue("facevalue") : "NC"}
              </div>
            ),
          },
        ]),
    ...(subscriptionTypes.includes(type)
      ? [
          {
            accessorKey: "marketmetadata",
            header: t("variation"),
            cell: ({ row }: { row: any }) => {
              const marketMetadata = row.getValue("marketmetadata");

              if (
                typeof marketMetadata !== "object" ||
                marketMetadata === null
              ) {
                return <div>0.00%</div>;
              }

              const cours = marketMetadata.cours || [];

              if (!Array.isArray(cours) || cours.length < 2) {
                return <div>0.00%</div>;
              }

              // Sort the cours by date
              const sortedCours = [...cours].sort((a, b) => {
                const dateA = new Date(a.date);
                const dateB = new Date(b.date);
                return dateA.getTime() - dateB.getTime();
              });

              // Get the last two cours entries
              const [previous, latest] = sortedCours.slice(-2);

              // Calculate variation
              if (
                latest === undefined ||
                previous === undefined ||
                latest.price === null ||
                previous.price === null
              ) {
                return <div>0.00%</div>;
              }

              const previousPrice = parseFloat(previous.price.toString());

              const latestPrice = parseFloat(latest.price.toString());

              if (
                isNaN(previousPrice) ||
                isNaN(latestPrice) ||
                previousPrice === 0
              ) {
                return <div>0.00%</div>;
              }

              const variation =
                ((latestPrice - previousPrice) / previousPrice) * 100;

              return <div className="capitalize">{variation.toFixed(2)}%</div>;
            },
          },
        ]
      : []),
    ...(type !== "action" &&
    type !== "obligation" &&
    type !== "sukukms" &&
    type !== "titresparticipatifsms"
      ? [
          {
            accessorKey: "facevalue",
            header: t("valeurNominale"),
            cell: ({ row }: { row: any }) => (
              <div className="capitalize">
                {formatPrice(row.getValue("facevalue") || 0)}
              </div>
            ),
          },
        ]
      : []),
    {
      accessorKey: "id",
      header: t("plusInfo"),
      cell: ({ row }) => (
        <div className="flex gap-4">
          <TitreDrawer titreId={String(row.getValue("id"))} type={type} />
          {(type === "action" ||
            type === "obligation" ||
            type === "sukukms" ||
            type === "titresparticipatifsms") &&
            (roleId === 2 || roleId === 3) && (
              <>
                <AddSecurityHistory securityId={String(row.getValue("id"))} />
                <UpdateFaceValue securityId={String(row.getValue("id"))} />
              </>
            )}
        </div>
      ),
    },
  ];

  let query;

  if (type === "action" || type === "opv") {
    query = LIST_STOCKS_QUERY;
  } else {
    query = LIST_BOND_QUERY;
  }

  const fetchData = async () => {
    try {
      const result = await fetchGraphQL<QueryData>(query, {
        type,
      });
      setData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
      if (error === "Too many requests") {
        return <RateLimitReached />;
      }
      if (error === "Token is revoked") {
        return <LogOutAgent />;
      }
    } finally {
      setLoading(false);
    }
  };

  // Fetch data using the GraphQL query
  React.useEffect(() => {
    fetchData();
  }, []);

  const table = useReactTable({
    data: data?.listStocks || data?.listBonds || [],
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

  return loading ? (
    <TitresTableSkeleton />
  ) : (
    <div className="w-full">
      <div className="flex items-end py-4">
        <Input
          placeholder={t("filtrer")}
          value={(table.getColumn("issuer")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("issuer")?.setFilterValue(event.target.value)
          }
          className="max-w-xs"
        />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="ml-auto">
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
                    {column.id === "issuer" ? t("issuer") : column.id}
                  </DropdownMenuCheckboxItem>
                );
              })}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="rounded-md border my-4">
        <Suspense fallback={<TitresTableSkeleton />}>
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
                    {t("noResult")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Suspense>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            className="bg-white"
          >
            &lt;
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            className="bg-white"
          >
            &gt;
          </Button>
        </div>
      </div>
    </div>
  );
}
