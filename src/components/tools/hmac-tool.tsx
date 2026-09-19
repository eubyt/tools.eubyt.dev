"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ToolShell } from "./tool-shell";
import { computeHmac, type HmacAlgorithm } from "@/lib/tools/crypto";
import { useClipboard } from "@/hooks/use-clipboard";
import { useTranslations } from "@/providers/locale";

const ALGORITHMS: HmacAlgorithm[] = [
    "SHA256",
    "SHA512",
    "SHA384",
    "SHA1",
    "MD5",
];

export function HmacTool() {
    const t = useTranslations();
    const [algorithm, setAlgorithm] = useState<HmacAlgorithm>("SHA256");
    const [secretKey, setSecretKey] = useState("my-super-secret-key");
    const [message, setMessage] = useState("Hello, authenticated message!");
    const [uppercase, setUppercase] = useState(false);
    const { copy, isCopied } = useClipboard();

    const hmacValue = useMemo(() => {
        return computeHmac(message, secretKey, algorithm, uppercase);
    }, [message, secretKey, algorithm, uppercase]);

    return (
        <ToolShell
            title={t("tools.hmac.name")}
            description={t("tools.hmac.desc")}
            actions={
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="xs"
                        onClick={() => {
                            setSecretKey("my-super-secret-key");
                            setMessage("Hello, authenticated message!");
                        }}
                    >
                        {t("common.sample")}
                    </Button>
                    <Button
                        variant="outline"
                        size="xs"
                        disabled={!hmacValue}
                        onClick={() => copy(hmacValue, "hmac-out")}
                    >
                        {isCopied("hmac-out")
                            ? t("common.copied")
                            : t("common.copy")}
                    </Button>
                    <Button
                        variant="outline"
                        size="xs"
                        onClick={() => {
                            setSecretKey("");
                            setMessage("");
                        }}
                    >
                        {t("common.clear")}
                    </Button>
                </div>
            }
        >
            <div className="flex flex-col gap-4 font-mono">
                {/* Algorithm Selector & Options */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3">
                    <div className="flex items-center gap-1">
                        {ALGORITHMS.map((alg) => (
                            <Button
                                key={alg}
                                variant={
                                    algorithm === alg ? "default" : "outline"
                                }
                                size="xs"
                                onClick={() => setAlgorithm(alg)}
                            >
                                {alg}
                            </Button>
                        ))}
                    </div>

                    <label className="flex items-center gap-1.5 cursor-pointer text-xs text-muted-foreground select-none">
                        <input
                            type="checkbox"
                            checked={uppercase}
                            onChange={(e) => setUppercase(e.target.checked)}
                            className="accent-primary"
                        />
                        <span>{t("common.uppercase")}</span>
                    </label>
                </div>

                {/* Secret Key Input */}
                <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-medium text-foreground">
                        {t("tools.hmac.secretKey")}
                    </span>
                    <Input
                        type="text"
                        value={secretKey}
                        onChange={(e) => setSecretKey(e.target.value)}
                        placeholder={t("tools.hmac.keyPlaceholder")}
                        className="font-mono text-xs"
                    />
                </div>

                {/* Message Input */}
                <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-medium text-foreground">
                        {t("tools.hmac.message")}
                    </span>
                    <Textarea
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder={t("tools.hmac.message")}
                        className="min-h-[120px]"
                    />
                </div>

                {/* Output */}
                <div className="flex flex-col gap-1.5">
                    <div className="flex h-6.5 items-center">
                        <span className="text-xs font-semibold text-foreground">
                            HMAC-{algorithm} {t("common.output")}
                        </span>
                    </div>
                    <div className="rounded-sm bg-muted/30 p-3 text-xs text-foreground select-all break-all">
                        {hmacValue || (
                            <span className="text-muted-foreground">—</span>
                        )}
                    </div>
                </div>
            </div>
        </ToolShell>
    );
}
