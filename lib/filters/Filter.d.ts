import { Language } from "../types/types";
interface FilterConfig {
    languages?: Language[];
    similarityPercentage?: number;
    allLanguages?: boolean;
    caseSensitive?: boolean;
    wordBoundaries?: boolean;
    customWords?: string[];
    replaceWith?: string;
    severityLevels?: boolean;
    ignoreWords?: string[];
    logProfanity?: boolean;
}
export declare class Filter {
    private words;
    private caseSensitive;
    private wordBoundaries;
    private replaceWith?;
    private severityLevels;
    private ignoreWords;
    private logProfanity;
    private similarityPercentage;
    /**
     * similarityPercent: default 50 means 50% similarity
     * @param config
     */
    constructor(config?: FilterConfig);
    private getRegex;
    private isFuzzyMatch;
    private isMergedMatch;
    private evaluateSeverity;
    isProfane(value: string, customWords?: string[]): boolean;
    /**
     * This adds words on the fly,
     * this DOES NOT save/persists words
     * @param customWords
     */
    addWords(customWords?: string[]): void;
    evaluate(text: string, customWords?: string[]): {
        containsProfanity: boolean;
        profaneWords: string[];
        severityMap: {
            bestMatch: {
                target: string;
                rating: number;
            };
        }[];
        processedText: string;
    };
}
export {};
//# sourceMappingURL=Filter.d.ts.map