import en from "@/lang/en.json";
import pt from "@/lang/pt.json";
import type { Locale } from "./locale";

export type Messages = typeof en;

export const messagesByLocale: Record<Locale, Messages> = {
    en,
    pt,
};

export type MessageParams = Record<string, string | number>;

function getByPath(messages: Messages, path: string): unknown {
    return path.split(".").reduce<unknown>((acc, key) => {
        if (acc && typeof acc === "object" && key in acc) {
            return (acc as Record<string, unknown>)[key];
        }
        return undefined;
    }, messages);
}

export function translate(
    messages: Messages,
    key: string,
    params?: MessageParams,
): string {
    const value = getByPath(messages, key);
    if (typeof value !== "string") {
        return key;
    }

    if (!params) return value;

    return value.replace(/\{(\w+)\}/g, (match, name: string) => {
        const replacement = params[name];
        return replacement == null ? match : String(replacement);
    });
}
