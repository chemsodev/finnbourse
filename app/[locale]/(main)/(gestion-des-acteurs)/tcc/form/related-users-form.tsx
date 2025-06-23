"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useState } from "react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import {
  RelatedUserFormValues,
  RelatedUsersFormValues,
  relatedUserSchema,
  relatedUsersFormSchema,
} from "./schema";
import { RolesAssignment } from "@/components/RolesAssignment";
import { TCC_USER_ROLES, TCC_USER_STATUS_OPTIONS } from "@/lib/types/tcc";

interface RelatedUsersFormProps {
  defaultValues: RelatedUsersFormValues;
  onFormChange: (values: RelatedUserFormValues[]) => void;
}

export function RelatedUsersForm({
  defaultValues,
  onFormChange,
}: RelatedUsersFormProps) {
  const t = useTranslations("TCCDetailsPage");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [users, setUsers] = useState<RelatedUserFormValues[]>(
    defaultValues.users || []
  );
  const [passwordVisibility, setPasswordVisibility] = useState<{
    [key: number]: boolean;
  }>({});
  const [showPasswordInForm, setShowPasswordInForm] = useState(false);

  // Toggle password visibility in the table
  const togglePasswordVisibility = (index: number) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  }; // Form for adding/editing a user
  const userForm = useForm<RelatedUserFormValues>({
    resolver: zodResolver(relatedUserSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      telephone: "",
      positionTcc: "",
      role: [], // Array of roles for backend
      status: "actif",
      password: "",
      // Legacy fields for backward compatibility
      fullName: "",
      position: "",
      roles: [],
      type: "member",
      organization: "",
    },
  });

  // Update parent form when users list changes
  const updateParentForm = (updatedUsers: RelatedUserFormValues[]) => {
    setUsers(updatedUsers);
    onFormChange(updatedUsers);
  }; // Open dialog to add a new user
  const handleAddUser = () => {
    userForm.reset({
      firstname: "",
      lastname: "",
      email: "",
      telephone: "",
      positionTcc: "",
      role: [], // Array of roles for backend
      status: "actif",
      password: "",
      // Legacy fields for backward compatibility
      fullName: "",
      position: "",
      roles: [],
      type: "member",
      organization: "",
    });
    setEditingIndex(null);
    setIsDialogOpen(true);
    setShowPasswordInForm(false);
  };

  // Open dialog to edit an existing user
  const handleEditUser = (index: number) => {
    const user = users[index];
    userForm.reset(user);
    setEditingIndex(index);
    setIsDialogOpen(true);
    setShowPasswordInForm(false);
  };

  // Remove a user from the list
  const handleDeleteUser = (index: number) => {
    const updatedUsers = [...users];
    updatedUsers.splice(index, 1);
    updateParentForm(updatedUsers);
  };
  // Save the user (add new or update existing)
  const handleSaveUser = (values: RelatedUserFormValues) => {
    const updatedUsers = [...users];

    // Transform the data to include both new and legacy formats
    const transformedUser = {
      ...values,
      // Ensure fullName is set for display compatibility
      fullName:
        values.firstname && values.lastname
          ? `${values.firstname} ${values.lastname}`
          : values.fullName || "",
      // Ensure position is set for display compatibility
      position: values.positionTcc || values.position || "",
    };

    if (editingIndex !== null) {
      // Update existing user
      updatedUsers[editingIndex] = transformedUser;
    } else {
      // Add new user
      updatedUsers.push(transformedUser);
    }

    updateParentForm(updatedUsers);
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium">{t("affectedUsers")}</h3>
        <Button onClick={handleAddUser} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          {t("addUser")}
        </Button>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {" "}
            <TableRow>
              <TableHead>{t("fullName")}</TableHead>
              <TableHead>{t("email")}</TableHead>
              <TableHead>{t("telephone")}</TableHead>
              <TableHead>{t("position")}</TableHead>
              <TableHead>{t("role")}</TableHead>
              <TableHead>{t("status")}</TableHead>
              <TableHead>{t("password")}</TableHead>
              <TableHead className="w-[100px]">{t("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={8}
                  className="text-center py-4 text-muted-foreground"
                >
                  {t("noUsers")}
                </TableCell>
              </TableRow>
            ) : (
              users.map((user, index) => (
                <TableRow key={index}>
                  <TableCell>
                    {user.firstname && user.lastname
                      ? `${user.firstname} ${user.lastname}`
                      : user.fullName || "-"}
                  </TableCell>
                  <TableCell>{user.email || "-"}</TableCell>
                  <TableCell>{user.telephone || "-"}</TableCell>
                  <TableCell>
                    {user.positionTcc || user.position || "-"}
                  </TableCell>
                  <TableCell>
                    {user.role &&
                    Array.isArray(user.role) &&
                    user.role.length > 0
                      ? user.role.join(", ")
                      : user.roles && user.roles.length > 0
                      ? user.roles.join(", ")
                      : "-"}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        user.status === "actif"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.status === "actif" ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell className="relative">
                    <div className="flex items-center">
                      <span>
                        {passwordVisibility[index]
                          ? user.password || "Not set"
                          : "••••••••••"}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 ml-2"
                        onClick={() => togglePasswordVisibility(index)}
                      >
                        {passwordVisibility[index] ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                        <span className="sr-only">
                          {passwordVisibility[index]
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
                        onClick={() => handleEditUser(index)}
                      >
                        <Pencil className="h-4 w-4" />
                        <span className="sr-only">{t("edit")}</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-red-600"
                        onClick={() => handleDeleteUser(index)}
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

      {/* User Form Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {editingIndex !== null ? t("editUser") : t("addUser")}
            </DialogTitle>
          </DialogHeader>

          <Form {...userForm}>
            {" "}
            <form
              onSubmit={userForm.handleSubmit(handleSaveUser)}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={userForm.control}
                  name="firstname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={userForm.control}
                  name="lastname"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name *</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={userForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email *</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={userForm.control}
                name="telephone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Telephone *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={userForm.control}
                name="positionTcc"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Position *</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />{" "}
              <div className="space-y-2">
                <FormLabel>Roles * (Select one or more)</FormLabel>
                <div className="grid grid-cols-2 gap-2">
                  {TCC_USER_ROLES.map((role) => {
                    const isSelected =
                      userForm.watch("role")?.includes(role) || false;
                    return (
                      <div key={role} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id={role}
                          checked={isSelected}
                          onChange={(e) => {
                            const currentRoles = userForm.watch("role") || [];
                            if (e.target.checked) {
                              // Add role
                              const newRoles = [...currentRoles, role];
                              userForm.setValue("role", newRoles);
                              userForm.setValue("roles", newRoles);
                            } else {
                              // Remove role
                              const newRoles = currentRoles.filter(
                                (r) => r !== role
                              );
                              userForm.setValue("role", newRoles);
                              userForm.setValue("roles", newRoles);
                            }
                          }}
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                        />
                        <label
                          htmlFor={role}
                          className="text-sm font-medium text-gray-700 cursor-pointer"
                        >
                          {role
                            .replace(/_/g, " ")
                            .replace(/\b\w/g, (l) => l.toUpperCase())}
                        </label>
                      </div>
                    );
                  })}
                </div>
                <FormMessage>
                  {userForm.formState.errors.role?.message}
                </FormMessage>
              </div>
              <FormField
                control={userForm.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status *</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          {TCC_USER_STATUS_OPTIONS.map((status) => (
                            <SelectItem key={status.value} value={status.value}>
                              {status.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={userForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel>{t("password")}</FormLabel>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() =>
                          setShowPasswordInForm(!showPasswordInForm)
                        }
                      >
                        {showPasswordInForm ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <FormControl>
                      <Input
                        {...field}
                        type={showPasswordInForm ? "text" : "password"}
                        placeholder={t("enterPassword")}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsDialogOpen(false)}
                >
                  {t("cancel")}
                </Button>
                <Button type="submit">{t("save")}</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
