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

// Mock data for banks dropdown
const bankOptions = [
  {
    value: "BANQUE DE DEVELOPPEMENT LOCAL",
    label: "BANQUE DE DEVELOPPEMENT LOCAL",
  },
  {
    value: "BANQUE EXTERIEURE D'ALGERIE",
    label: "BANQUE EXTERIEURE D'ALGERIE",
  },
  {
    value: "BANQUE DE L'AGRICULTURE ET DU DÉVELOPPEMENT RURAL",
    label: "BANQUE DE L'AGRICULTURE ET DU DÉVELOPPEMENT RURAL",
  },
  { value: "CREDIT POPULAIRE D'ALGERIE", label: "CREDIT POPULAIRE D'ALGERIE" },
  { value: "BANQUE NATIONALE D'ALGERIE", label: "BANQUE NATIONALE D'ALGERIE" },
  {
    value: "CAISSE NATIONALE D'EPARGNE ET DE PREVOYANCE",
    label: "CAISSE NATIONALE D'EPARGNE ET DE PREVOYANCE",
  },
];

// Define the form schema for the agency details with only required fields
const agenceFormSchema = z.object({
  nomBanque: z.string().min(1, { message: "Nom de la banque is required" }),
  adresseComplete: z
    .string()
    .min(1, { message: "Adresse complète is required" }),
  codeSwiftBic: z.string().min(1, { message: "Code SWIFT/BIC is required" }),
  devise: z.string().default("DZD"),
  agenceCode: z.string().min(1, { message: "Code agence is required" }),
  directeurNom: z.string().min(1, { message: "Nom du directeur is required" }),
  directeurEmail: z.string().email({ message: "Email du directeur invalide" }),
  directeurTelephone: z
    .string()
    .min(1, { message: "Téléphone du directeur is required" }),
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
  const [step, setStep] = useState<1 | 2>(1);
  const [relatedUsers, setRelatedUsers] = useState<RelatedUser[]>(
    // Normally we would fetch this from the API based on the agency ID
    initialData
      ? [
          {
            id: "1",
            fullName: "Sagi Salim",
            position: "DG",
            matricule: "M001",
            role: "Validator 2",
            type: "admin",
            status: "active",
            organization: "SLIK PIS",
          },
          {
            id: "2",
            fullName: "Gadh Mohamed",
            position: "DFC",
            matricule: "M002",
            role: "Validator 1",
            type: "member",
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
          nomBanque: initialData.nomBanque || "",
          adresseComplete: initialData.adresseComplete || "",
          codeSwiftBic: initialData.codeSwiftBic || "",
          devise: initialData.devise || "DZD",
          agenceCode: initialData.agenceCode || "",
          directeurNom: initialData.directeurNom || "",
          directeurEmail: initialData.directeurEmail || "",
          directeurTelephone: initialData.directeurTelephone || "",
        }
      : {
          nomBanque: "",
          adresseComplete: "",
          codeSwiftBic: "",
          devise: "DZD",
          agenceCode: "",
          directeurNom: "",
          directeurEmail: "",
          directeurTelephone: "",
        },
  });

  // Submit handler for the form
  const onSubmit = async (values: AgenceFormValues) => {
    if (step === 1) {
      // Move to the next step
      setStep(2);
    } else {
      // Submit the form with both agency details and related users
      console.log("Submitting form with values:", {
        agence: values,
        relatedUsers,
      });

      // In a real app, you would call your API here

      // Redirect back to the agency list
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
                    name="nomBanque"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>{t("nomBanque")}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner une banque" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {bankOptions.map((option) => (
                              <SelectItem
                                key={option.value}
                                value={option.value}
                              >
                                {option.label}
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
                    name="adresseComplete"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>{t("adresseComplete")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="codeSwiftBic"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("codeSwiftBic")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="agenceCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("codeAgence")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="devise"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("devise")}</FormLabel>
                        <FormControl>
                          <Input {...field} defaultValue="DZD" readOnly />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="md:col-span-2">
                    <h3 className="text-lg font-medium mb-4">
                      {t("directeurAgence")}
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField
                        control={form.control}
                        name="directeurNom"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("directeurNom")}</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="directeurTelephone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>{t("directeurTelephone")}</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="directeurEmail"
                        render={({ field }) => (
                          <FormItem className="md:col-span-2">
                            <FormLabel>{t("directeurEmail")}</FormLabel>
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
                <Button type="submit">{t("next")}</Button>
              </div>
            )}
            {step === 2 && (
              <Button type="submit">
                {mode === "add" ? t("create") : t("save")}
              </Button>
            )}
          </div>
        </form>
      </Form>
    </div>
  );
}
