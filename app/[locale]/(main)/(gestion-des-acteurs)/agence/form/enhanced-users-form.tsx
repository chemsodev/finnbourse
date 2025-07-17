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
import { RelatedUserFormValues, relatedUserFormSchema } from "./schema";
import { AgenceRole, getRoleTranslationKey } from "@/lib/types/roles";
import { AgenceService } from "@/lib/services/agenceService";
import { useToast } from "@/hooks/use-toast";

interface EnhancedAgenceUsersFormProps {
  users: RelatedUserFormValues[];
  onUsersChange: (users: RelatedUserFormValues[]) => void;
  agenceId?: string; // Agency ID for immediate user creation
}

const defaultUser: RelatedUserFormValues = {
  fullName: "",
  email: "",
  password: "",
  phone: "",
  position: "",
  matricule: "",
  organization: "",
  status: "active",
  roles: [],
};

export function EnhancedAgenceUsersForm({
  users,
  onUsersChange,
  agenceId,
}: EnhancedAgenceUsersFormProps) {
  const t = useTranslations("AgencyPage");
  const { toast } = useToast();

  // Helper function to translate role names
  const translateRole = (role: string): string => {
    const translationKey = getRoleTranslationKey(role);
    return t(translationKey);
  };

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<RelatedUserFormValues | null>(
    null
  );
  const [formData, setFormData] = useState<RelatedUserFormValues>(defaultUser);
  const [isCreatingUser, setIsCreatingUser] = useState(false);

  const handleOpenDialog = (user?: RelatedUserFormValues) => {
    if (user) {
      setEditingUser(user);
      setFormData({ ...user });
    } else {
      setEditingUser(null);
      setFormData({ ...defaultUser });
    }
    setIsDialogOpen(true);
  };

  const handleCloseDialog = () => {
    setIsDialogOpen(false);
    setEditingUser(null);
    setFormData(defaultUser);
  };

  const handleSaveUser = async () => {
    // Validate form data using schema
    const validationResult = relatedUserFormSchema.safeParse(formData);

    if (!validationResult.success) {
      // Show validation errors
      const errors = validationResult.error.errors;
      const errorMessages = errors
        .map((err) => `${err.path.join(".")}: ${err.message}`)
        .join("\n");

      toast({
        title: t("validationError"),
        description: errorMessages,
        variant: "destructive",
      });
      return;
    }

    // Check for email conflicts in existing users (except when editing the same user)
    const emailExists = users.some(
      (user) =>
        user.email.toLowerCase() === formData.email.toLowerCase() &&
        (!editingUser || user.email !== editingUser.email)
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
      // Create new user immediately if agenceId is available
      if (agenceId) {
        try {
          setIsCreatingUser(true);

          // Transform form data to API format
          const apiUserData = {
            firstname: formData.fullName.split(" ")[0] || formData.fullName,
            lastname: formData.fullName.split(" ").slice(1).join(" ") || " ", // Ensure lastname always has at least a space character
            email: formData.email,
            password: formData.password,
            telephone: formData.phone || "",
            positionAgence: formData.position || "",
            matriculeAgence: formData.matricule,
            organisationIndividu: formData.organization,
            role: formData.roles.map((role) => {
              // Map any legacy role values to the correct ones
              if (
                role === "agence_client_manager_1" ||
                role === "agence_client_manager_2"
              ) {
                return "agence_client_manager";
              }
              return role;
            }),
            status: (formData.status === "active" ? "actif" : "inactif") as
              | "actif"
              | "inactif",
          };

          console.log("Creating user immediately:", apiUserData);

          await AgenceService.createUser(apiUserData, agenceId);

          // Add to local list after successful creation
          onUsersChange([...users, formData]);

          toast({
            title: t("success"),
            description: t("userCreatedSuccessfully"),
          });

          handleCloseDialog();
        } catch (error: any) {
          console.error("Failed to create user:", error);
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
        // Just add to local list if no agenceId (fallback to old behavior)
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

  const handleRoleChange = (roleValue: string) => {
    const currentRoles = Array.isArray(formData.roles) ? formData.roles : [];
    if (!currentRoles.includes(roleValue)) {
      setFormData((prev) => ({
        ...prev,
        roles: [...currentRoles, roleValue],
      }));
    }
  };

  const removeRole = (roleToRemove: string) => {
    const currentRoles = Array.isArray(formData.roles) ? formData.roles : [];
    setFormData((prev) => ({
      ...prev,
      roles: currentRoles.filter((role) => role !== roleToRemove),
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            {t("relatedUsers")} ({users.length})
          </span>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()} size="sm">
                <Plus className="h-4 w-4 mr-2" />
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    placeholder={t("enterEmail")}
                  />
                </div>

                <div>
                  <Label htmlFor="phone">{t("phoneNumber")}</Label>
                  <Input
                    id="phone"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder={t("enterPhoneNumber")}
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

                <div>
                  <Label htmlFor="matricule">{t("matricule")} *</Label>
                  <Input
                    id="matricule"
                    value={formData.matricule}
                    onChange={(e) =>
                      handleInputChange("matricule", e.target.value)
                    }
                    placeholder={t("enterMatricule")}
                    required
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
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="password">{t("password")}</Label>
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
                      <SelectItem value="inactive">{t("inactive")}</SelectItem>
                      <SelectItem value="pending">{t("pending")}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="roles">{t("roles")}</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {Array.isArray(formData.roles) &&
                      formData.roles.map((role, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="flex items-center gap-1"
                        >
                          {translateRole(role)}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="h-auto p-0 text-xs"
                            onClick={() => removeRole(role)}
                          >
                            ×
                          </Button>
                        </Badge>
                      ))}
                  </div>
                  <Select onValueChange={handleRoleChange}>
                    <SelectTrigger>
                      <SelectValue placeholder={t("addRole")} />
                    </SelectTrigger>
                    <SelectContent>
                      {/* Use only the valid role values accepted by the backend */}
                      <SelectItem
                        key="agence_client_manager"
                        value="agence_client_manager"
                      >
                        {translateRole("agence_client_manager")}
                      </SelectItem>
                      <SelectItem
                        key="order_initializer_agence"
                        value="order_initializer_agence"
                      >
                        {translateRole("order_initializer_agence")}
                      </SelectItem>
                      <SelectItem
                        key="order_validator_agence_1"
                        value="order_validator_agence_1"
                      >
                        {translateRole("order_validator_agence_1")}
                      </SelectItem>
                      <SelectItem
                        key="order_validator_agence_2"
                        value="order_validator_agence_2"
                      >
                        {translateRole("order_validator_agence_2")}
                      </SelectItem>
                      <SelectItem
                        key="order_validator_agence_retour_1"
                        value="order_validator_agence_retour_1"
                      >
                        {translateRole("order_validator_agence_retour_1")}
                      </SelectItem>
                      <SelectItem
                        key="order_validator_agence_retour_2"
                        value="order_validator_agence_retour_2"
                      >
                        {translateRole("order_validator_agence_retour_2")}
                      </SelectItem>
                      <SelectItem
                        key="agence_viewer_order_history"
                        value="agence_viewer_order_history"
                      >
                        {translateRole("agence_viewer_order_history")}
                      </SelectItem>
                      <SelectItem
                        key="agence_gestion_clients"
                        value="agence_gestion_clients"
                      >
                        {translateRole("agence_gestion_clients")}
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={handleCloseDialog}
                  disabled={isCreatingUser}
                >
                  {t("cancel")}
                </Button>
                <Button onClick={handleSaveUser} disabled={isCreatingUser}>
                  {isCreatingUser
                    ? t("creating")
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
              {t("noUsersYet")}
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
                      {Array.isArray(user.roles) &&
                        user.roles.map((role, roleIndex) => (
                          <Badge
                            key={roleIndex}
                            variant="outline"
                            className="text-xs"
                          >
                            {translateRole(role)}
                          </Badge>
                        ))}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        user.status === "active"
                          ? "default"
                          : user.status === "pending"
                          ? "secondary"
                          : "destructive"
                      }
                    >
                      {t(user.status)}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
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
