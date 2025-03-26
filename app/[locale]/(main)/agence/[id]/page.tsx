"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil } from "lucide-react";
import { agencyData } from "../page";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
export default function AgencyDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const id = Number.parseInt(params.id);

  // Find the agency with the matching ID
  const agency = agencyData.find((a) => a.id === id);

  if (!agency) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Agence non trouvée
          </h1>
          <Button onClick={() => router.push("/agence")}>
            Retour à la liste
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-md shadow-inner bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.push("/agence")}
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Retour</span>
            </Button>
            <h1 className="text-3xl font-bold text-gray-800">
              {agency.libAgence}
            </h1>
          </div>
          <Button className="flex items-center gap-2">
            <Pencil className="h-4 w-4" />
            Modifier
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Informations générales
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Code Agence
                    </p>
                    <p className="text-base">{agency.agenceCode}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Code Banque
                    </p>
                    <p className="text-base">{agency.codeBanque || "-"}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Libelle Agence
                  </p>
                  <p className="text-base">{agency.libAgence}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Code Ville
                    </p>
                    <p className="text-base">{agency.codeVille}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Région d'Agence
                    </p>
                    <p className="text-base">{agency.regionAgence || "-"}</p>
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Ordre de
                    </p>
                    <p className="text-base">{agency.ordreDe}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Par Default
                    </p>
                    <p className="text-base">{agency.parDefault}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Compensation
                    </p>
                    <p className="text-base">{agency.compensation}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Code BC</p>
                  <p className="text-base">{agency.codeBC || "-"}</p>
                </div>
              </div>

              <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">
                Coordonnées
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Adresse</p>
                  <p className="text-base">{agency.addresse || "-"}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Code Postal
                    </p>
                    <p className="text-base">{agency.codePostal || "-"}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Téléphone 1
                    </p>
                    <p className="text-base">{agency.telephone1 || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Téléphone 2
                    </p>
                    <p className="text-base">{agency.telephone2 || "-"}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-base">{agency.email || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Fax</p>
                    <p className="text-base">{agency.fax || "-"}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Telex</p>
                  <p className="text-base">{agency.telex || "-"}</p>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Responsable
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Nom</p>
                    <p className="text-base">{agency.nom}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Prénom</p>
                    <p className="text-base">{agency.prenom}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Fonction</p>
                  <p className="text-base">{agency.fonction || "-"}</p>
                </div>
              </div>

              <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">
                Correspondant
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Nom</p>
                    <p className="text-base">
                      {agency.nomCorrespondant || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Prénom</p>
                    <p className="text-base">
                      {agency.prenomCorrespondant || "-"}
                    </p>
                  </div>
                </div>
              </div>

              <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">
                Commentaire
              </h2>
              <div>
                <p className="text-base">
                  {agency.commentaire || "Aucun commentaire"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* Users Section */}
      <Card className="border-none m-4 p-2">
        <h2 className="text-xl font-semibold m-4">Utilisateurs affecté</h2>
        <div className="overflow-x-auto m-4 rounded-md">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead>Nom</TableHead>
                <TableHead>prenom</TableHead>
                <TableHead>poste</TableHead>
                <TableHead>validation</TableHead>
                <TableHead>Organisme/p.physique</TableHead>
                <TableHead>statut</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>sagi</TableCell>
                <TableCell>salim</TableCell>
                <TableCell>DG</TableCell>
                <TableCell className="text-green-500">validateur 2</TableCell>
                <TableCell>SLIK PIS</TableCell>
                <TableCell>Admin</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    ⋮
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>gadh</TableCell>
                <TableCell>mohamed</TableCell>
                <TableCell>DFC</TableCell>
                <TableCell className="text-amber-500">validateur1</TableCell>
                <TableCell>SLIK PIS</TableCell>
                <TableCell>Mbre</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    ⋮
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>slmi</TableCell>
                <TableCell>kadour</TableCell>
                <TableCell>Négociateur</TableCell>
                <TableCell>Initiateur</TableCell>
                <TableCell>SLIK PIS</TableCell>
                <TableCell>Mbre</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    ⋮
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>Hamid</TableCell>
                <TableCell>Mokrane</TableCell>
                <TableCell>Négociateur</TableCell>
                <TableCell className="text-gray-500">Consultation</TableCell>
                <TableCell>SLIK PIS</TableCell>
                <TableCell>Mbre</TableCell>
                <TableCell>
                  <Button variant="ghost" size="sm">
                    ⋮
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </Card>
      <div className="h-8"></div>
    </div>
  );
}
