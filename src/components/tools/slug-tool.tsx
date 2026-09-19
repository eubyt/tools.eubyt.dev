"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ToolShell } from "./tool-shell";
import { generateSlug, type SlugOptions } from "@/lib/tools/slug";
import { useClipboard } from "@/hooks/use-clipboard";
import { useTranslations } from "@/providers/locale";

const SAMPLE_TEXT = "Clean & SEO-Friendly URL Slug Generator 2026!";

export function SlugTool() {
    const t = useTranslations();
    const [input, setInput] = useState(SAMPLE_TEXT);
    const [separator, setSeparator] = useState<string>("-");
    const [casing, setCasing] = useState<
        "lowercase" | "uppercase" | "title" | "preserve"
    >("lowercase");
    const [removeStopWords, setRemoveStopWords] = useState(false);
    const [removeNumbers, setRemoveNumbers] = useState(false);
    const [removeAccents, setRemoveAccents] = useState(true);
    const [trim, setTrim] = useState(true);
    const [maxLength, setMaxLength] = useState<number>(0);

    const { copy, isCopied } = useClipboard();

    const options: SlugOptions = useMemo(
        () => ({
            separator,
            casing,
            removeStopWords,
            removeNumbers,
            removeAccents,
            trim,
            maxLength: maxLength > 0 ? maxLength : 0,
        }),
        [
            separator,
            casing,
            removeStopWords,
            removeNumbers,
            removeAccents,
            trim,
            maxLength,
        ],
    );

    const output = useMemo(
        () => generateSlug(input, options),
        [input, options],
    );

    const inputWordCount = useMemo(() => {
        const trimmed = input.trim();
        return trimmed ? trimmed.split(/\s+/).length : 0;
    }, [input]);

    return (
        <ToolShell
            title={t("tools.url-slug.name")}
            description={t("tools.url-slug.desc")}
            actions={
                <div className="flex items-center gap-2">
                    <Button
                        variant="outline"
                        size="xs"
                        onClick={() => setInput(SAMPLE_TEXT)}
                    >
                        {t("common.sample")}
                    </Button>
                    <Button
                        variant="outline"
                        size="xs"
                        disabled={!output}
                        onClick={() => copy(output, "slug-out")}
                    >
                        {isCopied("slug-out")
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
                {/* Options Toolbar */}
                <div className="flex flex-col gap-3 rounded-sm border border-border/60 bg-muted/10 p-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                        {/* Separator */}
                        <div className="flex flex-col gap-1 text-xs">
                            <label
                                htmlFor="slug-separator"
                                className="text-muted-foreground font-medium"
                            >
                                {t("tools.url-slug.separator")}
                            </label>
                            <Select
                                id="slug-separator"
                                value={separator}
                                onChange={(e) => setSeparator(e.target.value)}
                                className="w-full font-mono text-xs"
                            >
                                <option value="-">
                                    {t("tools.url-slug.hyphen")}
                                </option>
                                <option value="_">
                                    {t("tools.url-slug.underscore")}
                                </option>
                                <option value=".">
                                    {t("tools.url-slug.dot")}
                                </option>
                                <option value="/">
                                    {t("tools.url-slug.slash")}
                                </option>
                                <option value="">
                                    {t("tools.url-slug.none")}
                                </option>
                            </Select>
                        </div>

                        {/* Casing */}
                        <div className="flex flex-col gap-1 text-xs">
                            <label
                                htmlFor="slug-casing"
                                className="text-muted-foreground font-medium"
                            >
                                {t("tools.url-slug.casing")}
                            </label>
                            <Select
                                id="slug-casing"
                                value={casing}
                                onChange={(e) =>
                                    setCasing(
                                        e.target.value as
                                            | "lowercase"
                                            | "uppercase"
                                            | "title"
                                            | "preserve",
                                    )
                                }
                                className="w-full font-mono text-xs"
                            >
                                <option value="lowercase">
                                    {t("common.lowercase")} (abc)
                                </option>
                                <option value="uppercase">
                                    {t("common.uppercase")} (ABC)
                                </option>
                                <option value="title">
                                    {t("tools.url-slug.titleCase")} (Abc)
                                </option>
                                <option value="preserve">
                                    {t("tools.url-slug.preserveCase")} (aBc)
                                </option>
                            </Select>
                        </div>

                        {/* Max Length */}
                        <div className="flex flex-col gap-1 text-xs">
                            <label
                                htmlFor="slug-max-length"
                                className="text-muted-foreground font-medium"
                            >
                                {t("tools.url-slug.maxLength")}
                            </label>
                            <Input
                                id="slug-max-length"
                                type="number"
                                min={0}
                                max={500}
                                value={maxLength === 0 ? "" : maxLength}
                                onChange={(e) => {
                                    const val = parseInt(e.target.value, 10);
                                    setMaxLength(
                                        isNaN(val) || val < 0 ? 0 : val,
                                    );
                                }}
                                placeholder="0"
                                className="font-mono text-xs"
                            />
                        </div>
                    </div>

                    {/* Checkbox Filters */}
                    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 pt-1 text-xs text-muted-foreground border-t border-border/40">
                        <label className="flex items-center gap-1.5 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={removeStopWords}
                                onChange={(e) =>
                                    setRemoveStopWords(e.target.checked)
                                }
                                className="accent-primary"
                            />
                            <span>{t("tools.url-slug.removeStopWords")}</span>
                        </label>

                        <label className="flex items-center gap-1.5 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={removeNumbers}
                                onChange={(e) =>
                                    setRemoveNumbers(e.target.checked)
                                }
                                className="accent-primary"
                            />
                            <span>{t("tools.url-slug.removeNumbers")}</span>
                        </label>

                        <label className="flex items-center gap-1.5 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={removeAccents}
                                onChange={(e) =>
                                    setRemoveAccents(e.target.checked)
                                }
                                className="accent-primary"
                            />
                            <span>{t("tools.url-slug.removeAccents")}</span>
                        </label>

                        <label className="flex items-center gap-1.5 cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={trim}
                                onChange={(e) => setTrim(e.target.checked)}
                                className="accent-primary"
                            />
                            <span>{t("tools.url-slug.trimSeparators")}</span>
                        </label>
                    </div>
                </div>

                {/* Input & Output */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {/* Input */}
                    <div className="flex flex-col gap-1.5">
                        <div className="flex h-6.5 items-center justify-between">
                            <span className="text-xs font-medium text-foreground">
                                {t("common.input")}
                            </span>
                            <span className="text-[0.6875rem] text-muted-foreground">
                                {input.length} {t("common.characters")} •{" "}
                                {inputWordCount} {t("tools.url-slug.words")}
                            </span>
                        </div>
                        <Textarea
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder={t("tools.url-slug.textPlaceholder")}
                            className="min-h-[160px]"
                        />
                    </div>

                    {/* Output */}
                    <div className="flex flex-col gap-1.5">
                        <div className="flex h-6.5 items-center justify-between">
                            <span className="text-xs font-medium text-foreground">
                                {t("common.output")}
                            </span>
                            <span className="text-[0.6875rem] text-muted-foreground">
                                {output.length} {t("common.characters")}
                            </span>
                        </div>
                        <Textarea
                            readOnly
                            value={output}
                            placeholder={t("tools.url-slug.outputPlaceholder")}
                            className="min-h-[160px] bg-muted/20 text-primary font-medium"
                        />
                    </div>
                </div>
            </div>
        </ToolShell>
    );
}
