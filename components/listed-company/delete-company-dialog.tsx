"use client";

import { useToast } from "@/hooks/use-toast";
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
import { useTranslations } from "next-intl";
import { useState } from "react";
// Removed GraphQL dependencies - now using REST API
// import { DELETE_LISTED_COMPANY } from "@/graphql/mutations";
// Removed GraphQL dependencies - now using REST API
// import { fetchGraphQLClient } from "@/app/actions/clientGraphQL";

interface DeleteCompanyDialogProps {
  companyId: string;
  companyName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

const DeleteCompanyDialog = ({
  companyId,
  companyName,
  open,
  onOpenChange,
  onSuccess,
}: DeleteCompanyDialogProps) => {
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const t = useTranslations("DeleteCompany");

  const handleDelete = async () => {
    setLoading(true);
    try {
      // TODO: Replace with REST API call
      // await fetchGraphQLClient<boolean>(DELETE_LISTED_COMPANY, {
      //   id: companyId,
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        variant: "success",
        title: t("success"),
        description: t("companyDeletedSuccessfully"),
      });

      onSuccess();
      onOpenChange(false);
    } catch (error) {
      console.error("Mutation error:", error);

      toast({
        variant: "destructive",
        title: t("error"),
        description:
          error instanceof Error ? error.message : "Une erreur est survenue",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("confirmDeletion")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("deleteConfirmationMessage", { companyName })}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={loading}>
            {t("cancel")}
          </AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            disabled={loading}
            className={
              loading ? "bg-destructive/80 cursor-wait" : "bg-destructive"
            }
          >
            {loading ? t("deleting") + "..." : t("delete")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteCompanyDialog;
