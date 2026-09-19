import Script from "next/script";
import { themeInitScript } from "@/lib/theme";

export function ThemeScript() {
    return (
        <Script
            id="theme-init"
            strategy="beforeInteractive"
            data-cfasync="false"
            dangerouslySetInnerHTML={{ __html: themeInitScript }}
        />
    );
}
