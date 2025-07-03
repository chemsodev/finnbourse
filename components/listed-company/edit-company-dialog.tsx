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
import { useState, useEffect } from "react";
import { IssuerService } from "@/lib/services/issuerService";

// Nouveau schéma de validation
const formSchema = z.object({
  id: z.string(),
  name: z.string().min(1, "Nom est obligatoire"),
  activitySector: z.string().min(1, "Secteur d'activité est obligatoire"),
  website: z.string().url("URL invalide"),
  capital: z.string().min(1, "Capital est obligatoire"),
  email: z.string().email("Email invalide"),
  address: z.string().min(1, "Adresse est obligatoire"),
  tel: z.string().min(1, "Téléphone est obligatoire"),
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

  type FormData = z.infer<typeof formSchema>;
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: company.id,
      name: company.nom,
      activitySector: company.secteuractivite,
      website: company.siteofficiel,
      capital: company.capitalisationboursiere,
      email: getContactValue("email"),
      address: getContactValue("address"),
      tel: getContactValue("phone"),
    },
  });

  // Reset form when company prop changes
  useEffect(() => {
    form.reset({
      id: company.id,
      name: company.nom,
      activitySector: company.secteuractivite,
      website: company.siteofficiel,
      capital: company.capitalisationboursiere,
      email: getContactValue("email"),
      address: getContactValue("address"),
      tel: getContactValue("phone"),
    });
  }, [company, form]);

  const onSubmit = async (values: FormData) => {
    setLoading(true);
    try {
      // Mapping des champs du formulaire vers l'API
      await IssuerService.update(values.id, {
        name: values.name,
        website: values.website,
        activitySector: values.activitySector,
        capital: values.capital,
        email: values.email,
        address: values.address,
        tel: values.tel,
      });
      toast({
        variant: "success",
        title: t("success"),
        description: t("companyUpdatedSuccessfully"),
      });
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("API error:", error);
      toast({
        variant: "destructive",
        title: t("error"),
        description: error instanceof Error ? error.message : "Une erreur est survenue",
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
                  name="name"
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
                  name="activitySector"
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
                  name="website"
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
                  name="address"
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
              <div className="col-span-6">
                <FormField
                  control={form.control}
                  name="tel"
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
