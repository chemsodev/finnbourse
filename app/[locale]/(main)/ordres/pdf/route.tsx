// import { fetchGraphQL } from "@/app/actions/fetchGraphQL";
import AvisOrdre from "@/components/pdf/AvisOrdre";
// import { LIST_ORDERS_QUERY_PDF } from "@/graphql/queries";
import { Order } from "@/lib/interfaces";
import { renderToStream } from "@react-pdf/renderer";
import { NextResponse } from "next/server";

interface GetOrdersResponse {
  listOrdersExtended: Order[];
}

// Helper function to determine if an order is from primary or secondary market
const isPrimaryMarketOrder = (securitytype: string) => {
  return [
    "empruntobligataire",
    "opv",
    "sukukmp",
    "titresparticipatifsmp",
  ].includes(securitytype);
};

const isSecondaryMarketOrder = (securitytype: string) => {
  return ["action", "obligation", "sukukms", "titresparticipatifsms"].includes(
    securitytype
  );
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const marketType = searchParams.get("marketType") || "all";

  let orders: GetOrdersResponse | null = null;
  try {
    // TODO: Replace with REST API call
    // orders = await fetchGraphQL<GetOrdersResponse>(LIST_ORDERS_QUERY_PDF);

    // Mock empty orders data for PDF generation - replace with actual REST call
    orders = {
      listOrdersExtended: [],
    };
  } catch (error) {
    console.error("Error fetching orders:", error);
  }

  // Filter orders by market type if specified
  let filteredOrders = orders?.listOrdersExtended || [];

  if (marketType === "primaire") {
    filteredOrders = filteredOrders.filter((order) =>
      isPrimaryMarketOrder(order.securitytype)
    );
  } else if (marketType === "secondaire") {
    filteredOrders = filteredOrders.filter((order) =>
      isSecondaryMarketOrder(order.securitytype)
    );
  }

  const ordersWithFilteredData = {
    listOrdersExtended: filteredOrders,
  };

  const stream = await renderToStream(
    <AvisOrdre orders={ordersWithFilteredData} />
  );
  return new NextResponse(stream as unknown as ReadableStream);
}
