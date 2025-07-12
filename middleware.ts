import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";
import jwt from "jsonwebtoken";

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

// Function to check if token is expired
function isTokenExpired(token: any): boolean {
  try {
    if (token?.accessToken) {
      const decoded = jwt.decode(token.accessToken) as any;
      if (decoded?.exp) {
        const currentTime = Math.floor(Date.now() / 1000);
        const expiryTime = decoded.exp;
        const timeUntilExpiry = expiryTime - currentTime;

        console.log("🕐 Token expiry check:", {
          currentTime,
          expiryTime,
          timeUntilExpiry: `${timeUntilExpiry}s`,
          isExpired: currentTime >= expiryTime - 30,
        });

        // Add a small buffer (30 seconds) to prevent edge cases
        return currentTime >= expiryTime - 30;
      }
      console.log("⚠️ No exp field in token");
    } else {
      console.log("⚠️ No accessToken in token object");
    }
    return false;
  } catch (error) {
    console.error("Error checking token expiry:", error);
    return true; // Assume expired if we can't decode
  }
}

export default async function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;

  console.log("🛡️ Middleware processing:", pathname);

  // Fix for double locale prefix issue (e.g., /en/en/passerunordre -> /en/passerunordre)
  const doubleLocaleMatch = pathname.match(/^\/(fr|en|ar)\/(fr|en|ar)\/(.*)$/);
  if (doubleLocaleMatch) {
    const [, firstLocale, secondLocale, restPath] = doubleLocaleMatch;
    // If both locales are the same, redirect to single locale
    if (firstLocale === secondLocale) {
      const correctedUrl = new URL(`/${firstLocale}/${restPath}`, req.url);
      console.log(
        "🔄 Fixing double locale prefix:",
        pathname,
        "->",
        correctedUrl.pathname
      );
      return NextResponse.redirect(correctedUrl);
    }
  }

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
      console.log("❌ No token found, checking for redirect loop prevention");

      // Check if we're trying to access root and just came from login
      const referer = req.headers.get("referer");
      const isFromLogin =
        referer &&
        (referer.includes("/login") || referer.includes("/fr/login"));
      const isRootPath =
        pathname === "/" ||
        pathname === "/fr" ||
        pathname === "/en" ||
        pathname === "/ar";

      // Also check for recent login grace period
      const recentLoginCookie = req.cookies.get("recent_login_grace");

      if ((isFromLogin && isRootPath) || recentLoginCookie) {
        console.log(
          "⚠️ Just logged in and accessing root or in grace period, allowing access"
        );
        // Allow access for now to prevent redirect loops immediately after login
        return intlResponse;
      }

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

    // Check if token is expired, but be more lenient to avoid redirect loops
    if (isTokenExpired(token)) {
      console.log("❌ Token is expired, checking for redirect loop prevention");

      // Check if we just came from a login page to prevent immediate redirect loops
      const referer = req.headers.get("referer");
      const isFromLogin =
        referer &&
        (referer.includes("/login") || referer.includes("/fr/login"));

      // Also check for recent login grace period
      const recentLoginCookie = req.cookies.get("recent_login_grace");

      // Check if we're already on the login page to prevent loops
      const isAlreadyOnLogin = pathname.includes("/login");

      if (isFromLogin || recentLoginCookie || isAlreadyOnLogin) {
        console.log(
          "⚠️ Just came from login, in grace period, or already on login - allowing access to prevent redirect loop"
        );
        // Allow access for now, the client will handle token refresh/logout
        return intlResponse;
      }

      // Get the locale from the pathname or use default
      const locale =
        pathname.match(/^\/(fr|en|ar)/)?.[1] || routing.defaultLocale;
      const loginUrl = new URL(`/${locale}/login`, req.url);

      // Add a query parameter to indicate token expiry for cleanup
      loginUrl.searchParams.set("expired", "true");

      console.log(
        "🔄 Redirecting to login due to expired token:",
        loginUrl.toString()
      );
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
