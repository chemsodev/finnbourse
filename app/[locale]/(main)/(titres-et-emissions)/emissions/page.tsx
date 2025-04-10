"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, MoreHorizontal, Edit, Trash2, Eye, Search } from "lucide-react";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
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
import { getEmissions, deleteEmission } from "@/app/actions/emissions-actions";
import type { Emission } from "@/lib/interfaces";

export default function EmissionsPage() {
  const router = useRouter();
  const { locale } = useParams();
  const [emissions, setEmissions] = useState<Emission[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [emissionToDelete, setEmissionToDelete] = useState<string | null>(null);

  // Fetch emissions data
  useEffect(() => {
    async function loadEmissions() {
      try {
        const data = await getEmissions();
        setEmissions(data);
      } catch (error) {
        console.error("Failed to load emissions:", error);
      } finally {
        setLoading(false);
      }
    }

    loadEmissions();
  }, []);

  // Filter emissions based on search query
  const filteredEmissions = emissions.filter(
    (emission) =>
      emission.codeISIN.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emission.issuer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Handle edit button click
  const handleEditClick = (emission: Emission) => {
    router.push(`/${locale}/emissions/edit/${emission.id}`);
  };

  // Handle delete button click
  const handleDeleteClick = (id: string) => {
    setEmissionToDelete(id);
    setDeleteDialogOpen(true);
  };

  // Confirm delete action
  const confirmDelete = async () => {
    if (emissionToDelete) {
      try {
        await deleteEmission(emissionToDelete);
        setEmissions(emissions.filter((e) => e.id !== emissionToDelete));
      } catch (error) {
        console.error("Failed to delete emission:", error);
      }
      setDeleteDialogOpen(false);
      setEmissionToDelete(null);
    }
  };

  // Format date for display
  const formatDateString = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: fr });
    } catch (error) {
      return dateString;
    }
  };

  return (
    <Card className="border-0 shadow-sm bg-white">
      <CardHeader className="pb-2 border-b flex flex-row items-center justify-between">
        <CardTitle className="text-3xl font-bold text-secondary">
          Émissions
        </CardTitle>
        <Link href={`/${locale}/emissions/form`}>
          <Button className="bg-primary hover:bg-primary/90">
            <Plus className="mr-2 h-4 w-4" /> Nouvelle Émission
          </Button>
        </Link>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="flex items-center mb-6">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher par ISIN ou émetteur..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-52">
            <p>Chargement des données...</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Code ISIN</TableHead>
                  <TableHead>Émetteur</TableHead>
                  <TableHead>Date d'Émission</TableHead>
                  <TableHead>Date d'Échéance</TableHead>
                  <TableHead>Montant</TableHead>
                  <TableHead>Chef de File</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredEmissions.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center">
                      Aucune émission trouvée
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredEmissions.map((emission) => (
                    <TableRow key={emission.id}>
                      <TableCell className="font-medium">
                        {emission.codeISIN}
                      </TableCell>
                      <TableCell>{emission.issuer}</TableCell>
                      <TableCell>
                        {formatDateString(emission.issueDate)}
                      </TableCell>
                      <TableCell>
                        {formatDateString(emission.dueDate)}
                      </TableCell>
                      <TableCell>{emission.issueAmount}</TableCell>
                      <TableCell>{emission.leader}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem
                              onClick={() =>
                                router.push(
                                  `/${locale}/emissions/${emission.id}`
                                )
                              }
                            >
                              <Eye className="mr-2 h-4 w-4" />
                              Voir
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleEditClick(emission)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Modifier
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDeleteClick(emission.id)}
                              className="text-red-600"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Supprimer
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>

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
              onClick={confirmDelete}
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
