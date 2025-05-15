"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  FileText,
  Users,
  Building2,
  Download,
  Loader2,
  ArrowLeft,
  Eye,
  EyeOff,
} from "lucide-react";
import {
  getClientById,
  getClientUsers,
  getClientDocuments,
} from "@/lib/client-service";
import type { Client, ClientUser, ClientDocument } from "@/lib/client-service";
import { Badge } from "@/components/ui/badge";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { User } from "lucide-react";
import Loading from "@/components/ui/loading";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface ExtendedClientUser extends ClientUser {
  email?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export default function ViewClientPage() {
  const router = useRouter();
  const { toast } = useToast();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [client, setClient] = useState<Client | null>(null);
  const [users, setUsers] = useState<ExtendedClientUser[]>([]);
  const [documents, setDocuments] = useState<ClientDocument[]>([]);
  const [downloadingDocId, setDownloadingDocId] = useState<string | null>(null);
  const [passwordVisibility, setPasswordVisibility] = useState<
    Record<string, boolean>
  >({});
  const [viewUserDialog, setViewUserDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<ExtendedClientUser | null>(
    null
  );

  useEffect(() => {
    const fetchClientData = async () => {
      try {
        const clientData = await getClientById(Number(params.id));
        if (!clientData) {
          toast({
            title: "Erreur",
            description: "Client non trouvé",
            variant: "destructive",
          });
          router.push("/clients");
          return;
        }
        setClient(clientData);

        // Fetch related users
        const clientUsers = await getClientUsers(Number(params.id));
        setUsers(clientUsers);

        // Fetch related documents
        const clientDocs = await getClientDocuments(Number(params.id));
        setDocuments(clientDocs);
      } catch (error) {
        console.error("Error fetching client data:", error);
        toast({
          title: "Erreur",
          description: "Erreur lors du chargement des données du client",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchClientData();
  }, [params.id, router, toast]);

  const handleDownload = async (document: ClientDocument) => {
    if (typeof window === "undefined") return;

    try {
      setDownloadingDocId(document.documentId.toString());
      if (!document.file) {
        throw new Error("No file data available");
      }

      // Create a blob from the file data
      const blob = new Blob([document.file.data], { type: document.file.type });
      const url = window.URL.createObjectURL(blob);
      const link = window.document.createElement("a");
      link.href = url;
      link.download = document.file.name || "document";
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading file:", error);
      toast({
        title: "Erreur",
        description: "Erreur lors du téléchargement du fichier",
        variant: "destructive",
      });
    } finally {
      setDownloadingDocId(null);
    }
  };

  // Toggle password visibility for a user
  const togglePasswordVisibility = (userId: string) => {
    setPasswordVisibility((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }));
  };

  // Handle view user details
  const handleViewUser = (user: ExtendedClientUser) => {
    setSelectedUser(user);
    setViewUserDialog(true);
  };

  if (isLoading) return <Loading className="min-h-[400px]" />;
  if (!client) return <div>Client non trouvé</div>;

  return (
    <div className="container mx-auto py-8">
      <div className="flex items-center mb-8 bg-slate-100 p-4 rounded-md">
        <Button
          onClick={() => router.push("/clients")}
          variant="outline"
          className="mr-4"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Retour
        </Button>
        <h1 className="text-3xl font-bold">Détails du Client</h1>
        {client.clientCode && (
          <p className="text-lg text-primary ml-4">
            Code client:{" "}
            <span className="font-semibold">{client.clientCode}</span>
          </p>
        )}
      </div>

      <Tabs defaultValue="info" className="space-y-4">
        <TabsList>
          <TabsTrigger value="info">
            <Building2 className="h-4 w-4 mr-2" />
            Informations
          </TabsTrigger>
          <TabsTrigger value="users">
            <Users className="h-4 w-4 mr-2" />
            Utilisateurs
          </TabsTrigger>
          <TabsTrigger value="documents">
            <FileText className="h-4 w-4 mr-2" />
            Documents
          </TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>Informations du Client</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {/* Information principale */}
                <div>
                  <h3 className="text-lg font-semibold border-b pb-2 mb-3">
                    Informations Principales
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <p className="font-semibold">Code Client</p>
                      <p className="font-medium text-primary">
                        {client.clientCode || "Non défini"}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold">Nom</p>
                      <p>
                        {client.clientType === "personne_physique"
                          ? client.name
                          : client.raisonSociale}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold">Type de Client</p>
                      <p>
                        {client.clientType === "personne_physique"
                          ? "Personne Physique"
                          : client.clientType === "personne_morale"
                          ? "Personne Morale"
                          : "Institution Financière"}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold">Email</p>
                      <p>{client.email || "-"}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Téléphone</p>
                      <p>{client.phoneNumber || "-"}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Mobile</p>
                      <p>{client.mobilePhone || "-"}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Adresse</p>
                      <p>{client.address || "-"}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Wilaya</p>
                      <p>{client.wilaya || "-"}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Source du Client</p>
                      <p>
                        {client.clientSource === "extern" ? "Externe" : "CPA"}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold">Statut</p>
                      <p>
                        <Badge
                          variant={
                            client.status === "actif"
                              ? "outline"
                              : "destructive"
                          }
                          className={
                            client.status === "actif"
                              ? "bg-green-100 text-green-800"
                              : ""
                          }
                        >
                          {client.status === "actif" ? "Actif" : "Inactif"}
                        </Badge>
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold">Date de création</p>
                      <p>
                        {client.createdAt
                          ? new Date(client.createdAt).toLocaleDateString()
                          : "-"}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold">Dernière mise à jour</p>
                      <p>
                        {client.updatedAt
                          ? new Date(client.updatedAt).toLocaleDateString()
                          : "-"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Spécifique à la personne physique */}
                {client.clientType === "personne_physique" && (
                  <div>
                    <h3 className="text-lg font-semibold border-b pb-2 mb-3">
                      Informations Personne Physique
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <p className="font-semibold">
                          Type de pièce d'identité
                        </p>
                        <p>
                          {client.idType === "passport"
                            ? "Passeport"
                            : client.idType === "permit_conduite"
                            ? "Permis de conduire"
                            : "NIN"}
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold">
                          Numéro de pièce d'identité
                        </p>
                        <p>{client.idNumber || "-"}</p>
                      </div>
                      <div>
                        <p className="font-semibold">NIN</p>
                        <p>{client.nin || "-"}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Nationalité</p>
                        <p>{client.nationalite || "-"}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Date de naissance</p>
                        <p>
                          {client.dateNaissance
                            ? new Date(
                                client.dateNaissance
                              ).toLocaleDateString()
                            : "-"}
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold">Lieu de naissance</p>
                        <p>{client.lieuNaissance || "-"}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Spécifique à la personne morale ou institution financière */}
                {(client.clientType === "personne_morale" ||
                  client.clientType === "institution_financiere") && (
                  <div>
                    <h3 className="text-lg font-semibold border-b pb-2 mb-3">
                      Informations{" "}
                      {client.clientType === "personne_morale"
                        ? "Personne Morale"
                        : "Institution Financière"}
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div>
                        <p className="font-semibold">Raison sociale</p>
                        <p>{client.raisonSociale || "-"}</p>
                      </div>
                      <div>
                        <p className="font-semibold">NIF</p>
                        <p>{client.nif || "-"}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Numéro RC</p>
                        <p>{client.regNumber || "-"}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Forme juridique</p>
                        <p>{client.legalForm || "-"}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Informations bancaires */}
                <div>
                  <h3 className="text-lg font-semibold border-b pb-2 mb-3">
                    Informations Bancaires
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <p className="font-semibold">Compte Titre</p>
                      <p>{client.hasCompteTitre ? "Oui" : "Non"}</p>
                    </div>
                    {client.hasCompteTitre && (
                      <div>
                        <p className="font-semibold">Numéro de Compte Titre</p>
                        <p>{client.numeroCompteTitre || "-"}</p>
                      </div>
                    )}
                    <div>
                      <p className="font-semibold">RIB Complet</p>
                      <p>
                        {client.ribBanque &&
                        client.ribAgence &&
                        client.ribCompte &&
                        client.ribCle
                          ? `${client.ribBanque} ${client.ribAgence} ${client.ribCompte} ${client.ribCle}`
                          : "-"}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold">Code Banque</p>
                      <p>{client.ribBanque || "-"}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Code Agence</p>
                      <p>{client.ribAgence || "-"}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Numéro de Compte</p>
                      <p>{client.ribCompte || "-"}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Clé RIB</p>
                      <p>{client.ribCle || "-"}</p>
                    </div>
                  </div>
                </div>

                {/* Informations CPA */}
                <div>
                  <h3 className="text-lg font-semibold border-b pb-2 mb-3">
                    Informations CPA
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    <div>
                      <p className="font-semibold">Employé CPA</p>
                      <p>{client.isEmployeeCPA ? "Oui" : "Non"}</p>
                    </div>
                    {client.isEmployeeCPA && (
                      <>
                        <div>
                          <p className="font-semibold">Matricule</p>
                          <p>{client.matricule || "-"}</p>
                        </div>
                        <div>
                          <p className="font-semibold">Poste</p>
                          <p>{client.poste || "-"}</p>
                        </div>
                        <div>
                          <p className="font-semibold">Agence CPA</p>
                          <p>{client.agenceCPA || "-"}</p>
                        </div>
                      </>
                    )}
                    <div>
                      <p className="font-semibold">Agence Sélectionnée</p>
                      <p>{client.selectedAgence || "-"}</p>
                    </div>
                    <div>
                      <p className="font-semibold">Type IOB</p>
                      <p>
                        {client.iobType === "intern" ? "Interne" : "Externe"}
                      </p>
                    </div>
                    <div>
                      <p className="font-semibold">Catégorie IOB</p>
                      <p>{client.iobCategory || "-"}</p>
                    </div>
                  </div>
                </div>

                {/* Observations */}
                <div>
                  <h3 className="text-lg font-semibold border-b pb-2 mb-3">
                    Observations
                  </h3>
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="whitespace-pre-wrap">
                      {client.observation || "Aucune observation"}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle>Utilisateurs Associés</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nom/Prénom</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Mot de passe</TableHead>
                    <TableHead>Type d'utilisateur</TableHead>
                    <TableHead>Rôle</TableHead>
                    <TableHead>Statut</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {users.length === 0 ? (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="text-center py-4 text-muted-foreground"
                      >
                        Aucun utilisateur associé
                      </TableCell>
                    </TableRow>
                  ) : (
                    users.map((user, index) => (
                      <TableRow key={index}>
                        <TableCell>
                          {user.firstName} {user.lastName}
                        </TableCell>
                        <TableCell className="max-w-[150px] truncate">
                          {user.email || "-"}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <span className="truncate max-w-[80px]">
                              {passwordVisibility[user.id]
                                ? user.password
                                : "••••••••••"}
                            </span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-7 w-7 ml-1 p-0"
                              onClick={() => togglePasswordVisibility(user.id)}
                            >
                              {passwordVisibility[user.id] ? (
                                <EyeOff className="h-3.5 w-3.5" />
                              ) : (
                                <Eye className="h-3.5 w-3.5" />
                              )}
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          {user.userType === "proprietaire"
                            ? "Propriétaire"
                            : user.userType === "mandataire"
                            ? "Mandataire"
                            : user.userType === "tuteur_legal"
                            ? "Tuteur Légal"
                            : "-"}
                        </TableCell>
                        <TableCell>{user.role || "-"}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              user.status === "actif"
                                ? "outline"
                                : "destructive"
                            }
                            className={
                              user.status === "actif"
                                ? "bg-green-100 text-green-800"
                                : ""
                            }
                          >
                            {user.status === "actif" ? "Actif" : "Inactif"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleViewUser(user)}
                            className="h-7 w-7 p-0"
                          >
                            <Eye className="h-3.5 w-3.5" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documents">
          <Card>
            <CardHeader>
              <CardTitle>Documents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {documents.map((doc, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-semibold">{doc.description}</p>
                        <p className="text-sm text-gray-500">{doc.poste}</p>
                      </div>
                      {doc.file && (
                        <Button
                          onClick={() => handleDownload(doc)}
                          variant="outline"
                          size="sm"
                          disabled={downloadingDocId === doc.documentId}
                        >
                          {downloadingDocId === doc.documentId ? (
                            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          ) : (
                            <Download className="h-4 w-4 mr-2" />
                          )}
                          {downloadingDocId === doc.documentId
                            ? "Téléchargement..."
                            : "Télécharger"}
                        </Button>
                      )}
                    </div>
                    <div className="mt-2">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          doc.status === "Téléchargé"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {doc.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* User Details Dialog */}
      <Dialog open={viewUserDialog} onOpenChange={setViewUserDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Détails de l'utilisateur</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-6">
              {/* Informations de base */}
              <div>
                <h3 className="text-lg font-semibold border-b pb-2 mb-3">
                  Informations Principales
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Nom/Prénom
                    </p>
                    <p className="text-base">
                      {selectedUser.firstName} {selectedUser.lastName}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-base">{selectedUser.email || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Mot de passe
                    </p>
                    <div className="flex items-center">
                      <p className="text-base">
                        {passwordVisibility[`details-${selectedUser.id}`]
                          ? selectedUser.password
                          : "••••••••••"}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-7 w-7 ml-1 p-0"
                        onClick={() => {
                          setPasswordVisibility((prev) => ({
                            ...prev,
                            [`details-${selectedUser.id}`]:
                              !prev[`details-${selectedUser.id}`],
                          }));
                        }}
                      >
                        {passwordVisibility[`details-${selectedUser.id}`] ? (
                          <EyeOff className="h-3.5 w-3.5" />
                        ) : (
                          <Eye className="h-3.5 w-3.5" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Type d'utilisateur
                    </p>
                    <p className="text-base">
                      {selectedUser.userType === "proprietaire"
                        ? "Propriétaire"
                        : selectedUser.userType === "mandataire"
                        ? "Mandataire"
                        : selectedUser.userType === "tuteur_legal"
                        ? "Tuteur Légal"
                        : "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Rôle</p>
                    <p className="text-base">{selectedUser.role || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Statut</p>
                    <p className="text-base">
                      <Badge
                        variant={
                          selectedUser.status === "actif"
                            ? "outline"
                            : "destructive"
                        }
                        className={
                          selectedUser.status === "actif"
                            ? "bg-green-100 text-green-800"
                            : ""
                        }
                      >
                        {selectedUser.status === "actif" ? "Actif" : "Inactif"}
                      </Badge>
                    </p>
                  </div>
                </div>
              </div>

              {/* Informations personnelles */}
              <div>
                <h3 className="text-lg font-semibold border-b pb-2 mb-3">
                  Informations Personnelles
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Nationalité
                    </p>
                    <p className="text-base">
                      {selectedUser.nationality || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Date de naissance
                    </p>
                    <p className="text-base">{selectedUser.birthDate || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Adresse</p>
                    <p className="text-base">{selectedUser.address || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Wilaya</p>
                    <p className="text-base">{selectedUser.wilaya || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Numéro de pièce d'identité
                    </p>
                    <p className="text-base">{selectedUser.idNumber || "-"}</p>
                  </div>
                </div>
              </div>

              {/* Informations relatives au client */}
              <div>
                <h3 className="text-lg font-semibold border-b pb-2 mb-3">
                  Client Associé
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Client ID
                    </p>
                    <p className="text-base">{selectedUser.clientId || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Créé le</p>
                    <p className="text-base">
                      {selectedUser.createdAt
                        ? selectedUser.createdAt instanceof Date
                          ? selectedUser.createdAt.toLocaleDateString()
                          : new Date(
                              selectedUser.createdAt as any
                            ).toLocaleDateString()
                        : "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Mis à jour le
                    </p>
                    <p className="text-base">
                      {selectedUser.updatedAt
                        ? selectedUser.updatedAt instanceof Date
                          ? selectedUser.updatedAt.toLocaleDateString()
                          : new Date(
                              selectedUser.updatedAt as any
                            ).toLocaleDateString()
                        : "-"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
