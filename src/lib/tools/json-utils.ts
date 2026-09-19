import yaml from "js-yaml";
import { XMLParser, XMLBuilder } from "fast-xml-parser";
import * as toml from "smol-toml";

export type JsonIndent = "2" | "4" | "tab";

export function formatJson(input: string, indent: JsonIndent = "2"): string {
    if (!input || !input.trim()) return "";
    const parsed = JSON.parse(input);
    const space = indent === "tab" ? "\t" : parseInt(indent, 10);
    return JSON.stringify(parsed, null, space);
}

export function minifyJson(input: string): string {
    if (!input || !input.trim()) return "";
    const parsed = JSON.parse(input);
    return JSON.stringify(parsed);
}

export type ValidationResult = {
    valid: boolean;
    error?: string;
    line?: number;
    column?: number;
};

export function validateJson(input: string): ValidationResult {
    if (!input || !input.trim()) {
        return { valid: true };
    }
    try {
        JSON.parse(input);
        return { valid: true };
    } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        let line: number | undefined;
        let column: number | undefined;

        // Extract line/column from error messages if available (e.g. "at position 42 (line 3 column 5)")
        const match = msg.match(/line (\d+) column (\d+)/i);
        if (match) {
            line = parseInt(match[1], 10);
            column = parseInt(match[2], 10);
        } else {
            const posMatch = msg.match(/position (\d+)/i);
            if (posMatch) {
                const pos = parseInt(posMatch[1], 10);
                const upToPos = input.slice(0, pos);
                const lines = upToPos.split("\n");
                line = lines.length;
                column = lines[lines.length - 1].length + 1;
            }
        }

        return {
            valid: false,
            error: msg,
            line,
            column,
        };
    }
}

// JSON Diff
export type DiffType = "added" | "removed" | "changed" | "unchanged";

export type DiffEntry = {
    path: string;
    type: DiffType;
    oldValue?: unknown;
    newValue?: unknown;
};

export function diffJson(obj1: unknown, obj2: unknown, path = ""): DiffEntry[] {
    const diffs: DiffEntry[] = [];

    if (obj1 === obj2) return diffs;

    if (typeof obj1 !== typeof obj2 || obj1 === null || obj2 === null) {
        diffs.push({
            path: path || "/",
            type: "changed",
            oldValue: obj1,
            newValue: obj2,
        });
        return diffs;
    }

    if (typeof obj1 !== "object") {
        if (obj1 !== obj2) {
            diffs.push({
                path: path || "/",
                type: "changed",
                oldValue: obj1,
                newValue: obj2,
            });
        }
        return diffs;
    }

    const o1 = obj1 as Record<string, unknown>;
    const o2 = obj2 as Record<string, unknown>;

    const keys1 = Object.keys(o1);
    const keys2 = Object.keys(o2);
    const allKeys = Array.from(new Set([...keys1, ...keys2]));

    for (const key of allKeys) {
        const currentPath = path ? `${path}.${key}` : key;
        const has1 = key in o1;
        const has2 = key in o2;

        if (has1 && !has2) {
            diffs.push({
                path: currentPath,
                type: "removed",
                oldValue: o1[key],
            });
        } else if (!has1 && has2) {
            diffs.push({ path: currentPath, type: "added", newValue: o2[key] });
        } else {
            const subDiffs = diffJson(o1[key], o2[key], currentPath);
            diffs.push(...subDiffs);
        }
    }

    return diffs;
}

// JSON <-> YAML
export function jsonToYaml(jsonStr: string): string {
    if (!jsonStr.trim()) return "";
    const parsed = JSON.parse(jsonStr);
    return yaml.dump(parsed, { indent: 2, lineWidth: -1 });
}

export function yamlToJson(yamlStr: string, indent: JsonIndent = "2"): string {
    if (!yamlStr.trim()) return "";
    const loaded = yaml.load(yamlStr);
    const space = indent === "tab" ? "\t" : parseInt(indent, 10);
    return JSON.stringify(loaded, null, space);
}

