// @ts-ignore
import CredentialsProvider from "next-auth/providers/credentials";
import jwt from "jsonwebtoken";
import { REFRESH_TOKEN_MUTATION } from "@/graphql/mutations";
import {
  graphqlClient,
  TokenRefreshError,
  AuthenticationError,
} from "@/lib/graphql-client";

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
    loginSource?: "REST" | "GraphQL";
    restToken?: string;
    refreshAttempts?: number;
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
  // No automatic refresh - just return the token without expiry error
  console.log("Token expired check disabled - returning token as is");
  return token;
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

          // Use GraphQL backend for primary authentication
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

          if (res.ok && user?.access_token) {
            console.log("Login successful with GraphQL backend");
            const decodedToken = jwt.decode(user.access_token) as DecodedToken;

            // Generate REST API token in background for actor management
            let restToken = null;
            try {
              console.log(
                "Attempting to get REST API token for actor management..."
              );
              const restRes = await fetch(
                `${process.env.NEXT_PUBLIC_REST_API_URL}/auth/login`,
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    "x-forwarded-for": ip,
                  },
                  body: JSON.stringify({
                    username: credentials?.email,
                    password: credentials?.password,
                    otp: credentials?.twoFactorCode,
                  }),
                }
              );

              if (restRes.ok) {
                const restUser = await restRes.json();
                if (restUser?.access_token) {
                  restToken = restUser.access_token;
                  console.log("REST API token obtained for actor management");
                }
              }
            } catch (restError) {
              console.log("Could not obtain REST API token:", restError);
            }

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
              loginSource: "GraphQL",
              restToken: restToken, // Store REST token for actor management
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
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // 24 hours
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    session: async ({ session, token }: { session: any; token: any }) => {
      console.log("📋 Session callback called", {
        hasToken: !!token,
        hasAccessToken: !!token?.accessToken,
      });

      if (token.accessToken) {
        const decodedToken = jwt.decode(
          token.accessToken as string
        ) as DecodedToken; // Create a user object directly from the decoded token
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
          loginSource: token?.loginSource,
          restToken: token?.restToken,
        };

        // Assign the user object to session.user
        session.user = user;
        console.log("✅ Session user set successfully");
      } else {
        console.log("❌ No access token in JWT token");
      }
      return session;
    },
    jwt: async ({ token, user }: { token: any; user: any }) => {
      console.log("🔑 JWT callback called", {
        hasUser: !!user,
        hasUserToken: !!user?.token,
      });

      if (user && user.token) {
        token.accessToken = user.token as string;
        token.refreshToken = user.refreshToken as string;
        token.tokenExpires = user.tokenExpires as number;
        token.error = user.error as string;
        token.loginSource = user.loginSource as string;
        token.restToken = user.restToken as string;

        console.log("✅ JWT token set successfully");
      }

      // Check if user is logging out (no session)
      if (!user && !token.accessToken) {
        console.log("🚪 User logging out, shutting down token manager");
        // Import tokenManager dynamically to avoid circular imports
        if (typeof window !== "undefined" && (window as any).tokenManager) {
          (window as any).tokenManager.shutdown();
        }
      }

      // Token expiration check disabled
      // if (token.tokenExpires) {
      //   const expiryTime = token.tokenExpires * 1000;
      //   const now = Date.now();
      //
      //   if (now > expiryTime) {
      //     console.log("Token has expired, marking for logout");
      //     return {
      //       ...token,
      //       error: "TokenExpired",
      //     };
      //   }
      // }

      // Token is still valid
      return token;
    },
  },
};

export default auth;
