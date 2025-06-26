import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
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

export default async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  console.log("🛡️ Middleware processing:", pathname);

  // Handle API routes - skip middleware for API routes
  if (pathname.startsWith("/api")) {
    console.log("🔄 API route, skipping middleware");
    return NextResponse.next();
  }

  // Handle static files and Next.js internals
  if (pathname.startsWith("/_next") || pathname.includes(".")) {
    console.log("🔄 Static file or Next.js internal, skipping middleware");
    return NextResponse.next();
  }

  // Check if the current pathname is a public page
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
  }

  // For protected pages, check authentication
  try {
    const token = await getToken({
      req,
      secret: process.env.NEXTAUTH_SECRET,
      secureCookie: process.env.NODE_ENV === "production",
    });

    console.log(
      "🔐 Token check for protected route:",
      pathname,
      "Token exists:",
      !!token
    );

    if (!token) {
      console.log("❌ No token found, redirecting to login");

      // Get the locale from the pathname
      const locale =
        pathname.match(/^\/(fr|en|ar)/)?.[1] || routing.defaultLocale;
      const loginUrl = new URL(`/${locale}/login`, req.url);

      // Add the attempted URL as a callback parameter
      if (pathname !== `/${locale}` && pathname !== "/") {
        loginUrl.searchParams.set("callbackUrl", pathname);
      }

      return NextResponse.redirect(loginUrl);
    }

    // Token exists, apply intl middleware for protected routes
    console.log("✅ Token valid, applying intl middleware");
    return intlMiddleware(req);
  } catch (error) {
    console.error("❌ Error checking token:", error);

    // Fallback to redirect to login on error
    const locale =
      pathname.match(/^\/(fr|en|ar)/)?.[1] || routing.defaultLocale;
    const loginUrl = new URL(`/${locale}/login`, req.url);
    return NextResponse.redirect(loginUrl);
  }
}

export const config = {
  matcher: [
    // Match all request paths except for the ones starting with:
    // - api (API routes)
    // - _next/static (static files)
    // - _next/image (image optimization files)
    // - favicon.ico (favicon file)
    // - public files with extensions
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|gif|webp|svg|ico|woff|woff2|ttf|eot|otf|mp4|mp3|wav|flac|aac|ogg|oga|webm|3gp|3g2|avi|mov|wmv|flv|mkv)$).*)",
  ],
};
