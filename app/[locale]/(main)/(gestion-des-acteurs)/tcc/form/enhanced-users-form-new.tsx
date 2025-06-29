"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { RelatedUserFormValues } from "./schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Trash2, Edit, Check, X, User } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
import { Badge } from "@/components/ui/badge";

interface EnhancedTCCUsersFormProps {
  defaultValues: {
    users: RelatedUserFormValues[];
  };
  onFormChange: (values: RelatedUserFormValues[]) => void;
  entityName?: string;
}

export function EnhancedTCCUsersForm({
  defaultValues,
  onFormChange,
  entityName = "",
}: EnhancedTCCUsersFormProps) {
  const t = useTranslations("TCCPage");
  const [users, setUsers] = useState<RelatedUserFormValues[]>(
    defaultValues.users || []
  );
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<RelatedUserFormValues | null>(
    null
  );
  const [newUser, setNewUser] = useState<RelatedUserFormValues>({
    fullName: "",
    position: "",
    type: "member",
    status: "active",
    roles: [],
    email: "",
    phone: "",
    matricule: "",
    password: "",
    organization: entityName,
  });

  const handleUsersChange = (newUsers: RelatedUserFormValues[]) => {
    setUsers(newUsers);
    onFormChange(newUsers);
  };

  const handleAddUser = () => {
    const userToAdd = {
      ...newUser,
      id: Date.now().toString(),
    };
    const updatedUsers = [...users, userToAdd];
    handleUsersChange(updatedUsers);
    resetForm();
    setIsAddDialogOpen(false);
  };

  const handleEditUser = (user: RelatedUserFormValues) => {
    setEditingUser(user);
    setNewUser(user);
    setIsAddDialogOpen(true);
  };

  const handleUpdateUser = () => {
    if (editingUser) {
      const updatedUsers = users.map((u) =>
        u.id === editingUser.id ? { ...newUser, id: editingUser.id } : u
      );
      handleUsersChange(updatedUsers);
      setEditingUser(null);
      resetForm();
      setIsAddDialogOpen(false);
    }
  };

  const handleDeleteUser = (userId: string) => {
    const updatedUsers = users.filter((u) => u.id !== userId);
    handleUsersChange(updatedUsers);
  };

  const resetForm = () => {
    setNewUser({
      fullName: "",
      position: "",
      type: "member",
      status: "active",
      roles: [],
      email: "",
      phone: "",
      matricule: "",
      password: "",
      organization: entityName,
    });
  };

  const userForm = (
    <div className="grid gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="fullName">Full Name *</Label>
          <Input
            id="fullName"
            value={newUser.fullName}
            onChange={(e) =>
              setNewUser({ ...newUser, fullName: e.target.value })
            }
            required
          />
        </div>
        <div>
          <Label htmlFor="position">Position *</Label>
          <Input
            id="position"
            value={newUser.position}
            onChange={(e) =>
              setNewUser({ ...newUser, position: e.target.value })
            }
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">Email *</Label>
          <Input
            id="email"
            type="email"
            value={newUser.email || ""}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
            required
          />
        </div>
        <div>
          <Label htmlFor="phone">Phone</Label>
          <Input
            id="phone"
            value={newUser.phone || ""}
            onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="matricule">Matricule</Label>
          <Input
            id="matricule"
            value={newUser.matricule || ""}
            onChange={(e) =>
              setNewUser({ ...newUser, matricule: e.target.value })
            }
          />
        </div>
        <div>
          <Label htmlFor="password">Password *</Label>
          <Input
            id="password"
            type="password"
            value={newUser.password || ""}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
            placeholder="Minimum 6 characters"
            required
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="type">User Type</Label>
          <Select
            value={newUser.type}
            onValueChange={(value) => setNewUser({ ...newUser, type: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select user type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
              <SelectItem value="member">Member</SelectItem>
              <SelectItem value="operator">Operator</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="status">Status</Label>
          <Select
            value={newUser.status}
            onValueChange={(
              value: "actif" | "inactif" | "active" | "inactive"
            ) => setNewUser({ ...newUser, status: value })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );

  return (
    <div className="bg-white rounded-lg shadow-md p-6 max-w-5xl mx-auto">
      <p className="text-center text-muted-foreground mb-6">
        Add users who will manage this TCC. You can skip this step and add users
        later if needed.
      </p>

      {/* Add User Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogTrigger asChild>
          <Button className="mb-6">
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingUser ? "Edit User" : "Add New User"}
            </DialogTitle>
          </DialogHeader>
          {userForm}
          <div className="flex justify-end gap-2 mt-4">
            <Button
              variant="outline"
              onClick={() => {
                setIsAddDialogOpen(false);
                setEditingUser(null);
                resetForm();
              }}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button
              onClick={editingUser ? handleUpdateUser : handleAddUser}
              disabled={
                !newUser.fullName || !newUser.position || !newUser.email
              }
            >
              <Check className="h-4 w-4 mr-2" />
              {editingUser ? "Update User" : "Add User"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Users Table */}
      {users.length === 0 ? (
        <Card>
          <CardContent className="py-8">
            <div className="text-center">
              <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No Users Added
              </h3>
              <p className="text-gray-500 mb-4">
                Add users who will manage this TCC.
              </p>
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add First User
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              TCC Users ({users.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Position</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Phone</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell className="font-medium">
                      {user.fullName}
                    </TableCell>
                    <TableCell>{user.position}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.phone || "N/A"}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="capitalize">
                        {user.type}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          user.status === "active" ? "default" : "secondary"
                        }
                        className="capitalize"
                      >
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleEditUser(user)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteUser(user.id!)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
