"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import {
  Plus,
  MoreHorizontal,
  Edit,
  Trash2,
  Eye,
  Search,
  FileDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getOstAnnouncements, deleteOstAnnouncement } from "@/lib/ost-service";
import type { OstAnnouncement } from "@/lib/interfaces";

export function ListeOperationsSurTitres() {
  const router = useRouter();
  const [announcements, setAnnouncements] = useState<OstAnnouncement[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        setIsLoading(true);
        const data = await getOstAnnouncements();
        setAnnouncements(data);
      } catch (error) {
        console.error("Erreur lors du chargement des annonces OST:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnnouncements();
  }, []);

  const handleDelete = async (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette annonce?")) {
      try {
        await deleteOstAnnouncement(id);
        setAnnouncements(
          announcements.filter((announcement) => announcement.id !== id)
        );
      } catch (error) {
        console.error("Erreur lors de la suppression:", error);
      }
    }
  };

  const handleEdit = (id: string) => {
    router.push(`/annonce-ost/modifier/${id}`);
  };

  const handleView = (id: string) => {
    router.push(`/annonce-ost/details/${id}`);
  };

  const handleAddNew = () => {
    router.push("/annonce-ost/programmer");
  };

  const filteredAnnouncements = announcements.filter(
    (announcement) =>
      announcement.descriptionOst
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      announcement.titrePrincipal
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      announcement.typeOst.toLowerCase().includes(searchTerm.toLowerCase())
  );

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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-bold text-secondary">
          Liste des Annonces d'OST
        </CardTitle>
        <Button onClick={handleAddNew} className="flex items-center gap-2">
          <Plus size={16} />
          <span>Ajouter</span>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-6">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Rechercher..."
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <FileDown size={16} />
            <span>Exporter</span>
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : filteredAnnouncements.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">Aucune annonce d'OST trouvée</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Titre</TableHead>
                  <TableHead>Type d'OST</TableHead>

                  <TableHead>Période</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredAnnouncements.map((announcement) => (
                  <TableRow key={announcement.id}>
                    <TableCell className="font-medium">
                      {announcement.titrePrincipal}
                    </TableCell>
                    <TableCell>{announcement.typeOst}</TableCell>

                    <TableCell>
                      {format(new Date(announcement.dateDebut), "dd/MM/yyyy", {
                        locale: fr,
                      })}{" "}
                      -{" "}
                      {format(new Date(announcement.dateFin), "dd/MM/yyyy", {
                        locale: fr,
                      })}
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(
                        announcement.dateDebut,
                        announcement.dateFin
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Ouvrir menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleView(announcement.id)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            <span>Voir</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEdit(announcement.id)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            <span>Modifier</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(announcement.id)}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>Supprimer</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
