"use client";

import type React from "react";

import { useState } from "react";
import { Search, Plus, Pencil, Trash2, Info, Eye, EyeOff } from "lucide-react";
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

// Add AgencyUser interface for consistent user data structure
interface AgencyUser {
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

export default function AgencePage() {
  const router = useRouter();
  const t = useTranslations("AgencyPage");
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedAgency, setSelectedAgency] = useState<AgencyData | null>(null);

  // Add state for password visibility
  const [passwordVisibility, setPasswordVisibility] = useState<{
    [key: number]: boolean;
  }>({});

  // Sample agency user data
  const agencyUsers: AgencyUser[] = [
    {
      id: 1,
      fullname: "Sagi Salim",
      position: "DG",
      matricule: "M001",
      role: "Validator 2",
      type: "admin",
      status: "active",
      organisation: "SLIK PIS",
      password: "SagiPassword123",
      email: "sagi.salim@slikpis.dz",
      phone: "+213 555-111-222",
    },
    {
      id: 2,
      fullname: "Amina Benali",
      position: "Responsable",
      matricule: "M002",
      role: "Validator 1",
      type: "user",
      status: "active",
      organisation: "SLIK PIS",
      password: "AminaSecure456",
      email: "amina.benali@slikpis.dz",
      phone: "+213 555-333-444",
    },
    {
      id: 3,
      fullname: "Karim Diallo",
      position: "Agent",
      matricule: "M003",
      role: "Initiator",
      type: "user",
      status: "inactive",
      organisation: "SLIK PIS",
      password: "StrongPass789",
      email: "karim.diallo@slikpis.dz",
      phone: "+213 555-555-666",
    },
  ];

  const handleAddClick = () => {
    router.push("/agence/new");
  };

  const handleEditClick = (agency: AgencyData) => {
    router.push(`/agence/${agency.id}`);
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

  // Add toggle password visibility function
  const togglePasswordVisibility = (userId: number) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  // Add user management handlers
  const handleAddUser = () => {
    router.push("/agence/new/user");
  };

  const handleEditUser = (user: AgencyUser) => {
    router.push(`/agence/user/${user.id}`);
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

        {/* Users Table Section */}
        <div className="mt-10">
          <h2 className="text-2xl font-bold text-secondary mb-6">
            {t("users")}
          </h2>
          <header className="flex items-center justify-end mb-8">
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                <Input
                  type="text"
                  placeholder={t("searchUsers")}
                  className="pl-10 w-64 bg-white"
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
                {agencyUsers.map((user, index) => (
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
                    <TableCell>{user.email || "-"}</TableCell>
                    <TableCell>{user.phone || "-"}</TableCell>
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
                          onClick={() => handleEditUser(user)}
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
