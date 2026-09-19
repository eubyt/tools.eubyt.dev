"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ToolShell } from "./tool-shell";
import { minifyJson, validateJson } from "@/lib/tools/json-utils";
import { useClipboard } from "@/hooks/use-clipboard";
import { useTranslations } from "@/providers/locale";

const SAMPLE_JSON = `{\n  "app": "tools.eubyt.dev",\n  "status": "active",\n  "features": [\n    "json",\n    "hash",\n    "jwt"\n  ]\n}`;

export function JsonMinifierTool() {
    const t = useTranslations();
    const [input, setInput] = useState(SAMPLE_JSON);
    const { copy, isCopied } = useClipboard();

    const validation = validateJson(input);
    let minified = "";
    if (validation.valid && input.trim()) {
        try {
            minified = minifyJson(input);
        } catch {
            minified = "";
        }
    }

    return (
        <ToolShell
            title={t("tools.json-minifier.name")}
            description={t("tools.json-minifier.desc")}
            actions={
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="xs"
                        onClick={() => setInput(SAMPLE_JSON)}
                    >
                        {t("common.sample")}
                    </Button>
                    <Button
                        variant="outline"
                        size="xs"
                        disabled={!minified}
                        onClick={() => copy(minified, "mini-out")}
                    >
                        {isCopied("mini-out")
                            ? t("common.copied")
                            : t("common.copy")}
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
            <div className="flex flex-col gap-4 font-mono">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                        <div className="flex h-6.5 items-center">
                            <span className="text-xs font-medium text-foreground">
                                {t("common.input")}
                            </span>
                        </div>
                        <Textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={t("tools.json-minifier.placeholder")}
                            className="min-h-[260px]"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <div className="flex h-6.5 items-center">
                            <span className="text-xs font-medium text-foreground">
                                {t("common.output")}
                            </span>
                        </div>
                        {!validation.valid && input.trim() ? (
                            <div className="min-h-[260px] rounded-sm border border-destructive/40 bg-destructive/5 p-3 text-xs text-destructive">
                                <p className="font-semibold">
                                    {t("common.error")}:
                                </p>
                                <p className="mt-1">{validation.error}</p>
                            </div>
                        ) : (
                            <Textarea
                                readOnly
                                value={minified}
                                placeholder={t("common.output")}
                                className="min-h-[260px] bg-muted/20"
                            />
                        )}
                    </div>
                </div>
            </div>
        </ToolShell>
    );
}
