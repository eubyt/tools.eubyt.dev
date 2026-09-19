"use client";

import Link from "next/link";
import { LuArrowUpRight } from "react-icons/lu";
import type { ToolItem } from "@/config/tools";
import { useLocale } from "@/providers/locale";

type ToolCardProps = {
    tool: ToolItem;
    title: string;
    description: string;
};

export function ToolCard({ tool, title, description }: ToolCardProps) {
    const { locale } = useLocale();

    return (
        <Link
            href={`/${locale}/tools/${tool.id}`}
            className="group relative flex flex-col justify-between gap-2.5 rounded-none border border-border/70 p-3.5 transition-transform duration-200 hover:scale-[1.02] focus-visible:scale-[1.02] focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring/50"
        >
            <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                        {title}
                    </span>
                </div>
                <p className="font-mono text-[0.6875rem] leading-relaxed text-muted-foreground line-clamp-2">
                    {description}
                </p>
            </div>

            <div className="flex items-center justify-end pt-1">
                <span className="flex size-5 items-center justify-center text-muted-foreground/50 transition-colors group-hover:text-foreground">
                    <LuArrowUpRight className="size-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
            </div>
        </Link>
    );
}
