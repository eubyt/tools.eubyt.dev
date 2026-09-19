import { GridLineV } from "./grid-line-v";

/**
 * Full-height vertical guides, anchored to the folio column edges.
 * Must be rendered inside the `max-w-folio` container so they share
 * coordinates with {@link GridIntersection}.
 */
export function GridVerticalGuides() {
    return (
        <>
            <GridLineV className="top-0 bottom-0 left-[calc(-1*var(--folio-outset))] -translate-x-1/2" />
            <GridLineV className="top-0 bottom-0 right-[calc(-1*var(--folio-outset))] translate-x-1/2" />
        </>
    );
}
