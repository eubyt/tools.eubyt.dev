import CryptoJS from "crypto-js";

export type JwtTimeClaimInfo = {
    claim: "exp" | "iat" | "nbf";
    unix: number;
    iso: string;
    utc: string;
    local: string;
    relativeEn: string;
    relativePt: string;
};

export type TokenStatusType =
    "active" | "expired" | "not-yet-valid" | "no-expiry" | "malformed";

export type DecodedJwt = {
    validStructure: boolean;
    header: Record<string, unknown> | null;
    payload: Record<string, unknown> | null;
    signature: string;
    rawHeader: string;
    rawPayload: string;
    rawParts: {
        header: string;
        payload: string;
        signature: string;
    };
    // Detailed Timing Claims
    expClaim?: JwtTimeClaimInfo;
    iatClaim?: JwtTimeClaimInfo;
    nbfClaim?: JwtTimeClaimInfo;
    // Status
    status: TokenStatusType;
    isExpired?: boolean;
    issuedAtDate?: string;
    expiresAtDate?: string;
    // Lifespan & Timeline
    lifespanSeconds?: number;
    lifespanEn?: string;
    lifespanPt?: string;
    elapsedSeconds?: number;
    elapsedPercentage?: number; // 0 to 100
    remainingSeconds?: number;
    remainingEn?: string;
    remainingPt?: string;
    // Standard Registered Claims
    algorithm?: string;
    tokenType?: string;
    issuer?: string;
    subject?: string;
    audience?: string;
    jwtId?: string;
    keyId?: string;
    error?: string;
};

function base64UrlDecode(str: string): string {
    let base64 = str.replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) {
        base64 += "=";
    }
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
        bytes[i] = binary.charCodeAt(i);
    }
    return new TextDecoder().decode(bytes);
}

function base64UrlEncode(str: string): string {
    const bytes = new TextEncoder().encode(str);
    let binary = "";
    for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return btoa(binary)
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
}

