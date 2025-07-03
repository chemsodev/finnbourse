// components/titres/EditTitre.tsx
"use client";
import { TitreFormDialog } from "./TitreFormDialog";
import { TitreFormValues } from "./titreSchemaValidation";

export function EditTitre({
  type,
  open,
  onOpenChange,
  defaultValues,
  onSuccess,
}: {
  type: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  defaultValues: TitreFormValues;
  onSuccess?: () => void;
}) {
  return (
    <TitreFormDialog
      type={type}
      open={open}
      onOpenChange={onOpenChange}
      defaultValues={defaultValues}
      onSuccess={onSuccess}
      isEdit={true}
    />
  );
}
