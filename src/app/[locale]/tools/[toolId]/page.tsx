import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FolioShell } from "@/components/layout/folio-shell";
import { ToolRenderer } from "@/components/tools/tool-renderer";
import { TOOLS, getToolById } from "@/config/tools";
import { LOCALES, isLocale, messagesByLocale, translate } from "@/lib/locale";
import { siteOrigin } from "@/lib/site/origin";

export function generateStaticParams() {
    return LOCALES.flatMap((locale) =>
        TOOLS.map((tool) => ({
            locale,
            toolId: tool.id,
        })),
    );
}

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string; toolId: string }>;
}): Promise<Metadata> {
    const { locale: rawLocale, toolId } = await params;
    if (!isLocale(rawLocale)) return {};

    const tool = getToolById(toolId);
    if (!tool) return {};

    const origin = await siteOrigin();
    const messages = messagesByLocale[rawLocale];
    const title = translate(messages, tool.titleKey);
    const desc = translate(messages, tool.descKey);

    return {
        title: `${title} — tools.eubyt.dev`,
        description: desc,
        alternates: {
            languages: Object.fromEntries(
                LOCALES.map((l) => [l, `${origin}/${l}/tools/${toolId}`]),
            ),
        },
    };
}

export default async function ToolPage({
    params,
}: {
    params: Promise<{ locale: string; toolId: string }>;
}) {
    const { locale, toolId } = await params;
    if (!isLocale(locale)) notFound();

    const tool = getToolById(toolId);
    if (!tool) notFound();

    const messages = messagesByLocale[locale];
    const toolTitle = translate(messages, tool.titleKey);

    return (
        <FolioShell showBack currentToolTitle={toolTitle}>
            <ToolRenderer toolId={tool.id} />
        </FolioShell>
    );
}
