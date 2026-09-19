import { THEME_STORAGE_KEY, applyTheme, isTheme, type Theme } from "./theme";

type Listener = () => void;

const listeners = new Set<Listener>();

let crossTabBound = false;

function emit() {
    for (const listener of listeners) listener();
}

function onStorage(event: StorageEvent) {
    if (event.key !== THEME_STORAGE_KEY) return;
    applyTheme(readStoredTheme());
    emit();
}

function ensureCrossTabSync() {
    if (crossTabBound || typeof window === "undefined") return;
    window.addEventListener("storage", onStorage);
    crossTabBound = true;
}

export function readStoredTheme(): Theme {
    try {
        const stored = localStorage.getItem(THEME_STORAGE_KEY);
        if (isTheme(stored)) return stored;
    } catch {
        /* ignore */
    }
    return "system";
}

export function subscribeTheme(listener: Listener) {
    ensureCrossTabSync();
    listeners.add(listener);
    return () => {
        listeners.delete(listener);
    };
}

export function getThemeSnapshot(): Theme {
    return readStoredTheme();
}

export function getServerThemeSnapshot(): Theme {
    return "system";
}

export function setStoredTheme(theme: Theme) {
    try {
        localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
        /* ignore */
    }
    applyTheme(theme);
    emit();
}

/** Exposed for tests — simulate another tab changing localStorage. */
export function handleStorageEventForTests(event: StorageEvent) {
    onStorage(event);
}
