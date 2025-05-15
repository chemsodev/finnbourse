import { AuthOptions, DefaultSession } from "next-auth";
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
async function refreshAccessToken(token: any) {
  try {
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
      throw new Error("Failed to refresh token");
    }

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
const auth: AuthOptions = {
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
    session: async ({ session, token }) => {
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
    jwt: async ({ token, user }) => {
      if (user && user.token) {
        token.accessToken = user.token as string;
        token.refreshToken = user.refreshToken as string;
        token.tokenExpires = user.tokenExpires as number;
        token.error = user.error as string;
      }

      // Check if token is expired or about to expire (within 1 minute)
      const isTokenExpired =
        token.tokenExpires &&
        Date.now() > (token.tokenExpires as number) * 1000;
      const isTokenExpiringSoon =
        token.tokenExpires &&
        Date.now() > (token.tokenExpires as number) * 1000 - 60 * 1000; // 1 minute before expiration

      if (isTokenExpired || isTokenExpiringSoon) {
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
