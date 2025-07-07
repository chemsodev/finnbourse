"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
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
import { RolesAssignment } from "@/components/RolesAssignment";
import { useToast } from "@/hooks/use-toast";
import { useTCC } from "@/hooks/useTCC";
import { useTCCUsers } from "@/hooks/useTCC";
import { useRestToken } from "@/hooks/useRestToken";
import Loading from "@/components/ui/loading";

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

// Define form schema with only available fields for editing
const userSchema = z.object({
  firstname: z.string().min(2, "First name must be at least 2 characters"),
  lastname: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  telephone: z.string().default(""),
  positionTcc: z.string().default(""),
  role: z
    .array(z.enum(VALID_TCC_ROLES as [ValidTCCRole, ...ValidTCCRole[]]))
    .min(1, "At least one role is required"),
  status: z.enum(["actif", "inactif"]),
});

type UserFormValues = z.infer<typeof userSchema>;

export default function EditTCCUserPage({
  params,
}: {
  params: { userId: string; locale: string };
}) {
  const router = useRouter();
  const t = useTranslations("TCCDetailsPage");
  const { toast } = useToast();
  const userId = params.userId;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  // API hooks
  const { tcc, isLoading, fetchTCC } = useTCC();
  const { updateUser } = useTCCUsers();
  const { hasRestToken, isLoading: tokenLoading } = useRestToken();

  // Find the user with the matching ID
  const user = tcc?.users?.find((u) => {
    console.log(
      `🔍 Comparing user ID: ${
        u.id
      } (type: ${typeof u.id}) with URL param: ${userId} (type: ${typeof userId})`
    );
    return String(u.id) === userId;
  });

  console.log("📊 TCC data:", tcc);
  console.log(
    "👥 Available users:",
    tcc?.users?.map((u) => ({ id: u.id, name: `${u.firstname} ${u.lastname}` }))
  );
  console.log("🎯 Looking for user ID:", userId);
  console.log("👤 Found user:", user);

  // Default form values
  const defaultValues: Partial<UserFormValues> = {
    firstname: "",
    lastname: "",
    email: "",
    telephone: "",
    positionTcc: "",
    role: [], // Empty array initially
    status: "actif",
  };

  // Create form
  const form = useForm<UserFormValues>({
    resolver: zodResolver(userSchema),
    defaultValues,
  });

  // Load TCC data when token is available
  useEffect(() => {
    const loadData = async () => {
      if (hasRestToken && !tokenLoading) {
        console.log("🔄 Loading TCC data for user edit page...");
        try {
          await fetchTCC();
          console.log("✅ TCC data loaded successfully");
        } catch (error) {
          console.error("❌ Failed to load TCC data:", error);
        }
      } else {
        console.log("⏳ Waiting for token...", { hasRestToken, tokenLoading });
      }
    };

    loadData();

    // Set timeout for loading
    const timeout = setTimeout(() => {
      if (isLoading) {
        setLoadingTimeout(true);
      }
    }, 10000); // 10 seconds timeout

    return () => clearTimeout(timeout);
  }, [hasRestToken, tokenLoading]);

  // Load user data when found
  useEffect(() => {
    if (user && tcc) {
      console.log("👤 User found, loading user data:", user);
      console.log("🔧 Current form values before reset:", form.getValues());

      // Convert user roles to array if needed and ensure proper typing
      const userRoles = (
        Array.isArray(user.role) ? user.role : [user.role]
      ).filter((role): role is ValidTCCRole =>
        VALID_TCC_ROLES.includes(role as ValidTCCRole)
      );

      const formData = {
        firstname: user.firstname || "",
        lastname: user.lastname || "",
        email: user.email || "",
        telephone: user.telephone || "",
        positionTcc: user.positionTcc || "",
        role: userRoles,
        status: user.status as "actif" | "inactif",
      };

      console.log("📝 Setting form data:", formData);

      form.reset(formData);

      // Force form to update by setting individual fields
      setTimeout(() => {
        form.setValue("firstname", user.firstname || "");
        form.setValue("lastname", user.lastname || "");
        form.setValue("email", user.email || "");
        form.setValue("telephone", user.telephone || "");
        form.setValue("positionTcc", user.positionTcc || "");
        form.setValue("role", userRoles);
        form.setValue("status", user.status as "actif" | "inactif");
        console.log("🔧 Form values after manual set:", form.getValues());
      }, 100);
    } else if (tcc && !isLoading && !user) {
      console.log(
        "❌ User not found in TCC data. Available users:",
        tcc.users?.map((u) => ({
          id: u.id,
          name: `${u.firstname} ${u.lastname}`,
        }))
      );
    }
  }, [form, user, tcc, isLoading]);

  // Form submission handler
  const onSubmit = async (values: UserFormValues) => {
    if (isSubmitting) return;

    setIsSubmitting(true);
    try {
      console.log("Updating user:", values);

      // Call API to update user (values already contains only the allowed fields)
      await updateUser(userId, values);

      toast({
        title: t("success"),
        description: t("userUpdatedSuccessfully"),
      });

      // Navigate back to users list
      router.push(`/${params.locale}/tcc/users`);
    } catch (error) {
      console.error("Failed to update user:", error);
      toast({
        title: t("error"),
        description: t("failedToUpdateUser"),
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Loading state
  if (tokenLoading) {
    console.log("⏳ Token loading...");
    return <Loading />;
  }

  if (!hasRestToken) {
    console.log("⚠️ No token available");
    return (
      <div className="container mx-auto py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 max-w-2xl mx-auto text-center">
          <p className="text-gray-600">
            Authentication required. Please refresh the page.
          </p>
          <Button className="mt-4" onClick={() => window.location.reload()}>
            Refresh Page
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading && !loadingTimeout) {
    console.log("⏳ TCC data loading...");
    return <Loading />;
  }
  if (loadingTimeout) {
    return (
      <div className="container mx-auto py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 max-w-2xl mx-auto text-center">
          <p className="text-gray-600">
            Loading is taking longer than expected.
          </p>
          <Button
            className="mt-4"
            onClick={() => router.push(`/${params.locale}/tcc/users`)}
          >
            Go to Users List
          </Button>
        </div>
      </div>
    );
  }

  // If we have loaded but no TCC data at all
  if (!isLoading && !tcc && hasRestToken && !tokenLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="bg-white rounded-lg shadow-sm p-6 max-w-2xl mx-auto text-center">
          <p className="text-gray-600">
            No TCC data found. Please check your permissions or contact an
            administrator.
          </p>
          <Button
            className="mt-4"
            onClick={() => router.push(`/${params.locale}/tcc/users`)}
          >
            Go to Users List
          </Button>
        </div>
      </div>
    );
  }

  // If we have data but no user found
  if (tcc && !user) {
    console.log("❌ User not found in TCC data");
    // Don't show loading, show user not found
  }

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
        <h1 className="text-2xl font-bold">
          {user ? t("editUser") : t("userNotFound")}
        </h1>
        {!user && tcc && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
          >
            Refresh
          </Button>
        )}
      </div>

      {!user && tcc && (
        <div className="bg-white rounded-lg shadow-sm p-6 max-w-2xl mx-auto">
          <div className="text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {t("userNotFound")}
            </h2>
            <p className="text-gray-600 mb-6">
              The user with ID {userId} was not found in the TCC.
            </p>
            <div className="flex justify-center gap-4">
              <Button
                variant="outline"
                onClick={() => router.push(`/${params.locale}/tcc/users`)}
              >
                {t("backToUsers")}
              </Button>
              <Button
                onClick={() =>
                  router.push(`/${params.locale}/tcc/form/users/add`)
                }
              >
                {t("addUser")}
              </Button>
            </div>
          </div>
        </div>
      )}

      {user && (
        <div className="bg-white rounded-lg shadow-sm p-6 max-w-2xl mx-auto">
          <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Note:</strong> To change the user's password, please use
              the user management system or contact an administrator.
            </p>
          </div>

          {/* Debug info */}
          <div className="mb-4 p-2 bg-gray-50 border rounded text-xs">
            <strong>Debug:</strong> Editing user {user.firstname}{" "}
            {user.lastname} (ID: {user.id})
            <br />
            <strong>Roles:</strong>{" "}
            {Array.isArray(user.role) ? user.role.join(", ") : user.role}
            <br />
            <strong>Status:</strong> {user.status}
          </div>

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
              </div>

              <div className="flex justify-end gap-2 pt-8 mt-8 border-t">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`/${params.locale}/tcc/users`)}
                  disabled={isSubmitting}
                >
                  {t("cancel")}
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? t("saving") : t("save")}
                </Button>
              </div>
            </form>
          </Form>
        </div>
      )}
    </div>
  );
}
