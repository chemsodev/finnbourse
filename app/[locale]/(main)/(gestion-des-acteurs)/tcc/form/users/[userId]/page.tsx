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
import { TCCService } from "@/lib/services/tccService";
import { useRestToken } from "@/hooks/useRestToken";
import Loading from "@/components/ui/loading";

// Define the valid TCC role types
type ValidTCCRole =
  | "order_validator_tcc_1"
  | "order_validator_tcc_2"
  | "tcc_viewer_order_history"
  | "order_validator_tcc_retour_1"
  | "order_validator_tcc_retour_2"
  | "tcc_gestion_emetteurs"
  | "tcc_gestion_titres"
  | "tcc_gestion_clients"
  | "finbourse_super_admin";

const VALID_TCC_ROLES: ValidTCCRole[] = [
  "order_validator_tcc_1",
  "order_validator_tcc_2",
  "tcc_viewer_order_history",
  "order_validator_tcc_retour_1",
  "order_validator_tcc_retour_2",
  "tcc_gestion_emetteurs",
  "tcc_gestion_titres",
  "tcc_gestion_clients",
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
  const [isLoadingUser, setIsLoadingUser] = useState(true);
  const [loadingTimeout, setLoadingTimeout] = useState(false);

  // API hooks
  const { updateUser } = useTCCUsers();
  const { hasRestToken, isLoading: tokenLoading } = useRestToken();

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
        console.log("🔄 Loading user data for edit page...");
        try {
          // Load user data directly using the new getUser method
          const userData = await TCCService.getUser(userId);
          console.log("✅ User data loaded successfully:", userData);

          // Set form values from loaded user data
          const userRoles = (
            Array.isArray(userData.role) ? userData.role : [userData.role]
          ).filter((role: any): role is ValidTCCRole =>
            VALID_TCC_ROLES.includes(role as ValidTCCRole)
          );

          const formData = {
            firstname: userData.firstname || "",
            lastname: userData.lastname || "",
            email: userData.email || "",
            telephone: userData.telephone || "",
            positionTcc: userData.positionTcc || "",
            role: userRoles,
            status: userData.status as "actif" | "inactif",
          };

          console.log("📝 Setting form data:", formData);
          form.reset(formData);

          console.log("✅ User edit form loaded successfully");
          setIsLoadingUser(false);
        } catch (error) {
          console.error("❌ Failed to load user data:", error);
          toast({
            title: t("error"),
            description: t("failedToLoadUser"),
            variant: "destructive",
          });
          setIsLoadingUser(false);
          // Navigate back if user not found
          router.push(`/${params.locale}/tcc`);
        }
      } else {
        console.log("⏳ Waiting for token...", { hasRestToken, tokenLoading });
      }
    };

    loadData();

    // Set timeout for loading
    const timeout = setTimeout(() => {
      if (isLoadingUser) {
        setLoadingTimeout(true);
        setIsLoadingUser(false);
      }
    }, 10000); // 10 seconds timeout

    return () => clearTimeout(timeout);
  }, [
    hasRestToken,
    tokenLoading,
    userId,
    form,
    router,
    params.locale,
    t,
    toast,
  ]);

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

  if (isLoadingUser && !loadingTimeout) {
    console.log("⏳ User data loading...");
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
        <h1 className="text-2xl font-bold">{t("editUser")}</h1>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6 max-w-2xl mx-auto">
        <div className="mb-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            <strong>Note:</strong> To change the user's password, please use the
            user management system or contact an administrator.
          </p>
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
                        <SelectItem value="inactif">{t("inactive")}</SelectItem>
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
    </div>
  );
}
