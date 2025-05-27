"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CustodianFormValues, custodianFormSchema } from "./schema";

interface CustodianFormProps {
  defaultValues: CustodianFormValues;
  onFormChange: (values: CustodianFormValues) => void;
}

export function CustodianForm({
  defaultValues,
  onFormChange,
}: CustodianFormProps) {
  const t = useTranslations("TCCPage");

  const form = useForm<CustodianFormValues>({
    resolver: zodResolver(custodianFormSchema),
    defaultValues,
    mode: "onChange",
  });

  // Update parent form when this form changes
  const handleFormChange = () => {
    const values = form.getValues();
    onFormChange(values);
  };

  return (
    <Form {...form}>
      <form onChange={handleFormChange} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Identification */}
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("code")}</FormLabel>
                  <FormControl>
                    <Input id="code" className="w-full" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <FormField
              control={form.control}
              name="libelle"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("label")}</FormLabel>
                  <FormControl>
                    <Input id="libelle" className="w-full" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Type de compte et statut */}
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="typeCompte"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("type")}</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="typeCompte" className="w-full">
                        <SelectValue placeholder={t("select")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Dépositaire">
                          {t("depositary")}
                        </SelectItem>
                        <SelectItem value="Conservateur">
                          {t("custodian")}
                        </SelectItem>
                        <SelectItem value="Banque Locale">
                          {t("localBank")}
                        </SelectItem>
                        <SelectItem value="Banque Internationale">
                          {t("internationalBank")}
                        </SelectItem>
                        <SelectItem value="Autre">{t("other")}</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="statut"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("status")}</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="statut" className="w-full">
                        <SelectValue placeholder={t("select")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Actif">{t("active")}</SelectItem>
                        <SelectItem value="Inactif">{t("inactive")}</SelectItem>
                        <SelectItem value="Suspendu">
                          {t("suspended")}
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="dateCreation"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("creationDate")}</FormLabel>
                  <FormControl>
                    <Input
                      id="dateCreation"
                      type="date"
                      className="w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Informations bancaires */}
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="swift"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("swiftCode")}</FormLabel>
                  <FormControl>
                    <Input id="swift" className="w-full" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <FormField
              control={form.control}
              name="iban"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("iban")}</FormLabel>
                  <FormControl>
                    <Input id="iban" className="w-full" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="numeroCompte"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("accountNumber")}</FormLabel>
                  <FormControl>
                    <Input id="numeroCompte" className="w-full" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="devise"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("currency")}</FormLabel>
                  <FormControl>
                    <Select value={field.value} onValueChange={field.onChange}>
                      <SelectTrigger id="devise" className="w-full">
                        <SelectValue placeholder={t("select")} />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EUR">EUR</SelectItem>
                        <SelectItem value="USD">USD</SelectItem>
                        <SelectItem value="DZD">DZD</SelectItem>
                        <SelectItem value="GBP">GBP</SelectItem>
                        <SelectItem value="CHF">CHF</SelectItem>
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Adresse */}
          <div className="space-y-2 md:col-span-3">
            <FormField
              control={form.control}
              name="adresse"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("address")}</FormLabel>
                  <FormControl>
                    <Input id="adresse" className="w-full" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="codePostal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("postalCode")}</FormLabel>
                  <FormControl>
                    <Input id="codePostal" className="w-full" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="ville"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("city")}</FormLabel>
                  <FormControl>
                    <Input id="ville" className="w-full" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="pays"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("country")}</FormLabel>
                  <FormControl>
                    <Input id="pays" className="w-full" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Informations générales */}
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="telephone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("phone")}</FormLabel>
                  <FormControl>
                    <Input id="telephone" className="w-full" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("email")}</FormLabel>
                  <FormControl>
                    <Input
                      id="email"
                      type="email"
                      className="w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Informations réglementaires */}
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="numeroAgrement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("approvalNumber")}</FormLabel>
                  <FormControl>
                    <Input id="numeroAgrement" className="w-full" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="dateAgrement"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("approvalDate")}</FormLabel>
                  <FormControl>
                    <Input
                      id="dateAgrement"
                      type="date"
                      className="w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="autoriteSurveillance"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("supervisionAuthority")}</FormLabel>
                  <FormControl>
                    <Input
                      id="autoriteSurveillance"
                      className="w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* Correspondant */}
          <div className="space-y-2">
            <FormField
              control={form.control}
              name="codeCorrespondant"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("correspondentCode")}</FormLabel>
                  <FormControl>
                    <Input
                      id="codeCorrespondant"
                      className="w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="space-y-2 md:col-span-2">
            <FormField
              control={form.control}
              name="nomCorrespondant"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("correspondentName")}</FormLabel>
                  <FormControl>
                    <Input
                      id="nomCorrespondant"
                      className="w-full"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
      </form>
    </Form>
  );
}
