"use client";

import { useSyncExternalStore } from "react";
import { LuMonitor, LuMoon } from "react-icons/lu";
import { SunIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import { cycleTheme, withViewTransition } from "@/lib/theme";
import { useLocale } from "@/providers/locale";
import { useTheme } from "@/providers/theme";
import { cn } from "@/utils/cn";

const icons = {
    light: { Icon: SunIcon, className: "theme-toggle-sun" },
    dark: { Icon: LuMoon, className: "theme-toggle-moon" },
    system: { Icon: LuMonitor, className: "theme-toggle-system" },
} as const;

const emptySubscribe = () => () => {};

type ThemeToggleProps = {
    className?: string;
};

export function ThemeToggle({ className }: ThemeToggleProps) {
    const { theme, setTheme } = useTheme();
    const { t } = useLocale();
    const mounted = useSyncExternalStore(
        emptySubscribe,
        () => true,
        () => false,
    );

    const current = icons[theme];
    const Icon = current.Icon;
    const themeName = t(`theme.${theme}`);
    const label = mounted
        ? t("theme.current", { theme: themeName })
        : t("theme.toggle");

    const handleThemeChange = () => {
        withViewTransition(() => {
            setTheme(cycleTheme(theme));
        });
    };

    return (
        <Tooltip>
            <TooltipTrigger
                render={
                    <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className={cn(
                            "size-11 cursor-pointer bg-transparent hover:bg-transparent dark:hover:bg-transparent",
                            className,
                        )}
                        aria-label={label}
                        onClick={handleThemeChange}
                    />
                }
            >
                <span
                    key={mounted ? theme : "pending"}
                    className="inline-flex animate-in fade-in zoom-in-95 duration-200 motion-reduce:animate-none"
                    aria-hidden
                >
                    {mounted ? (
                        <Icon
                            className={`theme-toggle-icon ${current.className}`}
                        />
                    ) : (
                        <SunIcon className="theme-toggle-icon" />
                    )}
                </span>
            </TooltipTrigger>
            <TooltipContent side="left">{label}</TooltipContent>
        </Tooltip>
    );
}
