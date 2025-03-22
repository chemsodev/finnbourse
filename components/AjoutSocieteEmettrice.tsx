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
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "./ui/button";
import { useTranslations } from "next-intl";
import { Building2 } from "lucide-react";
import { useState } from "react";
import { CREATE_LISTED_COMPANY } from "@/graphql/mutations";
import { fetchGraphQL } from "@/app/actions/fetchGraphQL";
import { useRouter } from "@/i18n/routing";

// Define the schema for form validation
const formSchema = z.object({
  nom: z.string().min(1, "Nom est obligatoire"),
  secteurActivite: z.string().min(1, "Secteur d'activité est obligatoire"),
  siteOfficiel: z.string().url("URL invalide"),
  email: z.string().email("Email invalide"),
  notice: z.string().min(1, "Notice est obligatoire"),
  phone: z.string().min(1, "Téléphone est obligatoire"),
  adresse: z.string().min(1, "Adresse est obligatoire"),
  capitalisationBoursiere: z
    .string()
    .min(1, "Capitalisation boursière est obligatoire"),
});

const AjoutSocieteEmettrice = () => {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const t = useTranslations("AjoutSocieteEmettrice");
  const router = useRouter();

  // React Hook Form setup
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      await fetchGraphQL<String>(CREATE_LISTED_COMPANY, {
        nom: values.nom,
        secteuractivite: values.secteurActivite,
        siteofficiel: values.siteOfficiel || null,
        phone: values.phone,
        email: values.email,
        address: values.adresse,
        capitalisationboursiere: values.capitalisationBoursiere,
        notice: values.notice,
      });

      toast({
        variant: "success",
        title: t("success"),
        description: t("LaSocieteAEteAjouteeAvecSucces"),
      });

      form.reset();
      window.location.reload();
      setOpen(false);
    } catch (error) {
      console.error("Mutation error:", error);

      toast({
        variant: "destructive",
        title: t("error"),
        description:
          error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex gap-2 mb-3">
          {t("ajouterUneSocieteEmettrice")} <Building2 size={20} />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold text-primary">
            {t("ajouterUneSocieteEmettrice")}
          </DialogTitle>
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
                        <FormLabel>{t("nom")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("entrerLeNom")}
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
                        <FormLabel>{t("secteurActivite")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("entrerLeSecteurDActivite")}
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

              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-6">
                  <FormField
                    control={form.control}
                    name="siteOfficiel"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("siteOfficiel")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("entrerLeSiteOfficiel")}
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
                            placeholder={t("entrerLemail")}
                            type="email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-6">
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("telephone")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="+213........."
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
                    name="adresse"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("adresse")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("entrerLadresse")}
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
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-6">
                  <FormField
                    control={form.control}
                    name="capitalisationBoursiere"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("capitalisationBoursiere")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("entrerUneCapitalisation")}
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
                    name="notice"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("notice")}</FormLabel>
                        <FormControl>
                          <Input
                            placeholder={t("notice")}
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

              <button
                disabled={loading}
                type="submit"
                className={`rounded-md text-white w-full py-2 shadow-md ${
                  loading ? "bg-primary/90 cursor-wait" : "bg-primary"
                }`}
              >
                {loading ? (
                  <div
                    role="status"
                    className="flex gap-2 justify-center items-center w-full"
                  >
                    {t("submit")}
                    <svg
                      aria-hidden="true"
                      className="w-5 h-5 text-gray-200 animate-spin fill-gray-400"
                      viewBox="0 0 100 101"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                        fill="currentColor"
                      />
                      <path
                        d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                        fill="currentFill"
                      />
                    </svg>
                    <span className="sr-only">Chargement...</span>
                  </div>
                ) : (
                  <div className="flex justify-center items-center group gap-2">
                    {t("submit")}
                  </div>
                )}
              </button>
            </form>
          </Form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default AjoutSocieteEmettrice;
