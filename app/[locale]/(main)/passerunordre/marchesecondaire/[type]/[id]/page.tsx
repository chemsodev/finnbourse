import FormPassationOrdreAction from "@/components/FormPassationOrdreAction";
import FormPassationOrdreObligation from "../../../../../../../components/FormPassationOrdreObligation";
import { getServerSession } from "next-auth";
import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import auth from "@/auth";
import AccessDenied from "@/components/AccessDenied";

const page = async ({ params }: { params: { type: string; id: string } }) => {
  const t = await getTranslations("FormPassationOrdreS");
  const session = await getServerSession(auth);
  const userRole = session?.user?.roleid;

  if (userRole !== 1) {
    return <AccessDenied />;
  }

  const { type, id } = params;

  return (
    <div className="flex flex-col gap-10">
      <div className="h-32 bg-gray-100 rounded-md flex justify-center items-center text-3xl font-bold text-primary uppercase">
        {type === "action"
          ? t("action")
          : type === "sukukms"
          ? t("Sukuk")
          : type === "titresparticipatifsms"
          ? t("TitresParticipatifs")
          : t("obligation")}
      </div>
      {type === "action" ? (
        <FormPassationOrdreAction titreId={id} type={type} />
      ) : (
        <FormPassationOrdreObligation titreId={id} type={type} />
      )}
    </div>
  );
};

export default page;
