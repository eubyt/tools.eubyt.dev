"use client";

import { useState } from "react";
import { LuArrowDownUp } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ToolShell } from "./tool-shell";
import { jsonToCsv, csvToJson } from "@/lib/tools/json-utils";
import { useClipboard } from "@/hooks/use-clipboard";
import { useTranslations } from "@/providers/locale";

const SAMPLE_JSON = JSON.stringify(
    [
        { id: 1, name: "Antigravity", role: "AI Assistant", active: true },
        { id: 2, name: "Byte", role: "Developer", active: true },
        { id: 3, name: "Neo", role: "Architect", active: false },
    ],
    null,
    2,
);

export function JsonCsvTool() {
    const t = useTranslations();
    const [mode, setMode] = useState<"jsonToCsv" | "csvToJson">("jsonToCsv");
    const [delimiter, setDelimiter] = useState(",");
    const [input, setInput] = useState(SAMPLE_JSON);
    const { copy, isCopied } = useClipboard();

    let output = "";
    let error = "";

    try {
        if (mode === "jsonToCsv") {
            output = jsonToCsv(input, delimiter);
        } else {
            output = csvToJson(input, delimiter, "2");
        }
    } catch (err) {
        error = err instanceof Error ? err.message : "Conversion error";
    }

    const handleSwap = () => {
        if (output && !error) {
            setInput(output);
            setMode(mode === "jsonToCsv" ? "csvToJson" : "jsonToCsv");
        }
    };

    return (
        <ToolShell
            title={t("tools.json-csv.name")}
            description={t("tools.json-csv.desc")}
            actions={
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="xs"
                        onClick={() => {
                            setInput(SAMPLE_JSON);
                            setMode("jsonToCsv");
                        }}
                    >
                        {t("common.sample")}
                    </Button>
                    <Button
                        variant="outline"
                        size="xs"
                        disabled={!output || !!error}
                        onClick={() => copy(output, "csv-out")}
                    >
                        {isCopied("csv-out")
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
                {/* Mode & Delimiter */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3">
                    <div className="flex items-center gap-1">
                        <Button
                            variant={
                                mode === "jsonToCsv" ? "default" : "outline"
                            }
                            size="xs"
                            onClick={() => setMode("jsonToCsv")}
                        >
                            JSON → CSV
                        </Button>
                        <Button
                            variant={
                                mode === "csvToJson" ? "default" : "outline"
                            }
                            size="xs"
                            onClick={() => setMode("csvToJson")}
                        >
                            CSV → JSON
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

                    <div className="flex items-center gap-2 text-xs">
                        <label
                            htmlFor="json-csv-delimiter"
                            className="text-muted-foreground"
                        >
                            {t("tools.json-csv.delimiter")}
                        </label>
                        <Select
                            id="json-csv-delimiter"
                            value={delimiter}
                            onChange={(e) => setDelimiter(e.target.value)}
                            className="w-auto font-mono"
                        >
                            <option value=",">
                                {t("tools.json-csv.comma")}
                            </option>
                            <option value=";">
                                {t("tools.json-csv.semicolon")}
                            </option>
                            <option value={"\t"}>
                                {t("tools.json-csv.tab")}
                            </option>
                        </Select>
                    </div>
                </div>

                {/* Input & Output */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                        <div className="flex h-6.5 items-center">
                            <span className="text-xs font-medium text-foreground">
                                {mode === "jsonToCsv" ? "JSON" : "CSV"}{" "}
                                {t("common.input")}
                            </span>
                        </div>
                        <Textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={
                                mode === "jsonToCsv"
                                    ? t("tools.json-csv.jsonPlaceholder")
                                    : t("tools.json-csv.csvPlaceholder")
                            }
                            className="min-h-[260px]"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <div className="flex h-6.5 items-center">
                            <span className="text-xs font-medium text-foreground">
                                {mode === "jsonToCsv" ? "CSV" : "JSON"}{" "}
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