function wordArrayToBase64Url(wordArray: CryptoJS.lib.WordArray): string {
    return CryptoJS.enc.Base64.stringify(wordArray)
        .replace(/\+/g, "-")
        .replace(/\//g, "_")
        .replace(/=+$/, "");
}

export function formatRelativeTime(
    targetUnixSec: number,
    lang: "en" | "pt" = "en",
): string {
    const nowSec = Math.floor(Date.now() / 1000);
    const diffSec = targetUnixSec - nowSec;
    const isPast = diffSec < 0;
    const absDiff = Math.abs(diffSec);

    const minute = 60;
    const hour = 3600;
    const day = 86400;
    const month = 86400 * 30.4375;
    const year = 86400 * 365.25;

    let value = 0;
    let unitEn = "";
    let unitPt = "";

    if (absDiff < 45) {
        return lang === "pt"
            ? isPast
                ? "agora há pouco"
                : "em instantes"
            : isPast
              ? "just now"
              : "in a few seconds";
    } else if (absDiff < 90 * minute) {
        value = Math.round(absDiff / minute);
        unitEn = value === 1 ? "minute" : "minutes";
        unitPt = value === 1 ? "minuto" : "minutos";
    } else if (absDiff < 24 * hour) {
        value = Math.round(absDiff / hour);
        unitEn = value === 1 ? "hour" : "hours";
        unitPt = value === 1 ? "hora" : "horas";
    } else if (absDiff < 30 * day) {
        value = Math.round(absDiff / day);
        unitEn = value === 1 ? "day" : "days";
        unitPt = value === 1 ? "dia" : "dias";
    } else if (absDiff < 365 * day) {
        value = Math.round(absDiff / month);
        unitEn = value === 1 ? "month" : "months";
        unitPt = value === 1 ? "mês" : "meses";
    } else {
        const raw = absDiff / year;
        value = raw < 10 ? Math.round(raw * 10) / 10 : Math.round(raw);
        unitEn = value === 1 ? "year" : "years";
        unitPt = value === 1 ? "ano" : "anos";
    }

    if (lang === "pt") {
        return isPast ? `há ${value} ${unitPt}` : `em ${value} ${unitPt}`;
    }
    return isPast ? `${value} ${unitEn} ago` : `in ${value} ${unitEn}`;
}

export function formatDuration(
    durationSec: number,
    lang: "en" | "pt" = "en",
): string {
    const minute = 60;
    const hour = 3600;
    const day = 86400;
    const year = 86400 * 365.25;

    if (durationSec < minute) {
        return `${durationSec}s`;
    }
    if (durationSec < hour) {
        const mins = Math.floor(durationSec / minute);
        const secs = durationSec % minute;
        return secs > 0
            ? `${mins}m ${secs}s`
            : lang === "pt"
              ? `${mins} min`
              : `${mins} min`;
    }
    if (durationSec < day) {
        const hours = Math.floor(durationSec / hour);
        const mins = Math.floor((durationSec % hour) / minute);
        return mins > 0
            ? `${hours}h ${mins}m`
            : lang === "pt"
              ? `${hours} horas`
              : `${hours} hours`;
    }
    if (durationSec < year) {
        const days = Math.floor(durationSec / day);
        const hours = Math.floor((durationSec % day) / hour);
        return hours > 0
            ? `${days}d ${hours}h`
            : lang === "pt"
              ? `${days} dias`
              : `${days} days`;
    }
    const years = (durationSec / year).toFixed(1).replace(/\.0$/, "");
    return lang === "pt"
        ? `${years} ano${Number(years) > 1 ? "s" : ""}`
        : `${years} year${Number(years) > 1 ? "s" : ""}`;
}

function parseTimeClaim(
    claim: "exp" | "iat" | "nbf",
    rawValue: unknown,
): JwtTimeClaimInfo | undefined {
    let unix: number | undefined;
    if (typeof rawValue === "number" && !isNaN(rawValue)) {
        unix = Math.floor(rawValue);
    } else if (typeof rawValue === "string" && !isNaN(Number(rawValue))) {
        unix = Math.floor(Number(rawValue));
    }

    if (unix === undefined) return undefined;

    const date = new Date(unix * 1000);
    if (isNaN(date.getTime())) return undefined;

    return {
        claim,
        unix,
        iso: date.toISOString(),
        utc: date.toUTCString(),
        local: date.toLocaleString(),
        relativeEn: formatRelativeTime(unix, "en"),
        relativePt: formatRelativeTime(unix, "pt"),
    };
}

export function decodeJwt(token: string): DecodedJwt {
    const emptyResult: DecodedJwt = {
        validStructure: false,
        header: null,
        payload: null,
        signature: "",
        rawHeader: "",
        rawPayload: "",
        rawParts: { header: "", payload: "", signature: "" },
        status: "malformed",
    };

    if (!token || !token.trim()) {
        return emptyResult;
    }

    let cleanToken = token.trim();
    if (cleanToken.startsWith("Bearer ")) {
        cleanToken = cleanToken.slice(7).trim();
    }

    const parts = cleanToken.split(".");
    if (parts.length !== 3) {
        return {
            ...emptyResult,
            signature: parts[2] || "",
            rawParts: {
                header: parts[0] || "",
                payload: parts[1] || "",
                signature: parts[2] || "",
            },
            error: "JWT must contain 3 parts separated by dots.",
        };
    }

    const rawParts = {
        header: parts[0],
        payload: parts[1],
        signature: parts[2],
    };

    try {
        const rawHeader = base64UrlDecode(parts[0]);
        const rawPayload = base64UrlDecode(parts[1]);
        const header = JSON.parse(rawHeader) as Record<string, unknown>;
        const payload = JSON.parse(rawPayload) as Record<string, unknown>;

        const expClaim = parseTimeClaim("exp", payload.exp);
        const iatClaim = parseTimeClaim("iat", payload.iat);
        const nbfClaim = parseTimeClaim("nbf", payload.nbf);

        const nowSec = Math.floor(Date.now() / 1000);

        let status: TokenStatusType = "no-expiry";
        let isExpired: boolean | undefined = undefined;

        if (nbfClaim && nowSec < nbfClaim.unix) {
            status = "not-yet-valid";
            isExpired = false;
        } else if (expClaim) {
            if (nowSec >= expClaim.unix) {
                status = "expired";
                isExpired = true;
            } else {
                status = "active";
                isExpired = false;
            }
        }

        let lifespanSeconds: number | undefined;
        let lifespanEn: string | undefined;
        let lifespanPt: string | undefined;
        let elapsedSeconds: number | undefined;
        let elapsedPercentage: number | undefined;
        let remainingSeconds: number | undefined;
        let remainingEn: string | undefined;
        let remainingPt: string | undefined;

        if (expClaim && iatClaim && expClaim.unix > iatClaim.unix) {
            lifespanSeconds = expClaim.unix - iatClaim.unix;
            lifespanEn = formatDuration(lifespanSeconds, "en");
            lifespanPt = formatDuration(lifespanSeconds, "pt");

            elapsedSeconds = Math.max(0, nowSec - iatClaim.unix);
            elapsedPercentage = Math.min(
                100,
                Math.max(
                    0,
                    Math.round((elapsedSeconds / lifespanSeconds) * 100),
                ),
            );

            remainingSeconds = Math.max(0, expClaim.unix - nowSec);
            remainingEn = formatDuration(remainingSeconds, "en");
            remainingPt = formatDuration(remainingSeconds, "pt");
        } else if (expClaim) {
            remainingSeconds = Math.max(0, expClaim.unix - nowSec);
            remainingEn = formatDuration(remainingSeconds, "en");
            remainingPt = formatDuration(remainingSeconds, "pt");
        }

        const algorithm =
            typeof header.alg === "string" ? header.alg : undefined;
        const tokenType =
            typeof header.typ === "string" ? header.typ : undefined;
        const keyId = typeof header.kid === "string" ? header.kid : undefined;
        const issuer =
            typeof payload.iss === "string" ? payload.iss : undefined;
        const subject =
            typeof payload.sub === "string" || typeof payload.sub === "number"
                ? String(payload.sub)
                : undefined;
        const audience = Array.isArray(payload.aud)
            ? payload.aud.join(", ")
            : typeof payload.aud === "string"
              ? payload.aud
              : undefined;
        const jwtId = typeof payload.jti === "string" ? payload.jti : undefined;

        return {
            validStructure: true,
            header,
            payload,
            signature: parts[2],
            rawHeader,
            rawPayload,
            rawParts,
            expClaim,
            iatClaim,
            nbfClaim,
            status,
            isExpired,
            issuedAtDate: iatClaim?.iso,
            expiresAtDate: expClaim?.iso,
            lifespanSeconds,
            lifespanEn,
            lifespanPt,
            elapsedSeconds,
            elapsedPercentage,
            remainingSeconds,
            remainingEn,
            remainingPt,
            algorithm,
            tokenType,
            issuer,
            subject,
            audience,
            jwtId,
            keyId,
        };
    } catch (err: unknown) {
        return {
            ...emptyResult,
            signature: parts[2] || "",
            rawParts,
            error:
                err instanceof Error
                    ? err.message
                    : "Invalid JWT encoding or JSON",
        };
    }
}

export type JwtSignAlg = "HS256" | "HS384" | "HS512";

export function generateJwt(
    headerObj: Record<string, unknown>,
    payloadObj: Record<string, unknown>,
    secret: string,
    alg: JwtSignAlg = "HS256",
): string {
    const headerStr = JSON.stringify({ ...headerObj, alg, typ: "JWT" });
    const payloadStr = JSON.stringify(payloadObj);

    const encHeader = base64UrlEncode(headerStr);
    const encPayload = base64UrlEncode(payloadStr);
    const dataToSign = `${encHeader}.${encPayload}`;

    let hash: CryptoJS.lib.WordArray;
    if (alg === "HS384") {
        hash = CryptoJS.HmacSHA384(dataToSign, secret);
    } else if (alg === "HS512") {
        hash = CryptoJS.HmacSHA512(dataToSign, secret);
    } else {
        hash = CryptoJS.HmacSHA256(dataToSign, secret);
    }

    const signature = wordArrayToBase64Url(hash);
    return `${dataToSign}.${signature}`;
}
