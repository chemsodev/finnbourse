import { fetchGraphQL } from "@/app/actions/fetchGraphQL";
import OrdreDeBourse from "@/components/pdf/OrdreDeBourse";
import {
  GET_REST_USER_DATA,
  LIST_ORDERS_QUERY_ONE_ORDER,
} from "@/graphql/queries";
import { Order } from "@/lib/interfaces";
import { renderToStream } from "@react-pdf/renderer";
import { NextResponse } from "next/server";

interface OrderGraphQLResponse {
  listOrdersExtended: Order[] | null;
}

interface UserDataResponse {
  listData: { name: string; data: any }[];
}

const transformUserData = (listData: UserDataResponse["listData"]) => {
  return listData.reduce((acc: Record<string, any>, item) => {
    acc[item.name] = item.data;
    return acc;
  }, {});
};

export async function GET(
  request: Request,
  { params }: { params: { ordreId: string } }
) {
  const { ordreId } = params;

  let order: Order | null = null;
  let userData: Record<string, any> | null = null;

  try {
    // Fetch order details
    const { listOrdersExtended } = await fetchGraphQL<OrderGraphQLResponse>(
      LIST_ORDERS_QUERY_ONE_ORDER,
      { orderId: ordreId }
    );
    order = listOrdersExtended?.[0] ?? null;

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Fetch user data
    const { listData } = await fetchGraphQL<UserDataResponse>(
      GET_REST_USER_DATA,
      {
        userId: order.investorid.id,
        type: "userdata",
      }
    );
    userData = transformUserData(listData);
  } catch (error) {
    console.error("Error fetching data:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }

  try {
    const stream = await renderToStream(
      <OrdreDeBourse order={order} userData={userData} />
    );
    return new NextResponse(stream as unknown as ReadableStream);
  } catch (renderError) {
    console.error("Error rendering PDF:", renderError);
    return NextResponse.json(
      { error: "Error generating PDF" },
      { status: 500 }
    );
  }
}
