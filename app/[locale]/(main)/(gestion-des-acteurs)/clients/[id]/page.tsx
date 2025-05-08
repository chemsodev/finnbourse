"use client";

import { useState, useEffect, useMemo } from "react";
import { useForm, FormProvider } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Download,
  Upload,
  Check,
  Clock,
  User,
  Users,
  Play,
  CheckCheck,
  PenBoxIcon,
  Calendar as CalendarIcon,
  CreditCard,
  Building2,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";
import {
  getClientById,
  updateClient,
  getClientDocuments,
  getClientUsers,
  uploadClientDocuments,
  createClientUsers,
  ClientError,
} from "@/lib/client-service";
import { formSchema, type FormValues } from "../schema";
import { useTranslations } from "next-intl";
import { ClientFormValues } from "../schema";
import Loading from "@/components/ui/loading";

interface SectionHeaderProps {
  icon: React.ReactNode;
  title: string;
  id: string;
  badge?: string;
}

const SectionHeader: React.FC<SectionHeaderProps> = ({
  icon,
  title,
  id,
  badge,
}) => (
  <div className="flex items-center gap-3 mb-6 pb-2 border-b transition-colors">
    <div className="p-2 rounded-full bg-primary/10 text-primary">{icon}</div>
    <div>
      <h3 className="text-lg font-medium flex items-center gap-2">
        {title}
        {badge && (
          <Badge variant="outline" className="text-xs font-normal py-0">
            {badge}
          </Badge>
        )}
      </h3>
    </div>
  </div>
);

interface DocumentType {
  id: number;
  description: string;
  poste: string;
  icon: JSX.Element;
  file: File | null;
  status?: string;
}

interface Agency {
  id: string;
  name: string;
}

