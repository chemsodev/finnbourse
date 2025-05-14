import auth from "@/auth";
import { redirect } from "@/i18n/routing";
import { getServerSession } from "next-auth";

interface FetchGraphQLResponse<T> {
  data: T;
  errors?: { message: string }[];
}

// Server-side GraphQL fetcher (for server components)
export async function fetchGraphQL<T>(
  query: string,
  variables: Record<string, any> = {},
  options?: { headers?: Record<string, string> },
  token?: string
): Promise<T> {
  const session = await getServerSession(auth);

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BACKEND_URL}/graphql`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
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

// Client-side GraphQL fetcher (for client components)
export function clientFetchGraphQL<T>(
  query: string,
  variables: Record<string, any> = {},
  options?: { headers?: Record<string, string> },
  token?: string
): Promise<T> {
  // This doesn't use async/await syntax directly, making it safe for client components
  return fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/graphql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    body: JSON.stringify({ query, variables }),
  })
    .then((response) => {
      if (response.status === 429) {
        window.location.href = "/RateLimiter";
        throw new Error("Rate limit reached");
      }
      return response.json();
    })
    .then((result: FetchGraphQLResponse<T>) => {
      if (result.errors) {
        if (result.errors[0].message === "Token is revoked") {
          window.location.href = "/TokenRevoked";
          throw new Error("Token is revoked");
        }
        throw new Error("Failed to fetch data: " + result.errors[0].message);
      }
      return result.data;
    });
}
