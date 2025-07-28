import { NextRequest, NextResponse } from "next/server";
import { createLocaleRedirect, pathnameHasLocale, LOCALES } from "@/i18n";

export async function middleware(request: NextRequest) {
  // If the pathname does not have a locale, redirect to a localized URL
  if (!pathnameHasLocale(request)) {
    return createLocaleRedirect(request);
  }

  // The request has a locale, so we can set a cookie with it
  const pathname = request.nextUrl.pathname;
  const locale = pathname.split("/")[1] || LOCALES["en-us"];

  const response = NextResponse.next();
  response.cookies.set("NEXT_LOCALE", locale, {
    path: "/",
    sameSite: "lax",
  });

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - slice-simulator (Prismic)
     * - favicon.ico (favicon)
     * - all files in the public folder (e.g. /favicon.ico)
     */
    "/((?!api|_next|slice-simulator|.*\\..*).*)",
  ],
};
