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
import { Building2 } from "lucide-react";

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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader className="space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <div className="p-2 bg-primary/10 rounded-full">
              <Building2 className="h-6 w-6 text-primary" />
            </div>
            <DialogTitle className="text-2xl font-bold text-primary">
              {t("editCompany")}
            </DialogTitle>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Modifiez les informations de la société émettrice
          </p>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 pt-6"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      {t("name")} <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("enterName")}
                        type="text"
                        className="h-11 border-gray-300 focus:border-primary focus:ring-primary"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="activitySector"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      {t("sector")} <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("enterSector")}
                        type="text"
                        className="h-11 border-gray-300 focus:border-primary focus:ring-primary"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="website"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      {t("website")} <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("enterWebsite")}
                        type="url"
                        className="h-11 border-gray-300 focus:border-primary focus:ring-primary"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="capital"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      {t("capital")} <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("enterCapital")}
                        type="text"
                        className="h-11 border-gray-300 focus:border-primary focus:ring-primary"
                        {...field}
                      />
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
                    <FormLabel className="text-sm font-medium text-gray-700">
                      {t("email")} <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("enterEmail")}
                        type="email"
                        className="h-11 border-gray-300 focus:border-primary focus:ring-primary"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="tel"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-gray-700">
                      {t("phone")} <span className="text-red-500">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder={t("enterPhone")}
                        type="tel"
                        className="h-11 border-gray-300 focus:border-primary focus:ring-primary"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-gray-700">
                    {t("address")} <span className="text-red-500">*</span>
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder={t("enterAddress")}
                      type="text"
                      className="h-11 border-gray-300 focus:border-primary focus:ring-primary"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="pt-4">
              <Button 
                type="submit" 
                className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-medium rounded-lg shadow-lg transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed" 
                disabled={loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    <span>{t("loading")}</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5" />
                    <span>{t("save")}</span>
                  </div>
                )}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default EditCompanyDialog;
