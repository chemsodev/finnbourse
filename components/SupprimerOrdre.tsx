"use client";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import { useTranslations } from "next-intl";
import { useState } from "react";
// Removed GraphQL dependencies - now using static data
// import { fetchGraphQLClient } from "@/app/actions/clientGraphQL";
// import { DELETE_ORDER } from "@/graphql/mutations";
import { useRouter } from "@/i18n/routing";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const SupprimerOrdre = ({ titreId }: { titreId: string }) => {
  const router = useRouter();
  const t = useTranslations("OrdreDrawer");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const handleDelete = async () => {
    setLoading(true);
    try {
      // Simulate deletion - in real app, use REST API
      // await fetchGraphQLClient<String>(DELETE_ORDER, {
      //   orderId: titreId,
      // });

      // Simulate async operation
      await new Promise((resolve) => setTimeout(resolve, 1000));

      router.refresh();
      toast({
        variant: "success",
        title: t("success"),
        description: t("successDescription"),
      });
    } catch (error) {
      console.error("Error deleting order:", error);
      toast({
        variant: "destructive",
        title: t("error"),
        description: t("errorDescription") || "An error occurred",
      });
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" className="w-full">
          {t("supprimer")}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("etesVousSur")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("supprimerOrdreDescription")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("annuler")}</AlertDialogCancel>

          <Button
            variant="destructive"
            disabled={loading}
            onClick={handleDelete}
          >
            {t("continuer")}
            {loading && <Loader2 className="w-4 h-4 animate-spin" />}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default SupprimerOrdre;
