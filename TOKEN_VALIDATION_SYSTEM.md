# Token Validation & Security System

This document outlines the comprehensive token validation and security system implemented in the FinnBourse application.

## Overview

The system provides multi-layered token validation with automatic cleanup of invalid tokens, cookies, and cache data. When an invalid token is detected, users are automatically redirected to the login page with all authentication data cleared.

## Components

### 1. Token Validation Hook (`useTokenValidation`)

**Location**: `hooks/useTokenValidation.ts`

**Features**:

- Automatic token validation on session changes
- Periodic validation (configurable interval)
- Backend validation support
- Comprehensive cleanup on invalid tokens
- Multi-tab synchronization
- Network reconnection handling

**Usage**:

```tsx
import { useTokenValidation } from "@/hooks/useTokenValidation";

// Basic usage with default settings
useTokenValidation();

// Custom configuration
useTokenValidation({
  redirectOnInvalid: true,
  checkInterval: 60000, // 1 minute
  enableBackendValidation: true,
  maxRetries: 3,
  onTokenInvalid: () => {
    // Custom handler
  },
});
```

### 2. Manual Token Validation Hook (`useManualTokenValidation`)

**Location**: `hooks/useManualTokenValidation.ts`

**Purpose**: For validating tokens before critical operations (API calls, transactions)

**Usage**:

```tsx
import { useManualTokenValidation } from "@/hooks/useManualTokenValidation";

const { validateToken, isTokenValid, hasValidSession } =
  useManualTokenValidation();

// Before making important API calls
const handleCriticalOperation = async () => {
  const isValid = await validateToken();
  if (!isValid) {
    // Token invalid, user will be redirected to login
    return;
  }

  // Proceed with operation
  await criticalApiCall();
};
```

### 3. Token Cleanup Utilities (`lib/utils/tokenCleanup.ts`)

**Features**:

- Clear authentication storage (localStorage, sessionStorage)
- Clear authentication cookies (including secure cookies)
- Clear browser cache (service worker caches)
- Reset token manager state
- Comprehensive cleanup function

**Functions**:

- `clearAuthStorage()` - Clears auth-related storage
- `clearAuthCookies()` - Clears auth-related cookies
- `clearBrowserCache()` - Clears browser cache
- `resetTokenManager()` - Resets token manager state
- `handleInvalidTokenCleanup()` - Comprehensive cleanup (main function)
- `forcePageReload()` - Force page reload as last resort

### 4. Backend Token Validation API (`api/validate-token/route.ts`)

**Endpoint**: `POST /api/validate-token`

**Purpose**: Validates tokens against the backend server

**Request Body**:

```json
{
  "token": "your-jwt-token-here"
}
```

**Response**:

```json
{
  "valid": true|false,
  "error": "error message if invalid",
  "data": "backend response data"
}
```

### 5. Middleware Token Validation (`middleware.ts`)

**Features**:

- Server-side token validation
- Token expiry checking
- Automatic redirect to login for invalid/expired tokens
- Locale-aware redirects

**Enhanced with**:

- JWT token expiry checking
- Expired token parameter for client-side cleanup

### 6. Expired Token Handler (`components/ExpiredTokenHandler.tsx`)

**Purpose**: Handles cleanup when redirected from middleware with expired token

**Usage**: Automatically included in login page

## Security Features

### 1. Multi-Layer Validation

- Client-side session validation
- JWT token expiry checking
- Backend validation
- Server-side middleware validation

### 2. Comprehensive Cleanup

- Removes all authentication data
- Clears cookies (including secure cookies)
- Clears browser cache
- Resets internal state

### 3. Cross-Tab Synchronization

- Detects token removal in other tabs
- Synchronized logout across tabs

### 4. Network Resilience

- Re-validates tokens when network reconnects
- Handles network errors gracefully

### 5. Rate Limiting & Retries

- Configurable retry attempts
- Cooldown periods between validations

## Implementation Guide

### 1. Basic Setup

Add token validation to your main layout:

```tsx
import TokenValidator from "@/components/TokenValidator";

export default function Layout({ children }) {
  return <TokenValidator>{children}</TokenValidator>;
}
```

### 2. Critical Operations

Use manual validation before important operations:

```tsx
import { useManualTokenValidation } from "@/hooks/useManualTokenValidation";

const MyComponent = () => {
  const { validateToken } = useManualTokenValidation();

  const handleImportantAction = async () => {
    if (!(await validateToken())) {
      // User redirected to login
      return;
    }

    // Proceed with action
  };
};
```

### 3. Custom Token Validation

For specific components that need custom validation:

```tsx
import { useTokenValidation } from "@/hooks/useTokenValidation";

const MyProtectedComponent = () => {
  useTokenValidation({
    checkInterval: 30000, // Check every 30 seconds
    onTokenInvalid: () => {
      // Custom cleanup logic
      console.log("Token invalid, performing custom cleanup");
    },
  });

  return <div>Protected content</div>;
};
```

## Configuration

### Environment Variables

- `NEXT_PUBLIC_BACKEND_URL` - Backend URL for token validation
- `NEXTAUTH_SECRET` - NextAuth secret for JWT handling

### Default Settings

- Validation interval: 60 seconds
- Backend validation: Enabled
- Max retries: 3
- Automatic redirect: Enabled

## Error Handling

The system handles various error scenarios:

1. **Network Errors**: Graceful degradation with retries
2. **Backend Unavailable**: Fallback to client-side validation
3. **Malformed Tokens**: Immediate cleanup and redirect
4. **Expired Tokens**: Cleanup and redirect with expired parameter
5. **Cross-Tab Issues**: Synchronized cleanup across tabs

## Best Practices

1. **Use Manual Validation**: For critical operations (payments, data modification)
2. **Configure Intervals**: Adjust validation frequency based on security needs
3. **Handle Errors**: Provide user feedback for validation failures
4. **Test Scenarios**: Test network failures, token expiry, cross-tab scenarios
5. **Monitor Performance**: Watch for excessive validation calls

## Troubleshooting

### Common Issues

1. **Excessive API Calls**: Check validation intervals and disable if needed
2. **Login Loops**: Ensure backend validation endpoint is working
3. **Cross-Tab Issues**: Verify storage event listeners are working
4. **Cache Issues**: Use force reload as last resort

### Debug Tools

The system includes debug utilities:

```javascript
// In browser console
window.tokenDebug.checkState();
window.tokenDebug.reset();
window.authReset.forceLogin(); // Emergency reset
```

## Migration Notes

If upgrading from the previous system:

1. Replace old token validation calls with new hooks
2. Update logout components to use new cleanup utilities
3. Test token expiry scenarios
4. Verify middleware redirects work correctly
5. Check that all authentication data is properly cleared

## Security Considerations

1. **Token Storage**: Tokens are stored in httpOnly cookies when possible
2. **Cleanup**: All authentication data is removed on logout/expiry
3. **Validation**: Multiple layers of validation provide defense in depth
4. **Network Security**: Backend validation prevents client-side tampering
5. **Cross-Site Protection**: Secure cookie settings prevent CSRF attacks
