
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Nunca proteger API
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // 🔐 Middleware SOMENTE para admin
  if (pathname.startsWith("/admin")) {
    const sessionToken =
      req.cookies.get("better-auth.session_token")?.value ??
      req.cookies.get("__Secure-better-auth.session_token")?.value;

    if (!sessionToken) {
      return NextResponse.redirect(new URL("/login", req.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
