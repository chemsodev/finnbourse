import MyMarquee from "@/components/MyMarquee";
import { getTranslations } from "next-intl/server";
import MyPagination from "@/components/MyPagination";
import TabSearch from "@/components/TabSearch";
import Link from "next/link";
import { Printer } from "lucide-react";
import OrdresTable from "@/components/OrdresTable";
import { getServerSession } from "next-auth";
import auth from "@/auth";
import { ExportButton } from "@/components/ExportButton";
import { fetchGraphQL } from "@/app/actions/fetchGraphQL";
import { LIST_ORDERS_QUERY_EXCEL } from "@/graphql/queries";
import { Order } from "@/lib/interfaces";

interface GetOrdersResponse {
  listOrdersExtended: Order[];
}

const page = async (props: {
  searchParams?: Promise<{
    searchquery?: string;
    page?: string;
    state?: string;
  }>;
}) => {
  const session = await getServerSession(auth);
  const userRole = session?.user?.roleid;
  const searchParams = await props.searchParams;
  const currentPage = Number(searchParams?.page) || 0;
  const searchquery = searchParams?.searchquery || "";
  const state = searchParams?.state || "99";

  const t = await getTranslations("mesOrdres");
  const tStatus = await getTranslations("status");
  let orders: GetOrdersResponse | null = null;
  try {
    orders = await fetchGraphQL<GetOrdersResponse>(LIST_ORDERS_QUERY_EXCEL);
  } catch (error) {
    console.error("Error fetching orders:", error);
  }

  const data = orders?.listOrdersExtended || [];
  const filteredData = data.map((order) => ({
    id: order.id,
    ordertypes: order.ordertypes.toString(),
    direction: order.orderdirection == 1 ? "Achat" : "Vente",
    securityid: order.securityid?.id,
    securitytype: order.securitytype,
    securityquantity: order.securityid?.quantity,
    currentMarketPrice: order.securityid?.facevalue,
    quantity: order.quantity,
    pricelimitmin: order.pricelimitmin,
    pricelimitmax: order.pricelimitmax,
    duration: order.duration,
    orderdate: order.orderdate,
    orderstatus:
      order?.orderstatus === 0 && order?.payedWithCard
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
        : "Unknown",
    investor: order.investorid?.fullname,
    negotiator: order.negotiatorid?.fullname,
    securityissuer: order.securityissuer,
    validity: order.validity,
    createdat: order.createdat,
  }));

  return (
    <div className=" motion-preset-focus motion-duration-2000 ">
      <div className="mt-3">
        <MyMarquee />
      </div>
      <div className="flex flex-col gap-1 mt-16 mb-8 ml-8 ">
        <div className="text-3xl font-bold text-primary text-center md:ltr:text-left md:rtl:text-right">
          {userRole === 1 ? t("mesOrdres") : t("carnetOrdres")}
        </div>
        <div className="text-xs text-gray-500 md:w-[50%] text-center md:ltr:text-left md:rtl:text-right">
          {userRole === 1 ? t("expl") : t("expl2")}
        </div>
      </div>
      <div className="border border-gray-100 rounded-md p-4 mt-10">
        <div className="flex justify-between w-full">
          <TabSearch />
          <div className="flex gap-4">
            {(userRole === 2 || userRole === 3) && (
              <Link
                href="/carnetordres/pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="py-2 px-4 bg-primary hover:bg-primary/90 text-white rounded-md shadow text-sm flex gap-2 items-center"
              >
                <Printer size={20} />
                {t("print")}
              </Link>
            )}
            {(userRole === 2 || userRole === 3) && (
              <ExportButton data={filteredData} />
            )}
          </div>
        </div>
        <div className=" my-8">
          <OrdresTable
            searchquery={searchquery}
            skip={currentPage}
            state={state}
            pageType="carnetordres"
          />
        </div>
        <div className="flex justify-end">
          <MyPagination />
        </div>
      </div>
    </div>
  );
};

export default page;
