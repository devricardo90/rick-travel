
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // nunca proteger API
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const sessionToken =
    req.cookies.get("better-auth.session-token")?.value ??
    req.cookies.get("__Secure-better-auth.session-token")?.value;

  const isLoggedIn = Boolean(sessionToken);

  // 🔐 protege apenas admin e reservas
  if (
    !isLoggedIn &&
    (pathname.startsWith("/admin") || pathname.startsWith("/reservas"))
  ) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/reservas/:path*"],
};

