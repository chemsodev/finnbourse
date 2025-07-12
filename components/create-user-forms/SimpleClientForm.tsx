"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Loader2 } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useClientApi } from "@/hooks/useClientApi";
import { ClientFormValues } from "@/lib/services/client-api";
import { useToast } from "@/hooks/use-toast";

// Simple client schema for one-step form
const clientSchema = z
  .object({
    clientType: z.enum(["personne_physique", "personne_morale"]),
    clientCode: z.string().min(1, "Le code client est requis"),
    email: z.string().email("Email invalide"),
    phoneNumber: z.string().min(1, "Le numéro de téléphone est requis"),
    wilaya: z.string().min(1, "La wilaya est requise"),
    address: z.string().min(1, "L'adresse est requise"),
    numeroCompteTitre: z
      .string()
      .min(1, "Le numéro de compte titres est requis"),

    // RIB fields
    ribBanque: z.string().min(3, "Code banque requis (3 chiffres)").max(3),
    ribAgence: z.string().min(3, "Code agence requis (3 chiffres)").max(3),
    ribCompte: z
      .string()
      .min(11, "Numéro de compte requis (11 chiffres)")
      .max(11),
    ribCle: z.string().min(2, "Clé RIB requise (2 chiffres)").max(2),

    // Individual fields (conditional)
    name: z.string().optional(),
    idNumber: z.string().optional(),
    nin: z.string().optional(),
    nationalite: z.string().optional(),
    dateNaissance: z.date().optional(),
    lieuNaissance: z.string().optional(),

    // Company fields (conditional)
    raisonSociale: z.string().optional(),
    nif: z.string().optional(),
    regNumber: z.string().optional(),
    legalForm: z.string().optional(),
  })
  .refine(
    (data) => {
      if (data.clientType === "personne_physique") {
        return !!(
          data.name &&
          data.idNumber &&
          data.nin &&
          data.nationalite &&
          data.dateNaissance &&
          data.lieuNaissance
        );
      }
      return true;
    },
    {
      message: "Tous les champs pour personne physique sont requis",
      path: ["name"],
    }
  )
  .refine(
    (data) => {
      if (data.clientType === "personne_morale") {
        return !!(
          data.raisonSociale &&
          data.nif &&
          data.regNumber &&
          data.legalForm
        );
      }
      return true;
    },
    {
      message: "Tous les champs pour personne morale sont requis",
      path: ["raisonSociale"],
    }
  );

type ClientFormData = z.infer<typeof clientSchema>;

interface SimpleClientFormProps {
  onSuccess?: (client: any) => void;
  onCancel?: () => void;
  defaultClientType?: "personne_physique" | "personne_morale";
}

