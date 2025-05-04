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
import { Plus, Pencil, Trash2 } from "lucide-react";
import {
  RelatedUserFormValues,
  RelatedUsersFormValues,
  relatedUserSchema,
  relatedUsersFormSchema,
} from "./schema";

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

  // Form for adding/editing a user
  const userForm = useForm<RelatedUserFormValues>({
    resolver: zodResolver(relatedUserSchema),
    defaultValues: {
      fullName: "",
      position: "",
      role: "",
      status: "member",
      organization: "",
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
      role: "",
      status: "member",
      organization: "",
    });
    setEditingIndex(null);
    setIsDialogOpen(true);
  };

  // Open dialog to edit an existing user
  const handleEditUser = (index: number) => {
    const user = users[index];
    userForm.reset(user);
    setEditingIndex(index);
    setIsDialogOpen(true);
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
              <TableHead>{t("lastName")}</TableHead>
              <TableHead>{t("position")}</TableHead>
              <TableHead>{t("validation")}</TableHead>
              <TableHead>{t("organization")}</TableHead>
              <TableHead>{t("status")}</TableHead>
              <TableHead className="w-[100px]">{t("actions")}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-4 text-muted-foreground"
                >
                  {t("noUsers")}
                </TableCell>
              </TableRow>
            ) : (
              users.map((user, index) => (
                <TableRow key={index}>
                  <TableCell>{user.fullName}</TableCell>
                  <TableCell>{user.position}</TableCell>
                  <TableCell>{t(user.role)}</TableCell>
                  <TableCell>{user.organization || "-"}</TableCell>
                  <TableCell>{t(user.status)}</TableCell>
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
                    <FormLabel>{t("positionInCompany")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={userForm.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("role")}</FormLabel>
                    <FormControl>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder={t("selectRole")} />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="initiator">
                            {t("initiator")}
                          </SelectItem>
                          <SelectItem value="validator1">
                            {t("validator1")}
                          </SelectItem>
                          <SelectItem value="validator2">
                            {t("validator2")}
                          </SelectItem>
                          <SelectItem value="viewOnly">
                            {t("viewOnly")}
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
