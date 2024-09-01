export interface CheckProfanityResult {
    containsProfanity: boolean;
    profaneWords: string[];
    processedText?: string;
    severityMap?: {
        [word: string]: number;
    };
}
export type Language = "all" | "none" | "be" | "bg" | "ca" | "cs" | "cy" | "da" | "de" | "el" | "en" | "es" | "et" | "eu" | "fa" | "fi" | "fr" | "gd" | "gl" | "hi" | "hr" | "hu" | "hy" | "id" | "is" | "it" | "ja" | "kn" | "ko" | "la" | "lt" | "lv" | "mk" | "ml" | "mn" | "mr" | "ms" | "mt" | "my" | "nl" | "pl" | "pt" | "ro" | "ru" | "sk" | "sl" | "sq" | "sr" | "sv" | "te" | "th" | "tr" | "uk" | "uz" | "vi" | "zu";
//# sourceMappingURL=types.d.ts.map