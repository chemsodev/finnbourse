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
      commission.loiDeFrais.toLowerCase().includes(searchTerm.toLowerCase())
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
      return `${commission.commissionValue.toLocaleString()} (Fixed)`;
    } else if (commission.commissionType === "percentage") {
      return `${commission.commissionValue}%`;
    } else {
      return "Tiered";
    }
  };

  return (
    <div>
      <div className="flex items-center mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search commissions..."
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
              <TableHead>Code</TableHead>
              <TableHead>Libellé</TableHead>
              <TableHead>Loi de frais</TableHead>
              <TableHead>Marché</TableHead>
              <TableHead>Commission</TableHead>
              <TableHead>TVA (%)</TableHead>
              <TableHead>Type</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCommissions.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-6 text-muted-foreground"
                >
                  No commissions found
                </TableCell>
              </TableRow>
            ) : (
              filteredCommissions.map((commission) => (
                <TableRow key={commission.id}>
                  <TableCell className="font-medium">
                    {commission.code}
                  </TableCell>
                  <TableCell>{commission.libelle}</TableCell>
                  <TableCell>{commission.loiDeFrais}</TableCell>
                  <TableCell>{commission.marche}</TableCell>
                  <TableCell>{formatCommissionValue(commission)}</TableCell>
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
                        ? "Fixed"
                        : commission.commissionType === "percentage"
                        ? "Percentage"
                        : "Tiered"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="h-4 w-4" />
                          <span className="sr-only">Open menu</span>
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => onEdit(commission)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteClick(commission.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
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
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this commission? This action
              cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
