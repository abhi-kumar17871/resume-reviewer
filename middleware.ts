import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Lightweight gating: We'll rely primarily on server components for auth redirects.
// Middleware reserved for quick public/blocked path handling.
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};


