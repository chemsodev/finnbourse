/**
 * GraphQL Client utility for handling authenticated requests
 * Provides consistent error handling and token management
 */

interface GraphQLResponse<T = any> {
  data?: T;
  errors?: Array<{
    message: string;
    extensions?: any;
  }>;
}

interface GraphQLRequestOptions {
  query: string;
  variables?: Record<string, any>;
  token?: string;
  useRefreshToken?: boolean;
}

export class GraphQLClient {
  private baseURL: string;

  constructor(baseURL?: string) {
    this.baseURL = baseURL || process.env.NEXT_PUBLIC_BACKEND_URL || "";
  }

  async request<T = any>(options: GraphQLRequestOptions): Promise<T> {
    const { query, variables, token, useRefreshToken = false } = options;

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${this.baseURL}/graphql`, {
        method: "POST",
        headers,
        body: JSON.stringify({
          query,
          variables,
        }),
      });

      const result: GraphQLResponse<T> = await response.json();

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      if (result.errors) {
        // Handle specific GraphQL errors
        const errorMessages = result.errors
          .map((error) => error.message)
          .join(", ");

        // Check for authentication errors
        const hasAuthError = result.errors.some(
          (error) =>
            error.message.toLowerCase().includes("unauthorized") ||
            error.message.toLowerCase().includes("invalid token") ||
            error.message.toLowerCase().includes("expired")
        );

        if (hasAuthError) {
          throw new AuthenticationError(errorMessages, result.errors);
        }

        throw new GraphQLError(errorMessages, result.errors);
      }

      return result.data as T;
    } catch (error) {
      if (
        error instanceof AuthenticationError ||
        error instanceof GraphQLError
      ) {
        throw error;
      }

      // Handle network errors
      if (error instanceof Error) {
        throw new NetworkError(error.message, error);
      }

      throw new Error("Unknown error occurred during GraphQL request");
    }
  }

  async refreshToken(
    refreshToken: string
  ): Promise<{ access_token: string; refresh_token: string }> {
    try {
      const result = await this.request<{
        refreshToken: { access_token: string; refresh_token: string };
      }>({
        query: `
          mutation RefreshToken {
            refreshToken {
              access_token
              refresh_token
            }
          }
        `,
        token: refreshToken,
        useRefreshToken: true,
      });

      return result.refreshToken;
    } catch (error) {
      if (error instanceof AuthenticationError) {
        throw new TokenRefreshError(
          "Token refresh failed: " + error.message,
          error.originalErrors
        );
      }
      throw error;
    }
  }
}

// Custom error classes for better error handling
export class GraphQLError extends Error {
  public originalErrors: Array<{ message: string; extensions?: any }>;

  constructor(
    message: string,
    originalErrors: Array<{ message: string; extensions?: any }>
  ) {
    super(message);
    this.name = "GraphQLError";
    this.originalErrors = originalErrors;
  }
}

export class AuthenticationError extends GraphQLError {
  constructor(
    message: string,
    originalErrors: Array<{ message: string; extensions?: any }>
  ) {
    super(message, originalErrors);
    this.name = "AuthenticationError";
  }
}

export class TokenRefreshError extends Error {
  public originalErrors?: Array<{ message: string; extensions?: any }>;

  constructor(
    message: string,
    originalErrors?: Array<{ message: string; extensions?: any }>
  ) {
    super(message);
    this.name = "TokenRefreshError";
    this.originalErrors = originalErrors;
  }
}

export class NetworkError extends Error {
  public originalError: Error;

  constructor(message: string, originalError: Error) {
    super(message);
    this.name = "NetworkError";
    this.originalError = originalError;
  }
}

// Default client instance
export const graphqlClient = new GraphQLClient();

export default GraphQLClient;
