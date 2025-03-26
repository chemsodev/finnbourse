"use client";

import { useState } from "react";
import { Search, Plus, Pencil, Trash2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
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
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { accountHolderData, type AccountHolderData } from "@/lib/exportables";

export default function TeneurComptesTitresPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [selectedHolder, setSelectedHolder] =
    useState<AccountHolderData | null>(null);

  const handleAddClick = () => {
    setDialogMode("add");
    setSelectedHolder(null);
    setIsDialogOpen(true);
  };

  const handleEditClick = (holder: AccountHolderData) => {
    setDialogMode("edit");
    setSelectedHolder(holder);
    setIsDialogOpen(true);
  };

  const handleInfoClick = (holder: AccountHolderData) => {
    router.push(`/tcc/${holder.id}`);
  };

  const handleDeleteClick = (holder: AccountHolderData) => {
    setSelectedHolder(holder);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    // In a real app, you would delete the item from your database
    console.log(`Deleting account holder with ID: ${selectedHolder?.id}`);
    setIsDeleteDialogOpen(false);
    // Then refresh your data
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would save the form data to your database
    console.log(
      `${dialogMode === "add" ? "Adding" : "Updating"} account holder data`
    );
    setIsDialogOpen(false);
    // Then refresh your data
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <header className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            Teneur de Compte-Titres
          </h1>
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Rechercher"
                className="pl-10 w-64 bg-white"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <Button
              className="flex items-center gap-2"
              onClick={handleAddClick}
            >
              <Plus className="h-4 w-4" />
              Ajouter
            </Button>
          </div>
        </header>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <Table>
            <TableHeader className="bg-primary">
              <TableRow>
                <TableHead className="text-primary-foreground font-medium">
                  Code
                </TableHead>
                <TableHead className="text-primary-foreground font-medium">
                  Libellé
                </TableHead>
                <TableHead className="text-primary-foreground font-medium">
                  Ville
                </TableHead>
                <TableHead className="text-primary-foreground font-medium">
                  Pays
                </TableHead>
                <TableHead className="text-primary-foreground font-medium">
                  Type
                </TableHead>
                <TableHead className="text-primary-foreground font-medium">
                  Statut
                </TableHead>
                <TableHead className="text-primary-foreground font-medium">
                  Téléphone
                </TableHead>
                <TableHead className="text-primary-foreground font-medium w-[120px]">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {accountHolderData.map((holder, index) => (
                <TableRow
                  key={holder.id}
                  className={index % 2 === 1 ? "bg-gray-100" : ""}
                >
                  <TableCell>{holder.code}</TableCell>
                  <TableCell>{holder.libelle}</TableCell>
                  <TableCell>{holder.ville}</TableCell>
                  <TableCell>{holder.pays}</TableCell>
                  <TableCell>{holder.typeCompte || "-"}</TableCell>
                  <TableCell>{holder.statut}</TableCell>
                  <TableCell>{holder.telephone}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-600"
                        onClick={() => handleInfoClick(holder)}
                      >
                        <Info className="h-4 w-4" />
                        <span className="sr-only">View details</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-amber-600"
                        onClick={() => handleEditClick(holder)}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">Edit</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600"
                        onClick={() => handleDeleteClick(holder)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Add/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {dialogMode === "add"
                  ? "Ajouter un nouveau teneur de compte-titres"
                  : "Modifier le teneur de compte-titres"}
              </DialogTitle>
            </DialogHeader>
            <form className="space-y-6 py-4" onSubmit={handleSave}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Identification */}
                <div className="space-y-2">
                  <label
                    htmlFor="code"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Code
                  </label>
                  <Input
                    id="code"
                    className="w-full"
                    defaultValue={selectedHolder?.code || ""}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label
                    htmlFor="libelle"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Libellé
                  </label>
                  <Input
                    id="libelle"
                    className="w-full"
                    defaultValue={selectedHolder?.libelle || ""}
                  />
                </div>

                {/* Type de compte et statut */}
                <div className="space-y-2">
                  <label
                    htmlFor="typeCompte"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Type
                  </label>
                  <Select defaultValue={selectedHolder?.typeCompte || ""}>
                    <SelectTrigger id="typeCompte" className="w-full">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dépositaire">Dépositaire</SelectItem>
                      <SelectItem value="Conservateur">Conservateur</SelectItem>
                      <SelectItem value="Banque Locale">
                        Banque Locale
                      </SelectItem>
                      <SelectItem value="Banque Internationale">
                        Banque Internationale
                      </SelectItem>
                      <SelectItem value="Autre">Autre</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="statut"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Statut
                  </label>
                  <Select defaultValue={selectedHolder?.statut || "Actif"}>
                    <SelectTrigger id="statut" className="w-full">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Actif">Actif</SelectItem>
                      <SelectItem value="Inactif">Inactif</SelectItem>
                      <SelectItem value="Suspendu">Suspendu</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="dateCreation"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Date de Création
                  </label>
                  <Input
                    id="dateCreation"
                    type="date"
                    className="w-full"
                    defaultValue={selectedHolder?.dateCreation || ""}
                  />
                </div>

                {/* Informations bancaires */}
                <div className="space-y-2">
                  <label
                    htmlFor="swift"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Code SWIFT/BIC
                  </label>
                  <Input
                    id="swift"
                    className="w-full"
                    defaultValue={selectedHolder?.swift || ""}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label
                    htmlFor="iban"
                    className="block text-sm font-medium text-gray-700"
                  >
                    IBAN
                  </label>
                  <Input
                    id="iban"
                    className="w-full"
                    defaultValue={selectedHolder?.iban || ""}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="numeroCompte"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Numéro de Compte
                  </label>
                  <Input
                    id="numeroCompte"
                    className="w-full"
                    defaultValue={selectedHolder?.numeroCompte || ""}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="devise"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Devise
                  </label>
                  <Select defaultValue={selectedHolder?.devise || "EUR"}>
                    <SelectTrigger id="devise" className="w-full">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="EUR">EUR</SelectItem>
                      <SelectItem value="USD">USD</SelectItem>
                      <SelectItem value="DZD">DZD</SelectItem>
                      <SelectItem value="GBP">GBP</SelectItem>
                      <SelectItem value="CHF">CHF</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Adresse */}
                <div className="space-y-2 md:col-span-3">
                  <label
                    htmlFor="adresse"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Adresse
                  </label>
                  <Input
                    id="adresse"
                    className="w-full"
                    defaultValue={selectedHolder?.adresse || ""}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="codePostal"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Code Postal
                  </label>
                  <Input
                    id="codePostal"
                    className="w-full"
                    defaultValue={selectedHolder?.codePostal || ""}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="ville"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Ville
                  </label>
                  <Input
                    id="ville"
                    className="w-full"
                    defaultValue={selectedHolder?.ville || ""}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="pays"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Pays
                  </label>
                  <Input
                    id="pays"
                    className="w-full"
                    defaultValue={selectedHolder?.pays || ""}
                  />
                </div>

                {/* Contact principal */}
                <div className="space-y-2">
                  <label
                    htmlFor="contactNom"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Nom du Contact
                  </label>
                  <Input
                    id="contactNom"
                    className="w-full"
                    defaultValue={selectedHolder?.contactNom || ""}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="contactPrenom"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Prénom du Contact
                  </label>
                  <Input
                    id="contactPrenom"
                    className="w-full"
                    defaultValue={selectedHolder?.contactPrenom || ""}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="contactTelephone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Téléphone du Contact
                  </label>
                  <Input
                    id="contactTelephone"
                    className="w-full"
                    defaultValue={selectedHolder?.contactTelephone || ""}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="contactEmail"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email du Contact
                  </label>
                  <Input
                    id="contactEmail"
                    type="email"
                    className="w-full"
                    defaultValue={selectedHolder?.contactEmail || ""}
                  />
                </div>

                {/* Informations générales */}
                <div className="space-y-2">
                  <label
                    htmlFor="telephone"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Téléphone
                  </label>
                  <Input
                    id="telephone"
                    className="w-full"
                    defaultValue={selectedHolder?.telephone || ""}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Email
                  </label>
                  <Input
                    id="email"
                    type="email"
                    className="w-full"
                    defaultValue={selectedHolder?.email || ""}
                  />
                </div>

                {/* Informations réglementaires */}
                <div className="space-y-2">
                  <label
                    htmlFor="numeroAgrement"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Numéro d'Agrément
                  </label>
                  <Input
                    id="numeroAgrement"
                    className="w-full"
                    defaultValue={selectedHolder?.numeroAgrement || ""}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="dateAgrement"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Date d'Agrément
                  </label>
                  <Input
                    id="dateAgrement"
                    type="date"
                    className="w-full"
                    defaultValue={selectedHolder?.dateAgrement || ""}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="autoriteSurveillance"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Autorité de Surveillance
                  </label>
                  <Input
                    id="autoriteSurveillance"
                    className="w-full"
                    defaultValue={selectedHolder?.autoriteSurveillance || ""}
                  />
                </div>

                {/* Correspondant */}
                <div className="space-y-2">
                  <label
                    htmlFor="codeCorrespondant"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Code Correspondant
                  </label>
                  <Input
                    id="codeCorrespondant"
                    className="w-full"
                    defaultValue={selectedHolder?.codeCorrespondant || ""}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label
                    htmlFor="nomCorrespondant"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Nom Correspondant
                  </label>
                  <Input
                    id="nomCorrespondant"
                    className="w-full"
                    defaultValue={selectedHolder?.nomCorrespondant || ""}
                  />
                </div>

                {/* Commissions */}
                <div className="space-y-2">
                  <label
                    htmlFor="commissionFixe"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Commission Fixe
                  </label>
                  <Input
                    id="commissionFixe"
                    className="w-full"
                    defaultValue={selectedHolder?.commissionFixe || ""}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="commissionVariable"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Commission Variable (%)
                  </label>
                  <Input
                    id="commissionVariable"
                    className="w-full"
                    defaultValue={selectedHolder?.commissionVariable || ""}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="tauxTva"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Taux TVA (%)
                  </label>
                  <Input
                    id="tauxTva"
                    className="w-full"
                    defaultValue={selectedHolder?.tauxTva || ""}
                  />
                </div>

                {/* Commentaire */}
                <div className="space-y-2 md:col-span-3">
                  <label
                    htmlFor="commentaire"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Commentaire
                  </label>
                  <Textarea
                    id="commentaire"
                    className="w-full min-h-[100px]"
                    defaultValue={selectedHolder?.commentaire || ""}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  type="button"
                  onClick={() => setIsDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">Save</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>

        {/* Delete Confirmation Dialog */}
        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Êtes-vous sûr?</AlertDialogTitle>
              <AlertDialogDescription>
                Cette action ne peut pas être annulée. Cela supprimera
                définitivement le teneur de compte-titres
                <span className="font-medium"> {selectedHolder?.libelle}</span>.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Annuler</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                Supprimer
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
