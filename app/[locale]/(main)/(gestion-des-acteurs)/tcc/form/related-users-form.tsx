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
  };
  // Form for adding/editing a user
  const userForm = useForm<RelatedUserFormValues>({
    resolver: zodResolver(relatedUserSchema),
    defaultValues: {
      fullName: "",
      position: "",
      roles: [], // Initialize with empty array
      role: "initiator", // Keep for backward compatibility
      type: "member",
      status: "active",
      organization: "",
      password: "",
    },
  });

  // Update parent form when users list changes
  const updateParentForm = (updatedUsers: RelatedUserFormValues[]) => {
    setUsers(updatedUsers);
    onFormChange(updatedUsers);
  };
  // Open dialog to add a new user
  const handleAddUser = () => {
    userForm.reset({
      fullName: "",
      position: "",
      roles: [], // Initialize with empty array
      role: "initiator", // Keep for backward compatibility
      type: "member",
      status: "active",
      organization: "",
      password: "",
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

    if (editingIndex !== null) {
      // Update existing user
      updatedUsers[editingIndex] = values;
    } else {
      // Add new user
      updatedUsers.push(values);
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
            <TableRow>
              <TableHead>{t("fullName")}</TableHead>
              <TableHead>{t("position")}</TableHead>
              <TableHead>{t("role")}</TableHead>
              <TableHead>{t("type")}</TableHead>
              <TableHead>{t("status")}</TableHead>
              <TableHead>{t("organization")}</TableHead>
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
                  {" "}
                  <TableCell>{user.fullName}</TableCell>
                  <TableCell>{user.position}</TableCell>
                  <TableCell>
                    {
                      user.roles && user.roles.length > 0
                        ? user.roles.map((role) => t(role)).join(", ")
                        : t(user.role) // Fallback to legacy role if no roles array
                    }
                  </TableCell>
                  <TableCell>{t(user.type)}</TableCell>
                  <TableCell>{t(user.status)}</TableCell>
                  <TableCell>{user.organization || "-"}</TableCell>
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
            <form
              onSubmit={userForm.handleSubmit(handleSaveUser)}
              className="space-y-4"
            >
              <FormField
                control={userForm.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("fullName")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={userForm.control}
                name="position"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("position")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />{" "}
              <div className="space-y-2">
                <FormLabel>{t("roles")}</FormLabel>
                <RolesAssignment
                  selectedRoles={userForm.watch("roles") || []}
                  onRolesChange={(roles) => {
                    userForm.setValue("roles", roles);
                    // For backward compatibility, set the first role as the primary role
                    if (roles.length > 0) {
                      userForm.setValue("role", roles[0]);
                    } else {
                      userForm.setValue("role", "");
                    }
                  }}
                  userTypes={["tcc"]}
                  showTabs={false}
                />
                <FormMessage>
                  {userForm.formState.errors.roles?.message}
                </FormMessage>
              </div>
              <FormField
                control={userForm.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("type")}</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t("selectType")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">{t("admin")}</SelectItem>
                          <SelectItem value="member">{t("member")}</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={userForm.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("status")}</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t("selectStatus")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="active">{t("active")}</SelectItem>
                          <SelectItem value="inactive">
                            {t("inactive")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={userForm.control}
                name="organization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("organization")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
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
