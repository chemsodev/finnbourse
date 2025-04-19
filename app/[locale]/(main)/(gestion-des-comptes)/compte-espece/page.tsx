"use client";

import { useState } from "react";
import { PlusCircle, Info, Edit, Trash2, Eye, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useRouter } from "next/navigation";

// Mock data for comptes titres
interface CompteTitre {
  id: string;
  codeClient: string;
  nomRaison: string;
  prenomAbrev: string;
  compteEspece: string;
  formeJuridique: string;
  dateCreation: string;
  dateUpdate: string;
  status: "active" | "inactive";
}

const mockCompteTitres: CompteTitre[] = [
  {
    id: "CT001",
    codeClient: "CL001",
    nomRaison: "Société Financière Algérienne",
    prenomAbrev: "SFA",
    compteEspece: "CE001",
    formeJuridique: "SA",
    dateCreation: "2023-06-15",
    dateUpdate: "2023-10-22",
    status: "active",
  },
  {
    id: "CT002",
    codeClient: "CL002",
    nomRaison: "Hamid Bennaceur",
    prenomAbrev: "H.B",
    compteEspece: "CE002",
    formeJuridique: "Particulier",
    dateCreation: "2023-07-20",
    dateUpdate: "2023-11-05",
    status: "active",
  },
  {
    id: "CT003",
    codeClient: "CL003",
    nomRaison: "Entreprise Nationale des Industries Électroniques",
    prenomAbrev: "ENIE",
    compteEspece: "CE003",
    formeJuridique: "SARL",
    dateCreation: "2023-05-10",
    dateUpdate: "2023-09-18",
    status: "inactive",
  },
];

export default function CompteEspece() {
  const t = useTranslations("CompteEspece");
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCompte, setSelectedCompte] = useState<CompteTitre | null>(
    null
  );
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);

  // Filtered comptes titres based on search query
  const filteredCompteTitres = mockCompteTitres.filter(
    (compte) =>
      compte.nomRaison.toLowerCase().includes(searchQuery.toLowerCase()) ||
      compte.prenomAbrev.toLowerCase().includes(searchQuery.toLowerCase()) ||
      compte.codeClient.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleViewDetails = (compte: CompteTitre) => {
    // Navigate to details page
    router.push(`/compte-espece/details/${compte.id}`);
  };

  const handleEditCompte = (compte: CompteTitre) => {
    // Navigate to edit page
    router.push(`/compte-espece/edit/${compte.id}`);
  };

  const handleDeleteClick = (compte: CompteTitre) => {
    setSelectedCompte(compte);
    setConfirmDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = () => {
    // In a real app, this would be an API call
    console.log(`Deleting compte titre with id: ${selectedCompte?.id}`);
    setConfirmDeleteDialogOpen(false);
    // Then refresh the data
  };

  const handleAddNewClick = () => {
    // Navigate to the add new page
    router.push("/compte-espece/nouveau");
  };

  return (
    <>
      <Card className="w-full shadow-lg border-0 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/20 to-primary/5 border-b">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold text-primary">
                {t("title")}
              </CardTitle>
              <CardDescription className="mt-2 text-muted-foreground">
                {t("listeComptes")}
              </CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                onClick={handleAddNewClick}
                className="flex items-center gap-1"
              >
                <PlusCircle className="h-4 w-4" />
                {t("nouveau")}
              </Button>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="rounded-full w-10 h-10"
                    >
                      <Info className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{t("gestion")}</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-8 space-y-10">
          <div className="flex justify-between items-center mb-6">
            <div className="relative w-full max-w-sm">
              <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={t("rechercher")}
                className="pl-8"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("code")}</TableHead>
                  <TableHead>{t("client")}</TableHead>
                  <TableHead>{t("compteEspece")}</TableHead>
                  <TableHead>{t("formeJuridique")}</TableHead>
                  <TableHead>{t("dateCreation")}</TableHead>
                  <TableHead>{t("status")}</TableHead>
                  <TableHead className="text-right">{t("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCompteTitres.length > 0 ? (
                  filteredCompteTitres.map((compte) => (
                    <TableRow key={compte.id}>
                      <TableCell className="font-medium">{compte.id}</TableCell>
                      <TableCell>
                        <div>
                          <div>{compte.nomRaison}</div>
                          <div className="text-sm text-muted-foreground">
                            {compte.prenomAbrev}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{compte.compteEspece}</TableCell>
                      <TableCell>{compte.formeJuridique}</TableCell>
                      <TableCell>
                        {new Date(compte.dateCreation).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {compte.status === "active" ? (
                          <Badge
                            variant="outline"
                            className="bg-green-50 text-green-700 hover:bg-green-50 border-green-200"
                          >
                            {t("actif")}
                          </Badge>
                        ) : (
                          <Badge
                            variant="outline"
                            className="bg-gray-50 text-gray-700 hover:bg-gray-50 border-gray-200"
                          >
                            {t("inactif")}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleViewDetails(compte)}
                                  className="h-8 w-8"
                                >
                                  <Eye className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{t("voirDetails")}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleEditCompte(compte)}
                                  className="h-8 w-8"
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{t("edit")}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>

                          <TooltipProvider>
                            <Tooltip>
                              <TooltipTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleDeleteClick(compte)}
                                  className="h-8 w-8 text-red-500 hover:text-red-600"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TooltipTrigger>
                              <TooltipContent>
                                <p>{t("delete")}</p>
                              </TooltipContent>
                            </Tooltip>
                          </TooltipProvider>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      {searchQuery ? (
                        <>
                          {t("noResults")}
                          <br />
                          <span className="text-sm text-muted-foreground">
                            {t("tryDifferentSearch")}
                          </span>
                        </>
                      ) : (
                        t("noAccounts")
                      )}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      {/* Confirm delete dialog */}
      <Dialog
        open={confirmDeleteDialogOpen}
        onOpenChange={setConfirmDeleteDialogOpen}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>{t("confirmSuppression")}</DialogTitle>
            <DialogDescription>
              {t("confirmSuppressionMessage")}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex space-x-2 py-3">
            <Button
              variant="outline"
              onClick={() => setConfirmDeleteDialogOpen(false)}
            >
              {t("annuler")}
            </Button>
            <Button
              variant="destructive"
              onClick={handleDeleteConfirm}
              className="gap-1"
            >
              <Trash2 className="h-4 w-4" /> {t("delete")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
