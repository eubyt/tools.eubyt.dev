"use client";

import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useMemo,
    useState,
    type ReactNode,
} from "react";
import { CommandMenu } from "./command-menu";

type SearchContextValue = {
    open: boolean;
    setOpen: (open: boolean) => void;
    toggle: () => void;
};

const SearchContext = createContext<SearchContextValue | null>(null);

export function SearchProvider({ children }: { children: ReactNode }) {
    const [open, setOpen] = useState(false);

    const toggle = useCallback(() => setOpen((prev) => !prev), []);

    useEffect(() => {
        const onKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
                e.preventDefault();
                toggle();
            }
        };
        window.addEventListener("keydown", onKeyDown);
        return () => window.removeEventListener("keydown", onKeyDown);
    }, [toggle]);

    const value = useMemo(() => ({ open, setOpen, toggle }), [open, toggle]);

    return (
        <SearchContext.Provider value={value}>
            {children}
            <CommandMenu open={open} onOpenChange={setOpen} />
        </SearchContext.Provider>
    );
}

export function useSearch() {
    const context = useContext(SearchContext);
    if (!context) {
        throw new Error("useSearch must be used within SearchProvider");
    }
    return context;
}
