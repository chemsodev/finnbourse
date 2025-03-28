import { fetchGraphQL } from "@/app/actions/fetchGraphQL";
import auth from "@/auth";
import { LIST_ORDERS_QUERY } from "@/graphql/queries";
import { Order } from "@/lib/interfaces";
import { getServerSession } from "next-auth";
import { getTranslations } from "next-intl/server";
import React, { Suspense } from "react";
import {
  TableBody,
  TableHead,
  TableCell,
  TableRow,
  TableHeader,
  Table,
} from "./ui/table";
import OrdersTableSkeleton from "./OrdersTableSkeleton";
import OrdreDrawer from "./OrdreDrawer";
import OrderStateFilter from "./OrderStateFilter";
import LogOutAgent from "./LogOutAgent";
import RateLimitReached from "./RateLimitReached";

interface GetOrdersResponse {
  listOrdersExtended: Order[];
}

const OrdresTable = async ({
  skip,
  searchquery,
  pageType,
  uniqueUserId,
  state,
}: {
  skip: number;
  searchquery: string;
  state: string;
  pageType?: string;
  uniqueUserId?: string;
}) => {
  const session = await getServerSession(auth);
  const userRole = session?.user?.roleid;
  const take = pageType === "dashboard" ? 4 : 6;
  const investorId = session?.user?.id;
  let draft = "Brouillon";
  if (!skip) {
    skip = 0;
  }

  let orders: GetOrdersResponse | null = null;
  try {
    orders = await fetchGraphQL<GetOrdersResponse>(
      ` query ListOrders($investorid: String, $skip: Int, $take: Int, $searchquery: String,$state: Int) {
    listOrdersExtended(
      skip: $skip
      take: $take
      where: {
        investorid: { equals: $investorid } 
        ${
          searchquery.length === 36
            ? "id: { equals: $searchquery }"
            : "securityissuer: { contains: $searchquery, mode: insensitive }"
        }
        orderstatus: { equals: $state} 
      }
      include: {
        dynamic: { tableColumn: "securitytype", idColumn: "securityid" }
        manual: [
          { table: "user", foreignKey: "investorid" }
          { table: "user", foreignKey: "negotiatorid" }
        ]
      }
    ) {
      id
      ordertypes
      orderdirection
      securityid
      securitytype
      quantity
      pricelimitmin
      pricelimitmax
      duration
      orderdate
      orderstatus
      investorid
      negotiatorid
      securityissuer
      payedWithCard
      signeddocumnet
      validity
      createdat
    }
  }`,
      {
        skip,
        take,
        searchquery,
        ...(Number(state) !== 99 && { state: Number(state) }),
        ...(userRole === 1 && { investorid: investorId }),
        ...(pageType === "utilisateurUnique" &&
          userRole !== 1 && { investorid: uniqueUserId }),
      }
    );
  } catch (error) {
    console.error("Error fetching orders:", error);
    if (error === "Token is revoked") {
      return <LogOutAgent />;
    }
  }

  const t = await getTranslations("mesOrdres");
  const tStatus = await getTranslations("status");
  const getStatusBgColor = (statut: number) => {
    switch (statut) {
      case 0:
        return "bg-gray-600";
      case 1:
        return "bg-yellow-600";
      case 2:
        return "bg-secondary";
      case 3:
        return "bg-green-600";
      case 4:
        return "bg-purple-600";
      case 5:
        return "bg-teal-600";
      case 6:
        return "bg-orange-600";
      case 7:
        return "bg-indigo-600";
      case 7:
        return "bg-orange-700";
      case 8:
        return "bg-orange-600";
      case 9:
        return "bg-red-700";
      case 10:
        return "bg-red-600";
      case 11:
        return "bg-gray-700";
      default:
        return "bg-gray-700";
    }
  };

  return (
    <Suspense key={skip} fallback={<OrdersTableSkeleton />}>
      <Table>
        <TableHeader>
          <TableRow>
            {pageType !== "dashboard" &&
              (userRole === 2 || userRole === 3 ? (
                <TableHead className="font-bold uppercase">ID</TableHead>
              ) : null)}
            <TableHead>{t("titre")}</TableHead>
            {pageType === "carnetordres" && (
              <TableHead>{t("investisseur")}</TableHead>
            )}
            <TableHead>{t("sens")}</TableHead>
            <TableHead> {t("type")}</TableHead>
            <TableHead>{t("quantity")}</TableHead>
            <TableHead>
              {pageType === "carnetordres" ? <OrderStateFilter /> : t("statut")}
            </TableHead>
            {pageType === "carnetordres" && <TableHead>{t("date")}</TableHead>}
            {pageType !== "dashboard" && <TableHead></TableHead>}
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders?.listOrdersExtended &&
            orders?.listOrdersExtended?.map((order: Order) => (
              <TableRow key={order.id}>
                {pageType !== "dashboard" &&
                  (userRole === 2 || userRole === 3 ? (
                    <TableCell className="font-bold overflow-x-scroll w-60">
                      {order?.id
                        ? order.id.split("-").slice(0, 2).join("-")
                        : "N/A"}
                    </TableCell>
                  ) : null)}
                <TableCell>
                  <div className="flex flex-col">
                    <div className="font-medium capitalize">
                      {order?.securityid?.issuer || "N/A"}
                    </div>
                    <div className="font-medium text-xs uppercase text-gray-400">
                      {order?.securityid?.code || "N/A"}
                    </div>
                  </div>
                </TableCell>
                {pageType === "carnetordres" && (
                  <TableCell> {order?.investorid?.fullname}</TableCell>
                )}
                <TableCell
                  className={`${
                    order.orderdirection === 1
                      ? "text-green-500"
                      : "text-red-600"
                  }`}
                >
                  {order.orderdirection === 1 ? t("achat") : t("vente")}
                </TableCell>
                <TableCell>
                  {order.securitytype === "stock"
                    ? t("action")
                    : order.securitytype === "bond"
                    ? t("obligation")
                    : order.securitytype === "sukuk" ||
                      order.securitytype === "sukuk"
                    ? t("sukuk")
                    : order.securitytype === "ipo"
                    ? t("opv")
                    : order.securitytype === "titresparticipatifs" ||
                      order.securitytype === "titresparticipatifs"
                    ? t("titre_participatif")
                    : order.securitytype === "empruntobligataire"
                    ? t("emprunt_obligataire")
                    : order.securitytype}
                </TableCell>
                <TableCell>{order.quantity}</TableCell>
                <TableCell>
                  <div
                    className={`w-fit py-0.5 px-2 rounded-full text-xs text-center text-white ${getStatusBgColor(
                      Number(order.orderstatus)
                    )}`}
                  >
                    {order?.orderstatus === 0 && order?.payedWithCard
                      ? "Brouillon payé"
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
                </TableCell>
                {pageType === "carnetordres" && (
                  <TableCell>
                    {order?.createdat
                      ? new Date(order.createdat).toLocaleString("fr-DZ", {
                          year: "numeric",
                          month: "2-digit",
                          day: "2-digit",
                          hour: "2-digit",
                          minute: "2-digit",
                          second: "2-digit",
                          hour12: false,
                        })
                      : "N/A"}
                  </TableCell>
                )}
                {pageType !== "dashboard" && (
                  <TableCell className="text-center">
                    <OrdreDrawer titreId={order.id} />
                  </TableCell>
                )}
              </TableRow>
            ))}
          {!orders?.listOrdersExtended && (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                {t("noOrders")}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Suspense>
  );
};

export default OrdresTable;
