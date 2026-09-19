"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { SearchTrigger } from "@/components/search";
import { ToolCard } from "./tool-card";
import { TOOLS, TOOL_CATEGORIES, type ToolCategory } from "@/config/tools";
import { useTranslations } from "@/providers/locale";

export function HomeView() {
    const t = useTranslations();
    const [selectedCategory, setSelectedCategory] = useState<
        "all" | ToolCategory
    >("all");

    const filteredTools = useMemo(() => {
        return TOOLS.filter(
            (tool) =>
                selectedCategory === "all" ||
                tool.category === selectedCategory,
        );
    }, [selectedCategory]);

    return (
        <div className="flex w-full flex-col gap-6 font-mono">
            <div className="flex flex-col gap-2 pt-2">
                <h1 className="text-base font-semibold tracking-tight text-foreground">
                    {t("header.tagline")}
                </h1>
            </div>

            <div className="flex flex-col gap-3">
                <SearchTrigger variant="bar" />

                <div className="flex flex-wrap items-center gap-1.5 pt-1">
                    {TOOL_CATEGORIES.map(({ id, labelKey }, index) => (
                        <div key={id} className="contents">
                            {index === 1 ? (
                                <div
                                    aria-hidden
                                    className="mx-1 h-4 w-px shrink-0 bg-border"
                                />
                            ) : null}
                            <Button
                                variant={
                                    selectedCategory === id
                                        ? "default"
                                        : "ghost"
                                }
                                size="xs"
                                onClick={() => setSelectedCategory(id)}
                                className="rounded-sm text-xs"
                            >
                                {t(labelKey)}
                            </Button>
                        </div>
                    ))}
                    <span className="ml-auto self-center text-[0.6875rem] text-muted-foreground">
                        {filteredTools.length}{" "}
                        {filteredTools.length === 1 ? "tool" : "tools"}
                    </span>
                </div>
            </div>

            {filteredTools.length === 0 ? (
                <div className="flex flex-col items-center justify-center p-6 py-16 text-center">
                    <p className="text-xs text-muted-foreground">
                        {t("common.searchEmpty", { query: selectedCategory })}
                    </p>
                    <Button
                        variant="ghost"
                        size="xs"
                        onClick={() => setSelectedCategory("all")}
                        className="mt-3 text-xs"
                    >
                        Reset filters
                    </Button>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredTools.map((tool) => (
                        <ToolCard
                            key={tool.id}
                            tool={tool}
                            title={t(tool.titleKey)}
                            description={t(tool.descKey)}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
