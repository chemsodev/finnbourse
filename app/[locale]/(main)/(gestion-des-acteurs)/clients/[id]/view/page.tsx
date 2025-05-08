"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Users, Building2, Download, Loader2 } from "lucide-react";
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

export default function ViewClientPage() {
  const router = useRouter();
  const { toast } = useToast();
  const params = useParams();
  const [isLoading, setIsLoading] = useState(true);
  const [client, setClient] = useState<Client | null>(null);
  const [users, setUsers] = useState<ClientUser[]>([]);
  const [documents, setDocuments] = useState<ClientDocument[]>([]);
  const [downloadingDocId, setDownloadingDocId] = useState<number | null>(null);

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
      setDownloadingDocId(document.documentId);
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

  if (isLoading) return <div>Chargement...</div>;
  if (!client) return <div>Client non trouvé</div>;

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Détails du Client</h1>
        <Button onClick={() => router.push("/clients")} variant="outline">
          Retour
        </Button>
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
              <div className="grid grid-cols-2 gap-4">
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
                      : "Personne Morale"}
                  </p>
                </div>
                <div>
                  <p className="font-semibold">Wilaya</p>
                  <p>{client.wilaya}</p>
                </div>
                <div>
                  <p className="font-semibold">Source du Client</p>
                  <p>{client.clientSource === "extern" ? "Externe" : "CPA"}</p>
                </div>
                <div>
                  <p className="font-semibold">Statut</p>
                  <p>{client.status}</p>
                </div>
                {client.clientType === "personne_physique" ? (
                  <>
                    <div>
                      <p className="text-sm font-medium">
                        Type de pièce d'identité
                      </p>
                      <p className="text-sm text-gray-500">{client.idType}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">
                        Numéro de pièce d'identité
                      </p>
                      <p className="text-sm text-gray-500">{client.idNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">NIN</p>
                      <p className="text-sm text-gray-500">{client.nin}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Nationalité</p>
                      <p className="text-sm text-gray-500">
                        {client.nationalite}
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <p className="text-sm font-medium">Raison sociale</p>
                      <p className="text-sm text-gray-500">
                        {client.raisonSociale}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">NIF</p>
                      <p className="text-sm text-gray-500">{client.nif}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Numéro RC</p>
                      <p className="text-sm text-gray-500">
                        {client.regNumber}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Forme juridique</p>
                      <p className="text-sm text-gray-500">
                        {client.legalForm}
                      </p>
                    </div>
                  </>
                )}
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
              <div className="space-y-4">
                {users.map((user, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="font-semibold">Nom/Prénom</p>
                        <p>{user.firstName}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Nom de jeune fille</p>
                        <p>{user.lastName}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Rôle</p>
                        <p>{user.role}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Adresse</p>
                        <p>{user.address}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Wilaya</p>
                        <p>{user.wilaya}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Nationalité</p>
                        <p>{user.nationality}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Date de naissance</p>
                        <p>{user.birthDate}</p>
                      </div>
                      <div>
                        <p className="font-semibold">
                          Numéro de pièce d'identité
                        </p>
                        <p>{user.idNumber}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Propriétaire</p>
                        <p>{user.isOwner ? "Oui" : "Non"}</p>
                      </div>
                      <div>
                        <p className="font-semibold">Mandataire</p>
                        <p>{user.isMandatory ? "Oui" : "Non"}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
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
    </div>
  );
}
