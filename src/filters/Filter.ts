import dictionary from "../data/dictionary";
import { Language, CheckProfanityResult } from "../types/types";
import Similar from "string-similarity";
import { stringSimilarity } from "string-similarity-js";

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

export class Filter {
  private words: Map<string, number>;
  private caseSensitive: boolean;
  private wordBoundaries: boolean;
  private replaceWith?: string;
  private severityLevels: boolean;
  private ignoreWords: Set<string>;
  private logProfanity: boolean;
  private similarityPercentage: number;

  /**
   * similarityPercent: default 50 means 50% similarity
   * @param config
   */
  constructor(config?: FilterConfig) {
    let words: string[] = [];
    this.similarityPercentage = config?.similarityPercentage || 50;
    this.caseSensitive = config?.caseSensitive ?? false;
    this.wordBoundaries = config?.wordBoundaries ?? true;
    this.replaceWith = config?.replaceWith;
    this.severityLevels = config?.severityLevels ?? false;
    this.ignoreWords = new Set(
      config?.ignoreWords?.map((word) => word.toLowerCase()) || [],
    );
    this.logProfanity = config?.logProfanity ?? false;

    if (config?.allLanguages) {
      for (const lang in dictionary) {
        if (dictionary.hasOwnProperty(lang)) {
          words = [...words, ...dictionary[lang as Language]];
        }
      }
    } else {
      const languages = config?.languages || ["none"];
      const languagesChecks = new Set<Language>(languages);
      if (languagesChecks.size !== 0) {
        languagesChecks.forEach((lang) => {
          words = [...words, ...dictionary[lang]];
        });
      }
    }

    if (config?.customWords) {
      words = [...words, ...config.customWords];
    }

    this.words = new Map(words.map((word) => [word.toLowerCase(), 1])); // Store words in lowercase
  }

  private getRegex(word: string): RegExp {
    const flags = this.caseSensitive ? "g" : "gi";
    const boundary = this.wordBoundaries ? "\\b" : "";
    return new RegExp(
      `${boundary}${word.replace(/(\W)/g, "\\$1")}${boundary}`,
      flags,
    );
  }

  private isFuzzyMatch(word: string, text: string): boolean {
    const pattern = `${word.split("").join("[^a-zA-Z]*")}`;
    const regex = new RegExp(pattern, this.caseSensitive ? "g" : "gi");
    return regex.test(text);
  }

  private isMergedMatch(word: string, text: string): boolean {
    const pattern = `${word}`;
    const regex = new RegExp(pattern, this.caseSensitive ? "g" : "gi");
    return regex.test(text);
  }

  private evaluateSeverity(word: string, text: string): number | undefined {
    if (this.getRegex(word).test(text)) {
      return 1; // Exact match
    } else if (this.isFuzzyMatch(word, text)) {
      return 2; // Fuzzy match
    } else if (this.isMergedMatch(word, text)) {
      return 3; // Merged word match
    }
    return undefined; // No match or irrelevant match
  }

  isProfane(value: string, customWords: string[] = []): boolean {
    const result = this.evaluate(value, customWords);
    return result.containsProfanity;
  }

  /**
   * This adds words on the fly,
   * this DOES NOT save/persists words
   * @param customWords
   */
  addWords(customWords: string[] = []) {
    const newWords: string[] = [
      ...Array.from(this.words.keys()),
      ...customWords,
    ];
    this.words = new Map(newWords.map((word) => [word.toLowerCase(), 1]));
  }

  evaluate(
    text: string,
    customWords: string[] = [],
  ): {
    percentageUsed: number;
    containsProfanity: boolean;
    profaneWords: string[];
    severityMap: { bestMatch: { target: string; rating: number } }[];
    processedText: string;
  } {
    const words = text.split(/\s+/);
    const profaneWords: string[] = [];
    const lengthTolerance = 1;
    const similarityPercentTolerance = this.similarityPercentage;
    const chars = {
      "@": "a",
      "4": "a",
      "3": "e",
      "1": "i",
      "0": "o",
    };
    const dictWords = [...customWords, ...this.words.keys()];

    const similarity: { bestMatch: { target: string; rating: number } }[] = [];

    for (const word of words) {
      const replacedNumbersWithLetters = word.replace(
        /[@4310]/g,
        (m) => chars[m],
      );
      const removedTildes = replacedNumbersWithLetters
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
      const matching = Similar.findBestMatch(removedTildes, dictWords);
      for (const dictWord of dictWords) {
        const similar = stringSimilarity(dictWord, removedTildes);
        if (
          !this.ignoreWords.has(dictWord.toLowerCase()) &&
          !!matching?.bestMatch &&
          similar > similarityPercentTolerance / 100 &&
          (dictWord.length > removedTildes.length - (lengthTolerance + 1) ||
            dictWord.length < removedTildes.length + (lengthTolerance + 1))
        ) {
          similarity.push(matching.bestMatch);
          profaneWords.push(word);
        }
      }
    }

    let processedText = text;
    if (this.replaceWith) {
      for (const word of profaneWords) {
        processedText = processedText.replace(
          new RegExp(word, "gi"),
          this.replaceWith,
        );
      }
    }

    return {
      percentageUsed: similarityPercentTolerance,
      containsProfanity: profaneWords.length > 0,
      profaneWords: Array.from(new Set(profaneWords)),
      processedText: this.replaceWith ? processedText : undefined,
      severityMap: similarity,
    };
  }
}
