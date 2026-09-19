"use client";

import { useState, useMemo, useSyncExternalStore } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToolShell } from "./tool-shell";
import { generateUuids, type UuidVersion } from "@/lib/tools/uuid";
import { useClipboard } from "@/hooks/use-clipboard";
import { useTranslations } from "@/providers/locale";

const emptySubscribe = () => () => {};

export function UuidTool() {
    const t = useTranslations();
    const [version, setVersion] = useState<UuidVersion>("v4");
    const [count, setCount] = useState(5);
    const [hyphens, setHyphens] = useState(true);
    const [uppercase, setUppercase] = useState(false);
    const [seed, setSeed] = useState(0);
    const { copy, isCopied } = useClipboard();
    const mounted = useSyncExternalStore(
        emptySubscribe,
        () => true,
        () => false,
    );

    const uuids = useMemo(() => {
        if (!mounted) return [];
        void seed;
        return generateUuids({ version, count, hyphens, uppercase });
    }, [mounted, version, count, hyphens, uppercase, seed]);

    const generate = () => {
        setSeed((s) => s + 1);
    };

    const handleCopyAll = () => {
        copy(uuids.join("\n"), "all-uuids");
    };

    return (
        <ToolShell
            title={t("tools.uuid.name")}
            description={t("tools.uuid.desc")}
            actions={
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="xs" onClick={generate}>
                        {t("tools.uuid.generate")}
                    </Button>
                    <Button variant="outline" size="xs" onClick={handleCopyAll}>
                        {isCopied("all-uuids")
                            ? t("common.copied")
                            : t("tools.uuid.copyAll")}
                    </Button>
                </div>
            }
        >
            <div className="flex flex-col gap-4 font-mono">
                {/* Version Selector & Options */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3">
                    <div className="flex items-center gap-1">
                        {(["v4", "v7", "v1"] as const).map((ver) => (
                            <Button
                                key={ver}
                                variant={
                                    version === ver ? "default" : "outline"
                                }
                                size="xs"
                                onClick={() => setVersion(ver)}
                            >
                                UUID {ver.toUpperCase()}
                            </Button>
                        ))}
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-xs">
                        <label className="flex items-center gap-1.5 cursor-pointer text-muted-foreground select-none">
                            <input
                                type="checkbox"
                                checked={hyphens}
                                onChange={(e) => setHyphens(e.target.checked)}
                                className="accent-primary"
                            />
                            <span>{t("tools.uuid.hyphens")}</span>
                        </label>

                        <label className="flex items-center gap-1.5 cursor-pointer text-muted-foreground select-none">
                            <input
                                type="checkbox"
                                checked={uppercase}
                                onChange={(e) => setUppercase(e.target.checked)}
                                className="accent-primary"
                            />
                            <span>{t("tools.uuid.uppercase")}</span>
                        </label>

                        <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">
                                {t("tools.uuid.count")}:
                            </span>
                            <Input
                                type="number"
                                min={1}
                                max={100}
                                value={count}
                                onChange={(e) => {
                                    const raw = e.target.value;
                                    if (raw === "") {
                                        setCount(1);
                                        return;
                                    }
                                    const val = parseInt(raw, 10);
                                    if (!isNaN(val)) {
                                        setCount(
                                            Math.max(1, Math.min(100, val)),
                                        );
                                    }
                                }}
                                className="w-16 font-mono text-center"
                            />
                        </div>
                    </div>
                </div>

                {/* UUID List */}
                <div className="flex flex-col gap-1.5">
                    {uuids.map((id, idx) => (
                        <div
                            key={idx}
                            className="flex items-center justify-between gap-3 rounded-sm bg-muted/20 px-3 py-2 text-xs text-foreground transition-colors hover:bg-muted"
                        >
                            <span className="select-all font-mono">{id}</span>
                            <Button
                                variant="outline"
                                size="xs"
                                onClick={() => copy(id, `uuid-${idx}`)}
                                className="h-6.5 gap-1.5 px-2.5"
                            >
                                {isCopied(`uuid-${idx}`)
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
