"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { AgencyData } from "@/lib/exportables";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import RelatedUsersTable from "./RelatedUsersTable";
import { type RelatedUser } from "./types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { actorAPI } from "@/app/actions/actorAPI";
import { useFinancialInstitutions } from "@/hooks/useFinancialInstitutions";

// Define the form schema for the agency details with only required fields
const agenceFormSchema = z.object({
  financialInstitutionId: z
    .string()
    .min(1, { message: "Financial Institution is required" }),
  address: z.string().min(1, { message: "Address is required" }),
  code_swift: z.string().min(1, { message: "Code SWIFT/BIC is required" }),
  currency: z.string().default("DZD"),
  code: z.string().min(1, { message: "Code agence is required" }),
  director_name: z.string().min(1, { message: "Director name is required" }),
  director_email: z.string().email({ message: "Invalid director email" }),
  director_phone: z.string().min(1, { message: "Director phone is required" }),
});

type AgenceFormValues = z.infer<typeof agenceFormSchema>;

interface AgenceFormStepsProps {
  mode: "add" | "edit";
  initialData: AgencyData | null;
  onComplete: () => void;
}

export default function AgenceFormSteps({
  mode,
  initialData,
  onComplete,
}: AgenceFormStepsProps) {
  const t = useTranslations("AgencyPage");
  const { toast } = useToast();
  const { institutions, isLoading: loadingFIs } = useFinancialInstitutions();

  const [step, setStep] = useState<1 | 2>(1);
  const [createdAgenceId, setCreatedAgenceId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [relatedUsers, setRelatedUsers] = useState<RelatedUser[]>(
    // Normally we would fetch this from the API based on the agency ID
    initialData
      ? [
          {
            id: "1",
            fullName: "Sagi Salim",
            position: "DG",
            matricule: "M001",
            roles: ["Validator 2"], // Updated to array format
            status: "active",
            organization: "SLIK PIS",
          },
          {
            id: "2",
            fullName: "Gadh Mohamed",
            position: "DFC",
            matricule: "M002",
            roles: ["Validator 1"], // Updated to array format
            status: "active",
            organization: "SLIK PIS",
          },
        ]
      : []
  );

  // Initialize the form with the initial data
  const form = useForm<AgenceFormValues>({
    resolver: zodResolver(agenceFormSchema),
    defaultValues: initialData
      ? {
          financialInstitutionId: "",
          address: initialData.adresseComplete || "",
          code_swift: initialData.codeSwiftBic || "",
          currency: initialData.devise || "DZD",
          code: initialData.agenceCode || "",
          director_name: initialData.directeurNom || "",
          director_email: initialData.directeurEmail || "",
          director_phone: initialData.directeurTelephone || "",
        }
      : {
          financialInstitutionId: "",
          address: "",
          code_swift: "",
          currency: "DZD",
          code: "",
          director_name: "",
          director_email: "",
          director_phone: "",
        },
  });

  // Submit handler for the form
  const onSubmit = async (values: AgenceFormValues) => {
    if (step === 1) {
      // Validate form data
      const validation = agenceFormSchema.safeParse(values);
      if (!validation.success) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields correctly.",
          variant: "destructive",
        });
        return;
      }

      if (mode === "add") {
        // Create the agence first
        setIsSubmitting(true);
        try {
          console.log("Creating Agency with data:", values);
          const response = await actorAPI.agence.create(values);
          const agenceId = response.id || response.data?.id;
          setCreatedAgenceId(agenceId);

          console.log("Agency created successfully:", response);

          toast({
            title: "Success",
            description: "Agency created successfully. Now you can add users.",
          });
          // Move to the next step
          setStep(2);
        } catch (error) {
          console.error("Failed to create agence:", error);
          toast({
            title: "Error",
            description: "Failed to create agency. Please try again.",
            variant: "destructive",
          });
        } finally {
          setIsSubmitting(false);
        }
      } else {
        // For edit mode, just move to next step
        setStep(2);
      }
    } else {
      // Step 2: Handle users
      if (relatedUsers.length > 0 && createdAgenceId) {
        setIsSubmitting(true);
        try {
          // Create users one by one
          for (const user of relatedUsers) {
            const userData = {
              firstname: user.fullName.split(" ")[0] || user.fullName,
              lastname: user.fullName.split(" ").slice(1).join(" ") || "",
              email:
                user.email ||
                `${user.fullName
                  .toLowerCase()
                  .replace(/\s+/g, ".")}@agency.com`,
              password: user.password || "TempPassword123!",
              telephone: user.phone || "",
              positionAgence: user.position,
              matriculeAgence: user.matricule,
              organisationIndividu: user.organization,
              role: user.roles || [],
            };

            await actorAPI.agence.createUser(createdAgenceId, userData);
          }

          toast({
            title: "Success",
            description: `Agency and ${relatedUsers.length} user(s) created successfully!`,
          });
        } catch (error) {
          console.error("Failed to create users:", error);
          toast({
            title: "Warning",
            description:
              "Agency created but some users failed to create. You can add them later.",
            variant: "destructive",
          });
        } finally {
          setIsSubmitting(false);
        }
      }

      // Complete the form
      onComplete();
    }
  };

  const handleUpdateRelatedUsers = (updatedUsers: RelatedUser[]) => {
    setRelatedUsers(updatedUsers);
  };

  return (
    <div className="space-y-8">
      {/* Steps indicator */}
      <div className="flex justify-center mb-8">
        <ol className="flex items-center w-full max-w-3xl">
          <li
            className={cn(
              "flex w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-gray-200 after:border-1 after:hidden sm:after:inline-block after:mx-6 xl:after:mx-10",
              step >= 1 && "text-primary"
            )}
          >
            <span
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full lg:h-10 lg:w-10 shrink-0",
                step === 1
                  ? "bg-primary text-white"
                  : step > 1
                  ? "bg-primary-foreground text-primary border-2 border-primary"
                  : "bg-gray-100 text-gray-600"
              )}
            >
              1
            </span>
            <span className="hidden sm:inline-flex sm:ml-2">
              {t("agencyDetails")}
            </span>
          </li>
          <li className={cn("flex items-center", step >= 2 && "text-primary")}>
            <span
              className={cn(
                "flex items-center justify-center w-8 h-8 rounded-full lg:h-10 lg:w-10 shrink-0",
                step === 2
                  ? "bg-primary text-white"
                  : "bg-gray-100 text-gray-600"
              )}
            >
              2
            </span>
            <span className="hidden sm:inline-flex sm:ml-2">
              {t("relatedUsers")}
            </span>
          </li>
        </ol>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {step === 1 && (
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="financialInstitutionId"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>{t("financialInstitution")}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={loadingFIs}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select financial institution" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {institutions.map((fi) => (
                              <SelectItem key={fi.id} value={fi.id}>
                                {fi.institutionName}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>{t("address")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="code_swift"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("swiftCode")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("agencyCode")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="currency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("currency")}</FormLabel>
                        <FormControl>
                          <Input {...field} defaultValue="DZD" readOnly />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="md:col-span-2">
                    <h3 className="text-lg font-medium mb-4">
                      {t("directorInfo")}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="director_name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("directorName")}</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="director_phone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("directorPhone")}</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="director_email"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>{t("directorEmail")}</FormLabel>
                            <FormControl>
                              <Input {...field} type="email" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card>
              <CardContent className="pt-6 max-h-[70vh] overflow-y-auto">
                <h2 className="text-xl font-semibold mb-4">
                  {t("relatedUsers")}
                </h2>
                <p className="text-gray-600 mb-6">{t("addUsersInstruction")}</p>
                <RelatedUsersTable
                  users={relatedUsers}
                  onUsersChange={handleUpdateRelatedUsers}
                />
              </CardContent>
            </Card>
          )}

          <div className="flex justify-between pt-4">
            {step === 2 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
              >
                {t("previous")}
              </Button>
            )}
            {step === 1 && (
              <div className="ml-auto">
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Creating..." : t("next")}
                </Button>
              </div>
            )}
            {step === 2 && (
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting
                  ? "Creating Users..."
                  : mode === "add"
                  ? t("complete")
                  : t("save")}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
