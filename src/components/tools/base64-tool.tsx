"use client";

import { useState } from "react";
import { LuArrowDownUp } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ToolShell } from "./tool-shell";
import { base64Encode, base64Decode } from "@/lib/tools/converters";
import { useClipboard } from "@/hooks/use-clipboard";
import { useTranslations } from "@/providers/locale";

export function Base64Tool() {
    const t = useTranslations();
    const [mode, setMode] = useState<"encode" | "decode">("encode");
    const [input, setInput] = useState("Hello, World!");
    const [urlSafe, setUrlSafe] = useState(false);
    const { copy, isCopied } = useClipboard();

    let output = "";
    let error = "";

    try {
        if (mode === "encode") {
            output = base64Encode(input, urlSafe);
        } else {
            output = base64Decode(input, urlSafe);
        }
    } catch (err) {
        error = err instanceof Error ? err.message : "Failed to decode Base64";
    }

    const handleSwap = () => {
        if (output && !error) {
            setInput(output);
            setMode(mode === "encode" ? "decode" : "encode");
        }
    };

    return (
        <ToolShell
            title={t("tools.base64.name")}
            description={t("tools.base64.desc")}
            actions={
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="xs"
                        onClick={() =>
                            setInput(
                                mode === "encode"
                                    ? "Hello, World!"
                                    : "SGVsbG8sIFdvcmxkISDwn5mp",
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
                {/* Mode Selector & Controls */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3">
                    <div className="flex items-center gap-1">
                        <Button
                            variant={mode === "encode" ? "default" : "outline"}
                            size="xs"
                            onClick={() => setMode("encode")}
                        >
                            {t("tools.base64.encode")}
                        </Button>
                        <Button
                            variant={mode === "decode" ? "default" : "outline"}
                            size="xs"
                            onClick={() => setMode("decode")}
                        >
                            {t("tools.base64.decode")}
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

                    <label className="flex items-center gap-1.5 cursor-pointer text-xs text-muted-foreground select-none">
                        <input
                            type="checkbox"
                            checked={urlSafe}
                            onChange={(e) => setUrlSafe(e.target.checked)}
                            className="accent-primary"
                        />
                        <span>{t("tools.base64.urlSafe")}</span>
                    </label>
                </div>

                {/* Input & Output Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Input */}
                    <div className="flex flex-col gap-1.5">
                        <div className="flex h-6.5 items-center justify-between text-xs">
                            <span className="font-medium text-foreground">
                                {mode === "encode"
                                    ? t("common.input")
                                    : t("tools.base64.b64Placeholder")}
                            </span>
                            <span className="text-[0.6875rem] text-muted-foreground">
                                {input.length} {t("common.characters")}
                            </span>
                        </div>
                        <Textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={
                                mode === "encode"
                                    ? t("tools.base64.textPlaceholder")
                                    : t("tools.base64.b64Placeholder")
                            }
                            className="min-h-[180px]"
                        />
                    </div>

                    {/* Output */}
                    <div className="flex flex-col gap-1.5">
                        <div className="flex h-6.5 items-center justify-between text-xs">
                            <span className="font-medium text-foreground">
                                {mode === "encode"
                                    ? t("tools.base64.b64Placeholder")
                                    : t("common.output")}
                            </span>
                            <div className="flex items-center gap-2">
                                <span className="text-[0.6875rem] text-muted-foreground">
                                    {output.length} {t("common.characters")}
                                </span>
                                <Button
                                    variant="outline"
                                    size="xs"
                                    disabled={!output || !!error}
                                    onClick={() => copy(output, "b64-out")}
                                    className="h-6.5 gap-1.5 px-2.5"
                                >
                                    {isCopied("b64-out")
                                        ? t("common.copied")
                                        : t("common.copy")}
                                </Button>
                            </div>
                        </div>
                        {error ? (
                            <div className="min-h-[180px] rounded-sm border border-destructive/40 bg-destructive/5 p-3 text-xs text-destructive">
                                {t("common.error")}: {error}
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
