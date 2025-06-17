# Token Refresh Fix Implementation

## Problem Summary

The application was experiencing token refresh failures with a 429 (Too Many Requests) error, indicating rate limiting issues. The original implementation only used REST API endpoints for token refresh and lacked proper error handling and retry mechanisms.

## Changes Made

### 1. Enhanced GraphQL Token Refresh Support (`auth.ts`)

**Primary Changes:**

- **GraphQL-First Approach**: Modified the `refreshAccessToken` function to attempt GraphQL token refresh first, falling back to REST API only if GraphQL fails
- **Improved Error Handling**: Added specific handling for rate limiting (429 errors) and other authentication errors
- **Retry Logic with Exponential Backoff**: Implemented retry mechanism in the JWT callback with exponential backoff for rate-limited requests
- **Better Logging**: Enhanced logging to help debug token refresh issues

**Key Features:**

- Attempts GraphQL refresh first using the new GraphQL client
- Falls back to REST API if GraphQL fails
- Implements exponential backoff for rate-limited requests (1s, 2s, 4s delays)
- Limits retry attempts to prevent infinite loops
- Provides detailed error types for better debugging

### 2. New GraphQL Client Library (`lib/graphql-client.ts`)

**Features:**

- **Centralized GraphQL Request Handling**: Consistent way to make GraphQL requests across the application
- **Custom Error Classes**: Specific error types for authentication, token refresh, and network issues
- **Token Refresh Method**: Dedicated method for token refresh operations
- **Proper Error Propagation**: Detailed error information for debugging

**Error Types:**

- `AuthenticationError`: For authentication-related failures
- `TokenRefreshError`: Specifically for token refresh failures
- `GraphQLError`: General GraphQL query/mutation errors
- `NetworkError`: Network connectivity issues

### 3. GraphQL Mutation Definition (`graphql/mutations.ts`)

**Added:**

- `REFRESH_TOKEN_MUTATION`: Properly defined GraphQL mutation for token refresh operations
- Exports the mutation for reuse across the application

### 4. Enhanced Type Definitions

**Updated NextAuth Types:**

- Added `refreshAttempts` property to track retry attempts
- Better type safety for authentication flows

## How It Works

### Token Refresh Flow

1. **Detection**: System detects token expiration or near-expiration (5 minutes before)
2. **GraphQL Attempt**: Tries to refresh using GraphQL endpoint with the refresh token
3. **Fallback**: If GraphQL fails, falls back to REST API endpoint
4. **Rate Limit Handling**: If rate limited (429), implements exponential backoff
5. **Retry Logic**: Up to 3 attempts with increasing delays
6. **Error Handling**: Proper error categorization and user session management

### Rate Limiting Mitigation

- **Exponential Backoff**: 1s → 2s → 4s delays between retries
- **Attempt Limiting**: Maximum 3 refresh attempts before giving up
- **Graceful Degradation**: User remains logged in during temporary rate limiting
- **Error Differentiation**: Distinguishes between rate limiting and actual auth failures

## Benefits

1. **Reduced Rate Limiting**: GraphQL-first approach reduces load on REST endpoints
2. **Better User Experience**: Users stay logged in during temporary API issues
3. **Improved Reliability**: Multiple fallback mechanisms ensure token refresh succeeds when possible
4. **Better Debugging**: Enhanced logging and error types make troubleshooting easier
5. **Future-Proof**: Modular design allows easy addition of new authentication methods

## Configuration

Make sure your environment variables are properly set:

```env
NEXT_PUBLIC_BACKEND_URL=your_graphql_backend_url
NEXT_PUBLIC_REST_API_URL=your_rest_api_url
```

## Monitoring

The implementation includes comprehensive logging for monitoring:

- Token refresh attempts and outcomes
- Error types and retry counts
- Fallback usage patterns
- Rate limiting occurrences

## Usage in Components

Components can continue using NextAuth sessions normally. The enhanced token refresh happens automatically in the background:

```typescript
import { useSession } from "next-auth/react";

function MyComponent() {
  const { data: session, status } = useSession();

  // Session will automatically refresh tokens when needed
  if (status === "loading") return <p>Loading...</p>;
  if (status === "unauthenticated") return <p>Access Denied</p>;

  return <div>Welcome {session?.user?.email}</div>;
}
```

The GraphQL client can also be used directly for authenticated requests:

```typescript
import { graphqlClient } from "@/lib/graphql-client";

const result = await graphqlClient.request({
  query: SOME_QUERY,
  variables: { id: "123" },
  token: session?.user?.token,
});
```
