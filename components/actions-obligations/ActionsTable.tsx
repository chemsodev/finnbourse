"use client";

import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  ArrowUpDown,
  Eye,
  Loader2,
  MoreHorizontal,
  Edit,
  FileX,
  AlertCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { useTranslations } from "next-intl";
// import { fetchGraphQLClient } from "@/app/actions/clientGraphQL";
// import { LIST_STOCKS_QUERY, FIND_UNIQUE_STOCKS_QUERY } from "@/graphql/queries";
// import { DELETE_STOCK } from "@/graphql/mutations";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "@/i18n/routing";
import { useToast } from "@/hooks/use-toast";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Stock {
  id: string;
  name: string;
  isincode: string;
  code: string;
  issuer: string;
  marketlisting: string;
  emissiondate: string;
  enjoymentdate: string;
  quantity: number;
  facevalue: number;
  dividendrate?: number;
}

interface ActionsTableProps {
  onCreateNew?: () => void;
}

export default function ActionsTable({ onCreateNew }: ActionsTableProps) {
  const t = useTranslations("Actions.table");
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortColumn, setSortColumn] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingStock, setDeletingStock] = useState(false);
  const [stockToDelete, setStockToDelete] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>("all");
  const { toast: globalToast } = useToast();

  const router = useRouter();

  // Fetch stocks data
  useEffect(() => {
    const fetchStocks = async () => {
      setLoading(true);
      try {
        // TODO: Replace with REST API call
        // const response = await fetchGraphQLClient(LIST_STOCKS_QUERY, {
        //   type: selectedType === "all" ? "action" : selectedType,
        // });

        // Mock stocks data
        const mockStocks: Stock[] = [
          {
            id: "1",
            name: "ABC Corporation",
            isincode: "TN0001234567",
            code: "ABC",
            issuer: "ABC Corp",
            marketlisting: "BVMT",
            emissiondate: "2023-01-15",
            enjoymentdate: "2023-01-15",
            quantity: 1000000,
            facevalue: 10,
            dividendrate: 5.5,
          },
          {
            id: "2",
            name: "XYZ Industries",
            isincode: "TN0001234568",
            code: "XYZ",
            issuer: "XYZ Industries",
            marketlisting: "BVMT",
            emissiondate: "2023-02-20",
            enjoymentdate: "2023-02-20",
            quantity: 500000,
            facevalue: 20,
            dividendrate: 4.2,
          },
        ];

        setStocks(mockStocks);
      } catch (error) {
        console.error("Error fetching stocks:", error);
        setError(String(error));
        globalToast({
          variant: "destructive",
          title: t("fetchError"),
          description: String(error),
        });
      } finally {
        setLoading(false);
      }
    };

    fetchStocks();
  }, [selectedType]);

  // Handle sort
  const handleSort = (column: string) => {
    if (sortColumn === column) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortDirection("asc");
    }
  };

  // Filter and sort stocks
  const filteredAndSortedStocks = stocks
    .filter((stock) => {
      return (
        stock.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.isincode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        stock.issuer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .sort((a, b) => {
      const aValue = a[sortColumn as keyof Stock];
      const bValue = b[sortColumn as keyof Stock];

      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      // For numbers
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }

      return 0;
    });

  // Open delete dialog
  const handleDeleteClick = (stockId: string) => {
    setStockToDelete(stockId);
    setDeleteDialogOpen(true);
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    if (!stockToDelete) return;

    setDeletingStock(true);
    try {
      // TODO: Replace with REST API call
      // await fetchGraphQLClient(DELETE_STOCK, { securityId: stockToDelete });

      console.log("Stock deletion simulated for ID:", stockToDelete);

      // Remove the deleted stock from the state
      setStocks(stocks.filter((stock) => stock.id !== stockToDelete));

      globalToast({
        title: t("deleteSuccess"),
        description: t("stockDeleted"),
      });
    } catch (error) {
      console.error("Error deleting stock:", error);
      setError(String(error));
      globalToast({
        variant: "destructive",
        title: t("deleteError"),
        description: String(error),
      });
    } finally {
      setDeletingStock(false);
      setDeleteDialogOpen(false);
      setStockToDelete(null);
    }
  };

  // Navigate to create new action
  const handleCreateNew = () => {
    if (onCreateNew) {
      onCreateNew();
    } else {
      router.push("/actions/create");
    }
  };

  // Navigate to edit action
  const handleEdit = (stockId: string) => {
    router.push(`/actions/${stockId}/edit`);
  };

  // Navigate to view action details
  const handleView = (stockId: string) => {
    router.push(`/actions/${stockId}`);
  };

  return (
    <Card className="w-full shadow-md">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>{t("title")}</CardTitle>
            <CardDescription>{t("description")}</CardDescription>
          </div>
          <Button onClick={handleCreateNew} className="flex items-center gap-2">
            <Plus className="h-4 w-4" /> {t("createNew")}
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder={t("searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8"
            />
          </div>
          <Select value={selectedType} onValueChange={setSelectedType}>
            <SelectTrigger className="w-full md:w-[180px]">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">{t("allTypes")}</SelectItem>
              <SelectItem value="action">{t("stockType")}</SelectItem>
              <SelectItem value="ipo">{t("ipoType")}</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-32">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : error ? (
          <div className="text-center text-destructive p-4">
            <AlertCircle className="h-8 w-8 mx-auto mb-2" />
            <p>{error}</p>
          </div>
        ) : filteredAndSortedStocks.length === 0 ? (
          <div className="text-center p-4">
            <FileX className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-muted-foreground">
              {searchTerm ? t("noResults") : t("noStocks")}
            </p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("name")}
                  >
                    <div className="flex items-center">
                      {t("name")}
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("issuer")}
                  >
                    <div className="flex items-center">
                      {t("issuer")}
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead>{t("isin")}</TableHead>
                  <TableHead
                    className="cursor-pointer"
                    onClick={() => handleSort("marketlisting")}
                  >
                    <div className="flex items-center">
                      {t("market")}
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead
                    className="cursor-pointer text-right"
                    onClick={() => handleSort("facevalue")}
                  >
                    <div className="flex items-center justify-end">
                      {t("nominal")}
                      <ArrowUpDown className="ml-2 h-4 w-4" />
                    </div>
                  </TableHead>
                  <TableHead className="text-right">{t("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAndSortedStocks.map((stock) => (
                  <TableRow key={stock.id}>
                    <TableCell className="font-medium">{stock.name}</TableCell>
                    <TableCell>{stock.issuer}</TableCell>
                    <TableCell>{stock.isincode}</TableCell>
                    <TableCell>{stock.marketlisting}</TableCell>
                    <TableCell className="text-right">
                      {stock.facevalue.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">{t("openMenu")}</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleView(stock.id)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            <span>{t("view")}</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEdit(stock.id)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            <span>{t("edit")}</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteClick(stock.id)}
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>{t("delete")}</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{t("confirmDeletion")}</DialogTitle>
              <DialogDescription>
                {t("deleteConfirmationMessage")}
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setDeleteDialogOpen(false)}
                disabled={deletingStock}
              >
                {t("cancel")}
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleConfirmDelete}
                disabled={deletingStock}
              >
                {deletingStock ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {t("deleting")}
                  </>
                ) : (
                  <>
                    <Trash2 className="mr-2 h-4 w-4" />
                    {t("delete")}
                  </>
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}
