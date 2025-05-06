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
  Calendar,
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
import { fetchGraphQL } from "@/app/actions/fetchGraphQL";
import { LIST_BOND_QUERY, FIND_UNIQUE_BOND_QUERY } from "@/graphql/queries";
import { DELETE_BOND } from "@/graphql/mutations";
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

interface Bond {
  id: string;
  name: string;
  isincode: string;
  code: string;
  issuer: string;
  marketlisting: string;
  emissiondate: string;
  enjoymentdate: string;
  maturitydate: string;
  quantity: number;
  facevalue: number;
  yieldrate?: number;
  repaymentmethod?: string;
  type: string;
}

interface ObligationsTableProps {
  onCreateNew?: () => void;
}

export default function ObligationsTable({
  onCreateNew,
}: ObligationsTableProps) {
  const t = useTranslations("Obligations.table");
  const [bonds, setBonds] = useState<Bond[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortColumn, setSortColumn] = useState<string>("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deletingBond, setDeletingBond] = useState(false);
  const [bondToDelete, setBondToDelete] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>("all");

  const router = useRouter();
  const { toast: globalToast } = useToast();

  // Fetch bonds data
  useEffect(() => {
    const fetchBonds = async () => {
      setLoading(true);
      try {
        const response = await fetchGraphQL(LIST_BOND_QUERY, {
          type: selectedType === "all" ? undefined : selectedType,
        });
        setBonds((response as any).listBonds || []);
      } catch (error) {
        console.error("Error fetching bonds:", error);
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

    fetchBonds();
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

  // Filter and sort bonds
  const filteredAndSortedBonds = bonds
    .filter((bond) => {
      return (
        bond.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bond.isincode.toLowerCase().includes(searchTerm.toLowerCase()) ||
        bond.issuer.toLowerCase().includes(searchTerm.toLowerCase())
      );
    })
    .sort((a, b) => {
      const aValue = a[sortColumn as keyof Bond];
      const bValue = b[sortColumn as keyof Bond];

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
  const handleDeleteClick = (bondId: string) => {
    setBondToDelete(bondId);
    setDeleteDialogOpen(true);
  };

  // Confirm delete
  const handleConfirmDelete = async () => {
    if (!bondToDelete) return;

    setDeletingBond(true);
    try {
      await fetchGraphQL(DELETE_BOND, { securityId: bondToDelete });

      // Remove the deleted bond from the state
      setBonds(bonds.filter((bond) => bond.id !== bondToDelete));

      globalToast({
        title: t("deleteSuccess"),
        description: t("bondDeleted"),
      });
    } catch (error) {
      console.error("Error deleting bond:", error);
      setError(String(error));
      globalToast({
        variant: "destructive",
        title: t("deleteError"),
        description: String(error),
      });
    } finally {
      setDeletingBond(false);
      setDeleteDialogOpen(false);
      setBondToDelete(null);
    }
  };

  // Format date
  const formatDateString = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return format(date, "dd/MM/yyyy");
    } catch (error) {
      return "-";
    }
  };

  // Navigate to create new obligation
  const handleCreateNew = () => {
    if (onCreateNew) {
      onCreateNew();
    } else {
      router.push("/obligations/create");
    }
  };

  // Navigate to edit obligation
  const handleEdit = (bondId: string) => {
    router.push(`/obligations/${bondId}/edit`);
  };

  // Navigate to view obligation details
  const handleView = (bondId: string) => {
    router.push(`/obligations/${bondId}`);
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
              <SelectItem value="obligation">{t("obligationType")}</SelectItem>
              <SelectItem value="sukuk">{t("sukukType")}</SelectItem>
              <SelectItem value="titre_participatif">{t("tpType")}</SelectItem>
              <SelectItem value="emprunt_obligataire">{t("ebType")}</SelectItem>
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
        ) : filteredAndSortedBonds.length === 0 ? (
          <div className="text-center p-4">
            <FileX className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-muted-foreground">
              {searchTerm ? t("noResults") : t("noBonds")}
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
                    className="cursor-pointer whitespace-nowrap"
                    onClick={() => handleSort("maturitydate")}
                  >
                    <div className="flex items-center">
                      {t("maturityDate")}
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
                {filteredAndSortedBonds.map((bond) => (
                  <TableRow key={bond.id}>
                    <TableCell className="font-medium">{bond.name}</TableCell>
                    <TableCell>{bond.issuer}</TableCell>
                    <TableCell>{bond.isincode}</TableCell>
                    <TableCell className="whitespace-nowrap">
                      {formatDateString(bond.maturitydate)}
                    </TableCell>
                    <TableCell className="text-right">
                      {bond.facevalue.toLocaleString()}
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
                          <DropdownMenuItem onClick={() => handleView(bond.id)}>
                            <Eye className="mr-2 h-4 w-4" />
                            <span>{t("view")}</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleEdit(bond.id)}>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>{t("edit")}</span>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => handleDeleteClick(bond.id)}
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
                disabled={deletingBond}
              >
                {t("cancel")}
              </Button>
              <Button
                type="button"
                variant="destructive"
                onClick={handleConfirmDelete}
                disabled={deletingBond}
              >
                {deletingBond ? (
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
