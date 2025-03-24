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
import { UPDATE_LISTED_COMPANY } from "@/graphql/mutations";
import { fetchGraphQL } from "@/app/actions/fetchGraphQL";

// Définition du schéma de validation
const formSchema = z.object({
  id: z.string(),
  nom: z.string().min(1, "Nom est obligatoire"),
  secteurActivite: z.string().min(1, "Secteur d'activité est obligatoire"),
  siteOfficiel: z.string().url("URL invalide"),
  email: z.string().email("Email invalide"),
  phone: z.string().min(1, "Téléphone est obligatoire"),
  adresse: z.string().min(1, "Adresse est obligatoire"),
  capitalisationBoursiere: z
    .string()
    .min(1, "Capitalisation boursière est obligatoire"),
});

type Company = {
  id: string;
  nom: string;
  secteuractivite: string;
  capitalisationboursiere: string;
  contact: {
    email: string;
    phone: string;
    address: string;
  };
  siteofficiel: string;
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

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      id: company.id,
      nom: company.nom,
      secteurActivite: company.secteuractivite,
      siteOfficiel: company.siteofficiel,
      email: company.contact.email,
      phone: company.contact.phone,
      adresse: company.contact.address,
      capitalisationBoursiere: company.capitalisationboursiere,
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      await fetchGraphQL<string>(UPDATE_LISTED_COMPANY, {
        id: values.id,
        nom: values.nom,
        secteuractivite: values.secteurActivite,
        siteofficiel: values.siteOfficiel || null,
        phone: values.phone,
        email: values.email,
        address: values.adresse,
        capitalisationboursiere: values.capitalisationBoursiere,
      });

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
                  name="capitalisationBoursiere"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("marketCap")}</FormLabel>
                      <FormControl>
                        <Input
                          placeholder={t("enterMarketCap")}
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
