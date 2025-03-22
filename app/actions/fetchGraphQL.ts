"use server";

import auth from "@/auth";
import { redirect } from "@/i18n/routing";
import { getServerSession } from "next-auth";
import { headers } from "next/headers";

interface FetchGraphQLResponse<T> {
  data: T;
  errors?: { message: string }[];
}

export async function fetchGraphQL<T>(
  query: string,
  variables: Record<string, any> = {},
  options?: { headers?: Record<string, string> },
  token?: string
): Promise<T> {
  const session = await getServerSession(auth);
  const headersList = headers();

  const ip =
    headersList.get("x-forwarded-for") || // For reverse proxies like Vercel
    headersList.get("x-real-ip") || // Nginx/other proxies
    "IP not available";
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/graphql`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-forwarded-for": ip,
        Authorization: `Bearer ${session?.user.token}`,
        ...options?.headers,
      },
      body: JSON.stringify({ query, variables }),
    }
  );
  //console.log("🚨🚨🚨🚨", JSON.stringify({ query, variables }));
  const result: FetchGraphQLResponse<T> = await response.json();
  if (response.status === 429) {
    redirect("/RateLimiter");
  }
  if (result.errors) {
    if (result.errors[0].message === "Token is revoked") {
      redirect("/TokenRevoked");
    }

    throw new Error("Failed to fetch data: " + result.errors[0].message);
  }

  return result.data;
}
