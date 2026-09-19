import { headers } from "next/headers";

export async function siteOrigin(): Promise<string> {
    const h = await headers();
    const host = (h.get("x-forwarded-host") ?? h.get("host"))
        ?.split(",")[0]
        ?.trim();

    if (!host) return "http://localhost:3000";

    const proto = (
        h.get("x-forwarded-proto") ??
        (host.includes("localhost") || host.startsWith("127.")
            ? "http"
            : "https")
    )
        .split(",")[0]!
        .trim();

    return `${proto}://${host}`;
}

export function originFromRequest(request: Request): string {
    return new URL(request.url).origin;
}
