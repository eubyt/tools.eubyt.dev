"use client";

import { useState, useMemo } from "react";
import { LuCircleCheck } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { ToolShell } from "./tool-shell";
import { diffJson } from "@/lib/tools/json-utils";
import { useClipboard } from "@/hooks/use-clipboard";
import { useTranslations } from "@/providers/locale";

const SAMPLE_LEFT = JSON.stringify(
    {
        name: "tools.eubyt.dev",
        version: "1.0.0",
        enabled: true,
        authors: ["eubyt"],
        settings: {
            cache: true,
            timeout: 5000,
        },
    },
    null,
    2,
);

const SAMPLE_RIGHT = JSON.stringify(
    {
        name: "tools.eubyt.dev",
        version: "1.1.0",
        enabled: false,
        authors: ["eubyt", "community"],
        tags: ["crypto", "json"],
        settings: {
            cache: false,
            timeout: 5000,
            retry: 3,
        },
    },
    null,
    2,
);

export function JsonDiffTool() {
    const t = useTranslations();
    const [leftInput, setLeftInput] = useState(SAMPLE_LEFT);
    const [rightInput, setRightInput] = useState(SAMPLE_RIGHT);
    const { copy, isCopied } = useClipboard();

    const diffResult = useMemo(() => {
        try {
            const leftObj = JSON.parse(leftInput);
            const rightObj = JSON.parse(rightInput);
            return {
                diffs: diffJson(leftObj, rightObj),
                error: null,
            };
        } catch (err) {
            return {
                diffs: [],
                error: err instanceof Error ? err.message : "Invalid JSON",
            };
        }
    }, [leftInput, rightInput]);

    return (
        <ToolShell
            title={t("tools.json-diff.name")}
            description={t("tools.json-diff.desc")}
            actions={
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="xs"
                        onClick={() => {
                            setLeftInput(SAMPLE_LEFT);
                            setRightInput(SAMPLE_RIGHT);
                        }}
                    >
                        {t("common.sample")}
                    </Button>
                    <Button
                        variant="outline"
                        size="xs"
                        disabled={diffResult.diffs.length === 0}
                        onClick={() =>
                            copy(
                                JSON.stringify(diffResult.diffs, null, 2),
                                "diff-out",
                            )
                        }
                    >
                        {isCopied("diff-out")
                            ? t("common.copied")
                            : t("common.copy")}
                    </Button>
                    <Button
                        variant="outline"
                        size="xs"
                        onClick={() => {
                            setLeftInput("");
                            setRightInput("");
                        }}
                    >
                        {t("common.clear")}
                    </Button>
                </div>
            }
        >
            <div className="flex flex-col gap-4 font-mono">
                {/* Inputs Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                        <span className="text-xs font-medium text-foreground">
                            {t("tools.json-diff.left")}
                        </span>
                        <Textarea
                            value={leftInput}
                            onChange={(e) => setLeftInput(e.target.value)}
                            placeholder="{}"
                            className="min-h-[220px]"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <span className="text-xs font-medium text-foreground">
                            {t("tools.json-diff.right")}
                        </span>
                        <Textarea
                            value={rightInput}
                            onChange={(e) => setRightInput(e.target.value)}
                            placeholder="{}"
                            className="min-h-[220px]"
                        />
                    </div>
                </div>

                {/* Differences View */}
                <div className="flex flex-col gap-2 rounded-sm bg-muted/20 p-3">
                    <div className="flex items-center justify-between pb-2 text-xs">
                        <span className="font-semibold text-foreground">
                            Structural Differences
                        </span>
                        {diffResult.error ? (
                            <Badge variant="destructive">
                                {diffResult.error}
                            </Badge>
                        ) : (
                            <span className="text-muted-foreground">
                                {diffResult.diffs.length} differences
                            </span>
                        )}
                    </div>

                    {diffResult.error ? (
                        <p className="text-xs text-destructive p-2">
                            {diffResult.error}
                        </p>
                    ) : diffResult.diffs.length === 0 ? (
                        <div className="flex items-center gap-2 py-4 justify-center text-xs text-emerald-500">
                            <LuCircleCheck className="size-4" />
                            <span>{t("tools.json-diff.noDiff")}</span>
                        </div>
                    ) : (
                        <div className="flex flex-col gap-1.5 max-h-[350px] overflow-y-auto text-xs py-1">
                            {diffResult.diffs.map((diff, idx) => (
                                <div
                                    key={idx}
                                    className={`flex items-start justify-between gap-3 p-2 rounded-sm border ${
                                        diff.type === "added"
                                            ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400"
                                            : diff.type === "removed"
                                              ? "border-destructive/30 bg-destructive/5 text-destructive"
                                              : "border-amber-500/30 bg-amber-500/5 text-amber-600 dark:text-amber-400"
                                    }`}
                                >
                                    <div className="flex flex-col gap-0.5 min-w-0">
                                        <div className="flex items-center gap-2">
                                            <span className="font-bold">
                                                {diff.path}
                                            </span>
                                            <Badge
                                                variant={
                                                    diff.type === "added"
                                                        ? "success"
                                                        : diff.type ===
                                                            "removed"
                                                          ? "destructive"
                                                          : "default"
                                                }
                                                className="text-[0.6rem]"
                                            >
                                                {diff.type}
                                            </Badge>
                                        </div>
                                        <div className="text-[0.6875rem] text-muted-foreground break-all">
                                            {diff.type === "changed" && (
                                                <span>
                                                    <span className="line-through text-destructive/80 mr-2">
                                                        {JSON.stringify(
                                                            diff.oldValue,
                                                        )}
                                                    </span>
                                                    →{" "}
                                                    <span className="text-emerald-500 font-semibold ml-2">
                                                        {JSON.stringify(
                                                            diff.newValue,
                                                        )}
                                                    </span>
                                                </span>
                                            )}
                                            {diff.type === "added" && (
                                                <span>
                                                    +{" "}
                                                    {JSON.stringify(
                                                        diff.newValue,
                                                    )}
                                                </span>
                                            )}
                                            {diff.type === "removed" && (
                                                <span>
                                                    -{" "}
                                                    {JSON.stringify(
                                                        diff.oldValue,
                                                    )}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </ToolShell>
    );
}
