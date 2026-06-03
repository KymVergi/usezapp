import { NextRequest, NextResponse } from "next/server";

// Next.js 16: proxy.ts replaces middleware.ts
// Runs on Node.js runtime (not Edge)
export default function proxy(request: NextRequest) {
  // Add security headers to all responses
  const response = NextResponse.next();

  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
