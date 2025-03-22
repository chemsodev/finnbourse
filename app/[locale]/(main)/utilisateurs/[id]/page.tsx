import { BsImages } from "react-icons/bs";
import TabSearch from "@/components/TabSearch";
import MyPagination from "@/components/MyPagination";
import PdfDialog from "@/components/PdfDialog";
import AtribuerNegociateur from "@/components/AtribuerNegociateur";
import { getTranslations } from "next-intl/server";
import { FIND_UNIQUE_USER, GET_REST_USER_DATA } from "@/graphql/queries";
import SuspendreUtilisateurDialog from "@/components/SuspendreUtilisateurDialog";
import BanDialog from "@/components/BanDialog";
import RejetUtilisateur from "@/components/RejetUtilisateur";
import ChangerRoleDialog from "@/components/ChangerRoleDialog";
import { fetchGraphQL } from "@/app/actions/fetchGraphQL";
import { User } from "@/lib/interfaces";
import OrdresTable from "@/components/OrdresTable";
import ValidateUser from "@/components/ValidateUser";
import { formatDate } from "@/lib/utils";
import RateLimitReached from "@/components/RateLimitReached";

interface GetUserResponse {
  findUniqueUser: User;
}

const page = async (props: {
  params: { id: string };
  searchParams?: Promise<{
    searchquery?: string;
    page?: string;
    state?: string;
  }>;
}) => {
  const t = await getTranslations("clients");
  const e = await getTranslations("FinalisationInscriptionEntreprise");
  const { id } = props.params;
  const searchParams = await props.searchParams;
  const currentPage = Number(searchParams?.page) || 0;
  const searchquery = searchParams?.searchquery || "";
  const state = searchParams?.state || "99";

  let userDetails: GetUserResponse | null = null;
  try {
    userDetails = await fetchGraphQL<GetUserResponse>(FIND_UNIQUE_USER, {
      userid: id,
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
  }

  let RestOfUserData: any;
  try {
    RestOfUserData = await fetchGraphQL<any>(GET_REST_USER_DATA, {
      userId: id,
      type: "userdata",
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
  }

  let userDataFiles: any;
  try {
    userDataFiles = await fetchGraphQL<any>(GET_REST_USER_DATA, {
      userId: id,
      type: "file",
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    userDataFiles = null;
  }

  const transformUserData = (listData: any) => {
    return listData.reduce((acc: any, item: any) => {
      acc[item.name] = item.data;
      return acc;
    }, {});
  };

  const restOfuserData = transformUserData(RestOfUserData.listData);

  const userFiles = transformUserData(userDataFiles.listData);

  const particulierUserData = [
    {
      label: t("type"),
      value: userDetails?.findUniqueUser.followsbusiness
        ? t("entreprise")
        : t("particulier"),
    },
    {
      label: t("role"),
      value:
        userDetails?.findUniqueUser.roleid === 1
          ? t("investisseur")
          : userDetails?.findUniqueUser.roleid === 2
          ? t("negociateur")
          : t("manager"),
    },
    {
      label: t("telephone"),
      value: userDetails?.findUniqueUser.phonenumber,
    },
    { label: t("email"), value: userDetails?.findUniqueUser.email },
    { label: t("adresse"), value: restOfuserData.adresse || "N/A" },
    {
      label: t("dateDeNaissance"),
      value: restOfuserData.dateNaissance
        ? formatDate(restOfuserData.dateNaissance)
        : "N/A",
    },
    {
      label: t("numeroDeConfiance"),
      value: restOfuserData.numConf || "N/A",
    },
    {
      label: t("nationalite"),
      value: restOfuserData.nationalite || "N/A",
    },
    {
      label: t("paysDeResidence"),
      value: restOfuserData.paysResidence || "N/A",
    },
    {
      label: t("paysDeNaissance"),
      value: restOfuserData.paysNaissance || "N/A",
    },
    {
      label: t("profession"),
      value: restOfuserData.profession || "N/A",
    },
    {
      label: t("codePostal"),
      value: restOfuserData.codePostal || "N/A",
    },
    {
      label: t("rib"),
      value: restOfuserData.rib || "N/A",
    },
    {
      label: t("nCompteTitres"),
      value: restOfuserData.nCompteTitres || "N/A",
    },
  ];

  const entrepriseUserData = [
    {
      label: e("denomination"),
      value: restOfuserData.denomination || "N/A",
    },
    {
      label: e("siegeSocial"),
      value: restOfuserData.siegeSocial || "N/A",
    },
    {
      label: e("nif"),
      value: restOfuserData.nif || "N/A",
    },
    {
      label: e("nis"),
      value: restOfuserData.nis || "N/A",
    },
    {
      label: e("rc"),
      value: restOfuserData.rc || "N/A",
    },
    {
      label: e("numeroArticle"),
      value: restOfuserData.numeroArticle || "N/A",
    },
    {
      label: e("nomEtPrenomDuRepresentantLegal"),
      value: restOfuserData.nomRL || "N/A",
    },
    {
      label: e("numeroDeTelephoneDuRepresentantLegal"),
      value: restOfuserData.telRL || "N/A",
    },
    {
      label: e("nomEtPrenomDuMandataire"),
      value: restOfuserData.nomM || "N/A",
    },
    {
      label: e("numeroDeTelephoneDuMandataire"),
      value: restOfuserData.telM || "N/A",
    },
    {
      label: e("identifiantRL"),
      value: restOfuserData.idRL || "N/A",
    },

    {
      label: e("identifiantMandataire"),
      value: restOfuserData.idM || "N/A",
    },
    {
      label: t("rib"),
      value: restOfuserData.rib || "N/A",
    },
    {
      label: t("nCompteTitres"),
      value: restOfuserData.nCompteTitres || "N/A",
    },
  ];

  const UserParticulierFiles = [
    {
      file: userFiles.copieID,
      title: t("copieDeLaPieceDIdentite"),
    },
    {
      file: userFiles.residence,
      title: t("residenceDeMoinsDe03Mois"),
    },
    {
      file: userFiles.rib,
      title: t("numeroDuCompteBancaire"),
    },
    {
      file: userFiles.AttestationConservationDocuments,
      title: t("attestationDeLaConservationDesDocuments"),
    },
    {
      file: userFiles.aupp,
      title: t("attestationDUtilisationEtDeProtectionDesDonneesPersonnelles"),
    },
    {
      file: userFiles.ctct,
      title: t("conventionDeTenueDeCompteTitresSignee"),
    },
    {
      file: userFiles.conventionCourtage,
      title: t("conventionDeCourtageSignee"),
    },
    {
      file: userFiles.ActeNaissance,
      title: t("copieDeLActeDeNaissance"),
    },
    {
      file: userFiles.spacimen,
      title: t("specimenDeLaSignature"),
    },
    {
      file: userFiles.residence,
      title: t("copieDeLaFicheFamiliale"),
    },
    {
      file: "",
      title: t("acteDeNaissanceDeLEnfantConcerne"),
    },
  ];
  const UserEntrepriseFiles = [
    {
      file: userFiles.copieRCP,
      title: t("copieDuRegistreDeCommerce"),
    },
    {
      file: userFiles.sdm,
      title: t("statutsDeLaSociete"),
    },
    {
      file: userFiles.copieID,
      title: t("copieDeLaPieceDIdentiteDuGerant"),
    },
    {
      file: userFiles.copieIDM,
      title: t("copieDeLaPieceDIdentiteDuMandataire"),
    },
    {
      file: userFiles.copieNIF,
      title: t("copieDuNumeroDIdentificationFiscale"),
    },
    {
      file: userFiles.copieNIS,
      title: t("copieDuNumeroDIdentificationStatistique"),
    },
    {
      file: userFiles.dps,
      title: t("declarationDeSouscription"),
    },
    {
      file: userFiles.specimenSig,
      title: t("specimenDeLaSignature"),
    },
    {
      file: userFiles.copiePV,
      title: t("copieDuProcesVerbal"),
    },
    {
      file: userFiles.acd,
      title: t("attestationDeConservationDesDocuments"),
    },
    {
      file: userFiles.aupdp,
      title: t("attestationDUtilisationEtDeProtectionDesDonneesPersonnelles"),
    },
    {
      file: userFiles.ctct,
      title: t("conventionDeTenueDeCompteTitresSignee"),
    },
    {
      file: userFiles.cc,
      title: t("conventionDeCourtageSignee"),
    },
  ];
  return (
    <div className="flex flex-col md:flex-row gap-4 motion-preset-focus motion-duration-2000">
      <div className="md:h-[95vh] w-full md:w-[40%] shadow-md rounded-md bg-white border-4 border-primary">
        <div className="bg-primary w-full">
          <ChangerRoleDialog
            userId={id}
            role={userDetails?.findUniqueUser.roleid || 0}
          />
        </div>
        <div className="flex justify-center bg-primary">
          <div className="h-[16vh] w-32 bg-white/20 rounded-full flex justify-center items-center mt-14 shadow-inner">
            <BsImages size={50} className="text-gray-200" />
          </div>
        </div>
        <div className="capitalize flex justify-center text-2xl font-semibold text-white py-4 bg-primary">
          {userDetails?.findUniqueUser.fullname}
        </div>
        <div className="flex flex-col gap-4 m-4 mt-8 p-4 md:overflow-scroll md:max-h-[51vh] rounded-md">
          {(userDetails?.findUniqueUser.followsbusiness
            ? entrepriseUserData
            : particulierUserData
          ).map((item: any, index: any) => (
            <div key={index} className="flex gap-4 items-baseline">
              <div className="text-gray-400 capitalize">{item.label} :</div>
              <div className="text-primary font-semibold capitalize">
                {item.value}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-4 w-full">
        <div className="w-full border shadow rounded-md hover:scale-105 transition-transform duration-300 bg-white">
          <div className="text-xl text-primary font-semibold m-4">
            {t("documentsPersonnels")} :
          </div>
          <div className="flex flex-col flex-wrap my-4 mx-8 md:text-xs gap-2 h-32">
            {(userDetails?.findUniqueUser.followsbusiness
              ? UserEntrepriseFiles
              : UserParticulierFiles
            ).map((file, index) => (
              <ul key={index} className="w-60">
                <PdfDialog fileKey={file.file}>{file.title}</PdfDialog>
              </ul>
            ))}
          </div>
        </div>
        <div className="w-full h-full flex flex-col gap-4">
          <div className="flex justify-end">
            <TabSearch />
          </div>
          <OrdresTable
            skip={currentPage}
            searchquery={searchquery}
            pageType="utilisateurUnique"
            uniqueUserId={id}
            state={state}
          />
          <div className="flex justify-end">
            <MyPagination />
          </div>
        </div>
        {userDetails?.findUniqueUser.roleid === 0 && (
          <div className="w-full flex gap-4">
            <RejetUtilisateur />
            <ValidateUser userId={id} />
          </div>
        )}
        {userDetails?.findUniqueUser.roleid !== 0 && (
          <div className="w-full flex gap-4">
            <BanDialog userId={id} />
            <SuspendreUtilisateurDialog
              userEmail={userDetails?.findUniqueUser.email || ""}
            />
            {userDetails?.findUniqueUser.roleid === 1 && (
              <AtribuerNegociateur
                userId={id}
                oldNegotiatorId={userDetails?.findUniqueUser.negotiatorid}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default page;
