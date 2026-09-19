"use client";

import type { ReactNode } from "react";

type ToolShellProps = {
    title: string;
    description: string;
    actions?: ReactNode;
    children: ReactNode;
};

export function ToolShell({
    title,
    description,
    actions,
    children,
}: ToolShellProps) {
    return (
        <section className="flex flex-col w-full gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-1">
                <div className="flex flex-col gap-1">
                    <h1 className="font-mono text-base font-semibold tracking-tight text-foreground">
                        {title}
                    </h1>
                    <p className="font-mono text-xs text-muted-foreground">
                        {description}
                    </p>
                </div>
                {actions && (
                    <div className="flex items-center gap-1.5 shrink-0 self-start sm:self-auto">
                        {actions}
                    </div>
                )}
            </div>

            <div className="w-full">{children}</div>
        </section>
    );
}
