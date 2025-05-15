"use client";

import type React from "react";

import { useState } from "react";
import { Search, Plus, Pencil, Trash2, Eye } from "lucide-react";
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
import { useRouter } from "next/navigation";

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
  const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState<BankData | null>(null);
  const router = useRouter();

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
    router.push("/iob/form");
  };

  const handleEditClick = (bank: BankData) => {
    router.push(`/iob/form/${bank.id}`);
  };

  const handleInfoClick = (bank: BankData) => {
    router.push(`/iob/${bank.id}/view`);
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

  const filteredBanks = bankData.filter((bank) => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      bank.codeBank.toLowerCase().includes(searchTerm) ||
      bank.shortName.toLowerCase().includes(searchTerm) ||
      bank.longName.toLowerCase().includes(searchTerm)
    );
  });

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
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
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
              {filteredBanks.map((bank, index) => (
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
                        <Eye className="h-4 w-4" />
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

        <MyPagination />

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
