"use client";

import type React from "react";

import { useState } from "react";
import { Search, Plus, Pencil, Trash2, Info, Eye } from "lucide-react";
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
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAgency, setSelectedAgency] = useState<AgencyData | null>(null);

  const handleAddClick = () => {
    router.push("/agence/new");
  };

  const handleEditClick = (agency: AgencyData) => {
    router.push(`/agence/${agency.id}`);
  };

  const handleInfoClick = (agency: AgencyData) => {
    router.push(`/agence/${agency.id}/view`);
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

  const filteredAgencies = agencyData.filter((agency) => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      agency.nomBanque.toLowerCase().includes(searchTerm) ||
      agency.agenceCode.toLowerCase().includes(searchTerm) ||
      agency.adresseComplete.toLowerCase().includes(searchTerm) ||
      agency.codeSwiftBic.toLowerCase().includes(searchTerm) ||
      agency.directeurNom.toLowerCase().includes(searchTerm) ||
      agency.directeurEmail.toLowerCase().includes(searchTerm) ||
      agency.directeurTelephone.toLowerCase().includes(searchTerm)
    );
  });

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
                  {t("nomBanque")}
                </TableHead>
                <TableHead className="text-primary-foreground font-medium">
                  {t("agenceCode")}
                </TableHead>
                <TableHead className="text-primary-foreground font-medium">
                  {t("adresseComplete")}
                </TableHead>
                <TableHead className="text-primary-foreground font-medium">
                  {t("codeSwiftBic")}
                </TableHead>
                <TableHead className="text-primary-foreground font-medium">
                  {t("directeurNom")}
                </TableHead>
                <TableHead className="text-primary-foreground font-medium w-[120px]">
                  {t("actions")}
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAgencies.map((agency, index) => (
                <TableRow
                  key={agency.id}
                  className={index % 2 === 1 ? "bg-gray-100" : ""}
                >
                  <TableCell>{agency.nomBanque}</TableCell>
                  <TableCell>{agency.agenceCode}</TableCell>
                  <TableCell>{agency.adresseComplete}</TableCell>
                  <TableCell>{agency.codeSwiftBic}</TableCell>
                  <TableCell>{agency.directeurNom}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-blue-600"
                        onClick={() => handleInfoClick(agency)}
                      >
                        <Eye className="h-4 w-4" />
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
                  {selectedAgency?.nomBanque}
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
