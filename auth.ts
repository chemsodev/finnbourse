// @ts-ignore
import CredentialsProvider from "next-auth/providers/credentials";
import jwt from "jsonwebtoken";

declare module "next-auth" {
  interface User {
    id?: string;
    email?: string;
    roleid?: number;
    negotiatorId?: string;
    followsbusiness?: boolean;
    token?: string;
    refreshToken?: string;
    tokenExpires?: number;
    error?: string;
  }
}

interface DecodedToken {
  sub: string;
  email: string;
  roleid: number;
  username: string;
  negotiatorId: string;
  followsbusiness: boolean;
  exp: number;
}

// Track refresh attempts to implement rate limiting
const refreshAttempts = {
  lastAttempt: 0,
  count: 0,
  backoffUntil: 0,
};

async function refreshAccessToken(token: any) {
  try {
    const now = Date.now();

    // Check if we're in a backoff period
    if (now < refreshAttempts.backoffUntil) {
      console.log(
        `Token refresh in backoff period. Waiting until ${new Date(
          refreshAttempts.backoffUntil
        ).toISOString()}`
      );
      throw new Error("Rate limited: Too many refresh attempts");
    }

    // If last attempt was less than 2 seconds ago, increment counter
    if (now - refreshAttempts.lastAttempt < 2000) {
      refreshAttempts.count++;

      // If we've had too many attempts in quick succession, implement exponential backoff
      if (refreshAttempts.count > 3) {
        const backoffSeconds = Math.min(
          Math.pow(2, refreshAttempts.count - 3),
          60
        ); // Exponential backoff, max 60 seconds
        refreshAttempts.backoffUntil = now + backoffSeconds * 1000;
        console.log(
          `Too many refresh attempts. Backing off for ${backoffSeconds} seconds until ${new Date(
            refreshAttempts.backoffUntil
          ).toISOString()}`
        );
        throw new Error("Rate limited: Too many refresh attempts");
      }
    } else {
      // Reset counter if it's been a while since last attempt
      refreshAttempts.count = 0;
    }

    refreshAttempts.lastAttempt = now;

    console.log("Attempting to refresh access token");
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/refresh-token`,
      {
        method: "GET",
        headers: {
          refresh_token: token.refreshToken,
        },
      }
    );

    const newTokens = await response.json();

    if (!response.ok) {
      console.error("Token refresh failed with status:", response.status);
      console.error("Token refresh error:", newTokens);

      // Special handling for rate limiting
      if (response.status === 429) {
        // Implement more aggressive backoff for 429 responses
        const backoffSeconds = 30; // 30 seconds backoff for 429 responses
        refreshAttempts.backoffUntil = now + backoffSeconds * 1000;
        console.log(
          `Rate limited by server. Backing off for ${backoffSeconds} seconds until ${new Date(
            refreshAttempts.backoffUntil
          ).toISOString()}`
        );
        throw new Error("Rate limited by server: Too many requests");
      }

      throw new Error("Failed to refresh token");
    }

    // Reset attempts counter on success
    refreshAttempts.count = 0;

    console.log("Token refreshed successfully");
    const newDecodedToken = jwt.decode(newTokens.access_token) as DecodedToken;

    return {
      ...token,
      accessToken: newTokens.access_token,
      refreshToken: newTokens.refresh_token || token.refreshToken, // Use new refresh token if provided
      tokenExpires: newDecodedToken.exp,
      error: null,
    };
  } catch (error) {
    console.error("Error refreshing token:", error);
    return {
      ...token,
      error: "RefreshAccessTokenError",
    };
  }
}
// @ts-ignore
const auth: any = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "email", type: "email" },
        password: { label: "password", type: "password" },
        twoFactorCode: { label: "twoFactorCode", type: "text" },
      },
      async authorize(credentials, req) {
        try {
          const ip =
            (req?.headers?.["x-forwarded-for"] as string) ||
            (req?.headers?.["x-real-ip"] as string) ||
            "IP not available";

          const res = await fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/login`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                "x-forwarded-for": ip,
              },
              body: JSON.stringify({
                email: credentials?.email,
                password: credentials?.password,
                twoFactorCode: credentials?.twoFactorCode,
              }),
            }
          );
          const user = await res.json();

          if (res.ok && user) {
            const decodedToken = jwt.decode(user.access_token) as DecodedToken;
            return {
              id: decodedToken.sub,
              email: decodedToken.email,
              roleid: decodedToken.roleid,
              username: decodedToken.username,
              negociateurId: decodedToken.negotiatorId,
              followsbusiness: decodedToken.followsbusiness,
              token: user.access_token,
              refreshToken: user.refresh_token,
              tokenExpires: decodedToken.exp,
            };
          } else {
            console.error("Login failed:", user);
            return null;
          }
        } catch (error) {
          console.error("Error during login:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    session: async ({ session, token }: { session: any; token: any }) => {
      if (token.accessToken) {
        const decodedToken = jwt.decode(
          token.accessToken as string
        ) as DecodedToken;

        // Create a user object directly from the decoded token
        const user = {
          id: decodedToken.sub,
          email: decodedToken.email,
          name: decodedToken.username,
          roleid: decodedToken.roleid,
          negotiatorId: decodedToken.negotiatorId,
          followsbusiness: decodedToken.followsbusiness,
          token: token.accessToken as string,
          refreshToken: token.refreshToken as string,
          tokenExpires: decodedToken.exp,
          error: token?.error,
        };

        // Assign the user object to session.user
        session.user = user;
      }
      return session;
    },
    jwt: async ({ token, user }: { token: any; user: any }) => {
      if (user && user.token) {
        token.accessToken = user.token as string;
        token.refreshToken = user.refreshToken as string;
        token.tokenExpires = user.tokenExpires as number;
        token.error = user.error as string;
      }

      // Check if token is expired or about to expire (within 5 minutes instead of 1)
      const isTokenExpired =
        token.tokenExpires &&
        Date.now() > (token.tokenExpires as number) * 1000;
      const isTokenExpiringSoon =
        token.tokenExpires &&
        Date.now() > (token.tokenExpires as number) * 1000 - 5 * 60 * 1000; // 5 minutes before expiration

      // Only attempt refresh if we're not in a backoff period
      if (
        (isTokenExpired || isTokenExpiringSoon) &&
        Date.now() >= refreshAttempts.backoffUntil
      ) {
        console.log("Token expired or expiring soon, attempting refresh");
        const refreshedToken = await refreshAccessToken(token);

        // Log the user out if refreshing fails
        if (refreshedToken.error) {
          console.error("Token refresh failed:", refreshedToken.error);
          return {
            ...token,
            error: "RefreshAccessTokenError",
          };
        }

        return refreshedToken;
      }

      return token;
    },
  },
};

export default auth;
