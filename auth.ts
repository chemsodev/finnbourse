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
    loginSource?: "REST" | "GraphQL";
    restToken?: string;
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
  callbacks: {
    session: async ({ session, token }: { session: any; token: any }) => {
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
      }
      return session;
    },
    jwt: async ({ token, user }: { token: any; user: any }) => {
      if (user && user.token) {
        token.accessToken = user.token as string;
        token.refreshToken = user.refreshToken as string;
        token.tokenExpires = user.tokenExpires as number;
        token.error = user.error as string;
        token.loginSource = user.loginSource as string;
        token.restToken = user.restToken as string;
      }

      // Check if token is expired or about to expire (within 5 minutes instead of 1)
      const isTokenExpired =
        token.tokenExpires &&
        Date.now() > (token.tokenExpires as number) * 1000;
      const isTokenExpiringSoon =
        token.tokenExpires &&
        Date.now() > (token.tokenExpires as number) * 1000 - 5 * 60 * 1000; // 5 minutes before expiration      // Refresh token if expired or expiring soon
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
