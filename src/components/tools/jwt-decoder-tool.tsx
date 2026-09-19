"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ToolShell } from "./tool-shell";
import { decodeJwt } from "@/lib/tools/jwt";
import { useClipboard } from "@/hooks/use-clipboard";
import { useTranslations } from "@/providers/locale";

const SAMPLE_JWT =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9." +
    "eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFudGlncmF2aXR5IiwiYWRtaW4iOnRydWUsImlhdCI6MTYxNjIzOTAyMiwiZXhwIjoxOTE2MjM5MDIyfQ." +
    "4mI4k9aJd2eR_5y2n0q8w4b7v9c3x1z6m5k8j2h4g6f";

function renderColoredToken(token: string) {
    if (!token) return null;

    let clean = token;
    let prefix = "";
    if (clean.startsWith("Bearer ")) {
        prefix = "Bearer ";
        clean = clean.slice(7);
    }

    const parts = clean.split(".");
    if (parts.length === 3) {
        return (
            <>
                {prefix && (
                    <span className="text-muted-foreground/60">{prefix}</span>
                )}
                <span className="text-rose-500 dark:text-rose-400 font-medium selection:bg-rose-500/20">
                    {parts[0]}
                </span>
                <span className="text-muted-foreground/50 font-bold select-none">
                    .
                </span>
                <span className="text-purple-500 dark:text-purple-400 font-medium selection:bg-purple-500/20">
                    {parts[1]}
                </span>
                <span className="text-muted-foreground/50 font-bold select-none">
                    .
                </span>
                <span className="text-sky-500 dark:text-sky-400 font-medium selection:bg-sky-500/20">
                    {parts[2]}
                </span>
            </>
        );
    }
    if (parts.length === 2) {
        return (
            <>
                {prefix && (
                    <span className="text-muted-foreground/60">{prefix}</span>
                )}
                <span className="text-rose-500 dark:text-rose-400 font-medium selection:bg-rose-500/20">
                    {parts[0]}
                </span>
                <span className="text-muted-foreground/50 font-bold select-none">
                    .
                </span>
                <span className="text-purple-500 dark:text-purple-400 font-medium selection:bg-purple-500/20">
                    {parts[1]}
                </span>
            </>
        );
    }
    if (parts.length === 1 && parts[0]) {
        return (
            <>
                {prefix && (
                    <span className="text-muted-foreground/60">{prefix}</span>
                )}
                <span className="text-rose-500 dark:text-rose-400 font-medium selection:bg-rose-500/20">
                    {parts[0]}
                </span>
            </>
        );
    }
    return <span className="text-foreground">{token}</span>;
}

