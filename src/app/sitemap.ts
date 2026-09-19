import type { MetadataRoute } from "next";
import { TOOLS } from "@/config/tools";
import { LOCALES } from "@/lib/locale";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://tools.eubyt.dev";

export default function sitemap(): MetadataRoute.Sitemap {
    const lastModified = new Date();

    const homeEntries: MetadataRoute.Sitemap = LOCALES.map((locale) => ({
        url: `${BASE_URL}/${locale}`,
        lastModified,
        changeFrequency: "weekly",
        priority: 1.0,
        alternates: {
            languages: Object.fromEntries(
                LOCALES.map((l) => [l, `${BASE_URL}/${l}`]),
            ),
        },
    }));

    const toolEntries: MetadataRoute.Sitemap = LOCALES.flatMap((locale) =>
        TOOLS.map((tool) => ({
            url: `${BASE_URL}/${locale}/tools/${tool.id}`,
            lastModified,
            changeFrequency: "monthly",
            priority: 0.8,
            alternates: {
                languages: Object.fromEntries(
                    LOCALES.map((l) => [
                        l,
                        `${BASE_URL}/${l}/tools/${tool.id}`,
                    ]),
                ),
            },
        })),
    );

    return [...homeEntries, ...toolEntries];
}
