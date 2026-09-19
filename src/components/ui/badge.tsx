import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/utils/cn";

const badgeVariants = cva(
    "inline-flex items-center rounded-sm px-1.5 py-0.5 text-[0.625rem] font-medium uppercase tracking-wider select-none font-mono border transition-colors",
    {
        variants: {
            variant: {
                default: "border-border bg-muted/60 text-foreground",
                outline: "border-border text-muted-foreground",
                secondary:
                    "border-transparent bg-secondary text-secondary-foreground",
                success:
                    "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400",
                destructive:
                    "border-destructive/30 bg-destructive/10 text-destructive",
                accent: "border-border bg-primary/10 text-primary",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    },
);

export interface BadgeProps
    extends
        React.HTMLAttributes<HTMLDivElement>,
        VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    );
}

export { Badge, badgeVariants };
