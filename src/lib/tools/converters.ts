// Base64 with UTF-8 support
export function base64Encode(text: string, urlSafe = false): string {
    if (!text) return "";
    const bytes = new TextEncoder().encode(text);
    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    let encoded = btoa(binary);
    if (urlSafe) {
        encoded = encoded
            .replace(/\+/g, "-")
            .replace(/\//g, "_")
            .replace(/=+$/, "");
    }
    return encoded;
}

export function base64Decode(b64: string, urlSafe = false): string {
    if (!b64) return "";
    let clean = b64.trim();
    if (urlSafe || clean.includes("-") || clean.includes("_")) {
        clean = clean.replace(/-/g, "+").replace(/_/g, "/");
        while (clean.length % 4) {
            clean += "=";
        }
    }
    const binary = atob(clean);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
}

// URL Encode / Decode
export function urlEncode(text: string, fullUri = false): string {
    if (!text) return "";
    return fullUri ? encodeURI(text) : encodeURIComponent(text);
}

export function urlDecode(text: string): string {
    if (!text) return "";
    try {
        return decodeURIComponent(text.replace(/\+/g, " "));
    } catch {
        return decodeURI(text);
    }
}

// Hex <-> Text
export type HexDelimiter = "none" | "space" | "prefix" | "colon";

export function textToHex(
    text: string,
    delimiter: HexDelimiter = "space",
): string {
    if (!text) return "";
    const bytes = new TextEncoder().encode(text);
    const hexArray = Array.from(bytes).map((b) =>
        b.toString(16).padStart(2, "0"),
    );

    switch (delimiter) {
        case "none":
            return hexArray.join("");
        case "space":
            return hexArray.join(" ");
        case "prefix":
            return hexArray.map((h) => `0x${h}`).join(" ");
        case "colon":
            return hexArray.join(":");
        default:
            return hexArray.join(" ");
    }
}

export function hexToText(hex: string): string {
    if (!hex) return "";
    const clean = hex.replace(/0x/gi, "").replace(/[^0-9a-fA-F]/g, "");

    if (clean.length === 0) return "";
    if (clean.length % 2 !== 0) {
        throw new Error("Invalid hex string: odd number of characters");
    }

    const bytes = new Uint8Array(clean.length / 2);
    for (let i = 0; i < clean.length; i += 2) {
        bytes[i / 2] = parseInt(clean.substring(i, i + 2), 16);
    }

    return new TextDecoder().decode(bytes);
}
