"use client";

import { useSyncExternalStore } from "react";
import { LuSearch } from "react-icons/lu";
import { useTranslations } from "@/providers/locale";
import { cn } from "@/utils/cn";
import { useSearch } from "./search-provider";

type SearchTriggerProps = {
    className?: string;
    /** Compact header control vs full-width home trigger */
    variant?: "header" | "bar";
};

const subscribe = () => () => {};

function ShortcutHint({ className }: { className?: string }) {
    const isMac = useSyncExternalStore(
        subscribe,
        () => /mac|iphone|ipad|ipod/i.test(navigator.userAgent),
        () => false,
    );

    return (
        <span
            className={cn(
                "inline-flex items-center gap-1 select-none",
                className,
            )}
            aria-hidden
        >
            {isMac ? (
                <span className="text-[1.25rem] leading-none">⌘</span>
            ) : (
                <span className="text-sm leading-none tracking-wide">Ctrl</span>
            )}
            <span className="text-base leading-none font-medium">K</span>
        </span>
    );
}

export function SearchTrigger({
    className,
    variant = "header",
}: SearchTriggerProps) {
    const t = useTranslations();
    const { setOpen } = useSearch();

    if (variant === "bar") {
        return (
            <button
                type="button"
                onClick={() => setOpen(true)}
                className={cn(
                    "relative flex h-10 w-full items-center gap-2 rounded-sm bg-muted/50 px-3 text-left text-xs text-muted-foreground transition-colors",
                    "hover:bg-muted hover:text-foreground",
                    "focus-visible:bg-muted focus-visible:text-foreground focus-visible:outline-none",
                    className,
                )}
            >
                <LuSearch className="size-3.5 shrink-0" />
                <span className="flex-1 truncate">{t("header.search")}</span>
                <ShortcutHint className="hidden text-muted-foreground sm:inline-flex" />
            </button>
        );
    }

    return (
        <button
            type="button"
            onClick={() => setOpen(true)}
            title={t("search.open")}
            aria-label={t("search.open")}
            className={cn(
                "inline-flex h-11 items-center rounded-sm px-2 text-muted-foreground transition-colors",
                "hover:bg-muted hover:text-foreground dark:hover:bg-muted/50",
                "focus-visible:bg-muted focus-visible:text-foreground focus-visible:outline-none",
                className,
            )}
        >
            <ShortcutHint />
        </button>
    );
}
