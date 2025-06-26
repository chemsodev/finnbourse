"use client";

import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
// Removed GraphQL dependencies - now using static data
// import {
//   LIST_STOCKS_QUERY,
//   PORTFOLIO_PERFORMANCE_QUERY,
// } from "@/graphql/queries";
// Removed GraphQL dependencies - now using static data
// import { fetchGraphQLClient } from "@/app/actions/clientGraphQL";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import RateLimitReached from "../RateLimitReached";

// Add custom session type that includes our custom properties
declare module "next-auth" {
  interface Session {
    data?: {
      user?: {
        id?: string;
        // Add other properties as needed
      };
    };
  }
}

// Updated type definitions
type SecurityData = {
  security: string;
  faceValue: number;
  validatedPrice: number;
};

type ProcessedSecurity = SecurityData & {
  count: number;
};

// Add helper function to check if securityid contains an error
const hasSecurityIdError = (securityid: any): boolean => {
  return securityid && typeof securityid === "object" && "error" in securityid;
};

// Custom portfolio query that includes all needed fields
const CUSTOM_PORTFOLIO_QUERY = `
  query PortfolioPerformance ($userid: String) {
    listOrdersExtended(
      where: {
        investorid: {
          equals: $userid
        }
        orderstatus: {
          in: [3,4,5,8]
        }
      }
      include: {
        dynamic: {
          tableColumn: "securitytype"
          idColumn: "securityid"
        }
      }
    ){
      id
      orderdirection
      securityissuer
      securityid
      securitytype
      quantity
      validatedquantity
      validatedprice
      investorid
      createdat
    }
  }
`;

export function GraphPerfPortefeille(titre: { titre: string }) {
  const ititre = titre.titre;

  const [chartData, setChartData] = useState<SecurityData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const session = useSession();
  // @ts-ignore - Access custom properties added by our auth config
  const userid = session?.data?.user?.id;

  const chartConfig = {
    faceValue: {
      label: "Face Value",
      color: "hsl(var(--chart-1))",
    },
    validatedPrice: {
      label: "Validated Price",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig;

  // Updated processData function to handle error cases
  const processData = (orders: any[]): SecurityData[] => {
    if (!orders || !Array.isArray(orders)) {
      console.warn("No orders data available");
      return [];
    }

    const securityMap = new Map<string, ProcessedSecurity>();

    orders.forEach((order) => {
      if (!order) return;

      // Skip orders with error in securityid
      if (hasSecurityIdError(order.securityid)) {
        console.log(
          `Skipping order with error in securityid: ${
            order.securityissuer || "Unknown"
          }`
        );
        return;
      }

      // Handle missing securityid
      if (!order.securityid || typeof order.securityid !== "object") {
        console.log(
          `Skipping order with missing securityid: ${
            order.securityissuer || "Unknown"
          }`
        );
        return;
      }

      const securityId = order.securityid.id;

      // Skip if no securityId
      if (!securityId) {
        console.log(
          `Skipping order with missing securityid.id: ${
            order.securityissuer || "Unknown"
          }`
        );
        return;
      }

      // Default face value if not available
      const faceValue = order.securityid.facevalue || 0;

      // Calculate validated price:
      // 1. Use validatedprice if available
      // 2. If validatedquantity exists, use it with faceValue
      // 3. Fall back to quantity * faceValue if nothing else available
      let calculatedPrice = 0;

      if (
        typeof order.validatedprice === "number" &&
        !isNaN(order.validatedprice)
      ) {
        calculatedPrice = order.validatedprice;
      } else if (
        typeof order.validatedquantity === "number" &&
        !isNaN(order.validatedquantity)
      ) {
        calculatedPrice = order.validatedquantity * faceValue;
      } else if (typeof order.quantity === "number" && !isNaN(order.quantity)) {
        calculatedPrice = order.quantity * faceValue;
      }

      const current = securityMap.get(securityId) || {
        security: order.securityissuer || "Unknown",
        faceValue,
        validatedPrice: 0,
        count: 0,
      };

      securityMap.set(securityId, {
        ...current,
        validatedPrice: current.validatedPrice + calculatedPrice,
        count: current.count + 1,
      });
    });

    // Filter out entries with zero values
    return (
      Array.from(securityMap.values())
        .filter(
          (security) => security.faceValue > 0 || security.validatedPrice > 0
        )
        .map((security) => ({
          security: security.security,
          faceValue: security.faceValue,
          validatedPrice: security.validatedPrice / (security.count || 1), // Avoid division by zero
        })) || []
    );
  };

  const fetchPortfolioData = async () => {
    if (!userid) {
      console.warn("User ID not available, cannot fetch portfolio data");
      setLoading(false);
      setError("User ID not available");
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // TODO: Replace with REST API call
      // Use our custom query to ensure we get all needed fields
      // const result = await fetchGraphQLClient<any>(CUSTOM_PORTFOLIO_QUERY, {
      //   userid,
      // });

      // Use mock data for now
      const result = { listOrdersExtended: [] };

      console.log("Portfolio data:", result);

      if (!result || !result.listOrdersExtended) {
        console.warn("No portfolio data returned from the API");
        setChartData([]);
        setError("No portfolio data available");
        setLoading(false);
        return;
      }

      if (result.listOrdersExtended.length === 0) {
        console.warn("Portfolio data is empty");
        setChartData([]);
        setError("No portfolio data available");
        setLoading(false);
        return;
      }

      const processedData = processData(result.listOrdersExtended);

      if (processedData.length === 0) {
        setError("No valid portfolio data to display");
      } else {
        setError(null);
      }

      setChartData(processedData);
    } catch (error) {
      console.error("Error fetching portfolio data:", error);
      setError(
        typeof error === "string" ? error : "Failed to load portfolio data"
      );

      if (error === "Too many requests") {
        return <RateLimitReached />;
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPortfolioData();
  }, [userid]); // Add userid as a dependency

  // Return loading or error state if necessary
  if (loading) {
    return (
      <Card className="border-0 shadow-none w-[45%]">
        <CardHeader>
          <CardTitle>{ititre}</CardTitle>
        </CardHeader>
        <CardContent className="h-60 flex items-center justify-center">
          <p className="text-muted-foreground">Loading data...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-0 shadow-none w-[45%]">
        <CardHeader>
          <CardTitle>{ititre}</CardTitle>
        </CardHeader>
        <CardContent className="h-60 flex items-center justify-center">
          <p className="text-muted-foreground">{error}</p>
        </CardContent>
      </Card>
    );
  }

  // Show empty state if no data
  if (chartData.length === 0) {
    return (
      <Card className="border-0 shadow-none w-[45%]">
        <CardHeader>
          <CardTitle>{ititre}</CardTitle>
        </CardHeader>
        <CardContent className="h-60 flex items-center justify-center">
          <p className="text-muted-foreground">No data available</p>
        </CardContent>
      </Card>
    );
  }

  // Original return with chart data
  return (
    <Card className="border-0 shadow-none w-[45%]">
      <CardHeader>
        <CardTitle>{ititre}</CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="w-full">
          <BarChart accessibilityLayer data={chartData}>
            <CartesianGrid vertical={false} />

            <XAxis
              dataKey="security"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip content={<ChartTooltipContent hideLabel />} />
            <ChartLegend content={<ChartLegendContent />} />
            <Bar
              dataKey="faceValue"
              fill="var(--color-faceValue)"
              radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="validatedPrice"
              fill="var(--color-validatedPrice)"
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