export default function EditClientPage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [skipUsers, setSkipUsers] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [users, setUsers] = useState<
    Array<{
      id: string;
      firstName: string;
      lastName: string;
      role: string;
      address: string;
      wilaya: string;
      nationality: string;
      birthDate: string;
      idNumber: string;
      isOwner: boolean;
      isMandatory: boolean;
    }>
  >([]);

  const [documents, setDocuments] = useState<DocumentType[]>([
    {
      id: 1,
      description: "Copie du Registre de Commerce",
      poste: "Document obligatoire",
      icon: <FileText className="h-5 w-5 text-primary" />,
      file: null,
      status: "En attente",
    },
    {
      id: 2,
      description: "Statuts de la Société",
      poste: "Document obligatoire",
      icon: <FileText className="h-5 w-5 text-primary" />,
      file: null,
      status: "En attente",
    },
    {
      id: 3,
      description: "Copie de la pièce d'identité du gérant",
      poste: "Document obligatoire",
      icon: <User className="h-5 w-5 text-primary" />,
      file: null,
      status: "En attente",
    },
    {
      id: 4,
      description: "Copie de la pièce d'identité du mandataire",
      poste: "Document obligatoire",
      icon: <User className="h-5 w-5 text-primary" />,
      file: null,
      status: "En attente",
    },
    {
      id: 5,
      description: "Copie du numéro d'identification fiscale",
      poste: "Document obligatoire",
      icon: <FileText className="h-5 w-5 text-primary" />,
      file: null,
      status: "En attente",
    },
    {
      id: 6,
      description: "Copie du numéro d'identification statistique",
      poste: "Document obligatoire",
      icon: <FileText className="h-5 w-5 text-primary" />,
      file: null,
      status: "En attente",
    },
  ]);

  const cpaAgencies: Agency[] = [
    { id: "1", name: "Agence 1" },
    { id: "2", name: "Agence 2" },
  ];

  const externalAgencies: Agency[] = [
    { id: "3", name: "Externe 1" },
    { id: "4", name: "Externe 2" },
  ];

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      clientType: "personne_physique" as const,
      clientSource: "CPA" as const,
      name: "",
      email: "",
      phoneNumber: "",
      mobilePhone: "",
      idType: "passport" as const,
      idNumber: "",
      nin: "",
      nationalite: "",
      wilaya: "",
      address: "",
      dateNaissance: undefined,
      iobType: "intern" as const,
      iobCategory: null,
      hasCompteTitre: false,
      numeroCompteTitre: "",
      ribBanque: "",
      ribAgence: "",
      ribCompte: "",
      ribCle: "",
      observation: "",
      isEmployeeCPA: false,
      matricule: "",
      poste: "",
      agenceCPA: "",
      selectedAgence: "",
      raisonSociale: "",
      nif: "",
      regNumber: "",
      legalForm: "",
    },
  });

  const { watch } = form;
  const formData = watch();

  const ribComplet = useMemo(() => {
    const { ribBanque, ribAgence, ribCompte, ribCle } = formData;
    if (ribBanque && ribAgence && ribCompte && ribCle) {
      return `${ribBanque}  ${ribAgence}  ${ribCompte}  ${ribCle}`;
    }
    return "";
  }, [
    formData.ribBanque,
    formData.ribAgence,
    formData.ribCompte,
    formData.ribCle,
  ]);

  const t = useTranslations("Clients");

  useEffect(() => {
    const fetchClient = async () => {
      try {
        const client = await getClientById(Number(params.id));
        if (!client) {
          toast({
            title: "Erreur",
            description: "Client non trouvé",
            variant: "destructive",
          });
          router.push("/clients");
          return;
        }

        // Load client documents
        const clientDocs = await getClientDocuments(Number(params.id));
        setDocuments((prevDocs) =>
          prevDocs.map((doc) => {
            const uploadedDoc = clientDocs.find((d) => d.documentId === doc.id);
            return uploadedDoc
              ? {
                  ...doc,
                  file: uploadedDoc.file
                    ? new File([uploadedDoc.file.data], uploadedDoc.file.name, {
                        type: uploadedDoc.file.type,
                      })
                    : null,
                  status: uploadedDoc.status,
                }
              : doc;
          })
        );

        // Load client users
        const clientUsers = await getClientUsers(Number(params.id));
        setUsers(
          clientUsers.map((user) => ({
            id: Math.random().toString(), // Generate new IDs for the form
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            address: user.address,
            wilaya: user.wilaya,
            nationality: user.nationality,
            birthDate: user.birthDate,
            idNumber: user.idNumber,
            isOwner: user.isOwner,
            isMandatory: user.isMandatory,
          }))
        );

        // Extract only the form fields from the client data
        const formData: FormValues = {
          clientType: client.clientType,
          clientSource: client.clientSource,
          name: client.name || "",
          email: client.email || "",
          phoneNumber: client.phoneNumber || "",
          mobilePhone: client.mobilePhone || "",
          idType: client.idType || "passport",
          idNumber: client.idNumber || "",
          nin: client.nin || "",
          nationalite: client.nationalite || "",
          wilaya: client.wilaya || "",
          address: client.address || "",
          dateNaissance: client.dateNaissance,
          iobType: client.iobType,
          iobCategory: client.iobCategory,
          hasCompteTitre: client.hasCompteTitre,
          numeroCompteTitre: client.numeroCompteTitre || "",
          ribBanque: client.ribBanque || "",
          ribAgence: client.ribAgence || "",
          ribCompte: client.ribCompte || "",
          ribCle: client.ribCle || "",
          observation: client.observation || "",
          isEmployeeCPA: client.isEmployeeCPA || false,
          matricule: client.matricule || "",
          poste: client.poste || "",
          agenceCPA: client.agenceCPA || "",
          selectedAgence: client.selectedAgence || "",
          raisonSociale: client.raisonSociale || "",
          nif: client.nif || "",
          regNumber: client.regNumber || "",
          legalForm: client.legalForm || "",
        };

        form.reset(formData);
      } catch (error) {
        console.error("Error fetching client:", error);
        toast({
          title: "Erreur",
          description: "Erreur lors du chargement du client",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchClient();
  }, [params.id, form, router, toast]);

  const handleSelectChange = (name: string, value: any) => {
    form.setValue(name as keyof FormValues, value);
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    form.setValue(name as keyof FormValues, value);
  };

  const handleClientSourceChange = (checked: boolean) => {
    handleSelectChange("clientSource", checked ? "extern" : "CPA");
  };

  const handleFileSelect = (
    docId: number,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (e.target.files?.length) {
      setDocuments((prev) =>
        prev.map((doc) => {
          if (doc.id === docId) {
            return { ...doc, file: e.target.files![0], status: "Téléchargé" };
          }
          return doc;
        })
      );
    }
  };

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "En attente":
        return "bg-yellow-100 text-yellow-800";
      case "Téléchargé":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const addUser = () => {
    setUsers((prev) => [
      ...prev,
      {
        id: Math.random().toString(),
        firstName: "",
        lastName: "",
        role: "",
        address: "",
        wilaya: "",
        nationality: "",
        birthDate: "",
        idNumber: "",
        isOwner: false,
        isMandatory: false,
      },
    ]);
  };

  const handleUserChange = (userId: string, field: string, value: any) => {
    setUsers((prev) =>
      prev.map((user) => {
        if (user.id === userId) {
          return { ...user, [field]: value };
        }
        return user;
      })
    );
  };

  const nextStep = () => {
    setCurrentStep((prev) => Math.min(prev + 1, 3));
  };

  const prevStep = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleConfirmUpload = () => {
    setShowConfirmDialog(false);
    // Add your upload logic here
  };

  const onSubmit = async (data: FormValues) => {
    try {
      setIsLoading(true);

      // Transform the form data to match the expected ClientFormValues format
      const clientData =
        data.clientType === "personne_physique"
          ? {
              clientType: "personne_physique" as const,
              name: data.name,
              idType: data.idType,
              idNumber: data.idNumber,
              nin: data.nin,
              nationalite: data.nationalite,
              dateNaissance: data.dateNaissance,
              wilaya: data.wilaya || "",
              clientSource: data.clientSource,
              email: data.email || "",
              phoneNumber: data.phoneNumber || "",
              mobilePhone: data.mobilePhone || "",
              address: data.address || "",
              iobType: data.iobType,
              iobCategory: data.iobCategory,
              hasCompteTitre: data.hasCompteTitre,
              numeroCompteTitre: data.numeroCompteTitre || "",
              ribBanque: data.ribBanque || "",
              ribAgence: data.ribAgence || "",
              ribCompte: data.ribCompte || "",
              ribCle: data.ribCle || "",
              observation: data.observation || "",
              isEmployeeCPA: data.isEmployeeCPA || false,
              matricule: data.matricule || "",
              poste: data.poste || "",
              agenceCPA: data.agenceCPA || "",
              selectedAgence: data.selectedAgence || "",
            }
          : data.clientType === "personne_morale"
          ? {
              clientType: "personne_morale" as const,
              raisonSociale: data.raisonSociale,
              nif: data.nif,
              regNumber: data.regNumber,
              legalForm: data.legalForm,
              clientSource: data.clientSource,
              wilaya: data.wilaya || "",
              email: data.email || "",
              phoneNumber: data.phoneNumber || "",
              mobilePhone: data.mobilePhone || "",
              address: data.address || "",
              iobType: data.iobType,
              iobCategory: data.iobCategory,
              hasCompteTitre: data.hasCompteTitre,
              numeroCompteTitre: data.numeroCompteTitre || "",
              ribBanque: data.ribBanque || "",
              ribAgence: data.ribAgence || "",
              ribCompte: data.ribCompte || "",
              ribCle: data.ribCle || "",
              observation: data.observation || "",
              isEmployeeCPA: data.isEmployeeCPA || false,
              matricule: data.matricule || "",
              poste: data.poste || "",
              agenceCPA: data.agenceCPA || "",
              selectedAgence: data.selectedAgence || "",
            }
          : {
              clientType: "institution_financiere" as const,
              raisonSociale: data.raisonSociale,
              nif: data.nif,
              regNumber: data.regNumber,
              legalForm: data.legalForm,
              clientSource: data.clientSource,
              wilaya: data.wilaya || "",
              email: data.email || "",
              phoneNumber: data.phoneNumber || "",
              mobilePhone: data.mobilePhone || "",
              address: data.address || "",
              iobType: data.iobType,
              iobCategory: data.iobCategory,
              hasCompteTitre: data.hasCompteTitre,
              numeroCompteTitre: data.numeroCompteTitre || "",
              ribBanque: data.ribBanque || "",
              ribAgence: data.ribAgence || "",
              ribCompte: data.ribCompte || "",
              ribCle: data.ribCle || "",
              observation: data.observation || "",
              isEmployeeCPA: data.isEmployeeCPA || false,
              matricule: data.matricule || "",
              poste: data.poste || "",
              agenceCPA: data.agenceCPA || "",
              selectedAgence: data.selectedAgence || "",
            };

      // Update the client with properly typed data
      await updateClient(Number(params.id), clientData);

      // Handle file uploads - only include files that are not null
      const uploadedFiles = documents
        .filter((doc) => doc.file !== null)
        .map((doc) => ({
          clientId: Number(params.id),
          documentId: doc.id,
          file: doc.file as File,
          status: doc.status || "En attente",
        }));

      // Handle users
      const clientUsers = users.map((user) => ({
        clientId: Number(params.id),
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        address: user.address,
        wilaya: user.wilaya,
        nationality: user.nationality,
        birthDate: user.birthDate,
        idNumber: user.idNumber,
        isOwner: user.isOwner,
        isMandatory: user.isMandatory,
      }));

      // Upload documents and create users
      if (uploadedFiles.length > 0) {
        await uploadClientDocuments(uploadedFiles);
      }

      if (clientUsers.length > 0) {
        await createClientUsers(clientUsers);
      }

      toast({
        title: t("success"),
        description: t("updateSuccess"),
        variant: "success",
      });

      // Add a small delay before redirecting to ensure the toast is visible
      setTimeout(() => {
        router.push("/clients");
      }, 1000);
    } catch (error: unknown) {
      console.error("Error updating client:", error);
      toast({
        title: t("error"),
        description:
          error instanceof ClientError ? error.message : t("updateError"),
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return <Loading className="min-h-[400px]" />;
  }

  return (
    <FormProvider {...form}>
      <div>
        <div className="flex items-center justify-between my-8 gap-4 bg-slate-100 p-4 rounded-md">
          <div className="flex items-center gap-4">
            <Button size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-3xl font-bold tracking-tight text-secondary dark:text-gray-400">
              Modifier Client
            </h1>
          </div>
        </div>

        <Card className="w-full shadow-lg border-0 overflow-hidden">
          <CardContent className="p-8 space-y-10">
            {currentStep === 1 && (
              <div>
                <SectionHeader
                  icon={<User className="h-5 w-5" />}
                  title="Informations principales"
                  id="main"
                  badge="Étape 1"
                />

                <div className="mb-6 flex items-center justify-end space-x-2">
                  <Label>CPA</Label>
                  <Switch
                    checked={formData.clientSource === "extern"}
                    onCheckedChange={handleClientSourceChange}
                  />
                  <Label>Externe</Label>
                </div>

                <div className="grid grid-cols-2 gap-6">
                  {/* Left Column */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Type de client</Label>
                      <Select
                        value={formData.clientType}
                        onValueChange={(v) =>
                          handleSelectChange("clientType", v)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Personne physique" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="personne_physique">
                            Personne Physique
                          </SelectItem>
                          <SelectItem value="personne_morale">
                            Personne Morale
                          </SelectItem>
                          <SelectItem value="institution_financiere">
                            Institution Financière
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {formData.clientType === "personne_physique" ? (
                      <>
                        <div className="space-y-2">
                          <Label>Nom/Prénom</Label>
                          <Input
                            name="name"
                            value={formData.name}
                            onChange={handleFormChange}
                            placeholder="Nom et prénom"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>NIN</Label>
                          <Input
                            name="nin"
                            value={formData.nin}
                            onChange={handleFormChange}
                            placeholder="Numéro d'identification National"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Type de pièce d'identité</Label>
                          <Select
                            value={formData.idType}
                            onValueChange={(v) =>
                              handleSelectChange("idType", v)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="nin">NIN</SelectItem>
                              <SelectItem value="passport">Passport</SelectItem>
                              <SelectItem value="permit_conduite">
                                Permis de conduite
                              </SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label>N° de pièce d'identité</Label>
                          <Input
                            name="idNumber"
                            value={formData.idNumber}
                            onChange={handleFormChange}
                            placeholder="Numéro"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Nationalité</Label>
                          <Input
                            name="nationalite"
                            value={formData.nationalite}
                            onChange={handleFormChange}
                            placeholder="Nationalité"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Wilaya</Label>
                          <Input
                            name="wilaya"
                            value={formData.wilaya}
                            onChange={handleFormChange}
                            placeholder="Wilaya"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Date de naissance</Label>
                          <FormField
                            control={form.control}
                            name="dateNaissance"
                            render={({ field }) => (
                              <FormItem>
                                <FormControl>
                                  <Input
                                    type="date"
                                    className="w-full"
                                    {...field}
                                    value={
                                      field.value
                                        ? format(field.value, "yyyy-MM-dd")
                                        : ""
                                    }
                                    onChange={(e) => {
                                      const date = e.target.value
                                        ? new Date(e.target.value)
                                        : null;
                                      field.onChange(date);
                                    }}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Lieu de naissance</Label>
                          <Input
                            name="lieuNaissance"
                            value={formData.lieuNaissance}
                            onChange={handleFormChange}
                            placeholder="Lieu de naissance"
                          />
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              checked={formData.isEmployeeCPA}
                              onCheckedChange={(checked) =>
                                handleSelectChange("isEmployeeCPA", checked)
                              }
                              id="isEmployeeCPA"
                            />
                            <label
                              htmlFor="isEmployeeCPA"
                              className="text-sm font-medium"
                            >
                              Employé CPA
                            </label>
                          </div>

                          {formData.isEmployeeCPA && (
                            <div className="grid grid-cols-2 gap-2 mt-2">
                              <Input
                                name="matricule"
                                value={formData.matricule}
                                onChange={handleFormChange}
                                placeholder="Matricule employé"
                              />
                              <Input
                                name="poste"
                                value={formData.poste}
                                onChange={handleFormChange}
                                placeholder="Poste occupé"
                              />
                            </div>
                          )}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="space-y-2">
                          <Label>Raison sociale</Label>
                          <Input
                            name="raisonSociale"
                            value={formData.raisonSociale}
                            onChange={handleFormChange}
                            placeholder="Raison sociale"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>NIF</Label>
                          <Input
                            name="nif"
                            value={formData.nif}
                            onChange={handleFormChange}
                            placeholder="Numéro d'Identification Fiscale"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>N° Registre</Label>
                          <Input
                            name="regNumber"
                            value={formData.regNumber}
                            onChange={handleFormChange}
                            placeholder="Numéro du registre de commerce"
                          />
                        </div>

                        <div className="space-y-2">
                          <Label>Forme juridique</Label>
                          <Select
                            value={formData.legalForm}
                            onValueChange={(v) =>
                              handleSelectChange("legalForm", v)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner la forme juridique" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="sarl">SARL</SelectItem>
                              <SelectItem value="eurl">EURL</SelectItem>
                              <SelectItem value="spa">SPA</SelectItem>
                              <SelectItem value="sas">SAS</SelectItem>
                              <SelectItem value="autre">Autre</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Adresse email</Label>
                      <Input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleFormChange}
                        placeholder="Adresse email"
                      />
                    </div>

                    <div className="space-y-2">
                      <FormField
                        control={form.control}
                        name="mobilePhone"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Téléphone mobile</FormLabel>
                            <FormControl>
                              <Input
                                {...field}
                                placeholder="Téléphone mobile"
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
                        name="phoneNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Téléphone fixe</FormLabel>
                            <FormControl>
                              <Input {...field} placeholder="Téléphone fixe" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Adresse</Label>
                      <Input
                        name="address"
                        value={formData.address}
                        onChange={handleFormChange}
                        placeholder="Adresse complète"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label>Type IOB</Label>
                      {formData.clientSource === "CPA" ? (
                        <Input value="Intern" disabled className="bg-muted" />
                      ) : (
                        <Input value="Extern" disabled className="bg-muted" />
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>IOB</Label>
                      {formData.clientSource === "CPA" ? (
                        <Input value="CPA IOB" disabled className="bg-muted" />
                      ) : (
                        <Select
                          value={formData.iobCategory || undefined}
                          onValueChange={(v) =>
                            handleSelectChange("iobCategory", v)
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner un IOB" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="iob_sga_dz">IOB SGA</SelectItem>
                            <SelectItem value="iob_invest_market">
                              IOB Invest Market
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label>Agence</Label>
                      <Select
                        value={
                          formData.clientSource === "CPA"
                            ? formData.agenceCPA
                            : formData.selectedAgence
                        }
                        onValueChange={(v) =>
                          handleSelectChange(
                            formData.clientSource === "CPA"
                              ? "agenceCPA"
                              : "selectedAgence",
                            v
                          )
                        }
                      >
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              formData.clientSource === "CPA"
                                ? "Sélectionner une agence CPA"
                                : "Sélectionner votre agence"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {(formData.clientSource === "CPA"
                            ? cpaAgencies
                            : externalAgencies
                          ).map((agency) => (
                            <SelectItem key={agency.id} value={agency.id}>
                              {agency.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label>Observation</Label>
                      <textarea
                        name="observation"
                        value={formData.observation}
                        onChange={handleFormChange}
                        className="w-full min-h-[100px] p-2 border rounded-md"
                        placeholder="Observations..."
                      />
                    </div>
                  </div>

                  {/* Bank Account Section */}
                  <div className="col-span-2 space-y-4 mt-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-5 w-5" />
                        <h3 className="text-lg font-medium">Compte Espece</h3>
                      </div>
                    </div>
                    <div className="grid grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <Label>Code Banque</Label>
                        <Input
                          name="ribBanque"
                          value={formData.ribBanque}
                          onChange={handleFormChange}
                          placeholder="Code banque"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Code Agence</Label>
                        <Input
                          name="ribAgence"
                          value={formData.ribAgence}
                          onChange={handleFormChange}
                          placeholder="Code agence"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>N° de Compte</Label>
                        <Input
                          name="ribCompte"
                          value={formData.ribCompte}
                          onChange={handleFormChange}
                          placeholder="Numéro de compte"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Clé RIB</Label>
                        <Input
                          name="ribCle"
                          value={formData.ribCle}
                          onChange={handleFormChange}
                          placeholder="Clé RIB"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>RIB Complet</Label>
                      <Input value={ribComplet} disabled className="bg-muted" />
                    </div>
                  </div>

                  {/* Securities Account Section */}
                  <div className="col-span-2 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-5 w-5" />
                        <h3 className="text-lg font-medium">Compte Titre</h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-muted-foreground">
                          {formData.hasCompteTitre &&
                            "Vous avez un compte titre"}
                        </span>
                        <Switch
                          checked={formData.hasCompteTitre}
                          onCheckedChange={(checked) =>
                            handleSelectChange("hasCompteTitre", checked)
                          }
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>N° du compte titre</Label>
                      <Input
                        name="numeroCompteTitre"
                        value={formData.numeroCompteTitre}
                        onChange={handleFormChange}
                        placeholder="Numéro du compte titre"
                        disabled={!formData.hasCompteTitre}
                        className={!formData.hasCompteTitre ? "bg-muted" : ""}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-8">
                <SectionHeader
                  icon={<Users className="h-5 w-5" />}
                  title="Utilisateurs associés"
                  id="users"
                  badge="Étape 2"
                />

                <div className="flex items-center gap-4 mb-6">
                  <Button onClick={addUser} variant="outline">
                    Ajouter un utilisateur
                  </Button>
                  <div className="flex items-center gap-2">
                    <Checkbox
                      checked={skipUsers}
                      onCheckedChange={(checked) =>
                        setSkipUsers(checked as boolean)
                      }
                      id="skipUsers"
                    />
                    <label htmlFor="skipUsers" className="text-sm">
                      Passer cette étape
                    </label>
                  </div>
                </div>

                {!skipUsers && (
                  <div className="space-y-6">
                    {users.map((user) => (
                      <div
                        key={user.id}
                        className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 border rounded-lg"
                      >
                        <div className="space-y-4">
                          <div>
                            <Label>Nom/Prénom</Label>
                            <Input
                              value={user.firstName}
                              onChange={(e) =>
                                handleUserChange(
                                  user.id,
                                  "firstName",
                                  e.target.value
                                )
                              }
                              placeholder="Nom et prénom"
                            />
                          </div>
                          <div>
                            <Label>Né(e) (Nom de jeune fille)</Label>
                            <Input
                              value={user.lastName}
                              onChange={(e) =>
                                handleUserChange(
                                  user.id,
                                  "lastName",
                                  e.target.value
                                )
                              }
                              placeholder="Nom de jeune fille"
                            />
                          </div>
                          <div>
                            <Label>Adresse</Label>
                            <Input
                              value={user.address}
                              onChange={(e) =>
                                handleUserChange(
                                  user.id,
                                  "address",
                                  e.target.value
                                )
                              }
                              placeholder="Adresse complète"
                            />
                          </div>
                          <div>
                            <Label>Wilaya</Label>
                            <Input
                              value={user.wilaya}
                              onChange={(e) =>
                                handleUserChange(
                                  user.id,
                                  "wilaya",
                                  e.target.value
                                )
                              }
                              placeholder="Wilaya"
                            />
                          </div>
                        </div>
                        <div className="space-y-4">
                          <div>
                            <Label>Nationalité</Label>
                            <Input
                              value={user.nationality}
                              onChange={(e) =>
                                handleUserChange(
                                  user.id,
                                  "nationality",
                                  e.target.value
                                )
                              }
                              placeholder="Nationalité"
                            />
                          </div>
                          <div>
                            <Label>Date de naissance</Label>
                            <Input
                              type="date"
                              value={user.birthDate}
                              onChange={(e) =>
                                handleUserChange(
                                  user.id,
                                  "birthDate",
                                  e.target.value
                                )
                              }
                            />
                          </div>
                          <div>
                            <Label>Numéro de pièce d'identité</Label>
                            <Input
                              value={user.idNumber}
                              onChange={(e) =>
                                handleUserChange(
                                  user.id,
                                  "idNumber",
                                  e.target.value
                                )
                              }
                              placeholder="Numéro de pièce d'identité"
                            />
                          </div>
                          <div>
                            <Label>Rôle</Label>
                            <Select
                              value={user.role}
                              onValueChange={(value) =>
                                handleUserChange(user.id, "role", value)
                              }
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Sélectionner un rôle" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="validator1">
                                  Validateur 1
                                </SelectItem>
                                <SelectItem value="validator2">
                                  Validateur 2
                                </SelectItem>
                                <SelectItem value="consultation">
                                  Consultation
                                </SelectItem>
                                <SelectItem value="initiator">
                                  Initiateur
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          {formData.clientType === "personne_physique" && (
                            <div className="flex items-center gap-4">
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  checked={user.isOwner}
                                  onCheckedChange={(checked) =>
                                    handleUserChange(
                                      user.id,
                                      "isOwner",
                                      checked as boolean
                                    )
                                  }
                                  id={`isOwner-${user.id}`}
                                />
                                <Label htmlFor={`isOwner-${user.id}`}>
                                  Propriétaire
                                </Label>
                              </div>
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  checked={user.isMandatory}
                                  onCheckedChange={(checked) =>
                                    handleUserChange(
                                      user.id,
                                      "isMandatory",
                                      checked as boolean
                                    )
                                  }
                                  id={`isMandatory-${user.id}`}
                                />
                                <Label htmlFor={`isMandatory-${user.id}`}>
                                  Mandataire
                                </Label>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-8">
                <SectionHeader
                  icon={<Upload className="h-5 w-5" />}
                  title="Documents requis"
                  id="documents"
                  badge="Étape 3"
                />
                <div className="grid gap-6">
                  {documents.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-4 border rounded-lg bg-card"
                    >
                      <div className="flex items-center gap-4">
                        {doc.icon}
                        <div>
                          <p className="font-medium">{doc.description}</p>
                          <p className="text-sm text-muted-foreground">
                            {doc.poste}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <Badge
                          variant="secondary"
                          className={getStatusColor(doc.status)}
                        >
                          {doc.status}
                        </Badge>
                        <Input
                          type="file"
                          className="max-w-[200px]"
                          onChange={(e) => handleFileSelect(doc.id, e)}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-between p-6 border-t">
              <div className="flex gap-4">
                {currentStep > 1 && (
                  <Button variant="outline" onClick={prevStep}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Retour
                  </Button>
                )}
                {currentStep < 3 && (
                  <Button onClick={nextStep}>
                    Suivant
                    <Play className="h-4 w-4 ml-2" />
                  </Button>
                )}
              </div>

              {currentStep === 3 && (
                <div className="flex gap-4">
                  <Button
                    variant="outline"
                    onClick={() => router.push("/clients")}
                  >
                    Annuler
                  </Button>
                  <Button onClick={form.handleSubmit(onSubmit)}>
                    Enregistrer
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </FormProvider>
  );
}
