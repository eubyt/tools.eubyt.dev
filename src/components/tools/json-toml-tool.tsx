"use client";

import { useState } from "react";
import { LuArrowDownUp } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ToolShell } from "./tool-shell";
import { jsonToToml, tomlToJson } from "@/lib/tools/json-utils";
import { useClipboard } from "@/hooks/use-clipboard";
import { useTranslations } from "@/providers/locale";

const SAMPLE_JSON = JSON.stringify(
    {
        package: {
            name: "tools-eubyt",
            version: "0.1.0",
            edition: "2024",
        },
        dependencies: {
            serde: "1.0",
            tokio: { version: "1.0", features: ["full"] },
        },
    },
    null,
    2,
);

export function JsonTomlTool() {
    const t = useTranslations();
    const [mode, setMode] = useState<"jsonToToml" | "tomlToJson">("jsonToToml");
    const [input, setInput] = useState(SAMPLE_JSON);
    const { copy, isCopied } = useClipboard();

    let output = "";
    let error = "";

    try {
        if (mode === "jsonToToml") {
            output = jsonToToml(input);
        } else {
            output = tomlToJson(input, "2");
        }
    } catch (err) {
        error = err instanceof Error ? err.message : "Conversion error";
    }

    const handleSwap = () => {
        if (output && !error) {
            setInput(output);
            setMode(mode === "jsonToToml" ? "tomlToJson" : "jsonToToml");
        }
    };

    return (
        <ToolShell
            title={t("tools.json-toml.name")}
            description={t("tools.json-toml.desc")}
            actions={
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="xs"
                        onClick={() => {
                            setInput(SAMPLE_JSON);
                            setMode("jsonToToml");
                        }}
                    >
                        {t("common.sample")}
                    </Button>
                    <Button
                        variant="outline"
                        size="xs"
                        disabled={!output || !!error}
                        onClick={() => copy(output, "toml-out")}
                    >
                        {isCopied("toml-out")
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
                {/* Mode Selector */}
                <div className="flex items-center justify-between pb-3">
                    <div className="flex items-center gap-1">
                        <Button
                            variant={
                                mode === "jsonToToml" ? "default" : "outline"
                            }
                            size="xs"
                            onClick={() => setMode("jsonToToml")}
                        >
                            JSON → TOML
                        </Button>
                        <Button
                            variant={
                                mode === "tomlToJson" ? "default" : "outline"
                            }
                            size="xs"
                            onClick={() => setMode("tomlToJson")}
                        >
                            TOML → JSON
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
                </div>

                {/* Input & Output */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                        <div className="flex h-6.5 items-center">
                            <span className="text-xs font-medium text-foreground">
                                {mode === "jsonToToml" ? "JSON" : "TOML"}{" "}
                                {t("common.input")}
                            </span>
                        </div>
                        <Textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={
                                mode === "jsonToToml"
                                    ? t("tools.json-toml.jsonPlaceholder")
                                    : t("tools.json-toml.tomlPlaceholder")
                            }
                            className="min-h-[260px]"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <div className="flex h-6.5 items-center">
                            <span className="text-xs font-medium text-foreground">
                                {mode === "jsonToToml" ? "TOML" : "JSON"}{" "}
                                {t("common.output")}
                            </span>
                        </div>
                        {error && input.trim() ? (
                            <div className="min-h-[260px] rounded-sm border border-destructive/40 bg-destructive/5 p-3 text-xs text-destructive">
                                <p className="font-semibold">
                                    {t("common.error")}:
                                </p>
                                <p className="mt-1">{error}</p>
                            </div>
                        ) : (
                            <Textarea
                                readOnly
                                value={output}
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
