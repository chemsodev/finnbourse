import { NextRequest } from "next/server";
import { withAuth } from "next-auth/middleware";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const publicPages = [
  "/login",
  "/inscription",
  "/inscription/particulier",
  "/inscription/entreprise",
  "/2fa",
  "/congrats",
  "/motdepasseoublie",
];

const intlMiddleware = createMiddleware(routing);

const authMiddleware = withAuth((req) => intlMiddleware(req), {
  callbacks: {
    authorized: ({ token }) => {
      // Check if token exists and is not expired
      if (!token) return false;

      // Check for token expiry error
      if ((token as any).error === "TokenExpired") {
        console.log("Token expired, redirecting to login");
        return false;
      }

      return true;
    },
  },
  pages: {
    signIn: "/login?tokenExpired=true",
  },
});

export default function middleware(req: NextRequest) {
  const publicPathnameRegex = RegExp(
    `^(/(${routing.locales.join("|")}))?(${publicPages
      .flatMap((p) => (p === "/" ? ["", "/"] : p))
      .join("|")})/?$`,
    "i"
  );
  const isPublicPage = publicPathnameRegex.test(req.nextUrl.pathname);

  if (isPublicPage) {
    return intlMiddleware(req);
  } else {
    // Ensure this middleware is correctly handling authenticated requests
    return (authMiddleware as any)(req);
  }
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
