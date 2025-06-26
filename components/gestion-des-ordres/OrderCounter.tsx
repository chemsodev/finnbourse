"use client";

// Removed GraphQL dependencies - now using static data
// import { clientFetchGraphQL } from "@/app/actions/fetchGraphQL";
// import { COUNT_ORDERS_STATE_ONE_QUERY } from "@/graphql/queries";
import { useSession } from "next-auth/react";
import { useState } from "react";

// Static mock data for order counts
const mockOrderCounts = {
  pending: 5,
  executed: 12,
  cancelled: 3,
  total: 20,
};

// Define proper session user type
interface CustomUser {
  id?: string;
  token?: string;
  roleid?: number;
  refreshToken?: string;
}

const OrderCounter = () => {
  const session = useSession();
  // Use type assertion to access custom fields
  const user = session?.data?.user as CustomUser;
  const userRole = user?.roleid || "";

  // Use static mock data instead of GraphQL
  const [orderCounter] = useState<number>(mockOrderCounts.pending);

  // Static component - no WebSocket or GraphQL calls needed
  // In the future, this could be replaced with REST API calls

  return <>{orderCounter || 0}</>;
};

export default OrderCounter;
