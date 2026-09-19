"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ToolShell } from "./tool-shell";
import { computeHashes } from "@/lib/tools/hash";
import { useClipboard } from "@/hooks/use-clipboard";
import { useTranslations } from "@/providers/locale";

const HASH_ALGORITHMS = [
    { key: "md5", name: "MD5" },
    { key: "sha1", name: "SHA-1" },
    { key: "sha256", name: "SHA-256" },
    { key: "sha384", name: "SHA-384" },
    { key: "sha512", name: "SHA-512" },
] as const;

export function HashGenerator() {
    const t = useTranslations();
    const [input, setInput] = useState("Hello, World!");
    const [uppercase, setUppercase] = useState(false);
    const { copy, isCopied } = useClipboard();

    const hashes = useMemo(
        () => computeHashes(input, uppercase),
        [input, uppercase],
    );

    return (
        <ToolShell
            title={t("tools.hash-gen.name")}
            description={t("tools.hash-gen.desc")}
            actions={
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="xs"
                        onClick={() => setInput("Hello, World!")}
                    >
                        {t("common.sample")}
                    </Button>
                    <Button
                        variant="outline"
                        size="xs"
                        onClick={() => setInput("")}
                    >
                        {t("common.clear")}
                    </Button>
                </div>
            }
        >
            <div className="flex flex-col gap-5">
                {/* Input Area */}
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between">
                        <label className="font-mono text-xs font-medium text-foreground">
                            {t("common.input")}
                        </label>
                        <div className="flex items-center gap-3">
                            <span className="font-mono text-[0.6875rem] text-muted-foreground">
                                {new TextEncoder().encode(input).length}{" "}
                                {t("common.bytes")} • {input.length}{" "}
                                {t("common.characters")}
                            </span>
                            <label className="flex items-center gap-1.5 cursor-pointer font-mono text-xs text-muted-foreground select-none">
                                <input
                                    type="checkbox"
                                    checked={uppercase}
                                    onChange={(e) =>
                                        setUppercase(e.target.checked)
                                    }
                                    className="accent-primary"
                                />
                                <span>{t("common.uppercase")}</span>
                            </label>
                        </div>
                    </div>
                    <Textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={t("tools.hash-gen.inputPlaceholder")}
                        className="min-h-[100px]"
                    />
                </div>

                {/* Calculated Hashes */}
                <div className="flex flex-col gap-1.5 font-mono">
                    {HASH_ALGORITHMS.map(({ key, name }) => {
                        const hashValue = hashes[key];

                        return (
                            <div
                                key={key}
                                className="flex items-start justify-between gap-3 rounded-sm bg-muted/20 px-3 py-2 text-xs text-foreground transition-colors hover:bg-muted"
                            >
                                <div className="flex min-w-0 flex-1 items-start gap-2">
                                    <span className="w-[4.75rem] shrink-0 pt-0.5 font-semibold">
                                        {name}
                                    </span>
                                    <span className="min-w-0 flex-1 break-all select-all text-muted-foreground">
                                        {hashValue || "—"}
                                    </span>
                                </div>
                                <Button
                                    variant="outline"
                                    size="xs"
                                    disabled={!hashValue}
                                    onClick={() => copy(hashValue, key)}
                                    className="h-6.5 shrink-0 gap-1.5 px-2.5"
                                >
                                    {isCopied(key)
                                        ? t("common.copied")
                                        : t("common.copy")}
                                </Button>
                            </div>
                        );
                    })}
                </div>
            </div>
        </ToolShell>
    );
}
