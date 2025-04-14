"use client";

import { useState } from "react";
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
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MoreHorizontal, Edit, Trash2, Search } from "lucide-react";
import type { Commission } from "@/lib/interfaces";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";

interface CommissionListProps {
  commissions: Commission[];
  onEdit: (commission: Commission) => void;
  onDelete: (id: string) => void;
}

export default function CommissionList({
  commissions,
  onEdit,
  onDelete,
}: CommissionListProps) {
  const t = useTranslations("CommissionList");
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [commissionToDelete, setCommissionToDelete] = useState<string | null>(
    null
  );

  const filteredCommissions = commissions.filter(
    (commission) =>
      commission.libelle.toLowerCase().includes(searchTerm.toLowerCase()) ||
      commission.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
      commission.marche.toLowerCase().includes(searchTerm.toLowerCase()) ||
      commission.loiDeFrais.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (commission.titreType &&
        commission.titreType.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDeleteClick = (id: string) => {
    setCommissionToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (commissionToDelete) {
      onDelete(commissionToDelete);
      setDeleteDialogOpen(false);
      setCommissionToDelete(null);
    }
  };

  const formatCommissionValue = (commission: Commission) => {
    if (commission.commissionType === "fixed") {
      return `${commission.commissionValue.toLocaleString()} (${t("fixed")})`;
    } else if (commission.commissionType === "percentage") {
      return `${commission.commissionValue}%`;
    } else {
      return t("tiered");
    }
  };

  return (
    <div>
      <div className="flex items-center mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder={t("searchPlaceholder")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-8"
          />
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("code")}</TableHead>
              <TableHead>{t("name")}</TableHead>
              <TableHead>{t("securityType")}</TableHead>
              <TableHead>{t("feeRule")}</TableHead>
              <TableHead>{t("market")}</TableHead>
              <TableHead>{t("commission")}</TableHead>
              <TableHead>{t("commissionSGBV")}</TableHead>
              <TableHead>{t("vat")}</TableHead>
              <TableHead>{t("type")}</TableHead>
              <TableHead className="text-right">{t("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCommissions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={10}
                  className="text-center py-6 text-muted-foreground"
                >
                  {t("noCommissionsFound")}
                </TableCell>
              </TableRow>
            ) : (
              filteredCommissions?.map((commission) => (
                <TableRow key={commission.id}>
                  <TableCell className="font-medium">
                    {commission.code}
                  </TableCell>
                  <TableCell>{commission.libelle}</TableCell>
                  <TableCell>
                    {commission.titreType === "action"
                      ? t("stock")
                      : commission.titreType === "obligation"
                      ? t("bond")
                      : "-"}
                  </TableCell>
                  <TableCell>{commission.loiDeFrais}</TableCell>
                  <TableCell>{commission.marche}</TableCell>
                  <TableCell>{formatCommissionValue(commission)}</TableCell>
                  <TableCell>
                    {commission.commissionSGBV
                      ? `${commission.commissionSGBV}%`
                      : "-"}
                  </TableCell>
                  <TableCell>{commission.tva}%</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        commission.commissionType === "tiered"
                          ? "outline"
                          : "default"
                      }
                    >
                      {commission.commissionType === "fixed"
                        ? t("fixed")
                        : commission.commissionType === "percentage"
                        ? t("percentage")
                        : t("tiered")}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">{t("openMenu")}</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(commission)}>
                          <Edit className="mr-2 h-4 w-4" />
                          {t("edit")}
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(commission.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          {t("delete")}
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

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
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              {t("cancel")}
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              {t("delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
