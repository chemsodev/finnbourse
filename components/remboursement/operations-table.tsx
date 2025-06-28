"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Edit, Trash2, Plus, ChevronUp, ChevronDown } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { OperationsForm } from "@/components/remboursement/operations-form";

// Sample data structure for remboursements
interface Remboursement {
  id: string;
  titrePrincipal: string;
  referenceOst: string;
  evenement: string;
  descriptionOst: string;
  prixUnitaireNet: string;
  dateExecution?: Date;
  dateValeurPaiement?: Date;
  commentaire: string;
}

type SortField = 'titrePrincipal' | 'referenceOst' | 'evenement' | 'descriptionOst' | 'prixUnitaireNet' | 'dateExecution' | 'dateValeurPaiement';
type SortDirection = 'asc' | 'desc';

export default function OperationsTable() {
  const t = useTranslations("Remboursement");

  // State for managing remboursements
  const [remboursements, setRemboursements] = useState<Remboursement[]>([
    {
      id: "1",
      titrePrincipal: "SAIDAL",
      referenceOst: "REF001",
      evenement: "primaire",
      descriptionOst: "Remboursement initial",
      prixUnitaireNet: "1000",
      dateExecution: new Date(2023, 5, 15),
      dateValeurPaiement: new Date(2023, 5, 20),
      commentaire: "Premier remboursement",
    },
    {
      id: "2",
      titrePrincipal: "BIOPHARM",
      referenceOst: "REF002",
      evenement: "secondaire",
      descriptionOst: "Remboursement partiel",
      prixUnitaireNet: "500",
      dateExecution: new Date(2023, 6, 10),
      dateValeurPaiement: new Date(2023, 6, 15),
      commentaire: "Deuxième tranche",
    },
  ]);

  // State for dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentRemboursement, setCurrentRemboursement] =
    useState<Remboursement | null>(null);
  const [sortField, setSortField] = useState<SortField>('titrePrincipal');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ChevronDown className="ml-2 h-4 w-4 opacity-50" />;
    }
    return sortDirection === 'asc' ? (
      <ChevronUp className="ml-2 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-2 h-4 w-4" />
    );
  };

  const sortRemboursements = (data: Remboursement[]) => {
    return [...data].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'titrePrincipal':
          aValue = a.titrePrincipal;
          bValue = b.titrePrincipal;
          break;
        case 'referenceOst':
          aValue = a.referenceOst;
          bValue = b.referenceOst;
          break;
        case 'evenement':
          aValue = a.evenement;
          bValue = b.evenement;
          break;
        case 'descriptionOst':
          aValue = a.descriptionOst;
          bValue = b.descriptionOst;
          break;
        case 'prixUnitaireNet':
          aValue = parseFloat(a.prixUnitaireNet);
          bValue = parseFloat(b.prixUnitaireNet);
          break;
        case 'dateExecution':
          aValue = a.dateExecution || new Date(0);
          bValue = b.dateExecution || new Date(0);
          break;
        case 'dateValeurPaiement':
          aValue = a.dateValeurPaiement || new Date(0);
          bValue = b.dateValeurPaiement || new Date(0);
          break;
        default:
          return 0;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  };

  const sortedRemboursements = sortRemboursements(remboursements);

  // Open dialog for creating a new remboursement
  const handleAddNew = () => {
    setCurrentRemboursement(null);
    setIsDialogOpen(true);
  };

  // Open dialog for editing an existing remboursement
  const handleEdit = (remboursement: Remboursement) => {
    setCurrentRemboursement(remboursement);
    setIsDialogOpen(true);
  };

  // Delete a remboursement
  const handleDelete = (id: string) => {
    setRemboursements(remboursements.filter((item) => item.id !== id));
  };

  // Handle form submission (create or update)
  const handleFormSubmit = (data: any) => {
    if (currentRemboursement) {
      // Update existing remboursement
      setRemboursements(
        remboursements.map((item) =>
          item.id === currentRemboursement.id ? { ...item, ...data } : item
        )
      );
    } else {
      // Create new remboursement
      const newRemboursement = {
        id: Date.now().toString(),
        ...data,
      };
      setRemboursements([...remboursements, newRemboursement]);
    }
    setIsDialogOpen(false);
  };

  // Format event type for display
  const formatEventType = (type: string) => {
    switch (type) {
      case "primaire":
        return t("primary");
      case "secondaire":
        return t("secondary");
      case "primaire-secondaire":
        return t("primarySecondary");
      default:
        return type;
    }
  };

  return (
    <div className="py-10 px-4">
      <div className="bg-gray-100 rounded-xl p-8 shadow-inner">
        <div className="flex justify-between items-center mb-8 pb-8 border-b">
          <h1 className="text-3xl font-bold text-secondary">{t("title")}</h1>
          <Button onClick={handleAddNew} className="bg-primary text-white">
            <Plus className="mr-2 h-4 w-4" />
            {t("addNew")}
          </Button>
        </div>

        <div className="overflow-x-auto bg-white rounded-lg">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('titrePrincipal')}
                >
                  <div className="flex items-center">
                    {t("selectionTitrePrincipal")}
                    {getSortIcon('titrePrincipal')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('referenceOst')}
                >
                  <div className="flex items-center">
                    {t("referenceOst")}
                    {getSortIcon('referenceOst')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('evenement')}
                >
                  <div className="flex items-center">
                    {t("evenement")}
                    {getSortIcon('evenement')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('descriptionOst')}
                >
                  <div className="flex items-center">
                    {t("descriptionOST")}
                    {getSortIcon('descriptionOst')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('prixUnitaireNet')}
                >
                  <div className="flex items-center">
                    {t("montantUnitaireNet")}
                    {getSortIcon('prixUnitaireNet')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('dateExecution')}
                >
                  <div className="flex items-center">
                    {t("dateExecution")}
                    {getSortIcon('dateExecution')}
                  </div>
                </TableHead>
                <TableHead 
                  className="cursor-pointer"
                  onClick={() => handleSort('dateValeurPaiement')}
                >
                  <div className="flex items-center">
                    {t("valuePaymentDate")}
                    {getSortIcon('dateValeurPaiement')}
                  </div>
                </TableHead>
                <TableHead className="text-right">{t("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedRemboursements.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-6 text-gray-500"
                  >
                    {t("noRemboursements")}
                  </TableCell>
                </TableRow>
              ) : (
                sortedRemboursements.map((remboursement) => (
                  <TableRow key={remboursement.id}>
                    <TableCell className="font-medium">
                      {remboursement.titrePrincipal}
                    </TableCell>
                    <TableCell>{remboursement.referenceOst}</TableCell>
                    <TableCell>
                      {formatEventType(remboursement.evenement)}
                    </TableCell>
                    <TableCell>{remboursement.descriptionOst}</TableCell>
                    <TableCell>{remboursement.prixUnitaireNet}</TableCell>
                    <TableCell>
                      {remboursement.dateExecution
                        ? format(remboursement.dateExecution, "dd/MM/yyyy", {
                            locale: fr,
                          })
                        : "-"}
                    </TableCell>
                    <TableCell>
                      {remboursement.dateValeurPaiement
                        ? format(
                            remboursement.dateValeurPaiement,
                            "dd/MM/yyyy",
                            { locale: fr }
                          )
                        : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            ...
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleEdit(remboursement)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            {t("edit")}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(remboursement.id)}
                            className="text-red-600"
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

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {currentRemboursement
                  ? t("editRemboursement")
                  : t("addRemboursement")}
              </DialogTitle>
            </DialogHeader>
            <OperationsForm
              initialData={currentRemboursement}
              onSubmit={handleFormSubmit}
              onCancel={() => setIsDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
