"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { useState, useEffect } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, ArrowLeft } from "lucide-react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";

export const userFormSchema = z.object({
  qualite_souscripteur: z.enum(["propriétaire", "Mandataire","Tuteur legal"]).optional(),
  nom_prenom: z.string().optional(),
  adresse: z.string().optional(),
  wilaya: z.string().optional(),
  date_naissance: z.date().optional(),
  num_cni_pc: z.string().optional(),
  nationalite: z.string().optional(),
});

export type UserFormType = z.infer<typeof userFormSchema>;

type Props = {
  defaultValues?: Partial<UserFormType>;
  clientData?: any; 
  autoFillOnProprietaire?: boolean;
  onSubmit: (values: UserFormType) => void;
  onBack?: () => void;
};

export default function CreateUserForm({ defaultValues: initialValues, clientData, autoFillOnProprietaire = true, onSubmit, onBack }: Props) {
  const t = useTranslations("CreateUserForm");
  // Correction : options après le hook t
  const qualiteOptions = [
    { value: "propriétaire", label: t("proprietaire") },
    { value: "Mandataire", label: t("mandataire") },
    { value: "Tuteur legal", label: t("tuteurLegal") },
  ];
  const form = useForm<UserFormType>({
    resolver: zodResolver(userFormSchema),
    defaultValues: initialValues || {},
  });
  const [dateOpen, setDateOpen] = useState(false);
  const [resetKey, setResetKey] = useState(0);
  const qualite = form.watch("qualite_souscripteur");
  const pathname = usePathname();

  useEffect(() => {
    if (
      qualite === "propriétaire" &&
      autoFillOnProprietaire &&
      clientData &&
      pathname?.includes("/marcheprimaire/")
    ) {
      form.reset({
        qualite_souscripteur: "propriétaire",
        nom_prenom: clientData.name || "",
        adresse: clientData.address || "",
        wilaya: clientData.wilaya || "",
        date_naissance: clientData.date_naissance || undefined,
        num_cni_pc: clientData.id_number || "",
        nationalite: clientData.nationalite || "",
      });
    } else if (qualite === "propriétaire") {
      form.reset({ qualite_souscripteur: "propriétaire" });
    } else if (qualite === "Mandataire" || qualite === "Tuteur legal") {
      form.reset({ qualite_souscripteur: qualite });
    }
    setResetKey((k) => k + 1); 
  }, [qualite, clientData, autoFillOnProprietaire, pathname]);

  return (
    <div className="flex flex-col items-center justify-center w-full">
      {onBack && (
        <div className="w-full flex justify-start mb-2">
          <Button
            type="button"
            variant="outline"
            className="flex gap-2 items-center border rounded-md py-1.5 px-2 bg-primary text-white hover:bg-primary hover:text-white w-fit"
            onClick={onBack}
          >
            <ArrowLeft className="w-5" /> <div>{t("back")}</div>
          </Button>
        </div>
      )}
      <h2 className="text-2xl font-bold mb-6 text-center">{t("title")}</h2>
      <Form {...form} key={resetKey}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 w-full max-w-2xl p-10 border rounded-md shadow bg-white">
          {/* Qualite souscripteur */}
          <FormField
            control={form.control}
            name="qualite_souscripteur"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("quality")}</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder={t("chooseQuality")} />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {qualiteOptions.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Nom et prénom */}
          <FormField
            control={form.control}
            name="nom_prenom"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("name")}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder={t("namePlaceholder")} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Adresse */}
          <FormField
            control={form.control}
            name="adresse"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("address")}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder={t("addressPlaceholder")} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Wilaya */}
          <FormField
            control={form.control}
            name="wilaya"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("wilaya")}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder={t("wilayaPlaceholder")} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Date de naissance */}
          <FormField
            control={form.control}
            name="date_naissance"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("birthdate")}</FormLabel>
                <Popover open={dateOpen} onOpenChange={setDateOpen}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={"w-full justify-start text-left font-normal"}
                        type="button"
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {field.value ? format(field.value, "yyyy-MM-dd") : <span>{t("chooseDate")}</span>}
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={(date) => {
                        field.onChange(date);
                        setDateOpen(false);
                      }}
                      fromYear={1900}
                      toYear={new Date().getFullYear()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Numéro CNI/PC */}
          <FormField
            control={form.control}
            name="num_cni_pc"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("idNumber")}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder={t("idNumberPlaceholder")} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Nationalité */}
          <FormField
            control={form.control}
            name="nationalite"
            render={({ field }) => (
              <FormItem>
                <FormLabel>{t("nationality")}</FormLabel>
                <FormControl>
                  <Input {...field} placeholder={t("nationalityPlaceholder")} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" className="w-full">{t("submit")}</Button>
        </form>
      </Form>
    </div>
  );
}
