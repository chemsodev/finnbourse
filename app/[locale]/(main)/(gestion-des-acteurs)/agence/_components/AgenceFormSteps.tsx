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

// Define the form schema for the agency details
const agenceFormSchema = z.object({
  codeBanque: z.string().optional(),
  agenceCode: z.string().min(1, { message: "Code agence is required" }),
  libAgence: z.string().min(1, { message: "Libellé agence is required" }),
  codeVille: z.string().optional(),
  regionAgence: z.string().optional(),
  codeBC: z.string().optional(),
  ordreDe: z.string().optional(),
  parDefault: z.string().optional(),
  compensation: z.string().optional(),
  nom: z.string().optional(),
  prenom: z.string().optional(),
  fonction: z.string().optional(),
  nomCorrespondant: z.string().optional(),
  prenomCorrespondant: z.string().optional(),
  telephone1: z.string().optional(),
  telephone2: z.string().optional(),
  fax: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  telex: z.string().optional(),
  addresse: z.string().optional(),
  codePostal: z.string().optional(),
  commentaire: z.string().optional(),
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
            role: "Validator 2",
            status: "Admin",
            organization: "SLIK PIS",
          },
          {
            id: "2",
            fullName: "Gadh Mohamed",
            position: "DFC",
            role: "Validator 1",
            status: "Member",
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
          codeBanque: initialData.codeBanque || "",
          agenceCode: initialData.agenceCode || "",
          libAgence: initialData.libAgence || "",
          codeVille: initialData.codeVille || "",
          regionAgence: initialData.regionAgence || "",
          codeBC: initialData.codeBC || "",
          ordreDe: initialData.ordreDe || "",
          parDefault: initialData.parDefault || "",
          compensation: initialData.compensation || "",
          nom: initialData.nom || "",
          prenom: initialData.prenom || "",
          fonction: initialData.fonction || "",
          nomCorrespondant: initialData.nomCorrespondant || "",
          prenomCorrespondant: initialData.prenomCorrespondant || "",
          telephone1: initialData.telephone1 || "",
          telephone2: initialData.telephone2 || "",
          fax: initialData.fax || "",
          email: initialData.email || "",
          telex: initialData.telex || "",
          addresse: initialData.addresse || "",
          codePostal: initialData.codePostal || "",
          commentaire: initialData.commentaire || "",
        }
      : {
          codeBanque: "",
          agenceCode: "",
          libAgence: "",
          codeVille: "",
          regionAgence: "",
          codeBC: "",
          ordreDe: "",
          parDefault: "",
          compensation: "",
          nom: "",
          prenom: "",
          fonction: "",
          nomCorrespondant: "",
          prenomCorrespondant: "",
          telephone1: "",
          telephone2: "",
          fax: "",
          email: "",
          telex: "",
          addresse: "",
          codePostal: "",
          commentaire: "",
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
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <FormField
                    control={form.control}
                    name="codeBanque"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("codeBanque")}</FormLabel>
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
                    name="libAgence"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("libelleAgence")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="codeVille"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("codeVille")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="regionAgence"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("regionAgence")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="codeBC"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("codeBC")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="ordreDe"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("orderDe")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="parDefault"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("parDefault")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="compensation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("compensation")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nom"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("name")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="prenom"
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
                    name="fonction"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("fonction")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="nomCorrespondant"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("nomCorrespondant")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="prenomCorrespondant"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("prenomCorrespondant")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="telephone1"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("telephone1")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="telephone2"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("telephone2")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="fax"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("fax")}</FormLabel>
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
                    name="telex"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("telex")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="addresse"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>{t("addresse")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="codePostal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("codePostal")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="commentaire"
                    render={({ field }) => (
                      <FormItem className="md:col-span-3">
                        <FormLabel>{t("commentaire")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          )}

          {step === 2 && (
            <Card>
              <CardContent className="pt-6">
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

          <div className="flex justify-between">
            {step === 2 && (
              <Button
                type="button"
                variant="outline"
                onClick={() => setStep(1)}
              >
                {t("previous")}
              </Button>
            )}
            {step === 1 && <Button type="submit">{t("next")}</Button>}
            {step === 1 && (
              <div></div> // Empty div for flex spacing
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
