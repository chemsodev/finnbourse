"use client";

import { useState } from "react";
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
import { TCC_USER_ROLES } from "@/lib/types/tcc";

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
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string(),
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
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type UserFormValues = z.infer<typeof userSchema>;

interface AddTCCUserPageProps {
  params: {
    id: string;
    locale: string;
  };
}

export default function AddTCCUserPage({ params }: AddTCCUserPageProps) {
  const router = useRouter();
  const t = useTranslations("TCCPage");
  const { toast } = useToast();
  const { createUser } = useTCCUsers();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const tccId = params.id;

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

  const onSubmit = async (values: UserFormValues) => {
    try {
      setIsSubmitting(true);

      // Transform form data to API format
      const userData = {
        firstname: values.firstname,
        lastname: values.lastname,
        email: values.email,
        password: values.password,
        telephone: values.telephone || "",
        positionTcc: values.positionTcc || "",
        matricule: values.matricule,
        organisation: values.organisation,
        role: values.role,
        status: values.status,
      };

      // Create the user
      await TCCService.createUser(userData, tccId);

      toast({
        title: t("success"),
        description: t("userCreatedSuccessfully"),
      });

      // Navigate back to users list
      router.push(`/${params.locale}/tcc/${tccId}/users`);
    } catch (error: any) {
      console.error("Failed to create user:", error);

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
          description: t("failedToCreateUser"),
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

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
        <h1 className="text-3xl font-bold text-gray-800">{t("addUser")}</h1>
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
                      <FormLabel>{t("password")}</FormLabel>
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
                      </FormControl>
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
                {isSubmitting ? t("creating") : t("save")}
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