export const SimpleClientForm: React.FC<SimpleClientFormProps> = ({
  onSuccess,
  onCancel,
  defaultClientType = "personne_physique",
}) => {
  const { createClient, isCreating, error, clearError } = useClientApi();
  const { toast } = useToast();

  const form = useForm<ClientFormData>({
    resolver: zodResolver(clientSchema),
    defaultValues: {
      clientType: defaultClientType,
      clientCode: "",
      email: "",
      phoneNumber: "",
      wilaya: "",
      address: "",
      numeroCompteTitre: "",
      ribBanque: "",
      ribAgence: "",
      ribCompte: "",
      ribCle: "",
      // Individual fields
      name: "",
      idNumber: "",
      nin: "",
      nationalite: "Algérienne",
      dateNaissance: undefined,
      lieuNaissance: "",
      // Company fields
      raisonSociale: "",
      nif: "",
      regNumber: "",
      legalForm: "SARL",
    },
  });

  const clientType = form.watch("clientType");

  const onSubmit = async (data: ClientFormData) => {
    try {
      // Transform to ClientFormValues format
      const clientData: ClientFormValues = {
        clientType: data.clientType,
        clientCode: data.clientCode,
        email: data.email,
        phoneNumber: data.phoneNumber,
        mobilePhone: data.phoneNumber,
        wilaya: data.wilaya,
        address: data.address,
        iobType: "intern",
        numeroCompteTitre: data.numeroCompteTitre,
        ribBanque: data.ribBanque,
        ribAgence: data.ribAgence,
        ribCompte: data.ribCompte,
        ribCle: data.ribCle,

        // Add specific fields based on client type
        ...(data.clientType === "personne_physique" && {
          name: data.name,
          idType: "nin",
          idNumber: data.idNumber,
          nin: data.nin,
          nationalite: data.nationalite,
          dateNaissance: data.dateNaissance,
          lieuNaissance: data.lieuNaissance,
        }),

        ...(data.clientType === "personne_morale" && {
          raisonSociale: data.raisonSociale,
          nif: data.nif,
          regNumber: data.regNumber,
          legalForm: data.legalForm,
        }),
      };

      const result = await createClient(clientData);

      toast({
        title: "Succès",
        description: "Client créé avec succès",
      });

      if (onSuccess) {
        onSuccess(result);
      }
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Nouveau Client</CardTitle>
        <CardDescription>
          Créez un nouveau client en remplissant tous les champs requis
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          {/* Client Type Selection */}
          <div className="space-y-2">
            <Label htmlFor="clientType">Type de client *</Label>
            <Select
              value={clientType}
              onValueChange={(value) =>
                form.setValue("clientType", value as any)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Sélectionnez le type de client" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="personne_physique">
                  Personne Physique
                </SelectItem>
                <SelectItem value="personne_morale">Personne Morale</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* General Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">
              Informations Générales
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="clientCode">Code client *</Label>
                <Input
                  id="clientCode"
                  {...form.register("clientCode")}
                  placeholder="CLIENT001"
                />
                {form.formState.errors.clientCode && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.clientCode.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  {...form.register("email")}
                  placeholder="client@example.com"
                />
                {form.formState.errors.email && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="phoneNumber">Téléphone *</Label>
                <Input
                  id="phoneNumber"
                  {...form.register("phoneNumber")}
                  placeholder="0123456789"
                />
                {form.formState.errors.phoneNumber && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.phoneNumber.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="wilaya">Wilaya *</Label>
                <Input
                  id="wilaya"
                  {...form.register("wilaya")}
                  placeholder="Alger"
                />
                {form.formState.errors.wilaya && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.wilaya.message}
                  </p>
                )}
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="address">Adresse *</Label>
                <Input
                  id="address"
                  {...form.register("address")}
                  placeholder="123 Rue de la Liberté, Alger"
                />
                {form.formState.errors.address && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.address.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Type Specific Fields */}
          {clientType === "personne_physique" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">
                Informations Personne Physique
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Nom complet *</Label>
                  <Input
                    id="name"
                    {...form.register("name")}
                    placeholder="Ahmed Benali"
                  />
                  {form.formState.errors.name && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="idNumber">Numéro CIN *</Label>
                  <Input
                    id="idNumber"
                    {...form.register("idNumber")}
                    placeholder="123456789012"
                  />
                  {form.formState.errors.idNumber && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.idNumber.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="nin">NIN *</Label>
                  <Input
                    id="nin"
                    {...form.register("nin")}
                    placeholder="987654321098"
                  />
                  {form.formState.errors.nin && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.nin.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="nationalite">Nationalité *</Label>
                  <Input
                    id="nationalite"
                    {...form.register("nationalite")}
                    placeholder="Algérienne"
                  />
                  {form.formState.errors.nationalite && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.nationalite.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="dateNaissance">Date de naissance *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !form.watch("dateNaissance") &&
                            "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {form.watch("dateNaissance") ? (
                          format(form.watch("dateNaissance")!, "dd/MM/yyyy", {
                            locale: fr,
                          })
                        ) : (
                          <span>Sélectionnez une date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={form.watch("dateNaissance")}
                        onSelect={(date) =>
                          form.setValue("dateNaissance", date)
                        }
                        disabled={(date) =>
                          date > new Date() || date < new Date("1900-01-01")
                        }
                        captionLayout="dropdown-buttons"
                        fromYear={1930}
                        toYear={new Date().getFullYear()}
                        locale={fr}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {form.formState.errors.dateNaissance && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.dateNaissance.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="lieuNaissance">Lieu de naissance *</Label>
                  <Input
                    id="lieuNaissance"
                    {...form.register("lieuNaissance")}
                    placeholder="Alger"
                  />
                  {form.formState.errors.lieuNaissance && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.lieuNaissance.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {clientType === "personne_morale" && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2">
                Informations Personne Morale
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="raisonSociale">Raison sociale *</Label>
                  <Input
                    id="raisonSociale"
                    {...form.register("raisonSociale")}
                    placeholder="ABC Company SARL"
                  />
                  {form.formState.errors.raisonSociale && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.raisonSociale.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="nif">NIF *</Label>
                  <Input
                    id="nif"
                    {...form.register("nif")}
                    placeholder="123456789012345"
                  />
                  {form.formState.errors.nif && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.nif.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="regNumber">Numéro d'enregistrement *</Label>
                  <Input
                    id="regNumber"
                    {...form.register("regNumber")}
                    placeholder="RC12345678"
                  />
                  {form.formState.errors.regNumber && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.regNumber.message}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="legalForm">Forme juridique *</Label>
                  <Select
                    value={form.watch("legalForm")}
                    onValueChange={(value) => form.setValue("legalForm", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez la forme" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="SARL">SARL</SelectItem>
                      <SelectItem value="SPA">SPA</SelectItem>
                      <SelectItem value="EURL">EURL</SelectItem>
                      <SelectItem value="SNC">SNC</SelectItem>
                      <SelectItem value="SCS">SCS</SelectItem>
                    </SelectContent>
                  </Select>
                  {form.formState.errors.legalForm && (
                    <p className="text-red-500 text-sm mt-1">
                      {form.formState.errors.legalForm.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Account Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b pb-2">
              Informations de Compte
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label htmlFor="numeroCompteTitre">
                  Numéro de compte titres *
                </Label>
                <Input
                  id="numeroCompteTitre"
                  {...form.register("numeroCompteTitre")}
                  placeholder="SEC001234567"
                />
                {form.formState.errors.numeroCompteTitre && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.numeroCompteTitre.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="ribBanque">Code banque *</Label>
                <Input
                  id="ribBanque"
                  {...form.register("ribBanque")}
                  placeholder="001"
                  maxLength={3}
                />
                {form.formState.errors.ribBanque && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.ribBanque.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="ribAgence">Code agence *</Label>
                <Input
                  id="ribAgence"
                  {...form.register("ribAgence")}
                  placeholder="002"
                  maxLength={3}
                />
                {form.formState.errors.ribAgence && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.ribAgence.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="ribCompte">Numéro de compte *</Label>
                <Input
                  id="ribCompte"
                  {...form.register("ribCompte")}
                  placeholder="12345678901"
                  maxLength={11}
                />
                {form.formState.errors.ribCompte && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.ribCompte.message}
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="ribCle">Clé RIB *</Label>
                <Input
                  id="ribCle"
                  {...form.register("ribCle")}
                  placeholder="12"
                  maxLength={2}
                />
                {form.formState.errors.ribCle && (
                  <p className="text-red-500 text-sm mt-1">
                    {form.formState.errors.ribCle.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-md">
              <p className="text-red-700">{error}</p>
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-6">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Annuler
              </Button>
            )}
            <Button type="submit" disabled={isCreating}>
              {isCreating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Créer le client
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
