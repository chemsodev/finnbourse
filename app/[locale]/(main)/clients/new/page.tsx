"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
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
import { ArrowLeft, Save } from "lucide-react";
import { useClients } from "@/hooks/useClients";
import Loading from "@/components/ui/loading";
import { formSchema } from "../schema";
import { ClientService } from "@/lib/services/clientService";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ClientCreate() {
  const t = useTranslations("ClientDashboard");
  const router = useRouter();
  const { toast } = useToast();

  const [isSaving, setIsSaving] = useState(false);
  const [clientType, setClientType] = useState<string>("personne_physique");

  const form = useForm<z.infer<typeof formSchema>>({
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
      financialInstitutionId: "1",
      agenceId: "1",
      iobId: "1",
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsSaving(true);

      // Submit data directly - transformation happens in ClientService
      const newClient = await ClientService.createOrUpdate(data);

      toast({
        title: t("success"),
        description: t("clientCreated"),
      });

      // Navigate to the client view page
      router.push(`/clients/${newClient.id}/view`);
    } catch (error) {
      console.error("Error creating client:", error);
      toast({
        title: t("error"),
        description: t("errorCreatingClient"),
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleClientTypeChange = (value: string) => {
    setClientType(value);
    form.setValue("clientType", value as any);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => router.push("/clients")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold tracking-tight">
            {t("newClient")}
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
              <Tabs
                defaultValue="personne_physique"
                onValueChange={handleClientTypeChange}
                className="mb-6"
              >
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="personne_physique">
                    {t("individual")}
                  </TabsTrigger>
                  <TabsTrigger value="personne_morale">
                    {t("company")}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="personne_physique">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border rounded-lg p-4">
                    <h3 className="text-lg font-medium col-span-2">
                      {t("individual")}
                    </h3>

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
                              <SelectItem value="nin">NIN</SelectItem>
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

                    {/* Birth Date */}
                    <FormField
                      control={form.control}
                      name="dateNaissance"
                      render={({ field }) => (
                        <FormItem className="flex flex-col">
                          <FormLabel>{t("birthDate")}</FormLabel>
                          <Popover>
                            <PopoverTrigger asChild>
                              <FormControl>
                                <Button
                                  variant="outline"
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "dd/MM/yyyy")
                                  ) : (
                                    <span>{t("selectDate")}</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
                                disabled={(date) =>
                                  date > new Date() ||
                                  date < new Date("1900-01-01")
                                }
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Birth Place */}
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
                  </div>
                </TabsContent>

                <TabsContent value="personne_morale">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border rounded-lg p-4">
                    <h3 className="text-lg font-medium col-span-2">
                      {t("company")}
                    </h3>

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
                  </div>
                </TabsContent>
              </Tabs>

              {/* Common fields outside of tabs */}
              <div className="space-y-6">
                {/* Securities Account Section */}
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-4">
                    {t("securitiesAccount")}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Securities Account Number */}
                    <FormField
                      control={form.control}
                      name="numeroCompteTitre"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("numeroCompteTitre")}</FormLabel>
                          <FormControl>
                            <Input {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* RIB Information Section */}
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-4">
                    {t("ribInformation")}
                  </h3>
                  <div className="grid grid-cols-4 gap-4">
                    <FormField
                      control={form.control}
                      name="ribBanque"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("ribBanque")}</FormLabel>
                          <FormControl>
                            <Input {...field} maxLength={5} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="ribAgence"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("ribAgence")}</FormLabel>
                          <FormControl>
                            <Input {...field} maxLength={5} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="ribCompte"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("ribCompte")}</FormLabel>
                          <FormControl>
                            <Input {...field} maxLength={11} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="ribCle"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t("ribCle")}</FormLabel>
                          <FormControl>
                            <Input {...field} maxLength={2} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Observation */}
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-4">
                    {t("additionalInformation")}
                  </h3>
                  <FormField
                    control={form.control}
                    name="observation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("observation")}</FormLabel>
                        <FormControl>
                          <Input {...field} />
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
                  onClick={() => router.push("/clients")}
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
