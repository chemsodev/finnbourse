"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil } from "lucide-react";
import { accountHolderData } from "../page";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card } from "@/components/ui/card";
export default function TeneurComptesTitresDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const router = useRouter();
  const id = parseInt(params.id);

  // Find the account holder with the matching ID
  const holder = accountHolderData.find((h) => h.id === id);

  if (!holder) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Teneur de compte-titres non trouvé
          </h1>
          <Button onClick={() => router.push("/tcc")}>Retour à la liste</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={() => router.push("/teneur-compte-titres")}
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="sr-only">Retour</span>
            </Button>
            <h1 className="text-3xl font-bold text-gray-800">
              {holder.libelle}
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
                    <p className="text-sm font-medium text-gray-500">Code</p>
                    <p className="text-base">{holder.code}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Type</p>
                    <p className="text-base">{holder.typeCompte || "-"}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Libellé</p>
                  <p className="text-base">{holder.libelle}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Statut</p>
                    <p className="text-base">{holder.statut}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Date de Création
                    </p>
                    <p className="text-base">{holder.dateCreation || "-"}</p>
                  </div>
                </div>
              </div>

              <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">
                Coordonnées
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Adresse</p>
                  <p className="text-base">{holder.adresse}</p>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Code Postal
                    </p>
                    <p className="text-base">{holder.codePostal}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Ville</p>
                    <p className="text-base">{holder.ville}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Pays</p>
                    <p className="text-base">{holder.pays}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Téléphone
                    </p>
                    <p className="text-base">{holder.telephone}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-base">{holder.email}</p>
                  </div>
                </div>
              </div>

              <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">
                Contact principal
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Nom</p>
                    <p className="text-base">{holder.contactNom || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Prénom</p>
                    <p className="text-base">{holder.contactPrenom || "-"}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Téléphone
                    </p>
                    <p className="text-base">
                      {holder.contactTelephone || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Email</p>
                    <p className="text-base">{holder.contactEmail || "-"}</p>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Informations bancaires
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Code SWIFT/BIC
                    </p>
                    <p className="text-base">{holder.swift || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Devise</p>
                    <p className="text-base">{holder.devise || "-"}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">IBAN</p>
                  <p className="text-base">{holder.iban || "-"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Numéro de Compte
                  </p>
                  <p className="text-base">{holder.numeroCompte || "-"}</p>
                </div>
              </div>

              <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">
                Informations réglementaires
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Numéro d'Agrément
                    </p>
                    <p className="text-base">{holder.numeroAgrement || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Date d'Agrément
                    </p>
                    <p className="text-base">{holder.dateAgrement || "-"}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">
                    Autorité de Surveillance
                  </p>
                  <p className="text-base">
                    {holder.autoriteSurveillance || "-"}
                  </p>
                </div>
              </div>

              <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">
                Correspondant
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Code Correspondant
                    </p>
                    <p className="text-base">
                      {holder.codeCorrespondant || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Nom Correspondant
                    </p>
                    <p className="text-base">
                      {holder.nomCorrespondant || "-"}
                    </p>
                  </div>
                </div>
              </div>

              <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">
                Commissions
              </h2>
              <div className="grid grid-cols-1 gap-4">
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Commission Fixe
                    </p>
                    <p className="text-base">{holder.commissionFixe || "-"}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Commission Variable (%)
                    </p>
                    <p className="text-base">
                      {holder.commissionVariable || "-"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">
                      Taux TVA (%)
                    </p>
                    <p className="text-base">{holder.tauxTva || "-"}</p>
                  </div>
                </div>
              </div>

              <h2 className="text-xl font-semibold mt-8 mb-4 text-gray-800">
                Commentaire
              </h2>
              <div>
                <p className="text-base">
                  {holder.commentaire || "Aucun commentaire"}
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
