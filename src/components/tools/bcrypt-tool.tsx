"use client";

import { useState, useEffect } from "react";
import { LuShieldCheck, LuShieldAlert, LuRefreshCw } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ToolShell } from "./tool-shell";
import {
    generateBcryptHash,
    verifyBcryptHash,
    parseBcryptHash,
} from "@/lib/tools/crypto";
import { useClipboard } from "@/hooks/use-clipboard";
import { useTranslations } from "@/providers/locale";
import { cn } from "@/utils/cn";

const SAMPLE_HASH =
    "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy"; // "password"

export function BcryptTool() {
    const t = useTranslations();
    const [mode, setMode] = useState<"generate" | "verify">("generate");
    const [password, setPassword] = useState("secret123");
    const [rounds, setRounds] = useState(10);
    const [generatedHash, setGeneratedHash] = useState("");
    const [verifyHash, setVerifyHash] = useState(SAMPLE_HASH);
    const [verifyPassword, setVerifyPassword] = useState("password");
    const [verifyResult, setVerifyResult] = useState<boolean | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const { copy, isCopied } = useClipboard();

    const displayHash = password ? generatedHash : "";
    const inspected = parseBcryptHash(
        mode === "generate" ? displayHash : verifyHash,
    );

    const handleGenerate = async () => {
        if (!password) return;
        setIsProcessing(true);
        try {
            const h = await generateBcryptHash(password, rounds);
            setGeneratedHash(h);
        } finally {
            setIsProcessing(false);
        }
    };

    useEffect(() => {
        if (!password) return;
        let cancelled = false;
        const timer = setTimeout(() => {
            setIsProcessing(true);
            generateBcryptHash(password, rounds)
                .then((h) => {
                    if (!cancelled) setGeneratedHash(h);
                })
                .finally(() => {
                    if (!cancelled) setIsProcessing(false);
                });
        }, 150);

        return () => {
            cancelled = true;
            clearTimeout(timer);
        };
    }, [password, rounds]);

    const handleVerify = async () => {
        if (!verifyPassword || !verifyHash) return;
        setIsProcessing(true);
        try {
            const matches = await verifyBcryptHash(verifyPassword, verifyHash);
            setVerifyResult(matches);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <ToolShell
            title={t("tools.bcrypt.name")}
            description={t("tools.bcrypt.desc")}
            actions={
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="xs"
                        onClick={() => {
                            if (mode === "generate") {
                                setPassword("secret123");
                                setRounds(10);
                            } else {
                                setVerifyHash(SAMPLE_HASH);
                                setVerifyPassword("password");
                                setVerifyResult(null);
                            }
                        }}
                    >
                        {t("common.sample")}
                    </Button>
                    <Button
                        variant="outline"
                        size="xs"
                        disabled={
                            mode === "generate" ? !displayHash : !verifyHash
                        }
                        onClick={() => {
                            if (mode === "generate") {
                                copy(displayHash, "bcrypt-out");
                            } else {
                                copy(verifyHash, "bcrypt-verify-hash");
                            }
                        }}
                    >
                        {isCopied("bcrypt-out") ||
                        isCopied("bcrypt-verify-hash")
                            ? t("common.copied")
                            : t("common.copy")}
                    </Button>
                    <Button
                        variant="outline"
                        size="xs"
                        onClick={() => {
                            setPassword("");
                            setGeneratedHash("");
                            setVerifyPassword("");
                            setVerifyHash("");
                            setVerifyResult(null);
                        }}
                    >
                        {t("common.clear")}
                    </Button>
                </div>
            }
        >
            <div className="flex flex-col gap-4 font-mono">
                {/* Mode Selector */}
                <div className="flex items-center gap-1 pb-3">
                    <Button
                        variant={mode === "generate" ? "default" : "outline"}
                        size="xs"
                        onClick={() => {
                            setMode("generate");
                            handleGenerate();
                        }}
                        className="gap-1.5"
                    >
                        <LuRefreshCw
                            className={cn(
                                "size-3",
                                isProcessing &&
                                    mode === "generate" &&
                                    "animate-spin",
                            )}
                        />
                        <span>
                            {isProcessing && mode === "generate"
                                ? "Hashing..."
                                : t("tools.bcrypt.generate")}
                        </span>
                    </Button>
                    <Button
                        variant={mode === "verify" ? "default" : "outline"}
                        size="xs"
                        onClick={() => setMode("verify")}
                    >
                        {t("tools.bcrypt.verify")}
                    </Button>
                </div>

                {mode === "generate" ? (
                    <div className="flex flex-col gap-4">
                        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                            <div className="sm:col-span-3 flex flex-col gap-1.5">
                                <span className="text-xs font-medium text-foreground">
                                    {t("tools.bcrypt.password")}
                                </span>
                                <Input
                                    type="text"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    placeholder="Enter plaintext password..."
                                    className="font-mono text-xs"
                                />
                            </div>

                            <div className="flex flex-col gap-1.5">
                                <span className="text-xs font-medium text-foreground">
                                    {t("tools.bcrypt.rounds")} (4 - 14)
                                </span>
                                <Input
                                    type="number"
                                    min={4}
                                    max={14}
                                    value={rounds}
                                    onChange={(e) =>
                                        setRounds(
                                            Math.max(
                                                4,
                                                Math.min(
                                                    14,
                                                    parseInt(e.target.value) ||
                                                        10,
                                                ),
                                            ),
                                        )
                                    }
                                    className="font-mono text-xs"
                                />
                            </div>
                        </div>

                        {/* Generated Output */}
                        {displayHash && (
                            <div className="flex flex-col gap-1.5 pt-2">
                                <div className="flex items-center justify-between text-xs">
                                    <span className="font-semibold text-foreground">
                                        {t("tools.bcrypt.hash")}
                                    </span>
                                    <div className="flex items-center gap-1.5">
                                        <Button
                                            variant="outline"
                                            size="xs"
                                            onClick={handleGenerate}
                                            disabled={!password || isProcessing}
                                            className="h-6.5 gap-1.5 px-2.5"
                                            title={t("tools.bcrypt.generate")}
                                        >
                                            <LuRefreshCw
                                                className={cn(
                                                    "size-3",
                                                    isProcessing &&
                                                        "animate-spin",
                                                )}
                                            />
                                        </Button>
                                    </div>
                                </div>
                                <div className="rounded-sm bg-muted/30 p-3 text-xs text-foreground select-all break-all">
                                    {displayHash}
                                </div>
                            </div>
                        )}
                    </div>
                ) : (
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-col gap-1.5">
                            <span className="text-xs font-medium text-foreground">
                                {t("tools.bcrypt.password")}
                            </span>
                            <Input
                                type="text"
                                value={verifyPassword}
                                onChange={(e) => {
                                    setVerifyPassword(e.target.value);
                                    setVerifyResult(null);
                                }}
                                placeholder="Enter plaintext password to verify..."
                                className="font-mono text-xs"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <span className="text-xs font-medium text-foreground">
                                {t("tools.bcrypt.hash")}
                            </span>
                            <Input
                                type="text"
                                value={verifyHash}
                                onChange={(e) => {
                                    setVerifyHash(e.target.value);
                                    setVerifyResult(null);
                                }}
                                placeholder="$2a$10$..."
                                className="font-mono text-xs"
                            />
                        </div>

                        <Button
                            variant="secondary"
                            onClick={handleVerify}
                            disabled={
                                !verifyPassword || !verifyHash || isProcessing
                            }
                            className="self-start"
                        >
                            {isProcessing
                                ? "Verifying..."
                                : t("tools.bcrypt.verify")}
                        </Button>

                        {verifyResult !== null && (
                            <div
                                className={cn(
                                    "flex items-center gap-2 rounded-sm border px-3 py-2 text-xs",
                                    verifyResult
                                        ? "border-emerald-500/30 bg-emerald-500/5 text-emerald-600 dark:text-emerald-400"
                                        : "border-destructive/30 bg-destructive/5 text-destructive",
                                )}
                            >
                                {verifyResult ? (
                                    <LuShieldCheck className="size-3.5 shrink-0" />
                                ) : (
                                    <LuShieldAlert className="size-3.5 shrink-0" />
                                )}
                                <span>
                                    {verifyResult
                                        ? t("tools.bcrypt.match")
                                        : t("tools.bcrypt.mismatch")}
                                </span>
                            </div>
                        )}
                    </div>
                )}

                {/* Hash Inspector metadata */}
                {inspected.valid && (
                    <div className="flex items-center gap-4 text-[0.6875rem] text-muted-foreground pt-2.5">
                        <span>
                            Cost:{" "}
                            <strong className="text-foreground">
                                {inspected.cost}
                            </strong>
                        </span>
                        <span>
                            Salt:{" "}
                            <strong className="text-foreground">
                                {inspected.salt}
                            </strong>
                        </span>
                    </div>
                )}
            </div>
        </ToolShell>
    );
}
