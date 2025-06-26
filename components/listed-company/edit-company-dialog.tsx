"use client";

import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { useState } from "react";
// Removed GraphQL dependencies - now using REST API
// import { UPDATE_LISTED_COMPANY } from "@/graphql/mutations";
// Removed GraphQL dependencies - now using REST API
// import { fetchGraphQLClient } from "@/app/actions/clientGraphQL";

// Définition du schéma de validation
const formSchema = z.object({
  id: z.string(),
  nom: z.string().min(1, "Nom est obligatoire"),
  secteurActivite: z.string().min(1, "Secteur d'activité est obligatoire"),
  siteOfficiel: z.string().url("URL invalide"),
  contactNom: z.string().min(1, "Nom du contact est obligatoire"),
  contactPrenom: z.string().min(1, "Prénom du contact est obligatoire"),
  contactFonction: z.string().min(1, "Fonction du contact est obligatoire"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(1, "Téléphone est obligatoire"),
  mobile: z.string().min(1, "Mobile est obligatoire"),
  adresse: z.string().min(1, "Adresse est obligatoire"),
  capital: z.string().min(1, "Capital est obligatoire"),
  notice: z.string().optional(),
});

type Company = {
  id: string;
  nom: string;
  secteuractivite: string;
  capitalisationboursiere: string;
  contact:
    | {
        nom: string | { set?: string };
        prenom: string | { set?: string };
        fonction: string | { set?: string };
        email: string | { set?: string };
        phone: string | { set?: string };
        mobile: string | { set?: string };
        address: string | { set?: string };
      }
    | string;
  siteofficiel: string;
  extrafields?:
    | {
        notice?: string | { set?: string };
      }
    | string;
};

interface EditCompanyDialogProps {
  company: Company;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const EditCompanyDialog = ({
  company,
  open,
  onOpenChange,
  onSuccess,
}: EditCompanyDialogProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const t = useTranslations("EditCompany");

  // Helper function to extract contact field values safely
  const getContactValue = (field: string): string => {
    if (!company.contact) return "";

    if (typeof company.contact === "string") {
      try {
        const parsed = JSON.parse(company.contact);
        return parsed[field] || "";
      } catch {
        return "";
      }
    }

    const contactField = company.contact[field as keyof typeof company.contact];
    if (!contactField) return "";

    if (typeof contactField === "string") return contactField;
    if (typeof contactField === "object" && "set" in contactField)
      return contactField.set || "";

    return "";
  };

  // Helper function to extract notice value safely
  const getNoticeValue = (): string => {
    if (!company.extrafields) return "";

    if (typeof company.extrafields === "string") {
      try {
        const parsed = JSON.parse(company.extrafields);
        return parsed.notice || "";
      } catch {
        return "";
      }
    }

    const notice = company.extrafields.notice;
    if (!notice) return "";

    if (typeof notice === "string") return notice;
    if (typeof notice === "object" && "set" in notice) return notice.set || "";

    return "";
  };

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: company.id,
      nom: company.nom,
      secteurActivite: company.secteuractivite,
      siteOfficiel: company.siteofficiel,
      contactNom: getContactValue("nom"),
      contactPrenom: getContactValue("prenom"),
      contactFonction: getContactValue("fonction"),
      email: getContactValue("email"),
      phone: getContactValue("phone"),
      mobile: getContactValue("mobile"),
      adresse: getContactValue("address"),
      capital: company.capitalisationboursiere,
      notice: getNoticeValue(),
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      // TODO: Replace with REST API call
      // await fetchGraphQLClient<{ id: string }>(UPDATE_LISTED_COMPANY, {
      //   id: values.id,
      //   nom: values.nom,
      //   secteuractivite: values.secteurActivite,
      //   siteofficiel: values.siteOfficiel || null,
      //   contactNom: values.contactNom,
      //   contactPrenom: values.contactPrenom,
      //   contactFonction: values.contactFonction,
      //   phone: values.phone,
      //   mobile: values.mobile,
      //   email: values.email,
      //   address: values.adresse,
      //   capitalisationboursiere: values.capital,
      //   notice: values.notice || "",
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        variant: "success",
        title: t("success"),
        description: t("companyUpdatedSuccessfully"),
      });

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Mutation error:", error);

      toast({
        variant: "destructive",
        title: t("error"),
        description:
          error instanceof Error ? error.message : "Une erreur est survenue",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-primary">
            {t("editCompany")}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-8 pt-10"
          >
            <div className="grid grid-cols-12 gap-4">
              <div className="col-span-6">
                <FormField
                  control={form.control}
                  name="nom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("name")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("enterName")}
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-6">
                <FormField
                  control={form.control}
                  name="secteurActivite"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("sector")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("enterSector")}
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-6">
                <FormField
                  control={form.control}
                  name="siteOfficiel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("website")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("enterWebsite")}
                          type="url"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-6">
                <FormField
                  control={form.control}
                  name="capital"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("capital")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("enterCapital")}
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-6">
                <FormField
                  control={form.control}
                  name="contactNom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("contactNom")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("enterContactNom")}
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-6">
                <FormField
                  control={form.control}
                  name="contactPrenom"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("contactPrenom")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("enterContactPrenom")}
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-6">
                <FormField
                  control={form.control}
                  name="contactFonction"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("contactFonction")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("enterContactFonction")}
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-6">
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("email")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("enterEmail")}
                          type="email"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-6">
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("phone")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("enterPhone")}
                          type="tel"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-6">
                <FormField
                  control={form.control}
                  name="mobile"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("mobile")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("enterMobile")}
                          type="tel"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-12">
                <FormField
                  control={form.control}
                  name="adresse"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("address")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("enterAddress")}
                          type="text"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="col-span-12">
                <FormField
                  control={form.control}
                  name="notice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("notice")}</FormLabel>
                      <FormControl>
                        <textarea
                          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder={t("enterNotice")}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>
            <Button type="submit" className="w-full mt-6" disabled={loading}>
              {loading ? <>{t("loading")}...</> : t("save")}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCompanyDialog;
