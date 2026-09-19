import CryptoJS from "crypto-js";
import bcrypt from "bcryptjs";

export type HmacAlgorithm = "MD5" | "SHA1" | "SHA256" | "SHA384" | "SHA512";

export function computeHmac(
    message: string,
    key: string,
    algorithm: HmacAlgorithm,
    uppercase = false,
): string {
    if (!message || !key) return "";

    let hash: CryptoJS.lib.WordArray;
    switch (algorithm) {
        case "MD5":
            hash = CryptoJS.HmacMD5(message, key);
            break;
        case "SHA1":
            hash = CryptoJS.HmacSHA1(message, key);
            break;
        case "SHA256":
            hash = CryptoJS.HmacSHA256(message, key);
            break;
        case "SHA384":
            hash = CryptoJS.HmacSHA384(message, key);
            break;
        case "SHA512":
            hash = CryptoJS.HmacSHA512(message, key);
            break;
        default:
            hash = CryptoJS.HmacSHA256(message, key);
    }

    const res = hash.toString();
    return uppercase ? res.toUpperCase() : res;
}

export function aesEncrypt(
    message: string,
    secret: string,
    ivText?: string,
): string {
    if (!message || !secret) return "";
    if (ivText) {
        const iv = CryptoJS.enc.Utf8.parse(ivText.padEnd(16, "0").slice(0, 16));
        const encrypted = CryptoJS.AES.encrypt(message, secret, { iv });
        return encrypted.toString();
    }
    return CryptoJS.AES.encrypt(message, secret).toString();
}

export function aesDecrypt(
    ciphertext: string,
    secret: string,
    ivText?: string,
): string {
    if (!ciphertext || !secret) return "";
    try {
        if (ivText) {
            const iv = CryptoJS.enc.Utf8.parse(
                ivText.padEnd(16, "0").slice(0, 16),
            );
            const decrypted = CryptoJS.AES.decrypt(ciphertext, secret, { iv });
            return decrypted.toString(CryptoJS.enc.Utf8);
        }
        const decrypted = CryptoJS.AES.decrypt(ciphertext, secret);
        return decrypted.toString(CryptoJS.enc.Utf8);
    } catch {
        throw new Error(
            "Failed to decrypt ciphertext. Verify the key or ciphertext.",
        );
    }
}

export async function generateBcryptHash(
    password: string,
    rounds = 10,
): Promise<string> {
    if (!password) return "";
    const salt = await bcrypt.genSalt(rounds);
    return bcrypt.hash(password, salt);
}

export async function verifyBcryptHash(
    password: string,
    hash: string,
): Promise<boolean> {
    if (!password || !hash) return false;
    return bcrypt.compare(password, hash);
}

export function parseBcryptHash(hash: string): {
    valid: boolean;
    cost?: number;
    salt?: string;
} {
    const regex =
        /^\$2[aby]?\$(\d{2})\$([./A-Za-z0-9]{22})([./A-Za-z0-9]{31})$/;
    const match = hash.match(regex);
    if (!match) {
        return { valid: false };
    }
    return {
        valid: true,
        cost: parseInt(match[1], 10),
        salt: match[2],
    };
}

export type RandomTokenType = "hex" | "base64" | "base62" | "apiKey";

export function generateRandomToken(
    length = 32,
    type: RandomTokenType = "hex",
    prefix = "sec_",
): string {
    const bytes = new Uint8Array(length);
    if (typeof window !== "undefined" && window.crypto) {
        window.crypto.getRandomValues(bytes);
    } else {
        // Fallback for Node environment
        for (let i = 0; i < length; i++) {
            bytes[i] = Math.floor(Math.random() * 256);
        }
    }

    if (type === "hex") {
        return Array.from(bytes)
            .map((b) => b.toString(16).padStart(2, "0"))
            .join("")
            .slice(0, length);
    }

    if (type === "base64") {
        let binary = "";
        for (let i = 0; i < bytes.length; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary).slice(0, length);
    }

    if (type === "apiKey") {
        const chars =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        let str = prefix;
        for (let i = 0; i < length; i++) {
            str += chars.charAt(bytes[i] % chars.length);
        }
        return str;
    }

    // base62
    const chars =
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    let str = "";
    for (let i = 0; i < length; i++) {
        str += chars.charAt(bytes[i] % chars.length);
    }
    return str;
}
