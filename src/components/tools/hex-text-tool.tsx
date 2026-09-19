"use client";

import { useState } from "react";
import { LuArrowDownUp } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ToolShell } from "./tool-shell";
import {
    textToHex,
    hexToText,
    type HexDelimiter,
} from "@/lib/tools/converters";
import { useClipboard } from "@/hooks/use-clipboard";
import { useTranslations } from "@/providers/locale";

export function HexTextTool() {
    const t = useTranslations();
    const [mode, setMode] = useState<"textToHex" | "hexToText">("textToHex");
    const [delimiter, setDelimiter] = useState<HexDelimiter>("space");
    const [input, setInput] = useState("Hello world");
    const { copy, isCopied } = useClipboard();

    let output = "";
    let error = "";

    try {
        if (mode === "textToHex") {
            output = textToHex(input, delimiter);
        } else {
            output = hexToText(input);
        }
    } catch (err) {
        error = err instanceof Error ? err.message : "Invalid hex string";
    }

    const handleSwap = () => {
        if (output && !error) {
            setInput(output);
            setMode(mode === "textToHex" ? "hexToText" : "textToHex");
        }
    };

    return (
        <ToolShell
            title={t("tools.hex-text.name")}
            description={t("tools.hex-text.desc")}
            actions={
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="xs"
                        onClick={() =>
                            setInput(
                                mode === "textToHex"
                                    ? "Hello world"
                                    : "48 65 6c 6c 6f 20 77 6f 72 6c 64",
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
                {/* Controls */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3">
                    <div className="flex items-center gap-1">
                        <Button
                            variant={
                                mode === "textToHex" ? "default" : "outline"
                            }
                            size="xs"
                            onClick={() => setMode("textToHex")}
                        >
                            Text → Hex
                        </Button>
                        <Button
                            variant={
                                mode === "hexToText" ? "default" : "outline"
                            }
                            size="xs"
                            onClick={() => setMode("hexToText")}
                        >
                            Hex → Text
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

                    {mode === "textToHex" && (
                        <div className="flex items-center gap-2 text-xs">
                            <label
                                htmlFor="hex-text-delimiter"
                                className="text-muted-foreground"
                            >
                                {t("tools.hex-text.delimiter")}
                            </label>
                            <Select
                                id="hex-text-delimiter"
                                value={delimiter}
                                onChange={(e) =>
                                    setDelimiter(e.target.value as HexDelimiter)
                                }
                                className="w-auto font-mono"
                            >
                                <option value="space">
                                    {t("tools.hex-text.space")}
                                </option>
                                <option value="none">
                                    {t("tools.hex-text.none")}
                                </option>
                                <option value="prefix">
                                    {t("tools.hex-text.prefix")}
                                </option>
                                <option value="colon">
                                    {t("tools.hex-text.colon")}
                                </option>
                            </Select>
                        </div>
                    )}
                </div>

                {/* Input & Output */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                        <div className="flex h-6.5 items-center">
                            <span className="text-xs font-medium text-foreground">
                                {mode === "textToHex"
                                    ? t("common.input")
                                    : t("tools.hex-text.hexPlaceholder")}
                            </span>
                        </div>
                        <Textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={
                                mode === "textToHex"
                                    ? t("tools.hex-text.textPlaceholder")
                                    : t("tools.hex-text.hexPlaceholder")
                            }
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
                                onClick={() => copy(output, "hex-out")}
                                className="h-6.5 gap-1.5 px-2.5"
                            >
                                {isCopied("hex-out")
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
