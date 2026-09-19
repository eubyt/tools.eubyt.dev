import CryptoJS from "crypto-js";

export type HashResults = {
    md5: string;
    sha1: string;
    sha256: string;
    sha384: string;
    sha512: string;
};

export function computeHashes(input: string, uppercase = false): HashResults {
    if (!input) {
        return {
            md5: "",
            sha1: "",
            sha256: "",
            sha384: "",
            sha512: "",
        };
    }

    const md5 = CryptoJS.MD5(input).toString();
    const sha1 = CryptoJS.SHA1(input).toString();
    const sha256 = CryptoJS.SHA256(input).toString();
    const sha384 = CryptoJS.SHA384(input).toString();
    const sha512 = CryptoJS.SHA512(input).toString();

    if (uppercase) {
        return {
            md5: md5.toUpperCase(),
            sha1: sha1.toUpperCase(),
            sha256: sha256.toUpperCase(),
            sha384: sha384.toUpperCase(),
            sha512: sha512.toUpperCase(),
        };
    }

    return { md5, sha1, sha256, sha384, sha512 };
}
