"use client";

import { useState, useMemo, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToolShell } from "./tool-shell";
import { generateRandomToken, type RandomTokenType } from "@/lib/tools/crypto";
import { useClipboard } from "@/hooks/use-clipboard";
import { useTranslations } from "@/providers/locale";

const emptySubscribe = () => () => {};

export function RandomHashTool() {
    const t = useTranslations();
    const [format, setFormat] = useState<RandomTokenType>("hex");
    const [length, setLength] = useState(32);
    const [count, setCount] = useState(5);
    const [prefix, setPrefix] = useState("sk_live_");
    const [seed, setSeed] = useState(0);
    const { copy, isCopied } = useClipboard();
    const mounted = useSyncExternalStore(
        emptySubscribe,
        () => true,
        () => false,
    );

    const tokens = useMemo(() => {
        if (!mounted) return [];
        void seed;
        const list: string[] = [];
        for (let i = 0; i < count; i++) {
            list.push(generateRandomToken(length, format, prefix));
        }
        return list;
    }, [mounted, count, format, length, prefix, seed]);

    const generate = () => {
        setSeed((s) => s + 1);
    };

    const handleCopyAll = () => {
        copy(tokens.join("\n"), "all-tokens");
    };

    return (
        <ToolShell
            title={t("tools.random-hash.name")}
            description={t("tools.random-hash.desc")}
            actions={
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="xs" onClick={generate}>
                        {t("tools.random-hash.generate")}
                    </Button>
                    <Button variant="outline" size="xs" onClick={handleCopyAll}>
                        {isCopied("all-tokens")
                            ? t("common.copied")
                            : t("common.copyAll")}
                    </Button>
                </div>
            }
        >
            <div className="flex flex-col gap-4 font-mono">
                {/* Options Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3">
                    <div className="flex items-center gap-1">
                        {(["hex", "base64", "base62", "apiKey"] as const).map(
                            (fmt) => (
                                <Button
                                    key={fmt}
                                    variant={
                                        format === fmt ? "default" : "outline"
                                    }
                                    size="xs"
                                    onClick={() => setFormat(fmt)}
                                >
                                    {fmt === "hex"
                                        ? "Hex"
                                        : fmt === "base64"
                                          ? "Base64"
                                          : fmt === "base62"
                                            ? "Alphanumeric"
                                            : "API Key"}
                                </Button>
                            ),
                        )}
                    </div>

                    <div className="flex flex-wrap items-center gap-3 text-xs">
                        {format === "apiKey" && (
                            <div className="flex items-center gap-1.5">
                                <span className="text-muted-foreground">
                                    {t("tools.random-hash.prefix")}:
                                </span>
                                <Input
                                    type="text"
                                    value={prefix}
                                    onChange={(e) => setPrefix(e.target.value)}
                                    className="h-6 w-20 px-1 text-xs font-mono"
                                />
                            </div>
                        )}

                        <div className="flex items-center gap-1.5">
                            <span className="text-muted-foreground">
                                {t("tools.random-hash.length")}:
                            </span>
                            <Input
                                type="number"
                                min={8}
                                max={128}
                                value={length}
                                onChange={(e) =>
                                    setLength(
                                        Math.max(
                                            8,
                                            Math.min(
                                                128,
                                                parseInt(e.target.value) || 32,
                                            ),
                                        ),
                                    )
                                }
                                className="h-6 w-16 px-1 text-xs font-mono"
                            />
                        </div>

                        <div className="flex items-center gap-1.5">
                            <span className="text-muted-foreground">
                                {t("tools.random-hash.count")}:
                            </span>
                            <Input
                                type="number"
                                min={1}
                                max={50}
                                value={count}
                                onChange={(e) =>
                                    setCount(
                                        Math.max(
                                            1,
                                            Math.min(
                                                50,
                                                parseInt(e.target.value) || 5,
                                            ),
                                        ),
                                    )
                                }
                                className="h-6 w-14 px-1 text-xs font-mono"
                            />
                        </div>
                    </div>
                </div>

                {/* Tokens List */}
                <div className="flex flex-col gap-1.5">
                    {tokens.map((tok, idx) => (
                        <div
                            key={idx}
                            className="flex items-center justify-between gap-3 rounded-sm bg-muted/20 px-3 py-2 text-xs text-foreground transition-colors hover:bg-muted"
                        >
                            <span className="truncate select-all font-mono">
                                {tok}
                            </span>
                            <Button
                                variant="outline"
                                size="xs"
                                onClick={() => copy(tok, `tok-${idx}`)}
                                className="h-6.5 shrink-0 gap-1.5 px-2.5"
                            >
                                {isCopied(`tok-${idx}`)
                                    ? t("common.copied")
                                    : t("common.copy")}
                            </Button>
                        </div>
                    ))}
                </div>
            </div>
        </ToolShell>
    );
}
