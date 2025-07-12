import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import Image from "next/image";

import { getTranslations } from "next-intl/server";

const NoAccess = async () => {
  const t = await getTranslations("NoAccess");

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
                <div className="text-primary text-2xl">Accès Refusé</div>
              </div>
            </DialogTitle>
          </DialogHeader>
          <DialogDescription>
            <div className="text-center p-6">
              <p className="text-gray-600 mb-4">
                Vous n'avez pas les permissions nécessaires pour accéder à cette
                page.
              </p>
              <p className="text-gray-600">
                Veuillez contacter un administrateur pour obtenir l'accès
                requis.
              </p>
            </div>
          </DialogDescription>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default NoAccess;
