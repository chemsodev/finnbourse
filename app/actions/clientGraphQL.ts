// Client-side GraphQL fetching without async/await
import { clientFetchGraphQL } from "./fetchGraphQL";

// Export the clientFetchGraphQL function for direct use
export { clientFetchGraphQL };

// Helper function to provide a more convenient API that matches fetchGraphQL
export function fetchGraphQLClient<T>(
  query: string,
  variables: Record<string, any> = {},
  options?: { headers?: Record<string, string> },
  token?: string
): Promise<T> {
  return clientFetchGraphQL<T>(query, variables, options, token);
}
