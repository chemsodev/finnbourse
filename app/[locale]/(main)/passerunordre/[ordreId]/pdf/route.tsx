// import { fetchGraphQL } from "@/app/actions/fetchGraphQL";
import OrdreDeBourse from "@/components/pdf/OrdreDeBourse";
// import {
//   GET_REST_USER_DATA,
//   LIST_ORDERS_QUERY_ONE_ORDER,
// } from "@/graphql/queries";
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
    // Mock order data - TODO: Replace with REST API call
    const mockOrder: Order = {
      id: ordreId,
      securityissuer: "Sample Corp",
      securitytype: "action",
      securityid: "sec123",
      securityquantity: 1000000,
      quantity: 100,
      orderdate: new Date().toISOString(),
      orderstatus: 2, // executed status
      investorid: "user123",
      negotiatorid: "neg123",
      validity: "GTD",
      duration: 30,
      createdat: new Date().toISOString(),
      payedWithCard: false,
      visaCosob: "VISA123456",
      isinCode: "TN0001234567",
      emissionDate: "2023-01-01",
      mst: "MST123",
      orderdirection: 1, // buy order
      priceInstruction: "LIMIT",
      timeInstruction: "DAY",
      validityDate: new Date(
        Date.now() + 30 * 24 * 60 * 60 * 1000
      ).toISOString(),
      grossAmount: "2550.00",
    };

    order = mockOrder;

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Mock user data - TODO: Replace with REST API call
    const mockUserData = {
      personal: {
        firstName: "John",
        lastName: "Doe",
        email: "john.doe@example.com",
        phone: "+216 12345678",
      },
      address: {
        street: "123 Main Street",
        city: "Tunis",
        country: "Tunisia",
        postalCode: "1000",
      },
      account: {
        accountNumber: "ACC123456789",
        rib: "12345678901234567890123",
      },
    };

    userData = mockUserData;
    console.log("👺👺👺👺", order, userData);
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
