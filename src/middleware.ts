import type { NextRequest } from 'next/server';
import { createLocaleRedirect, pathnameHasLocale } from '@/i18n';

export async function middleware(request: NextRequest) {
  if (!pathnameHasLocale(request)) {
    return createLocaleRedirect(request);
  }
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
    '/((?!api|_next|slice-simulator|.*\..*).*)',
  ],
};
