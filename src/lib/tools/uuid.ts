import { v1 as uuidv1, v4 as uuidv4, v7 as uuidv7 } from "uuid";

export type UuidVersion = "v4" | "v7" | "v1";

export type UuidOptions = {
    version: UuidVersion;
    count: number;
    hyphens: boolean;
    uppercase: boolean;
};

export function generateUuids(options: UuidOptions): string[] {
    const { version, count, hyphens, uppercase } = options;
    const qty = Math.max(1, Math.min(count, 500));
    const results: string[] = [];

    for (let i = 0; i < qty; i++) {
        let id: string;
        if (version === "v7") {
            id = uuidv7();
        } else if (version === "v1") {
            id = uuidv1();
        } else {
            id = uuidv4();
        }

        if (!hyphens) {
            id = id.replace(/-/g, "");
        }
        if (uppercase) {
            id = id.toUpperCase();
        } else {
            id = id.toLowerCase();
        }
        results.push(id);
    }

    return results;
}
