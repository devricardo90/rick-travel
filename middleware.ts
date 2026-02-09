
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ❌ Nunca proteja API no middleware
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  // Apenas verifica existência do cookie (sem validar)
  const hasSessionCookie =
    req.cookies.has("better-auth.session-token") ||
    req.cookies.has("__Secure-better-auth.session-token");

  // 🔐 Rotas privadas
  if (!hasSessionCookie && pathname.startsWith("/reservas")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  if (!hasSessionCookie && pathname.startsWith("/admin")) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/reservas/:path*", "/admin/:path*"],
};
