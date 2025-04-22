"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { LIST_ORDERS_QUERY_ONE_ORDER } from "@/graphql/queries";
import { formatDate } from "@/lib/utils";
import { ValiderPartiellement } from "../ValiderPartiellement";
import { useState } from "react";
import { fetchGraphQL } from "@/app/actions/fetchGraphQL";
import { Order } from "@/lib/interfaces";
import BulletinSubmitDialog from "../BulletinSubmitDialog";
import SupprimerOrdre from "../SupprimerOrdre";
import { useSession } from "next-auth/react";

import { ValiderTotallement } from "../ValiderTotallement";
import { EchouerOrdre } from "../EchouerOrdre";
import PdfDialog from "../PdfDialog";
import { Button } from "../ui/button";
import RateLimitReached from "../RateLimitReached";
import { Info } from "lucide-react";

interface QueryData {
  listOrdersExtended: Order[];
}

interface OrdreDrawer {
  titreId: string;
}

const OrdreDrawer = ({ titreId }: OrdreDrawer) => {
  const [isOpen, setIsOpen] = useState(false);
  const session = useSession();
  const userRole = session?.data?.user?.roleid;
  const t = useTranslations("OrdreDrawer");
  const [data, setData] = useState<QueryData | null>(null);
  const [loading, setLoading] = useState(false);
  const tStatus = useTranslations("status");

  const fetchData = async () => {
    setLoading(true);
    try {
      const result = await fetchGraphQL<QueryData>(
        LIST_ORDERS_QUERY_ONE_ORDER,
        {
          orderid: titreId,
        }
      );
      setData(result);
    } catch (error) {
      if (error === "Too many requests") {
        return <RateLimitReached />;
      }
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

  const order = data?.listOrdersExtended?.[0];

  return (
    <Sheet open={isOpen} onOpenChange={handleOpenChange}>
      <SheetTrigger disabled={loading} asChild>
        <Button size="icon">
          <Info className="w-4 h-4" />
        </Button>
      </SheetTrigger>
      <SheetContent className="flex flex-col justify-between overflow-y-scroll">
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
              <SheetTitle className="bg-gray-50 text-center text-primary font-bold text-2xl uppercase pt-10 flex gap-4 justify-center items-center ">
                <div>{order?.issuer}</div>
              </SheetTitle>
            </SheetHeader>
            <SheetDescription className="p-6 flex flex-col justify-between overflow-y-scroll">
              <div className="flex flex-col gap-4">
                <div className="flex justify-between">
                  <div className="text-gray-500">{t("type")}</div>
                  <div className="text-black font-semibold capitalize">
                    {order?.securitytype === "action"
                      ? t("action")
                      : order?.securitytype === "obligation"
                      ? t("obligation")
                      : order?.securitytype === "sukukms" ||
                        order?.securitytype === "sukukmp"
                      ? t("sukuk")
                      : order?.securitytype === "opv"
                      ? t("opv")
                      : order?.securitytype === "titresparticipatifsmp" ||
                        order?.securitytype === "titresparticipatifsms"
                      ? t("titre_participatif")
                      : order?.securitytype === "empruntobligataire"
                      ? t("emprunt_obligataire")
                      : t("titre")}
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="text-gray-500">{t("direction")}</div>
                  <div
                    className={`text-black font-semibold capitalize ${
                      order?.orderdirection === 1
                        ? "text-green-500"
                        : "text-red-500"
                    }`}
                  >
                    {order?.orderdirection === 1 ? t("achat") : t("vente")}
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="text-gray-500">{t("qte")}</div>
                  <div className="text-black font-semibold">
                    {order?.quantity || "N/A"}
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="text-gray-500">{t("valeurNominale")}</div>
                  <div className="text-black font-semibold">
                    {order?.pricelimitmin || "N/A"}
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="text-gray-500">{t("validite")}</div>
                  <div className="text-black font-semibold">
                    {order?.duration || "N/A"}
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="text-gray-500">{t("date")}</div>
                  <div className="text-black font-semibold">
                    {(order?.orderdate && formatDate(order?.orderdate)) ||
                      "N/A"}
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="text-gray-500">{t("status")}</div>
                  <div className="text-black font-semibold">
                    {order?.orderstatus === 0 && order?.payedWithCard
                      ? "Brouillon Brouillon payé"
                      : order?.orderstatus === 0 && !order?.payedWithCard
                      ? tStatus("Draft")
                      : order?.orderstatus === 1
                      ? tStatus("Pending")
                      : order?.orderstatus === 2
                      ? tStatus("In_Progress")
                      : order?.orderstatus === 3
                      ? tStatus("Validated")
                      : order?.orderstatus === 4
                      ? tStatus("Being_Processed")
                      : order?.orderstatus === 5
                      ? tStatus("Completed")
                      : order?.orderstatus === 6
                      ? tStatus("Awaiting_Approval")
                      : order?.orderstatus === 7
                      ? tStatus("Ongoing")
                      : order?.orderstatus === 8
                      ? tStatus("Partially_Validated")
                      : order?.orderstatus === 9
                      ? tStatus("Expired")
                      : order?.orderstatus === 10
                      ? tStatus("Rejected")
                      : order?.orderstatus === 11
                      ? tStatus("Cancelled")
                      : "Unknown"}
                  </div>
                </div>
                <div className="flex items-baseline">
                  <div className="text-xs text-black font-semibold w-full">
                    {t("societeEmetrice")}
                  </div>
                  <div className="border-b border-gray-100 w-full"></div>
                </div>
                <div className="flex justify-between">
                  <div className="text-gray-500">{t("code")}</div>
                  <div className="text-black font-semibold uppercase">
                    {order?.securityid?.code || "N/A"}
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="text-gray-500">{t("secteurActivite")}</div>
                  <div className="text-black font-semibold">
                    {order?.securityid?.secteurActivite || "N/A"}
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="text-gray-500">
                    {t("capitalisationBoursiere")}
                  </div>
                  <div className="text-black font-semibold">
                    {order?.securityid?.capitalisationBoursiere || "N/A"}
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="text-gray-500">{t("site")}</div>
                  <Link
                    href={order?.securityid?.siteOfficiel || ""}
                    className="text-black font-semibold underline"
                  >
                    {order?.securityid?.siteOfficiel || "N/A"}
                  </Link>
                </div>
                <div className="flex justify-between">
                  <div className="text-gray-500">{t("email")}</div>
                  <div className="text-black font-semibold">
                    {order?.securityid?.contact?.email || "N/A"}
                  </div>
                </div>
                <div className="flex justify-between">
                  <div className="text-gray-500">{t("phoneNumber")}</div>
                  <div className="text-black font-semibold">
                    {order?.securityid?.contact?.phonenumber || "N/A"}
                  </div>
                </div>
                <div className="flex items-baseline">
                  <div className="text-xs text-black font-semibold w-full">
                    {t("investisseur")}
                  </div>
                  <div className="border-b border-gray-100 w-full"></div>
                </div>
                <div className="flex flex-col gap-4">
                  {order?.investorid?.followsbusiness === false ? (
                    <div className="flex justify-between">
                      <div className="text-gray-500">{t("nom")}</div>
                      <div className="text-black font-semibold capitalize">
                        {order?.investorid?.fullname}
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between">
                      <div className="text-gray-500">{t("nom")}</div>
                      <div className="text-black font-semibold capitalize">
                        {order?.investorid?.fullname}
                      </div>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <div className="text-gray-500">{t("type")}</div>
                    <div className="text-black font-semibold capitalize">
                      {order?.investorid?.followsbusiness === false
                        ? t("particulier")
                        : t("entreprise")}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-gray-500">{t("email")}</div>
                    <div className="text-black font-semibold capitalize">
                      {order?.investorid?.email}
                    </div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-gray-500">{t("phoneNumber")}</div>
                    <div className="text-black font-semibold capitalize">
                      {order?.investorid?.phonenumber}
                    </div>
                  </div>
                  <div className="flex items-baseline">
                    <div className="text-xs text-black font-semibold w-full">
                      {t("negociateur")}
                    </div>
                    <div className="border-b border-gray-100 w-full"></div>
                  </div>
                  <div className="flex justify-between">
                    <div className="text-gray-500">{t("negociateur")}</div>
                    <div className="text-black font-semibold capitalize">
                      {order?.negotiatorid?.fullname}
                    </div>
                  </div>
                </div>
              </div>
            </SheetDescription>
            {userRole === 1 && (
              <SheetFooter className="items-center mx-auto flex w-full px-4 pb-4">
                <div className="flex flex-col items-center justify-center w-full gap-2">
                  <div className="flex w-full gap-2 items-center">
                    {data?.listOrdersExtended?.[0]?.orderstatus === 0 && (
                      <BulletinSubmitDialog
                        createdOrdreId={order?.id || ""}
                        ispayedWithCard={order?.payedWithCard || false}
                        page="OrdreDrawer"
                      />
                    )}
                    {/*<EditOrderDialog order={order} /> */}
                    {(data?.listOrdersExtended?.[0]?.orderstatus === 0 ||
                      data?.listOrdersExtended?.[0]?.orderstatus === 1) && (
                      <SupprimerOrdre titreId={order?.id || ""} />
                    )}
                  </div>
                </div>
              </SheetFooter>
            )}
            {(userRole === 3 || userRole === 2) &&
              order?.orderstatus !== 3 &&
              order?.orderstatus !== 8 &&
              order?.orderstatus !== 9 &&
              order?.orderstatus !== 10 &&
              order?.orderstatus !== 11 && (
                <SheetFooter>
                  <div className="h-full flex-col flex w-full justify-center items-center m-5 gap-4">
                    <div className="flex gap-4 w-full"></div>
                    <div className="flex gap-4  w-full mt-0">
                      <ValiderTotallement
                        ordreId={order?.id || ""}
                        quantity={Number(order?.quantity) || 0}
                      />
                      <ValiderPartiellement ordreId={order?.id || ""} />
                    </div>
                    <div className="flex gap-4  w-full">
                      <EchouerOrdre ordreId={order?.id || ""} />
                      {order?.orderstatus !== 0 &&
                        order?.orderstatus !== 9 &&
                        order?.orderstatus !== 10 &&
                        order?.orderstatus !== 11 && (
                          <PdfDialog fileKey={order?.signeddocumnet || ""}>
                            <Button className="w-full" variant="outline">
                              {t("signedDocument")}
                            </Button>
                          </PdfDialog>
                        )}
                    </div>
                  </div>
                </SheetFooter>
              )}
          </>
        )}
      </SheetContent>
    </Sheet>
  );
};

export default OrdreDrawer;
