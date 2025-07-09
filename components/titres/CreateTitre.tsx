"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";
import { TitreFormDialog } from "./TitreFormDialog";
import { Stock } from "@/types/gestionTitres";

export function CreateTitre({
  type,
  onStockCreated,
}: {
  type: string;
  onStockCreated?: (newStock: Stock) => void;
}) {
  const [open, setOpen] = useState(false);
  const t = useTranslations("GestionDesTitres.CreateTitre");

  return (
    <>
      <Button className="gap-2" onClick={() => setOpen(true)}>
        <Plus size={16} />
        {t("ajouterUnTitre")}
      </Button>

      <TitreFormDialog
        type={type}
        open={open}
        onOpenChange={setOpen}
        onSuccess={onStockCreated}
      />
    </>
  );
}
