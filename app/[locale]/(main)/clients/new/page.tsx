"use client";

import { useState, useEffect } from "react";
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
import { ArrowLeft, Save, CalendarIcon } from "lucide-react";
import { formSchema } from "../schema";
import { ClientService } from "@/lib/services/clientService";
import { useToast } from "@/hooks/use-toast";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

// Define the form types to fix TypeScript errors
type FormValues = z.infer<typeof formSchema>;

export default function NewClient() {
  const t = useTranslations("ClientDashboard");
  const router = useRouter();
  const { toast } = useToast();

  const [isSaving, setIsSaving] = useState(false);
  const [clientType, setClientType] = useState<
    "personne_physique" | "personne_morale"
  >("personne_physique");

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

  const onSubmit = async (data: FormValues) => {
    try {
      setIsSaving(true);

      // Create the new client
      const result = await ClientService.createOrUpdate(data);

      toast({
        title: t("success"),
        description: t("clientCreated"),
      });

      // Navigate to the client view page
      router.push(`/clients/${result.id}/view`);
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
            {t("addClient")}
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
              {/* Step 1: Client Type Selection */}
              <div className="space-y-6">
                <h3 className="text-lg font-medium">{t("selectClientType")}</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Client Type */}
                  <FormField
                    control={form.control}
                    name="clientType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("clientType")}</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            setClientType(
                              value as "personne_physique" | "personne_morale"
                            );
                          }}
                          defaultValue={field.value}
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
                          <Input {...field} placeholder="CL-12345" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              {/* Step 2: Common Basic Information */}
              <div className="space-y-6">
                <div className="flex items-center">
                  <Separator className="flex-grow" />
                  <h3 className="mx-4 text-lg font-medium">
                    {t("basicInformation")}
                  </h3>
                  <Separator className="flex-grow" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Email */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t("email")}</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="email"
                            placeholder="client@example.com"
                          />
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
                          <Input {...field} placeholder="+213xxxxxxxxx" />
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
              </div>

              {/* Step 3A: Individual client specific fields */}
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
                            <Input {...field} defaultValue="Algerienne" />
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
                                  variant={"outline"}
                                  className={cn(
                                    "w-full pl-3 text-left font-normal",
                                    !field.value && "text-muted-foreground"
                                  )}
                                >
                                  {field.value ? (
                                    format(field.value, "PPP")
                                  ) : (
                                    <span>{t("pickADate")}</span>
                                  )}
                                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                </Button>
                              </FormControl>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={field.value}
                                onSelect={field.onChange}
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
                  </div>
                </div>
              )}

              {/* Step 3B: Company client specific fields */}
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

              {/* Step 4: Banking information section */}
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
                          <Input {...field} placeholder="SC12345678" />
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
                          <Input {...field} maxLength={5} placeholder="00123" />
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
                          <Input {...field} maxLength={5} placeholder="00456" />
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
                          <Input
                            {...field}
                            maxLength={11}
                            placeholder="12345678901"
                          />
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
                          <Input {...field} maxLength={2} placeholder="42" />
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
