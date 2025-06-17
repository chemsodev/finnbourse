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

  static getInstance(): TokenManager {
    if (!TokenManager.instance) {
      TokenManager.instance = new TokenManager();
    }
    return TokenManager.instance;
  }

  private async delay(ms: number): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  private shouldRefresh(token: any): boolean {
    const now = Date.now();

    // Don't refresh if we just did recently
    if (now - this.lastRefreshTime < this.refreshCooldown) {
      console.log(
        `Skipping refresh - too soon since last attempt (${Math.round(
          (now - this.lastRefreshTime) / 1000
        )}s ago)`
      );
      return false;
    }

    // Check if token has expiry information
    if (!token.tokenExpires) {
      console.log("No token expiry information, skipping refresh");
      return false;
    }

    // Check if token is actually expired or expiring soon (within 5 minutes)
    const expiryTime = token.tokenExpires * 1000;
    const now_plus_5min = now + 5 * 60 * 1000;
    const timeUntilExpiry = expiryTime - now;

    const shouldRefresh = expiryTime < now_plus_5min;

    console.log(
      `Token expiry check: expires in ${Math.round(
        timeUntilExpiry / 1000
      )}s, should refresh: ${shouldRefresh}`
    );

    return shouldRefresh;
  }
  async refreshToken(token: any): Promise<any> {
    // If refresh is already in progress, wait for it with timeout
    if (this.refreshPromise) {
      console.log("Token refresh already in progress, waiting...");
      try {
        // Wait for existing promise with 10 second timeout
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error("Refresh timeout")), 10000)
        );

        return await Promise.race([this.refreshPromise, timeoutPromise]);
      } catch (error) {
        console.error(
          "Existing refresh failed or timed out, clearing and retrying"
        );
        this.refreshPromise = null; // Clear stuck promise
      }
    }

    // Check if we should actually refresh
    if (!this.shouldRefresh(token)) {
      console.log("Token refresh not needed yet");
      return token;
    }

    // Check retry limit
    if (this.retryCount >= this.maxRetries) {
      console.error("Max token refresh retries exceeded");
      this.retryCount = 0; // Reset for next time
      this.refreshPromise = null; // Clear any stuck promise
      throw new Error("Max refresh retries exceeded");
    }

    // Create refresh promise with timeout
    this.refreshPromise = this.performRefreshWithTimeout(token);

    try {
      const result = await this.refreshPromise;
      this.lastRefreshTime = Date.now();
      this.retryCount = 0; // Reset on success
      return result;
    } catch (error) {
      this.retryCount++;
      console.error("Token refresh failed:", error);
      throw error;
    } finally {
      this.refreshPromise = null; // Always clear promise
    }
  }

  private async performRefreshWithTimeout(token: any): Promise<any> {
    const refreshPromise = this.performRefresh(token);
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(
        () => reject(new Error("Token refresh timeout after 15 seconds")),
        15000
      )
    );

    return Promise.race([refreshPromise, timeoutPromise]);
  }

  private async performRefresh(token: any): Promise<any> {
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
          console.log(`Rate limit hit, waiting ${waitTime}ms before retry`);
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
    } catch (error) {
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
  // Reset the manager state (useful for testing or force refresh)
  reset(): void {
    console.log("TokenManager: Force reset called");
    this.refreshPromise = null;
    this.lastRefreshTime = 0;
    this.retryCount = 0;
  }

  // Force clear stuck refresh promise
  clearStuckRefresh(): void {
    console.log("TokenManager: Clearing stuck refresh promise");
    this.refreshPromise = null;
  }

  // Get current state for debugging
  getState(): any {
    return {
      hasActiveRefresh: !!this.refreshPromise,
      lastRefreshTime: this.lastRefreshTime,
      retryCount: this.retryCount,
      timeSinceLastRefresh: Date.now() - this.lastRefreshTime,
    };
  }
}

export const tokenManager = TokenManager.getInstance();
