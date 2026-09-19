export const THEME_STORAGE_KEY = "user-theme";

export type Theme = "light" | "dark" | "system";

export const THEMES: Theme[] = ["light", "dark", "system"];

export function isTheme(value: unknown): value is Theme {
    return value === "light" || value === "dark" || value === "system";
}

export function getSystemTheme(): "light" | "dark" {
    if (typeof window === "undefined") return "light";
    return window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
}

export function resolveTheme(theme: Theme): "light" | "dark" {
    return theme === "system" ? getSystemTheme() : theme;
}

export function applyTheme(theme: Theme) {
    const resolved = resolveTheme(theme);
    const root = document.documentElement;
    root.setAttribute("data-theme", resolved);
    root.style.colorScheme = resolved;
}

export function cycleTheme(theme: Theme): Theme {
    const index = THEMES.indexOf(theme);
    return THEMES[(index + 1) % THEMES.length]!;
}

export function withViewTransition(update: () => void) {
    const canTransition =
        typeof document !== "undefined" &&
        "startViewTransition" in document &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (canTransition) {
        document.startViewTransition(update);
        return;
    }

    update();
}

/** Inline antiflash script — keep in sync with applyTheme / storage key. */
export const themeInitScript = `(function(){try{var k=${JSON.stringify(THEME_STORAGE_KEY)};var t=localStorage.getItem(k)||"system";if(t!=="light"&&t!=="dark"&&t!=="system")t="system";var r=t==="system"?(window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light"):t;var e=document.documentElement;e.setAttribute("data-theme",r);e.style.colorScheme=r}catch(e){}})();`;
