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
import { useTranslations } from "next-intl";

export default function CompteTitre() {
  const [openDate, setOpenDate] = useState<Date>();
  const [updateDate, setUpdateDate] = useState<Date>();
  const [dialogOpen, setDialogOpen] = useState(false);
  const t = useTranslations("CompteTitre");

  return (
    <div className="container mx-auto py-8 px-4">
      <Card className="w-full shadow-lg border-0">
        <CardHeader className="bg-primary/5 border-b">
          <CardTitle className="text-2xl font-bold text-primary">
            {t("title")}
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
              <Select>
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
              <Input id="codeClient" placeholder={t("enterCodeClient")} />
            </div>
            <div className="space-y-2">
              <label htmlFor="compteEspece" className="text-sm font-medium">
                {t("compteEspece")}
              </label>
              <Select>
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
              <Input id="nomRaison" placeholder={t("enterNomRaison")} />
            </div>
            <div className="space-y-2">
              <label htmlFor="prenomAbrev" className="text-sm font-medium">
                {t("prenomAbrev")}
              </label>
              <Input id="prenomAbrev" placeholder={t("enterPrenomAbrev")} />
            </div>
            <div className="space-y-2">
              <label htmlFor="formeJuridique" className="text-sm font-medium">
                {t("formeJuridique")}
              </label>
              <Input
                id="formeJuridique"
                placeholder={t("enterFormeJuridique")}
              />
            </div>
            {/* Fourth row */}
            <div className="space-y-2">
              <label htmlFor="codeAgence" className="text-sm font-medium">
                {t("codeAgence")}
              </label>
              <Input id="codeAgence" placeholder={t("enterCodeAgence")} />
            </div>
            <div className="space-y-2">
              <label htmlFor="codeBanque" className="text-sm font-medium">
                {t("codeBanque")}
              </label>
              <Input id="codeBanque" placeholder={t("enterCodeBanque")} />
            </div>
            <div className="space-y-2">
              <label htmlFor="adresse" className="text-sm font-medium">
                {t("adresse")}
              </label>
              <Input id="adresse" placeholder={t("enterAdresse")} />
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
          <Button variant="outline">{t("cancel")}</Button>
          <Button>{t("validate")}</Button>
        </CardFooter>
      </Card>

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
    </div>
  );
}
