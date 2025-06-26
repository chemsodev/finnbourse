"use client";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Loader2, Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";
import { Button } from "./ui/button";
import { useRouter } from "@/i18n/routing";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
// Removed GraphQL dependencies - now using static data
// import { fetchGraphQLClient } from "@/app/actions/clientGraphQL";
// import { DELETE_STOCK } from "@/graphql/mutations";
// import { DELETE_BOND } from "@/graphql/mutations";

interface DeleteSecurityResponse {
  deleteSecurity: {
    id: number;
    name: string;
  };
}
export function SupprimerTitre({
  securityId,
  type,
}: {
  securityId: string;
  type: string;
}) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const t = useTranslations("SupprimerTitre");

  const deleteSecurity = async () => {
    setIsLoading(true);
    try {
      // Simulate deletion - in real app, use REST API
      // let mutation;
      // if (type === "action" || type === "opv") {
      //   mutation = DELETE_STOCK;
      // } else {
      //   mutation = DELETE_BOND;
      // }
      // await fetchGraphQLClient<DeleteSecurityResponse>(mutation, {
      //   id: securityId,
      // });

      // Simulate async operation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        variant: "success",
        title: t("success"),
        description: t("successDescription"),
      });
      window.location.reload();
    } catch (error) {
      console.error("Error deleting security:", error);
      toast({
        variant: "destructive",
        title: t("error"),
        description: t("errorDescription") || "An error occurred",
      });
    } finally {
      setIsLoading(false);
      setOpen(false);
    }
  };
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="w-full">
          {t("buttonTitle")}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("titre")}</AlertDialogTitle>
          <AlertDialogDescription className="mt-4">
            {t("description")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel disabled={isLoading} type="button">
            {t("annuler")}
          </AlertDialogCancel>
          <Button
            variant="destructive"
            disabled={isLoading}
            type="button"
            onClick={deleteSecurity}
          >
            {t("supprimer")}
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <Trash2 />
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
