"use client";

import { useState, useEffect } from "react";
import {
  CalendarIcon,
  PlusCircle,
  Edit,
  MoreHorizontal,
  Trash2,
  Eye,
  EyeOff,
} from "lucide-react";
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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Calendar } from "@/components/ui/calendar";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Textarea } from "@/components/ui/textarea";
import { useTranslations } from "next-intl";

// Mock data for demonstration
const mockComptesTitres = [
  {
    id: "1",
    codeClient: "CL001",
    nomRaison: "Dupont SA",
    prenomAbrev: "Jean",
    dateOuverture: new Date("2023-01-15"),
    dateMiseAJour: new Date("2023-05-20"),
    codeAgent: "agent1",
    compteEspece: "compte1",
    formeJuridique: "SARL",
    codeAgence: "AG007",
    codeBanque: "BNK123",
    adresse: "123 Avenue de la République, Paris",
    password: "StrongPassword1",
  },
  {
    id: "2",
    codeClient: "CL002",
    nomRaison: "Martin Investissements",
    prenomAbrev: "Sophie",
    dateOuverture: new Date("2022-11-05"),
    dateMiseAJour: new Date("2023-04-10"),
    codeAgent: "agent2",
    compteEspece: "compte2",
    formeJuridique: "SA",
    codeAgence: "AG012",
    codeBanque: "BNK456",
    adresse: "45 Rue du Commerce, Lyon",
    password: "StrongPassword2",
  },
  {
    id: "3",
    codeClient: "CL003",
    nomRaison: "Dubois Entreprises",
    prenomAbrev: "Philippe",
    dateOuverture: new Date("2023-03-22"),
    dateMiseAJour: new Date("2023-06-15"),
    codeAgent: "agent3",
    compteEspece: "compte3",
    formeJuridique: "SAS",
    codeAgence: "AG015",
    codeBanque: "BNK789",
    adresse: "78 Boulevard Haussmann, Paris",
    password: "StrongPassword3",
  },
];

