"use client";

import { usePathname, useRouter } from "next/navigation";
import { useState, type ReactNode } from "react";
import { LuCheck, LuChevronDown, LuLanguages } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/components/ui/popover";
import {
    LOCALES,
    resolveBrowserLocale,
    swapLocale,
    type Locale,
} from "@/lib/locale";
import { useLocale } from "@/providers/locale";
import { cn } from "@/utils/cn";

type LanguageToggleProps = {
    className?: string;
};

function OptionButton({
    selected,
    onSelect,
    children,
    className,
}: {
    selected: boolean;
    onSelect: () => void;
    children: ReactNode;
    className?: string;
}) {
    return (
        <button
            type="button"
            role="option"
            aria-selected={selected}
            onClick={onSelect}
            className={cn(
                "flex w-full cursor-pointer items-start gap-2 rounded-sm px-2 py-2.5 text-left font-mono text-xs font-medium text-foreground transition-colors hover:bg-muted",
                className,
            )}
        >
            <span className="min-w-0 flex-1">{children}</span>
            <span className="mt-0.5 flex size-3.5 shrink-0 items-center justify-center">
                {selected ? <LuCheck aria-hidden className="size-3.5" /> : null}
            </span>
        </button>
    );
}

export function LanguageToggle({ className }: LanguageToggleProps) {
    const { locale, t } = useLocale();
    const pathname = usePathname();
    const router = useRouter();
    const [open, setOpen] = useState(false);
    const browserLocale = resolveBrowserLocale();

    const select = (next: Locale) => {
        if (next !== locale) {
            router.push(swapLocale(pathname, next));
        }
        setOpen(false);
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger
                render={
                    <Button
                        type="button"
                        variant="ghost"
                        className={cn(
                            "h-11 cursor-pointer gap-1 rounded-sm bg-transparent px-2 font-mono text-xs font-medium text-muted-foreground hover:bg-muted hover:text-foreground dark:hover:bg-muted/50",
                            className,
                        )}
                        aria-label={t("language.openMenu")}
                    />
                }
            >
                <LuLanguages aria-hidden className="size-3.5 shrink-0" />
                <span className="tabular-nums">
                    {t(`language.code.${locale}`)}
                </span>
                <LuChevronDown
                    aria-hidden
                    className={cn(
                        "size-3 shrink-0 opacity-70 transition-transform duration-150",
                        open && "rotate-180",
                    )}
                />
            </PopoverTrigger>
            <PopoverContent
                align="end"
                sideOffset={8}
                className="w-56 gap-0.5 rounded-sm p-1.5 font-mono text-xs"
            >
                <p className="px-2 pb-1.5 pt-1.5 text-caption text-muted-foreground">
                    {t("language.label")}
                </p>

                <div role="listbox" aria-label={t("language.label")}>
                    <OptionButton
                        selected={locale === browserLocale}
                        onSelect={() => select(browserLocale)}
                        className="items-center"
                    >
                        <span className="flex flex-col gap-0.5">
                            <span className="font-medium leading-tight">
                                {t("language.automatic")}
                            </span>
                            <span className="text-[0.55rem] font-normal leading-snug whitespace-nowrap text-muted-foreground">
                                {t("language.browserLanguage", {
                                    language:
                                        browserLocale === "en"
                                            ? t("language.english")
                                            : t("language.portuguese"),
                                })}
                            </span>
                        </span>
                    </OptionButton>

                    <div aria-hidden className="mx-1.5 my-1.5 h-px bg-border" />

                    {LOCALES.map((item) => (
                        <OptionButton
                            key={item}
                            selected={locale === item}
                            onSelect={() => select(item)}
                        >
                            {item === "en"
                                ? t("language.english")
                                : t("language.portuguese")}
                        </OptionButton>
                    ))}
                </div>
            </PopoverContent>
        </Popover>
    );
}
