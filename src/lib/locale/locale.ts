export const LOCALES = ["en", "pt"] as const;

export type Locale = (typeof LOCALES)[number];

export const LOCALE_HTML_LANG: Record<Locale, string> = {
    en: "en",
    pt: "pt-BR",
};

export const LOCALE_DISPLAY_NAME: Record<Locale, string> = {
    en: "English",
    pt: "Português",
};

export function isLocale(value: unknown): value is Locale {
    return value === "en" || value === "pt";
}

export function resolveBrowserLocale(
    language = typeof navigator !== "undefined" ? navigator.language : "en",
): Locale {
    return language.toLowerCase().startsWith("pt") ? "pt" : "en";
}

export function applyLocale(locale: Locale) {
    if (typeof document === "undefined") return;
    document.documentElement.lang = LOCALE_HTML_LANG[locale];
}

/** `/hobby` → `/en/hobby`; strips an existing locale prefix first. */
export function withLocale(locale: Locale, path = "/"): string {
    const bare = path.replace(/^\/(en|pt)(?=\/|$)/, "") || "/";
    if (bare === "/") return `/${locale}`;
    return `/${locale}${bare.startsWith("/") ? bare : `/${bare}`}`;
}

/** Swap the locale segment of a pathname, preserving the rest. */
export function swapLocale(pathname: string, locale: Locale): string {
    const segments = pathname.split("/");
    if (segments.length > 1 && isLocale(segments[1])) {
        segments[1] = locale;
        return segments.join("/") || `/${locale}`;
    }
    return withLocale(locale, pathname);
}