export default function CompteTitre() {
  const [openDate, setOpenDate] = useState<Date>();
  const [updateDate, setUpdateDate] = useState<Date>();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [currentCompte, setCurrentCompte] = useState<any>(null);
  const [comptesTitres, setComptesTitres] = useState(mockComptesTitres);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [compteToDelete, setCompteToDelete] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const t = useTranslations("CompteTitre");

  // Filter comptes based on search term
  const filteredComptes = comptesTitres.filter((compte) =>
    Object.values(compte).some(
      (value) =>
        value &&
        value.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const handleCreateNew = () => {
    setCurrentCompte(null);
    setEditMode(false);
    setOpenDate(undefined);
    setUpdateDate(undefined);
    setShowForm(true);
  };

  const handleEdit = (compte: any) => {
    setCurrentCompte(compte);
    setEditMode(true);
    setOpenDate(compte.dateOuverture);
    setUpdateDate(compte.dateMiseAJour);
    setShowForm(true);
  };

  const handleDelete = (compteId: string) => {
    setCompteToDelete(compteId);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (compteToDelete) {
      setComptesTitres(comptesTitres.filter((c) => c.id !== compteToDelete));
      setDeleteDialogOpen(false);
      setCompteToDelete(null);
    }
  };

  const handleSubmit = () => {
    // Here you would typically handle the form submission
    // For this demo, we'll just close the form view
    setShowForm(false);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {!showForm ? (
        // Table view
        <Card className="w-full shadow-lg border-0">
          <CardHeader className="bg-primary/5 border-b flex flex-row items-center justify-between">
            <CardTitle className="text-2xl font-bold text-primary">
              {t("title")}
            </CardTitle>
            <Button
              onClick={handleCreateNew}
              className="flex items-center gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              {t("createNew")}
            </Button>
          </CardHeader>
          <CardContent className="p-6">
            <div className="mb-4">
              <Input
                placeholder={t("search")}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-sm"
              />
            </div>
            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("codeClient")}</TableHead>
                    <TableHead>{t("nomRaison")}</TableHead>
                    <TableHead>{t("prenomAbrev")}</TableHead>
                    <TableHead>{t("dateOuverture")}</TableHead>
                    <TableHead>{t("dateMiseAJour")}</TableHead>
                    <TableHead className="text-right">{t("actions")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredComptes.length > 0 ? (
                    filteredComptes.map((compte) => (
                      <TableRow key={compte.id}>
                        <TableCell className="font-medium">
                          {compte.codeClient}
                        </TableCell>
                        <TableCell>{compte.nomRaison}</TableCell>
                        <TableCell>{compte.prenomAbrev}</TableCell>
                        <TableCell>
                          {compte.dateOuverture
                            ? format(new Date(compte.dateOuverture), "P", {
                                locale: fr,
                              })
                            : "-"}
                        </TableCell>
                        <TableCell>
                          {compte.dateMiseAJour
                            ? format(new Date(compte.dateMiseAJour), "P", {
                                locale: fr,
                              })
                            : "-"}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleEdit(compte)}
                              className="h-10 w-10 text-amber-600"
                            >
                              <Edit className="h-5 w-5" />
                              <span className="sr-only">{t("edit")}</span>
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDelete(compte.id)}
                              className="h-10 w-10 text-red-600"
                            >
                              <Trash2 className="h-5 w-5" />
                              <span className="sr-only">{t("delete")}</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="h-24 text-center">
                        {t("noResults")}
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      ) : (
        // Form view (existing form)
        <Card className="w-full shadow-lg border-0">
          <CardHeader className="bg-primary/5 border-b">
            <CardTitle className="text-2xl font-bold text-primary">
              {editMode ? t("editTitle") : t("createTitle")}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* First row */}
              <div className="space-y-2">
                <label htmlFor="dateOuverture" className="text-sm font-medium">
                  {t("dateOuverture")}
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
                        <span>{t("selectDate")}</span>
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
                <label htmlFor="dateMiseAJour" className="text-sm font-medium">
                  {t("dateMiseAJour")}
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
                        <span>{t("selectDate")}</span>
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
              <div className="hidden lg:block"></div>{" "}
              {/* Spacer for third column */}
              {/* Second row */}
              <div className="space-y-2">
                <label htmlFor="codeAgent" className="text-sm font-medium">
                  {t("codeAgent")}
                </label>
                <Select defaultValue={currentCompte?.codeAgent}>
                  <SelectTrigger id="codeAgent" className="w-full">
                    <SelectValue placeholder={t("select")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="agent1">Agent 1</SelectItem>
                    <SelectItem value="agent2">Agent 2</SelectItem>
                    <SelectItem value="agent3">Agent 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label htmlFor="codeClient" className="text-sm font-medium">
                  {t("codeClient")}
                </label>
                <Input
                  id="codeClient"
                  placeholder={t("enterCodeClient")}
                  defaultValue={currentCompte?.codeClient}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="compteEspece" className="text-sm font-medium">
                  {t("compteEspece")}
                </label>
                <Select defaultValue={currentCompte?.compteEspece}>
                  <SelectTrigger id="compteEspece" className="w-full">
                    <SelectValue placeholder={t("select")} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="compte1">Compte 1</SelectItem>
                    <SelectItem value="compte2">Compte 2</SelectItem>
                    <SelectItem value="compte3">Compte 3</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              {/* Third row */}
              <div className="space-y-2">
                <label htmlFor="nomRaison" className="text-sm font-medium">
                  {t("nomRaison")}
                </label>
                <Input
                  id="nomRaison"
                  placeholder={t("enterNomRaison")}
                  defaultValue={currentCompte?.nomRaison}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="prenomAbrev" className="text-sm font-medium">
                  {t("prenomAbrev")}
                </label>
                <Input
                  id="prenomAbrev"
                  placeholder={t("enterPrenomAbrev")}
                  defaultValue={currentCompte?.prenomAbrev}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="formeJuridique" className="text-sm font-medium">
                  {t("formeJuridique")}
                </label>
                <Input
                  id="formeJuridique"
                  placeholder={t("enterFormeJuridique")}
                  defaultValue={currentCompte?.formeJuridique}
                />
              </div>
              {/* Fourth row */}
              <div className="space-y-2">
                <label htmlFor="codeAgence" className="text-sm font-medium">
                  {t("codeAgence")}
                </label>
                <Input
                  id="codeAgence"
                  placeholder={t("enterCodeAgence")}
                  defaultValue={currentCompte?.codeAgence}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="codeBanque" className="text-sm font-medium">
                  {t("codeBanque")}
                </label>
                <Input
                  id="codeBanque"
                  placeholder={t("enterCodeBanque")}
                  defaultValue={currentCompte?.codeBanque}
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="adresse" className="text-sm font-medium">
                  {t("adresse")}
                </label>
                <Input
                  id="adresse"
                  placeholder={t("enterAdresse")}
                  defaultValue={currentCompte?.adresse}
                />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label htmlFor="password" className="text-sm font-medium">
                    {t("password")}
                  </label>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-6 w-6"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                    <span className="sr-only">
                      {showPassword ? t("hidePassword") : t("showPassword")}
                    </span>
                  </Button>
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder={t("enterPassword")}
                  defaultValue={currentCompte?.password}
                />
              </div>
            </div>

            <div className="mt-8">
              <Button
                variant="outline"
                className="flex items-center gap-2"
                onClick={() => setDialogOpen(true)}
              >
                <PlusCircle className="h-4 w-4" />
                {t("addAdditionalInfo")}
              </Button>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end gap-4 p-6 bg-muted/10 border-t">
            <Button variant="outline" onClick={() => setShowForm(false)}>
              {t("cancel")}
            </Button>
            <Button onClick={handleSubmit}>
              {editMode ? t("update") : t("validate")}
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* Additional Info Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{t("additionalInfo")}</DialogTitle>
            <DialogDescription>{t("additionalInfoDesc")}</DialogDescription>
          </DialogHeader>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="nom" className="text-sm font-medium">
                {t("nom")}
              </label>
              <Input id="nom" placeholder={t("enterNom")} />
            </div>
            <div className="space-y-2">
              <label htmlFor="prenom" className="text-sm font-medium">
                {t("prenom")}
              </label>
              <Input id="prenom" placeholder={t("enterPrenom")} />
            </div>
            <div className="space-y-2">
              <label htmlFor="fonction" className="text-sm font-medium">
                {t("fonction")}
              </label>
              <Input id="fonction" placeholder={t("enterFonction")} />
            </div>
            <div className="space-y-2">
              <label htmlFor="telephone1" className="text-sm font-medium">
                {t("telephone1")}
              </label>
              <Input id="telephone1" placeholder={t("enterTelephone")} />
            </div>
            <div className="space-y-2">
              <label htmlFor="telephone2" className="text-sm font-medium">
                {t("telephone2")}
              </label>
              <Input id="telephone2" placeholder={t("enterTelephone2")} />
            </div>
            <div className="space-y-2">
              <label htmlFor="fax" className="text-sm font-medium">
                {t("fax")}
              </label>
              <Input id="fax" placeholder={t("enterFax")} />
            </div>
            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-medium">
                {t("email")}
              </label>
              <Input id="email" type="email" placeholder={t("enterEmail")} />
            </div>
            <div className="space-y-2">
              <label htmlFor="telex" className="text-sm font-medium">
                {t("telex")}
              </label>
              <Input id="telex" placeholder={t("enterTelex")} />
            </div>
            <div className="space-y-2">
              <label htmlFor="codePostal" className="text-sm font-medium">
                {t("codePostal")}
              </label>
              <Input id="codePostal" placeholder={t("enterCodePostal")} />
            </div>
            <div className="space-y-2 md:col-span-2">
              <label htmlFor="commentaire" className="text-sm font-medium">
                {t("commentaire")}
              </label>
              <Textarea
                id="commentaire"
                placeholder={t("enterCommentaire")}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              {t("cancel")}
            </Button>
            <Button onClick={() => setDialogOpen(false)}>{t("save")}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{t("deleteConfirmTitle")}</AlertDialogTitle>
            <AlertDialogDescription>
              {t("deleteConfirmDescription")}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {t("delete")}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
