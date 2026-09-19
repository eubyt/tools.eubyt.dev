"use client";

import { useState, useCallback } from "react";

export function useClipboard(timeout = 2000) {
    const [copiedKey, setCopiedKey] = useState<string | null>(null);

    const copy = useCallback(
        async (text: string, key = "default") => {
            if (!text) return false;
            try {
                await navigator.clipboard.writeText(text);
                setCopiedKey(key);
                setTimeout(() => {
                    setCopiedKey((curr) => (curr === key ? null : curr));
                }, timeout);
                return true;
            } catch {
                return false;
            }
        },
        [timeout],
    );

    const isCopied = useCallback(
        (key = "default") => copiedKey === key,
        [copiedKey],
    );

    return { copy, isCopied };
}
