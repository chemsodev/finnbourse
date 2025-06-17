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
import { TitreDrawer } from "./TitreDrawer";
import { useTranslations } from "next-intl";
import { formatDate, formatPrice } from "@/lib/utils";
import TitresTableSkeleton from "./TitresTableSkeleton";
import { LIST_STOCKS_QUERY, LIST_BOND_QUERY } from "@/graphql/queries";
import { Suspense, useState, useEffect } from "react";
import { Bond, Stock } from "@/lib/interfaces";

import { fetchGraphQLClient } from "@/app/actions/clientGraphQL";
import AddSecurityHistory from "../AddSecurityHistory";
import { useSession } from "next-auth/react";
import UpdateFaceValue from "./UpdateFaceValue";
import LogOutAgent from "../LogOutAgent";
import RateLimitReached from "../RateLimitReached";
import { Link } from "@/i18n/routing";

// Define the expected data structure for each query
interface QueryData {
  listStocks?: Stock[];
  listBonds?: Bond[];
}

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
  const [data, setData] = React.useState<QueryData | null>(null);
  const [loading, setLoading] = React.useState(true);
  const { data: session } = useSession();
  // Extract roleId with type assertion
  const roleId = (session?.user as any)?.roleid;
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
          <Link
            href={(() => {
              const titreId = String(row.getValue("id"));
              if (type === "empruntobligataire" || type === "opv") {
                return `/passerunordre/marcheprimaire/${type}/${titreId}`;
              } else if (type === "action" || type === "obligation") {
                return `/passerunordre/marchesecondaire/${type}/${titreId}`;
              } else if (
                type === "sukukmp" ||
                type === "titresparticipatifsmp"
              ) {
                return `/passerunordre/marcheprimaire/${type}/${titreId}`;
              } else if (
                type === "sukukms" ||
                type === "titresparticipatifsms"
              ) {
                return `/passerunordre/marchesecondaire/${type}/${titreId}`;
              }
              return "/";
            })()}
          >
            <Button>
              {subscriptionTypes ? t("souscrire") : t("passerUnOrdre")}
            </Button>
          </Link>
          <TitreDrawer titreId={String(row.getValue("id"))} type={type} />

          {(type === "action" ||
            type === "obligation" ||
            type === "sukukms" ||
            type === "titresparticipatifsms") && (
            <>
              <AddSecurityHistory securityId={String(row.getValue("id"))} />
              <UpdateFaceValue securityId={String(row.getValue("id"))} />
            </>
          )}
        </div>
      ),
    },
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        let query;
        let typeToFilter;

        // Choose query based on type
        if (
          type === "action" ||
          type === "opv" ||
          type === "sukukms" ||
          type === "titresparticipatifsms"
        ) {
          query = LIST_STOCKS_QUERY;
        } else {
          query = LIST_BOND_QUERY;
        }

        // Map the type parameter to the correct backend filter value
        if (type === "opv") {
          typeToFilter = "opv";
        } else if (type === "empruntobligataire") {
          typeToFilter = "empruntobligataire";
        } else if (type === "sukukmp") {
          typeToFilter = "sukuk";
        } else if (type === "titresparticipatifsmp") {
          typeToFilter = "titresparticipatifs";
        } else if (type === "sukukms") {
          typeToFilter = "sukuk";
        } else if (type === "titresparticipatifsms") {
          typeToFilter = "titresparticipatifs";
        } else {
          typeToFilter = type;
        }

        // Get auth token from session if available
        const token = session?.data?.user
          ? (session.data.user as any).token
          : undefined;

        // Use typeToFilter as the parameter name expected by your backend
        const result = await fetchGraphQLClient<QueryData>(
          query,
          {
            type: typeToFilter,
          },
          undefined,
          token // Pass the token for authorization
        );

        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [type, session?.data?.user]);

  const table = useReactTable({
    // Ensure we handle all possible data structures from the API
    data: React.useMemo(() => {
      if (!data) return [];

      if (data.listStocks && Array.isArray(data.listStocks)) {
        return data.listStocks;
      }

      if (data.listBonds && Array.isArray(data.listBonds)) {
        return data.listBonds;
      }

      // If data has a different structure, try to find arrays
      for (const key in data) {
        if (Array.isArray((data as any)[key])) {
          return (data as any)[key];
        }
      }

      return [];
    }, [data]),
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
              ?.map((column) => {
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
          <Table className="bg-white rounded-md">
            <TableHeader>
              {table.getHeaderGroups()?.map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers?.map((header) => {
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
                table.getRowModel().rows?.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells()?.map((cell) => (
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
