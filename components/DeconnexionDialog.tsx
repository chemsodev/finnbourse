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
import { useTranslations } from "next-intl";
import { CiLogout } from "react-icons/ci";
import LogoutButton from "./LogoutButton";

export function DeconnexionDialog() {
  const t = useTranslations("DeconnexionDialog");

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <button className="flex items-center gap-4 hover:bg-red-600/20 hover:text-primary hover:shadow-sm py-2 px-6 w-full rounded-md ">
          <CiLogout size={15} className="text-red-500" />
          <div className="capitalize text-xs">{t("deconnexion")}</div>
        </button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("titre")}</AlertDialogTitle>
          <AlertDialogDescription className="mt-4">
            {t("description")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="mt-4">
          <AlertDialogCancel>{t("annuler")}</AlertDialogCancel>
          <LogoutButton />
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
