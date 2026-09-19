import { notFound } from "next/navigation";
import { Toaster } from "@/components/ui/toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { LOCALES, isLocale } from "@/lib/locale";
import { LocaleProvider } from "@/providers/locale";

export function generateStaticParams() {
    return LOCALES.map((locale) => ({ locale }));
}

export default async function LocaleLayout({
    children,
    params,
}: {
    children: React.ReactNode;
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();

    return (
        <LocaleProvider locale={locale}>
            <TooltipProvider>
                <div className="relative z-10 flex min-h-full flex-1 flex-col">
                    {children}
                </div>
                <Toaster />
            </TooltipProvider>
        </LocaleProvider>
    );
}
