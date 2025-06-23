import { NextRequest } from "next/server";
import { withAuth } from "next-auth/middleware";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const publicPages = [
  "/",
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
    authorized: ({ token, req }) => {
      const pathname = req.nextUrl.pathname;
      console.log("🔐 Auth check for:", pathname, "Token exists:", !!token);

      // Always allow access to login page to prevent infinite redirects
      if (pathname.includes("/login")) {
        console.log("✅ Allowing login page access");
        return true;
      }

      // Check if token exists (expiry check disabled)
      if (!token) {
        console.log("❌ No token found, redirecting to login");
        return false;
      }

      // Token expiry check disabled
      // if ((token as any).error === "TokenExpired") {
      //   console.log("⏰ Token expired, redirecting to login");
      //   return false;
      // }

      console.log("✅ Token valid, allowing access");
      return true;
    },
  },
  pages: {
    signIn: "/login?tokenExpired=true",
  },
});

export default function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  console.log("🛡️ Middleware processing:", pathname);

  const publicPathnameRegex = RegExp(
    `^(/(${routing.locales.join("|")}))?(${publicPages
      .flatMap((p) => (p === "/" ? ["", "/"] : p))
      .join("|")})/?$`,
    "i"
  );
  const isPublicPage = publicPathnameRegex.test(pathname);
  console.log("🔍 Is public page:", isPublicPage, "for:", pathname);

  if (isPublicPage) {
    console.log("✅ Public page, using intl middleware");
    return intlMiddleware(req);
  } else {
    console.log("🔒 Protected page, using auth middleware");
    // Ensure this middleware is correctly handling authenticated requests
    return (authMiddleware as any)(req);
  }
}

export const config = {
  matcher: ["/((?!api|_next|.*\\..*).*)"],
};
