import { cn } from "@/utils/cn";

type GridLineVProps = {
    className?: string;
};

export function GridLineV({ className }: GridLineVProps) {
    return (
        <div
            aria-hidden
            className={cn("grid-line-v hidden sm:block", className)}
        />
    );
}
