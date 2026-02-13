import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';

const handleI18nRouting = createMiddleware(routing);

export default function proxy(req: NextRequest) {
    const { pathname } = req.nextUrl;

    // Nunca proteger API - Allow API routes to pass through
    if (pathname.startsWith("/api") || pathname.startsWith("/_next") || pathname.includes(".")) {
        return NextResponse.next();
    }

    // 🔐 Middleware SOMENTE para admin
    // Check for admin/ in the path, potentially preceded by a locale
    const isAdminPath = pathname.match(/^\/(?:[a-z]{2}\/)?admin/);

    if (isAdminPath) {
        const sessionToken =
            req.cookies.get("better-auth.session_token")?.value ??
            req.cookies.get("__Secure-better-auth.session_token")?.value;

        if (!sessionToken) {
            // Redirect to login, preserving locale if present, or defaulting
            // simpler to let next-intl handle the redirect to localized login if we redirect to /login
            // but we need to supply the locale.
            const locale = pathname.match(/^\/([a-z]{2})/)?.[1] || routing.defaultLocale;
            return NextResponse.redirect(new URL(`/${locale}/login`, req.url));
        }
    }

    return handleI18nRouting(req);
}

export const config = {
    // Match all routes except API, static files, and Next.js internals
    matcher: [
        // Match all paths except those starting with:
        // - api (API routes)
        // - _next (Next.js internals)
        // - Files with extensions (e.g., .ico, .png)
        '/((?!api|_next|.*\\..*).*)'
    ]
};
