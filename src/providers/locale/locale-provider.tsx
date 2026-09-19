"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    type ReactNode,
} from "react";
import {
    applyLocale,
    messagesByLocale,
    translate,
    type Locale,
    type MessageParams,
    type Messages,
} from "@/lib/locale";

type LocaleContextValue = {
    locale: Locale;
    messages: Messages;
    t: (key: string, params?: MessageParams) => string;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
    locale,
    children,
}: {
    locale: Locale;
    children: ReactNode;
}) {
    const messages = messagesByLocale[locale];

    const t = useCallback(
        (key: string, params?: MessageParams) =>
            translate(messages, key, params),
        [messages],
    );

    useEffect(() => {
        applyLocale(locale);
    }, [locale]);

    return (
        <LocaleContext.Provider value={{ locale, messages, t }}>
            {children}
        </LocaleContext.Provider>
    );
}

export function useLocale() {
    const context = useContext(LocaleContext);
    if (!context) {
        throw new Error("useLocale must be used within LocaleProvider");
    }
    return context;
}

export function useTranslations() {
    return useLocale().t;
}
