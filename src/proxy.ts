import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { LOCALES, resolveBrowserLocale, type Locale } from "@/lib/locale";

function requestLocale(request: NextRequest): Locale {
    const header = request.headers.get("accept-language");
    const primary = header?.split(",")[0]?.trim() ?? "en";
    return resolveBrowserLocale(primary);
}

function pathnameHasLocale(pathname: string): boolean {
    return LOCALES.some(
        (locale) =>
            pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
    );
}

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (pathnameHasLocale(pathname)) {
        return NextResponse.next();
    }

    const locale = requestLocale(request);
    const url = request.nextUrl.clone();
    url.pathname = pathname === "/" ? `/${locale}` : `/${locale}${pathname}`;
    return NextResponse.redirect(url);
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\..*).*)"],
};
