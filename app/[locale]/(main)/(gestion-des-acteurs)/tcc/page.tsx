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
import MyPagination from "@/components/navigation/MyPagination";

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
  const [selectedUser, setSelectedUser] = useState<any | null>(null);
  const [passwordVisibility, setPasswordVisibility] = useState<{
    [key: number]: boolean;
  }>({});

  const togglePasswordVisibility = (userId: number) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  const filteredUsers = tccUsers.filter(
    (user) =>
      user.fullname.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.position.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddUser = () => {
    // Route to user creation form
    router.push("/tcc/form/users");
  };

  const handleEditUser = (user: any) => {
    // Route to user edit form
    router.push(`/tcc/form/users/${user.id}`);
  };

  const handleDeleteClick = (user: any) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    // In a real app, you would delete the user from your database
    console.log(`Deleting user with ID: ${selectedUser?.id}`);
    setIsDeleteDialogOpen(false);
    // Then refresh your data
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
                {filteredUsers.map((user, index) => (
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
                          className="h-10 w-10"
                          onClick={() => togglePasswordVisibility(user.id)}
                        >
                          {passwordVisibility[user.id] ? (
                            <EyeOff className="h-5 w-5" />
                          ) : (
                            <Eye className="h-5 w-5" />
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
                      <div className="flex justify-center items-center gap-3">
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-10 w-10 text-amber-600"
                          onClick={() => handleEditUser(user)}
                        >
                          <Pencil className="h-5 w-5" />
                          <span className="sr-only">{t("edit")}</span>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-10 w-10 text-red-600"
                          onClick={() => handleDeleteClick(user)}
                        >
                          <Trash2 className="h-5 w-5" />
                          <span className="sr-only">{t("delete")}</span>
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
    </div>
  );
}
