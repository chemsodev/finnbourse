"use client";

import { useState, useEffect } from "react";
import {
  CalendarIcon,
  CreditCard,
  Building2,
  User,
  Calendar as CalendarIcon2,
  ArrowLeft,
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
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";

export default function NouveauCompteTitre() {
  const t = useTranslations("CompteEspece");
  const router = useRouter();
  const [date, setDate] = useState<Date>();
  const [openDate, setOpenDate] = useState<Date>();
  const [closeDate, setCloseDate] = useState<Date>();
  const [updateDate, setUpdateDate] = useState<Date>();
  const [birthDate, setBirthDate] = useState<Date>();
  const [activeSection, setActiveSection] = useState("main");

  // Form state
  const [formState, setFormState] = useState({
    natureClient: "",
    nomRaison: "",
    prenomAbrev: "",
    formeJuridique: "",
    categorieCompte: "",
    banque: "",
    agence: "",
    // RIB fields
    ribBanque: "",
    ribAgence: "",
    ribCompte: "",
    ribCle: "",
    agenceSaisie: "",
  });

  // rib Complet (calculated field)
  const [ribComplet, setRibComplet] = useState("");

  // Update form state
  const updateForm = (field: string, value: any) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  // Calculate RIB when RIB fields change
  useEffect(() => {
    const { ribBanque, ribAgence, ribCompte, ribCle } = formState;
    if (ribBanque || ribAgence || ribCompte || ribCle) {
      setRibComplet(`${ribBanque} ${ribAgence} ${ribCompte} ${ribCle}`);
    } else {
      setRibComplet("");
    }
  }, [
    formState.ribBanque,
    formState.ribAgence,
    formState.ribCompte,
    formState.ribCle,
  ]);

  const handleCancel = () => {
    router.back();
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

  return (
    <>
      <Card className="w-full shadow-lg border-0 overflow-hidden">
        <CardHeader className="bg-gradient-to-r from-primary/20 to-primary/5 border-b">
          <div className="flex justify-between items-center">
            <div>
              <CardTitle className="text-2xl font-bold text-primary">
                {t("nouveauCompte")}
              </CardTitle>
              <CardDescription className="mt-2 text-muted-foreground">
                {formState.nomRaison
                  ? formState.nomRaison
                  : t("infoPrincipales")}
              </CardDescription>
            </div>
            <Button variant="outline" onClick={handleCancel} className="gap-2">
              <ArrowLeft className="h-4 w-4" />
              {t("retourListe")}
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-8 space-y-10">
          {/* Informations principales */}
          <div>
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
                <Label htmlFor="natureClient" className="text-sm font-medium">
                  {t("natureClient")} <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formState.natureClient}
                  onValueChange={(value) => updateForm("natureClient", value)}
                >
                  <SelectTrigger
                    id="natureClient"
                    className="w-full rounded-md"
                  >
                    <SelectValue placeholder={t("selectionner")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="particulier">
                      {t("natureOptions.particulier")}
                    </SelectItem>
                    <SelectItem value="entreprise">
                      {t("natureOptions.entreprise")}
                    </SelectItem>
                    <SelectItem value="association">
                      {t("natureOptions.association")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="nomRaison" className="text-sm font-medium">
                  {t("nomRaison")} <span className="text-red-500">*</span>
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
                <Label
                  htmlFor="categorieCompte"
                  className="text-sm font-medium"
                >
                  {t("categorieCompte")}
                </Label>
                <Select
                  value={formState.categorieCompte}
                  onValueChange={(value) =>
                    updateForm("categorieCompte", value)
                  }
                >
                  <SelectTrigger id="categorieCompte">
                    <SelectValue placeholder={t("selectionner")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="courant">
                      {t("categorieOptions.courant")}
                    </SelectItem>
                    <SelectItem value="epargne">
                      {t("categorieOptions.epargne")}
                    </SelectItem>
                    <SelectItem value="professionnel">
                      {t("categorieOptions.professionnel")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateNaissance" className="text-sm font-medium">
                  {t("dateNaissance")}
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={`w-full justify-start text-left font-normal ${
                        !birthDate && "text-muted-foreground"
                      }`}
                      id="dateNaissance"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {birthDate ? (
                        format(birthDate, "PPP", { locale: fr })
                      ) : (
                        <span>{t("selectionnerDate")}</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={birthDate}
                      onSelect={setBirthDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </motion.div>
          </div>

          <Separator className="my-8" />

          {/* Informations bancaires */}
          <div>
            <SectionHeader
              icon={<Building2 className="h-5 w-5" />}
              title={t("infoBancaires")}
              id="bank"
              badge={t("etape2")}
            />
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
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
                <Label htmlFor="agenceSaisie" className="text-sm font-medium">
                  {t("agenceSaisie")}
                </Label>
                <Input
                  id="agenceSaisie"
                  placeholder={t("agenceSaisie")}
                  value={formState.agenceSaisie}
                  onChange={(e) => updateForm("agenceSaisie", e.target.value)}
                />
              </div>
            </motion.div>
          </div>

          <Separator className="my-8" />

          {/* Informations RIB */}
          <div>
            <SectionHeader
              icon={<CreditCard className="h-5 w-5" />}
              title={t("coordonneesBancaires")}
              id="rib"
              badge={t("etape3")}
            />
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 gap-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-3">
                <div className="space-y-2">
                  <Label htmlFor="ribBanque" className="text-sm font-medium">
                    {t("codeBanque")}
                  </Label>
                  <Input
                    id="ribBanque"
                    placeholder="----"
                    maxLength={5}
                    value={formState.ribBanque}
                    onChange={(e) => updateForm("ribBanque", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ribAgence" className="text-sm font-medium">
                    {t("codeAgence")}
                  </Label>
                  <Input
                    id="ribAgence"
                    placeholder="-----"
                    maxLength={5}
                    value={formState.ribAgence}
                    onChange={(e) => updateForm("ribAgence", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ribCompte" className="text-sm font-medium">
                    {t("numeroCompte")}
                  </Label>
                  <Input
                    id="ribCompte"
                    placeholder="----------"
                    maxLength={11}
                    value={formState.ribCompte}
                    onChange={(e) => updateForm("ribCompte", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="ribCle" className="text-sm font-medium">
                    {t("cleRib")}
                  </Label>
                  <Input
                    id="ribCle"
                    placeholder="--"
                    maxLength={2}
                    value={formState.ribCle}
                    onChange={(e) => updateForm("ribCle", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="ribComplet" className="text-sm font-medium">
                  {t("ribComplet")}
                </Label>
                <Input
                  id="ribComplet"
                  placeholder={t("ribPlaceholder")}
                  value={ribComplet}
                  disabled
                />
              </div>
            </motion.div>
          </div>

          <Separator className="my-8" />

          {/* Dates */}
          <div>
            <SectionHeader
              icon={<CalendarIcon2 className="h-5 w-5" />}
              title={t("dates")}
              id="dates"
              badge=""
            />
            <motion.div
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <div className="space-y-2">
                <Label htmlFor="dateCreation" className="text-sm font-medium">
                  {t("dateCreation")}
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={`w-full justify-start text-left font-normal ${
                        !date && "text-muted-foreground"
                      }`}
                      id="dateCreation"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? (
                        format(date, "PPP", { locale: fr })
                      ) : (
                        <span>{t("selectionnerDate")}</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateOuverture" className="text-sm font-medium">
                  {t("dateOuverture")}
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={`w-full justify-start text-left font-normal ${
                        !openDate && "text-muted-foreground"
                      }`}
                      id="dateOuverture"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {openDate ? (
                        format(openDate, "PPP", { locale: fr })
                      ) : (
                        <span>{t("selectionnerDate")}</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={openDate}
                      onSelect={setOpenDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="space-y-2">
                <Label htmlFor="dateFermeture" className="text-sm font-medium">
                  {t("dateFermeture")}
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={`w-full justify-start text-left font-normal ${
                        !closeDate && "text-muted-foreground"
                      }`}
                      id="dateFermeture"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {closeDate ? (
                        format(closeDate, "PPP", { locale: fr })
                      ) : (
                        <span>{t("selectionnerDate")}</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={closeDate}
                      onSelect={setCloseDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </motion.div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between gap-4 p-6 bg-muted/10 border-t">
          <div className="text-sm text-muted-foreground flex items-center">
            <span className="text-red-500 text-lg mr-1">*</span>{" "}
            {t("champsObligatoires")}
          </div>
          <div className="flex gap-4">
            <Button
              variant="outline"
              className="rounded-md"
              onClick={handleCancel}
            >
              {t("annuler")}
            </Button>
            <Button
              className="rounded-md bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary"
              onClick={handleSubmit}
            >
              {t("valider")}
            </Button>
          </div>
        </CardFooter>
      </Card>
    </>
  );
}
