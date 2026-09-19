import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { LOCALES, resolveBrowserLocale, type Locale } from "@/lib/locale";

function requestLocale(request: NextRequest): Locale {
    const header = request.headers.get("accept-language");
    const primary = header?.split(",")[0]?.trim() ?? "en";
    return resolveBrowserLocale(primary);
}

function extractLocaleAndPath(
    pathname: string,
    request: NextRequest,
): { locale: Locale; pathWithoutLocale: string } {
    const segments = pathname.split("/").filter(Boolean);
    if (segments.length > 0 && LOCALES.includes(segments[0] as Locale)) {
        return {
            locale: segments[0] as Locale,
            pathWithoutLocale: "/" + segments.slice(1).join("/"),
        };
    }
    return {
        locale: requestLocale(request),
        pathWithoutLocale: pathname,
    };
}

export function resolveCustomRedirect(
    pathname: string,
    request: NextRequest,
): string | null {
    const { locale, pathWithoutLocale } = extractLocaleAndPath(
        pathname,
        request,
    );
    const normalized =
        pathWithoutLocale.toLowerCase().replace(/\/+$/, "") || "/";

    // 1. /url/slug or /tools/url/slug -> Clean URL Slug Generator
    if (
        normalized === "/url/slug" ||
        normalized === "/tools/url/slug" ||
        normalized === "/url-slug"
    ) {
        return `/${locale}/tools/url-slug`;
    }

    // 2. tools/base64/decode or encode/encoded -> base64
    if (
        normalized === "/tools/base64/decode" ||
        normalized === "/tools/base64/encode" ||
        normalized === "/tools/base64/encoded" ||
        normalized === "/base64/decode" ||
        normalized === "/base64/encode" ||
        normalized === "/base64/encoded"
    ) {
        return `/${locale}/tools/base64`;
    }

    // 3. tools/hash/* or /tools/hash -> hash-gen
    if (
        normalized === "/tools/hash" ||
        normalized.startsWith("/tools/hash/") ||
        normalized === "/hash" ||
        normalized.startsWith("/hash/")
    ) {
        return `/${locale}/tools/hash-gen`;
    }

    // 4. /tools or /tools/ alone -> catalog home
    if (normalized === "/tools") {
        return `/${locale}`;
    }

    return null;
}

function pathnameHasLocale(pathname: string): boolean {
    return LOCALES.some(
        (locale) =>
            pathname === `/${locale}` || pathname.startsWith(`/${locale}/`),
    );
}

export function proxy(request: NextRequest) {
    const { pathname } = request.nextUrl;

    const redirectPath = resolveCustomRedirect(pathname, request);
    if (redirectPath && pathname !== redirectPath) {
        const url = request.nextUrl.clone();
        url.pathname = redirectPath;
        return NextResponse.redirect(url);
    }

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
