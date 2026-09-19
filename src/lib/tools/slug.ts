export interface SlugOptions {
    separator?: string;
    casing?: "lowercase" | "uppercase" | "title" | "preserve";
    removeNumbers?: boolean;
    removeStopWords?: boolean;
    removeAccents?: boolean;
    trim?: boolean;
    maxLength?: number;
}

export const STOP_WORDS = new Set([
    // English
    "a",
    "about",
    "above",
    "after",
    "again",
    "against",
    "all",
    "am",
    "an",
    "and",
    "any",
    "are",
    "aren't",
    "as",
    "at",
    "be",
    "because",
    "been",
    "before",
    "being",
    "below",
    "between",
    "both",
    "but",
    "by",
    "can't",
    "cannot",
    "could",
    "couldn't",
    "did",
    "didn't",
    "do",
    "does",
    "doesn't",
    "doing",
    "don't",
    "down",
    "during",
    "each",
    "few",
    "for",
    "from",
    "further",
    "had",
    "hadn't",
    "has",
    "hasn't",
    "have",
    "haven't",
    "having",
    "he",
    "he'd",
    "he'll",
    "he's",
    "her",
    "here",
    "here's",
    "hers",
    "herself",
    "him",
    "himself",
    "his",
    "how",
    "how's",
    "i",
    "i'd",
    "i'll",
    "i'm",
    "i've",
    "if",
    "in",
    "into",
    "is",
    "isn't",
    "it",
    "it's",
    "its",
    "itself",
    "let's",
    "me",
    "more",
    "most",
    "mustn't",
    "my",
    "myself",
    "no",
    "nor",
    "not",
    "of",
    "off",
    "on",
    "once",
    "only",
    "or",
    "other",
    "ought",
    "our",
    "ours",
    "ourselves",
    "out",
    "over",
    "own",
    "same",
    "shan't",
    "she",
    "she'd",
    "she'll",
    "she's",
    "should",
    "shouldn't",
    "so",
    "some",
    "such",
    "than",
    "that",
    "that's",
    "the",
    "their",
    "theirs",
    "them",
    "themselves",
    "then",
    "there",
    "there's",
    "these",
    "they",
    "they'd",
    "they'll",
    "they're",
    "they've",
    "this",
    "those",
    "through",
    "to",
    "too",
    "under",
    "until",
    "up",
    "very",
    "was",
    "wasn't",
    "we",
    "we'd",
    "we'll",
    "we're",
    "we've",
    "were",
    "weren't",
    "what",
    "what's",
    "when",
    "when's",
    "where",
    "where's",
    "which",
    "while",
    "who",
    "who's",
    "whom",
    "why",
    "why's",
    "with",
    "won't",
    "would",
    "wouldn't",
    "you",
    "you'd",
    "you'll",
    "you're",
    "you've",
    "your",
    "yours",
    "yourself",
    "yourselves",
    // Portuguese
    "de",
    "a",
    "o",
    "que",
    "e",
    "do",
    "da",
    "em",
    "um",
    "para",
    "é",
    "com",
    "não",
    "uma",
    "os",
    "no",
    "se",
    "na",
    "por",
    "mais",
    "as",
    "dos",
    "como",
    "mas",
    "foi",
    "ao",
    "ele",
    "das",
    "tem",
    "à",
    "seu",
    "sua",
    "ou",
    "ser",
    "quando",
    "muito",
    "nos",
    "já",
    "eu",
    "também",
    "só",
    "pelo",
    "pela",
    "até",
    "isso",
    "ela",
    "entre",
    "era",
    "depois",
    "sem",
    "mesmo",
    "aos",
    "ter",
    "seus",
    "quem",
    "nas",
    "me",
    "esse",
    "eles",
    "estão",
    "você",
    "tinha",
    "foram",
    "essa",
    "num",
    "nem",
    "suas",
    "meu",
    "às",
    "minha",
    "têm",
    "numa",
    "pelos",
    "elas",
    "havia",
    "seja",
    "qual",
    "será",
    "nós",
    "tenho",
    "lhe",
    "deles",
    "essas",
    "esses",
    "pelas",
    "este",
    "fosse",
    "dele",
    "tu",
    "te",
    "ti",
    "consigo",
]);

export function removeAccents(str: string): string {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
}

export function generateSlug(text: string, options: SlugOptions = {}): string {
    const {
        separator = "-",
        casing = "lowercase",
        removeNumbers = false,
        removeStopWords = false,
        removeAccents: shouldRemoveAccents = true,
        trim = true,
        maxLength = 0,
    } = options;

    if (!text) return "";

    let processed = text;

    if (shouldRemoveAccents) {
        processed = removeAccents(processed);
    }

    if (removeNumbers) {
        processed = processed.replace(/[0-9]/g, " ");
    }

    // Replace special symbols and punctuation with space, keeping alphanumeric characters
    processed = processed.replace(/[^a-zA-Z0-9\s_-]/g, " ");

    // Split into words
    let words = processed
        .trim()
        .split(/[\s_-]+/)
        .filter(Boolean);

    if (removeStopWords) {
        words = words.filter((w) => !STOP_WORDS.has(w.toLowerCase()));
    }

    if (words.length === 0) return "";

    // Apply casing
    words = words.map((w) => {
        if (casing === "lowercase") return w.toLowerCase();
        if (casing === "uppercase") return w.toUpperCase();
        if (casing === "title") {
            return w.charAt(0).toUpperCase() + w.slice(1).toLowerCase();
        }
        return w;
    });

    let slug = words.join(separator);

    if (trim && separator) {
        const escapedSep = separator.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
        slug = slug.replace(
            new RegExp(`^${escapedSep}+|${escapedSep}+$`, "g"),
            "",
        );
    }

    if (maxLength > 0 && slug.length > maxLength) {
        slug = slug.slice(0, maxLength);
        if (trim && separator) {
            const escapedSep = separator.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
            slug = slug.replace(new RegExp(`${escapedSep}+$`, "g"), "");
        }
    }

    return slug;
}
