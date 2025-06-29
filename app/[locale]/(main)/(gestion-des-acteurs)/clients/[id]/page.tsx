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
  Eye,
  EyeOff,
  Plus,
  Pencil,
  Trash2,
  Loader2,
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
import { RolesAssignment } from "@/components/RolesAssignment";
import { getRoleDisplayName } from "@/lib/role-utils";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

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
  const [isAddingUser, setIsAddingUser] = useState(false);
  const [editingUserId, setEditingUserId] = useState<string | null>(null);
  const [showNewUserPassword, setShowNewUserPassword] = useState(false);
  const [statusConfirmDialog, setStatusConfirmDialog] = useState(false);
  const [userToToggleStatus, setUserToToggleStatus] = useState<string | null>(
    null
  );
  const [newUser, setNewUser] = useState({
    id: "",
    firstName: "",
    lastName: "",
    roles: [] as string[], // Array of role IDs
    role: "", // Keep for backward compatibility
    address: "",
    wilaya: "",
    nationality: "",
    birthDate: "",
    idNumber: "",
    userType: "proprietaire",
    status: "active", // Changed from "actif" to "active"
    showPassword: false,
    password: "",
  });
  const [users, setUsers] = useState<
    Array<{
      id: string;
      firstName: string;
      lastName: string;
      roles: string[]; // Array of role IDs
      role: string; // Keep for backward compatibility
      address: string;
      wilaya: string;
      nationality: string;
      birthDate: string;
      idNumber: string;
      userType: "proprietaire" | "mandataire" | "tuteur_legal";
      status: "active" | "inactive"; // Changed from "actif"/"inactif" to "active"/"inactive"
      showPassword?: boolean;
      password?: string;
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
      clientCode: "",
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
      lieuNaissance: "",
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
        ); // Load client users
        const clientUsers = await getClientUsers(Number(params.id));
        setUsers(
          clientUsers.map((user) => ({
            id: Math.random().toString(), // Generate new IDs for the form
            firstName: user.firstName,
            lastName: user.lastName,
            roles: user.roles || (user.role ? [user.role] : []),
            role: user.role,
            address: user.address,
            wilaya: user.wilaya,
            nationality: user.nationality,
            birthDate: user.birthDate,
            idNumber: user.idNumber,
            userType: user.userType,
            status: user.status,
            showPassword: false,
          }))
        );

        // Extract only the form fields from the client data
        const formData: FormValues = {
          clientType: client.clientType,
          clientCode: client.clientCode,
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
          lieuNaissance:
            client.clientType === "personne_physique"
              ? (client as any).lieuNaissance || ""
              : "",
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

  const fetchUsers = async (clientId: string) => {
    try {
      // Parse as a number to match the API expectation
      const userData = await getClientUsers(parseInt(clientId, 10)); // Convert old structure to new structure if needed
      const formattedUsers = userData.map((user: any) => ({
        ...user,
        roles: user.roles || [], // Add roles array if not present
        userType: user.isOwner
          ? ("proprietaire" as const)
          : user.isMandatory
          ? ("mandataire" as const)
          : ("tuteur_legal" as const),
        status:
          user.status === "actif"
            ? "active"
            : user.status === "inactif"
            ? "inactive"
            : "active", // Convert status
      }));
      setUsers(formattedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };
  const resetNewUser = () => {
    setNewUser({
      id: "",
      firstName: "",
      lastName: "",
      roles: [], // Initialize empty roles array
      role: "", // Keep for backward compatibility
      address: "",
      wilaya: "",
      nationality: "",
      birthDate: "",
      idNumber: "",
      userType: "proprietaire",
      status: "active", // Changed from "actif" to "active"
      showPassword: false,
      password: "",
    });
  };

  const addUser = () => {
    resetNewUser();
    setEditingUserId(null);
    setIsAddingUser(true);
  };

  const handleEditUser = (userId: string) => {
    const user = users.find((u) => u.id === userId);
    if (user) {
      setNewUser({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: user.roles || [], // Set roles array, fallback to empty array
        role: user.role, // Keep for backward compatibility
        address: user.address,
        wilaya: user.wilaya,
        nationality: user.nationality,
        birthDate: user.birthDate,
        idNumber: user.idNumber,
        userType: user.userType,
        status: user.status,
        showPassword: false,
        password: "",
      });
      setEditingUserId(userId);
      setIsAddingUser(true);
    }
  };

  const handleSaveUser = () => {
    if (!newUser.firstName || !newUser.lastName) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs obligatoires.",
        variant: "destructive",
      });
      return;
    }

    // Get the client type from the form to validate user type
    const clientType = form.getValues("clientType");
    const isValidUserType = validateUserTypeForClientType(
      clientType,
      newUser.userType
    );

    if (!isValidUserType) {
      toast({
        title: "Erreur",
        description: `Ce type d'utilisateur n'est pas autorisé pour ce type de client.`,
        variant: "destructive",
      });
      return;
    }
    const userToSave = {
      ...newUser,
      // Sync first role to legacy role field for backward compatibility
      role: newUser.roles.length > 0 ? newUser.roles[0] : newUser.role,
      userType: newUser.userType as
        | "proprietaire"
        | "mandataire"
        | "tuteur_legal",
      status: newUser.status as "active" | "inactive", // Updated status type
    };

    if (editingUserId) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingUserId ? { ...userToSave, id: editingUserId } : u
        )
      );
    } else {
      const id = Date.now().toString();
      setUsers((prev) => [...prev, { ...userToSave, id }]);
    }

    setIsAddingUser(false);
    resetNewUser();
  };

  const validateUserTypeForClientType = (
    clientType: string,
    userType: string
  ): boolean => {
    if (clientType === "personne_physique") {
      return ["proprietaire", "tuteur_legal"].includes(userType);
    } else {
      // For personne_morale and institution_financiere
      return ["proprietaire", "mandataire"].includes(userType);
    }
  };

  const handleUserChange = (userId: string, field: string, value: any) => {
    setUsers((prev) =>
      prev.map((user) =>
        user.id === userId ? { ...user, [field]: value } : user
      )
    );
  };

  const handleToggleStatus = (userId: string) => {
    setUserToToggleStatus(userId);
    setStatusConfirmDialog(true);
  };

  const confirmToggleStatus = () => {
    if (!userToToggleStatus) return;

    const updatedUsers = [...users];
    const userToUpdate = updatedUsers.find((u) => u.id === userToToggleStatus);
    if (userToUpdate) {
      userToUpdate.status =
        userToUpdate.status === "active" ? "inactive" : "active"; // Updated status values
      setUsers(updatedUsers);
    }

    // Reset dialog state
    setStatusConfirmDialog(false);
    setUserToToggleStatus(null);
  };

  const cancelToggleStatus = () => {
    setStatusConfirmDialog(false);
    setUserToToggleStatus(null);
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
              clientCode: data.clientCode,
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
              clientCode: data.clientCode,
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
              clientCode: data.clientCode,
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

      // Format client users for API
      const clientUsers = users.map((user) => ({
        id: user.id,
        clientId: Number(params.id),
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        address: user.address,
        wilaya: user.wilaya,
        nationality: user.nationality,
        birthDate: user.birthDate,
        idNumber: user.idNumber,
        userType: user.userType,
        status: user.status,
        createdAt: new Date(),
        updatedAt: new Date(),
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
        <div className="flex items-center my-8 bg-slate-100 p-4 rounded-md">
          <div className="flex items-center gap-4">
            <Button size="sm" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4 mr-1" />
              {t("retour")}
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

                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-4">
                    <Button
                      onClick={addUser}
                      variant="outline"
                      className="flex items-center gap-2"
                    >
                      <Plus className="h-4 w-4" />
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
                </div>

                {!skipUsers && (
                  <div className="border rounded-md">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nom</TableHead>
                          <TableHead>Nom de jeune fille</TableHead>
                          <TableHead>Rôle</TableHead>
                          <TableHead>Adresse</TableHead>
                          <TableHead>Wilaya</TableHead>
                          <TableHead>Nationalité</TableHead>
                          <TableHead>Date de naissance</TableHead>
                          <TableHead>Numéro d'identité</TableHead>
                          <TableHead>Type d'utilisateur</TableHead>
                          <TableHead>Statut</TableHead>
                          <TableHead>Mot de passe</TableHead>
                          <TableHead className="w-[100px]">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {users.length === 0 ? (
                          <TableRow>
                            <TableCell
                              colSpan={11}
                              className="text-center py-4 text-muted-foreground"
                            >
                              Aucun utilisateur ajouté
                            </TableCell>
                          </TableRow>
                        ) : (
                          users.map((user) => (
                            <TableRow key={user.id}>
                              <TableCell>{user.firstName}</TableCell>
                              <TableCell>{user.lastName}</TableCell>
                              <TableCell>
                                {user.roles && user.roles.length > 0
                                  ? user.roles
                                      .map((roleId) =>
                                        getRoleDisplayName(roleId)
                                      )
                                      .join(", ")
                                  : user.role || "N/A"}
                              </TableCell>
                              <TableCell>{user.address}</TableCell>
                              <TableCell>{user.wilaya}</TableCell>
                              <TableCell>{user.nationality}</TableCell>
                              <TableCell>{user.birthDate}</TableCell>
                              <TableCell>{user.idNumber}</TableCell>
                              <TableCell>
                                {user.userType === "proprietaire"
                                  ? "Propriétaire"
                                  : user.userType === "mandataire"
                                  ? "Mandataire"
                                  : "Tuteur Légal"}
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center justify-between space-x-2">
                                  <span
                                    className={
                                      user.status === "active"
                                        ? "text-green-600 text-sm font-medium"
                                        : "text-red-500 text-sm"
                                    }
                                  >
                                    {user.status === "active"
                                      ? "Actif"
                                      : "Inactif"}
                                  </span>
                                  <Switch
                                    checked={user.status === "active"}
                                    onCheckedChange={() =>
                                      handleToggleStatus(user.id)
                                    }
                                    className={
                                      user.status === "active"
                                        ? "bg-green-500 data-[state=checked]:bg-green-500"
                                        : "bg-red-500 data-[state=unchecked]:bg-red-500"
                                    }
                                  />
                                </div>
                              </TableCell>
                              <TableCell className="relative">
                                <div className="flex items-center">
                                  <span>
                                    {user.showPassword
                                      ? user.password || "Non défini"
                                      : "••••••••••"}
                                  </span>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 ml-2"
                                    onClick={() => {
                                      const updatedUsers = [...users];
                                      const userToUpdate = updatedUsers.find(
                                        (u) => u.id === user.id
                                      );
                                      if (userToUpdate) {
                                        userToUpdate.showPassword =
                                          !userToUpdate.showPassword;
                                        setUsers(updatedUsers);
                                      }
                                    }}
                                  >
                                    {user.showPassword ? (
                                      <EyeOff className="h-4 w-4" />
                                    ) : (
                                      <Eye className="h-4 w-4" />
                                    )}
                                    <span className="sr-only">
                                      {user.showPassword
                                        ? "Masquer le mot de passe"
                                        : "Afficher le mot de passe"}
                                    </span>
                                  </Button>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-amber-600"
                                    onClick={() => handleEditUser(user.id)}
                                  >
                                    <Pencil className="h-4 w-4" />
                                    <span className="sr-only">Modifier</span>
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-red-600"
                                    onClick={() =>
                                      setUsers(
                                        users.filter((u) => u.id !== user.id)
                                      )
                                    }
                                  >
                                    <Trash2 className="h-4 w-4" />
                                    <span className="sr-only">Supprimer</span>
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))
                        )}
                      </TableBody>
                    </Table>
                  </div>
                )}

                {/* User Form Dialog */}
                <Dialog open={isAddingUser} onOpenChange={setIsAddingUser}>
                  <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                      <DialogTitle>
                        {editingUserId
                          ? "Modifier l'utilisateur"
                          : "Ajouter un utilisateur"}
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                      <div className="space-y-2">
                        <Label>Nom/Prénom</Label>
                        <Input
                          value={newUser.firstName}
                          onChange={(e) =>
                            setNewUser({
                              ...newUser,
                              firstName: e.target.value,
                            })
                          }
                          placeholder="Nom et prénom"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Né(e) (Nom de jeune fille)</Label>
                        <Input
                          value={newUser.lastName}
                          onChange={(e) =>
                            setNewUser({ ...newUser, lastName: e.target.value })
                          }
                          placeholder="Nom de jeune fille"
                        />
                      </div>{" "}
                      <div className="space-y-2">
                        <Label>Rôles</Label>
                        <RolesAssignment
                          selectedRoles={newUser.roles}
                          onRolesChange={(roles) => {
                            setNewUser({
                              ...newUser,
                              roles,
                              // Sync first role to legacy role field for backward compatibility
                              role: roles.length > 0 ? roles[0] : "",
                            });
                          }}
                          userTypes={["client"]}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Adresse</Label>
                        <Input
                          value={newUser.address}
                          onChange={(e) =>
                            setNewUser({ ...newUser, address: e.target.value })
                          }
                          placeholder="Adresse complète"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Wilaya</Label>
                        <Input
                          value={newUser.wilaya}
                          onChange={(e) =>
                            setNewUser({ ...newUser, wilaya: e.target.value })
                          }
                          placeholder="Wilaya"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Nationalité</Label>
                        <Input
                          value={newUser.nationality}
                          onChange={(e) =>
                            setNewUser({
                              ...newUser,
                              nationality: e.target.value,
                            })
                          }
                          placeholder="Nationalité"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Date de naissance</Label>
                        <Input
                          type="date"
                          value={newUser.birthDate}
                          onChange={(e) =>
                            setNewUser({
                              ...newUser,
                              birthDate: e.target.value,
                            })
                          }
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Numéro de pièce d'identité</Label>
                        <Input
                          value={newUser.idNumber}
                          onChange={(e) =>
                            setNewUser({
                              ...newUser,
                              idNumber: e.target.value,
                            })
                          }
                          placeholder="Numéro de pièce d'identité"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label>Type d'utilisateur</Label>
                        <Select
                          value={newUser.userType}
                          onValueChange={(value) =>
                            setNewUser({
                              ...newUser,
                              userType: value as
                                | "proprietaire"
                                | "mandataire"
                                | "tuteur_legal",
                            })
                          }
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Sélectionner le type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="proprietaire">
                              Propriétaire
                            </SelectItem>
                            {form.getValues("clientType") !==
                              "personne_physique" && (
                              <SelectItem value="mandataire">
                                Mandataire
                              </SelectItem>
                            )}
                            {form.getValues("clientType") ===
                              "personne_physique" && (
                              <SelectItem value="tuteur_legal">
                                Tuteur Légal
                              </SelectItem>
                            )}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2">
                        {" "}
                        <div className="flex items-center justify-between">
                          <Label>Statut</Label>
                          <div className="flex items-center space-x-2">
                            <span
                              className={
                                newUser.status === "active"
                                  ? "text-green-600 font-medium"
                                  : "text-red-500"
                              }
                            >
                              {newUser.status === "active"
                                ? "Actif"
                                : "Inactif"}
                            </span>
                            <Switch
                              checked={newUser.status === "active"}
                              onCheckedChange={(checked) =>
                                setNewUser({
                                  ...newUser,
                                  status: checked ? "active" : "inactive",
                                })
                              }
                              className={
                                newUser.status === "active"
                                  ? "bg-green-500 data-[state=checked]:bg-green-500"
                                  : "bg-red-500 data-[state=unchecked]:bg-red-500"
                              }
                            />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <Label>Mot de passe</Label>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() =>
                              setShowNewUserPassword(!showNewUserPassword)
                            }
                          >
                            {showNewUserPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                        <Input
                          type={showNewUserPassword ? "text" : "password"}
                          value={newUser.password || ""}
                          onChange={(e) =>
                            setNewUser({ ...newUser, password: e.target.value })
                          }
                          placeholder="Mot de passe"
                        />
                      </div>
                    </div>
                    <DialogFooter>
                      <Button
                        variant="outline"
                        onClick={() => setIsAddingUser(false)}
                      >
                        Annuler
                      </Button>
                      <Button onClick={handleSaveUser}>
                        {editingUserId ? "Enregistrer" : "Ajouter"}
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
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

            <div className="flex justify-between pt-8 mt-8 border-t">
              <div>
                {currentStep > 1 && (
                  <Button
                    variant="outline"
                    onClick={prevStep}
                    disabled={isLoading}
                  >
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Précédent
                  </Button>
                )}
              </div>
              <div>
                {currentStep < 3 ? (
                  <Button onClick={nextStep} disabled={isLoading}>
                    Suivant
                    <Play className="h-4 w-4 ml-2" />
                  </Button>
                ) : (
                  <Button
                    onClick={form.handleSubmit(onSubmit)}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Enregistrement...
                      </>
                    ) : (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Enregistrer
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Status Toggle Confirmation Dialog */}
      <Dialog open={statusConfirmDialog} onOpenChange={setStatusConfirmDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirmer le changement de statut</DialogTitle>
            <DialogDescription>
              Êtes-vous sûr de vouloir changer le statut de cet utilisateur ?
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end space-x-2 pt-5">
            <Button variant="outline" onClick={cancelToggleStatus}>
              Annuler
            </Button>
            <Button onClick={confirmToggleStatus}>Confirmer</Button>
          </div>
        </DialogContent>
      </Dialog>
    </FormProvider>
  );
}
