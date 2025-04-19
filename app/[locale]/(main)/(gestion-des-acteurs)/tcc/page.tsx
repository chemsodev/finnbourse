"use client";

import { useState, useMemo } from "react";
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
import MyPagination from "@/components/navigation/MyPagination";
import { useTranslations } from "next-intl";

export default function TeneurComptesTitresPage() {
  const router = useRouter();
  const t = useTranslations("TCCPage");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [selectedHolder, setSelectedHolder] =
    useState<AccountHolderData | null>(null);

  // Filter to only show Algerian account holders
  const filteredHolders = useMemo(() => {
    return accountHolderData.filter(
      (holder) =>
        holder.pays === "Algérie" &&
        (holder.libelle.toLowerCase().includes(searchQuery.toLowerCase()) ||
          holder.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
          holder.ville.toLowerCase().includes(searchQuery.toLowerCase()))
    );
  }, [searchQuery]);

  const handleAddClick = () => {
    router.push("/tcc/form");
  };

  const handleEditClick = (holder: AccountHolderData) => {
    router.push(`/tcc/form/${holder.id}`);
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
    <div className="shadow-inner rounded-md bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold my-4 text-secondary">{t("title")}</h1>
        <header className="flex items-center justify-end mb-8">
          <div className="flex items-center gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder={t("search")}
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
              {t("add")}
            </Button>
          </div>
        </header>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <Table>
            <TableHeader className="bg-primary">
              <TableRow>
                <TableHead className="text-primary-foreground font-medium">
                  {t("code")}
                </TableHead>
                <TableHead className="text-primary-foreground font-medium">
                  {t("label")}
                </TableHead>
                <TableHead className="text-primary-foreground font-medium">
                  {t("city")}
                </TableHead>
                <TableHead className="text-primary-foreground font-medium">
                  {t("type")}
                </TableHead>
                <TableHead className="text-primary-foreground font-medium">
                  {t("status")}
                </TableHead>
                <TableHead className="text-primary-foreground font-medium">
                  {t("phone")}
                </TableHead>
                <TableHead className="text-primary-foreground font-medium w-[120px]">
                  {t("actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHolders?.map((holder, index) => (
                <TableRow
                  key={holder.id}
                  className={index % 2 === 1 ? "bg-gray-100" : ""}
                >
                  <TableCell>{holder.code}</TableCell>
                  <TableCell>{holder.libelle}</TableCell>
                  <TableCell>{holder.ville}</TableCell>
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
                        <span className="sr-only">{t("viewDetails")}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-amber-600"
                        onClick={() => handleEditClick(holder)}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">{t("edit")}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600"
                        onClick={() => handleDeleteClick(holder)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">{t("delete")}</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
        <MyPagination />
        {/* Add/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {dialogMode === "add"
                  ? t("addNewAccountHolder")
                  : t("editAccountHolder")}
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
                    {t("code")}
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
                    {t("label")}
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
                    {t("type")}
                  </label>
                  <Select defaultValue={selectedHolder?.typeCompte || ""}>
                    <SelectTrigger id="typeCompte" className="w-full">
                      <SelectValue placeholder={t("select")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Dépositaire">
                        {t("depositary")}
                      </SelectItem>
                      <SelectItem value="Conservateur">
                        {t("custodian")}
                      </SelectItem>
                      <SelectItem value="Banque Locale">
                        {t("localBank")}
                      </SelectItem>
                      <SelectItem value="Banque Internationale">
                        {t("internationalBank")}
                      </SelectItem>
                      <SelectItem value="Autre">{t("other")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="statut"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {t("status")}
                  </label>
                  <Select defaultValue={selectedHolder?.statut || "Actif"}>
                    <SelectTrigger id="statut" className="w-full">
                      <SelectValue placeholder={t("select")} />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Actif">{t("active")}</SelectItem>
                      <SelectItem value="Inactif">{t("inactive")}</SelectItem>
                      <SelectItem value="Suspendu">{t("suspended")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="dateCreation"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {t("creationDate")}
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
                    {t("swiftCode")}
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
                    {t("iban")}
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
                    {t("accountNumber")}
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
                    {t("currency")}
                  </label>
                  <Select defaultValue={selectedHolder?.devise || "EUR"}>
                    <SelectTrigger id="devise" className="w-full">
                      <SelectValue placeholder={t("select")} />
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
                    {t("address")}
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
                    {t("postalCode")}
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
                    {t("city")}
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
                    {t("country")}
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
                    {t("contactLastName")}
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
                    {t("contactFirstName")}
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
                    {t("contactPhone")}
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
                    {t("contactEmail")}
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
                    {t("phone")}
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
                    {t("email")}
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
                    {t("approvalNumber")}
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
                    {t("approvalDate")}
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
                    {t("supervisionAuthority")}
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
                    {t("correspondentCode")}
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
                    {t("correspondentName")}
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
                    {t("fixedCommission")}
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
                    {t("variableCommission")}
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
                    {t("vatRate")}
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
                    {t("comment")}
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
                  {t("cancel")}
                </Button>
                <Button type="submit">{t("save")}</Button>
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
              <AlertDialogTitle>{t("areYouSure")}</AlertDialogTitle>
              <AlertDialogDescription>
                {t("deleteConfirmation")}
                <span className="font-medium"> {selectedHolder?.libelle}</span>.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
              <AlertDialogAction
                onClick={handleDelete}
                className="bg-red-600 hover:bg-red-700"
              >
                {t("delete")}
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
}
