import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { UserCog } from "lucide-react";
import { FormAjoutRole } from "./FormAjoutRole";
import { useTranslations } from "next-intl";

const AjouterUnRole = () => {
  const t = useTranslations("AjouterUnRole");
  return (
    <Dialog>
      <DialogTrigger className=" border py-4 px-8 shadow hover:shadow-inner hover:bg-gray-50 rounded-md capitalize md:text-xl mt-10 font-bold flex justify-start gap-4 items-center w-full">
        <UserCog size={35} />
        <div className="flex w-full justify-center">{t("ajouterUnRole")}</div>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-primary text-xl text-center">
            {t("ajouterUnRole")}
          </DialogTitle>
          <DialogDescription>
            <FormAjoutRole />
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default AjouterUnRole;
