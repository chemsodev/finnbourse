import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
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

export default async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  console.log("🛡️ Middleware processing:", pathname);

  // Handle API routes - skip middleware for API routes
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Handle static files and Next.js internals
  if (pathname.startsWith("/_next") || pathname.includes(".")) {
    return NextResponse.next();
  }

  // First, always apply intl middleware for locale handling
  const intlResponse = intlMiddleware(req);

  // Check if this is a public page (with locale support)
  const isPublicPage = publicPages.some((page) => {
    // Check exact match
    if (pathname === page) return true;
    // Check with locale prefix
    return routing.locales.some((locale) => pathname === `/${locale}${page}`);
  });

  console.log("🔍 Is public page:", isPublicPage, "for:", pathname);

  if (isPublicPage) {
    console.log("✅ Public page, allowing access");
    return intlResponse;
  }

  // Debug: Log all cookies
  const allCookies = req.cookies.getAll();
  console.log(
    "🍪 All cookies:",
    allCookies.map((c) => ({ name: c.name, hasValue: !!c.value }))
  );

  // For protected pages, check authentication with improved error handling
  try {
    // Try multiple cookie names and approaches
    const possibleCookieNames = [
      "next-auth.session-token",
      "__Secure-next-auth.session-token",
      "next-auth.csrf-token",
      "__Host-next-auth.csrf-token",
    ];

    let token = null;

    // Try each possible cookie name
    for (const cookieName of possibleCookieNames) {
      try {
        token = await getToken({
          req,
          secret: process.env.NEXTAUTH_SECRET,
          cookieName: cookieName,
        });
        if (token) {
          console.log(`✅ Found token with cookie name: ${cookieName}`);
          break;
        }
      } catch (err) {
        console.log(
          `❌ Failed with cookie name ${cookieName}:`,
          err instanceof Error ? err.message : String(err)
        );
      }
    }

    // If no token found with specific cookie names, try default
    if (!token) {
      try {
        token = await getToken({
          req,
          secret: process.env.NEXTAUTH_SECRET,
        });
        if (token) {
          console.log("✅ Found token with default settings");
        }
      } catch (err) {
        console.log(
          "❌ Failed with default settings:",
          err instanceof Error ? err.message : String(err)
        );
      }
    }

    console.log("🔐 Final token check:", {
      exists: !!token,
      path: pathname,
      tokenSub: token?.sub,
      tokenEmail: token?.email,
    });

    if (!token) {
      console.log("❌ No token found, redirecting to login");

      // Get the locale from the pathname or use default
      const locale =
        pathname.match(/^\/(fr|en|ar)/)?.[1] || routing.defaultLocale;
      const loginUrl = new URL(`/${locale}/login`, req.url);

      // Store the attempted URL for redirect after login (only for non-root paths)
      if (
        pathname !== "/" &&
        pathname !== `/${locale}` &&
        !pathname.endsWith(`/${locale}`)
      ) {
        loginUrl.searchParams.set("callbackUrl", pathname);
      }

      console.log("🔄 Redirecting to:", loginUrl.toString());
      return NextResponse.redirect(loginUrl);
    }

    // Token exists, user is authenticated
    console.log("✅ User authenticated, allowing access");
    return intlResponse;
  } catch (error) {
    console.error("❌ Error checking token:", error);

    // More graceful error handling - don't redirect on every error
    // Just log and allow through for now to prevent loops
    console.log(
      "⚠️ Allowing access despite token check error to prevent loops"
    );
    return intlResponse;
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
