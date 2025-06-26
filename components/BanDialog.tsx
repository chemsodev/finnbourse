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
// Removed GraphQL dependencies - now using static data
// import { BAN_USER } from "@/graphql/mutations";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
// Removed GraphQL dependencies - now using static data
// import { fetchGraphQLClient } from "@/app/actions/clientGraphQL";
import { useRouter } from "@/i18n/routing";
import { Loader2 } from "lucide-react";

interface BanUserResponse {
  deleteUser: {
    id: string;
    fullname: string;
  };
}

const BanDialog = ({ userId }: { userId: string }) => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const t = useTranslations("clients");

  const handleBanUser = async () => {
    setIsLoading(true);

    try {
      // TODO: Replace with REST API call
      // const orders = await fetchGraphQLClient<BanUserResponse>(BAN_USER, {
      //   userid: userId,
      // });

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        variant: "success",
        title: "Utilisateur banni",
        description: `L'utilisateur  a été banni avec succès.`,
      });
      router.push("/utilisateurs");
      router.refresh();
    } catch (error) {
      console.error("Error fetching orders:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description:
          error instanceof Error ? error.message : "An error occurred",
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
          {t("ban")}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("title")}</AlertDialogTitle>
          <AlertDialogDescription>{t("descriptionBan")}</AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("cancel")}</AlertDialogCancel>
          <Button
            className="bg-destructive hover:bg-destructive/80"
            onClick={handleBanUser}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="flex items-center gap-2">
                {t("continue")} <Loader2 className="animate-spin" />
              </div>
            ) : (
              t("continue")
            )}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default BanDialog;
