"use client";

import { useState, useEffect } from "react";
import {
  CalendarIcon,
  CreditCard,
  Building2,
  User,
  Calendar as CalendarIcon2,
  ArrowLeft,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, parse } from "date-fns";
import { fr } from "date-fns/locale";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Textarea } from "@/components/ui/textarea";

// Same mock data interface and values as in the details page
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

export default function EditCompteTitre({
  params,
}: {
  params: { id: string };
}) {
  const t = useTranslations("CompteEspece");
  const router = useRouter();
  const [activeSection, setActiveSection] = useState("main");
  const [compteTitre, setCompteTitre] = useState<CompteTitre | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Form state
  const [formState, setFormState] = useState({
    id: "",
    codeClient: "",
    nomRaison: "",
    prenomAbrev: "",
    compteEspece: "",
    formeJuridique: "",
    status: "",
    address: "",
    telephone: "",
    email: "",
    numeroCompte: "",
    banque: "",
    agence: "",
    representantLegal: "",
    description: "",
  });

  // Date fields
  const [dateCreation, setDateCreation] = useState<Date | undefined>(undefined);
  const [dateOuverture, setDateOuverture] = useState<Date | undefined>(
    undefined
  );
  const [dateFermeture, setDateFermeture] = useState<Date | undefined>(
    undefined
  );

  // Fetch compte titre data
  useEffect(() => {
    // In a real app, this would be an API call
    const compte = mockCompteTitres.find((c) => c.id === params.id);
    if (compte) {
      setCompteTitre(compte);

      // Initialize form state with existing data
      setFormState({
        id: compte.id,
        codeClient: compte.codeClient,
        nomRaison: compte.nomRaison,
        prenomAbrev: compte.prenomAbrev,
        compteEspece: compte.compteEspece,
        formeJuridique: compte.formeJuridique,
        status: compte.status,
        address: compte.address || "",
        telephone: compte.telephone || "",
        email: compte.email || "",
        numeroCompte: compte.numeroCompte || "",
        banque: compte.banque || "",
        agence: compte.agence || "",
        representantLegal: compte.representantLegal || "",
        description: compte.description || "",
      });

      // Initialize dates
      if (compte.dateCreation) {
        setDateCreation(new Date(compte.dateCreation));
      }
      if (compte.dateOuverture) {
        setDateOuverture(new Date(compte.dateOuverture));
      }
      if (compte.dateFermeture) {
        setDateFermeture(new Date(compte.dateFermeture));
      }

      setIsLoading(false);
    } else {
      // Handle not found
      console.error("Compte titre not found");
      // Redirect to list after a short delay
      setTimeout(() => router.push("/compte-espece"), 2000);
    }
  }, [params.id, router]);

  // Update form state
  const updateForm = (field: string, value: any) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    router.push("/compte-espece");
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save the data via API
    console.log("Form submitted:", formState);

    // Navigate back to the list
    router.push("/compte-espece");
  };

  const SectionHeader = ({
    icon,
    title,
    id,
    badge,
  }: {
    icon: React.ReactNode;
    title: string;
    id: string;
    badge?: string;
  }) => (
    <div
      className={`flex items-center gap-3 mb-6 pb-2 border-b transition-colors cursor-pointer ${
        activeSection === id ? "border-primary" : "border-muted-foreground/20"
      }`}
      onClick={() => setActiveSection(id)}
    >
      <div className={`p-2 rounded-full bg-primary/10 text-primary`}>
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-medium flex items-center gap-2">
          {title}
          {badge && (
            <Badge variant="outline" className="text-xs font-normal py-0">
              {badge}
            </Badge>
          )}
        </h3>
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh]">
        <p className="text-lg">{t("chargement")}</p>
      </div>
    );
  }

  return (
    <Card className="w-full shadow-lg border-0 overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-primary/20 to-primary/5 border-b">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-2xl font-bold text-primary">
              {t("modifierCompte")}
            </CardTitle>
            <CardDescription className="mt-2 text-muted-foreground">
              {compteTitre?.nomRaison}
            </CardDescription>
          </div>
          <Button variant="outline" onClick={handleCancel} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            {t("retourListe")}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-8 space-y-10">
        <form onSubmit={handleSubmit}>
          {/* Main info section */}
          <div className={activeSection === "main" ? "block" : "hidden"}>
            <SectionHeader
              icon={<User className="h-5 w-5" />}
              title={t("infoPrincipales")}
              id="main"
              badge={t("etape1")}
            />
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              <div className="space-y-2">
                <Label htmlFor="id" className="text-sm font-medium">
                  {t("code")}
                </Label>
                <Input
                  id="id"
                  placeholder={t("code")}
                  value={formState.id}
                  disabled
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="codeClient" className="text-sm font-medium">
                  {t("codeClient")}
                </Label>
                <Input
                  id="codeClient"
                  placeholder={t("codeClient")}
                  value={formState.codeClient}
                  onChange={(e) => updateForm("codeClient", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="nomRaison" className="text-sm font-medium">
                  {t("nomRaison")}
                </Label>
                <Input
                  id="nomRaison"
                  placeholder={t("nomRaison")}
                  value={formState.nomRaison}
                  onChange={(e) => updateForm("nomRaison", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="prenomAbrev" className="text-sm font-medium">
                  {t("prenomAbrev")}
                </Label>
                <Input
                  id="prenomAbrev"
                  placeholder={t("prenomAbrev")}
                  value={formState.prenomAbrev}
                  onChange={(e) => updateForm("prenomAbrev", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="compteEspece" className="text-sm font-medium">
                  {t("compteEspece")}
                </Label>
                <Input
                  id="compteEspece"
                  placeholder={t("compteEspece")}
                  value={formState.compteEspece}
                  onChange={(e) => updateForm("compteEspece", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="formeJuridique" className="text-sm font-medium">
                  {t("formeJuridique")}
                </Label>
                <Select
                  value={formState.formeJuridique}
                  onValueChange={(value) => updateForm("formeJuridique", value)}
                >
                  <SelectTrigger id="formeJuridique">
                    <SelectValue placeholder={t("selectionner")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SA">{t("formeOptions.sa")}</SelectItem>
                    <SelectItem value="SARL">
                      {t("formeOptions.sarl")}
                    </SelectItem>
                    <SelectItem value="SAS">{t("formeOptions.sas")}</SelectItem>
                    <SelectItem value="Particulier">
                      {t("natureOptions.particulier")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="status" className="text-sm font-medium">
                  {t("status")}
                </Label>
                <Select
                  value={formState.status}
                  onValueChange={(value) => updateForm("status", value)}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder={t("selectionner")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">{t("actif")}</SelectItem>
                    <SelectItem value="inactive">{t("inactif")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="dateCreation"
                  className="text-sm font-medium flex justify-between"
                >
                  {t("dateCreation")}
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={`w-full justify-start text-left font-normal ${
                        !dateCreation && "text-muted-foreground"
                      }`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateCreation ? (
                        format(dateCreation, "PPP", { locale: fr })
                      ) : (
                        <span>{t("selectionnerDate")}</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateCreation}
                      onSelect={setDateCreation}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="dateOuverture"
                  className="text-sm font-medium flex justify-between"
                >
                  {t("dateOuverture")}
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={`w-full justify-start text-left font-normal ${
                        !dateOuverture && "text-muted-foreground"
                      }`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateOuverture ? (
                        format(dateOuverture, "PPP", { locale: fr })
                      ) : (
                        <span>{t("selectionnerDate")}</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateOuverture}
                      onSelect={setDateOuverture}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label
                  htmlFor="dateFermeture"
                  className="text-sm font-medium flex justify-between"
                >
                  {t("dateFermeture")}
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={`w-full justify-start text-left font-normal ${
                        !dateFermeture && "text-muted-foreground"
                      }`}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {dateFermeture ? (
                        format(dateFermeture, "PPP", { locale: fr })
                      ) : (
                        <span>{t("selectionnerDate")}</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={dateFermeture}
                      onSelect={setDateFermeture}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </motion.div>

            <div className="mt-8">
              <SectionHeader
                icon={<Building2 className="h-5 w-5" />}
                title={t("informationsGenerales")}
                id="general"
                badge={t("etape2")}
              />
            </div>
          </div>

          {/* Banking info section */}
          <div className={activeSection === "general" ? "block" : "hidden"}>
            <SectionHeader
              icon={<Building2 className="h-5 w-5" />}
              title={t("informationsGenerales")}
              id="general"
              badge={t("etape2")}
            />
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="space-y-2">
                <Label
                  htmlFor="representantLegal"
                  className="text-sm font-medium"
                >
                  {t("representantLegal")}
                </Label>
                <Input
                  id="representantLegal"
                  placeholder={t("representantLegal")}
                  value={formState.representantLegal}
                  onChange={(e) =>
                    updateForm("representantLegal", e.target.value)
                  }
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="banque" className="text-sm font-medium">
                  {t("banque")}
                </Label>
                <Input
                  id="banque"
                  placeholder={t("banque")}
                  value={formState.banque}
                  onChange={(e) => updateForm("banque", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="agence" className="text-sm font-medium">
                  {t("agence")}
                </Label>
                <Input
                  id="agence"
                  placeholder={t("agence")}
                  value={formState.agence}
                  onChange={(e) => updateForm("agence", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="numeroCompte" className="text-sm font-medium">
                  {t("numeroCompte")}
                </Label>
                <Input
                  id="numeroCompte"
                  placeholder={t("numeroCompte")}
                  value={formState.numeroCompte}
                  onChange={(e) => updateForm("numeroCompte", e.target.value)}
                />
              </div>
              <div className="col-span-1 md:col-span-2 space-y-2">
                <Label htmlFor="address" className="text-sm font-medium">
                  {t("adresse")}
                </Label>
                <Input
                  id="address"
                  placeholder={t("adresse")}
                  value={formState.address}
                  onChange={(e) => updateForm("address", e.target.value)}
                />
              </div>
            </motion.div>

            <div className="mt-8">
              <SectionHeader
                icon={<CreditCard className="h-5 w-5" />}
                title={t("coordonnees")}
                id="contact"
                badge={t("etape3")}
              />
            </div>
          </div>

          {/* Contact section */}
          <div className={activeSection === "contact" ? "block" : "hidden"}>
            <SectionHeader
              icon={<CreditCard className="h-5 w-5" />}
              title={t("coordonnees")}
              id="contact"
              badge={t("etape3")}
            />
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-6"
            >
              <div className="space-y-2">
                <Label htmlFor="telephone" className="text-sm font-medium">
                  {t("telephone")}
                </Label>
                <Input
                  id="telephone"
                  placeholder={t("telephone")}
                  value={formState.telephone}
                  onChange={(e) => updateForm("telephone", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium">
                  {t("email")}
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder={t("email")}
                  value={formState.email}
                  onChange={(e) => updateForm("email", e.target.value)}
                />
              </div>
              <div className="col-span-1 md:col-span-2 space-y-2">
                <Label htmlFor="description" className="text-sm font-medium">
                  {t("description")}
                </Label>
                <Textarea
                  id="description"
                  placeholder={t("description")}
                  rows={4}
                  value={formState.description}
                  onChange={(e) => updateForm("description", e.target.value)}
                />
              </div>
            </motion.div>
          </div>

          <div className="flex items-center justify-end gap-2 mt-10">
            <Button
              variant="outline"
              type="button"
              onClick={handleCancel}
              className="gap-1"
            >
              {t("annuler")}
            </Button>
            <Button type="submit" className="gap-1">
              <Save className="h-4 w-4" />
              {t("enregistrer")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
