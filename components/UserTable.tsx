"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Plus, Trash2, Eye, EyeOff } from "lucide-react";
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
import { Switch } from "@/components/ui/switch";
import { RoleSelector } from "@/components/RoleSelector";
import { CLIENT_ROLES, AGENCY_ROLES, TCC_ROLES, IOB_ROLES } from "@/lib/roles";
import { getRoleDisplayName } from "@/lib/role-utils";
import { RolesAssignment } from "./RolesAssignment";

// Generic user interface with common fields
export interface GenericUser {
  id: string;
  fullName: string;
  position: string;
  roles: string[]; // Now supports multiple roles
  status: "active" | "inactive";
  organization?: string;
  password?: string;
  email?: string;
  phone?: string;
  matricule?: string;
  [key: string]: any; // Allow for other custom fields
}

interface UserTableProps {
  users: GenericUser[];
  onUsersChange: (users: GenericUser[]) => void;
  userType: "client" | "agency" | "tcc" | "iob";
  customColumns?: {
    key: string;
    header: string;
    render?: (user: GenericUser) => React.ReactNode;
  }[];
  additionalFields?: {
    key: string;
    label: string;
    type: "text" | "email" | "password" | "select";
    options?: { value: string; label: string }[];
  }[];
}

export function UserTable({
  users,
  onUsersChange,
  userType,
  customColumns = [],
  additionalFields = [],
}: UserTableProps) {
  const t = useTranslations("UsersManagement");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<GenericUser | null>(null);
  const [showAddPassword, setShowAddPassword] = useState(false);
  const [showEditPassword, setShowEditPassword] = useState(false);
  const [statusConfirmDialog, setStatusConfirmDialog] = useState(false);
  const [userToToggleStatus, setUserToToggleStatus] = useState<string | null>(
    null
  );

  // Get the appropriate roles based on user type
  const getRolesByType = () => {
    switch (userType) {
      case "client":
        return CLIENT_ROLES;
      case "agency":
        return AGENCY_ROLES;
      case "tcc":
        return TCC_ROLES;
      case "iob":
        return IOB_ROLES;
      default:
        return [];
    }
  };

  // Initial state for a new user
  const getInitialUserState = (): Omit<GenericUser, "id"> => {
    const base: Omit<GenericUser, "id"> = {
      // Explicitly type base
      fullName: "",
      position: "",
      roles: [], // Default to empty array
      status: "active", // Default status
      organization: "",
      password: "",
      email: "",
      phone: "",
      // Initialize conditional fields to undefined or default
      matricule: userType === "agency" || userType === "iob" ? "" : undefined,
    };

    // Add any custom fields from additionalFields, ensuring not to overwrite core typed fields directly
    const customFields: { [key: string]: any } = {};
    additionalFields.forEach((field) => {
      // Avoid overwriting explicitly typed base fields with potentially incorrect types from additionalFields
      if (!(field.key in base)) {
        customFields[field.key] = ""; // Initialize additional fields
      }
    });

    // Merge base and custom fields. Base fields take precedence for typing.
    const initialUser = { ...customFields, ...base }; // Spread customFields first, then base
 
    return {
      ...initialUser,
      // Ensure all required fields from GenericUser are present and correctly typed
      fullName: String(initialUser.fullName || ""),
      position: String(initialUser.position || ""),
      roles: Array.isArray(initialUser.roles) ? initialUser.roles : [],
      status:
        initialUser.status === "active" || initialUser.status === "inactive"
          ? initialUser.status
          : "active", // Ensure status is valid
      matricule:
        userType === "agency" || userType === "iob"
          ? String(initialUser.matricule || "")
          : undefined,
      organization: String(initialUser.organization || ""),
      password: String(initialUser.password || ""),
      email: String(initialUser.email || ""),
      phone: String(initialUser.phone || ""),
    };
  };

  const [newUser, setNewUser] = useState<Omit<GenericUser, "id">>(
    getInitialUserState()
  );
  const [editUser, setEditUser] = useState<GenericUser | null>(null);

  // Handler for adding a new user
  const handleAddUser = () => {
    const id = Date.now().toString();
    // Ensure all required fields for GenericUser are present
    const userToAdd: GenericUser = {
      id,
      fullName: newUser.fullName || "",
      position: newUser.position || "",
      roles: newUser.roles || [],
      status:
        newUser.status === "active" || newUser.status === "inactive"
          ? newUser.status
          : "active", // Ensure status is valid
      matricule: newUser.matricule,
      organization: newUser.organization,
      password: newUser.password,
      email: newUser.email,
      phone: newUser.phone,
      ...newUser, // Spread the rest of newUser which might contain additionalFields
    };
    onUsersChange([...users, userToAdd]);
    setNewUser(getInitialUserState());
    setIsAddDialogOpen(false);
    setShowAddPassword(false);
  };

  // Handler for editing a user
  const handleEditClick = (user: GenericUser) => {
    setEditUser({ ...user });
    setIsEditDialogOpen(true);
    setShowEditPassword(false);
  };

  // Handler for saving an edited user
  const handleSaveEdit = () => {
    if (!editUser) return;

    // Ensure the status is correctly typed before updating
    const userToUpdate: GenericUser = {
      ...editUser,
      status:
        editUser.status === "active" || editUser.status === "inactive"
          ? editUser.status
          : "inactive", // Default to 'inactive' or handle as an error if status is invalid
      roles: editUser.roles || [],
    };

    const updatedUsers = users.map((user) =>
      user.id === userToUpdate.id ? userToUpdate : user
    );
    onUsersChange(updatedUsers);
    setIsEditDialogOpen(false);
    setEditUser(null);
  };

  // Handler for delete confirmation
  const handleDeleteClick = (user: GenericUser) => {
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
    const updatedUsers = users.map(
      (
        user
      ): GenericUser => // Add explicit GenericUser return type
        user.id === userToToggleStatus
          ? {
              ...user,
              status: user.status === "active" ? "inactive" : "active",
            }
          : user
    );
    onUsersChange(updatedUsers);
    setStatusConfirmDialog(false);
    setUserToToggleStatus(null);
  };

  // Get a localized display name for a role
  const getRoleLabel = (roleValue: string) => {
    // First try to translate directly (for legacy values)
    const legacyLabel = (() => {
      switch (roleValue) {
        case "initiator":
          return t("initiator");
        case "validator 1":
          return t("validator1");
        case "validator 2":
          return t("validator2");
        case "consultation":
          return t("consultation");
        case "member":
          return t("member");
        case "admin":
          return t("admin");
        default:
          return null;
      }
    })();

    if (legacyLabel) return legacyLabel;

    // For new role IDs, get the display name
    return getRoleDisplayName(roleValue) || roleValue;
  };

  return (
    <div>
      <div className="flex justify-end mb-4">
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <Button
            className="flex items-center gap-2"
            onClick={() => setIsAddDialogOpen(true)}
          >
            <Plus className="h-4 w-4" />
            {t("addUser")}
          </Button>
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

              {/* Conditionally show matricule field */}
              {(userType === "agency" || userType === "iob") && (
                <div className="space-y-2">
                  <label htmlFor="matricule" className="text-sm font-medium">
                    {t("matricule")}
                  </label>
                  <Input
                    id="matricule"
                    value={newUser.matricule || ""}
                    onChange={(e) =>
                      setNewUser({ ...newUser, matricule: e.target.value })
                    }
                  />
                </div>
              )}

              {/* Roles multi-select */}
              <div className="space-y-2">
                <label htmlFor="roles" className="text-sm font-medium">
                  {t("roles")}
                </label>
                <RolesAssignment
                  selectedRoles={newUser.roles}
                  onRolesChange={(roles) => setNewUser({ ...newUser, roles })}
                  userTypes={[userType]}
                  showTabs={false}
                />
              </div>

              {/* Status selector */}
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

              {/* Organization field */}
              <div className="space-y-2">
                <label htmlFor="organization" className="text-sm font-medium">
                  {t("organization")}
                </label>
                <Input
                  id="organization"
                  value={newUser.organization || ""}
                  onChange={(e) =>
                    setNewUser({ ...newUser, organization: e.target.value })
                  }
                />
              </div>

              {/* Email field */}
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

              {/* Phone field */}
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

              {/* Password field */}
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
                  value={newUser.password || ""}
                  onChange={(e) =>
                    setNewUser({ ...newUser, password: e.target.value })
                  }
                  placeholder={t("enterPassword")}
                />
              </div>

              {/* Add any custom fields based on additionalFields */}
              {additionalFields.map((field) => {
                if (field.type === "select" && field.options) {
                  return (
                    <div key={field.key} className="space-y-2">
                      <label
                        htmlFor={`new-${field.key}`}
                        className="text-sm font-medium"
                      >
                        {field.label}
                      </label>
                      <Select
                        value={newUser[field.key] || ""}
                        onValueChange={(value) =>
                          setNewUser({ ...newUser, [field.key]: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={`Select ${field.label}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {field.options.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  );
                }
                return (
                  <div key={field.key} className="space-y-2">
                    <label
                      htmlFor={`new-${field.key}`}
                      className="text-sm font-medium"
                    >
                      {field.label}
                    </label>
                    <Input
                      id={`new-${field.key}`}
                      type={field.type}
                      value={newUser[field.key] || ""}
                      onChange={(e) =>
                        setNewUser({ ...newUser, [field.key]: e.target.value })
                      }
                    />
                  </div>
                );
              })}
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

              {userType === "agency" || userType === "iob" ? (
                <TableHead className="whitespace-nowrap">
                  {t("matricule")}
                </TableHead>
              ) : null}

              <TableHead className="whitespace-nowrap">{t("role")}</TableHead>

              {userType === "agency" && (
                <TableHead className="whitespace-nowrap">{t("type")}</TableHead>
              )}

              <TableHead className="whitespace-nowrap">{t("status")}</TableHead>
              <TableHead className="whitespace-nowrap">
                {t("organization")}
              </TableHead>
              <TableHead className="whitespace-nowrap">{t("email")}</TableHead>
              <TableHead className="whitespace-nowrap">{t("phone")}</TableHead>

              {/* Render custom column headers */}
              {customColumns.map((column) => (
                <TableHead key={column.key} className="whitespace-nowrap">
                  {column.header}
                </TableHead>
              ))}

              <TableHead className="whitespace-nowrap">
                {t("actions")}
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={
                    10 +
                    customColumns.length +
                    (userType === "agency" || userType === "iob" ? 1 : 0) +
                    (userType === "agency" ? 1 : 0)
                  }
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

                  {userType === "agency" || userType === "iob" ? (
                    <TableCell className="whitespace-nowrap">
                      {user.matricule || "-"}
                    </TableCell>
                  ) : null}

                  <TableCell className="whitespace-nowrap">
                    {(user.roles || [])
                      .map((roleId) => getRoleLabel(roleId))
                      .join(", ")}
                  </TableCell>

                  {userType === "agency" && (
                    <TableCell className="whitespace-nowrap">
                      {user.type === "admin" ? t("admin") : t("member")}
                    </TableCell>
                  )}

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
                    {user.organization || "-"}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {user.email || "-"}
                  </TableCell>
                  <TableCell className="whitespace-nowrap">
                    {user.phone || "-"}
                  </TableCell>

                  {/* Render custom columns */}
                  {customColumns.map((column) => (
                    <TableCell key={column.key} className="whitespace-nowrap">
                      {column.render
                        ? column.render(user)
                        : user[column.key] || "-"}
                    </TableCell>
                  ))}

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

              {/* Conditionally show matricule field */}
              {(userType === "agency" || userType === "iob") && (
                <div className="space-y-2">
                  <label
                    htmlFor="edit-matricule"
                    className="text-sm font-medium"
                  >
                    {t("matricule")}
                  </label>
                  <Input
                    id="edit-matricule"
                    value={editUser.matricule || ""}
                    onChange={(e) =>
                      setEditUser({ ...editUser, matricule: e.target.value })
                    }
                  />
                </div>
              )}

              {/* Roles multi-select */}
              <div className="space-y-2">
                <label htmlFor="edit-roles" className="text-sm font-medium">
                  {t("roles")}
                </label>
                <RolesAssignment
                  selectedRoles={editUser?.roles || []}
                  onRolesChange={(roles) =>
                    setEditUser((u) => (u ? { ...u, roles } : u))
                  }
                  userTypes={[userType]}
                  showTabs={false}
                />
              </div>

              {/* Status selector */}
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

              {/* Organization field */}
              <div className="space-y-2">
                <label
                  htmlFor="edit-organization"
                  className="text-sm font-medium"
                >
                  {t("organization")}
                </label>
                <Input
                  id="edit-organization"
                  value={editUser.organization || ""}
                  onChange={(e) =>
                    setEditUser({ ...editUser, organization: e.target.value })
                  }
                />
              </div>

              {/* Email field */}
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

              {/* Phone field */}
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

              {/* Password field */}
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

              {/* Add any custom fields based on additionalFields */}
              {additionalFields.map((field) => {
                if (field.type === "select" && field.options) {
                  return (
                    <div key={field.key} className="space-y-2">
                      <label
                        htmlFor={`edit-${field.key}`}
                        className="text-sm font-medium"
                      >
                        {field.label}
                      </label>
                      <Select
                        value={editUser[field.key] || ""}
                        onValueChange={(value) =>
                          setEditUser({ ...editUser, [field.key]: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={`Select ${field.label}`} />
                        </SelectTrigger>
                        <SelectContent>
                          {field.options.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  );
                }
                return (
                  <div key={field.key} className="space-y-2">
                    <label
                      htmlFor={`edit-${field.key}`}
                      className="text-sm font-medium"
                    >
                      {field.label}
                    </label>
                    <Input
                      id={`edit-${field.key}`}
                      type={field.type}
                      value={editUser[field.key] || ""}
                      onChange={(e) =>
                        setEditUser({
                          ...editUser,
                          [field.key]: e.target.value,
                        })
                      }
                    />
                  </div>
                );
              })}
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
            <AlertDialogTitle>{t("changeStatus")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("changeStatusConfirmation")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setStatusConfirmDialog(false)}>
              {t("cancel")}
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmToggleStatus}>
              {t("confirm")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
