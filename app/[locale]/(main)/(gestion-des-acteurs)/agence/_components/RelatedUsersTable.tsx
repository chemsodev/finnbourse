"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Plus, Save, Trash2, X, Eye, EyeOff } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
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
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Switch } from "@/components/ui/switch";
import { type RelatedUser } from "./types";
import { RolesAssignment } from "@/components/RolesAssignment";
import { getRoleDisplayName } from "@/lib/role-utils";

interface RelatedUsersTableProps {
  users: RelatedUser[];
  onUsersChange: (users: RelatedUser[]) => void;
}

export default function RelatedUsersTable({
  users,
  onUsersChange,
}: RelatedUsersTableProps) {
  const t = useTranslations("AgencyPage");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<RelatedUser | null>(null);
  const [passwordVisibility, setPasswordVisibility] = useState<{
    [key: string]: boolean;
  }>({});
  const [showAddPassword, setShowAddPassword] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [userToToggleStatus, setUserToToggleStatus] = useState<string | null>(
    null
  );
  const [statusConfirmDialog, setStatusConfirmDialog] = useState(false);

  const [newUser, setNewUser] = useState<Omit<RelatedUser, "id">>({
    fullName: "",
    position: "",
    matricule: "",
    roles: [],
    status: "active",
    organization: "",
    password: "",
    email: "",
    phone: "",
  });

  const [editUser, setEditUser] = useState<RelatedUser | null>(null);

  // Toggle password visibility in the table - fixed to handle undefined passwords properly
  const togglePasswordVisibility = (userId: string) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  // Handler for adding a new user
  const handleAddUser = () => {
    const id = Date.now().toString();
    const userToAdd: RelatedUser = {
      id,
      ...newUser,
      roles: newUser.roles || [],
      status: newUser.status as "active" | "inactive",
    };
    onUsersChange([...users, userToAdd]);
    setNewUser({
      fullName: "",
      position: "",
      matricule: "",
      roles: [],
      status: "active",
      organization: "",
      password: "",
      email: "",
      phone: "",
    });
    setIsAddDialogOpen(false);
    setShowAddPassword(false);
  };

  // Handler for editing a user
  const handleEditClick = (user: RelatedUser) => {
    setEditUser({ ...user });
    setIsEditDialogOpen(true);
    setShowEditPassword(false);
  };

  // Handler for saving an edited user
  const handleSaveEdit = () => {
    if (!editUser) return;
    const updatedUsers = users.map((user) =>
      user.id === editUser.id
        ? { ...editUser, roles: editUser.roles || [] }
        : user
    );
    onUsersChange(updatedUsers);
    setIsEditDialogOpen(false);
    setEditUser(null);
  };

  // Handler for delete confirmation
  const handleDeleteClick = (user: RelatedUser) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  // Handler for deleting a user
  const handleDeleteUser = () => {
    if (!selectedUser) return;

    const updatedUsers = users.filter((user) => user.id !== selectedUser.id);
    onUsersChange(updatedUsers);
    setIsDeleteDialogOpen(false);
    setSelectedUser(null);
  };

  // Handle status toggle
  const handleToggleStatus = (userId: string) => {
    setUserToToggleStatus(userId);
    setStatusConfirmDialog(true);
  };

  // Confirm status toggle
  const confirmToggleStatus = () => {
    if (!userToToggleStatus) return;

    const updatedUsers = users.map((user) =>
      user.id === userToToggleStatus
        ? {
            ...user,
            status:
              user.status === "active"
                ? "inactive"
                : ("active" as "active" | "inactive"),
          }
        : user
    );

    onUsersChange(updatedUsers);
    setStatusConfirmDialog(false);
    setUserToToggleStatus(null);
  };

  // Cancel status toggle
  const cancelToggleStatus = () => {
    setStatusConfirmDialog(false);
    setUserToToggleStatus(null);
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              {t("addUser")}
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>{t("addNewUser")}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="fullName" className="text-sm font-medium">
                  {t("fullName")}
                </label>
                <Input
                  id="fullName"
                  value={newUser.fullName}
                  onChange={(e) =>
                    setNewUser({ ...newUser, fullName: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="position" className="text-sm font-medium">
                  {t("position")}
                </label>
                <Input
                  id="position"
                  value={newUser.position}
                  onChange={(e) =>
                    setNewUser({ ...newUser, position: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="matricule" className="text-sm font-medium">
                  {t("matricule")}
                </label>
                <Input
                  id="matricule"
                  value={newUser.matricule}
                  onChange={(e) =>
                    setNewUser({ ...newUser, matricule: e.target.value })
                  }
                />
              </div>{" "}
              {/* Roles multi-select */}
              <div className="space-y-2">
                <label htmlFor="roles" className="text-sm font-medium">
                  {t("roles")}
                </label>
                <RolesAssignment
                  selectedRoles={newUser.roles}
                  onRolesChange={(roles) => setNewUser({ ...newUser, roles })}
                  userTypes={["agency"]}
                  showTabs={false}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="status" className="text-sm font-medium">
                  {t("status")}
                </label>
                <Select
                  value={newUser.status}
                  onValueChange={(value) =>
                    setNewUser({
                      ...newUser,
                      status: value as "active" | "inactive",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectStatus")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">{t("active")}</SelectItem>
                    <SelectItem value="inactive">{t("inactive")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label htmlFor="organization" className="text-sm font-medium">
                  {t("organization")}
                </label>
                <Input
                  id="organization"
                  value={newUser.organization}
                  onChange={(e) =>
                    setNewUser({ ...newUser, organization: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  {t("email")}
                </label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email || ""}
                  onChange={(e) =>
                    setNewUser({ ...newUser, email: e.target.value })
                  }
                  placeholder={t("enterEmail")}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="phone" className="text-sm font-medium">
                  {t("phone")}
                </label>
                <Input
                  id="phone"
                  value={newUser.phone || ""}
                  onChange={(e) =>
                    setNewUser({ ...newUser, phone: e.target.value })
                  }
                  placeholder={t("enterPhone")}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="password" className="text-sm font-medium">
                    {t("password")}
                  </label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => setShowAddPassword(!showAddPassword)}
                  >
                    {showAddPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <Input
                  id="password"
                  type={showAddPassword ? "text" : "password"}
                  value={newUser.password}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                  placeholder={t("enterPassword")}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setIsAddDialogOpen(false)}
              >
                {t("cancel")}
              </Button>
              <Button onClick={handleAddUser}>{t("add")}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="whitespace-nowrap">
                {t("fullName")}
              </TableHead>
              <TableHead className="whitespace-nowrap">
                {t("position")}
              </TableHead>
              <TableHead className="whitespace-nowrap">
                {t("matricule")}
              </TableHead>
              <TableHead className="whitespace-nowrap">{t("role")}</TableHead>
              <TableHead className="whitespace-nowrap">{t("status")}</TableHead>
              <TableHead className="whitespace-nowrap">
                {t("organization")}
              </TableHead>
              <TableHead className="whitespace-nowrap">{t("email")}</TableHead>
              <TableHead className="whitespace-nowrap">{t("phone")}</TableHead>
              <TableHead className="whitespace-nowrap">
                {t("actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={10}
                  className="text-center py-4 text-muted-foreground"
                >
                  {t("noUsersYet")}
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className="whitespace-nowrap">
                    {user.fullName}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {user.position}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {user.matricule}
                  </TableCell>{" "}
                  <TableCell className="whitespace-nowrap">
                    {(user.roles || [])
                      .map((roleId) => getRoleDisplayName(roleId))
                      .join(", ")}
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
                        {user.status === "active" ? t("active") : t("inactive")}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {user.organization}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {user.email || "-"}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {user.phone || "-"}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    <div className="flex items-center space-x-2 justify-center">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 text-amber-600"
                        onClick={() => handleEditClick(user)}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">{t("edit")}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 text-red-600"
                        onClick={() => handleDeleteClick(user)}
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">{t("delete")}</span>
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("editUser")}</DialogTitle>
          </DialogHeader>
          {editUser && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="edit-fullName" className="text-sm font-medium">
                  {t("fullName")}
                </label>
                <Input
                  id="edit-fullName"
                  value={editUser.fullName}
                  onChange={(e) =>
                    setEditUser({ ...editUser, fullName: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-position" className="text-sm font-medium">
                  {t("position")}
                </label>
                <Input
                  id="edit-position"
                  value={editUser.position}
                  onChange={(e) =>
                    setEditUser({ ...editUser, position: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-matricule" className="text-sm font-medium">
                  {t("matricule")}
                </label>
                <Input
                  id="edit-matricule"
                  value={editUser.matricule}
                  onChange={(e) =>
                    setEditUser({ ...editUser, matricule: e.target.value })
                  }
                />
              </div>{" "}
              <div className="space-y-2">
                <label htmlFor="edit-roles" className="text-sm font-medium">
                  {t("roles")}
                </label>
                <RolesAssignment
                  selectedRoles={editUser?.roles || []}
                  onRolesChange={(roles) =>
                    setEditUser((u) => (u ? { ...u, roles } : u))
                  }
                  userTypes={["agency"]}
                  showTabs={false}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-status" className="text-sm font-medium">
                  {t("status")}
                </label>
                <Select
                  value={editUser.status}
                  onValueChange={(value) =>
                    setEditUser({
                      ...editUser,
                      status: value as "active" | "inactive",
                    })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectStatus")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">{t("active")}</SelectItem>
                    <SelectItem value="inactive">{t("inactive")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label
                  htmlFor="edit-organization"
                  className="text-sm font-medium"
                >
                  {t("organization")}
                </label>
                <Input
                  id="edit-organization"
                  value={editUser.organization}
                  onChange={(e) =>
                    setEditUser({ ...editUser, organization: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-email" className="text-sm font-medium">
                  {t("email")}
                </label>
                <Input
                  id="edit-email"
                  type="email"
                  value={editUser.email || ""}
                  onChange={(e) =>
                    setEditUser({ ...editUser, email: e.target.value })
                  }
                  placeholder={t("enterEmail")}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-phone" className="text-sm font-medium">
                  {t("phone")}
                </label>
                <Input
                  id="edit-phone"
                  value={editUser.phone || ""}
                  onChange={(e) =>
                    setEditUser({ ...editUser, phone: e.target.value })
                  }
                  placeholder={t("enterPhone")}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label
                    htmlFor="edit-password"
                    className="text-sm font-medium"
                  >
                    {t("password")}
                  </label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => setShowEditPassword(!showEditPassword)}
                  >
                    {showEditPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <Input
                  id="edit-password"
                  type={showEditPassword ? "text" : "password"}
                  value={editUser.password || ""}
                  onChange={(e) =>
                    setEditUser({ ...editUser, password: e.target.value })
                  }
                  placeholder={t("enterPassword")}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsEditDialogOpen(false)}
            >
              {t("cancel")}
            </Button>
            <Button onClick={handleSaveEdit}>{t("save")}</Button>
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
            <AlertDialogTitle>{t("confirmDelete")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteUserConfirmation", { user: selectedUser?.fullName })}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
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
    </div>
  );
}
