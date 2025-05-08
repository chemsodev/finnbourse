"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronLeft, Edit, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { getEmission, deleteEmission } from "@/app/actions/emissions-actions";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import Loading from "@/components/ui/loading";

export default function EmissionDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  const locale = params?.locale as string;

  const [emission, setEmission] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);

  useEffect(() => {
    async function fetchEmission() {
      try {
        const data = await getEmission(id);
        setEmission(data);
      } catch (error) {
        console.error("Failed to fetch emission:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchEmission();
  }, [id]);

  const handleDelete = async () => {
    try {
      await deleteEmission(id);
      router.push(`/${locale}/emissions`);
    } catch (error) {
      console.error("Failed to delete emission:", error);
    }
  };

  const formatDateString = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: fr });
    } catch (error) {
      return dateString;
    }
  };

  if (loading) {
    return <Loading className="min-h-[400px]" />;
  }

  if (!emission) {
    return (
      <Card className="border-0 shadow-sm bg-white">
        <CardContent className="flex justify-center items-center h-52">
          <p>Émission non trouvée</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-sm bg-white">
      <CardHeader className="pb-2 border-b">
        <CardTitle className="text-3xl font-bold text-secondary">
          Détails de l'Émission
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Code ISIN
            </h3>
            <p className="text-lg font-medium mt-1">{emission.codeISIN}</p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Émetteur
            </h3>
            <p className="text-lg font-medium mt-1">{emission.issuer}</p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Agence Centralisatrice
            </h3>
            <p className="text-lg font-medium mt-1">
              {emission.centralizingAgency || "N/A"}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Numéro de Compte
            </h3>
            <p className="text-lg font-medium mt-1">
              {emission.viewAccountNumber || "N/A"}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Type de Diffusion
            </h3>
            <p className="text-lg font-medium mt-1">
              {emission.typeOfBroadcast || "N/A"}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Montant d'Émission
            </h3>
            <p className="text-lg font-medium mt-1">
              {emission.issueAmount || "N/A"}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Date d'Émission
            </h3>
            <p className="text-lg font-medium mt-1">
              {formatDateString(emission.issueDate)}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Date d'Échéance
            </h3>
            <p className="text-lg font-medium mt-1">
              {formatDateString(emission.dueDate)}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Durée</h3>
            <p className="text-lg font-medium mt-1">
              {emission.duration || "N/A"}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Approbation COSOB
            </h3>
            <p className="text-lg font-medium mt-1">
              {emission.cosobApproval || "N/A"}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Chef de File
            </h3>
            <p className="text-lg font-medium mt-1">
              {emission.leader || "N/A"}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Co-Chef de File
            </h3>
            <p className="text-lg font-medium mt-1">
              {emission.coLead || "N/A"}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Membre N°01
            </h3>
            <p className="text-lg font-medium mt-1">
              {emission.memberNo01 || "N/A"}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Membre N°02
            </h3>
            <p className="text-lg font-medium mt-1">
              {emission.memberNo02 || "N/A"}
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Membre N°03
            </h3>
            <p className="text-lg font-medium mt-1">
              {emission.memberNo03 || "N/A"}
            </p>
          </div>
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">
              Membre N°04
            </h3>
            <p className="text-lg font-medium mt-1">
              {emission.memberNo04 || "N/A"}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="pt-6 flex justify-between">
        <Button
          variant="outline"
          onClick={() => router.push(`/${locale}/emissions`)}
          className="flex items-center"
        >
          <ChevronLeft className="mr-2 h-4 w-4" /> Retour
        </Button>
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => router.push(`/${locale}/emissions/edit/${id}`)}
            className="flex items-center"
          >
            <Edit className="mr-2 h-4 w-4" /> Modifier
          </Button>
          <Button
            variant="destructive"
            onClick={() => setDeleteDialogOpen(true)}
            className="flex items-center"
          >
            <Trash2 className="mr-2 h-4 w-4" /> Supprimer
          </Button>
        </div>
      </CardFooter>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Confirmer la suppression</AlertDialogTitle>
            <AlertDialogDescription>
              Êtes-vous sûr de vouloir supprimer cette émission ? Cette action
              ne peut pas être annulée.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Annuler</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Supprimer
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