// JSON <-> XML
export function jsonToXml(jsonStr: string, rootTag = "root"): string {
    if (!jsonStr.trim()) return "";
    const parsed = JSON.parse(jsonStr);
    const builder = new XMLBuilder({
        ignoreAttributes: false,
        format: true,
        indentBy: "  ",
        suppressEmptyNode: true,
    });
    const wrapper = { [rootTag]: parsed };
    return builder.build(wrapper);
}

export function xmlToJson(xmlStr: string, indent: JsonIndent = "2"): string {
    if (!xmlStr.trim()) return "";
    const parser = new XMLParser({
        ignoreAttributes: false,
        attributeNamePrefix: "@_",
    });
    const parsed = parser.parse(xmlStr);
    const space = indent === "tab" ? "\t" : parseInt(indent, 10);
    return JSON.stringify(parsed, null, space);
}

// JSON <-> CSV
export function jsonToCsv(jsonStr: string, delimiter = ","): string {
    if (!jsonStr.trim()) return "";
    let data = JSON.parse(jsonStr);
    if (!Array.isArray(data)) {
        if (typeof data === "object" && data !== null) {
            data = [data];
        } else {
            throw new Error("JSON must be an array of objects or an object");
        }
    }

    if (data.length === 0) return "";

    const headers: string[] = Array.from(
        new Set(
            data.flatMap((item: unknown) =>
                typeof item === "object" && item !== null
                    ? Object.keys(item)
                    : [],
            ),
        ),
    );

    const escapeCsv = (val: unknown): string => {
        if (val === null || val === undefined) return "";
        const str = typeof val === "object" ? JSON.stringify(val) : String(val);
        if (
            str.includes(delimiter) ||
            str.includes('"') ||
            str.includes("\n")
        ) {
            return `"${str.replace(/"/g, '""')}"`;
        }
        return str;
    };

    const headerLine = headers.map(escapeCsv).join(delimiter);
    const rows = data.map((item: Record<string, unknown>) =>
        headers.map((h: string) => escapeCsv(item[h])).join(delimiter),
    );

    return [headerLine, ...rows].join("\n");
}

export function csvToJson(
    csvStr: string,
    delimiter = ",",
    indent: JsonIndent = "2",
): string {
    if (!csvStr.trim()) return "[]";
    const lines = csvStr.trim().split(/\r?\n/);
    if (lines.length === 0) return "[]";

    const parseLine = (line: string): string[] => {
        const result: string[] = [];
        let current = "";
        let inQuotes = false;

        for (let i = 0; i < line.length; i++) {
            const char = line[i];
            if (char === '"') {
                if (inQuotes && line[i + 1] === '"') {
                    current += '"';
                    i++;
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (char === delimiter && !inQuotes) {
                result.push(current);
                current = "";
            } else {
                current += char;
            }
        }
        result.push(current);
        return result;
    };

    const headers = parseLine(lines[0]).map((h) => h.trim());
    const items = lines.slice(1).map((line) => {
        const values = parseLine(line);
        const obj: Record<string, unknown> = {};
        headers.forEach((h, idx) => {
            const raw = values[idx]?.trim() ?? "";
            // simple type conversion
            if (raw === "true") obj[h] = true;
            else if (raw === "false") obj[h] = false;
            else if (raw !== "" && !isNaN(Number(raw))) obj[h] = Number(raw);
            else obj[h] = raw;
        });
        return obj;
    });

    const space = indent === "tab" ? "\t" : parseInt(indent, 10);
    return JSON.stringify(items, null, space);
}

// JSON <-> TOML
export function jsonToToml(jsonStr: string): string {
    if (!jsonStr.trim()) return "";
    const parsed = JSON.parse(jsonStr);
    if (
        typeof parsed !== "object" ||
        parsed === null ||
        Array.isArray(parsed)
    ) {
        throw new Error("TOML root must be a key-value table (JSON object)");
    }
    return toml.stringify(parsed);
}

export function tomlToJson(tomlStr: string, indent: JsonIndent = "2"): string {
    if (!tomlStr.trim()) return "{}";
    const parsed = toml.parse(tomlStr);
    const space = indent === "tab" ? "\t" : parseInt(indent, 10);
    return JSON.stringify(parsed, null, space);
}
