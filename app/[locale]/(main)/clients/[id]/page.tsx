"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Save, CalendarIcon } from "lucide-react";
import { useClients } from "@/hooks/useClients";
import Loading from "@/components/ui/loading";
import { formSchema } from "../schema";
import { ClientService } from "@/lib/services/clientService";
import { useToast } from "@/hooks/use-toast";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import type { DateRange } from "react-day-picker";

// Define the form types more explicitly to fix TypeScript errors
type FormValues = z.infer<typeof formSchema>;

export default function ClientEdit() {
  const t = useTranslations("ClientDashboard");
  const params = useParams();
  const router = useRouter();
  const clientId = params.id as string;
  const { toast } = useToast();

  const [client, setClient] = useState<any>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [clientType, setClientType] = useState<
    "personne_physique" | "personne_morale"
  >("personne_physique");

  const { getClientById, loading } = useClients();

  // Use FormValues type to fix TypeScript errors
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientType: "personne_physique",
      clientCode: "",
      name: "",
      email: "",
      phoneNumber: "",
      idType: "nin",
      idNumber: "",
      nin: "",
      nationalite: "",
      wilaya: "",
      address: "",
      iobType: "intern",
      iobCategory: null,
      numeroCompteTitre: "",
      ribBanque: "",
      ribAgence: "",
      ribCompte: "",
      ribCle: "",
      observation: "",
      selectedAgence: "",
      raisonSociale: "",
      nif: "",
      regNumber: "",
      legalForm: "",
      lieuNaissance: "",
      dateNaissance: undefined,
      financialInstitutionId: "1", // Default value
      agenceId: "1", // Default value
      iobId: "1", // Default value
    },
  });

  // Update local client type state when form value changes
  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "clientType" && value.clientType) {
        setClientType(
          value.clientType as "personne_physique" | "personne_morale"
        );
      }
    });
    return () => subscription.unsubscribe();
  }, [form.watch]);

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const data = await getClientById(clientId);
        setClient(data);

        // Map API data to form fields based on the API response format
        const clientTypeValue =
          data.type === "individual" ? "personne_physique" : "personne_morale";

        setClientType(clientTypeValue);

        form.reset({
          clientType: clientTypeValue,
          clientCode: data.client_code || "",
          name: data.name || "",
          email: data.email || "",
          phoneNumber: data.phone_number || "",
          idType: data.id_type || "nin",
          idNumber: data.id_number || "",
          nin: data.nin || "",
          nationalite: data.nationalite || "",
          wilaya: data.wilaya || "",
          address: data.address || "",
          iobType: data.iob_type || "intern",
          iobCategory: data.iob_category || null,
          numeroCompteTitre: data.securities_account_number || "",
          ribBanque: data.cash_account_bank_code || "",
          ribAgence: data.cash_account_agency_code || "",
          ribCompte: data.cash_account_number || "",
          ribCle: data.cash_account_rip_key || "",
          observation: data.observation || "",
          selectedAgence: data.agence || "",
          raisonSociale: data.raison_sociale || "",
          nif: data.nif || "",
          regNumber: data.reg_number || "",
          legalForm: data.legal_form || "",
          lieuNaissance: data.lieu_naissance || "",
          dateNaissance: data.date_naissance
            ? new Date(data.date_naissance)
            : undefined,
          financialInstitutionId: data.financialInstitutionId || "1",
          agenceId: data.agenceId || data.agence || "1",
          iobId: data.iobId || "1",
        });
      } catch (error) {
        console.error("Error fetching client:", error);
      }
    };

    if (clientId) {
      fetchClient();
    }
  }, [clientId, getClientById, form]);

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSaving(true);

      // Update the client directly, the transformation happens in the ClientService
      await ClientService.createOrUpdate(data, clientId);

      toast({
        title: t("success"),
        description: t("clientUpdated"),
      });

      // Navigate back to the client view page
      router.push(`/clients/${clientId}/view`);
    } catch (error) {
      console.error("Error updating client:", error);
      toast({
        title: t("error"),
        description: t("errorUpdatingClient"),
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (loading || !client) {
    return <Loading className="min-h-[400px]" />;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push(`/clients/${clientId}/view`)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">
            {t("editClient")}
          </h1>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("clientDetails")}</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              {/* Common fields for all client types */}
              <div className="space-y-6">
                <h3 className="text-lg font-medium">{t("basicInformation")}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Client Type */}
                  <FormField
                    control={form.control}
                    name="clientType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("clientType")}</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue
                                placeholder={t("selectClientType")}
                              />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="personne_physique">
                              {t("individual")}
                            </SelectItem>
                            <SelectItem value="personne_morale">
                              {t("company")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Client Code */}
                  <FormField
                    control={form.control}
                    name="clientCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("code")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Email */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("email")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Phone */}
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("phone")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Address */}
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("address")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Individual client specific fields */}
              {clientType === "personne_physique" && (
                <div className="space-y-6">
                  <div className="flex items-center">
                    <Separator className="flex-grow" />
                    <h3 className="mx-4 text-lg font-medium">
                      {t("individualInformation")}
                    </h3>
                    <Separator className="flex-grow" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Name */}
                    <FormField
                      control={form.control}
                      name="name"
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

                    {/* ID Type */}
                    <FormField
                      control={form.control}
                      name="idType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("idType")}</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder={t("selectIdType")} />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="nin">{t("nin")}</SelectItem>
                              <SelectItem value="passport">
                                {t("passport")}
                              </SelectItem>
                              <SelectItem value="permit_conduite">
                                {t("drivingLicense")}
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* NIN */}
                    <FormField
                      control={form.control}
                      name="nin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("nin")}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* ID Number */}
                    <FormField
                      control={form.control}
                      name="idNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("idNumber")}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Nationality */}
                    <FormField
                      control={form.control}
                      name="nationalite"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("nationality")}</FormLabel>
                          <FormControl>
                            <Input {...field} />
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
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Birth place */}
                    <FormField
                      control={form.control}
                      name="lieuNaissance"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("birthPlace")}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Birth Date */}
                    <FormField
                      control={form.control}
                      name="dateNaissance"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("birthDate")}</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>{t("selectDate")}</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={field.value as Date}
                                onSelect={(date: Date | undefined) =>
                                  field.onChange(date)
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {/* Company client specific fields */}
              {clientType === "personne_morale" && (
                <div className="space-y-6">
                  <div className="flex items-center">
                    <Separator className="flex-grow" />
                    <h3 className="mx-4 text-lg font-medium">
                      {t("companyInformation")}
                    </h3>
                    <Separator className="flex-grow" />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Company Name */}
                    <FormField
                      control={form.control}
                      name="raisonSociale"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("companyName")}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* NIF */}
                    <FormField
                      control={form.control}
                      name="nif"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("nif")}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Reg Number */}
                    <FormField
                      control={form.control}
                      name="regNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("regNumber")}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Legal Form */}
                    <FormField
                      control={form.control}
                      name="legalForm"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("legalForm")}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              )}

              {/* Banking information section */}
              <div className="space-y-6">
                <div className="flex items-center">
                  <Separator className="flex-grow" />
                  <h3 className="mx-4 text-lg font-medium">
                    {t("bankInformation")}
                  </h3>
                  <Separator className="flex-grow" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Securities Account */}
                  <FormField
                    control={form.control}
                    name="numeroCompteTitre"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("securitiesAccount")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Bank Code */}
                  <FormField
                    control={form.control}
                    name="ribBanque"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("bankCode")}</FormLabel>
                        <FormControl>
                          <Input {...field} maxLength={5} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Agency Code */}
                  <FormField
                    control={form.control}
                    name="ribAgence"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("agencyCode")}</FormLabel>
                        <FormControl>
                          <Input {...field} maxLength={5} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Account Number */}
                  <FormField
                    control={form.control}
                    name="ribCompte"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("accountNumber")}</FormLabel>
                        <FormControl>
                          <Input {...field} maxLength={11} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* RIB Key */}
                  <FormField
                    control={form.control}
                    name="ribCle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("ribKey")}</FormLabel>
                        <FormControl>
                          <Input {...field} maxLength={2} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Hidden fields for backend required IDs */}
              <input
                type="hidden"
                {...form.register("financialInstitutionId")}
              />
              <input type="hidden" {...form.register("agenceId")} />
              <input type="hidden" {...form.register("iobId")} />

              <div className="flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push(`/clients/${clientId}/view`)}
                >
                  {t("cancel")}
                </Button>
                <Button type="submit" disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <span className="animate-spin mr-2">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        >
                          <path d="M21 12a9 9 0 1 1-6.219-8.56" />
                        </svg>
                      </span>
                      {t("saving")}
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      {t("save")}
                    </>
                  )}
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
