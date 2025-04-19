"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Plus, Save, Trash2, X } from "lucide-react";
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
  const [newUser, setNewUser] = useState<Omit<RelatedUser, "id">>({
    fullName: "",
    position: "",
    role: "Member",
    status: "Active",
    organization: "",
  });

  const [editUser, setEditUser] = useState<RelatedUser | null>(null);

  // Handler for adding a new user
  const handleAddUser = () => {
    const id = Date.now().toString(); // Generate a unique ID
    const userToAdd = { id, ...newUser };
    onUsersChange([...users, userToAdd]);

    // Reset the form
    setNewUser({
      fullName: "",
      position: "",
      role: "Member",
      status: "Active",
      organization: "",
    });
    setIsAddDialogOpen(false);
  };

  // Handler for editing a user
  const handleEditClick = (user: RelatedUser) => {
    setEditUser({ ...user });
    setIsEditDialogOpen(true);
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
                    <SelectItem value="Initiator">{t("initiator")}</SelectItem>
                    <SelectItem value="Validator 1">
                      {t("validator1")}
                    </SelectItem>
                    <SelectItem value="Validator 2">
                      {t("validator2")}
                    </SelectItem>
                    <SelectItem value="Consultation">
                      {t("consultation")}
                    </SelectItem>
                    <SelectItem value="Member">{t("member")}</SelectItem>
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
                    setNewUser({ ...newUser, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectStatus")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">{t("active")}</SelectItem>
                    <SelectItem value="Inactive">{t("inactive")}</SelectItem>
                    <SelectItem value="Admin">{t("admin")}</SelectItem>
                    <SelectItem value="Member">{t("member")}</SelectItem>
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
            <TableRow className="bg-muted">
              <TableHead>{t("fullName")}</TableHead>
              <TableHead>{t("position")}</TableHead>
              <TableHead>{t("role")}</TableHead>
              <TableHead>{t("status")}</TableHead>
              <TableHead>{t("organization")}</TableHead>
              <TableHead className="text-right">{t("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-6 text-muted-foreground"
                >
                  {t("noUsersYet")}
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.fullName}</TableCell>
                  <TableCell>{user.position}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>{user.status}</TableCell>
                  <TableCell>{user.organization}</TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEditClick(user)}
                    >
                      <Pencil className="h-4 w-4" />
                      <span className="sr-only">{t("edit")}</span>
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
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

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
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
                    <SelectItem value="Initiator">{t("initiator")}</SelectItem>
                    <SelectItem value="Validator 1">
                      {t("validator1")}
                    </SelectItem>
                    <SelectItem value="Validator 2">
                      {t("validator2")}
                    </SelectItem>
                    <SelectItem value="Consultation">
                      {t("consultation")}
                    </SelectItem>
                    <SelectItem value="Member">{t("member")}</SelectItem>
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
                    setEditUser({ ...editUser, status: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={t("selectStatus")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Active">{t("active")}</SelectItem>
                    <SelectItem value="Inactive">{t("inactive")}</SelectItem>
                    <SelectItem value="Admin">{t("admin")}</SelectItem>
                    <SelectItem value="Member">{t("member")}</SelectItem>
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
            <AlertDialogTitle>{t("areYouSure")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteUserConfirmation")}
              <span className="font-medium"> {selectedUser?.fullName}</span>.
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
