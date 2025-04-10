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

export default function CompteEspece() {
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

  // TIB Complet (calculated field)
  const [tibComplet, setTibComplet] = useState("");

  // Update form state
  const updateForm = (field: string, value: any) => {
    setFormState((prev) => ({ ...prev, [field]: value }));
  };

  // Calculate TIB when RIB fields change
  useEffect(() => {
    const { ribBanque, ribAgence, ribCompte, ribCle } = formState;
    if (ribBanque || ribAgence || ribCompte || ribCle) {
      setTibComplet(`${ribBanque} ${ribAgence} ${ribCompte} ${ribCle}`);
    } else {
      setTibComplet("");
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
            Compte Espèce
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6 space-y-8">
          {/* Informations principales */}
          <div>
            <h3 className="text-lg font-medium mb-4">
              Informations principales
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="natureClient" className="text-sm font-medium">
                  Nature Client <span className="text-red-500">*</span>
                </Label>
                <Select>
                  <SelectTrigger id="natureClient" className="w-full">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="particulier">Particulier</SelectItem>
                    <SelectItem value="entreprise">Entreprise</SelectItem>
                    <SelectItem value="association">Association</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="nomRaison" className="text-sm font-medium">
                  Nom/Raison sociale <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="nomRaison"
                  placeholder="Entrez le nom ou la raison sociale"
                  value={formState.nomRaison}
                  onChange={(e) => updateForm("nomRaison", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="prenomAbrev" className="text-sm font-medium">
                  Prénom/Abrév.R.S
                </Label>
                <Select>
                  <SelectTrigger id="prenomAbrev" className="w-full">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="m">M.</SelectItem>
                    <SelectItem value="mme">Mme.</SelectItem>
                    <SelectItem value="sa">S.A.</SelectItem>
                    <SelectItem value="sarl">S.A.R.L.</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="formeJuridique" className="text-sm font-medium">
                  Forme Juridique
                </Label>
                <Select>
                  <SelectTrigger id="formeJuridique" className="w-full">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sa">SA</SelectItem>
                    <SelectItem value="sarl">SARL</SelectItem>
                    <SelectItem value="sas">SAS</SelectItem>
                    <SelectItem value="ei">EI</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="categorieCompte"
                  className="text-sm font-medium"
                >
                  Catégorie Compte <span className="text-red-500">*</span>
                </Label>
                <Select>
                  <SelectTrigger id="categorieCompte" className="w-full">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="courant">Courant</SelectItem>
                    <SelectItem value="epargne">Épargne</SelectItem>
                    <SelectItem value="professionnel">Professionnel</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateNaissance" className="text-sm font-medium">
                  Date de Naissance
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
                        <span>Sélectionner une date</span>
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
            <h3 className="text-lg font-medium mb-4">Informations bancaires</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="banque" className="text-sm font-medium">
                  Banque
                </Label>
                <Input
                  id="banque"
                  placeholder="Entrez le nom de la banque"
                  value={formState.banque}
                  onChange={(e) => updateForm("banque", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="agence" className="text-sm font-medium">
                  Agence
                </Label>
                <Input
                  id="agence"
                  placeholder="Entrez le nom de l'agence"
                  value={formState.agence}
                  onChange={(e) => updateForm("agence", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="agenceSaisie" className="text-sm font-medium">
                  Agence qui saisie le compte
                </Label>
                <Input
                  id="agenceSaisie"
                  placeholder="Entrez l'agence qui saisie"
                  value={formState.agenceSaisie}
                  onChange={(e) => updateForm("agenceSaisie", e.target.value)}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Informations RIB/TIB */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <CreditCard className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-medium">
                Coordonnées bancaires (RIB/TIB)
              </h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div className="space-y-2">
                <Label htmlFor="ribBanque" className="text-sm font-medium">
                  Code Banque
                </Label>
                <Input
                  id="ribBanque"
                  placeholder="Banque"
                  maxLength={5}
                  value={formState.ribBanque}
                  onChange={(e) => updateForm("ribBanque", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ribAgence" className="text-sm font-medium">
                  Code Agence
                </Label>
                <Input
                  id="ribAgence"
                  placeholder="Agence"
                  maxLength={5}
                  value={formState.ribAgence}
                  onChange={(e) => updateForm("ribAgence", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ribCompte" className="text-sm font-medium">
                  Numéro de Compte
                </Label>
                <Input
                  id="ribCompte"
                  placeholder="N° Compte"
                  maxLength={11}
                  value={formState.ribCompte}
                  onChange={(e) => updateForm("ribCompte", e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="ribCle" className="text-sm font-medium">
                  Clé RIB
                </Label>
                <Input
                  id="ribCle"
                  placeholder="Clé"
                  maxLength={2}
                  value={formState.ribCle}
                  onChange={(e) => updateForm("ribCle", e.target.value)}
                />
              </div>
            </div>

            <div className="bg-muted/30 p-4 rounded-md">
              <Label
                htmlFor="tibComplet"
                className="text-sm font-medium mb-2 block"
              >
                TIB Complet
              </Label>
              <div
                id="tibComplet"
                className="font-mono text-base bg-background p-3 rounded border"
              >
                {tibComplet ||
                  "Remplissez les champs du RIB pour générer le TIB complet"}
              </div>
            </div>
          </div>

          <Separator />

          {/* Dates */}
          <div>
            <h3 className="text-lg font-medium mb-4">Dates</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="space-y-2">
                <Label htmlFor="dateCreation" className="text-sm font-medium">
                  Date de création
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
                        <span>Sélectionner une date</span>
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
                  Date d'ouverture
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
                        <span>Sélectionner une date</span>
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
                  Date de fermeture
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
                        <span>Sélectionner une date</span>
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
                  Date de mise à jour
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
                        <span>Sélectionner une date</span>
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
              Ajouter des informations complémentaires
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between gap-4 p-6 bg-muted/10 border-t">
          <div className="text-sm text-muted-foreground">
            <span className="text-red-500">*</span> Champs obligatoires
          </div>
          <div className="flex gap-4">
            <Button variant="outline">Annuler</Button>
            <Button>Valider</Button>
          </div>
        </CardFooter>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Informations complémentaires</DialogTitle>
            <DialogDescription>
              Ajoutez des informations supplémentaires pour ce compte.
            </DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nom" className="text-sm font-medium">
                Nom
              </Label>
              <Input id="nom" placeholder="Entrez le nom" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="prenom" className="text-sm font-medium">
                Prénom
              </Label>
              <Input id="prenom" placeholder="Entrez le prénom" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fonction" className="text-sm font-medium">
                Fonction
              </Label>
              <Input id="fonction" placeholder="Entrez la fonction" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telephone1" className="text-sm font-medium">
                Téléphone 1
              </Label>
              <Input
                id="telephone1"
                placeholder="Entrez le numéro de téléphone"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="telephone2" className="text-sm font-medium">
                Téléphone 2
              </Label>
              <Input
                id="telephone2"
                placeholder="Entrez un autre numéro de téléphone"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="fax" className="text-sm font-medium">
                Fax
              </Label>
              <Input id="fax" placeholder="Entrez le numéro de fax" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="numeroPiece" className="text-sm font-medium">
                Numéro Pièce d'identité
              </Label>
              <Input
                id="numeroPiece"
                placeholder="Entrez le numéro de pièce d'identité"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="adresse" className="text-sm font-medium">
                Adresse
              </Label>
              <Input id="adresse" placeholder="Entrez l'adresse" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="codePostal" className="text-sm font-medium">
                Code Postal
              </Label>
              <Input id="codePostal" placeholder="Entrez le code postal" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="commentaire" className="text-sm font-medium">
                Commentaire
              </Label>
              <Textarea
                id="commentaire"
                placeholder="Ajoutez un commentaire"
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={() => setDialogOpen(false)}>Enregistrer</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
