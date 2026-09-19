"use client";

import { useCallback, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Command } from "cmdk";
import { LuCornerDownLeft, LuSearch } from "react-icons/lu";
import { TOOLS, TOOL_CATEGORIES, type ToolCategory } from "@/config/tools";
import { useLocale, useTranslations } from "@/providers/locale";
import { cn } from "@/utils/cn";

type CommandMenuProps = {
    open: boolean;
    onOpenChange: (open: boolean) => void;
};

export function CommandMenu({ open, onOpenChange }: CommandMenuProps) {
    const t = useTranslations();
    const { locale } = useLocale();
    const router = useRouter();
    const [query, setQuery] = useState("");
    const [prevOpen, setPrevOpen] = useState(open);

    if (open !== prevOpen) {
        setPrevOpen(open);
        if (!open) {
            setQuery("");
        }
    }

    const goToTool = useCallback(
        (toolId: string) => {
            onOpenChange(false);
            router.push(`/${locale}/tools/${toolId}`);
        },
        [locale, onOpenChange, router],
    );

    const grouped = useMemo(() => {
        const cats = TOOL_CATEGORIES.filter(
            (c): c is { id: ToolCategory; labelKey: string } => c.id !== "all",
        );
        return cats
            .map((cat) => ({
                ...cat,
                tools: TOOLS.filter((tool) => tool.category === cat.id),
            }))
            .filter((g) => g.tools.length > 0);
    }, []);

    return (
        <Command.Dialog
            open={open}
            onOpenChange={onOpenChange}
            label={t("search.commandLabel")}
            overlayClassName="fixed inset-0 z-50 bg-background/70 backdrop-blur-[2px]"
            contentClassName={cn(
                "fixed top-[18%] left-1/2 z-50 w-[min(100%-1.5rem,32rem)] -translate-x-1/2",
                "overflow-hidden rounded-sm bg-popover text-popover-foreground shadow-lg ring-1 ring-border/60",
                "font-mono outline-none",
            )}
        >
            <div className="flex items-center gap-2 px-3">
                <LuSearch className="size-3.5 shrink-0 text-muted-foreground" />
                <Command.Input
                    value={query}
                    onValueChange={setQuery}
                    placeholder={t("search.placeholder")}
                    className="h-11 w-full bg-transparent text-xs outline-none placeholder:text-muted-foreground"
                />
            </div>

            <Command.List className="max-h-[min(50vh,22rem)] overflow-y-auto overscroll-contain p-1.5">
                <Command.Empty className="px-3 py-8 text-center text-xs text-muted-foreground">
                    {t("common.searchEmpty", { query })}
                </Command.Empty>

                {grouped.map((group) => (
                    <Command.Group
                        key={group.id}
                        heading={t(group.labelKey)}
                        className="[&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-[0.625rem] [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group-heading]]:tracking-wide [&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:uppercase"
                    >
                        {group.tools.map((tool) => {
                            const title = t(tool.titleKey);
                            const desc = t(tool.descKey);

                            return (
                                <Command.Item
                                    key={tool.id}
                                    value={title}
                                    keywords={[tool.id, desc, ...tool.keywords]}
                                    onSelect={() => goToTool(tool.id)}
                                    className={cn(
                                        "flex cursor-pointer items-center justify-between gap-3 px-2 py-2 text-xs outline-none select-none",
                                        "data-[selected=true]:bg-muted data-[selected=true]:text-foreground",
                                    )}
                                >
                                    <div className="flex min-w-0 flex-col gap-0.5">
                                        <span className="truncate font-semibold">
                                            {title}
                                        </span>
                                        <span className="truncate text-[0.6875rem] text-muted-foreground">
                                            {desc}
                                        </span>
                                    </div>
                                    <div className="flex shrink-0 items-center gap-2">
                                        {tool.badge ? (
                                            <span className="hidden text-[0.625rem] text-muted-foreground sm:inline">
                                                {tool.badge}
                                            </span>
                                        ) : null}
                                        <LuCornerDownLeft className="size-3 opacity-0 text-muted-foreground [[data-selected=true]_&]:opacity-100" />
                                    </div>
                                </Command.Item>
                            );
                        })}
                    </Command.Group>
                ))}
            </Command.List>

            <div className="flex items-center justify-between px-3 py-2 text-[0.625rem] text-muted-foreground">
                <span>{t("search.hint")}</span>
                <span className="text-[0.6875rem] tracking-wide">esc</span>
            </div>
        </Command.Dialog>
    );
}
