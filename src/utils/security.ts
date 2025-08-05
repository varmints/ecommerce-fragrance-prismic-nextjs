import { NextResponse } from "next/server";

/**
 * Security headers middleware
 */
export function withSecurityHeaders(response: NextResponse): NextResponse {
  // Security headers
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(), microphone=(), geolocation=()",
  );

  // Content Security Policy for API routes
  response.headers.set(
    "Content-Security-Policy",
    "default-src 'self'; script-src 'none'; object-src 'none';",
  );

  return response;
}

/**
 * CORS headers for API routes
 */
export function withCORS(
  response: NextResponse,
  allowedOrigins?: string[],
): NextResponse {
  const defaultOrigins = [
    process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    "https://fragrancecoteroyal.netlify.app", // Add your production domain
  ];

  const origins = allowedOrigins || defaultOrigins;

  response.headers.set("Access-Control-Allow-Origin", origins[0]);
  response.headers.set("Access-Control-Allow-Methods", "POST, OPTIONS");
  response.headers.set(
    "Access-Control-Allow-Headers",
    "Content-Type, Authorization",
  );
  response.headers.set("Access-Control-Max-Age", "86400"); // 24 hours

  return response;
}
