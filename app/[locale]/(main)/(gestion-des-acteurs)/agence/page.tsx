"use client";

import type React from "react";

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
import { agencyData, type AgencyData } from "@/lib/exportables";
import MyPagination from "@/components/navigation/MyPagination";
import { useTranslations } from "next-intl";

export default function AgencePage() {
  const router = useRouter();
  const t = useTranslations("AgencyPage");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [selectedAgency, setSelectedAgency] = useState<AgencyData | null>(null);

  const handleAddClick = () => {
    setDialogMode("add");
    setSelectedAgency(null);
    setIsDialogOpen(true);
  };

  const handleEditClick = (agency: AgencyData) => {
    setDialogMode("edit");
    setSelectedAgency(agency);
    setIsDialogOpen(true);
  };

  const handleInfoClick = (agency: AgencyData) => {
    router.push(`/agence/${agency.id}`);
  };

  const handleDeleteClick = (agency: AgencyData) => {
    setSelectedAgency(agency);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    // In a real app, you would delete the item from your database
    console.log(`Deleting agency with ID: ${selectedAgency?.id}`);
    setIsDeleteDialogOpen(false);
    // Then refresh your data
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would save the form data to your database
    console.log(`${dialogMode === "add" ? "Adding" : "Updating"} agency data`);
    setIsDialogOpen(false);
    // Then refresh your data
  };

  return (
    <div className="shadow-inner bg-gray-50 rounded-md">
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold text-secondary my-4">{t("title")}</h1>
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
                  {t("agency")}
                </TableHead>
                <TableHead className="text-primary-foreground font-medium">
                  {t("libAgency")}
                </TableHead>
                <TableHead className="text-primary-foreground font-medium">
                  {t("codeVille")}
                </TableHead>
                <TableHead className="text-primary-foreground font-medium">
                  {t("orderDe")}
                </TableHead>
                <TableHead className="text-primary-foreground font-medium">
                  {t("parDefault")}
                </TableHead>
                <TableHead className="text-primary-foreground font-medium">
                  {t("compensation")}
                </TableHead>
                <TableHead className="text-primary-foreground font-medium">
                  {t("name")}
                </TableHead>
                <TableHead className="text-primary-foreground font-medium">
                  {t("firstName")}
                </TableHead>
                <TableHead className="text-primary-foreground font-medium w-[120px]">
                  {t("actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {agencyData?.map((agency, index) => (
                <TableRow
                  key={agency.id}
                  className={index % 2 === 1 ? "bg-gray-100" : ""}
                >
                  <TableCell>{agency.agenceCode}</TableCell>
                  <TableCell>{agency.libAgence}</TableCell>
                  <TableCell>{agency.codeVille}</TableCell>
                  <TableCell>{agency.ordreDe}</TableCell>
                  <TableCell>{agency.parDefault}</TableCell>
                  <TableCell>{agency.compensation}</TableCell>
                  <TableCell>{agency.nom}</TableCell>
                  <TableCell>{agency.prenom}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-600"
                        onClick={() => handleInfoClick(agency)}
                      >
                        <Info className="h-4 w-4" />
                        <span className="sr-only">{t("viewDetails")}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-amber-600"
                        onClick={() => handleEditClick(agency)}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">{t("edit")}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600"
                        onClick={() => handleDeleteClick(agency)}
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
                {dialogMode === "add" ? t("addNewAgency") : t("editAgency")}
              </DialogTitle>
            </DialogHeader>
            <form className="space-y-6 py-4" onSubmit={handleSave}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label
                    htmlFor="codeBanque"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {t("codeBanque")}
                  </label>
                  <Input
                    id="codeBanque"
                    className="w-full"
                    defaultValue={selectedAgency?.codeBanque || ""}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="codeAgence"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {t("codeAgence")}
                  </label>
                  <Input
                    id="codeAgence"
                    className="w-full"
                    defaultValue={selectedAgency?.agenceCode || ""}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="libelleAgence"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {t("libelleAgence")}
                  </label>
                  <Input
                    id="libelleAgence"
                    className="w-full"
                    defaultValue={selectedAgency?.libAgence || ""}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="codeVille"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {t("codeVille")}
                  </label>
                  <Input
                    id="codeVille"
                    className="w-full"
                    defaultValue={selectedAgency?.codeVille || ""}
                  />
                </div>

                <div className="space-y-2">
                  <label
                    htmlFor="regionAgence"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {t("regionAgence")}
                  </label>
                  <Input
                    id="regionAgence"
                    className="w-full"
                    defaultValue={selectedAgency?.regionAgence || ""}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="codeBC"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {t("codeBC")}
                  </label>
                  <Input
                    id="codeBC"
                    className="w-full"
                    defaultValue={selectedAgency?.codeBC || ""}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="nomCorrespondant"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {t("nomCorrespondant")}
                  </label>
                  <Input
                    id="nomCorrespondant"
                    className="w-full"
                    defaultValue={selectedAgency?.nomCorrespondant || ""}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="prenomCorrespondant"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {t("prenomCorrespondant")}
                  </label>
                  <Input
                    id="prenomCorrespondant"
                    className="w-full"
                    defaultValue={selectedAgency?.prenomCorrespondant || ""}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="fonction"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {t("fonction")}
                  </label>
                  <Input
                    id="fonction"
                    className="w-full"
                    defaultValue={selectedAgency?.fonction || ""}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="telephone1"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {t("telephone1")}
                  </label>
                  <Input
                    id="telephone1"
                    className="w-full"
                    defaultValue={selectedAgency?.telephone1 || ""}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="telephone2"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {t("telephone2")}
                  </label>
                  <Input
                    id="telephone2"
                    className="w-full"
                    defaultValue={selectedAgency?.telephone2 || ""}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="fax"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {t("fax")}
                  </label>
                  <Input
                    id="fax"
                    className="w-full"
                    defaultValue={selectedAgency?.fax || ""}
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
                    defaultValue={selectedAgency?.email || ""}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="telex"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {t("telex")}
                  </label>
                  <Input
                    id="telex"
                    className="w-full"
                    defaultValue={selectedAgency?.telex || ""}
                  />
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label
                    htmlFor="addresse"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {t("addresse")}
                  </label>
                  <Input
                    id="addresse"
                    className="w-full"
                    defaultValue={selectedAgency?.addresse || ""}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="codePostal"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {t("codePostal")}
                  </label>
                  <Input
                    id="codePostal"
                    className="w-full"
                    defaultValue={selectedAgency?.codePostal || ""}
                  />
                </div>
                <div className="space-y-2 md:col-span-3">
                  <label
                    htmlFor="commentaire"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {t("commentaire")}
                  </label>
                  <Input
                    id="commentaire"
                    className="w-full"
                    defaultValue={selectedAgency?.commentaire || ""}
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
                <span className="font-medium">
                  {" "}
                  {selectedAgency?.libAgence}
                </span>
                .
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
