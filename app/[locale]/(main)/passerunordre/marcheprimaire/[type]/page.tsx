import auth from "@/auth";
import AjoutSocieteEmettrice from "@/components/listed-company/AjoutSocieteEmettrice";
import AjoutTitre from "@/components/AjoutTitre";
import MyMarquee from "@/components/MyMarquee";
import { TitresTable } from "@/components/TitresTable";
import { Link } from "@/i18n/routing";
import { ArrowLeft } from "lucide-react";
import { getServerSession } from "next-auth";
import { getTranslations } from "next-intl/server";

import React from "react";

const page = async (props: { params: { type: string } }) => {
  const t = await getTranslations("Titres");
  const session = await getServerSession(auth);
  const userRole = session?.user?.roleid;

  const { type } = props.params;

  return (
    <div className=" motion-preset-focus motion-duration-2000">
      <div className="mt-3">
        <MyMarquee />
      </div>
      <Link
        href="/passerunordre/marcheprimaire"
        className="flex gap-2 items-center border rounded-md py-1 px-2 bg-primary text-white w-fit absolute md:mt-4"
      >
        <ArrowLeft className="w-5" /> <div>{t("back")}</div>
      </Link>
      <div className="flex flex-col gap-1 mt-16 mb-8 ml-8 text-center md:ltr:text-left md:rtl:text-right">
        <div className="text-3xl font-bold text-primary">
          {t("marchePrimaire")}
          <span className="text-lg text-black mx-1">
            {type === "opv"
              ? t("opv")
              : type === "empruntobligataire"
              ? t("empruntObligataire")
              : type === "sukuk"
              ? t("sukuk")
              : type === "titresparticipatifs"
              ? t("titresParticipatifs")
              : ""}
          </span>
        </div>
        <div className="text-xs text-gray-500">{t("explMP")}</div>
      </div>
      {(userRole === 3 || userRole === 2) && (
        <div className="flex items-baseline gap-4 justify-end w-full">
          <AjoutSocieteEmettrice />
          <AjoutTitre type={type} />
        </div>
      )}

      <div className="border ml-4 border-gray-100 rounded-md p-4 bg-primary/5">
        <TitresTable type={type} />
      </div>
    </div>
  );
};

export default page;
