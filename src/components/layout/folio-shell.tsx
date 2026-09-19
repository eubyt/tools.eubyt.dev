"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { LuArrowLeft, LuTerminal } from "react-icons/lu";
import {
    GridIntersection,
    GridLineH,
    GridVerticalGuides,
} from "@/components/grid";
import { LanguageToggle } from "@/components/locale";
import { SearchProvider, SearchTrigger } from "@/components/search";
import { ThemeToggle } from "@/components/theme";
import { useLocale } from "@/providers/locale";

type FolioShellProps = {
    children: ReactNode;
    currentToolTitle?: string;
    showBack?: boolean;
};

export function FolioShell({
    children,
    currentToolTitle,
    showBack = false,
}: FolioShellProps) {
    const { locale, t } = useLocale();

    return (
        <SearchProvider>
            <div className="flex flex-1 justify-center px-4 sm:px-8">
                <div className="relative flex w-full max-w-folio flex-col self-stretch">
                    <GridVerticalGuides />
                    <div className="relative z-20 mt-4 flex w-full flex-col items-start sm:mt-10">
                        <div className="relative flex w-full flex-col gap-4 pt-6 pb-4 sm:pt-8 sm:pb-6">
                            <GridLineH className="top-0" />
                            <GridIntersection corner="top-left" />
                            <GridIntersection corner="top-right" />

                            {/* Top Navigation Bar */}
                            <header className="flex w-full items-center justify-between gap-3 pb-1">
                                <div className="flex min-w-0 items-center gap-3">
                                    {showBack ? (
                                        <Link
                                            href={`/${locale}`}
                                            className="group inline-flex items-center gap-1.5 font-mono text-xs font-medium text-muted-foreground transition-colors hover:text-foreground"
                                            title={t("header.back")}
                                        >
                                            <LuArrowLeft className="size-3.5 transition-transform group-hover:-translate-x-0.5" />
                                            <span>{t("header.back")}</span>
                                        </Link>
                                    ) : (
                                        <Link
                                            href={`/${locale}`}
                                            className="flex items-center gap-2 font-mono text-sm font-semibold tracking-tight text-foreground transition-opacity hover:opacity-80"
                                        >
                                            <span className="flex size-5 items-center justify-center rounded-sm bg-foreground text-[0.65rem] font-black text-background">
                                                <LuTerminal className="size-3" />
                                            </span>
                                            <span>tools.eubyt.dev</span>
                                        </Link>
                                    )}

                                    {currentToolTitle ? (
                                        <>
                                            <span className="text-muted-foreground/50">
                                                /
                                            </span>
                                            <span className="max-w-[200px] truncate font-mono text-xs font-semibold text-foreground sm:max-w-none">
                                                {currentToolTitle}
                                            </span>
                                        </>
                                    ) : null}
                                </div>

                                <div className="flex items-center gap-1">
                                    <SearchTrigger />
                                    <div
                                        aria-hidden
                                        className="mx-1 h-4 w-px shrink-0 bg-border"
                                    />
                                    <LanguageToggle />
                                    <div
                                        aria-hidden
                                        className="mx-1 h-4 w-px shrink-0 bg-border"
                                    />
                                    <ThemeToggle />
                                </div>
                            </header>

                            {/* Main Content */}
                            <main className="flex w-full flex-col pt-2">
                                {children}
                            </main>

                            {/* Footer */}
                            <footer className="relative mt-12 flex w-full items-center justify-between gap-4 pt-2 pb-8 font-mono text-[0.6875rem] text-muted-foreground">
                                <GridLineH className="top-0" />
                                <GridIntersection corner="top-left" />
                                <GridIntersection corner="top-right" />

                                <p>{t("footer.credit")}</p>
                            </footer>
                        </div>
                    </div>
                </div>
            </div>
        </SearchProvider>
    );
}
