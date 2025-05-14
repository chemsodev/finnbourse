"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Sample TCC user data
const tccUsers = [
  {
    id: 1,
    fullName: "John Doe",
    email: "john.doe@example.com",
    position: "Manager",
    role: "initiator",
    type: "admin",
    status: "active",
    phone: "123-456-7890",
    password: "securePassword1",
  },
  {
    id: 2,
    fullName: "Jane Smith",
    email: "jane.smith@example.com",
    position: "Analyst",
    role: "validateur 1",
    type: "member",
    status: "active",
    phone: "123-456-7891",
    password: "securePassword2",
  },
  {
    id: 3,
    fullName: "Ahmed Hassan",
    email: "ahmed.hassan@example.com",
    position: "Supervisor",
    role: "initiator",
    type: "admin",
    status: "active",
    phone: "123-456-7892",
    password: "securePassword3",
  },
];

// User schema without password requirements for editing
const userSchema = z
  .object({
    fullName: z.string().min(2, {
      message: "Full name must be at least 2 characters.",
    }),
    email: z.string().email({
      message: "Please enter a valid email address.",
    }),
    phone: z.string().min(10, {
      message: "Phone number must be at least 10 characters.",
    }),
    position: z.string().min(2, {
      message: "Position must be at least 2 characters.",
    }),
    role: z.enum(["initiator", "validateur 1", "validateur 2"]),
    type: z.enum(["admin", "member"]),
    status: z.enum(["active", "inactive"]),
    password: z.string().min(8, {
      message: "Password must be at least 8 characters.",
    }),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords don't match",
    path: ["confirmPassword"],
  });

type UserFormValues = z.infer<typeof userSchema>;

export default function EditTCCUserPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const t = useTranslations("TCCDetailsPage");
  const userId = parseInt(params.id);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Find the user with the matching ID
  const user = tccUsers.find((u) => u.id === userId);

  // Default form values
  const defaultValues: Partial<UserFormValues> = {
    fullName: "",
    email: "",
    phone: "",
    position: "",
    role: "initiator",
    type: "member",
    status: "active",
    password: "",
    confirmPassword: "",
  };

  // Create form
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues,
  });

  // Load user data when found
  useEffect(() => {
    if (user) {
      form.reset({
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        position: user.position,
        role: user.role as "initiator" | "validateur 1" | "validateur 2",
        type: user.type as "admin" | "member",
        status: user.status as "active" | "inactive",
        password: user.password,
        confirmPassword: user.password,
      });
    }
  }, [user, form]);

  const onSubmit = (values: UserFormValues) => {
    // In a real app, you would save this data to your backend
    console.log(values);

    // Navigate back to users list
    router.push("/tcc");
  };

  // Show loading or not found state
  if (!user) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">{t("userNotFound")}</h1>
            <Button onClick={() => router.push("/tcc")}>
              {t("backToList")}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="flex items-center gap-4 mb-8 bg-slate-100 p-4 rounded-md">
        <Button variant="outline" size="sm" onClick={() => router.push("/tcc")}>
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
                name="phone"
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
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("role")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("selectRole")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="initiator">
                          {t("initiator")}
                        </SelectItem>
                        <SelectItem value="validateur 1">
                          {t("validator1")}
                        </SelectItem>
                        <SelectItem value="validateur 2">
                          {t("validator2")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("type")}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("selectType")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="admin">{t("admin")}</SelectItem>
                        <SelectItem value="member">{t("member")}</SelectItem>
                      </SelectContent>
                    </Select>
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
                        <SelectItem value="active">{t("active")}</SelectItem>
                        <SelectItem value="inactive">
                          {t("inactive")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
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
            </div>

            <div className="flex justify-end gap-2 pt-8 mt-8 border-t">
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push("/tcc")}
              >
                {t("cancel")}
              </Button>
              <Button type="submit">{t("save")}</Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
