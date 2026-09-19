"use client";

import { useState } from "react";
import { LuClock } from "react-icons/lu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ToolShell } from "./tool-shell";
import { generateJwt, type JwtSignAlg } from "@/lib/tools/jwt";
import { useClipboard } from "@/hooks/use-clipboard";
import { useTranslations } from "@/providers/locale";

const DEFAULT_HEADER = JSON.stringify({ alg: "HS256", typ: "JWT" }, null, 2);
const DEFAULT_PAYLOAD = JSON.stringify(
    {
        sub: "user_12345",
        name: "Developer",
        role: "admin",
        iat: Math.floor(Date.now() / 1000),
        exp: Math.floor(Date.now() / 1000) + 3600 * 24, // 24 hours
    },
    null,
    2,
);

export function JwtGeneratorTool() {
    const t = useTranslations();
    const [alg, setAlg] = useState<JwtSignAlg>("HS256");
    const [secret, setSecret] = useState("your-256-bit-secret-key");
    const [headerText, setHeaderText] = useState(DEFAULT_HEADER);
    const [payloadText, setPayloadText] = useState(DEFAULT_PAYLOAD);
    const { copy, isCopied } = useClipboard();

    let signedJwt = "";
    let error = "";

    try {
        const headerObj = JSON.parse(headerText);
        const payloadObj = JSON.parse(payloadText);
        signedJwt = generateJwt(headerObj, payloadObj, secret, alg);
    } catch (err) {
        error =
            err instanceof Error
                ? err.message
                : "Invalid JSON in header or payload";
    }

    const addHoursToExpiry = (hours: number) => {
        try {
            const parsed = JSON.parse(payloadText);
            parsed.iat = Math.floor(Date.now() / 1000);
            parsed.exp = parsed.iat + hours * 3600;
            setPayloadText(JSON.stringify(parsed, null, 2));
        } catch {}
    };

    return (
        <ToolShell
            title={t("tools.jwt-generator.name")}
            description={t("tools.jwt-generator.desc")}
            actions={
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="xs"
                        onClick={() => {
                            setAlg("HS256");
                            setSecret("your-256-bit-secret-key");
                            setHeaderText(DEFAULT_HEADER);
                            setPayloadText(DEFAULT_PAYLOAD);
                        }}
                    >
                        {t("common.sample")}
                    </Button>
                    <Button
                        variant="outline"
                        size="xs"
                        disabled={!signedJwt || !!error}
                        onClick={() => copy(signedJwt, "jwt-gen-out")}
                    >
                        {isCopied("jwt-gen-out")
                            ? t("common.copied")
                            : t("common.copy")}
                    </Button>
                    <Button
                        variant="outline"
                        size="xs"
                        onClick={() => {
                            setSecret("");
                            setPayloadText("{}");
                        }}
                    >
                        {t("common.clear")}
                    </Button>
                </div>
            }
        >
            <div className="flex flex-col gap-4 font-mono">
                {/* Algorithm & Secret Key */}
                <div className="flex flex-wrap items-center justify-between gap-3 pb-3">
                    <div className="flex items-center gap-1 text-xs">
                        <span className="text-muted-foreground mr-1">
                            Algorithm:
                        </span>
                        {(["HS256", "HS384", "HS512"] as const).map((a) => (
                            <Button
                                key={a}
                                variant={alg === a ? "default" : "outline"}
                                size="xs"
                                onClick={() => setAlg(a)}
                            >
                                {a}
                            </Button>
                        ))}
                    </div>

                    <div className="flex items-center gap-1.5 text-xs">
                        <Button
                            variant="outline"
                            size="xs"
                            onClick={() => addHoursToExpiry(1)}
                            className="gap-1"
                        >
                            <LuClock className="size-3" />
                            +1 hr exp
                        </Button>
                        <Button
                            variant="outline"
                            size="xs"
                            onClick={() => addHoursToExpiry(24 * 7)}
                            className="gap-1"
                        >
                            <LuClock className="size-3" />
                            +7 days exp
                        </Button>
                    </div>
                </div>

                {/* Secret Key */}
                <div className="flex flex-col gap-1.5">
                    <span className="text-xs font-medium text-foreground">
                        {t("tools.jwt-generator.secretKey")}
                    </span>
                    <Input
                        type="text"
                        value={secret}
                        onChange={(e) => setSecret(e.target.value)}
                        placeholder={t("tools.jwt-generator.keyPlaceholder")}
                        className="font-mono text-xs"
                    />
                </div>

                {/* Header & Payload Editors */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                        <div className="flex h-6.5 items-center">
                            <span className="text-xs font-semibold text-rose-500">
                                Header JSON
                            </span>
                        </div>
                        <Textarea
                            value={headerText}
                            onChange={(e) => setHeaderText(e.target.value)}
                            className="min-h-[160px] bg-rose-500/5 border-rose-500/30"
                        />
                    </div>

                    <div className="flex flex-col gap-1.5">
                        <div className="flex h-6.5 items-center">
                            <span className="text-xs font-semibold text-purple-500">
                                Payload JSON (Claims)
                            </span>
                        </div>
                        <Textarea
                            value={payloadText}
                            onChange={(e) => setPayloadText(e.target.value)}
                            className="min-h-[160px] bg-purple-500/5 border-purple-500/30"
                        />
                    </div>
                </div>

                {/* Signed Token Output */}
                <div className="flex flex-col gap-1.5">
                    <div className="flex h-6.5 items-center">
                        <span className="text-xs font-semibold text-foreground">
                            {t("tools.jwt-generator.tokenOutput")}
                        </span>
                    </div>

                    {error ? (
                        <div className="rounded-sm border border-destructive/40 bg-destructive/10 p-3 text-xs text-destructive">
                            {error}
                        </div>
                    ) : (
                        <Textarea
                            readOnly
                            value={signedJwt}
                            placeholder="Signed token will appear here..."
                            className="min-h-[90px] bg-muted/20"
                        />
                    )}
                </div>
            </div>
        </ToolShell>
    );
}
