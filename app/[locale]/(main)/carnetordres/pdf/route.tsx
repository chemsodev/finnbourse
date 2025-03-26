import { fetchGraphQL } from "@/app/actions/fetchGraphQL";
import AvisOrdre from "@/components/pdf/AvisOrdre";
import { LIST_ORDERS_QUERY_PDF } from "@/graphql/queries";
import { Order } from "@/lib/interfaces";
import { renderToStream } from "@react-pdf/renderer";
import { NextResponse } from "next/server";
interface GetOrdersResponse {
  listOrdersExtended: Order[];
}
export async function GET(request: Request) {
  let orders: GetOrdersResponse | null = null;
  try {
    orders = await fetchGraphQL<GetOrdersResponse>(LIST_ORDERS_QUERY_PDF);
    console.log("👺👺👺", orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
  }
  const stream = await renderToStream(<AvisOrdre orders={orders} />);
  return new NextResponse(stream as unknown as ReadableStream);
}
