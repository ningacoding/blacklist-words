import { Language, CheckProfanityResult } from '../types/types';
interface FilterConfig {
    languages?: Language[];
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
    constructor(config?: FilterConfig);
    private getRegex;
    private isFuzzyMatch;
    private isMergedMatch;
    private evaluateSeverity;
    isProfane(value: string): boolean;
    checkProfanityInSentence(text: string): CheckProfanityResult;
    checkProfanity(text: string): CheckProfanityResult;
}
export {};
//# sourceMappingURL=Filter.d.ts.map