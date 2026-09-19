"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ToolShell } from "./tool-shell";
import {
    formatJson,
    validateJson,
    type JsonIndent,
} from "@/lib/tools/json-utils";
import { useClipboard } from "@/hooks/use-clipboard";
import { useTranslations } from "@/providers/locale";

const SAMPLE_JSON = JSON.stringify(
    {
        name: "tools.eubyt.dev",
        version: "1.0.0",
        features: ["hashes", "json", "jwt", "crypto"],
        settings: { clientOnly: true, fast: true },
    },
    null,
    2,
);

export function JsonFormatterTool() {
    const t = useTranslations();
    const [input, setInput] = useState(SAMPLE_JSON);
    const [indent, setIndent] = useState<JsonIndent>("2");
    const { copy, isCopied } = useClipboard();

    const validation = validateJson(input);
    let formatted = "";
    if (validation.valid && input.trim()) {
        try {
            formatted = formatJson(input, indent);
        } catch {
            formatted = "";
        }
    }

    const handleApplyFormat = () => {
        if (formatted) {
            setInput(formatted);
        }
    };

    return (
        <ToolShell
            title={t("tools.json-formatter.name")}
            description={t("tools.json-formatter.desc")}
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
                        onClick={() => setInput("")}
                    >
                        {t("common.clear")}
                    </Button>
                </div>
            }
        >
            <div className="flex flex-col gap-4 font-mono">
                {/* Options Toolbar */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3">
                    <div className="flex items-center gap-2 text-xs">
                        <span className="text-muted-foreground">
                            {t("tools.json-formatter.indent")}:
                        </span>
                        {(["2", "4", "tab"] as const).map((opt) => (
                            <Button
                                key={opt}
                                variant={indent === opt ? "default" : "outline"}
                                size="xs"
                                onClick={() => setIndent(opt)}
                            >
                                {opt === "2"
                                    ? t("tools.json-formatter.spaces2")
                                    : opt === "4"
                                      ? t("tools.json-formatter.spaces4")
                                      : t("tools.json-formatter.tabs")}
                            </Button>
                        ))}
                    </div>

                    <div className="flex items-center gap-2">
                        {input.trim() ? (
                            validation.valid ? (
                                <Badge variant="success">
                                    {t("common.valid")}
                                </Badge>
                            ) : (
                                <Badge variant="destructive">
                                    {t("common.invalid")}{" "}
                                    {validation.line
                                        ? `(L${validation.line}:C${validation.column})`
                                        : ""}
                                </Badge>
                            )
                        ) : null}
                        <Button
                            variant="secondary"
                            size="xs"
                            disabled={!validation.valid || !input.trim()}
                            onClick={handleApplyFormat}
                        >
                            {t("common.format")}
                        </Button>
                    </div>
                </div>

                {/* Editor & Output Grid */}
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
                            placeholder={t("tools.json-formatter.placeholder")}
                            className="min-h-[300px]"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <div className="flex h-6.5 items-center justify-between text-xs">
                            <span className="font-medium text-foreground">
                                {t("common.output")}
                            </span>
                            <Button
                                variant="outline"
                                size="xs"
                                disabled={!formatted}
                                onClick={() => copy(formatted, "fmt-out")}
                                className="h-6.5 gap-1.5 px-2.5"
                            >
                                {isCopied("fmt-out")
                                    ? t("common.copied")
                                    : t("common.copy")}
                            </Button>
                        </div>
                        {!validation.valid && input.trim() ? (
                            <div className="min-h-[300px] rounded-sm border border-destructive/40 bg-destructive/5 p-3 text-xs text-destructive">
                                <p className="font-semibold">
                                    {t("common.error")}:
                                </p>
                                <p className="mt-1">{validation.error}</p>
                            </div>
                        ) : (
                            <Textarea
                                readOnly
                                value={formatted}
                                placeholder={t("common.output")}
                                className="min-h-[300px] bg-muted/20"
                            />
                        )}
                    </div>
                </div>
            </div>
        </ToolShell>
    );
}
