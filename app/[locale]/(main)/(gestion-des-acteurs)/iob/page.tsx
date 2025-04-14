"use client";

import type React from "react";

import { useState } from "react";
import { Search, Plus, Pencil, Trash2, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  DialogDescription,
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
import MyPagination from "@/components/navigation/MyPagination";
import { useTranslations } from "next-intl";

interface BankData {
  id: number;
  codeBank: string;
  shortName: string;
  longName: string;
  correspondent: string;
  address: string;
  phone: string;
  email?: string;
  fax?: string;
  telephone1?: string;
  telephone2?: string;
  telephone3?: string;
  ordreDeTu?: string;
}

export default function BankCodePage() {
  const t = useTranslations("IOBPage");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"add" | "edit">("add");
  const [selectedBank, setSelectedBank] = useState<BankData | null>(null);

  const bankData: BankData[] = [
    {
      id: 1,
      codeBank: "91001",
      shortName: "SGA",
      longName: "Société Générale Algérie",
      correspondent: "1",
      address: "ALGER",
      phone: "11",
      email: "contact@sga.dz",
      fax: "021-111-222",
      telephone1: "021-333-444",
      telephone2: "021-555-666",
      telephone3: "021-777-888",
      ordreDeTu: "1",
    },
    {
      id: 2,
      codeBank: "91001",
      shortName: "Inv Mart",
      longName: "Invest Market",
      correspondent: "1",
      address: "ALGER",
      phone: "11",
    },
    {
      id: 3,
      codeBank: "91001",
      shortName: "Tell",
      longName: "Tell Market",
      correspondent: "1",
      address: "ALGER",
      phone: "11",
    },
    {
      id: 4,
      codeBank: "91001",
      shortName: "CNEP",
      longName: "CAISSE NATIONALE D'EPARGNE ET DE PREVOYANCE",
      correspondent: "1",
      address: "ALGER",
      phone: "11",
    },
    {
      id: 5,
      codeBank: "91001",
      shortName: "BNA",
      longName: "BANQUE NATIONALE D'ALGERIE",
      correspondent: "1",
      address: "ALGER",
      phone: "11",
    },
    {
      id: 6,
      codeBank: "91001",
      shortName: "CPA",
      longName: "Crédit Populair d'Algérie",
      correspondent: "1",
      address: "ALGER",
      phone: "11",
    },
  ];

  const handleAddClick = () => {
    setDialogMode("add");
    setSelectedBank(null);
    setIsDialogOpen(true);
  };

  const handleEditClick = (bank: BankData) => {
    setDialogMode("edit");
    setSelectedBank(bank);
    setIsDialogOpen(true);
  };

  const handleInfoClick = (bank: BankData) => {
    setSelectedBank(bank);
    setIsInfoDialogOpen(true);
  };

  const handleDeleteClick = (bank: BankData) => {
    setSelectedBank(bank);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    // In a real app, you would delete the item from your database
    console.log(`Deleting bank with ID: ${selectedBank?.id}`);
    setIsDeleteDialogOpen(false);
    // Then refresh your data
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would save the form data to your database
    console.log(`${dialogMode === "add" ? "Adding" : "Updating"} bank data`);
    setIsDialogOpen(false);
    // Then refresh your data
  };

  return (
    <div className="rounded-md shadow-inner bg-gray-50">
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
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <Table>
            <TableHeader className="bg-primary">
              <TableRow>
                <TableHead className="text-primary-foreground font-medium">
                  {t("bankCode")}
                </TableHead>
                <TableHead className="text-primary-foreground font-medium">
                  {t("shortName")}
                </TableHead>
                <TableHead className="text-primary-foreground font-medium">
                  {t("longName")}
                </TableHead>
                <TableHead className="text-primary-foreground font-medium">
                  {t("correspondent")}
                </TableHead>
                <TableHead className="text-primary-foreground font-medium">
                  {t("address")}
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
              {bankData?.map((bank, index) => (
                <TableRow
                  key={bank.id}
                  className={index % 2 === 1 ? "bg-gray-100" : ""}
                >
                  <TableCell>{bank.codeBank}</TableCell>
                  <TableCell>{bank.shortName}</TableCell>
                  <TableCell>{bank.longName}</TableCell>
                  <TableCell>{bank.correspondent}</TableCell>
                  <TableCell>{bank.address}</TableCell>
                  <TableCell>{bank.phone}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-600"
                        onClick={() => handleInfoClick(bank)}
                      >
                        <Info className="h-4 w-4" />
                        <span className="sr-only">{t("viewDetails")}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-amber-600"
                        onClick={() => handleEditClick(bank)}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">{t("edit")}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600"
                        onClick={() => handleDeleteClick(bank)}
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
        <div className="mt-4">
          <MyPagination />
        </div>
        {/* Add/Edit Dialog */}
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent className="sm:max-w-[800px]">
            <DialogHeader>
              <DialogTitle>
                {dialogMode === "add" ? t("addNewIOB") : t("editIOB")}
              </DialogTitle>
            </DialogHeader>
            <form className="space-y-6 py-4" onSubmit={handleSave}>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="space-y-2">
                  <label
                    htmlFor="codeIob"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {t("codeIOB")}
                  </label>
                  <Input
                    id="codeIob"
                    className="w-full"
                    defaultValue={selectedBank?.codeBank || ""}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="libelleCourt"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {t("shortLabel")}
                  </label>
                  <Input
                    id="libelleCourt"
                    className="w-full"
                    defaultValue={selectedBank?.shortName || ""}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="libelleLong"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {t("longLabel")}
                  </label>
                  <Input
                    id="libelleLong"
                    className="w-full"
                    defaultValue={selectedBank?.longName || ""}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="correspondant"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {t("correspondent")}
                  </label>
                  <Input
                    id="correspondant"
                    className="w-full"
                    defaultValue={selectedBank?.correspondent || ""}
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
                    defaultValue={selectedBank?.email || ""}
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
                    defaultValue={selectedBank?.fax || ""}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="telephone1"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {t("phone1")}
                  </label>
                  <Input
                    id="telephone1"
                    className="w-full"
                    defaultValue={selectedBank?.telephone1 || ""}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="telephone2"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {t("phone2")}
                  </label>
                  <Input
                    id="telephone2"
                    className="w-full"
                    defaultValue={selectedBank?.telephone2 || ""}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="telephone3"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {t("phone3")}
                  </label>
                  <Input
                    id="telephone3"
                    className="w-full"
                    defaultValue={selectedBank?.telephone3 || ""}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="addresse"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {t("address")}
                  </label>
                  <Input
                    id="addresse"
                    className="w-full"
                    defaultValue={selectedBank?.address || ""}
                  />
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="ordreDeTu"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {t("orderTu")}
                  </label>
                  <Input
                    id="ordreDeTu"
                    className="w-full"
                    defaultValue={selectedBank?.ordreDeTu || ""}
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
        {/* Info Dialog */}
        <Dialog open={isInfoDialogOpen} onOpenChange={setIsInfoDialogOpen}>
          <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
              <DialogTitle>{t("details")}</DialogTitle>
              <DialogDescription>
                {t("completeInfo")} {selectedBank?.shortName}
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4 py-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">
                  {t("bankCode")}
                </p>
                <p className="text-sm">{selectedBank?.codeBank}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">
                  {t("shortLabel")}
                </p>
                <p className="text-sm">{selectedBank?.shortName}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">
                  {t("longLabel")}
                </p>
                <p className="text-sm">{selectedBank?.longName}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">
                  {t("correspondent")}
                </p>
                <p className="text-sm">{selectedBank?.correspondent}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">
                  {t("address")}
                </p>
                <p className="text-sm">{selectedBank?.address}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">
                  {t("phone")}
                </p>
                <p className="text-sm">{selectedBank?.phone}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">
                  {t("email")}
                </p>
                <p className="text-sm">{selectedBank?.email || "-"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">{t("fax")}</p>
                <p className="text-sm">{selectedBank?.fax || "-"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">
                  {t("phone1")}
                </p>
                <p className="text-sm">{selectedBank?.telephone1 || "-"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">
                  {t("phone2")}
                </p>
                <p className="text-sm">{selectedBank?.telephone2 || "-"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">
                  {t("phone3")}
                </p>
                <p className="text-sm">{selectedBank?.telephone3 || "-"}</p>
              </div>
              <div className="space-y-1">
                <p className="text-sm font-medium text-gray-500">
                  {t("orderTu")}
                </p>
                <p className="text-sm">{selectedBank?.ordreDeTu || "-"}</p>
              </div>
            </div>
            <DialogFooter>
              <Button onClick={() => setIsInfoDialogOpen(false)}>
                {t("close")}
              </Button>
            </DialogFooter>
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
                <span className="font-medium"> {selectedBank?.shortName}</span>.
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
