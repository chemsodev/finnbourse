"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
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
import { Input } from "@/components/ui/input";
import { useTranslations } from "next-intl";
import { useToast } from "@/hooks/use-toast";
import { TCCService } from "@/lib/services/tccService";
import { useTCCUsers } from "@/hooks/useTCC";
import { TCCUser, TCC_USER_ROLES } from "@/lib/types/tcc";

// Form schema
const userSchema = z
  .object({
    firstname: z.string().min(2, {
      message: "First name must be at least 2 characters.",
    }),
    lastname: z.string().min(2, {
      message: "Last name must be at least 2 characters.",
    }),
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    password: z.string().optional(),
    confirmPassword: z.string().optional(),
    telephone: z
      .string()
      .min(10, {
        message: "Phone number must be at least 10 characters.",
      })
      .optional(),
    positionTcc: z.string().min(2, {
      message: "Position must be at least 2 characters.",
    }),
    matricule: z.string().min(1, {
      message: "Matricule is required.",
    }),
    organisation: z.string().min(1, {
      message: "Organization is required.",
    }),
    role: z.array(z.string()).min(1, {
      message: "At least one role must be selected.",
    }),
    status: z.enum(["actif", "inactif"]),
  })
  .refine((data) => !data.password || data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type UserFormValues = z.infer<typeof userSchema>;

interface EditTCCUserPageProps {
  params: {
    id: string;
    userId: string;
    locale: string;
  };
}

export default function EditTCCUserPage({ params }: EditTCCUserPageProps) {
  const router = useRouter();
  const t = useTranslations("TCCDetailsPage");
  const { toast } = useToast();
  const { updateUser } = useTCCUsers();
  const [user, setUser] = useState<TCCUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const tccId = params.id;
  const userId = params.userId;

  // Default form values
  const defaultValues: Partial<UserFormValues> = {
    firstname: "",
    lastname: "",
    email: "",
    password: "",
    confirmPassword: "",
    telephone: "",
    positionTcc: "",
    matricule: "",
    organisation: "",
    role: [],
    status: "actif",
  };

  // Create form
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues,
  });

  // Load user data
  useEffect(() => {
    async function loadUser() {
      try {
        setIsLoading(true);
        // Get all users and find the specific user by ID
        const users = await TCCService.getUsers(tccId);
        const userData = users.find((user) => user.id === userId);

        if (!userData) {
          throw new Error("User not found");
        }

        setUser(userData);

        // Prepare form data directly from the API response
        const formData = {
          firstname: userData.firstname || "",
          lastname: userData.lastname || "",
          email: userData.email || "",
          telephone: userData.telephone || "",
          positionTcc: userData.positionTcc || "",
          matricule: userData.matricule || "",
          organisation: userData.organisation || "",
          role: userData.role || [],
          status: userData.status || "actif",
          password: "",
          confirmPassword: "",
        };

        // Reset form with user data
        form.reset(formData);
      } catch (error) {
        console.error("Failed to load user:", error);
        toast({
          title: t("error"),
          description: t("failedToLoadUser"),
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();
  }, [form, tccId, userId, toast, t]);

  const onSubmit = async (values: UserFormValues) => {
    try {
      setIsSubmitting(true);

      // Transform form data to API format
      const userData = {
        firstname: values.firstname,
        lastname: values.lastname,
        email: values.email,
        telephone: values.telephone || "",
        positionTcc: values.positionTcc || "",
        matricule: values.matricule,
        organisation: values.organisation,
        role: values.role,
        status: values.status,
      };

      // Only include password if provided
      if (values.password) {
        Object.assign(userData, { password: values.password });
      }

      // Update the user
      await TCCService.updateUser(userId, userData, tccId);

      toast({
        title: t("success"),
        description: t("userUpdatedSuccessfully"),
      });

      // Navigate back to users list
      router.push(`/${params.locale}/tcc/${tccId}/users`);
    } catch (error: any) {
      console.error("Failed to update user:", error);

      // Handle specific email already in use error
      const errorMessage =
        error?.response?.data?.message || error?.message || "";
      const isEmailError =
        errorMessage === "Email already in use" ||
        (errorMessage.toLowerCase().includes("email") &&
          errorMessage.toLowerCase().includes("already")) ||
        (errorMessage.toLowerCase().includes("email") &&
          errorMessage.toLowerCase().includes("use"));

      if (isEmailError) {
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

  // Show loading state
  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-center items-center h-64">
          <p className="text-gray-500">{t("loadingUser")}</p>
        </div>
      </div>
    );
  }

  // Show error if user not found
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              {t("userNotFound")}
            </h2>
            <p className="text-gray-500 mb-4">{t("userNotFoundDescription")}</p>
            <Button onClick={() => router.push(`/tcc/${tccId}/users`)}>
              {t("backToUsers")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center gap-4 mb-8 bg-slate-100 p-4 rounded-md">
        <Button
          variant="outline"
          size="sm"
          onClick={() => router.push(`/tcc/${tccId}/users`)}
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          {t("back")}
        </Button>
        <h1 className="text-3xl font-bold text-gray-800">{t("editUser")}</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 max-w-2xl mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel>
                        {t("password")} ({t("leaveBlankToKeep")})
                      </FormLabel>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <FormControl>
                      <Input
                        {...field}
                        type={showPassword ? "text" : "password"}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <div className="flex justify-between items-center">
                      <FormLabel>{t("confirmPassword")}</FormLabel>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    <FormControl>
                      <Input
                        {...field}
                        type={showConfirmPassword ? "text" : "password"}
                      />
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
                    <FormLabel>{t("phone")}</FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="positionTcc"
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

              <FormField
                control={form.control}
                name="organisation"
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
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormLabel>{t("roles")}</FormLabel>
                    <div className="flex flex-wrap gap-2">
                      {TCC_USER_ROLES.map((role) => (
                        <Button
                          key={role}
                          type="button"
                          variant={
                            field.value.includes(role) ? "default" : "outline"
                          }
                          size="sm"
                          onClick={() => {
                            if (field.value.includes(role)) {
                              field.onChange(
                                field.value.filter((r) => r !== role)
                              );
                            } else {
                              field.onChange([...field.value, role]);
                            }
                          }}
                        >
                          {t(`roles.${role}`)}
                        </Button>
                      ))}
                    </div>
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
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("selectStatus")} />
                        </SelectTrigger>
                      </FormControl>{" "}
                      <SelectContent>
                        <SelectItem value="actif">{t("active")}</SelectItem>
                        <SelectItem value="inactif">{t("inactive")}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex justify-end gap-2 pt-8 mt-8 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  router.push(`/${params.locale}/tcc/${tccId}/users`)
                }
              >
                {t("cancel")}
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? t("updating") : t("save")}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
