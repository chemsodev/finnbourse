"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Pencil, Plus, Trash2, Search, Eye, EyeOff } from "lucide-react";
import { accountHolderData } from "@/lib/exportables";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { Input } from "@/components/ui/input";
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
import { Switch } from "@/components/ui/switch";
import MyPagination from "@/components/navigation/MyPagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Sample TCC user data
interface TCCUser {
  id: number;
  fullname: string;
  email: string;
  position: string;
  role: string;
  type: string;
  status: "active" | "inactive";
  phone: string;
  password: string;
  organisation: string;
  matricule: string;
}

const tccUsers: TCCUser[] = [
  {
    id: 1,
    fullname: "John Doe",
    email: "john.doe@example.com",
    position: "Manager",
    role: "initiator",
    type: "admin",
    status: "active",
    phone: "123-456-7890",
    password: "Password123",
    organisation: "SLIK PIS",
    matricule: "M001",
  },
  {
    id: 2,
    fullname: "Jane Smith",
    email: "jane.smith@example.com",
    position: "Analyst",
    role: "validateur 1",
    type: "member",
    status: "active",
    phone: "123-456-7891",
    password: "Secure456!",
    organisation: "SLIK PIS",
    matricule: "M002",
  },
  {
    id: 3,
    fullname: "Ahmed Hassan",
    email: "ahmed.hassan@example.com",
    position: "Supervisor",
    role: "initiator",
    type: "admin",
    status: "inactive",
    phone: "123-456-7892",
    password: "StrongPwd789@",
    organisation: "SLIK PIS",
    matricule: "M003",
  },
];

