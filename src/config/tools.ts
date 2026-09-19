export type ToolCategory = "crypto" | "encoding" | "json" | "generators";

export type ToolItem = {
    id: string;
    titleKey: string;
    descKey: string;
    category: ToolCategory;
    path: string;
    badge?: string;
    keywords: string[];
};

export const TOOL_CATEGORIES: { id: "all" | ToolCategory; labelKey: string }[] =
    [
        { id: "all", labelKey: "categories.all" },
        { id: "crypto", labelKey: "categories.crypto" },
        { id: "encoding", labelKey: "categories.encoding" },
        { id: "json", labelKey: "categories.json" },
        { id: "generators", labelKey: "categories.generators" },
    ];

export const TOOLS: ToolItem[] = [
    // Hash & Crypto
    {
        id: "hash-gen",
        titleKey: "tools.hash-gen.name",
        descKey: "tools.hash-gen.desc",
        category: "crypto",
        path: "/hash-gen",
        badge: "MD5 • SHA-256",
        keywords: [
            "hash",
            "md5",
            "sha1",
            "sha256",
            "sha384",
            "sha512",
            "digest",
            "checksum",
        ],
    },
    {
        id: "hmac",
        titleKey: "tools.hmac.name",
        descKey: "tools.hmac.desc",
        category: "crypto",
        path: "/hmac",
        badge: "HMAC",
        keywords: ["hmac", "mac", "signature", "sha256", "secret", "crypto"],
    },
    {
        id: "jwt-decode",
        titleKey: "tools.jwt-decode.name",
        descKey: "tools.jwt-decode.desc",
        category: "crypto",
        path: "/jwt-decode",
        badge: "JWT",
        keywords: [
            "jwt",
            "token",
            "decode",
            "claims",
            "bearer",
            "header",
            "payload",
        ],
    },
    {
        id: "jwt-generator",
        titleKey: "tools.jwt-generator.name",
        descKey: "tools.jwt-generator.desc",
        category: "crypto",
        path: "/jwt-generator",
        badge: "HS256",
        keywords: [
            "jwt",
            "generator",
            "sign",
            "encode",
            "hs256",
            "hs384",
            "hs512",
        ],
    },
    {
        id: "aes",
        titleKey: "tools.aes.name",
        descKey: "tools.aes.desc",
        category: "crypto",
        path: "/aes",
        badge: "AES-256",
        keywords: [
            "aes",
            "encrypt",
            "decrypt",
            "cipher",
            "gcm",
            "cbc",
            "crypto",
        ],
    },
    {
        id: "bcrypt",
        titleKey: "tools.bcrypt.name",
        descKey: "tools.bcrypt.desc",
        category: "crypto",
        path: "/bcrypt",
        badge: "Bcrypt",
        keywords: ["bcrypt", "hash", "salt", "verify", "password", "security"],
    },
    {
        id: "random-hash",
        titleKey: "tools.random-hash.name",
        descKey: "tools.random-hash.desc",
        category: "crypto",
        path: "/random-hash",
        badge: "Entropy",
        keywords: [
            "random",
            "hash",
            "secret",
            "token",
            "apikey",
            "hex",
            "base64",
        ],
    },

    // Generators
    {
        id: "uuid",
        titleKey: "tools.uuid.name",
        descKey: "tools.uuid.desc",
        category: "generators",
        path: "/uuid",
        badge: "v4 • v7 • v1",
        keywords: ["uuid", "guid", "v4", "v7", "v1", "id", "generator"],
    },

    // Encoding
    {
        id: "base64",
        titleKey: "tools.base64.name",
        descKey: "tools.base64.desc",
        category: "encoding",
        path: "/base64",
        badge: "Base64",
        keywords: ["base64", "b64", "encode", "decode", "url-safe", "binary"],
    },
    {
        id: "url-encode",
        titleKey: "tools.url-encode.name",
        descKey: "tools.url-encode.desc",
        category: "encoding",
        path: "/url-encode",
        badge: "Percent",
        keywords: ["url", "encode", "decode", "uri", "querystring", "percent"],
    },
    {
        id: "hex-text",
        titleKey: "tools.hex-text.name",
        descKey: "tools.hex-text.desc",
        category: "encoding",
        path: "/hex-text",
        badge: "Hex",
        keywords: ["hex", "hexadecimal", "text", "binary", "ascii", "bytes"],
    },

    // JSON & Data
    {
        id: "json-formatter",
        titleKey: "tools.json-formatter.name",
        descKey: "tools.json-formatter.desc",
        category: "json",
        path: "/json-formatter",
        badge: "JSON",
        keywords: ["json", "format", "beautify", "prettify", "indent"],
    },
    {
        id: "json-minifier",
        titleKey: "tools.json-minifier.name",
        descKey: "tools.json-minifier.desc",
        category: "json",
        path: "/json-minifier",
        badge: "JSON",
        keywords: ["json", "minify", "compress", "compact"],
    },
    {
        id: "json-validator",
        titleKey: "tools.json-validator.name",
        descKey: "tools.json-validator.desc",
        category: "json",
        path: "/json-validator",
        badge: "JSON",
        keywords: ["json", "validate", "syntax", "lint", "parser", "check"],
    },
    {
        id: "json-diff",
        titleKey: "tools.json-diff.name",
        descKey: "tools.json-diff.desc",
        category: "json",
        path: "/json-diff",
        badge: "Diff",
        keywords: ["json", "diff", "compare", "patch", "difference"],
    },
    {
        id: "json-yaml",
        titleKey: "tools.json-yaml.name",
        descKey: "tools.json-yaml.desc",
        category: "json",
        path: "/json-yaml",
        badge: "YAML",
        keywords: ["json", "yaml", "yml", "convert", "bidirectional"],
    },
    {
        id: "json-xml",
        titleKey: "tools.json-xml.name",
        descKey: "tools.json-xml.desc",
        category: "json",
        path: "/json-xml",
        badge: "XML",
        keywords: ["json", "xml", "convert", "bidirectional"],
    },
    {
        id: "json-csv",
        titleKey: "tools.json-csv.name",
        descKey: "tools.json-csv.desc",
        category: "json",
        path: "/json-csv",
        badge: "CSV",
        keywords: ["json", "csv", "table", "excel", "convert", "array"],
    },
    {
        id: "json-toml",
        titleKey: "tools.json-toml.name",
        descKey: "tools.json-toml.desc",
        category: "json",
        path: "/json-toml",
        badge: "TOML",
        keywords: ["json", "toml", "convert", "config"],
    },
];

export function getToolById(id: string): ToolItem | undefined {
    return TOOLS.find((t) => t.id === id);
}
