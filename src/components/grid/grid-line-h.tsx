import { cn } from "@/utils/cn";

type GridLineHProps = {
    className?: string;
};

export function GridLineH({ className }: GridLineHProps) {
    return <div aria-hidden className={cn("grid-line-h", className)} />;
}
