"use client";

import { useState } from "react";
import { LuArrowDownUp } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ToolShell } from "./tool-shell";
import { jsonToYaml, yamlToJson } from "@/lib/tools/json-utils";
import { useClipboard } from "@/hooks/use-clipboard";
import { useTranslations } from "@/providers/locale";

const SAMPLE_JSON = JSON.stringify(
    {
        server: {
            host: "0.0.0.0",
            port: 8080,
            ssl: true,
        },
        services: ["api", "worker", "redis"],
        meta: { env: "production" },
    },
    null,
    2,
);

export function JsonYamlTool() {
    const t = useTranslations();
    const [mode, setMode] = useState<"jsonToYaml" | "yamlToJson">("jsonToYaml");
    const [input, setInput] = useState(SAMPLE_JSON);
    const { copy, isCopied } = useClipboard();

    let output = "";
    let error = "";

    try {
        if (mode === "jsonToYaml") {
            output = jsonToYaml(input);
        } else {
            output = yamlToJson(input, "2");
        }
    } catch (err) {
        error = err instanceof Error ? err.message : "Conversion error";
    }

    const handleSwap = () => {
        if (output && !error) {
            setInput(output);
            setMode(mode === "jsonToYaml" ? "yamlToJson" : "jsonToYaml");
        }
    };

    return (
        <ToolShell
            title={t("tools.json-yaml.name")}
            description={t("tools.json-yaml.desc")}
            actions={
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="xs"
                        onClick={() => {
                            setInput(SAMPLE_JSON);
                            setMode("jsonToYaml");
                        }}
                    >
                        {t("common.sample")}
                    </Button>
                    <Button
                        variant="outline"
                        size="xs"
                        disabled={!output || !!error}
                        onClick={() => copy(output, "yaml-out")}
                    >
                        {isCopied("yaml-out")
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
                                mode === "jsonToYaml" ? "default" : "outline"
                            }
                            size="xs"
                            onClick={() => setMode("jsonToYaml")}
                        >
                            JSON → YAML
                        </Button>
                        <Button
                            variant={
                                mode === "yamlToJson" ? "default" : "outline"
                            }
                            size="xs"
                            onClick={() => setMode("yamlToJson")}
                        >
                            YAML → JSON
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
                                {mode === "jsonToYaml" ? "JSON" : "YAML"}{" "}
                                {t("common.input")}
                            </span>
                        </div>
                        <Textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={
                                mode === "jsonToYaml"
                                    ? t("tools.json-yaml.jsonPlaceholder")
                                    : t("tools.json-yaml.yamlPlaceholder")
                            }
                            className="min-h-[260px]"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <div className="flex h-6.5 items-center">
                            <span className="text-xs font-medium text-foreground">
                                {mode === "jsonToYaml" ? "YAML" : "JSON"}{" "}
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
