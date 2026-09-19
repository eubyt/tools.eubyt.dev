"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useSyncExternalStore,
    type ReactNode,
} from "react";
import {
    applyTheme,
    getServerThemeSnapshot,
    getThemeSnapshot,
    setStoredTheme,
    subscribeTheme,
    type Theme,
} from "@/lib/theme";

type ThemeContextValue = {
    theme: Theme;
    setTheme: (theme: Theme) => void;
};

const ThemeContext = createContext<ThemeContextValue | null>(null);

export function ThemeProvider({ children }: { children: ReactNode }) {
    const theme = useSyncExternalStore(
        subscribeTheme,
        getThemeSnapshot,
        getServerThemeSnapshot,
    );

    const setTheme = useCallback((next: Theme) => {
        setStoredTheme(next);
    }, []);

    useEffect(() => {
        applyTheme(theme);

        if (theme !== "system") return;

        const media = window.matchMedia("(prefers-color-scheme: dark)");
        const onChange = () => applyTheme("system");
        media.addEventListener("change", onChange);
        return () => media.removeEventListener("change", onChange);
    }, [theme]);

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error("useTheme must be used within ThemeProvider");
    }
    return context;
}
