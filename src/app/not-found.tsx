import { headers } from "next/headers";
import { FolioShell } from "@/components/layout/folio-shell";
import { NotFoundView } from "@/components/not-found/not-found-view";
import { Toaster } from "@/components/ui/toast";
import { TooltipProvider } from "@/components/ui/tooltip";
import { resolveBrowserLocale } from "@/lib/locale";
import { LocaleProvider } from "@/providers/locale";

export default async function RootNotFound() {
    const headerList = await headers();
    const locale = resolveBrowserLocale(
        headerList.get("accept-language")?.split(",")[0]?.trim() ?? "en",
    );

    return (
        <LocaleProvider locale={locale}>
            <TooltipProvider>
                <div className="relative z-10 flex min-h-full flex-1 flex-col">
                    <FolioShell>
                        <NotFoundView />
                    </FolioShell>
                </div>
                <Toaster />
            </TooltipProvider>
        </LocaleProvider>
    );
}
