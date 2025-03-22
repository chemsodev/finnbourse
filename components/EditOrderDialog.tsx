"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import * as z from "zod";

const formSchema = z.object({
  typeTransaction: z.boolean(),
  quantite: z.number().int().min(1),
  instructionOrdreTemps: z.enum([
    "à durée limitée",
    "de jour",
    "à revocation",
    "à exécution",
  ]),
  instructionOrdrePrix: z.enum([
    "à cours limité",
    "au mieux",
    "tout ou rien",
    "sans stipulation",
  ]),
  validite: z.date(),
  valeurMin: z.number().int().min(0),
  valeurMax: z.number().int().min(0),
  selectedTitreId: z.number(),
});

const EditOrderDialog = (order: any) => {
  const t = useTranslations("OrdreDrawer");
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          {t("editOrder")}
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Are you absolutely sure?</DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete your
            account and remove your data from our servers.
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default EditOrderDialog;
