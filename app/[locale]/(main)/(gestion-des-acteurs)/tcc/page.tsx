"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Pencil,
  Plus,
  Trash2,
  Search,
  Eye,
  EyeOff,
  RefreshCw,
} from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
import { useTCC, useTCCUsers } from "@/hooks/useTCC";
import { TCCService } from "@/lib/services/tccService";
import { TCC, TCCUser } from "@/lib/types/tcc";
import { Badge } from "@/components/ui/badge";

// Transform TCCUser to match the existing interface for backward compatibility
interface DisplayTCCUser {
  id: string;
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

export default function TeneurComptesTitresPage() {
  const router = useRouter();
  const t = useTranslations("TCCDetailsPage");
  const tPage = useTranslations("TCCPage");
  const { toast } = useToast();

  // API hooks
  const { tccs, isLoading: isLoadingTCC, fetchTCCs } = useTCC();
  const { updateUser, updateUserRole } = useTCCUsers();

  // State management
  const [searchQuery, setSearchQuery] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<DisplayTCCUser | null>(null);
  const [passwordVisibility, setPasswordVisibility] = useState<{
    [key: string]: boolean;
  }>({});
  const [users, setUsers] = useState<DisplayTCCUser[]>([]);
  const [userToToggleStatus, setUserToToggleStatus] = useState<string | null>(
    null
  );
  const [statusConfirmDialog, setStatusConfirmDialog] = useState(false);
  const [viewUserDialog, setViewUserDialog] = useState(false);
  const [currentTCC, setCurrentTCC] = useState<TCC | null>(null);

  // Load TCC data on mount
  useEffect(() => {
    loadTCCData();
  }, []);

  const loadTCCData = async () => {
    try {
      await fetchTCCs();
    } catch (error) {
      console.error("Failed to load TCC data:", error);
    }
  };

  // Transform TCC users for display
  useEffect(() => {
    if (tccs.length > 0) {
      setCurrentTCC(tccs[0]); // Use the first TCC for now
      // In a real app, you'd fetch users for the specific TCC
      // For now, we'll create some sample data structure
      setUsers([]);
    }
  }, [tccs]);

  const togglePasswordVisibility = (userId: string) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  const handleToggleStatus = (userId: string) => {
    setUserToToggleStatus(userId);
    setStatusConfirmDialog(true);
  };

  const confirmToggleStatus = async () => {
    if (!userToToggleStatus) return;

    try {
      const user = users.find((u) => u.id === userToToggleStatus);
      if (!user) return;

      const newStatus = user.status === "active" ? "inactif" : "actif";

      await updateUser(userToToggleStatus, {
        status: newStatus,
      });

      // Update local state
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

      toast({
        title: "Success",
        description: "User status updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update user status",
        variant: "destructive",
      });
    } finally {
      setStatusConfirmDialog(false);
      setUserToToggleStatus(null);
    }
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
    router.push("/tcc/form/users");
  };

  const handleEditUser = (user: DisplayTCCUser) => {
    router.push(`/tcc/form/users/${user.id}`);
  };

  const handleDeleteClick = (user: DisplayTCCUser) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    // TODO: Implement user deletion via API
    console.log(`Deleting user with ID: ${selectedUser?.id}`);
    setIsDeleteDialogOpen(false);
  };

  const handleViewUser = (user: DisplayTCCUser) => {
    setSelectedUser(user);
    setViewUserDialog(true);
  };

  // Show loading state
  if (isLoadingTCC) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-6 w-6 animate-spin" />
          <span>Loading TCC data...</span>
        </div>
      </div>
    );
  }

  // Show create button if no TCC exists
  if (!currentTCC) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center py-12">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Teneur de Comptes Conservateur
            </h1>
            <p className="text-gray-600 mb-8">
              No TCC configured. Create one to get started.
            </p>
            <Button
              className="flex items-center gap-2 mx-auto"
              onClick={() => router.push("/tcc/form")}
            >
              <Plus className="h-4 w-4" />
              Create TCC
            </Button>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-800">
            {currentTCC.libelle}
          </h1>
          <Button
            className="flex items-center gap-2"
            onClick={() => router.push(`/tcc/form/${currentTCC.id || "new"}`)}
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
                    <p className="text-base">{currentTCC.code}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {t("type")}
                    </p>
                    <p className="text-base">
                      {currentTCC.account_type || "-"}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {t("label")}
                  </p>
                  <p className="text-base">{currentTCC.libelle}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {t("status")}
                    </p>
                    <Badge
                      variant={
                        currentTCC.status === "ACTIVE" ? "default" : "secondary"
                      }
                    >
                      {currentTCC.status}
                    </Badge>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {t("creationDate")}
                    </p>
                    <p className="text-base">
                      {currentTCC.createdAt
                        ? new Date(currentTCC.createdAt).toLocaleDateString()
                        : "-"}
                    </p>
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
                  <p className="text-base">{currentTCC.address}</p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {t("postalCode")}
                    </p>
                    <p className="text-base">{currentTCC.postal_code}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {t("city")}
                    </p>
                    <p className="text-base">{currentTCC.city}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {t("country")}
                    </p>
                    <p className="text-base">{currentTCC.country}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {t("phone")}
                    </p>
                    <p className="text-base">{currentTCC.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {t("email")}
                    </p>
                    <p className="text-base">{currentTCC.email}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                {t("regulatoryInformation")}
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {t("approvalNumber")}
                    </p>
                    <p className="text-base">
                      {currentTCC.agreement_number || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      {t("approvalDate")}
                    </p>
                    <p className="text-base">
                      {currentTCC.agreement_date || "-"}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    {t("surveillanceAuthority")}
                  </p>
                  <p className="text-base">
                    {currentTCC.surveillance_authority || "-"}
                  </p>
                </div>
                {currentTCC.name_correspondent && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Correspondent Name
                      </p>
                      <p className="text-base">
                        {currentTCC.name_correspondent}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">
                        Correspondent Code
                      </p>
                      <p className="text-base">
                        {currentTCC.code_correspondent || "-"}
                      </p>
                    </div>
                  </div>
                )}
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
