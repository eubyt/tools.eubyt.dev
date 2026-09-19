"use client";

import { useState } from "react";
import { LuArrowDownUp } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ToolShell } from "./tool-shell";
import { aesEncrypt, aesDecrypt } from "@/lib/tools/crypto";
import { useClipboard } from "@/hooks/use-clipboard";
import { useTranslations } from "@/providers/locale";

export function AesTool() {
    const t = useTranslations();
    const [mode, setMode] = useState<"encrypt" | "decrypt">("encrypt");
    const [secret, setSecret] = useState("my-secret-passphrase");
    const [iv, setIv] = useState("");
    const [input, setInput] = useState(
        "Confidential message to protect with AES-256",
    );
    const { copy, isCopied } = useClipboard();

    let output = "";
    let error = "";

    try {
        if (mode === "encrypt") {
            output = aesEncrypt(input, secret, iv);
        } else {
            output = aesDecrypt(input, secret, iv);
        }
    } catch (err) {
        error =
            err instanceof Error
                ? err.message
                : "Decryption failed. Check key and ciphertext.";
    }

    const handleSwap = () => {
        if (output && !error) {
            setInput(output);
            setMode(mode === "encrypt" ? "decrypt" : "encrypt");
        }
    };

    return (
        <ToolShell
            title={t("tools.aes.name")}
            description={t("tools.aes.desc")}
            actions={
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="xs"
                        onClick={() => {
                            setMode("encrypt");
                            setSecret("my-secret-passphrase");
                            setIv("");
                            setInput(
                                "Confidential message to protect with AES-256",
                            );
                        }}
                    >
                        {t("common.sample")}
                    </Button>
                    <Button
                        variant="outline"
                        size="xs"
                        onClick={() => {
                            setInput("");
                        }}
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
                            variant={mode === "encrypt" ? "default" : "outline"}
                            size="xs"
                            onClick={() => setMode("encrypt")}
                        >
                            {t("tools.aes.encrypt")}
                        </Button>
                        <Button
                            variant={mode === "decrypt" ? "default" : "outline"}
                            size="xs"
                            onClick={() => setMode("decrypt")}
                        >
                            {t("tools.aes.decrypt")}
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

                {/* Key & IV inputs */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                        <div className="flex h-6.5 items-center">
                            <span className="text-xs font-medium text-foreground">
                                {t("tools.aes.passphrase")}
                            </span>
                        </div>
                        <Input
                            type="text"
                            value={secret}
                            onChange={(e) => setSecret(e.target.value)}
                            placeholder="Encryption key / passphrase..."
                            className="font-mono text-xs"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <div className="flex h-6.5 items-center">
                            <span className="text-xs font-medium text-muted-foreground">
                                {t("tools.aes.iv")}
                            </span>
                        </div>
                        <Input
                            type="text"
                            value={iv}
                            onChange={(e) => setIv(e.target.value)}
                            placeholder="Optional 16-character IV..."
                            className="font-mono text-xs"
                        />
                    </div>
                </div>

                {/* Input & Output Textareas */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                        <div className="flex h-6.5 items-center">
                            <span className="text-xs font-medium text-foreground">
                                {mode === "encrypt"
                                    ? t("tools.aes.plaintext")
                                    : t("tools.aes.ciphertext")}
                            </span>
                        </div>
                        <Textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={
                                mode === "encrypt"
                                    ? "Enter plaintext to encrypt..."
                                    : "Enter Base64 ciphertext to decrypt..."
                            }
                            className="min-h-[180px]"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <div className="flex h-6.5 items-center justify-between text-xs">
                            <span className="font-medium text-foreground">
                                {mode === "encrypt"
                                    ? t("tools.aes.ciphertext")
                                    : t("tools.aes.plaintext")}
                            </span>
                            <Button
                                variant="outline"
                                size="xs"
                                disabled={!output || !!error}
                                onClick={() => copy(output, "aes-out")}
                                className="h-6.5 gap-1.5 px-2.5"
                            >
                                {isCopied("aes-out")
                                    ? t("common.copied")
                                    : t("common.copy")}
                            </Button>
                        </div>
                        {error && input.trim() ? (
                            <div className="min-h-[180px] rounded-sm border border-destructive/40 bg-destructive/5 p-3 text-xs text-destructive">
                                <p className="font-semibold">
                                    {t("common.error")}:
                                </p>
                                <p className="mt-1">{error}</p>
                            </div>
                        ) : (
                            <Textarea
                                readOnly
                                value={output}
                                placeholder="Result..."
                                className="min-h-[180px] bg-muted/20"
                            />
                        )}
                    </div>
                </div>
            </div>
        </ToolShell>
    );
}
