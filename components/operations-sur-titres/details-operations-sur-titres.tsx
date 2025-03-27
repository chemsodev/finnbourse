"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { ArrowLeft, Edit, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  getOstAnnouncementById,
  deleteOstAnnouncement,
} from "@/lib/ost-service";
import type { OstAnnouncement } from "@/lib/interfaces";

interface DetailsOperationsSurTitresProps {
  id: string;
}

export function DetailsOperationsSurTitres({
  id,
}: DetailsOperationsSurTitresProps) {
  const router = useRouter();
  const [announcement, setAnnouncement] = useState<OstAnnouncement | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncement = async () => {
      try {
        setIsLoading(true);
        const data = await getOstAnnouncementById(id);
        if (data) {
          setAnnouncement(data);
        } else {
          router.push("/annonce-ost");
        }
      } catch (error) {
        console.error("Erreur lors du chargement de l'annonce OST:", error);
        router.push("/annonce-ost");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnnouncement();
  }, [id, router]);

  const handleDelete = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette annonce?")) {
      try {
        await deleteOstAnnouncement(id);
        router.push("/annonce-ost");
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
      }
    }
  };

  const handleEdit = () => {
    router.push(`/annonce-ost/modifier/${id}`);
  };

  const handleBack = () => {
    router.push("/annonce-ost");
  };

  const getStatusBadge = (dateDebut: Date, dateFin: Date) => {
    const now = new Date();
    if (now < new Date(dateDebut)) {
      return (
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
          À venir
        </Badge>
      );
    } else if (now > new Date(dateFin)) {
      return (
        <Badge variant="outline" className="bg-gray-100 text-gray-800">
          Terminé
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800">
          En cours
        </Badge>
      );
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!announcement) {
    return null;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" onClick={handleBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <CardTitle className="text-2xl font-bold text-secondary">
            Détails de l'Annonce d'OST
          </CardTitle>
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleEdit}
            className="flex items-center gap-2"
          >
            <Edit className="h-4 w-4" />
            <span>Modifier</span>
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            <span>Supprimer</span>
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Titre Principal
              </h3>
              <p className="text-lg font-semibold">
                {announcement.titrePrincipal}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Description</h3>
              <p className="text-lg">{announcement.descriptionOst}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Type d'OST</h3>
              <p className="text-lg">{announcement.typeOst}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Événement</h3>
              <p className="text-lg capitalize">{announcement.evenement}</p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">Statut</h3>
              <div className="mt-1">
                {getStatusBadge(announcement.dateDebut, announcement.dateFin)}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Période</h3>
              <p className="text-lg">
                Du{" "}
                {format(new Date(announcement.dateDebut), "dd MMMM yyyy", {
                  locale: fr,
                })}{" "}
                au{" "}
                {format(new Date(announcement.dateFin), "dd MMMM yyyy", {
                  locale: fr,
                })}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Date Valeur/Paiement
              </h3>
              <p className="text-lg">
                {format(
                  new Date(announcement.dateValeurPaiement),
                  "dd MMMM yyyy",
                  { locale: fr }
                )}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-500">
                Rappel / Fréquence
              </h3>
              <p className="text-lg">
                {format(new Date(announcement.rappel), "dd MMMM yyyy", {
                  locale: fr,
                })}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t pt-6">
          <h3 className="text-lg font-semibold mb-4">Détails financiers</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="text-sm font-medium text-gray-500">
                Titre Résultat
              </h4>
              <p>{announcement.titreResultat}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">
                Action Ancienne
              </h4>
              <p>{announcement.actionAnc}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">
                Nouvelle Action
              </h4>
              <p>{announcement.nelleAction}</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">
                Montant unitaire
              </h4>
              <p>{announcement.montantUnitaire} DZD</p>
            </div>
            <div>
              <h4 className="text-sm font-medium text-gray-500">
                Montant Brut
              </h4>
              <p>{announcement.montantBrut} DZD</p>
            </div>
          </div>
        </div>

        {announcement.commentaire && (
          <div className="mt-8 border-t pt-6">
            <h3 className="text-lg font-semibold mb-4">Commentaire</h3>
            <p className="whitespace-pre-line">{announcement.commentaire}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
