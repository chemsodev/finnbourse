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
import { SupprimerTitre } from "../SupprimerTitre";
import ModifierTitre from "../ModifierTitre";
import {
  FIND_UNIQUE_BOND_QUERY,
  FIND_UNIQUE_STOCKS_QUERY,
  FIND_UNIQUE_LISTED_COMPANY_QUERY,
  LIST_STOCKS_QUERY,
  LIST_BOND_QUERY,
} from "@/graphql/queries";
import { useEffect, useState } from "react";
import { fetchGraphQLClient } from "@/app/actions/clientGraphQL";
import { formatDate } from "@/lib/utils";
import { useSession } from "next-auth/react";
import RateLimitReached from "../RateLimitReached";
import { Info } from "lucide-react";
import { Button } from "../ui/button";

interface TitreDrawerProps {
  titreId: string;
  type: string;
}

export const TitreDrawer = ({ titreId, type }: TitreDrawerProps) => {
  const session = useSession();
  const userRole = session?.data?.user as any;
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
  const isBond = type === "obligation" || type === "empruntobligataire";

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

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await fetchGraphQLClient<any>(query, {
        id: titreId,
        type: type,
      });

      // Handle the actual data structure based on the query type
      if (type === "action" || type === "opv") {
        setData(result.findUniqueStock);
        const listedCompanyId = result.findUniqueStock.listedcompanyid;
        await fetchListedCompanyData(listedCompanyId);
      } else {
        setData(result.findUniqueBond);
        const listedCompanyId = result.findUniqueBond.listedcompanyid;
        await fetchListedCompanyData(listedCompanyId);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchListedCompanyData = async (listedCompanyId: string) => {
    try {
      const result = await fetchGraphQLClient<any>(
        FIND_UNIQUE_LISTED_COMPANY_QUERY,
        {
          id: listedCompanyId,
        }
      );
      setListedCompanyData(result);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen, titreId]);

  // Handle sheet opening
  const handleOpenChange = (open: boolean) => {
    setIsOpen(open);
    if (open) {
      fetchData();
    }
  };

  // Add a helper function to safely access nested properties
  const safelyAccessNestedProperty = (
    obj: any,
    path: string[],
    defaultValue: any = "N/A"
  ) => {
    try {
      let current = obj;
      for (const key of path) {
        if (
          current === null ||
          current === undefined ||
          typeof current !== "object"
        ) {
          return defaultValue;
        }
        current = current[key];
      }

      if (current === null || current === undefined) {
        return defaultValue;
      }

      // Check if it's a primitive value that can be rendered
      if (typeof current === "object") {
        return JSON.stringify(current);
      }

      return current;
    } catch (error) {
      console.error("Error accessing property:", error);
      return defaultValue;
    }
  };

  // Specifically for contact.email
  const getContactEmail = () => {
    try {
      if (!listedCompanyData?.findUniqueListedCompany?.contact) {
        return "N/A";
      }

      const contact = listedCompanyData.findUniqueListedCompany.contact;
      if (
        typeof contact === "object" &&
        contact !== null &&
        typeof contact.email === "string"
      ) {
        return contact.email;
      }

      return "N/A";
    } catch (error) {
      console.error("Error getting contact email:", error);
      return "N/A";
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger asChild>
        <div
          className="flex gap-2 cursor-pointer justify-center items-center
          text-primary"
        >
          <Info className="h-4 w-4" />
          <div className=" font-semibold text-xs">{t("info")}</div>
        </div>
      </SheetTrigger>
      <SheetContent className="overflow-y-scroll">
        <SheetHeader>
          <SheetTitle className="bg-gray-50/80 text-center text-primary font-bold text-2xl uppercase py-10 flex gap-4 justify-center items-center ">
            <div>{data?.issuer || "N/A"}</div>
          </SheetTitle>
        </SheetHeader>
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
          <SheetDescription className="flex flex-col overflow-y-scroll h-[84%]">
            <div className="flex flex-col gap-4 p-8">
              <div className="flex justify-between">
                <div className="text-gray-400">{t("code")}</div>
                <div className="text-black font-semibold">
                  {safelyAccessNestedProperty(data, ["code"]) || "N/A"}
                </div>
              </div>
              <div className="flex justify-between">
                <div className="text-gray-400">ISIN</div>
                <div className="text-black font-semibold">
                  {safelyAccessNestedProperty(data, ["isincode"]) || "N/A"}
                </div>
              </div>
              <div className="flex justify-between">
                <div className="text-gray-400">{t("marcheDeCotation")}</div>
                <div className="text-black font-semibold">
                  {safelyAccessNestedProperty(data, ["marketlisting"]) || "N/A"}
                </div>
              </div>
              <div className="flex justify-between">
                <div className="text-gray-400">{t("emissionDate")}</div>
                <div className="text-black font-semibold">
                  {data?.emissiondate ? formatDate(data.emissiondate) : "N/A"}
                </div>
              </div>
              <div className="flex justify-between">
                <div className="text-gray-400">{t("enjoymentDate")}</div>
                <div className="text-black font-semibold">
                  {data?.enjoymentdate ? formatDate(data.enjoymentdate) : "N/A"}
                </div>
              </div>
              <div className="flex justify-between">
                <div className="text-gray-400">{t("qte")}</div>
                <div className="text-black font-semibold">
                  {safelyAccessNestedProperty(data, ["quantity"]) || "N/A"}
                </div>
              </div>
              {isBond && (
                <>
                  {/* Commented out bond-specific fields
                  <div className="flex justify-between">
                    <div className="text-gray-400">{t("maturityDate")}</div>
                    <div className="text-black font-semibold">
                      {data?.maturitydate ? formatDate(data.maturitydate) : "N/A"}
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <div className="text-gray-400">{t("yieldRate")}</div>
                    <div className="text-black font-semibold">
                      {safelyAccessNestedProperty(data, ["yieldrate"]) || "N/A"}
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <div className="text-gray-400">{t("fixedRate")}</div>
                    <div className="text-black font-semibold">
                      {safelyAccessNestedProperty(data, ["fixedrate"]) || "N/A"}
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <div className="text-gray-400">{t("estimatedRate")}</div>
                    <div className="text-black font-semibold">
                      {safelyAccessNestedProperty(data, ["estimatedrate"]) || "N/A"}
                    </div>
                  </div>

                  <div className="flex justify-between">
                    <div className="text-gray-400">{t("capitalOperation")}</div>
                    <div className="text-black font-semibold">
                      {safelyAccessNestedProperty(data, ["capitaloperation"]) || "N/A"}
                    </div>
                  </div>
                  */}
                </>
              )}
              {isSubscriptionType && (
                <div className="flex justify-between">
                  <div className="text-gray-400">{t("closingDate")}</div>
                  <div className="text-black font-semibold">
                    {data?.closingdate ? formatDate(data.closingdate) : "N/A"}
                  </div>
                </div>
              )}
              {!isBond && (
                <>
                  <div className="flex justify-between">
                    <div className="text-gray-400">{t("dividendRate")}</div>
                    <div className="text-black font-semibold">
                      {safelyAccessNestedProperty(data, ["dividendrate"]) ||
                        "N/A"}{" "}
                      %
                    </div>
                  </div>

                  {/* Commented out original fields
                  <div className="flex justify-between">
                    <div className="text-gray-400">{t("shareClass")}</div>
                    <div className="text-black font-semibold">
                      {safelyAccessNestedProperty(data, ["shareclass"]) || "N/A"}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-gray-400">{t("votingRights")}</div>
                    <div className="text-black font-semibold">
                      {safelyAccessNestedProperty(data, ["votingrights"]) ? "Disponible" : "Absent"}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-gray-400">{t("dividendInfo")}</div>
                    <div className="text-black font-semibold">
                      {safelyAccessNestedProperty(data, ["dividendinfo"]) || "N/A"}
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
                      {safelyAccessNestedProperty(data, ["yieldrate"]) || "N/A"}{" "}
                      %
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-gray-400">{t("repayementMethod")}</div>
                    <div className="text-black font-semibold">
                      {safelyAccessNestedProperty(data, ["repaymentmethod"]) ||
                        "N/A"}
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
                  {safelyAccessNestedProperty(listedCompanyData, [
                    "findUniqueListedCompany",
                    "nom",
                  ]) || "N/A"}
                </div>
              </div>
              <div className="flex justify-between">
                <div className="text-gray-400">{t("secteurActivite")}</div>
                <div className="text-black font-semibold">
                  {safelyAccessNestedProperty(listedCompanyData, [
                    "findUniqueListedCompany",
                    "secteuractivite",
                  ]) || "N/A"}
                </div>
              </div>
              <div className="flex justify-between">
                <div className="text-gray-400">
                  {t("capitalisationBoursiere")}
                </div>
                <div className="text-black font-semibold">
                  {safelyAccessNestedProperty(listedCompanyData, [
                    "findUniqueListedCompany",
                    "capitalisationboursiere",
                  ]) || "N/A"}
                </div>
              </div>
              <div className="flex justify-between">
                <div className="text-gray-400">{t("siteOfficiel")}</div>
                <Link
                  href={
                    safelyAccessNestedProperty(
                      listedCompanyData,
                      ["findUniqueListedCompany", "siteofficiel"],
                      ""
                    ) || ""
                  }
                  className="text-black font-semibold underline"
                >
                  {safelyAccessNestedProperty(
                    listedCompanyData,
                    ["findUniqueListedCompany", "siteofficiel"],
                    "N/A"
                  )}
                </Link>
              </div>
              <div className="flex justify-between">
                <div className="text-gray-400">{t("email")}</div>
                <div className="text-black font-semibold">
                  {getContactEmail()}
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
              {(userRole === 1 || userRole === 2) && (
                <Link
                  href={getHref()}
                  className="bg-primary text-white px-14 py-2 rounded-md text-center font-semibold flex justify-center my-5 "
                >
                  {isSubscriptionType ? t("souscrire") : t("passerUnOrdre")}
                </Link>
              )}
            </div>
          </SheetDescription>
        )}
      </SheetContent>
    </Sheet>
  );
};