export function JwtDecoderTool() {
    const t = useTranslations();
    const [token, setToken] = useState(SAMPLE_JWT);
    const { copy, isCopied } = useClipboard();

    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const backdropRef = useRef<HTMLDivElement>(null);

    const decoded = decodeJwt(token);

    const handleScroll = (e: React.UIEvent<HTMLTextAreaElement>) => {
        if (backdropRef.current) {
            backdropRef.current.scrollTop = e.currentTarget.scrollTop;
            backdropRef.current.scrollLeft = e.currentTarget.scrollLeft;
        }
    };

    useEffect(() => {
        const el = textareaRef.current;
        if (!el) return;
        el.style.height = "auto";
        const newHeight = Math.min(Math.max(el.scrollHeight, 110), 380);
        el.style.height = `${newHeight}px`;
        if (backdropRef.current) {
            backdropRef.current.style.height = `${newHeight}px`;
            backdropRef.current.scrollTop = el.scrollTop;
        }
    }, [token]);

    return (
        <ToolShell
            title={t("tools.jwt-decode.name")}
            description={t("tools.jwt-decode.desc")}
            actions={
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="xs"
                        onClick={() => setToken(SAMPLE_JWT)}
                    >
                        {t("common.sample")}
                    </Button>
                    <Button
                        variant="outline"
                        size="xs"
                        disabled={!token.trim()}
                        onClick={() => copy(token, "jwt-raw-token")}
                    >
                        {isCopied("jwt-raw-token")
                            ? t("common.copied")
                            : t("common.copy")}
                    </Button>
                    <Button
                        variant="outline"
                        size="xs"
                        onClick={() => setToken("")}
                    >
                        {t("common.clear")}
                    </Button>
                </div>
            }
        >
            <div className="flex flex-col gap-6 font-mono">
                {/* Encoded Token Section */}
                <div className="flex flex-col gap-2">
                    {/* Header bar above Encoded Token */}
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                        <div className="flex items-center gap-2.5">
                            <span className="font-semibold text-foreground">
                                {t("tools.jwt-decode.encodedToken")}
                            </span>
                            {/* Color Legend & Segment Counts */}
                            {decoded.validStructure ? (
                                <div className="flex items-center gap-2 text-[0.6875rem] select-none">
                                    <span className="inline-flex items-center gap-1 text-rose-500 dark:text-rose-400">
                                        <span className="inline-block size-1.5 rounded-full bg-rose-500" />
                                        Header ({decoded.rawParts.header.length}
                                        )
                                    </span>
                                    <span className="text-muted-foreground/40">
                                        •
                                    </span>
                                    <span className="inline-flex items-center gap-1 text-purple-500 dark:text-purple-400">
                                        <span className="inline-block size-1.5 rounded-full bg-purple-500" />
                                        Payload (
                                        {decoded.rawParts.payload.length})
                                    </span>
                                    <span className="text-muted-foreground/40">
                                        •
                                    </span>
                                    <span className="inline-flex items-center gap-1 text-sky-500 dark:text-sky-400">
                                        <span className="inline-block size-1.5 rounded-full bg-sky-500" />
                                        Signature (
                                        {decoded.rawParts.signature.length})
                                    </span>
                                </div>
                            ) : token.trim() ? (
                                <span className="text-[0.6875rem] text-muted-foreground">
                                    {decoded.error || "Malformed JWT"}
                                </span>
                            ) : null}
                        </div>
                    </div>

                    {/* Colored Input Box (jwt.io style) */}
                    <div className="relative w-full rounded-sm border border-input bg-card/60 transition-colors focus-within:border-ring focus-within:ring-1 focus-within:ring-ring/50 overflow-hidden">
                        {/* Backdrop layer with colored spans */}
                        <div
                            ref={backdropRef}
                            aria-hidden="true"
                            className="pointer-events-none absolute inset-0 overflow-y-auto overflow-x-hidden p-3 font-mono text-xs leading-relaxed break-all whitespace-pre-wrap select-none scrollbar-none"
                        >
                            {renderColoredToken(token)}
                        </div>

                        {/* Editable textarea on top */}
                        <textarea
                            ref={textareaRef}
                            value={token}
                            onChange={(e) => setToken(e.target.value)}
                            onScroll={handleScroll}
                            spellCheck={false}
                            autoCapitalize="off"
                            autoComplete="off"
                            autoCorrect="off"
                            placeholder={t("tools.jwt-decode.tokenPlaceholder")}
                            className="relative z-10 block w-full min-h-[110px] resize-y bg-transparent p-3 font-mono text-xs leading-relaxed break-all whitespace-pre-wrap text-transparent caret-foreground selection:bg-neutral-500/30 dark:selection:bg-neutral-400/30 placeholder:text-muted-foreground border-0 outline-none focus:outline-none focus:ring-0 ring-0 shadow-none m-0"
                        />
                    </div>
                </div>

                {/* Decoded Sections Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Header (Algorithm & Token Type) */}
                    <div className="flex flex-col gap-1.5">
                        <div className="flex h-6.5 items-center justify-between text-xs">
                            <span className="font-semibold text-rose-500 dark:text-rose-400 flex items-center gap-1.5">
                                <span className="inline-block size-1.5 rounded-full bg-rose-500" />
                                {t("tools.jwt-decode.header")}
                            </span>
                            <Button
                                variant="outline"
                                size="xs"
                                disabled={!decoded.rawHeader}
                                onClick={() =>
                                    copy(
                                        JSON.stringify(decoded.header, null, 2),
                                        "jwt-header",
                                    )
                                }
                                className="h-6 px-2.5 text-[0.6875rem]"
                            >
                                {isCopied("jwt-header")
                                    ? t("common.copied")
                                    : t("common.copy")}
                            </Button>
                        </div>
                        <Textarea
                            readOnly
                            value={
                                decoded.header
                                    ? JSON.stringify(decoded.header, null, 2)
                                    : ""
                            }
                            placeholder="{}"
                            className="min-h-[160px] bg-rose-500/5 border-rose-500/30 text-xs font-mono"
                        />
                    </div>

                    {/* Payload (Claims & Data) */}
                    <div className="flex flex-col gap-1.5">
                        <div className="flex h-6.5 items-center justify-between text-xs">
                            <span className="font-semibold text-purple-500 dark:text-purple-400 flex items-center gap-1.5">
                                <span className="inline-block size-1.5 rounded-full bg-purple-500" />
                                {t("tools.jwt-decode.payload")}
                            </span>
                            <Button
                                variant="outline"
                                size="xs"
                                disabled={!decoded.rawPayload}
                                onClick={() =>
                                    copy(
                                        JSON.stringify(
                                            decoded.payload,
                                            null,
                                            2,
                                        ),
                                        "jwt-payload",
                                    )
                                }
                                className="h-6 px-2.5 text-[0.6875rem]"
                            >
                                {isCopied("jwt-payload")
                                    ? t("common.copied")
                                    : t("common.copy")}
                            </Button>
                        </div>
                        <Textarea
                            readOnly
                            value={
                                decoded.payload
                                    ? JSON.stringify(decoded.payload, null, 2)
                                    : ""
                            }
                            placeholder="{}"
                            className="min-h-[160px] bg-purple-500/5 border-purple-500/30 text-xs font-mono"
                        />
                    </div>
                </div>

                {/* Signature */}
                <div className="flex flex-col gap-1.5">
                    <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold text-sky-500 dark:text-sky-400 flex items-center gap-1.5">
                            <span className="inline-block size-1.5 rounded-full bg-sky-500" />
                            {t("tools.jwt-decode.signature")}
                        </span>
                        <Button
                            variant="outline"
                            size="xs"
                            disabled={!decoded.signature}
                            onClick={() =>
                                copy(decoded.signature, "jwt-signature")
                            }
                            className="h-6 px-2.5 text-[0.6875rem]"
                        >
                            {isCopied("jwt-signature")
                                ? t("common.copied")
                                : t("common.copy")}
                        </Button>
                    </div>
                    <div className="rounded-sm border border-sky-500/30 bg-sky-500/5 p-3 text-xs text-muted-foreground select-all break-all font-mono">
                        {decoded.signature || (
                            <span className="opacity-40">—</span>
                        )}
                    </div>
                </div>
            </div>
        </ToolShell>
    );
}
