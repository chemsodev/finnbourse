"use client";

import { useState, useEffect } from "react";
import { CalendarIcon, PlusCircle, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";

export default function CompteEspece() {
  const t = useTranslations("CompteEspece");
  const [date, setDate] = useState<Date>();
  const [openDate, setOpenDate] = useState<Date>();
  const [closeDate, setCloseDate] = useState<Date>();
  const [updateDate, setUpdateDate] = useState<Date>();
  const [birthDate, setBirthDate] = useState<Date>();
  const [dialogOpen, setDialogOpen] = useState(false);

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

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="w-full shadow-lg border-0">
        <CardHeader className="bg-primary/5 border-b">
          <CardTitle className="text-2xl font-bold text-primary">
            {t("title")}
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-8">
          {/* Informations principales */}
          <div>
            <h3 className="text-lg font-medium mb-4">{t("infoPrincipales")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="natureClient" className="text-sm font-medium">
                  {t("natureClient")} <span className="text-red-500">*</span>
                </Label>
                <Select>
                  <SelectTrigger id="natureClient" className="w-full">
                    <SelectValue placeholder="Sélectionner" />
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
                <Select>
                  <SelectTrigger id="prenomAbrev" className="w-full">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="m">{t("prefixeOptions.m")}</SelectItem>
                    <SelectItem value="mme">
                      {t("prefixeOptions.mme")}
                    </SelectItem>
                    <SelectItem value="sa">{t("prefixeOptions.sa")}</SelectItem>
                    <SelectItem value="sarl">
                      {t("prefixeOptions.sarl")}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="formeJuridique" className="text-sm font-medium">
                  {t("formeJuridique")}
                </Label>
                <Select>
                  <SelectTrigger id="formeJuridique" className="w-full">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sa">{t("formeOptions.sa")}</SelectItem>
                    <SelectItem value="sarl">
                      {t("formeOptions.sarl")}
                    </SelectItem>
                    <SelectItem value="sas">{t("formeOptions.sas")}</SelectItem>
                    <SelectItem value="ei">{t("formeOptions.ei")}</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="categorieCompte"
                  className="text-sm font-medium"
                >
                  {t("categorieCompte")} <span className="text-red-500">*</span>
                </Label>
                <Select>
                  <SelectTrigger id="categorieCompte" className="w-full">
                    <SelectValue placeholder="Sélectionner" />
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
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      id="dateNaissance"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {birthDate ? (
                        format(birthDate, "P", { locale: fr })
                      ) : (
                        <span>{t("selectionnerDate")}</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={birthDate}
                      onSelect={setBirthDate}
                      initialFocus
                      locale={fr}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          <Separator />

          {/* Informations bancaires */}
          <div>
            <h3 className="text-lg font-medium mb-4">{t("infoBancaires")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
            </div>
          </div>

          <Separator />

          {/* Informations RIB */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">
                {t("coordonneesBancaires")}
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="space-y-2">
                <Label htmlFor="ribBanque" className="text-sm font-medium">
                  {t("codeBanque")}
                </Label>
                <Input
                  id="ribBanque"
                  placeholder={t("codeBanque")}
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
                  placeholder={t("codeAgence")}
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
                  placeholder={t("numeroCompte")}
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
                  placeholder={t("cleRib")}
                  maxLength={2}
                  value={formState.ribCle}
                  onChange={(e) => updateForm("ribCle", e.target.value)}
                />
              </div>
            </div>

            <div className="bg-muted/30 p-4 rounded-md">
              <Label
                htmlFor="ribComplet"
                className="text-sm font-medium mb-2 block"
              >
                {t("ribComplet")}
              </Label>
              <div
                id="ribComplet"
                className="font-mono text-base bg-background p-3 rounded border"
              >
                {ribComplet || t("ribPlaceholder")}
              </div>
            </div>
          </div>

          <Separator />

          {/* Dates */}
          <div>
            <h3 className="text-lg font-medium mb-4">{t("dates")}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="dateCreation" className="text-sm font-medium">
                  {t("dateCreation")}
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      id="dateCreation"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? (
                        format(date, "P", { locale: fr })
                      ) : (
                        <span>{t("selectionnerDate")}</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                      locale={fr}
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
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      id="dateOuverture"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {openDate ? (
                        format(openDate, "P", { locale: fr })
                      ) : (
                        <span>{t("selectionnerDate")}</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={openDate}
                      onSelect={setOpenDate}
                      initialFocus
                      locale={fr}
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
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      id="dateFermeture"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {closeDate ? (
                        format(closeDate, "P", { locale: fr })
                      ) : (
                        <span>{t("selectionnerDate")}</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={closeDate}
                      onSelect={setCloseDate}
                      initialFocus
                      locale={fr}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateMiseAJour" className="text-sm font-medium">
                  {t("dateMiseAJour")}
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className="w-full justify-start text-left font-normal"
                      id="dateMiseAJour"
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {updateDate ? (
                        format(updateDate, "P", { locale: fr })
                      ) : (
                        <span>{t("selectionnerDate")}</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={updateDate}
                      onSelect={setUpdateDate}
                      initialFocus
                      locale={fr}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          <div className="mt-8">
            <Button
              variant="outline"
              className="flex items-center gap-2"
              onClick={() => setDialogOpen(true)}
            >
              <PlusCircle className="h-4 w-4" />
              {t("ajouterInfos")}
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between gap-4 p-6 bg-muted/10 border-t">
          <div className="text-sm text-muted-foreground">
            <span className="text-red-500">*</span> {t("champsObligatoires")}
          </div>
          <div className="flex gap-4">
            <Button variant="outline">{t("annuler")}</Button>
            <Button>{t("valider")}</Button>
          </div>
        </CardFooter>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("infoComp.title")}</DialogTitle>
            <DialogDescription>{t("infoComp.description")}</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nom" className="text-sm font-medium">
                {t("infoComp.nom")}
              </Label>
              <Input id="nom" placeholder={t("infoComp.nom")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prenom" className="text-sm font-medium">
                {t("infoComp.prenom")}
              </Label>
              <Input id="prenom" placeholder={t("infoComp.prenom")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fonction" className="text-sm font-medium">
                {t("infoComp.fonction")}
              </Label>
              <Input id="fonction" placeholder={t("infoComp.fonction")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telephone1" className="text-sm font-medium">
                {t("infoComp.telephone1")}
              </Label>
              <Input id="telephone1" placeholder={t("infoComp.telephone1")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telephone2" className="text-sm font-medium">
                {t("infoComp.telephone2")}
              </Label>
              <Input id="telephone2" placeholder={t("infoComp.telephone2")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fax" className="text-sm font-medium">
                {t("infoComp.fax")}
              </Label>
              <Input id="fax" placeholder={t("infoComp.fax")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="numeroPiece" className="text-sm font-medium">
                {t("infoComp.numeroPiece")}
              </Label>
              <Input id="numeroPiece" placeholder={t("infoComp.numeroPiece")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adresse" className="text-sm font-medium">
                {t("infoComp.adresse")}
              </Label>
              <Input id="adresse" placeholder={t("infoComp.adresse")} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="codePostal" className="text-sm font-medium">
                {t("infoComp.codePostal")}
              </Label>
              <Input id="codePostal" placeholder={t("infoComp.codePostal")} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="commentaire" className="text-sm font-medium">
                {t("infoComp.commentaire")}
              </Label>
              <Textarea
                id="commentaire"
                placeholder={t("infoComp.commentaire")}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              {t("infoComp.annuler")}
            </Button>
            <Button onClick={() => setDialogOpen(false)}>
              {t("infoComp.enregistrer")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
