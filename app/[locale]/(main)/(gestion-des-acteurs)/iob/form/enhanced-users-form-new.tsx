"use client";

import { useState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { RelatedUserFormValues } from "./schema";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Plus,
  Trash2,
  Edit,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
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
import { useToast } from "@/hooks/use-toast";
import { RolesAssignment } from "@/components/RolesAssignment";
import {
  extractErrorMessage,
  isEmailAlreadyInUseError,
} from "@/lib/utils/errorHandling";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface EnhancedUsersFormProps {
  defaultValues: {
    users: RelatedUserFormValues[];
  };
  onFormChange: (values: RelatedUserFormValues[]) => void;
  entityName?: string;
  iobId?: string;
  isEditMode?: boolean;
  existingUsers?: any[]; // Accept users directly from parent
  onRefreshUsers?: () => Promise<void>; // Callback to refresh users from parent
}

export function EnhancedUsersForm({
  defaultValues,
  onFormChange,
  entityName = "",
  iobId,
  isEditMode = false,
  existingUsers: initialExistingUsers = [], // Accept users directly from parent
  onRefreshUsers, // Callback to refresh users from parent
}: EnhancedUsersFormProps) {
  const t = useTranslations("IOBPage");
  const { toast } = useToast();
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
    status: "active",
    roles: [],
    email: "",
    phone: "",
    matricule: "",
    password: "",
    organization: entityName,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [existingUsers, setExistingUsers] =
    useState<any[]>(initialExistingUsers);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);

  // Fetch existing users if in edit mode, we have an IOB ID, and no users were provided directly
  useEffect(() => {
    if (isEditMode && iobId && initialExistingUsers.length === 0) {
      fetchExistingUsers();
    } else if (initialExistingUsers.length > 0) {
      // If users were provided directly, use them
      setExistingUsers(initialExistingUsers);
    }
  }, [isEditMode, iobId, initialExistingUsers]);

  const fetchExistingUsers = async () => {
    if (!iobId) return;

    try {
      setIsLoadingUsers(true);
      const { actorAPI } = await import("@/app/actions/actorAPI");

      // Get the IOB data which includes users
      const iobResponse = await actorAPI.iob.getOne(iobId);
      if (
        iobResponse &&
        iobResponse.users &&
        Array.isArray(iobResponse.users)
      ) {
        setExistingUsers(iobResponse.users);
      }
    } catch (error) {
      console.error("Failed to fetch IOB users:", error);
      toast({
        title: "Error",
        description: "Failed to load existing users",
        variant: "destructive",
      });
    } finally {
      setIsLoadingUsers(false);
    }
  };

  const handleUsersChange = (newUsers: RelatedUserFormValues[]) => {
    setUsers(newUsers);
    onFormChange(newUsers);
  };

  // Function to refresh existing users from backend
  const refreshExistingUsers = async () => {
    if (onRefreshUsers) {
      // Use parent's refresh function if available
      await onRefreshUsers();
    } else if (isEditMode && iobId) {
      // Fallback to internal refresh
      await fetchExistingUsers();
    }
  };

  const handleAddUser = async () => {
    if (!newUser.fullName || !newUser.position) {
      toast({
        title: t("validationError"),
        description: t("nameAndPositionRequired"),
        variant: "destructive",
      });
      return;
    }

    // Add user to local state first
    const userToAdd = {
      ...newUser,
      id: Date.now().toString(),
    };

    setIsLoading(true);

    // If we have an IOB ID, create the user in the backend
    if (iobId) {
      try {
        const { actorAPI } = await import("@/app/actions/actorAPI");

        // Format user data for API
        const userData = {
          firstname: userToAdd.fullName.split(" ")[0] || userToAdd.fullName,
          lastname: userToAdd.fullName.split(" ").slice(1).join(" ") || "",
          email:
            userToAdd.email ||
            `${userToAdd.fullName.toLowerCase().replace(/\s+/g, ".")}@iob.com`,
          password: userToAdd.password || "TempPassword123!",
          telephone: userToAdd.phone || "",
          status: userToAdd.status === "active" ? "actif" : "inactif",
          posteIob: userToAdd.position,
          matriculeIob: userToAdd.matricule || "",
          role: userToAdd.roles || [],
        };

        // Create user in backend
        const createdUser = await actorAPI.iob.createUser(iobId, userData);

        // Add the created user to our existing users list
        if (createdUser) {
          setExistingUsers([...existingUsers, createdUser]);
        }

        // Refresh users data to get the updated list
        await refreshExistingUsers();

        toast({
          title: t("success"),
          description: t("userCreatedSuccessfully"),
        });
      } catch (error) {
        console.error("Failed to create user:", error);

        // Handle specific error types using utility
        let errorMessage = t("failedToCreateUser");

        if (isEmailAlreadyInUseError(error)) {
          errorMessage = t("emailAlreadyInUse");
        } else {
          const extractedMessage = extractErrorMessage(error);
          if (extractedMessage !== "An error occurred") {
            errorMessage = extractedMessage;
          }
        }

        toast({
          title: t("error"),
          description: errorMessage,
          variant: "destructive",
        });

        // Still add to local state for UI purposes
        const updatedUsers = [...users, userToAdd];
        handleUsersChange(updatedUsers);
      }
    } else {
      // Just add to local state if no IOB ID yet
      const updatedUsers = [...users, userToAdd];
      handleUsersChange(updatedUsers);
    }

    // Reset form
    setNewUser({
      fullName: "",
      position: "",
      status: "active",
      roles: [],
      email: "",
      phone: "",
      matricule: "",
      password: "",
      organization: entityName,
    });

    setIsLoading(false);
    setIsAddDialogOpen(false);
  };

  const handleEditUser = (user: RelatedUserFormValues) => {
    setEditingUser(user);
    setNewUser(user);
    setIsAddDialogOpen(true);
  };

  const handleUpdateUser = async () => {
    if (editingUser) {
      if (!newUser.fullName || !newUser.position) {
        toast({
          title: t("validationError"),
          description: t("nameAndPositionRequired"),
          variant: "destructive",
        });
        return;
      }

      setIsLoading(true);

      // Update the user in local state first
      const updatedUsers = users.map((u) =>
        u.id === editingUser.id ? { ...newUser, id: editingUser.id } : u
      );

      // If we have an IOB ID and the user has a backend ID, update in backend
      if (iobId && editingUser.backendId) {
        try {
          const { actorAPI } = await import("@/app/actions/actorAPI");

          // Format user data for API
          const userData = {
            firstname: newUser.fullName.split(" ")[0] || newUser.fullName,
            lastname: newUser.fullName.split(" ").slice(1).join(" ") || "",
            email:
              newUser.email ||
              `${newUser.fullName.toLowerCase().replace(/\s+/g, ".")}@iob.com`,
            telephone: newUser.phone || "",
            status: newUser.status === "active" ? "actif" : "inactif",
            posteIob: newUser.position,
            matriculeIob: newUser.matricule || "",
            role: newUser.roles || [],
          };

          // Update user in backend
          await actorAPI.iob.updateUser(iobId, editingUser.backendId, userData);

          // Refresh the users list
          await refreshExistingUsers();

          toast({
            title: t("success"),
            description: t("userUpdatedSuccessfully"),
          });
        } catch (error) {
          console.error("Failed to update user:", error);

          // Handle specific error types using utility
          let errorMessage = t("failedToUpdateUser");

          if (isEmailAlreadyInUseError(error)) {
            errorMessage = t("emailAlreadyInUse");
          } else {
            const extractedMessage = extractErrorMessage(error);
            if (extractedMessage !== "An error occurred") {
              errorMessage = extractedMessage;
            }
          }

          toast({
            title: t("error"),
            description: errorMessage,
            variant: "destructive",
          });
        }
      }

      // Update local state
      handleUsersChange(updatedUsers);

      // Reset form and state
      setEditingUser(null);
      setNewUser({
        fullName: "",
        position: "",
        status: "active",
        roles: [],
        email: "",
        phone: "",
        matricule: "",
        password: "",
        organization: entityName,
      });

      setIsLoading(false);
      setIsAddDialogOpen(false);
    }
  };

  const handleDeleteUser = async (userId: string, backendId?: string) => {
    // Update local state first
    const updatedUsers = users.filter((u) => u.id !== userId);
    handleUsersChange(updatedUsers);

    // If we have an IOB ID and backend ID, delete from backend
    if (iobId && backendId) {
      try {
        const { actorAPI } = await import("@/app/actions/actorAPI");
        await actorAPI.iob.deleteUser(iobId, backendId);

        // Refresh the users list
        await refreshExistingUsers();

        toast({
          title: t("success"),
          description: t("userDeletedSuccessfully"),
        });
      } catch (error) {
        console.error("Failed to delete user:", error);
        toast({
          title: t("error"),
          description: t("failedToDeleteUser"),
          variant: "destructive",
        });
      }
    }
  };

  const userForm = (
    <div className="grid gap-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="fullName">{t("fullName")} *</Label>
          <Input
            id="fullName"
            value={newUser.fullName}
            onChange={(e) =>
              setNewUser({ ...newUser, fullName: e.target.value })
            }
          />
        </div>
        <div>
          <Label htmlFor="position">{t("position")} *</Label>
          <Input
            id="position"
            value={newUser.position}
            onChange={(e) =>
              setNewUser({ ...newUser, position: e.target.value })
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="email">{t("email")}</Label>
          <Input
            id="email"
            type="email"
            value={newUser.email || ""}
            onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          />
        </div>
        <div>
          <Label htmlFor="phone">{t("phone")}</Label>
          <Input
            id="phone"
            value={newUser.phone || ""}
            onChange={(e) => setNewUser({ ...newUser, phone: e.target.value })}
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="matricule">{t("matricule")}</Label>
          <Input
            id="matricule"
            value={newUser.matricule || ""}
            onChange={(e) =>
              setNewUser({ ...newUser, matricule: e.target.value })
            }
          />
        </div>
        <div>
          <Label htmlFor="password">{t("password")}</Label>
          <Input
            id="password"
            type="password"
            value={newUser.password || ""}
            onChange={(e) =>
              setNewUser({ ...newUser, password: e.target.value })
            }
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <div>
          <Label htmlFor="status">{t("status")}</Label>
          <Select
            value={newUser.status}
            onValueChange={(value) => setNewUser({ ...newUser, status: value })}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="active">{t("active")}</SelectItem>
              <SelectItem value="inactive">{t("inactive")}</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <Label>{t("iobRoles")}</Label>
        <RolesAssignment
          selectedRoles={newUser.roles || []}
          onRolesChange={(roles) => setNewUser({ ...newUser, roles })}
          userTypes={["iob"]}
          showTabs={false}
        />
      </div>

      <Button
        onClick={editingUser ? handleUpdateUser : handleAddUser}
        className="w-full"
        disabled={isLoading}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {editingUser ? t("editUser") : t("addUser")}
      </Button>
    </div>
  );

  // Show either existing users or local state users
  const displayUsers =
    isEditMode && existingUsers.length > 0 ? existingUsers : users;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">{t("relatedUsers")}</h3>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              {t("addUser")}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                {editingUser ? t("editUser") : t("addUser")}
              </DialogTitle>
            </DialogHeader>
            {userForm}
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardContent className="p-4">
          {isLoadingUsers ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : displayUsers.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">{t("noUsers")}</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{t("fullName")}</TableHead>
                  <TableHead>{t("position")}</TableHead>
                  <TableHead>{t("email")}</TableHead>
                  <TableHead>{t("status")}</TableHead>
                  <TableHead className="text-right">{t("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {displayUsers.map((user: any) => (
                  <TableRow key={user.id || user.backendId || Math.random()}>
                    <TableCell className="font-medium">
                      {user.fullName || `${user.firstname} ${user.lastname}`}
                    </TableCell>
                    <TableCell>{user.position || user.posteIob}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        {user.status === "active" || user.status === "actif" ? (
                          <CheckCircle className="w-4 h-4 text-green-500 mr-1" />
                        ) : (
                          <XCircle className="w-4 h-4 text-gray-400 mr-1" />
                        )}
                        {user.status === "active" || user.status === "actif"
                          ? "Active"
                          : "Inactive"}
                      </div>
                    </TableCell>
                    <TableCell className="text-right space-x-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          handleEditUser({
                            id: user.id || Date.now().toString(),
                            backendId: user.id || user._id,
                            fullName:
                              user.fullName ||
                              `${user.firstname} ${user.lastname}`,
                            position: user.position || user.posteIob || "",
                            status: user.status || "active",
                            roles: user.roles || user.role || [],
                            email: user.email || "",
                            phone: user.phone || user.telephone || "",
                            matricule:
                              user.matricule || user.matriculeIob || "",
                            password: "",
                            organization: entityName,
                          })
                        }
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="text-red-500 hover:text-red-700"
                        onClick={() =>
                          handleDeleteUser(
                            user.id || Date.now().toString(),
                            user.id || user._id
                          )
                        }
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
