"use client";

import { useState } from "react";
import { LuArrowDownUp } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ToolShell } from "./tool-shell";
import { jsonToXml, xmlToJson } from "@/lib/tools/json-utils";
import { useClipboard } from "@/hooks/use-clipboard";
import { useTranslations } from "@/providers/locale";

const SAMPLE_JSON = JSON.stringify(
    {
        user: {
            id: 1,
            name: "John Doe",
            email: "john@example.com",
            roles: { role: ["developer", "admin"] },
        },
    },
    null,
    2,
);

export function JsonXmlTool() {
    const t = useTranslations();
    const [mode, setMode] = useState<"jsonToXml" | "xmlToJson">("jsonToXml");
    const [input, setInput] = useState(SAMPLE_JSON);
    const [rootTag, setRootTag] = useState("root");
    const { copy, isCopied } = useClipboard();

    let output = "";
    let error = "";

    try {
        if (mode === "jsonToXml") {
            output = jsonToXml(input, rootTag || "root");
        } else {
            output = xmlToJson(input, "2");
        }
    } catch (err) {
        error = err instanceof Error ? err.message : "Conversion error";
    }

    const handleSwap = () => {
        if (output && !error) {
            setInput(output);
            setMode(mode === "jsonToXml" ? "xmlToJson" : "jsonToXml");
        }
    };

    return (
        <ToolShell
            title={t("tools.json-xml.name")}
            description={t("tools.json-xml.desc")}
            actions={
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="xs"
                        onClick={() => {
                            setInput(SAMPLE_JSON);
                            setMode("jsonToXml");
                        }}
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
                            variant={
                                mode === "jsonToXml" ? "default" : "outline"
                            }
                            size="xs"
                            onClick={() => setMode("jsonToXml")}
                        >
                            JSON → XML
                        </Button>
                        <Button
                            variant={
                                mode === "xmlToJson" ? "default" : "outline"
                            }
                            size="xs"
                            onClick={() => setMode("xmlToJson")}
                        >
                            XML → JSON
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

                    {mode === "jsonToXml" && (
                        <div className="flex items-center gap-2 text-xs">
                            <span className="text-muted-foreground">
                                {t("tools.json-xml.rootTag")}:
                            </span>
                            <Input
                                value={rootTag}
                                onChange={(e) => setRootTag(e.target.value)}
                                className="h-6 w-24 px-1.5 text-xs font-mono"
                            />
                        </div>
                    )}
                </div>

                {/* Input & Output */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                        <div className="flex h-6.5 items-center">
                            <span className="text-xs font-medium text-foreground">
                                {mode === "jsonToXml" ? "JSON" : "XML"}{" "}
                                {t("common.input")}
                            </span>
                        </div>
                        <Textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={
                                mode === "jsonToXml"
                                    ? t("tools.json-xml.jsonPlaceholder")
                                    : t("tools.json-xml.xmlPlaceholder")
                            }
                            className="min-h-[260px]"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <div className="flex h-6.5 items-center justify-between text-xs">
                            <span className="font-medium text-foreground">
                                {mode === "jsonToXml" ? "XML" : "JSON"}{" "}
                                {t("common.output")}
                            </span>
                            <Button
                                variant="outline"
                                size="xs"
                                disabled={!output || !!error}
                                onClick={() => copy(output, "xml-out")}
                                className="h-6.5 gap-1.5 px-2.5"
                            >
                                {isCopied("xml-out")
                                    ? t("common.copied")
                                    : t("common.copy")}
                            </Button>
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
