"use client";

import type React from "react";

import { useState } from "react";
import { Search, Plus, Pencil, Trash2, Info, Eye, EyeOff } from "lucide-react";
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

// Add unified user interface
interface IOBUser {
  id: number;
  fullname: string;
  position: string;
  matricule: string;
  role: string;
  type: string;
  status: "active" | "inactive";
  organisation: string;
  password: string;
  email?: string;
  phone?: string;
}

export default function BankCodePage() {
  const t = useTranslations("IOBPage");
  const [searchQuery, setSearchQuery] = useState("");
  const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedBank, setSelectedBank] = useState<BankData | null>(null);
  const router = useRouter();

  // Add state for password visibility
  const [passwordVisibility, setPasswordVisibility] = useState<{
    [key: number]: boolean;
  }>({});

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

  // Add sample user data
  const iobUsers: IOBUser[] = [
    {
      id: 1,
      fullname: "John Doe",
      position: "DG",
      matricule: "IOB001",
      role: "Valideur 2",
      type: "IOBPage",
      status: "active",
      organisation: "SGA",
      password: "Password123",
      email: "john.doe@sga.dz",
      phone: "+213 555-123-456",
    },
    {
      id: 2,
      fullname: "Maria García",
      position: "Analyste",
      matricule: "IOB002",
      role: "Valideur 1",
      type: "IOBPage",
      status: "active",
      organisation: "BNA",
      password: "SecurePass456",
      email: "maria.garcia@bna.dz",
      phone: "+213 555-789-012",
    },
    {
      id: 3,
      fullname: "Ahmed Hassan",
      position: "Directeur",
      matricule: "IOB003",
      role: "Administrateur",
      type: "IOBPage",
      status: "inactive",
      organisation: "CPA",
      password: "StrongPwd789",
      email: "ahmed.hassan@cpa.dz",
      phone: "+213 555-345-678",
    },
  ];

  const handleAddClick = () => {
    router.push("/iob/form");
  };

  const handleEditClick = (bank: BankData) => {
    router.push(`/iob/form/${bank.id}`);
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

  // Add toggle password visibility function
  const togglePasswordVisibility = (userId: number) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
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

        {/* Users Table Section */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-secondary mb-6">
            {t("users")}
          </h2>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
            <Table>
              <TableHeader className="bg-primary">
                <TableRow>
                  <TableHead className="text-primary-foreground font-medium">
                    {t("fullName")}
                  </TableHead>
                  <TableHead className="text-primary-foreground font-medium">
                    {t("position")}
                  </TableHead>
                  <TableHead className="text-primary-foreground font-medium">
                    {t("matricule")}
                  </TableHead>
                  <TableHead className="text-primary-foreground font-medium">
                    {t("role")}
                  </TableHead>
                  <TableHead className="text-primary-foreground font-medium">
                    {t("type")}
                  </TableHead>
                  <TableHead className="text-primary-foreground font-medium">
                    {t("status")}
                  </TableHead>
                  <TableHead className="text-primary-foreground font-medium">
                    {t("organisation")}
                  </TableHead>
                  <TableHead className="text-primary-foreground font-medium">
                    {t("email")}
                  </TableHead>
                  <TableHead className="text-primary-foreground font-medium">
                    {t("phone")}
                  </TableHead>
                  <TableHead className="text-primary-foreground font-medium">
                    {t("password")}
                  </TableHead>
                  <TableHead className="text-primary-foreground font-medium w-[120px]">
                    {t("actions")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {iobUsers.map((user, index) => (
                  <TableRow
                    key={user.id}
                    className={index % 2 === 1 ? "bg-gray-100" : ""}
                  >
                    <TableCell>{user.fullname}</TableCell>
                    <TableCell>{user.position}</TableCell>
                    <TableCell>{user.matricule}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>{user.type}</TableCell>
                    <TableCell>
                      {user.status === "active" ? (
                        <div className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 rounded-full w-fit">
                          <span className="text-xs font-medium">
                            {t("active")}
                          </span>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2 bg-red-100 text-red-800 px-3 py-1 rounded-full w-fit">
                          <span className="text-xs font-medium">
                            {t("inactive")}
                          </span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell>{user.organisation}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone}</TableCell>
                    <TableCell className="relative">
                      <div className="flex items-center">
                        <span className="mr-2">
                          {passwordVisibility[user.id]
                            ? user.password
                            : "••••••••••"}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8"
                          onClick={() => togglePasswordVisibility(user.id)}
                        >
                          {passwordVisibility[user.id] ? (
                            <EyeOff className="h-4 w-4" />
                          ) : (
                            <Eye className="h-4 w-4" />
                          )}
                          <span className="sr-only">
                            {passwordVisibility[user.id]
                              ? t("hidePassword")
                              : t("showPassword")}
                          </span>
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-amber-600"
                          onClick={() =>
                            router.push(`/iob/form/user/${user.id}`)
                          }
                        >
                          <Pencil className="h-4 w-4" />
                          <span className="sr-only">{t("edit")}</span>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-red-600"
                          onClick={() =>
                            console.log(`Would delete user ${user.id}`)
                          }
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
                <span className="font-medium"> {selectedBank?.longName}</span>.
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
