"use client";

import { useState, useEffect } from "react";
import { ArrowLeft, Download, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";
import { Separator } from "@/components/ui/separator";

// Mock data for comptes titres - in a real app this would come from an API
interface CompteTitre {
  id: string;
  codeClient: string;
  nomRaison: string;
  prenomAbrev: string;
  compteEspece: string;
  formeJuridique: string;
  dateCreation: string;
  dateUpdate: string;
  status: "active" | "inactive";
  // Extended data for details view
  address?: string;
  telephone?: string;
  email?: string;
  numeroCompte?: string;
  banque?: string;
  agence?: string;
  representantLegal?: string;
  dateOuverture?: string;
  dateFermeture?: string;
  description?: string;
}

const mockCompteTitres: CompteTitre[] = [
  {
    id: "CT001",
    codeClient: "CL001",
    nomRaison: "Société Financière Algérienne",
    prenomAbrev: "SFA",
    compteEspece: "CE001",
    formeJuridique: "SA",
    dateCreation: "2023-06-15",
    dateUpdate: "2023-10-22",
    status: "active",
    address: "15 Rue de la Liberté, Alger, Algérie",
    telephone: "+213 21 63 45 78",
    email: "contact@sfa.dz",
    numeroCompte: "1234567890",
    banque: "Banque Nationale d'Algérie",
    agence: "Alger Centre",
    representantLegal: "Mohamed Kader",
    dateOuverture: "2023-06-20",
    dateFermeture: "",
    description:
      "Société spécialisée dans l'investissement financier et la gestion d'actifs. Portefeuille diversifié incluant des actions nationales et obligations d'État.",
  },
  {
    id: "CT002",
    codeClient: "CL002",
    nomRaison: "Hamid Bennaceur",
    prenomAbrev: "H.B",
    compteEspece: "CE002",
    formeJuridique: "Particulier",
    dateCreation: "2023-07-20",
    dateUpdate: "2023-11-05",
    status: "active",
    address: "45 Boulevard des Martyrs, Oran, Algérie",
    telephone: "+213 41 36 12 98",
    email: "hamid.bennaceur@gmail.com",
    numeroCompte: "9876543210",
    banque: "Banque Extérieure d'Algérie",
    agence: "Oran Ville",
    dateOuverture: "2023-07-25",
    dateFermeture: "",
    description:
      "Investisseur particulier avec un intérêt pour les valeurs boursières du secteur énergétique et technologique.",
  },
  {
    id: "CT003",
    codeClient: "CL003",
    nomRaison: "Entreprise Nationale des Industries Électroniques",
    prenomAbrev: "ENIE",
    compteEspece: "CE003",
    formeJuridique: "SARL",
    dateCreation: "2023-05-10",
    dateUpdate: "2023-09-18",
    status: "inactive",
    address: "Zone Industrielle, Sidi Bel Abbès, Algérie",
    telephone: "+213 48 55 67 89",
    email: "contact@enie.dz",
    numeroCompte: "5678901234",
    banque: "Crédit Populaire d'Algérie",
    agence: "Sidi Bel Abbès",
    representantLegal: "Ahmed Tarek",
    dateOuverture: "2023-05-15",
    dateFermeture: "2023-09-15",
    description:
      "Entreprise publique spécialisée dans la fabrication de produits électroniques et informatiques. Compte inactif suite à une restructuration interne.",
  },
];

export default function CompteTitreDetails({
  params,
}: {
  params: { id: string };
}) {
  const t = useTranslations("CompteEspece");
  const router = useRouter();
  const [compteTitre, setCompteTitre] = useState<CompteTitre | null>(null);

  // Fetch compte titre data
  useEffect(() => {
    // In a real app, this would be an API call
    const compte = mockCompteTitres.find((c) => c.id === params.id);
    if (compte) {
      setCompteTitre(compte);
    } else {
      // Handle not found
      console.error("Compte titre not found");
      // Redirect to list after a short delay
      setTimeout(() => router.push("/compte-espece"), 2000);
    }
  }, [params.id, router]);

  const handleEdit = () => {
    router.push(`/compte-espece/edit/${params.id}`);
  };

  const handleBack = () => {
    router.push("/compte-espece");
  };

  if (!compteTitre) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <p className="text-lg">{t("chargement")}</p>
      </div>
    );
  }

  const InfoItem = ({
    label,
    value,
  }: {
    label: string;
    value: string | undefined;
  }) => (
    <div className="space-y-1">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="font-medium">{value || "—"}</p>
    </div>
  );

  return (
    <Card className="w-full shadow-lg border-0 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/20 to-primary/5 border-b">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={handleBack}
              className="rounded-full h-10 w-10"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <CardTitle className="text-2xl font-bold text-primary">
                {compteTitre.nomRaison}
              </CardTitle>
              <CardDescription className="mt-1 text-muted-foreground flex items-center gap-2">
                {compteTitre.id} • {compteTitre.prenomAbrev} •
                <Badge
                  variant="outline"
                  className={`${
                    compteTitre.status === "active"
                      ? "bg-green-50 text-green-700 hover:bg-green-50 border-green-200"
                      : "bg-gray-50 text-gray-700 hover:bg-gray-50 border-gray-200"
                  }`}
                >
                  {compteTitre.status === "active" ? t("actif") : t("inactif")}
                </Badge>
              </CardDescription>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="gap-2" onClick={handleEdit}>
              <Edit className="h-4 w-4" />
              {t("edit")}
            </Button>
            <Button className="gap-2">
              <Download className="h-4 w-4" />
              {t("telecharger")}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-8 space-y-10">
        {/* Main info section */}
        <div>
          <h3 className="text-lg font-semibold mb-4">{t("infoPrincipales")}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoItem label={t("codeClient")} value={compteTitre.codeClient} />
            <InfoItem
              label={t("formeJuridique")}
              value={compteTitre.formeJuridique}
            />
            <InfoItem
              label={t("compteEspece")}
              value={compteTitre.compteEspece}
            />
            <InfoItem
              label={t("dateCreation")}
              value={
                compteTitre.dateCreation
                  ? new Date(compteTitre.dateCreation).toLocaleDateString()
                  : undefined
              }
            />
            <InfoItem
              label={t("dateOuverture")}
              value={
                compteTitre.dateOuverture
                  ? new Date(compteTitre.dateOuverture).toLocaleDateString()
                  : undefined
              }
            />
            <InfoItem
              label={t("dateFermeture")}
              value={
                compteTitre.dateFermeture
                  ? new Date(compteTitre.dateFermeture).toLocaleDateString()
                  : undefined
              }
            />
          </div>
        </div>

        <Separator />

        {/* Contact info section */}
        <div>
          <h3 className="text-lg font-semibold mb-4">{t("coordonnees")}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoItem label={t("adresse")} value={compteTitre.address} />
            <InfoItem label={t("telephone")} value={compteTitre.telephone} />
            <InfoItem label={t("email")} value={compteTitre.email} />
          </div>
        </div>

        <Separator />

        {/* Banking info section */}
        <div>
          <h3 className="text-lg font-semibold mb-4">{t("infoBancaires")}</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <InfoItem label={t("banque")} value={compteTitre.banque} />
            <InfoItem label={t("agence")} value={compteTitre.agence} />
            <InfoItem
              label={t("numeroCompte")}
              value={compteTitre.numeroCompte}
            />
            <InfoItem
              label={t("representantLegal")}
              value={compteTitre.representantLegal}
            />
          </div>
        </div>

        <Separator />

        {/* Description section */}
        {compteTitre.description && (
          <div>
            <h3 className="text-lg font-semibold mb-4">{t("description")}</h3>
            <div className="bg-muted/20 p-4 rounded-md">
              <p>{compteTitre.description}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
