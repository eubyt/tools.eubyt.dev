import { cn } from "@/utils/cn";

/** Offset to the folio vertical guides (`--folio-outset` outside the column). */
const guideX =
    "left-[calc(-1*var(--folio-outset))] right-auto -translate-x-1/2";
const guideXRight =
    "right-[calc(-1*var(--folio-outset))] left-auto translate-x-1/2";

const corners = {
    "top-left": `top-0 -translate-y-1/2 ${guideX}`,
    "top-right": `top-0 -translate-y-1/2 ${guideXRight}`,
    "bottom-left": `bottom-0 translate-y-1/2 ${guideX}`,
    "bottom-right": `bottom-0 translate-y-1/2 ${guideXRight}`,
    "mid-left": `top-1/2 -translate-y-1/2 ${guideX}`,
    "mid-right": `top-1/2 -translate-y-1/2 ${guideXRight}`,
} as const;

export type GridIntersectionCorner = keyof typeof corners;

type GridIntersectionProps = {
    corner?: GridIntersectionCorner;
    className?: string;
};

export function GridIntersection({ corner, className }: GridIntersectionProps) {
    return (
        <div
            aria-hidden
            className={cn(
                "grid-intersection hidden sm:block",
                corner && corners[corner],
                className,
            )}
        />
    );
}
