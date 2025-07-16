"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
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
import { ArrowLeft, User, Loader2 } from "lucide-react";
import { TCC, TCCUser } from "@/lib/types/tcc";
import { useTCC } from "@/hooks/useTCC";

// User schema for form validation
const userSchema = z.object({
  firstname: z.string().min(1, "First name is required"),
  lastname: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email format"),
  password: z.string().optional(),
  telephone: z.string().optional(),
  positionTcc: z.string().optional(),
  matricule: z.string().min(1, "Registration number is required"),
  organisationIndividu: z.string().min(1, "Organization is required"),
  role: z.array(z.string()).min(1, "At least one role is required"),
  status: z.enum(["actif", "inactif"]).default("actif"),
});

type UserFormValues = z.infer<typeof userSchema>;

interface EditUserPageProps {
  params: {
    locale: string;
    userId: string;
  };
}

export default function EditUserPage({ params }: EditUserPageProps) {
  const router = useRouter();
  const t = useTranslations("TCCPage");
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<TCCUser | null>(null);
  const [roles, setRoles] = useState<{ id: string; label: string }[]>([]);

  // TCC data
  const { tcc, fetchTCC } = useTCC();
  const userId = params.userId;

  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      firstname: "",
      lastname: "",
      email: "",
      password: "", // Optional for editing
      telephone: "",
      positionTcc: "",
      matricule: "",
      organisationIndividu: "",
      role: [],
      status: "actif",
    },
  });

  useEffect(() => {
    loadData();
  }, []);

  // Load TCC, user data and roles
  const loadData = async () => {
    try {
      setIsLoading(true);

      // 1. Load TCC to get user data
      const currentTCC = await fetchTCC();
      if (!currentTCC) {
        throw new Error("Failed to load TCC data");
      }

      // 2. Find user in TCC users
      const userData = findUserInTcc(currentTCC, userId);
      if (!userData) {
        throw new Error("User not found");
      }

      // 3. Load roles (using static data for simplicity)
      const rolesData = [
        { id: "1", label: "Admin" },
        { id: "2", label: "Manager" },
        { id: "3", label: "Reader" },
      ];
      setRoles(rolesData);

      // 4. Set user data
      setUser(userData);

      // 5. Initialize form with user data
      form.reset({
        firstname: userData.firstname || "",
        lastname: userData.lastname || "",
        email: userData.email || "",
        password: "", // Don't prefill password
        telephone: userData.telephone || "",
        positionTcc: userData.positionTcc || "",
        matricule: userData.matricule || "",
        organisationIndividu: (userData as any).organisationIndividu || "",
        role: Array.isArray(userData.role) ? userData.role : [],
        status: (userData.status as "actif" | "inactif") || "actif",
      });

      console.log("User data loaded successfully:", userData);
    } catch (error) {
      console.error("Error loading data:", error);
      toast({
        title: t("error"),
        description: t("failedToLoadUserData"),
        variant: "destructive",
      });
      router.push(`/${params.locale}/tcc`);
    } finally {
      setIsLoading(false);
    }
  };

  // Helper function to find user in TCC
  const findUserInTcc = (tcc: TCC, userId: string): TCCUser | null => {
    if (!tcc.users || !Array.isArray(tcc.users)) {
      return null;
    }
    return tcc.users.find((u) => u.id === userId) || null;
  };

  const onSubmit = async (values: UserFormValues) => {
    try {
      setIsSubmitting(true);

      // Prepare user data for update
      const userData = {
        ...values,
        tcc: 1, // Always set TCC ID to 1 since we have a single TCC
      };

      // Only include password if provided
      if (!values.password) {
        delete userData.password;
      }

      // Update the user
      await TCCService.updateUser(userId, userData);

      console.log("User updated successfully:", userData);

      toast({
        title: t("success"),
        description: t("userUpdatedSuccessfully"),
      });

      // Navigate back to the TCC form users page
      router.push(`/${params.locale}/tcc/form/users`);
    } catch (error: any) {
      console.error("Failed to update user:", error);

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
          description: t("failedToUpdateUser"),
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <Button
          variant="outline"
          size="icon"
          onClick={() => router.push(`/${params.locale}/tcc/form/users`)}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-800">{t("editUser")}</h1>
          <p className="text-gray-600">
            {user?.firstname} {user?.lastname}
          </p>
        </div>
      </div>

      {/* User Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
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
                      <FormLabel>{t("newPassword")}</FormLabel>
                      <FormControl>
                        <Input {...field} type="password" />
                      </FormControl>
                      <FormDescription>
                        {t("leaveBlankToKeepCurrent")}
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
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("roles")}</FormLabel>
                        <FormControl>
                          <Select
                            onValueChange={(value) => field.onChange([value])}
                            value={field.value?.[0] || ""}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder={t("selectRole")} />
                            </SelectTrigger>
                            <SelectContent>
                              {roles.map((role) => (
                                <SelectItem key={role.id} value={role.id}>
                                  {role.label}
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
              </div>

              <div className="flex justify-end gap-2 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`/${params.locale}/tcc`)}
                >
                  {t("cancel")}
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? t("updating") : t("updateUser")}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
