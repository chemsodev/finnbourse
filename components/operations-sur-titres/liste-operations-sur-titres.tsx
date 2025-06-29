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
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getOstAnnouncements, deleteOstAnnouncement } from "@/lib/ost-service";
import type { OstAnnouncement } from "@/lib/interfaces";
import { useTranslations } from "next-intl";

type SortField = 'titre' | 'typeOst' | 'periode' | 'statut';
type SortDirection = 'asc' | 'desc';

export function ListeOperationsSurTitres() {
  const t = useTranslations("OperationsSurTitres");
  const router = useRouter();
  const [announcements, setAnnouncements] = useState<OstAnnouncement[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [sortField, setSortField] = useState<SortField>('titre');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getSortIcon = (field: SortField) => {
    if (sortField !== field) {
      return <ChevronDown className="ml-2 h-4 w-4 opacity-50" />;
    }
    return sortDirection === 'asc' ? (
      <ChevronUp className="ml-2 h-4 w-4" />
    ) : (
      <ChevronDown className="ml-2 h-4 w-4" />
    );
  };

  const sortAnnouncements = (data: OstAnnouncement[]) => {
    return [...data].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      switch (sortField) {
        case 'titre':
          aValue = a.titrePrincipal;
          bValue = b.titrePrincipal;
          break;
        case 'typeOst':
          aValue = a.typeOst;
          bValue = b.typeOst;
          break;
        case 'periode':
          aValue = new Date(a.dateDebut);
          bValue = new Date(b.dateDebut);
          break;
        case 'statut':
          const now = new Date();
          const aStart = new Date(a.dateDebut);
          const aEnd = new Date(a.dateFin);
          const bStart = new Date(b.dateDebut);
          const bEnd = new Date(b.dateFin);
          
          const getStatusValue = (start: Date, end: Date) => {
            if (now < start) return 0; // à venir
            if (now > end) return 2; // terminé
            return 1; // en cours
          };
          
          aValue = getStatusValue(aStart, aEnd);
          bValue = getStatusValue(bStart, bEnd);
          break;
        default:
          return 0;
      }

      if (typeof aValue === 'string' && typeof bValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortDirection === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortDirection === 'asc' ? 1 : -1;
      return 0;
    });
  };

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
    if (window.confirm(t("confirmationSuppression"))) {
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

  const sortedAnnouncements = sortAnnouncements(filteredAnnouncements);

  const getStatusBadge = (dateDebut: Date, dateFin: Date) => {
    const now = new Date();
    if (now < new Date(dateDebut)) {
      return (
        <Badge variant="outline" className="bg-yellow-100 text-yellow-800">
          {t("aVenir")}
        </Badge>
      );
    } else if (now > new Date(dateFin)) {
      return (
        <Badge variant="outline" className="bg-gray-100 text-gray-800">
          {t("termine")}
        </Badge>
      );
    } else {
      return (
        <Badge variant="outline" className="bg-green-100 text-green-800">
          {t("enCours")}
        </Badge>
      );
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle className="text-2xl font-bold text-secondary">
          {t("listeTitle")}
        </CardTitle>
        <Button onClick={handleAddNew} className="flex items-center gap-2">
          <Plus size={16} />
          <span>{t("ajouter")}</span>
        </Button>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between mb-6">
          <div className="relative w-full max-w-sm">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder={t("rechercher")}
              className="pl-8 w-full"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Button variant="outline" className="flex items-center gap-2">
            <FileDown size={16} />
            <span>{t("exporter")}</span>
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : sortedAnnouncements.length === 0 ? (
          <div className="text-center py-10">
            <p className="text-gray-500">{t("aucuneAnnonce")}</p>
          </div>
        ) : (
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('titre')}
                  >
                    <div className="flex items-center">
                      {t("titre")}
                      {getSortIcon('titre')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('typeOst')}
                  >
                    <div className="flex items-center">
                      {t("typeOst")}
                      {getSortIcon('typeOst')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('periode')}
                  >
                    <div className="flex items-center">
                      {t("periode")}
                      {getSortIcon('periode')}
                    </div>
                  </TableHead>
                  <TableHead 
                    className="cursor-pointer"
                    onClick={() => handleSort('statut')}
                  >
                    <div className="flex items-center">
                      {t("statut")}
                      {getSortIcon('statut')}
                    </div>
                  </TableHead>
                  <TableHead className="text-right">{t("actions")}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedAnnouncements?.map((announcement) => (
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
                            <span className="sr-only">{t("ouvrirMenu")}</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem
                            onClick={() => handleView(announcement.id)}
                            className="cursor-pointer"
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            <span>{t("voir")}</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleEdit(announcement.id)}
                            className="cursor-pointer"
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            <span>{t("modifier")}</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleDelete(announcement.id)}
                            className="cursor-pointer text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>{t("supprimer")}</span>
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
