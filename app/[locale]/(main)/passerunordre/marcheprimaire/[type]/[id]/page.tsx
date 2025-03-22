import React from "react";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import auth from "@/auth";

import FormPassationOrdreMarchePrimaire from "@/components/passation-ordre/FormPassationOrdreMarchePrimaire";
import AccessDenied from "@/components/AccessDenied";

const page = async ({ params }: { params: { type: string; id: string } }) => {
  const session = await getServerSession(auth);
  const userRole = session?.user?.roleid;

  if (userRole !== 1) {
    return <AccessDenied />;
  }

  const t = await getTranslations("FormPassationOrdreP");
  const { type, id } = params;

  return (
    <div className="flex flex-col gap-10  motion-preset-focus motion-duration-2000">
      <div className="h-32 bg-gray-100 rounded-md flex justify-center items-center text-3xl font-bold text-primary uppercase ">
        {type === "opv"
          ? t("OPV")
          : type === "sukukmp"
          ? t("Sukuk")
          : type === "titresparticipatifsmp"
          ? t("TitresParticipatifs")
          : type === "empruntobligataire"
          ? t("EmpruntObligataire")
          : ""}
      </div>

      <FormPassationOrdreMarchePrimaire titreId={id} type={type} />
    </div>
  );
};

export default page;
