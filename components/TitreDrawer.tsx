"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { SupprimerTitre } from "./SupprimerTitre";
import ModifierTitre from "./ModifierTitre";
import {
  FIND_UNIQUE_BOND_QUERY,
  FIND_UNIQUE_STOCKS_QUERY,
  FIND_UNIQUE_LISTED_COMPANY_QUERY,
  LIST_STOCKS_QUERY,
  LIST_BOND_QUERY,
} from "@/graphql/queries";
import { useState } from "react";
import { fetchGraphQL } from "@/app/actions/fetchGraphQL";
import { formatDate } from "@/lib/utils";
import { useSession } from "next-auth/react";
import RateLimitReached from "./RateLimitReached";

interface TitreDrawerProps {
  titreId: string;
  type: string;
}

const TitreDrawer = ({ titreId, type }: TitreDrawerProps) => {
  const session = useSession();
  const userRole = session?.data?.user?.roleid;
  const [data, setData] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [listedCompanyData, setListedCompanyData] = useState<any | null>(null);
  const t = useTranslations("TitreDrawer");
  const [isOpen, setIsOpen] = useState(false);
  const isSubscriptionType = [
    "opv",
    "empreuntobligataire",
    "sukukmp",
    "titresparticipatifsmp",
  ].includes(type);

  const getHref = () => {
    if (type === "empruntobligataire" || type === "opv") {
      return `/passerunordre/marcheprimaire/${type}/${titreId}`;
    } else if (type === "action" || type === "obligation") {
      return `/passerunordre/marchesecondaire/${type}/${titreId}`;
    } else if (type === "sukukmp" || type === "titresparticipatifsmp") {
      return `/passerunordre/marcheprimaire/${type}/${titreId}`;
    } else if (type === "sukukms" || type === "titresparticipatifsms") {
      return `/passerunordre/marchesecondaire/${type}/${titreId}`;
    }
    return "/";
  };

  let query;

  if (type === "action" || type === "opv") {
    query = FIND_UNIQUE_STOCKS_QUERY;
  } else {
    query = FIND_UNIQUE_BOND_QUERY;
  }

  const fetchListedCompanyData = async (listedCompanyId: string) => {
    try {
      const result = await fetchGraphQL<any>(FIND_UNIQUE_LISTED_COMPANY_QUERY, {
        id: listedCompanyId,
      });
      setListedCompanyData(result);
    } catch (error) {
      if (error === "Too many requests") {
        return <RateLimitReached />;
      }
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const isBond = type === "obligation" || type === "empruntobligataire";

  const fetchData = async () => {
    try {
      const result = await fetchGraphQL<any>(query, {
        id: titreId,
        type,
      });

      setData(
        type === "action" || type === "opv"
          ? result.findUniqueStock
          : result.findUniqueBond
      );

      fetchListedCompanyData(
        type === "action" || type === "opv"
          ? result.findUniqueStock.listedcompanyid
          : result.findUniqueBond.listedcompanyid
      );
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  // Handle sheet opening
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      fetchData();
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger className="capitalize rounded-md  px-4 py-1 bg-primary text-white hover:bg-primary/80 shadow">
        {t("plus")}
      </SheetTrigger>
      <SheetContent className="overflow-y-scroll">
        {loading ? (
          <div className="flex justify-center items-center h-full w-full">
            <div role="status">
              <svg
                aria-hidden="true"
                className="w-10 h-10 text-gray-200 animate-spin fill-secondary"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
              <span className="sr-only">loading...</span>
            </div>
          </div>
        ) : (
          <>
            <SheetHeader>
              <SheetTitle className="bg-gray-50 shadow-inner text-center text-primary font-bold text-2xl uppercase py-10 flex gap-4 justify-center items-center ">
                <div>{data?.issuer}</div>
              </SheetTitle>
              <SheetDescription className="flex flex-col overflow-y-scroll h-[84%]">
                <div className="flex flex-col gap-4 p-8">
                  <div className="flex justify-between">
                    <div className="text-gray-400">{t("code")}</div>
                    <div className="text-black font-semibold">
                      {data?.code || "N/A"}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-gray-400">ISIN</div>
                    <div className="text-black font-semibold">
                      {data?.isincode || "N/A"}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-gray-400">{t("marcheDeCotation")}</div>
                    <div className="text-black font-semibold">
                      {data?.marketlisting || "N/A"}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-gray-400">{t("emissionDate")}</div>
                    <div className="text-black font-semibold">
                      {formatDate(data?.emissiondate || 0) || "N/A"}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-gray-400">{t("enjoymentDate")}</div>
                    <div className="text-black font-semibold">
                      {formatDate(data?.enjoymentdate || 0) || "N/A"}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-gray-400">{t("qte")}</div>
                    <div className="text-black font-semibold">
                      {data?.quantity || "N/A"}
                    </div>
                  </div>
                  {isBond && (
                    <>
                      {/* Commented out bond-specific fields
                      <div className="flex justify-between">
                        <div className="text-gray-400">{t("maturityDate")}</div>
                        <div className="text-black font-semibold">
                          {formatDate(data?.maturitydate || 0) || "N/A"}
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <div className="text-gray-400">{t("yieldRate")}</div>
                        <div className="text-black font-semibold">
                          {data?.yieldrate || "N/A"}
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <div className="text-gray-400">{t("fixedRate")}</div>
                        <div className="text-black font-semibold">
                          {data?.fixedrate || "N/A"}
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <div className="text-gray-400">{t("estimatedRate")}</div>
                        <div className="text-black font-semibold">
                          {data?.estimatedrate || "N/A"}
                        </div>
                      </div>

                      <div className="flex justify-between">
                        <div className="text-gray-400">{t("capitalOperation")}</div>
                        <div className="text-black font-semibold">
                          {data?.capitaloperation || "N/A"}
                        </div>
                      </div>
                      */}
                    </>
                  )}
                  {isSubscriptionType && (
                    <div className="flex justify-between">
                      <div className="text-gray-400">{t("closingDate")}</div>
                      <div className="text-black font-semibold">
                        {formatDate(data?.closingdate || 0) || "N/A"}
                      </div>
                    </div>
                  )}
                  {!isBond && (
                    <>
                      <div className="flex justify-between">
                        <div className="text-gray-400">{t("dividendRate")}</div>
                        <div className="text-black font-semibold">
                          {data?.dividendrate || "N/A"} %
                        </div>
                      </div>

                      {/* Commented out original fields
                      <div className="flex justify-between">
                        <div className="text-gray-400">{t("shareClass")}</div>
                        <div className="text-black font-semibold">
                          {data?.shareclass || "N/A"}
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <div className="text-gray-400">{t("votingRights")}</div>
                        <div className="text-black font-semibold">
                          {data?.votingrights ? "Disponible" : "Absent"}
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <div className="text-gray-400">{t("dividendInfo")}</div>
                        <div className="text-black font-semibold">
                          {data?.dividendinfo || "N/A"}
                        </div>
                      </div>
                      */}
                    </>
                  )}
                  {isBond ||
                  type === "sukukms" ||
                  type === "sukukmp" ||
                  type === "titresparticipatifsms" ||
                  type === "titresparticipatifsmp" ? (
                    <>
                      <div className="flex justify-between">
                        <div className="text-gray-400">{t("yieldRate")}</div>
                        <div className="text-black font-semibold">
                          {data?.yieldrate || "N/A"} %
                        </div>
                      </div>
                      <div className="flex justify-between">
                        <div className="text-gray-400">
                          {t("repayementMethod")}
                        </div>
                        <div className="text-black font-semibold">
                          {data?.repaymentmethod || "N/A"}
                        </div>
                      </div>
                    </>
                  ) : null}
                </div>
                <div className="flex items-baseline mx-4">
                  <div className="text-xs text-primary font-semibold capitalize w-fit pr-2 flex-shrink-0">
                    {t("societeEmetrice")}
                  </div>
                  <div className="border-b border-gray-100 w-full px-2"></div>
                </div>
                <div className="flex flex-col gap-4 p-8">
                  <div className="flex justify-between">
                    <div className="text-gray-400">{t("denomination")}</div>
                    <div className="text-black font-semibold">
                      {listedCompanyData?.findUniqueListedCompany.nom || "N/A"}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-gray-400">{t("secteurActivite")}</div>
                    <div className="text-black font-semibold">
                      {listedCompanyData?.findUniqueListedCompany
                        .secteuractivite || "N/A"}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-gray-400">
                      {t("capitalisationBoursiere")}
                    </div>
                    <div className="text-black font-semibold">
                      {listedCompanyData?.findUniqueListedCompany
                        .capitalisationboursiere || "N/A"}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-gray-400">{t("siteOfficiel")}</div>
                    <Link
                      href={
                        listedCompanyData?.findUniqueListedCompany
                          .siteofficiel || ""
                      }
                      className="text-black font-semibold underline"
                    >
                      {listedCompanyData?.findUniqueListedCompany
                        .siteofficiel || "N/A"}
                    </Link>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-gray-400">{t("email")}</div>
                    <div className="text-black font-semibold">
                      {listedCompanyData?.findUniqueListedCompany.contact
                        .email || "N/A"}
                    </div>
                  </div>
                </div>
                <div className=" p-4">
                  {(userRole === 3 || userRole === 2) &&
                    listedCompanyData?.findUniqueListedCompany && (
                      <div className="flex w-full gap-4 ">
                        <ModifierTitre
                          type={type}
                          titreData={data}
                          listedCompanyData={
                            listedCompanyData?.findUniqueListedCompany
                          }
                        />
                        <SupprimerTitre securityId={titreId} type={type} />
                      </div>
                    )}
                  {userRole === 1 && (
                    <Link
                      href={getHref()}
                      className="bg-primary text-white px-14 py-2 rounded-md text-center font-semibold flex justify-center my-5 "
                    >
                      {isSubscriptionType ? t("souscrire") : t("passerUnOrdre")}
                    </Link>
                  )}
                </div>
              </SheetDescription>
            </SheetHeader>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default TitreDrawer;
