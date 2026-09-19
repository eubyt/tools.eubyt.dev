"use client";

import { useState } from "react";
import { LuArrowDownUp } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ToolShell } from "./tool-shell";
import { urlEncode, urlDecode } from "@/lib/tools/converters";
import { useClipboard } from "@/hooks/use-clipboard";
import { useTranslations } from "@/providers/locale";

export function UrlEncodeTool() {
    const t = useTranslations();
    const [mode, setMode] = useState<"encode" | "decode">("encode");
    const [input, setInput] = useState(
        "https://tools.eubyt.dev/search?q=developer tools&lang=pt",
    );
    const [fullUri, setFullUri] = useState(true);
    const { copy, isCopied } = useClipboard();

    let output = "";
    let error = "";

    try {
        if (mode === "encode") {
            output = urlEncode(input, fullUri);
        } else {
            output = urlDecode(input);
        }
    } catch (err) {
        error = err instanceof Error ? err.message : "Failed to decode URL";
    }

    const handleSwap = () => {
        if (output && !error) {
            setInput(output);
            setMode(mode === "encode" ? "decode" : "encode");
        }
    };

    return (
        <ToolShell
            title={t("tools.url-encode.name")}
            description={t("tools.url-encode.desc")}
            actions={
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="xs"
                        onClick={() =>
                            setInput(
                                "https://tools.eubyt.dev/search?q=developer tools&lang=pt",
                            )
                        }
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
                {/* Mode Selector */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3">
                    <div className="flex items-center gap-1">
                        <Button
                            variant={mode === "encode" ? "default" : "outline"}
                            size="xs"
                            onClick={() => setMode("encode")}
                        >
                            {t("tools.url-encode.encode")}
                        </Button>
                        <Button
                            variant={mode === "decode" ? "default" : "outline"}
                            size="xs"
                            onClick={() => setMode("decode")}
                        >
                            {t("tools.url-encode.decode")}
                        </Button>
                        <Button
                            variant="ghost"
                            size="xs"
                            onClick={handleSwap}
                            disabled={!output || !!error}
                            title={t("common.swap")}
                            className="ml-1"
                        >
                            <LuArrowDownUp className="size-3" />
                        </Button>
                    </div>

                    {mode === "encode" && (
                        <label className="flex items-center gap-1.5 cursor-pointer text-xs text-muted-foreground select-none">
                            <input
                                type="checkbox"
                                checked={fullUri}
                                onChange={(e) => setFullUri(e.target.checked)}
                                className="accent-primary"
                            />
                            <span>{t("tools.url-encode.fullUri")}</span>
                        </label>
                    )}
                </div>

                {/* Input & Output */}
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
                            placeholder={t("tools.url-encode.textPlaceholder")}
                            className="min-h-[180px]"
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
                                disabled={!output || !!error}
                                onClick={() => copy(output, "url-out")}
                                className="h-6.5 gap-1.5 px-2.5"
                            >
                                {isCopied("url-out")
                                    ? t("common.copied")
                                    : t("common.copy")}
                            </Button>
                        </div>
                        {error ? (
                            <div className="min-h-[180px] rounded-sm border border-destructive/40 bg-destructive/5 p-3 text-xs text-destructive">
                                {error}
                            </div>
                        ) : (
                            <Textarea
                                readOnly
                                value={output}
                                placeholder={t("common.output")}
                                className="min-h-[180px] bg-muted/20"
                            />
                        )}
                    </div>
                </div>
            </div>
        </ToolShell>
    );
}
