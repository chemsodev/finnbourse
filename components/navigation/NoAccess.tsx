import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";
import FinalisationInscriptionParticulier from "../create-user-forms/FinalisationInscriptionParticulier";
import FinalisationInscriptionEntreprise from "../create-user-forms/FinalisationInscriptionEntreprise";

import { getTranslations } from "next-intl/server";
import { getServerSession } from "next-auth";
import auth from "@/auth";
const NoAccess = async () => {
  const t = await getTranslations("NoAccess");
  const session = await getServerSession(auth);
  const clientType = session?.user.followsbusiness;
  return (
    <div className="w-full h-80 bg-gray-100 flex justify-center items-center rounded-md shadow-inner">
      <Dialog>
        <DialogTrigger>
          <div className="py-2 px-6 text-center text-white bg-primary rounded-md">
            {t("vousNavezPasAcces")}
          </div>
        </DialogTrigger>
        <DialogContent className="max-w-fit max-h-[90vh] overflow-y-scroll">
          <DialogHeader>
            <DialogTitle className="flex justify-center items-center">
              <div className="flex flex-col justify-center items-center mb-4">
                <Image src="/favicon.ico" alt="logo" width={100} height={100} />
                <div className="text-primary text-2xl">
                  {t("veuillezFinaliserVotreInscription")}
                </div>
              </div>
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>
            {clientType ? (
              <FinalisationInscriptionEntreprise />
            ) : (
              <FinalisationInscriptionParticulier />
            )}
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NoAccess;
