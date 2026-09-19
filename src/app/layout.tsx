import type { Metadata } from "next";
import { Geist, Geist_Mono, JetBrains_Mono } from "next/font/google";
import { ThemeProvider } from "@/providers/theme";
import { ThemeScript } from "@/providers/theme/theme-script";
import { cn } from "@/utils/cn";
import "./globals.css";

const jetbrainsMono = JetBrains_Mono({
    subsets: ["latin"],
    variable: "--font-mono",
});

const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

export const metadata: Metadata = {
    metadataBase: new URL(
        process.env.NEXT_PUBLIC_SITE_URL || "https://tools.eubyt.dev",
    ),
    title: {
        default: "tools.eubyt.dev — Developer Tools",
        template: "%s — tools.eubyt.dev",
    },
    description: "Developer utility tools.",
    icons: {
        icon: [
            { url: "/favicon.svg", type: "image/svg+xml" },
            { url: "/favicon.png", sizes: "32x32", type: "image/png" },
        ],
        apple: [
            { url: "/apple-icon.png", sizes: "180x180", type: "image/png" },
        ],
    },
};

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html
            lang="en"
            suppressHydrationWarning
            className={cn(
                "h-full",
                "antialiased",
                geistSans.variable,
                geistMono.variable,
                "font-mono",
                jetbrainsMono.variable,
            )}
        >
            <head>
                <ThemeScript />
            </head>
            <body className="relative flex min-h-full w-full flex-col overflow-x-hidden bg-background text-foreground selection:bg-foreground selection:text-background">
                <ThemeProvider>{children}</ThemeProvider>
            </body>
        </html>
    );
}
