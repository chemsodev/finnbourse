"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Plus,
  Search,
  Edit,
  Trash2,
  RefreshCw,
  Building2,
  Eye,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
import { useTranslations } from "next-intl";
import { useToast } from "@/hooks/use-toast";
import { useIOB } from "@/hooks/useIOB";
import { IOB } from "@/lib/types/actors";
import { Badge } from "@/components/ui/badge";

export default function IOBPage() {
  const router = useRouter();
  const t = useTranslations("IOBPage");
  const { toast } = useToast();

  // State
  const [searchTerm, setSearchTerm] = useState("");
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [iobToDelete, setIOBToDelete] = useState<IOB | null>(null);

  // API hooks
  const { iobs, isLoading, fetchIOBs, deleteIOB } = useIOB();

  // Load IOB data on mount
  useEffect(() => {
    loadIOBData();
  }, []);

  const loadIOBData = async () => {
    try {
      await fetchIOBs();
    } catch (error) {
      console.error("Failed to load IOB data:", error);
      toast({
        title: t("error"),
        description: t("errorLoadingData"),
        variant: "destructive",
      });
    }
  };

  // Filter IOBs based on search term
  const filteredIOBs = iobs.filter(
    (iob) =>
      iob.short_libel?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      iob.long_libel?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      iob.code?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      iob.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      iob.correspondent?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      iob.financialInstitution?.institutionName
        ?.toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  const handleCreateIOB = () => {
    router.push("/iob/form");
  };

  const handleEditIOB = (iob: IOB) => {
    router.push(`/iob/form/${iob.id}`);
  };

  const handleViewIOB = (iob: IOB) => {
    router.push(`/iob/${iob.id}/view`);
  };

  const handleDeleteClick = (iob: IOB) => {
    setIOBToDelete(iob);
    setShowDeleteDialog(true);
  };

  const handleConfirmDelete = async () => {
    if (!iobToDelete) return;

    try {
      await deleteIOB(iobToDelete.id!);
      toast({
        title: t("success"),
        description: t("successDelete"),
      });
      setShowDeleteDialog(false);
      setIOBToDelete(null);
      loadIOBData(); // Refresh the list
    } catch (error) {
      toast({
        title: t("error"),
        description: t("errorDelete"),
        variant: "destructive",
      });
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold text-gray-800">{t("title")}</h1>
          <RefreshCw className="h-6 w-6 animate-spin" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-6 bg-gray-200 rounded"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  // Show empty state if no IOBs exist
  if (!isLoading && iobs.length === 0) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">{t("title")}</h1>
          <Button onClick={loadIOBData} variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>

        {/* Empty state */}
        <div className="flex flex-col items-center justify-center py-16">
          <div className="bg-gray-100 rounded-full p-6 mb-6">
            <Building2 className="h-16 w-16 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {t("noIOBsFound")}
          </h2>
          <p className="text-gray-600 text-center mb-8 max-w-md">
            {t("noIOBsDescription")}
          </p>
          <Button
            onClick={handleCreateIOB}
            size="lg"
            className="flex items-center gap-2"
          >
            <Plus className="h-5 w-5" />
            {t("addNewIOB")}
          </Button>
        </div>
      </div>
    );
  }

  // Show IOBs table
  return (
    <div className="container mx-auto px-4 py-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">{t("title")}</h1>
      </div>

      {/* Search and Actions */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder={t("searchPlaceholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={loadIOBData} variant="outline" size="icon">
            <RefreshCw className="h-4 w-4" />
          </Button>
          <Button onClick={handleCreateIOB} className="flex items-center gap-2">
            <Plus className="h-4 w-4" />
            {t("add")}
          </Button>
        </div>
      </div>

      {/* IOBs Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>IOBs ({filteredIOBs.length})</span>
            {searchTerm && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSearchTerm("")}
                className="h-7 px-2 text-xs"
              >
                {t("clearSearch")}
              </Button>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[120px]">{t("bankCode")}</TableHead>
                  <TableHead>{t("shortLabel")}</TableHead>
                  <TableHead>{t("longLabel")}</TableHead>
                  <TableHead>{t("financialInstitution")}</TableHead>
                  <TableHead>{t("correspondent")}</TableHead>
                  <TableHead>{t("email")}</TableHead>
                  <TableHead>{t("phone")}</TableHead>
                  <TableHead className="text-center w-[120px]">
                    {t("actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredIOBs.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="h-24 text-center text-muted-foreground"
                    >
                      {searchTerm ? t("noSearchResults") : t("noIOBsFound")}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredIOBs.map((iob) => (
                    <TableRow key={iob.id} className="hover:bg-muted/50">
                      <TableCell className="font-medium">{iob.code}</TableCell>
                      <TableCell>{iob.short_libel}</TableCell>
                      <TableCell className="max-w-[200px] truncate">
                        {iob.long_libel}
                      </TableCell>
                      <TableCell>
                        {iob.financialInstitution?.institutionName || "N/A"}
                      </TableCell>
                      <TableCell>{iob.correspondent || "N/A"}</TableCell>
                      <TableCell>{iob.email || "N/A"}</TableCell>
                      <TableCell>{iob.phone || "N/A"}</TableCell>
                      <TableCell className="text-center">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <span className="sr-only">Open menu</span>
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-4 w-4"
                              >
                                <circle cx="12" cy="12" r="1" />
                                <circle cx="12" cy="5" r="1" />
                                <circle cx="12" cy="19" r="1" />
                              </svg>
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() => handleViewIOB(iob)}
                              className="cursor-pointer"
                            >
                              <Eye className="h-4 w-4 mr-2" />
                              {t("viewDetails")}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleEditIOB(iob)}
                              className="cursor-pointer"
                            >
                              <Edit className="h-4 w-4 mr-2" />
                              {t("edit")}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteClick(iob)}
                              className="cursor-pointer text-red-600 focus:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
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
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("delete")} IOB</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteConfirmation")} "{iobToDelete?.short_libel}"?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              {t("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
