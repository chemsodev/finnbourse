"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Edit, Trash2, Plus } from "lucide-react";

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
                <TableHead>{t("selectionTitrePrincipal")}</TableHead>
                <TableHead>{t("referenceOst")}</TableHead>
                <TableHead>{t("evenement")}</TableHead>
                <TableHead>{t("descriptionOST")}</TableHead>
                <TableHead>{t("montantUnitaireNet")}</TableHead>
                <TableHead>{t("dateExecution")}</TableHead>
                <TableHead>{t("valuePaymentDate")}</TableHead>
                <TableHead className="text-right">{t("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {remboursements.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="text-center py-6 text-gray-500"
                  >
                    {t("noRemboursements")}
                  </TableCell>
                </TableRow>
              ) : (
                remboursements.map((remboursement) => (
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
