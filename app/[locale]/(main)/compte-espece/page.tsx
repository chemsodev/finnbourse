"use client";

import { useState } from "react";
import { CalendarIcon, PlusCircle } from "lucide-react";
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

export default function CompteEspece() {
  const [date, setDate] = useState<Date>();
  const [openDate, setOpenDate] = useState<Date>();
  const [closeDate, setCloseDate] = useState<Date>();
  const [updateDate, setUpdateDate] = useState<Date>();
  const [birthDate, setBirthDate] = useState<Date>();
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="w-full shadow-lg border-0">
        <CardHeader className="bg-primary/5 border-b">
          <CardTitle className="text-2xl font-bold text-primary">
            Compte Espèce
          </CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* First row */}
            <div className="space-y-2">
              <label htmlFor="natureClient" className="text-sm font-medium">
                Nature Client
              </label>
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
              <label htmlFor="nomRaison" className="text-sm font-medium">
                Nom/Raison sociale
              </label>
              <Input
                id="nomRaison"
                placeholder="Entrez le nom ou la raison sociale"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="prenomAbrev" className="text-sm font-medium">
                Prénom/Abrév.R.S
              </label>
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

            {/* Second row */}
            <div className="space-y-2">
              <label htmlFor="formeJuridique" className="text-sm font-medium">
                Forme Juridique
              </label>
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
              <label htmlFor="categorieCompte" className="text-sm font-medium">
                Catégorie Compte
              </label>
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
              <label htmlFor="dateCreation" className="text-sm font-medium">
                Date de création
              </label>
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

            {/* Third row */}
            <div className="space-y-2">
              <label htmlFor="dateOuverture" className="text-sm font-medium">
                Date d'ouverture
              </label>
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
              <label htmlFor="dateFermeture" className="text-sm font-medium">
                Date d fermeture
              </label>
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

            <div className="space-y-2">
              <label htmlFor="dateMiseAJour" className="text-sm font-medium">
                Date de Mise à jour
              </label>
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
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={updateDate}
                    onSelect={setUpdateDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            {/* Fourth row */}
            <div className="space-y-2">
              <label htmlFor="banque" className="text-sm font-medium">
                Banque
              </label>
              <Input id="banque" placeholder="Entrez le nom de la banque" />
            </div>

            <div className="space-y-2">
              <label htmlFor="agence" className="text-sm font-medium">
                Agence
              </label>
              <Input id="agence" placeholder="Entrez le nom de l'agence" />
            </div>

            <div className="space-y-2">
              <label htmlFor="dateNaissance" className="text-sm font-medium">
                Date de Naissance
              </label>
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
        <CardFooter className="flex justify-end gap-4 p-6 bg-muted/10 border-t">
          <Button variant="outline">Annuler</Button>
          <Button>Valider</Button>
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
              <label htmlFor="nom" className="text-sm font-medium">
                Nom
              </label>
              <Input id="nom" placeholder="Entrez le nom" />
            </div>
            <div className="space-y-2">
              <label htmlFor="prenom" className="text-sm font-medium">
                Prénom
              </label>
              <Input id="prenom" placeholder="Entrez le prénom" />
            </div>
            <div className="space-y-2">
              <label htmlFor="fonction" className="text-sm font-medium">
                Fonction
              </label>
              <Input id="fonction" placeholder="Entrez la fonction" />
            </div>
            <div className="space-y-2">
              <label htmlFor="telephone1" className="text-sm font-medium">
                Téléphone 1
              </label>
              <Input
                id="telephone1"
                placeholder="Entrez le numéro de téléphone"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="telephone2" className="text-sm font-medium">
                Téléphone 2
              </label>
              <Input
                id="telephone2"
                placeholder="Entrez un autre numéro de téléphone"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="fax" className="text-sm font-medium">
                Fax
              </label>
              <Input id="fax" placeholder="Entrez le numéro de fax" />
            </div>
            <div className="space-y-2">
              <label htmlFor="numeroPiece" className="text-sm font-medium">
                Numéro Pièce d'identité
              </label>
              <Input
                id="numeroPiece"
                placeholder="Entrez le numéro de pièce d'identité"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="adresse" className="text-sm font-medium">
                Adresse
              </label>
              <Input id="adresse" placeholder="Entrez l'adresse" />
            </div>
            <div className="space-y-2">
              <label htmlFor="codePostal" className="text-sm font-medium">
                Code Postal
              </label>
              <Input id="codePostal" placeholder="Entrez le code postal" />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="commentaire" className="text-sm font-medium">
                Commentaire
              </label>
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
