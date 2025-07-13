"use client";

import { useState, useEffect } from "react";
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

// Enhanced schema that matches the backend DTO structure
const enhancedClientSchema = z
  .object({
    clientType: z.enum([
      "personne_physique",
      "personne_morale",
      "institution_financiere",
    ]),
    clientCode: z.string().min(1, "Le code client est requis"),
    email: z.string().email("Email invalide"),
    phoneNumber: z.string().min(1, "Le numéro de téléphone est requis"),
    mobilePhone: z.string().optional(),
    wilaya: z.string().min(1, "La wilaya est requise"),
    address: z.string().min(1, "L'adresse est requise"),
    iobType: z.enum(["intern", "extern"]),
    iobCategory: z.string().optional(),
    numeroCompteTitre: z
      .string()
      .min(1, "Le numéro de compte titres est requis"),
    ribBanque: z
      .string()
      .min(1, "Le code banque est requis")
      .max(3, "Max 3 caractères"),
    ribAgence: z
      .string()
      .min(1, "Le code agence est requis")
      .max(3, "Max 3 caractères"),
    ribCompte: z
      .string()
      .min(1, "Le numéro de compte est requis")
      .max(11, "Max 11 caractères"),
    ribCle: z
      .string()
      .min(1, "La clé RIB est requise")
      .max(2, "Max 2 caractères"),
    observation: z.string().optional(),
    selectedAgence: z.string().optional(),
    financialInstitutionId: z.string().optional(),
    agenceId: z.string().optional(),
    iobId: z.string().optional(),

    // Individual fields
    name: z.string().optional(),
    idType: z.enum(["passport", "permit_conduite", "nin"]).optional(),
    idNumber: z.string().optional(),
    nin: z.string().optional(),
    nationalite: z.string().optional(),
    dateNaissance: z.date().optional(),
    lieuNaissance: z.string().optional(),

    // Company fields
    raisonSociale: z.string().optional(),
    nif: z.string().optional(),
    regNumber: z.string().optional(),
    legalForm: z.string().optional(),
  })
  .refine(
    (data) => {
      // Validate individual client required fields
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
      message:
        "Tous les champs requis pour une personne physique doivent être remplis",
      path: ["name"],
    }
  )
  .refine(
    (data) => {
      // Validate company client required fields
      if (
        data.clientType === "personne_morale" ||
        data.clientType === "institution_financiere"
      ) {
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
      message:
        "Tous les champs requis pour une personne morale doivent être remplis",
      path: ["raisonSociale"],
    }
  );

interface EnhancedClientFormProps {
  clientId?: string;
  onSuccess?: (client: any) => void;
  onCancel?: () => void;
}

export const EnhancedClientForm: React.FC<EnhancedClientFormProps> = ({
  clientId,
  onSuccess,
  onCancel,
}) => {
  const [isLoadingData, setIsLoadingData] = useState(false);
  const {
    createClient,
    updateClient,
    getClient,
    transformBackendToForm,
    isCreating,
    isUpdating,
    error,
    clearError,
  } = useClientApi();

  const form = useForm<ClientFormValues>({
    resolver: zodResolver(enhancedClientSchema),
    defaultValues: {
      clientType: "personne_physique",
      clientCode: "",
      email: "",
      phoneNumber: "",
      mobilePhone: "",
      wilaya: "",
      address: "",
      iobType: "intern",
      iobCategory: "",
      numeroCompteTitre: "",
      ribBanque: "",
      ribAgence: "",
      ribCompte: "",
      ribCle: "",
      observation: "",
      // Individual fields
      name: "",
      idType: "nin",
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
  const isEditMode = !!clientId;

  // Load existing client data for editing
  useEffect(() => {
    if (clientId) {
      const loadClientData = async () => {
        setIsLoadingData(true);
        try {
          const clientData = await getClient(clientId);
          const formData = transformBackendToForm(clientData);
          form.reset(formData);
        } catch (error) {
          console.error("Failed to load client data:", error);
        } finally {
          setIsLoadingData(false);
        }
      };
      loadClientData();
    }
  }, [clientId, getClient, transformBackendToForm, form]);

  // Clear error when form changes
  useEffect(() => {
    if (error) {
      clearError();
    }
  }, [form.formState.isDirty, error, clearError]);

  const onSubmit = async (data: ClientFormValues) => {
    try {
      let result;
      if (isEditMode) {
        console.log(`Submitting update for client ID: ${clientId}`);
        result = await updateClient(clientId as string, data);
      } else {
        result = await createClient(data);
      }

      if (onSuccess) {
        onSuccess(result);
      }
    } catch (error) {
      // Error is already handled by the hook
      console.error("Form submission error:", error);
    }
  };

  const isLoading = isCreating || isUpdating || isLoadingData;

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>
          {isEditMode ? "Modifier le client" : "Nouveau client"}
        </CardTitle>
        <CardDescription>
          {isEditMode
            ? "Modifiez les informations du client existant"
            : "Créez un nouveau client en remplissant tous les champs requis"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            console.log("Form submitted");
            form.handleSubmit(onSubmit)(e);
          }}
          className="space-y-6"
        >
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
                <SelectItem value="institution_financiere">
                  Institution Financière
                </SelectItem>
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
                <Label htmlFor="mobilePhone">Mobile</Label>
                <Input
                  id="mobilePhone"
                  {...form.register("mobilePhone")}
                  placeholder="0123456789"
                />
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
                  <Label htmlFor="idType">Type de pièce d'identité *</Label>
                  <Select
                    value={form.watch("idType")}
                    onValueChange={(value) =>
                      form.setValue("idType", value as any)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez le type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="nin">Carte d'identité</SelectItem>
                      <SelectItem value="passport">Passeport</SelectItem>
                      <SelectItem value="permit_conduite">
                        Permis de conduire
                      </SelectItem>
                    </SelectContent>
                  </Select>
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

          {(clientType === "personne_morale" ||
            clientType === "institution_financiere") && (
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
                <Label htmlFor="iobType">Type IOB</Label>
                <Select
                  value={form.watch("iobType")}
                  onValueChange={(value) =>
                    form.setValue("iobType", value as any)
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionnez le type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="intern">Interne</SelectItem>
                    <SelectItem value="extern">Externe</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="iobCategory">Catégorie IOB</Label>
                <Input
                  id="iobCategory"
                  {...form.register("iobCategory")}
                  placeholder="Catégorie"
                />
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

              <div className="md:col-span-2">
                <Label htmlFor="observation">Observation</Label>
                <Input
                  id="observation"
                  {...form.register("observation")}
                  placeholder="Remarques ou observations"
                />
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
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {isEditMode ? "Mettre à jour" : "Créer le client"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
