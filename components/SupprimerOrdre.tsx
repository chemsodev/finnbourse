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
import { fetchGraphQL } from "@/app/actions/fetchGraphQL";
import { DELETE_ORDER } from "@/graphql/mutations";
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
      await fetchGraphQL<String>(DELETE_ORDER, {
        orderId: titreId,
      });

      router.refresh();
      toast({
        variant: "success",
        title: t("success"),
        description: t("successDescription"),
      });
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        variant: "destructive",
        title: t("error"),
        description:
          error instanceof Error ? error.message : "An error occurred",
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
