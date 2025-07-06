"use client";

import { useState } from "react";
import { Plus, Edit, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useTranslations } from "next-intl";
import { RelatedUserFormValues, relatedUserSchema } from "./schema";
import { TccRole, getRoleTranslationKey } from "@/lib/types/roles";
import { TCCService } from "@/lib/services/tccService";
import { useToast } from "@/hooks/use-toast";
import { RolesAssignment } from "@/components/RolesAssignment";

interface EnhancedTCCUsersFormProps {
  users: RelatedUserFormValues[];
  onUsersChange: (users: RelatedUserFormValues[]) => void;
  tccId?: string; // TCC ID for immediate user creation
}

const defaultUser: RelatedUserFormValues = {
  fullName: "",
  email: "",
  password: "",
  phone: "",
  position: "",
  roles: [],
  type: "member",
  status: "active",
  matricule: "",
  organization: "",
};

export function EnhancedTCCUsersForm({
  users,
  onUsersChange,
  tccId,
}: EnhancedTCCUsersFormProps) {
  const t = useTranslations("TCCPage");
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<RelatedUserFormValues | null>(
    null
  );
  const [formData, setFormData] = useState<RelatedUserFormValues>(defaultUser);
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  const handleOpenDialog = (user?: RelatedUserFormValues) => {
    if (user) {
      setEditingUser(user);
      setFormData(user);
    } else {
      setEditingUser(null);
      setFormData({ ...defaultUser });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingUser(null);
    setFormData({ ...defaultUser });
  };

  const validateForm = (): boolean => {
    try {
      relatedUserSchema.parse(formData);
      return true;
    } catch (error) {
      console.error("Form validation failed:", error);
      return false;
    }
  };

  const handleSubmitUser = async () => {
    if (!validateForm()) {
      toast({
        title: t("error"),
        description: t("validationError"),
        variant: "destructive",
      });
      return;
    }

    // Check for required fields
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.matricule ||
      !formData.organization
    ) {
      toast({
        title: t("error"),
        description: t("requiredFieldsMissing"),
        variant: "destructive",
      });
      return;
    }

    // Client-side email uniqueness check
    const emailExists = users.some(
      (user) =>
        user.email === formData.email && user.email !== editingUser?.email
    );

    if (emailExists) {
      toast({
        title: t("error"),
        description: t("emailAlreadyInUseLocal"),
        variant: "destructive",
      });
      return;
    }

    // Additional email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      toast({
        title: t("error"),
        description: t("invalidEmailFormat"),
        variant: "destructive",
      });
      return;
    }

    if (editingUser) {
      // Update existing user (just update locally)
      const updatedUsers = users.map((user) =>
        user.email === editingUser.email ? formData : user
      );
      onUsersChange(updatedUsers);

      toast({
        title: t("success"),
        description: t("userUpdatedSuccessfully"),
      });

      handleCloseDialog();
    } else {
      // Create new user immediately if tccId is available
      if (tccId) {
        try {
          setIsCreatingUser(true);

          // Transform form data to API format
          const apiUserData = {
            firstname: formData.fullName.split(" ")[0] || formData.fullName,
            lastname: formData.fullName.split(" ").slice(1).join(" ") || "",
            email: formData.email,
            password: formData.password || "defaultPassword123",
            telephone: formData.phone || "",
            positionTcc: formData.position || "",
            matricule: formData.matricule,
            organisation: formData.organization,
            role: formData.roles || [],
            status: (formData.status === "active" ? "actif" : "inactif") as
              | "actif"
              | "inactif",
          };

          console.log("Creating TCC user immediately:", apiUserData);

          await TCCService.createUser(apiUserData);

          // Add to local list after successful creation
          onUsersChange([...users, formData]);

          toast({
            title: t("success"),
            description: t("userCreatedSuccessfully"),
          });

          handleCloseDialog();
        } catch (error: any) {
          console.error("Failed to create TCC user:", error);
          console.error("Error details:", {
            message: error?.message,
            response: error?.response?.data,
            status: error?.response?.status,
            statusText: error?.response?.statusText,
          });

          // Handle specific email already in use error with multiple checks
          const errorMessage =
            error?.response?.data?.message || error?.message || "";
          const isEmailError =
            errorMessage === "Email already in use" ||
            (errorMessage.toLowerCase().includes("email") &&
              errorMessage.toLowerCase().includes("already")) ||
            (errorMessage.toLowerCase().includes("email") &&
              errorMessage.toLowerCase().includes("use")) ||
            (error?.response?.status === 400 &&
              errorMessage.toLowerCase().includes("email"));

          if (isEmailError) {
            console.log("Detected email already in use error");
            toast({
              title: t("error"),
              description: t("emailAlreadyInUseServer"),
              variant: "destructive",
            });
          } else if (error?.response?.status === 400) {
            // Generic 400 error with validation details
            const displayMessage = errorMessage || t("validationError");
            toast({
              title: t("error"),
              description: displayMessage,
              variant: "destructive",
            });
          } else {
            toast({
              title: t("error"),
              description: t("failedToCreateUser"),
              variant: "destructive",
            });
          }
        } finally {
          setIsCreatingUser(false);
        }
      } else {
        // Just add to local list if no tccId (fallback to old behavior)
        onUsersChange([...users, formData]);

        toast({
          title: t("success"),
          description: t("userAddedToList"),
        });

        handleCloseDialog();
      }
    }
  };

  const handleInputChange = (
    field: keyof RelatedUserFormValues,
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleRolesChange = (roles: string[]) => {
    setFormData((prev) => ({
      ...prev,
      roles,
    }));
  };

  const getRoleDisplayName = (role: string) => {
    try {
      const translationKey = getRoleTranslationKey(role as TccRole);
      return t(translationKey);
    } catch {
      return role;
    }
  };

  const getStatusDisplayName = (status: string) => {
    return status === "active" ? t("active") : t("inactive");
  };

  const getTypeDisplayName = (type: string) => {
    return type === "admin" ? t("admin") : t("member");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>
            {t("users")} ({users.length})
          </span>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <UserPlus className="h-4 w-4 mr-2" />
                {t("addUser")}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>
                  {editingUser ? t("editUser") : t("addUser")}
                </DialogTitle>
                <DialogDescription>
                  {editingUser
                    ? t("editUserDescription")
                    : t("addUserDescription")}
                </DialogDescription>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="fullName">{t("fullName")} *</Label>
                    <Input
                      id="fullName"
                      value={formData.fullName}
                      onChange={(e) =>
                        handleInputChange("fullName", e.target.value)
                      }
                      placeholder={t("enterFullName")}
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">{t("email")} *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) =>
                        handleInputChange("email", e.target.value)
                      }
                      placeholder={t("enterEmail")}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="matricule">{t("matricule")} *</Label>
                    <Input
                      id="matricule"
                      value={formData.matricule}
                      onChange={(e) =>
                        handleInputChange("matricule", e.target.value)
                      }
                      placeholder={t("enterMatricule")}
                    />
                  </div>
                  <div>
                    <Label htmlFor="organization">{t("organization")} *</Label>
                    <Input
                      id="organization"
                      value={formData.organization}
                      onChange={(e) =>
                        handleInputChange("organization", e.target.value)
                      }
                      placeholder={t("enterOrganization")}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="phone">{t("phone")}</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      placeholder={t("enterPhone")}
                    />
                  </div>
                  <div>
                    <Label htmlFor="position">{t("position")}</Label>
                    <Input
                      id="position"
                      value={formData.position}
                      onChange={(e) =>
                        handleInputChange("position", e.target.value)
                      }
                      placeholder={t("enterPosition")}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="password">{t("password")} *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) =>
                        handleInputChange("password", e.target.value)
                      }
                      placeholder={t("enterPassword")}
                    />
                  </div>
                  <div>
                    <Label htmlFor="type">{t("type")}</Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) =>
                        handleInputChange("type", value)
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
                </div>

                <div className="grid grid-cols-1 gap-4">
                  <div>
                    <Label htmlFor="status">{t("status")}</Label>
                    <Select
                      value={formData.status}
                      onValueChange={(value) =>
                        handleInputChange("status", value)
                      }
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
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>{t("tccRoles")}</Label>
                  <RolesAssignment
                    selectedRoles={formData.roles || []}
                    onRolesChange={handleRolesChange}
                    userTypes={["tcc"]}
                    showTabs={false}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleCloseDialog}
                  disabled={isCreatingUser}
                >
                  {t("cancel")}
                </Button>
                <Button
                  type="button"
                  onClick={handleSubmitUser}
                  disabled={isCreatingUser}
                >
                  {isCreatingUser
                    ? t("creatingUser")
                    : editingUser
                    ? t("updateUser")
                    : t("addUser")}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {users.length === 0 ? (
          <div className="text-center py-8">
            <UserPlus className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-800 mb-2">
              {t("noUsers")}
            </h3>
            <p className="text-gray-600 mb-4">{t("addFirstUser")}</p>
            <Button onClick={() => handleOpenDialog()}>
              <Plus className="h-4 w-4 mr-2" />
              {t("addUser")}
            </Button>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>{t("fullName")}</TableHead>
                <TableHead>{t("email")}</TableHead>
                <TableHead>{t("position")}</TableHead>
                <TableHead>{t("roles")}</TableHead>
                <TableHead>{t("type")}</TableHead>
                <TableHead>{t("status")}</TableHead>
                <TableHead className="text-right">{t("actions")}</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">{user.fullName}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.position}</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {user.roles && user.roles.length > 0 ? (
                        user.roles.map((role, roleIndex) => (
                          <Badge key={roleIndex} variant="outline">
                            {getRoleDisplayName(role)}
                          </Badge>
                        ))
                      ) : (
                        <span className="text-gray-500">{t("noRoles")}</span>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={user.type === "admin" ? "default" : "secondary"}
                    >
                      {getTypeDisplayName(user.type)}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.status === "active" ? "default" : "secondary"
                      }
                    >
                      {getStatusDisplayName(user.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleOpenDialog(user)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
