import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { FolioShell } from "@/components/layout/folio-shell";
import { HomeView } from "@/components/home/home-view";
import { LOCALES, isLocale, messagesByLocale, translate } from "@/lib/locale";
import { siteOrigin } from "@/lib/site/origin";

export async function generateMetadata({
    params,
}: {
    params: Promise<{ locale: string }>;
}): Promise<Metadata> {
    const { locale: raw } = await params;
    if (!isLocale(raw)) return {};

    const origin = await siteOrigin();
    const messages = messagesByLocale[raw];
    return {
        title: translate(messages, "meta.title"),
        description: translate(messages, "meta.description"),
        alternates: {
            languages: Object.fromEntries(
                LOCALES.map((l) => [l, `${origin}/${l}`]),
            ),
        },
    };
}

export default async function HomePage({
    params,
}: {
    params: Promise<{ locale: string }>;
}) {
    const { locale } = await params;
    if (!isLocale(locale)) notFound();

    return (
        <FolioShell>
            <HomeView />
        </FolioShell>
    );
}
