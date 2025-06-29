/**
 * Error handling utilities for API responses
 */

export interface ApiError {
  message?: string;
  error?: string;
  statusCode?: number;
}

export interface AxiosStyleError {
  response?: {
    data?: ApiError;
    status?: number;
  };
  message?: string;
}

/**
 * Extract a human-readable error message from various error formats
 */
export function extractErrorMessage(
  error: unknown,
  defaultMessage: string = "An error occurred"
): string {
  if (!error) return defaultMessage;

  // Handle string errors
  if (typeof error === "string") {
    return error;
  }

  // Handle object errors
  if (typeof error === "object" && error !== null) {
    const errorObj = error as any;

    // Direct message property
    if (errorObj.message && typeof errorObj.message === "string") {
      return errorObj.message;
    }

    // Axios-style error response
    if (errorObj.response?.data?.message) {
      return errorObj.response.data.message;
    }

    // Other API error formats
    if (errorObj.response?.data?.error) {
      return errorObj.response.data.error;
    }

    // Fallback to any message-like property
    if (errorObj.error && typeof errorObj.error === "string") {
      return errorObj.error;
    }
  }

  return defaultMessage;
}

/**
 * Check if an error is specifically about email already being in use
 */
export function isEmailAlreadyInUseError(error: unknown): boolean {
  const message = extractErrorMessage(error, "").toLowerCase();
  return (
    message.includes("email already in use") ||
    message.includes("email already exists") ||
    message.includes("email déjà utilisé")
  );
}

/**
 * Get the appropriate translation key for common API errors
 */
export function getErrorTranslationKey(error: unknown): string {
  if (isEmailAlreadyInUseError(error)) {
    return "emailAlreadyInUse";
  }

  const message = extractErrorMessage(error, "").toLowerCase();

  if (message.includes("validation")) {
    return "validationError";
  }

  if (message.includes("not found")) {
    return "notFound";
  }

  if (message.includes("unauthorized") || message.includes("forbidden")) {
    return "accessDenied";
  }

  return "genericError";
}
