"use client";

import Link from "next/link";
import { LuArrowLeft } from "react-icons/lu";
import { buttonVariants } from "@/components/ui/button";
import { useLocale } from "@/providers/locale";
import { cn } from "@/utils/cn";

export function NotFoundView() {
    const { locale, t } = useLocale();

    return (
        <div className="flex min-h-[min(70vh,36rem)] w-full flex-col items-center justify-center gap-6 py-16 text-center font-mono">
            <p
                aria-hidden
                className="select-none text-[4.5rem] leading-none font-semibold tracking-tighter text-muted-foreground/25 sm:text-[6rem]"
            >
                {t("notFound.code")}
            </p>

            <div className="flex max-w-sm flex-col items-center gap-2">
                <h1 className="text-base font-semibold tracking-tight text-foreground">
                    {t("notFound.title")}
                </h1>
                <p className="text-xs leading-relaxed text-muted-foreground">
                    {t("notFound.description")}
                </p>
            </div>

            <Link
                href={`/${locale}`}
                className={cn(
                    buttonVariants({ variant: "outline", size: "xs" }),
                    "gap-1.5",
                )}
            >
                <LuArrowLeft className="size-3.5" />
                {t("notFound.home")}
            </Link>
        </div>
    );
}