export default function TeneurComptesTitresPage() {
  const router = useRouter();
  const t = useTranslations("TCCDetailsPage");
  const tPage = useTranslations("TCCPage");

  // Since we'll have only one TCC, we'll use the first one from the data
  const holder =
    accountHolderData.find((h) => h.pays === "Algérie") || accountHolderData[0];

  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<TCCUser | null>(null);
  const [passwordVisibility, setPasswordVisibility] = useState<{
    [key: number]: boolean;
  }>({});
  const [users, setUsers] = useState<TCCUser[]>(tccUsers);
  const [userToToggleStatus, setUserToToggleStatus] = useState<number | null>(
    null
  );
  const [statusConfirmDialog, setStatusConfirmDialog] = useState(false);

  // For user details dialog
  const [viewUserDialog, setViewUserDialog] = useState(false);

  const togglePasswordVisibility = (userId: number) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  const handleToggleStatus = (userId: number) => {
    setUserToToggleStatus(userId);
    setStatusConfirmDialog(true);
  };

  const confirmToggleStatus = () => {
    if (!userToToggleStatus) return;

    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userToToggleStatus
          ? {
              ...user,
              status: user.status === "active" ? "inactive" : "active",
            }
          : user
      )
    );

    // Reset dialog state
    setStatusConfirmDialog(false);
    setUserToToggleStatus(null);
  };

  const cancelToggleStatus = () => {
    setStatusConfirmDialog(false);
    setUserToToggleStatus(null);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.position.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddUser = () => {
    // Route to user creation form
    router.push("/tcc/form/users");
  };

  const handleEditUser = (user: TCCUser) => {
    // Route to user edit form
    router.push(`/tcc/form/users/${user.id}`);
  };

  const handleDeleteClick = (user: TCCUser) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    // In a real app, you would delete the user from your database
    console.log(`Deleting user with ID: ${selectedUser?.id}`);
    setIsDeleteDialogOpen(false);
    // Then refresh your data
  };

  const handleViewUser = (user: TCCUser) => {
    setSelectedUser(user);
    setViewUserDialog(true);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">{holder.libelle}</h1>
          <Button
            className="flex items-center gap-2"
            onClick={() => router.push(`/tcc/form/${holder.id}`)}
          >
            <Pencil className="h-4 w-4" />
            {t("edit")}
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                {t("generalInformation")}
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {t("code")}
                    </p>
                    <p className="text-base">{holder.code}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {t("type")}
                    </p>
                    <p className="text-base">{holder.typeCompte || "-"}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {t("label")}
                  </p>
                  <p className="text-base">{holder.libelle}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {t("status")}
                    </p>
                    <p className="text-base">{holder.statut}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {t("creationDate")}
                    </p>
                    <p className="text-base">{holder.dateCreation || "-"}</p>
                  </div>
                </div>
              </div>

              <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">
                {t("contactInformation")}
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {t("address")}
                  </p>
                  <p className="text-base">{holder.adresse}</p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {t("postalCode")}
                    </p>
                    <p className="text-base">{holder.codePostal}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {t("city")}
                    </p>
                    <p className="text-base">{holder.ville}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {t("country")}
                    </p>
                    <p className="text-base">{holder.pays}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {t("phone")}
                    </p>
                    <p className="text-base">{holder.telephone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {t("email")}
                    </p>
                    <p className="text-base">{holder.email}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                {t("bankInformation")}
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {t("swiftCode")}
                    </p>
                    <p className="text-base">{holder.swift || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {t("currency")}
                    </p>
                    <p className="text-base">{holder.devise || "-"}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {t("iban")}
                  </p>
                  <p className="text-base">{holder.iban || "-"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {t("accountNumber")}
                  </p>
                  <p className="text-base">{holder.numeroCompte || "-"}</p>
                </div>
              </div>

              <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">
                {t("regulatoryInformation")}
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {t("approvalNumber")}
                    </p>
                    <p className="text-base">{holder.numeroAgrement || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {t("approvalDate")}
                    </p>
                    <p className="text-base">{holder.dateAgrement || "-"}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {t("surveillanceAuthority")}
                  </p>
                  <p className="text-base">
                    {holder.autoriteSurveillance || "-"}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Users Table Section */}
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            {t("affectedUsers")}
          </h2>

          <header className="flex items-center justify-end mb-8">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder={tPage("search")}
                  className="pl-10 w-64 bg-white"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              <Button
                className="flex items-center gap-2"
                onClick={handleAddUser}
              >
                <Plus className="h-4 w-4" />
                {t("addUser")}
              </Button>
            </div>
          </header>

          <div className="bg-white rounded-lg shadow-sm overflow-x-auto mb-8">
            <Table>
              <TableHeader className="bg-primary">
                <TableRow>
                  <TableHead className="text-primary-foreground font-medium whitespace-nowrap">
                    {tPage("name")}
                  </TableHead>
                  <TableHead className="text-primary-foreground font-medium whitespace-nowrap max-w-[100px]">
                    {tPage("pos")}
                  </TableHead>
                  <TableHead className="text-primary-foreground font-medium whitespace-nowrap max-w-[100px]">
                    {tPage("mat")}
                  </TableHead>
                  <TableHead className="text-primary-foreground font-medium whitespace-nowrap max-w-[100px]">
                    {tPage("role")}
                  </TableHead>
                  <TableHead className="text-primary-foreground font-medium whitespace-nowrap max-w-[100px]">
                    {tPage("type")}
                  </TableHead>
                  <TableHead className="text-primary-foreground font-medium whitespace-nowrap max-w-[120px] truncate">
                    {tPage("email")}
                  </TableHead>
                  <TableHead className="text-primary-foreground font-medium whitespace-nowrap max-w-[120px] truncate">
                    {tPage("org")}
                  </TableHead>
                  <TableHead className="text-primary-foreground font-medium whitespace-nowrap max-w-[100px]">
                    {tPage("phone")}
                  </TableHead>
                  <TableHead className="text-primary-foreground font-medium whitespace-nowrap w-[120px]">
                    {tPage("pwd")}
                  </TableHead>
                  <TableHead className="text-primary-foreground font-medium whitespace-nowrap">
                    {tPage("status")}
                  </TableHead>
                  <TableHead className="text-primary-foreground font-medium whitespace-nowrap w-[80px]">
                    {tPage("acts")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user, index) => (
                  <TableRow
                    key={user.id}
                    className={index % 2 === 1 ? "bg-gray-100" : ""}
                  >
                    <TableCell className="whitespace-nowrap">
                      {user.fullname}
                    </TableCell>
                    <TableCell className="whitespace-nowrap max-w-[100px] truncate">
                      {user.position}
                    </TableCell>
                    <TableCell className="whitespace-nowrap max-w-[100px] truncate">
                      {user.matricule}
                    </TableCell>
                    <TableCell className="whitespace-nowrap max-w-[100px] truncate">
                      {user.role}
                    </TableCell>
                    <TableCell className="whitespace-nowrap max-w-[100px] truncate">
                      {user.type}
                    </TableCell>
                    <TableCell className="whitespace-nowrap max-w-[120px] truncate">
                      {user.email}
                    </TableCell>
                    <TableCell className="whitespace-nowrap max-w-[120px] truncate">
                      {user.organisation}
                    </TableCell>
                    <TableCell className="whitespace-nowrap max-w-[100px] truncate">
                      {user.phone}
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div className="flex items-center">
                        <span className="truncate max-w-[80px]">
                          {passwordVisibility[user.id]
                            ? user.password
                            : "••••••••••"}
                        </span>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 ml-1 p-0"
                          onClick={() => togglePasswordVisibility(user.id)}
                        >
                          {passwordVisibility[user.id] ? (
                            <EyeOff className="h-3.5 w-3.5" />
                          ) : (
                            <Eye className="h-3.5 w-3.5" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                    <TableCell className="whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={user.status === "active"}
                          onCheckedChange={() => handleToggleStatus(user.id)}
                          className={
                            user.status === "active"
                              ? "bg-green-500 data-[state=checked]:bg-green-500"
                              : "bg-red-500 data-[state=unchecked]:bg-red-500"
                          }
                        />
                        <span
                          className={
                            user.status === "active"
                              ? "text-green-600 text-sm font-medium"
                              : "text-red-600 text-sm"
                          }
                        >
                          {user.status === "active"
                            ? t("active")
                            : t("inactive")}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="w-[90px]">
                      <div className="flex justify-center items-center space-x-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-amber-600"
                          onClick={() => handleEditUser(user)}
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-red-600"
                          onClick={() => handleDeleteClick(user)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-7 w-7 p-0 text-blue-600"
                          onClick={() => handleViewUser(user)}
                        >
                          <Eye className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
                {filteredUsers.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-4">
                      {t("noUsers")}
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="mt-6">
            <MyPagination />
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("confirmDelete")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteUserConfirmation", { user: selectedUser?.fullname })}
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

      {/* Status Change Confirmation Dialog */}
      <AlertDialog
        open={statusConfirmDialog}
        onOpenChange={setStatusConfirmDialog}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Modifier le statut</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir changer le statut de cet utilisateur ?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={cancelToggleStatus}>
              Annuler
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmToggleStatus}>
              Confirmer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* User Details Dialog */}
      <Dialog open={viewUserDialog} onOpenChange={setViewUserDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Détails de l'utilisateur TCC</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              {/* Informations principales */}
              <div>
                <h3 className="text-lg font-semibold border-b pb-2 mb-3">
                  Informations Principales
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Nom complet
                    </p>
                    <p className="text-base">{selectedUser.fullname}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Position
                    </p>
                    <p className="text-base">{selectedUser.position || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Matricule
                    </p>
                    <p className="text-base">{selectedUser.matricule || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-base">{selectedUser.email}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Téléphone
                    </p>
                    <p className="text-base">{selectedUser.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Mot de passe
                    </p>
                    <div className="flex items-center">
                      <p className="text-base">
                        {passwordVisibility[selectedUser.id]
                          ? selectedUser.password
                          : "••••••••••"}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 ml-1 p-0"
                        onClick={() =>
                          togglePasswordVisibility(selectedUser.id)
                        }
                      >
                        {passwordVisibility[selectedUser.id] ? (
                          <EyeOff className="h-3.5 w-3.5" />
                        ) : (
                          <Eye className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Informations du rôle */}
              <div>
                <h3 className="text-lg font-semibold border-b pb-2 mb-3">
                  Informations du Rôle
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Rôle</p>
                    <p className="text-base">{selectedUser.role || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Type</p>
                    <p className="text-base">{selectedUser.type || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Organisation
                    </p>
                    <p className="text-base">
                      {selectedUser.organisation || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Statut</p>
                    <p className="text-base">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          selectedUser.status === "active"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {selectedUser.status === "active"
                          ? t("active")
                          : t("inactive")}
                      </span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
