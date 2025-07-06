"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TCC_ROLES } from "@/lib/roles";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from "next-intl";
import { TCCService } from "@/lib/services/tccService";
import { ArrowLeft, Eye, EyeOff, UserPlus } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";

// Valid role type
export type TCCUserRole =
  | "client_account_manager_1"
  | "client_account_manager_2"
  | "order_validator_tcc_1"
  | "order_validator_tcc_2"
  | "order_extern_initializer"
  | "client_account_extern_manager"
  | "observateur_tcc"
  | "tcc_admin"
  | "finbourse_super_admin";

// User schema for form validation
export const userSchema = z.object({
  firstname: z.string().min(1, "First name is required"),
  lastname: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  telephone: z.string().optional(),
  positionTcc: z.string().optional(),
  matricule: z.string().min(1, "Registration number is required"),
  organisationIndividu: z.string().min(1, "Organization is required"),
  role: z
    .array(
      z.enum([
        "client_account_manager_1",
        "client_account_manager_2",
        "order_validator_tcc_1",
        "order_validator_tcc_2",
        "order_extern_initializer",
        "client_account_extern_manager",
        "observateur_tcc",
        "tcc_admin",
        "finbourse_super_admin",
      ])
    )
    .min(1, "At least one role is required"),
  status: z.enum(["actif", "inactif"]).default("actif"),
});

export type UserFormValues = z.infer<typeof userSchema>;

interface UserFormProps {
  initialValues?: Partial<UserFormValues>;
  userId?: string;
  isEditMode: boolean;
  locale: string;
}

export default function UserForm({
  initialValues,
  userId,
  isEditMode,
  locale,
}: UserFormProps) {
  const router = useRouter();
  const t = useTranslations("TCCPage");
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [roles, setRoles] = useState<{ id: TCCUserRole; label: string }[]>([]);
  const [showPassword, setShowPassword] = useState(false);

  const defaultValues: Partial<UserFormValues> = {
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    telephone: "",
    positionTcc: "",
    matricule: "",
    organisationIndividu: "",
    role: [],
    status: "actif",
    ...initialValues,
  };

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues,
  });

  // Load roles on component mount
  useEffect(() => {
    loadRoles();
  }, []);

  const loadRoles = async () => {
    try {
      // Map TCC_ROLES to the format expected by the component
      setRoles(
        TCC_ROLES.map((role) => ({
          id: role.id as TCCUserRole,
          label: role.label,
        }))
      );
    } catch (error) {
      console.error("Error loading roles:", error);
      toast({
        title: t("error"),
        description: t("failedToLoadRoles"),
        variant: "destructive",
      });
    }
  };

  const onSubmit = async (values: UserFormValues) => {
    try {
      setIsSubmitting(true);

      // Prepare user data - ensure we have all required fields for the API
      const userData = {
        ...values,
        tcc: 1, // Always set TCC ID to 1 since we have a single TCC
        // Ensure optional fields are included with empty strings if undefined
        telephone: values.telephone || "",
        positionTcc: values.positionTcc || "",
      };

      if (isEditMode && userId) {
        // Update existing user
        await TCCService.updateUser(userId, userData);

        toast({
          title: t("success"),
          description: t("userUpdatedSuccessfully"),
        });
      } else {
        // Create new user
        await TCCService.createUser(userData);

        toast({
          title: t("success"),
          description: t("userCreatedSuccessfully"),
        });
      }

      // Navigate back to main TCC page (users tab)
      router.push(`/${locale}/tcc`);
    } catch (error: any) {
      console.error(
        `Failed to ${isEditMode ? "update" : "create"} user:`,
        error
      );

      // Check for specific error types
      if (error.response?.status === 400) {
        const errorMessage =
          error.response?.data?.message || t("validationError");
        toast({
          title: t("error"),
          description: errorMessage,
          variant: "destructive",
        });
      } else if (error.response?.status === 409) {
        toast({
          title: t("error"),
          description: t("emailAlreadyInUse"),
          variant: "destructive",
        });
      } else {
        toast({
          title: t("error"),
          description: isEditMode
            ? t("failedToUpdateUser")
            : t("failedToCreateUser"),
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.push(`/${locale}/tcc`)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-800">
            {isEditMode ? t("editUser") : t("addNewUser")}
          </h1>
          <p className="text-gray-600">
            {isEditMode ? t("editUserDescription") : t("createUserDescription")}
          </p>
        </div>
      </div>

      {/* User Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            {t("userDetails")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">
                  {t("personalInformation")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("firstName")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="lastname"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("lastName")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("email")}</FormLabel>
                        <FormControl>
                          <Input {...field} type="email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="telephone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("phoneNumber")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("password")}</FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            className="absolute right-0 top-0 h-full px-3"
                            onClick={() => setShowPassword(!showPassword)}
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </FormControl>
                      <FormDescription>
                        {t("passwordRequirements")}
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Professional Information */}
              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-medium">
                  {t("professionalInformation")}
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="positionTcc"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("position")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="matricule"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("matricule")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="organisationIndividu"
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
              </div>

              {/* Account Settings */}
              <div className="space-y-4 pt-4 border-t">
                <h3 className="text-lg font-medium">{t("accountSettings")}</h3>

                {/* Roles - Multi-select with checkboxes */}
                <FormField
                  control={form.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("roles")}</FormLabel>
                      <div className="space-y-2">
                        {roles.map((role) => (
                          <div
                            key={role.id}
                            className="flex items-center space-x-2"
                          >
                            <Checkbox
                              id={`role-${role.id}`}
                              checked={field.value?.includes(role.id)}
                              onCheckedChange={(checked) => {
                                const updatedRoles = checked
                                  ? [...(field.value || []), role.id]
                                  : (field.value || []).filter(
                                      (id) => id !== role.id
                                    );
                                field.onChange(updatedRoles);
                              }}
                            />
                            <label
                              htmlFor={`role-${role.id}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {role.label}
                            </label>
                          </div>
                        ))}
                      </div>
                      {!field.value?.length && (
                        <p className="text-xs text-destructive">
                          {t("atLeastOneRoleRequired")}
                        </p>
                      )}
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("status")}</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder={t("selectStatus")} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="actif">{t("active")}</SelectItem>
                          <SelectItem value="inactif">
                            {t("inactive")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* Form Actions */}
              <div className="flex justify-end space-x-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`/${locale}/tcc`)}
                  disabled={isSubmitting}
                >
                  {t("cancel")}
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting
                    ? t("saving")
                    : isEditMode
                    ? t("updateUser")
                    : t("createUser")}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
