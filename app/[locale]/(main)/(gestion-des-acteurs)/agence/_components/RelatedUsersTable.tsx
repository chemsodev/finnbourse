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
import { type RelatedUser } from "./types";

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

  const [newUser, setNewUser] = useState<Omit<RelatedUser, "id">>({
    fullname: "",
    position: "",
    matricule: "",
    role: "initiator",
    type: "member",
    status: "active",
    organisation: "",
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
    const id = Date.now().toString(); // Generate a unique ID
    const userToAdd: RelatedUser = {
      id,
      ...newUser,
      status: newUser.status as "active" | "inactive", // Explicitly cast to the correct type
    };
    onUsersChange([...users, userToAdd]);

    // Reset the form
    setNewUser({
      fullname: "",
      position: "",
      matricule: "",
      role: "initiator",
      type: "member",
      status: "active", // Using the correct literal value
      organisation: "",
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
      user.id === editUser.id ? editUser : user
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
          <DialogContent className="sm:max-w-[500px]">
            <DialogHeader>
              <DialogTitle>{t("addNewUser")}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="fullname" className="text-sm font-medium">
                  {t("fullName")}
                </label>
                <Input
                  id="fullname"
                  value={newUser.fullname}
                  onChange={(e) =>
                    setNewUser({ ...newUser, fullname: e.target.value })
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
              </div>
              <div className="space-y-2">
                <label htmlFor="role" className="text-sm font-medium">
                  {t("role")}
                </label>
                <Select
                  value={newUser.role}
                  onValueChange={(value) =>
                    setNewUser({ ...newUser, role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectRole")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="initiator">{t("initiator")}</SelectItem>
                    <SelectItem value="validator 1">
                      {t("validator1")}
                    </SelectItem>
                    <SelectItem value="validator 2">
                      {t("validator2")}
                    </SelectItem>
                    <SelectItem value="consultation">
                      {t("consultation")}
                    </SelectItem>
                    <SelectItem value="member">{t("member")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label htmlFor="type" className="text-sm font-medium">
                  {t("type")}
                </label>
                <Select
                  value={newUser.type}
                  onValueChange={(value) =>
                    setNewUser({ ...newUser, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectType")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">{t("admin")}</SelectItem>
                    <SelectItem value="member">{t("member")}</SelectItem>
                  </SelectContent>
                </Select>
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
                <label htmlFor="organisation" className="text-sm font-medium">
                  {t("organisation")}
                </label>
                <Input
                  id="organisation"
                  value={newUser.organisation}
                  onChange={(e) =>
                    setNewUser({ ...newUser, organisation: e.target.value })
                  }
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

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>{t("fullName")}</TableHead>
              <TableHead>{t("position")}</TableHead>
              <TableHead>{t("matricule")}</TableHead>
              <TableHead>{t("role")}</TableHead>
              <TableHead>{t("type")}</TableHead>
              <TableHead>{t("status")}</TableHead>
              <TableHead>{t("organisation")}</TableHead>
              <TableHead>{t("password")}</TableHead>
              <TableHead className="text-right">{t("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={9}
                  className="text-center text-muted-foreground"
                >
                  {t("noUsers")}
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.fullname}</TableCell>
                  <TableCell>{user.position}</TableCell>
                  <TableCell>{user.matricule}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.type}</TableCell>
                  <TableCell>
                    <div
                      className={`px-2 py-1 rounded-full text-center text-xs ${
                        user.status === "active"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.status === "active" ? t("active") : t("inactive")}
                    </div>
                  </TableCell>
                  <TableCell>{user.organisation}</TableCell>
                  <TableCell className="relative">
                    <div className="flex items-center">
                      <span>
                        {passwordVisibility[user.id]
                          ? user.password || "Not set"
                          : "••••••••••"}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 ml-2"
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
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-amber-600"
                      onClick={() => handleEditClick(user)}
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">{t("edit")}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 text-red-600 ml-2"
                      onClick={() => handleDeleteClick(user)}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">{t("delete")}</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>{t("editUser")}</DialogTitle>
          </DialogHeader>
          {editUser && (
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="edit-fullname" className="text-sm font-medium">
                  {t("fullName")}
                </label>
                <Input
                  id="edit-fullname"
                  value={editUser.fullname}
                  onChange={(e) =>
                    setEditUser({ ...editUser, fullname: e.target.value })
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
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-role" className="text-sm font-medium">
                  {t("role")}
                </label>
                <Select
                  value={editUser.role}
                  onValueChange={(value) =>
                    setEditUser({ ...editUser, role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectRole")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="initiator">{t("initiator")}</SelectItem>
                    <SelectItem value="validator 1">
                      {t("validator1")}
                    </SelectItem>
                    <SelectItem value="validator 2">
                      {t("validator2")}
                    </SelectItem>
                    <SelectItem value="consultation">
                      {t("consultation")}
                    </SelectItem>
                    <SelectItem value="member">{t("member")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-type" className="text-sm font-medium">
                  {t("type")}
                </label>
                <Select
                  value={editUser.type}
                  onValueChange={(value) =>
                    setEditUser({ ...editUser, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectType")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">{t("admin")}</SelectItem>
                    <SelectItem value="member">{t("member")}</SelectItem>
                  </SelectContent>
                </Select>
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
                  htmlFor="edit-organisation"
                  className="text-sm font-medium"
                >
                  {t("organisation")}
                </label>
                <Input
                  id="edit-organisation"
                  value={editUser.organisation}
                  onChange={(e) =>
                    setEditUser({ ...editUser, organisation: e.target.value })
                  }
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
            <AlertDialogTitle>{t("confirmDeletion")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteUserConfirmation", {
                name: selectedUser?.fullname || "",
              })}
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
    </div>
  );
}
