/**
 * Token Management Utility
 * Handles token refresh with rate limiting and caching
 */

class TokenManager {
  private static instance: TokenManager;
  private refreshPromise: Promise<any> | null = null;
  private lastRefreshTime = 0;
  private refreshCooldown = 5000; // 5 seconds cooldown between refresh attempts
  private maxRetries = 3;
  private retryCount = 0;
  private isShuttingDown = false; // Add shutdown flag

  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  private constructor() {
    // Private constructor for singleton
  }

  // Shutdown method to stop all token activities
  shutdown(): void {
    console.log("TokenManager: Shutting down token refresh activities");
    this.isShuttingDown = true;
    this.refreshPromise = null;
    this.retryCount = 0;
  }

  async refreshAccessToken(token: any): Promise<any> {
    // Don't refresh if shutting down (user logged out)
    if (this.isShuttingDown) {
      console.log("TokenManager: Skipping refresh - shutdown in progress");
      return {
        ...token,
        error: "ShuttingDown",
      };
    }

    const now = Date.now();

    // Check if we're in cooldown period
    if (now - this.lastRefreshTime < this.refreshCooldown) {
      console.log("TokenManager: In cooldown period, skipping refresh");
      return token;
    }

    // Check if refresh is already in progress
    if (this.refreshPromise) {
      console.log("TokenManager: Refresh already in progress, waiting...");
      try {
        return await this.refreshPromise;
      } catch (error) {
        console.error(
          "TokenManager: Waiting for existing refresh failed:",
          error
        );
        return token;
      }
    }

    // Start new refresh
    this.refreshPromise = this.performRefresh(token);
    this.lastRefreshTime = now;

    try {
      const result = await this.refreshPromise;
      this.retryCount = 0; // Reset retry count on success
      return result;
    } catch (error) {
      console.error("TokenManager: Refresh failed:", error);
      this.retryCount++;

      // If we've exceeded max retries, stop trying
      if (this.retryCount >= this.maxRetries) {
        console.error("TokenManager: Max retries exceeded, giving up");
        return {
          ...token,
          error: "RefreshAccessTokenError",
        };
      }

      return token;
    } finally {
      this.refreshPromise = null;
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Get current state for debugging
  getState(): object {
    return {
      hasRefreshPromise: !!this.refreshPromise,
      lastRefreshTime: this.lastRefreshTime,
      retryCount: this.retryCount,
      isShuttingDown: this.isShuttingDown,
    };
  }

  // Reset the manager (for testing or emergency reset)
  reset(): void {
    console.log("TokenManager: Resetting token manager state");
    this.refreshPromise = null;
    this.lastRefreshTime = 0;
    this.retryCount = 0;
    this.isShuttingDown = false;
  }

  private async performRefresh(token: any): Promise<any> {
    // Double-check shutdown state
    if (this.isShuttingDown) {
      throw new Error("Token manager is shutting down");
    }

    console.log("Attempting to refresh access token");

    try {
      // Try REST endpoint only (since GraphQL is having issues)
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh-token`,
        {
          method: "GET",
          headers: {
            refresh_token: token.refreshToken,
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Token refresh failed with status:", response.status);
        console.error("Token refresh error:", errorData);

        // Handle rate limiting with exponential backoff
        if (response.status === 429) {
          const waitTime = Math.min(1000 * Math.pow(2, this.retryCount), 30000); // Max 30 seconds
          // Silently handle rate limiting
          await this.delay(waitTime);
          throw new Error("Rate limit exceeded");
        }

        // Handle unauthorized - likely refresh token expired
        if (response.status === 401) {
          console.error("Refresh token expired, forcing re-login");
          throw new Error("Refresh token expired");
        }

        throw new Error(`Token refresh failed: ${response.status}`);
      }

      const newTokens = await response.json();
      console.log("Token refreshed successfully via REST API");

      // Decode the new token to get expiry
      const jwt = require("jsonwebtoken");
      const newDecodedToken = jwt.decode(newTokens.access_token);

      return {
        ...token,
        accessToken: newTokens.access_token,
        refreshToken: newTokens.refresh_token || token.refreshToken,
        tokenExpires: newDecodedToken?.exp,
        error: null,
        refreshAttempts: 0,
      };
    } catch (error: any) {
      console.error("Token refresh error:", error);

      // If it's a rate limit error, we'll retry with backoff
      if (error instanceof Error && error.message.includes("Rate limit")) {
        throw error;
      }

      // For other errors, mark token as expired
      return {
        ...token,
        error: "RefreshAccessTokenError",
        refreshAttempts: (token.refreshAttempts || 0) + 1,
      };
    }
  }

  // Force clear stuck refresh promise
  clearStuckRefresh(): void {
    console.log("TokenManager: Clearing stuck refresh promise");
    this.refreshPromise = null;
  }
}

export const tokenManager = TokenManager.getInstance();

// Make token manager available globally for logout cleanup
if (typeof window !== "undefined") {
  (window as any).tokenManager = tokenManager;
}
