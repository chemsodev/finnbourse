"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, EyeOff, UserPlus } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { RolesAssignment } from "@/components/RolesAssignment";
import { useToast } from "@/hooks/use-toast";
import { useTCC } from "@/hooks/useTCC";

// Define the valid TCC role types
type ValidTCCRole =
  | "client_account_manager_1"
  | "client_account_manager_2"
  | "order_validator_tcc_1"
  | "order_validator_tcc_2"
  | "order_extern_initializer"
  | "client_account_extern_manager"
  | "observateur_tcc"
  | "tcc_admin"
  | "finbourse_super_admin";

const VALID_TCC_ROLES: ValidTCCRole[] = [
  "client_account_manager_1",
  "client_account_manager_2",
  "order_validator_tcc_1",
  "order_validator_tcc_2",
  "order_extern_initializer",
  "client_account_extern_manager",
  "observateur_tcc",
  "tcc_admin",
  "finbourse_super_admin",
];

// Define form schema for adding new user
const userSchema = z
  .object({
    firstname: z.string().min(2, "First name must be at least 2 characters"),
    lastname: z.string().min(2, "Last name must be at least 2 characters"),
    email: z.string().email("Invalid email address"),
    telephone: z.string().optional(),
    positionTcc: z.string().optional(),
    role: z
      .array(z.enum(VALID_TCC_ROLES as [ValidTCCRole, ...ValidTCCRole[]]))
      .min(1, "At least one role is required"),
    status: z.enum(["actif", "inactif"]),
    password: z
      .string()
      .min(8, "Password must be at least 8 characters")
      .refine(
        (password) => {
          return /[A-Z]/.test(password) && /[0-9]/.test(password);
        },
        {
          message:
            "Password must include at least one uppercase letter and one number",
        }
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type UserFormValues = z.infer<typeof userSchema>;

export default function AddTCCUserPage({
  params,
}: {
  params: { locale: string };
}) {
  const router = useRouter();
  const t = useTranslations("TCCDetailsPage");
  const { toast } = useToast();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // API hooks
  const { addTCCUser } = useTCC();

  // Default form values
  const defaultValues: Partial<UserFormValues> = {
    firstname: "",
    lastname: "",
    email: "",
    telephone: "",
    positionTcc: "",
    role: [],
    status: "actif",
    password: "",
    confirmPassword: "",
  };

  // Create form
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues,
  });

  // Form submission handler
  const onSubmit = async (values: UserFormValues) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      console.log("Adding new user:", values);

      // Prepare user data for API (exclude confirmPassword)
      const { confirmPassword, ...userData } = values;

      // Call API to add user
      await addTCCUser(userData);

      toast({
        title: t("success"),
        description: t("userAddedSuccessfully"),
      });

      // Navigate back to TCC page
      router.push(`/${params.locale}/tcc`);
    } catch (error) {
      console.error("Failed to add user:", error);
      toast({
        title: t("error"),
        description: t("failedToAddUser"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-8">
      <div className="mb-6 flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => router.back()}
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <h1 className="text-2xl font-bold">{t("addUser")}</h1>
      </div>

      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            {t("userDetails")}
          </CardTitle>
        </CardHeader>
        <CardContent>
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
                          <SelectItem value="inactif">
                            {t("inactive")}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="col-span-2">
                  <FormField
                    control={form.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("role")}</FormLabel>
                        <div className="mt-2">
                          <RolesAssignment
                            selectedRoles={field.value || []}
                            onRolesChange={field.onChange}
                            userTypes={["tcc"]}
                            showTabs={false}
                          />
                        </div>
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
              </div>

              <div className="flex justify-end gap-2 pt-8 mt-8 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`/${params.locale}/tcc`)}
                  disabled={isSubmitting}
                >
                  {t("cancel")}
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? t("adding") : t("addUser")}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
