import type { MetadataRoute } from "next";
import { TOOLS } from "@/config/tools";
import { LOCALES } from "@/lib/locale";
import { siteOrigin } from "@/lib/site/origin";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const origin = await siteOrigin();
    const lastModified = new Date();

    const homeEntries: MetadataRoute.Sitemap = LOCALES.map((locale) => ({
        url: `${origin}/${locale}`,
        lastModified,
        changeFrequency: "weekly",
        priority: 1.0,
    }));

    const toolEntries: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
        TOOLS.map((tool) => ({
            url: `${origin}/${locale}/tools/${tool.id}`,
            lastModified,
            changeFrequency: "monthly",
            priority: 0.8,
        })),
    );

    return [...homeEntries, ...toolEntries];
}
