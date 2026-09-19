"use client";

import { useState } from "react";
import { LuCircleAlert } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ToolShell } from "./tool-shell";
import { validateJson, formatJson } from "@/lib/tools/json-utils";
import { useTranslations } from "@/providers/locale";

const SAMPLE_VALID = `{\n  "status": "success",\n  "code": 200,\n  "data": {\n    "message": "Valid JSON"\n  }\n}`;

export function JsonValidatorTool() {
    const t = useTranslations();
    const [input, setInput] = useState(SAMPLE_VALID);

    const validation = validateJson(input);

    return (
        <ToolShell
            title={t("tools.json-validator.name")}
            description={t("tools.json-validator.desc")}
            actions={
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="xs"
                        onClick={() => setInput(SAMPLE_VALID)}
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
                {/* Status Indicator */}
                <div className="flex items-center justify-between pb-3">
                    <div className="flex items-center gap-2 text-xs">
                        {!validation.valid && input.trim() ? (
                            <div className="flex items-center gap-1.5 text-destructive">
                                <LuCircleAlert className="size-4" />
                                <span className="font-semibold">
                                    {t("common.invalid")}
                                    {validation.line
                                        ? ` (L${validation.line}:C${validation.column})`
                                        : ""}
                                </span>
                            </div>
                        ) : null}
                    </div>

                    {validation.valid && input.trim() && (
                        <Button
                            variant="secondary"
                            size="xs"
                            onClick={() => {
                                try {
                                    setInput(formatJson(input, "2"));
                                } catch {}
                            }}
                        >
                            {t("common.format")}
                        </Button>
                    )}
                </div>

                {/* Editor */}
                <div className="flex flex-col gap-2">
                    <Textarea
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder={t("tools.json-validator.placeholder")}
                        className={`min-h-[300px] ${
                            !validation.valid && input.trim()
                                ? "border-destructive/60 focus-visible:border-destructive"
                                : ""
                        }`}
                    />

                    {!validation.valid && input.trim() && (
                        <div className="rounded-sm border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
                            <p className="font-semibold">{validation.error}</p>
                            {validation.line && (
                                <p className="mt-1 text-[0.6875rem] opacity-80">
                                    Tip: Inspect line {validation.line},
                                    character {validation.column}. Common errors
                                    include unquoted keys, trailing commas, or
                                    missing brackets.
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </ToolShell>
    );
}
